import { supabase } from '../lib/supabase';
import { AuditTrailService } from './audit-trail.service';
import type { Database } from '../types/database.types';

type NonConformanceInsert = Database['public']['Tables']['qms_non_conformances']['Insert'];
type NonConformanceRow = Database['public']['Tables']['qms_non_conformances']['Row'];

export class QmsService {
  /**
   * Abre uma nova Não Conformidade com registro obrigatório de auditoria
   */
  static async openNonConformance(
    payload: Omit<NonConformanceInsert, 'opened_by' | 'created_at' | 'updated_at'>,
    reason: string
  ): Promise<NonConformanceRow> {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error('Usuário não autenticado para abrir Não Conformidade.');
    }

    const newRecord: NonConformanceInsert = {
      ...payload,
      opened_by: userData.user.id,
      status: 'OPENED',
    };

    const { data, error } = await supabase
      .from('qms_non_conformances')
      .insert(newRecord as any)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao registrar Não Conformidade: ${error?.message}`);
    }

    const row = data as unknown as NonConformanceRow;

    // Registrar na trilha de auditoria imutável
    await AuditTrailService.logEvent({
      tenantId: row.tenant_id,
      unitId: row.unit_id,
      tableName: 'qms_non_conformances',
      recordId: row.id,
      action: 'INSERT',
      newData: row,
      reason,
    });

    return row;
  }

  /**
   * Lista Não Conformidades do Tenant autenticado
   */
  static async listNonConformances(tenantId: string): Promise<NonConformanceRow[]> {
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
