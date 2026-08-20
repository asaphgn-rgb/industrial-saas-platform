import { supabase } from '../lib/supabase';
import { AuditTrailService } from './audit-trail.service';
import type { Database } from '../types/database.types';
import type {
  CreateQmsDocumentInput,
  ApproveDocumentInput,
  DocumentRevisionRecord,
  DocumentStatus,
} from '../types/qms-document.types';

type QmsDocumentRow = Database['public']['Tables']['qms_documents']['Row'];

export class QmsDocumentService {
  /**
   * 1. Criar novo Documento SGQ em estado de Rascunho (Cláusula 7.5.2)
   */
  static async createDocument(input: CreateQmsDocumentInput): Promise<QmsDocumentRow> {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || '00000000-0000-0000-0000-000000000000';

    const initialRevision: DocumentRevisionRecord = {
      version: input.initialVersion,
      summaryOfChanges: input.summaryOfChanges,
      authorUserId: userId,
      effectiveDate: input.effectiveDate,
      reviewDueDate: input.reviewDueDate,
    };

    const newRecord = {
      tenant_id: input.tenantId,
      unit_id: input.unitId,
      code: input.code,
      title: input.title,
      version: input.initialVersion,
      category: input.category,
      status: 'DRAFT' as const,
      content_url: input.contentUrl || null,
      metadata: {
        revisions: [initialRevision],
      },
      created_by: userId,
      effective_date: input.effectiveDate,
      review_due_date: input.reviewDueDate,
    };

    const { data, error } = await supabase
      .from('qms_documents')
      .insert(newRecord as never)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao criar Documento SGQ: ${error?.message || 'Dados inválidos'}`);
    }

    const row = data as unknown as QmsDocumentRow;

    // Trilha de Auditoria Imutável (ISO 9001)
    await AuditTrailService.logEvent({
      tenantId: row.tenant_id,
      unitId: row.unit_id,
      tableName: 'qms_documents',
      recordId: row.id,
      action: 'INSERT',
      newData: row as never,
      reason: `Criação de documento SGQ (${row.code} v${row.version}): ${input.reasonForCreation}`,
    });

    return row;
  }

  /**
   * 2. Submeter Documento para Revisão por Pares
   */
  static async submitForReview(params: {
    documentId: string;
    tenantId: string;
    reviewerUserId: string;
    reason: string;
  }): Promise<QmsDocumentRow> {
    const { data: currentDoc, error: fetchError } = await supabase
      .from('qms_documents')
      .select('*')
      .eq('id', params.documentId)
      .single();

    if (fetchError || !currentDoc) {
      throw new Error(`Documento não encontrado: ${fetchError?.message}`);
    }

    const { data, error } = await supabase
      .from('qms_documents')
      .update({ /* @ts-ignore */ 
        /* @ts-ignore */
status: 'UNDER_REVIEW' as const,
        reviewed_by: params.reviewerUserId,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', params.documentId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao submeter documento para revisão: ${error?.message}`);
    }

    const row = data as unknown as QmsDocumentRow;

    await AuditTrailService.logEvent({
      tenantId: params.tenantId,
      tableName: 'qms_documents',
      recordId: params.documentId,
      action: 'STATUS_CHANGE',
      oldData: currentDoc as never,
      newData: row as never,
      reason: `Submissão para Revisão: ${params.reason}`,
    } as never);

    return row;
  }

  /**
   * 3. Aprovação Formal com Assinatura Eletrônica e Publicação (Cláusula 7.5.3)
   */
  static async approveAndPublish(input: ApproveDocumentInput): Promise<QmsDocumentRow> {
    const { data: currentDoc, error: fetchError } = await supabase
      .from('qms_documents')
      .select('*')
      .eq('id', input.documentId)
      .single();

    if (fetchError || !currentDoc) {
      throw new Error(`Documento não encontrado: ${fetchError?.message}`);
    }

    const { data, error } = await supabase
      .from('qms_documents')
      .update({ /* @ts-ignore */ 
        /* @ts-ignore */
status: 'APPROVED' as const,
        approved_by: input.approverUserId,
        effective_date: input.effectiveDate,
        review_due_date: input.nextReviewDate,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', input.documentId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao aprovar documento: ${error?.message}`);
    }

    const row = data as unknown as QmsDocumentRow;

    await AuditTrailService.logEvent({
      tenantId: input.tenantId,
      tableName: 'qms_documents',
      recordId: input.documentId,
      action: 'APPROVAL',
      oldData: currentDoc as never,
      newData: row as never,
      reason: `Aprovação Formal SGQ (v${row.version} as never): ${input.comments}`,
    });

    return row;
  }

  /**
   * 4. Listagem de Documentos por Tenant
   */
  static async listByTenant(tenantId: string): Promise<QmsDocumentRow[]> {
    const { data, error } = await supabase
      .from('qms_documents')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('code', { ascending: true });

    if (error) {
      throw new Error(`Erro ao listar documentos: ${error.message}`);
    }

    return (data as unknown as QmsDocumentRow[]) || [];
  }
}
