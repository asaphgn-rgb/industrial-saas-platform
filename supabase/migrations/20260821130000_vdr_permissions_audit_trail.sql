-- =============================================
-- TABELA: vdr_permissions (Permissoes granulares por pasta/usuario)
-- =============================================
CREATE TABLE IF NOT EXISTS vdr_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL DEFAULT 'tenant-industrial-demo-uuid',
    data_room VARCHAR(100) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    can_view BOOLEAN DEFAULT true,
    can_upload BOOLEAN DEFAULT true,
    can_request_delete BOOLEAN DEFAULT true,
    can_direct_delete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, data_room, user_email)
);

CREATE INDEX IF NOT EXISTS idx_vdr_permissions_tenant ON vdr_permissions(tenant_id, data_room);

ALTER TABLE vdr_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "vdr_permissions_select" ON vdr_permissions;
DROP POLICY IF EXISTS "vdr_permissions_insert" ON vdr_permissions;
DROP POLICY IF EXISTS "vdr_permissions_update" ON vdr_permissions;
DROP POLICY IF EXISTS "vdr_permissions_delete" ON vdr_permissions;
CREATE POLICY "vdr_permissions_select" ON vdr_permissions FOR SELECT USING (true);
CREATE POLICY "vdr_permissions_insert" ON vdr_permissions FOR INSERT WITH CHECK (true);
CREATE POLICY "vdr_permissions_update" ON vdr_permissions FOR UPDATE USING (true);
CREATE POLICY "vdr_permissions_delete" ON vdr_permissions FOR DELETE USING (true);

-- =============================================
-- Garantir que audit_trail existe (idempotente)
-- =============================================
CREATE TABLE IF NOT EXISTS audit_trail (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL DEFAULT 'tenant-industrial-demo-uuid',
    user_email VARCHAR(150) NOT NULL,
    user_name VARCHAR(150),
    user_role VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(100),
    target_id VARCHAR(255),
    target_name VARCHAR(255),
    details JSONB,
    ip_hint VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_trail_tenant ON audit_trail(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_trail_user ON audit_trail(user_email, created_at DESC);

ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_trail_select" ON audit_trail;
DROP POLICY IF EXISTS "audit_trail_insert" ON audit_trail;
CREATE POLICY "audit_trail_select" ON audit_trail FOR SELECT USING (true);
CREATE POLICY "audit_trail_insert" ON audit_trail FOR INSERT WITH CHECK (true);
-- Imutavel: sem UPDATE nem DELETE por politica (trilha imutavel)

-- =============================================
-- Garantir que vdr_users existe (idempotente)
-- =============================================
CREATE TABLE IF NOT EXISTS vdr_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL DEFAULT 'tenant-industrial-demo-uuid',
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    initials VARCHAR(10) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0
);

ALTER TABLE vdr_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "vdr_users_select" ON vdr_users;
DROP POLICY IF EXISTS "vdr_users_insert" ON vdr_users;
DROP POLICY IF EXISTS "vdr_users_update" ON vdr_users;
DROP POLICY IF EXISTS "vdr_users_delete" ON vdr_users;
CREATE POLICY "vdr_users_select" ON vdr_users FOR SELECT USING (true);
CREATE POLICY "vdr_users_insert" ON vdr_users FOR INSERT WITH CHECK (true);
CREATE POLICY "vdr_users_update" ON vdr_users FOR UPDATE USING (true);
CREATE POLICY "vdr_users_delete" ON vdr_users FOR DELETE USING (true);

INSERT INTO vdr_users (name, email, role, initials, password_hash, created_by) VALUES
  ('Direcao Executiva', 'ceo@flechabsb.com', 'Diretor (CEO)', 'CEO', 'ceovault', 'sistema'),
  ('Administrativo', 'adm@flechabsb.com', 'Gestao & Backoffice', 'ADM', 'adminvault', 'sistema'),
  ('Juridico', 'juridico@flechabsb.com', 'Compliance & Contratos', 'JUR', 'legalvault', 'sistema'),
  ('Socio', 'socio@flechabsb.com', 'Auditoria & Investimentos', 'SOC', 'auditvault', 'sistema'),
  ('Operacoes', 'operacional@flechabsb.com', 'Campo & Tecnico', 'OPS', 'opsvault', 'sistema')
ON CONFLICT (email) DO NOTHING;
