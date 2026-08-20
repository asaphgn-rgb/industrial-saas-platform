-- Migração para Tabelas Reais do Dossiê B2B na Nuvem
-- tenant_id é VARCHAR porque o demo usa string 'tenant-industrial-demo-uuid' (não UUID real)

-- =============================================
-- TABELA 1: b2b_documents (Documentos do Cofre)
-- =============================================
CREATE TABLE IF NOT EXISTS b2b_documents (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    upload_date DATE NOT NULL,
    issuing_authority VARCHAR(100),
    regulatory_analysis TEXT,
    resolution_action TEXT,
    file_data TEXT, -- Base64 do arquivo (até ~2MB)
    file_type VARCHAR(50),
    is_too_large BOOLEAN DEFAULT false,
    uploader_name VARCHAR(100),
    uploader_role VARCHAR(100),
    uploader_email VARCHAR(100),
    deletion_requested BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para busca por tenant
CREATE INDEX IF NOT EXISTS idx_b2b_documents_tenant ON b2b_documents(tenant_id);

-- Ativa o RLS
ALTER TABLE b2b_documents ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (permissivas para o tenant demo)
CREATE POLICY "b2b_docs_select" ON b2b_documents FOR SELECT USING (true);
CREATE POLICY "b2b_docs_insert" ON b2b_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "b2b_docs_update" ON b2b_documents FOR UPDATE USING (true);
CREATE POLICY "b2b_docs_delete" ON b2b_documents FOR DELETE USING (true);

-- =============================================
-- TABELA 2: vdr_access_control (RBAC por Data Room)
-- =============================================
CREATE TABLE IF NOT EXISTS vdr_access_control (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    data_room_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, data_room_name, user_email)
);

-- Índice para busca rápida de RBAC
CREATE INDEX IF NOT EXISTS idx_vdr_access_tenant ON vdr_access_control(tenant_id, data_room_name);

-- Ativa o RLS
ALTER TABLE vdr_access_control ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "vdr_access_select" ON vdr_access_control FOR SELECT USING (true);
CREATE POLICY "vdr_access_insert" ON vdr_access_control FOR INSERT WITH CHECK (true);
CREATE POLICY "vdr_access_update" ON vdr_access_control FOR UPDATE USING (true);
CREATE POLICY "vdr_access_delete" ON vdr_access_control FOR DELETE USING (true);
