import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];

export class AuditTrailService {
  /**
   * Registra um evento de auditoria imutável (ISO 9001 / SGQ / 21 CFR Part 11)
   */
  static async logEvent(params: {
    tenantId: string;
    unitId?: string;
    tableName: string;
    recordId: string;
    action: Database['public']['Tables']['audit_logs']['Row']['action'];
    oldData?: Record<string, any>;
    newData?: Record<string, any>;
    reason?: string;
  }): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();

    const entry: AuditLogInsert = {
      tenant_id: params.tenantId,
      unit_id: params.unitId || null,
      user_id: userData.user?.id || null,
      table_name: params.tableName,
      record_id: params.recordId,
      action: params.action,
      old_data: params.oldData ? (params.oldData as any) : null,
      new_data: params.newData ? (params.newData as any) : null,
      diff: params.oldData && params.newData ? this.calculateDiff(params.oldData, params.newData) : null,
      reason: params.reason || null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    };

    const { error } = await supabase.from('audit_logs').insert(entry as any);

    if (error) {
      console.error('[AuditTrailService] Falha ao registrar log de auditoria:', error);
      throw new Error(`Audit logging failed: ${error.message}`);
    }
  }

  private static calculateDiff(oldObj: Record<string, any>, newObj: Record<string, any>): Record<string, any> {
    const diff: Record<string, { before: any; after: any }> = {};
    const allKeys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));

    for (const key of allKeys) {
      if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
        diff[key] = {
          before: oldObj[key],
          after: newObj[key],
        };
      }
    }

    return diff;
  }
}
