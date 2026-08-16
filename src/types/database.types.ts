export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN_TENANT'
  | 'DIRETOR'
  | 'GERENTE'
  | 'COORDENADOR'
  | 'SUPERVISOR'
  | 'OPERADOR'
  | 'QUALIDADE'
  | 'PCP'
  | 'MANUTENCAO'
  | 'COMERCIAL'
  | 'FINANCEIRO'
  | 'AUDITOR'
  | 'CONSULTA'

export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELED'
export type UnitType = 'HEADQUARTERS' | 'MANUFACTURING_PLANT' | 'WAREHOUSE' | 'DISTRIBUTION_CENTER' | 'LABORATORY' | 'BRANCH_OFFICE'
export type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'APPROVAL' | 'REJECTION' | 'ELECTRONIC_SIGNATURE'
export type DocStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'OBSOLETE' | 'ARCHIVED'
export type NcSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type NcStatus = 'OPENED' | 'INVESTIGATION' | 'ACTION_PLAN' | 'EFFECTIVENESS_CHECK' | 'CLOSED' | 'CANCELLED'

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          legal_name: string | null
          document_number: string | null
          status: TenantStatus
          plan_tier: string
          settings: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          legal_name?: string | null
          document_number?: string | null
          status?: TenantStatus
          plan_tier?: string
          settings?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['tenants']['Insert']>
      }
      enterprise_units: {
        Row: {
          id: string
          tenant_id: string
          code: string
          name: string
          type: UnitType
          timezone: string
          address: Json
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          code: string
          name: string
          type?: UnitType
          timezone?: string
          address?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['enterprise_units']['Insert']>
      }
      user_profiles: {
        Row: {
          id: string
          tenant_id: string
          default_unit_id: string | null
          default_department_id: string | null
          role: UserRole
          full_name: string
          badge_number: string | null
          job_title: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          tenant_id: string
          default_unit_id?: string | null
          default_department_id?: string | null
          role?: UserRole
          full_name: string
          badge_number?: string | null
          job_title?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          tenant_id: string
          unit_id: string | null
          user_id: string | null
          table_name: string
          record_id: string
          action: AuditAction
          old_data: Json | null
          new_data: Json | null
          diff: Json | null
          reason: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          unit_id?: string | null
          user_id?: string | null
          table_name: string
          record_id: string
          action: AuditAction
          old_data?: Json | null
          new_data?: Json | null
          diff?: Json | null
          reason?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: never
      }
      qms_documents: {
        Row: {
          id: string
          tenant_id: string
          unit_id: string
          code: string
          title: string
          version: string
          category: string
          status: DocStatus
          content_url: string | null
          metadata: Json
          created_by: string
          reviewed_by: string | null
          approved_by: string | null
          effective_date: string | null
          review_due_date: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          unit_id: string
          code: string
          title: string
          version?: string
          category: string
          status?: DocStatus
          content_url?: string | null
          metadata?: Json
          created_by: string
          reviewed_by?: string | null
          approved_by?: string | null
          effective_date?: string | null
          review_due_date?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['qms_documents']['Insert']>
      }
      qms_non_conformances: {
        Row: {
          id: string
          tenant_id: string
          unit_id: string
          code: string
          title: string
          description: string
          source: string
          severity: NcSeverity
          status: NcStatus
          root_cause_analysis: Json
          containment_actions: string | null
          corrective_actions: Json
          responsible_user_id: string | null
          opened_by: string
          closed_by: string | null
          closed_at: string | null
          effectiveness_verified_by: string | null
          effectiveness_verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          unit_id: string
          code: string
          title: string
          description: string
          source: string
          severity?: NcSeverity
          status?: NcStatus
          root_cause_analysis?: Json
          containment_actions?: string | null
          corrective_actions?: Json
          responsible_user_id?: string | null
          opened_by: string
          closed_by?: string | null
          closed_at?: string | null
          effectiveness_verified_by?: string | null
          effectiveness_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['qms_non_conformances']['Insert']>
      }
      industrial_work_centers: {
        Row: {
          id: string
          tenant_id: string
          unit_id: string
          code: string
          name: string
          description: string | null
          capacity_hourly: number
          oee_target: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          unit_id: string
          code: string
          name: string
          description?: string | null
          capacity_hourly?: number
          oee_target?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['industrial_work_centers']['Insert']>
      }
      production_orders: {
        Row: {
          id: string
          tenant_id: string
          unit_id: string
          work_center_id: string | null
          code: string
          item_code: string
          item_description: string
          quantity_planned: number
          quantity_produced: number
          quantity_scrap: number
          status: string
          start_time: string | null
          end_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          unit_id: string
          work_center_id?: string | null
          code: string
          item_code: string
          item_description: string
          quantity_planned: number
          quantity_produced?: number
          quantity_scrap?: number
          status?: string
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['production_orders']['Insert']>
      }
    }
  }
}
