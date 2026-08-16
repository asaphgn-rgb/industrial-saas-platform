-- ==============================================================================
-- MIGRATION: 20260815000001_initial_multi_tenant_schema.sql
-- DESCRIÇÃO: Fundação Multi-Tenant, Estrutura Organizacional e Gestão de Usuários
-- COMPATIBILIDADE: ISO 9001 / SGQ / Arquitetura Industrial ISA-95
-- ==============================================================================

-- 1. Extensões Essenciais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerações Corporativas e Industriais
CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN',
    'ADMIN_TENANT',
    'DIRETOR',
    'GERENTE',
    'COORDENADOR',
    'SUPERVISOR',
    'OPERADOR',
    'QUALIDADE',
    'PCP',
    'MANUTENCAO',
    'COMERCIAL',
    'FINANCEIRO',
    'AUDITOR',
    'CONSULTA'
);

CREATE TYPE tenant_status AS ENUM ('ACTIVE', 'SUSPENDED', 'TRIAL', 'CANCELED');
CREATE TYPE unit_type AS ENUM ('HEADQUARTERS', 'MANUFACTURING_PLANT', 'WAREHOUSE', 'DISTRIBUTION_CENTER', 'LABORATORY', 'BRANCH_OFFICE');

-- 3. Tabela de Tenants (Organizações Principais / Grupos Industriais)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    document_number VARCHAR(30) UNIQUE, -- CNPJ / Tax ID
    status tenant_status NOT NULL DEFAULT 'ACTIVE',
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE',
    settings JSONB NOT NULL DEFAULT '{"max_users": 100, "features": ["qms", "mes", "maintenance", "pcp"]}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 4. Tabela de Unidades Industriais / Plantas / Centros de Custo (ISA-95 Level 3/4)
CREATE TABLE enterprise_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type unit_type NOT NULL DEFAULT 'MANUFACTURING_PLANT',
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/Sao_Paulo',
    address JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uk_tenant_unit_code UNIQUE (tenant_id, code)
);

-- 5. Tabela de Departamentos / Setores
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES enterprise_units(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_tenant_dept_code UNIQUE (tenant_id, unit_id, code)
);

-- 6. Tabela de Perfis de Usuário (Integrada ao auth.users do Supabase)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    default_unit_id UUID REFERENCES enterprise_units(id) ON DELETE SET NULL,
    default_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    role user_role NOT NULL DEFAULT 'CONSULTA',
    full_name VARCHAR(255) NOT NULL,
    badge_number VARCHAR(50), -- Crachá / Matrícula Industrial
    job_title VARCHAR(150),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 7. Tabela de Permissões Granulares (RBAC / Matriz de Acesso)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);

-- 8. Tabela de Vinculação Perfil/Role -> Permissões
CREATE TABLE role_permissions (
    role user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- 9. Índices para Otimização de Performance e Queries Multi-Tenant
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_enterprise_units_tenant ON enterprise_units(tenant_id);
CREATE INDEX idx_departments_tenant ON departments(tenant_id);
CREATE INDEX idx_departments_unit ON departments(unit_id);
CREATE INDEX idx_user_profiles_tenant ON user_profiles(tenant_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- 10. Funções Utilitárias de Contexto e Segurança Multi-Tenant
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT tenant_id
        FROM user_profiles
        WHERE id = auth.uid()
        AND is_active = TRUE
        AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role
        FROM user_profiles
        WHERE id = auth.uid()
        AND is_active = TRUE
        AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 11. Triggers para Atualização Automática de 'updated_at'
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_tenants
BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_units
BEFORE UPDATE ON enterprise_units
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_departments
BEFORE UPDATE ON departments
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_user_profiles
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
