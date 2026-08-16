-- ==============================================================================
-- MIGRATION: 20260815000002_qms_audit_and_rls.sql
-- DESCRIÇÃO: Sistema de Gestão da Qualidade (SGQ/ISO 9001), Trilha de Auditoria Imutável e RLS
-- ==============================================================================

-- 1. Enumerações para SGQ e Produção
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'APPROVAL', 'REJECTION', 'ELECTRONIC_SIGNATURE');
CREATE TYPE doc_status AS ENUM ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'OBSOLETE', 'ARCHIVED');
CREATE TYPE nc_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE nc_status AS ENUM ('OPENED', 'INVESTIGATION', 'ACTION_PLAN', 'EFFECTIVENESS_CHECK', 'CLOSED', 'CANCELLED');

-- 2. Trilha de Auditoria Imutável (Audit Trail - Requisito ISO 9001 / 21 CFR Part 11)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    unit_id UUID REFERENCES enterprise_units(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action audit_action NOT NULL,
    old_data JSONB,
    new_data JSONB,
    diff JSONB,
    reason TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Impedir modificação ou exclusão de logs de auditoria (Imutabilidade estrita)
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are immutable. UPDATE or DELETE operations are strictly forbidden.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_audit_log_immutability
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

-- 3. Módulo SGQ: Controle de Documentos (Cláusula 7.5 ISO 9001)
CREATE TABLE qms_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    unit_id UUID REFERENCES enterprise_units(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    category VARCHAR(50) NOT NULL, -- Procedimento, Instrução de Trabalho, Manual, Política
    status doc_status NOT NULL DEFAULT 'DRAFT',
    content_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    reviewed_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    effective_date DATE,
    review_due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uk_tenant_doc_code_version UNIQUE (tenant_id, code, version)
);

-- 4. Módulo SGQ: Não Conformidades e CAPA (Cláusulas 8.7 e 10.2 ISO 9001)
CREATE TABLE qms_non_conformances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES enterprise_units(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source VARCHAR(50) NOT NULL, -- Auditoria Interna, Reclamação de Cliente, Processo, Fornecedor
    severity nc_severity NOT NULL DEFAULT 'MEDIUM',
    status nc_status NOT NULL DEFAULT 'OPENED',
    root_cause_analysis JSONB DEFAULT '{"methodology": "5_WHYS", "causes": []}'::jsonb,
    containment_actions TEXT,
    corrective_actions JSONB DEFAULT '[]'::jsonb,
    responsible_user_id UUID REFERENCES auth.users(id),
    opened_by UUID NOT NULL REFERENCES auth.users(id),
    closed_by UUID REFERENCES auth.users(id),
    closed_at TIMESTAMPTZ,
    effectiveness_verified_by UUID REFERENCES auth.users(id),
    effectiveness_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_tenant_nc_code UNIQUE (tenant_id, code)
);

-- 5. Módulo Industrial: Linhas de Produção / Células de Trabalho (ISA-95 Work Centers)
CREATE TABLE industrial_work_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES enterprise_units(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    capacity_hourly NUMERIC(12, 4) NOT NULL DEFAULT 0,
    oee_target NUMERIC(5, 2) NOT NULL DEFAULT 85.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_tenant_workcenter_code UNIQUE (tenant_id, code)
);

-- 6. Módulo Industrial: Ordens de Produção (ISA-95 Production Orders)
CREATE TABLE production_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES enterprise_units(id) ON DELETE RESTRICT,
    work_center_id UUID REFERENCES industrial_work_centers(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL,
    item_code VARCHAR(100) NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    quantity_planned NUMERIC(14, 4) NOT NULL,
    quantity_produced NUMERIC(14, 4) NOT NULL DEFAULT 0,
    quantity_scrap NUMERIC(14, 4) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PLANNED', -- PLANNED, IN_PROGRESS, COMPLETED, SUSPENDED, CANCELLED
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_tenant_po_code UNIQUE (tenant_id, code)
);

-- 7. Índices
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_qms_docs_tenant ON qms_documents(tenant_id);
CREATE INDEX idx_qms_nc_tenant ON qms_non_conformances(tenant_id);
CREATE INDEX idx_work_centers_tenant ON industrial_work_centers(tenant_id);
CREATE INDEX idx_production_orders_tenant ON production_orders(tenant_id);

-- ==============================================================================
-- 8. POLÍTICAS DE ROW LEVEL SECURITY (RLS) - ISOLAMENTO MULTI-TENANT RIGOROSO
-- ==============================================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qms_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE qms_non_conformances ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial_work_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;

-- 8.1. Políticas de Tenants
CREATE POLICY tenant_isolation_policy ON tenants
FOR SELECT
USING (
    id = get_current_tenant_id() OR get_current_user_role() = 'SUPER_ADMIN'
);

-- 8.2. Políticas de Unidades
CREATE POLICY unit_isolation_select ON enterprise_units
FOR SELECT USING (tenant_id = get_current_tenant_id() OR get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY unit_isolation_manage ON enterprise_units
FOR ALL USING (
    (tenant_id = get_current_tenant_id() AND get_current_user_role() IN ('ADMIN_TENANT', 'DIRETOR'))
    OR get_current_user_role() = 'SUPER_ADMIN'
);

-- 8.3. Políticas de Departamentos
CREATE POLICY dept_isolation_select ON departments
FOR SELECT USING (tenant_id = get_current_tenant_id() OR get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY dept_isolation_manage ON departments
FOR ALL USING (
    (tenant_id = get_current_tenant_id() AND get_current_user_role() IN ('ADMIN_TENANT', 'DIRETOR', 'GERENTE'))
    OR get_current_user_role() = 'SUPER_ADMIN'
);

-- 8.4. Políticas de Perfis de Usuário
CREATE POLICY user_profiles_select ON user_profiles
FOR SELECT USING (tenant_id = get_current_tenant_id() OR get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY user_profiles_update_self ON user_profiles
FOR UPDATE USING (id = auth.uid());

CREATE POLICY user_profiles_admin_manage ON user_profiles
FOR ALL USING (
    (tenant_id = get_current_tenant_id() AND get_current_user_role() IN ('ADMIN_TENANT', 'DIRETOR'))
    OR get_current_user_role() = 'SUPER_ADMIN'
);

-- 8.5. Políticas de Auditoria (Leitura restrita a Auditores/Admins do mesmo Tenant; Inserção automática)
CREATE POLICY audit_logs_select ON audit_logs
FOR SELECT USING (
    (tenant_id = get_current_tenant_id() AND get_current_user_role() IN ('SUPER_ADMIN', 'ADMIN_TENANT', 'DIRETOR', 'AUDITOR', 'QUALIDADE'))
    OR get_current_user_role() = 'SUPER_ADMIN'
);

CREATE POLICY audit_logs_insert ON audit_logs
FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() OR get_current_user_role() = 'SUPER_ADMIN'
);

-- 8.6. Políticas de Documentos SGQ
CREATE POLICY qms_docs_select ON qms_documents
FOR SELECT USING (tenant_id = get_current_tenant_id() OR get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY qms_docs_manage ON qms_documents
FOR ALL USING (
    (tenant_id = get_current_tenant_id() AND get_current_user_role() IN ('ADMIN_TENANT', 'DIRETOR', 'GERENTE', 'QUALIDADE', 'AUDITOR'))
    OR get_current_user_role() = 'SUPER_ADMIN'
);

-- 8.7. Políticas de Não Conformidades
CREATE POLICY qms_nc_select ON qms_non_conformances
FOR SELECT USING (tenant_id = get_current_tenant_id() OR get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY qms_nc_manage ON qms_non_conformances
FOR ALL USING (
    (tenant_id = get_current_tenant_id() AND get_current_user_role() IN ('ADMIN_TENANT', 'DIRETOR', 'GERENTE', 'COORDENADOR', 'SUPERVISOR', 'QUALIDADE', 'AUDITOR'))
    OR get_current_user_role() = 'SUPER_ADMIN'
);

-- 8.8. Políticas de Centros de Trabalho e Ordens de Produção
CREATE POLICY work_centers_policy ON industrial_work_centers
FOR ALL USING (tenant_id = get_current_tenant_id() OR get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY production_orders_policy ON production_orders
FOR ALL USING (tenant_id = get_current_tenant_id() OR get_current_user_role() = 'SUPER_ADMIN');
