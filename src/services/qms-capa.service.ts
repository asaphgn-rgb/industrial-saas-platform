import { supabase } from '../lib/supabase';
import { AuditTrailService } from './audit-trail.service';
import type { Database } from '../types/database.types';
import type {
  CreateNonConformanceInput,
  RootCauseAnalysis,
  ActionPlan5W2HItem,
  EffectivenessCheck,
  NcStatus,
} from '../types/qms-capa.types';

type NonConformanceRow = Database['public']['Tables']['qms_non_conformances']['Row'];

export class QmsCapaService {
  /**
   * 1. Abertura de Não Conformidade com Ação Imediata de Contenção (Cláusula 8.7)
   */
  static async openNonConformance(input: CreateNonConformanceInput): Promise<NonConformanceRow> {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || '00000000-0000-0000-0000-000000000000';

    const newRecord = {
      tenant_id: input.tenantId,
      unit_id: input.unitId,
      code: input.code,
      title: input.title,
      description: input.description,
      source: input.source,
      severity: input.severity,
      status: 'OPENED' as const,
      containment_actions: input.containmentActions || null,
      responsible_user_id: input.responsibleUserId || null,
      opened_by: userId,
      root_cause_analysis: { methodology: '5_WHYS', causes: [] },
      corrective_actions: [],
    };

    const { data, error } = await supabase
      .from('qms_non_conformances')
      .insert(newRecord as never)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao abrir Não Conformidade: ${error?.message || 'Dados inválidos'}`);
    }

    const row = data as unknown as NonConformanceRow;

    // Trilha de Auditoria Imutável (ISO 9001)
    await AuditTrailService.logEvent({
      tenantId: row.tenant_id,
      unitId: row.unit_id,
      tableName: 'qms_non_conformances',
      recordId: row.id,
      action: 'INSERT',
      newData: row as never,
      reason: input.reasonForOpening,
    });

    return row;
  }

  /**
   * 2. Registro da Análise de Causa Raiz (5 Porquês / Ishikawa 6M)
   */
  static async submitRootCauseAnalysis(params: {
    ncId: string;
    tenantId: string;
    analysis: RootCauseAnalysis;
    reason: string;
  }): Promise<NonConformanceRow> {
    const { data: currentRecord, error: fetchError } = await supabase
      .from('qms_non_conformances')
      .select('*')
      .eq('id', params.ncId)
      .single();

    if (fetchError || !currentRecord) {
      throw new Error(`Não Conformidade não encontrada: ${fetchError?.message}`);
    }

    const updatedStatus: NcStatus = 'ACTION_PLAN';
    const updatePayload = {
      root_cause_analysis: params.analysis as never,
      status: updatedStatus,
    };

    const { data, error } = await supabase
      .from('qms_non_conformances')
      .update(updatePayload as never)
      .eq('id', params.ncId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao salvar Análise de Causa Raiz: ${error?.message}`);
    }

    const row = data as unknown as NonConformanceRow;

    await AuditTrailService.logEvent({
      tenantId: params.tenantId,
      tableName: 'qms_non_conformances',
      recordId: params.ncId,
      action: 'UPDATE',
      oldData: currentRecord as never,
      newData: row as never,
      reason: `Análise de Causa Raiz (${params.analysis.methodology}): ${params.reason}`,
    });

    return row;
  }

  /**
   * 3. Atualização do Plano de Ação Corretiva 5W2H (CAPA)
   */
  static async updateActionPlan(params: {
    ncId: string;
    tenantId: string;
    actions: ActionPlan5W2HItem[];
    reason: string;
  }): Promise<NonConformanceRow> {
    const { data: currentRecord } = await supabase
      .from('qms_non_conformances')
      .select('*')
      .eq('id', params.ncId)
      .single();

    const allCompleted = params.actions.length > 0 && params.actions.every(a => a.status === 'COMPLETED');
    const updatedStatus: NcStatus = allCompleted ? 'EFFECTIVENESS_CHECK' : 'ACTION_PLAN';

    const { data, error } = await supabase
      .from('qms_non_conformances')
      .update({ /* @ts-ignore */ 
        /* @ts-ignore */
/* @ts-ignore */
        corrective_actions: params.actions as never,
        status: updatedStatus,
      } as never)
      .eq('id', params.ncId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao atualizar Plano de Ação 5W2H: ${error?.message}`);
    }

    const row = data as unknown as NonConformanceRow;

    await AuditTrailService.logEvent({
      tenantId: params.tenantId,
      tableName: 'qms_non_conformances',
      recordId: params.ncId,
      action: 'UPDATE',
      oldData: currentRecord as never,
      newData: row as never,
      reason: `Atualização de Plano de Ação 5W2H: ${params.reason}`,
    } as never);

    return row;
  }

  /**
   * 4. Verificação de Eficácia e Fechamento da Não Conformidade (Cláusula 10.2)
   */
  static async closeWithEffectivenessCheck(params: {
    ncId: string;
    tenantId: string;
    check: EffectivenessCheck;
    reason: string;
  }): Promise<NonConformanceRow> {
    const { data: userData } = await supabase.auth.getUser();
    const verifierId = userData.user?.id || params.check.verifiedBy;

    const { data: currentRecord } = await supabase
      .from('qms_non_conformances')
      .select('*')
      .eq('id', params.ncId)
      .single();

    const now = new Date().toISOString();
    const finalStatus: NcStatus = params.check.isEffective ? 'CLOSED' : 'INVESTIGATION';

    const updatePayload: Partial<NonConformanceRow> = {
      status: finalStatus as never,
      closed_by: params.check.isEffective ? verifierId : null,
      closed_at: params.check.isEffective ? now : null,
      effectiveness_verified_by: verifierId,
      effectiveness_verified_at: now,
    };

    const { data, error } = await supabase
      .from('qms_non_conformances')
      .update(updatePayload as never)
      .eq('id', params.ncId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao finalizar Verificação de Eficácia: ${error?.message}`);
    }

    const row = data as unknown as NonConformanceRow;

    await AuditTrailService.logEvent({
      tenantId: params.tenantId,
      tableName: 'qms_non_conformances',
      recordId: params.ncId,
      action: params.check.isEffective ? 'APPROVAL' : 'REJECTION',
      oldData: currentRecord as never,
      newData: {
        ...row,
        effectiveness_check_details: params.check,
      } as never,
      reason: `Verificação de Eficácia (Eficaz: ${params.check.isEffective ? 'SIM' : 'NÃO'}): ${params.reason}`,
    });

    return row;
  }

  /**
   * 5. Consulta e Listagem com Filtros
   */
  static async listByTenant(tenantId: string): Promise<NonConformanceRow[]> {
    const { data, error } = await supabase
      .from('qms_non_conformances')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao listar Não Conformidades: ${error.message}`);
    }

    return (data as unknown as NonConformanceRow[]) || [];
  }
}
