-- Migração para Tabela Real de Documentos do Dossiê na Nuvem

CREATE TABLE IF NOT EXISTS b2b_documents (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    upload_date DATE NOT NULL,
    issuing_authority VARCHAR(100),
    regulatory_analysis TEXT,
    resolution_action TEXT,
    file_data TEXT, -- Base64 do arquivo
    file_type VARCHAR(50),
    uploader_name VARCHAR(100),
    uploader_role VARCHAR(100),
    uploader_email VARCHAR(100),
    deletion_requested BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ativa o RLS
ALTER TABLE b2b_documents ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Leitura de documentos do tenant"
ON b2b_documents FOR SELECT
USING (tenant_id = 'tenant-industrial-demo-uuid'::uuid);

CREATE POLICY "Inserção de documentos no tenant"
ON b2b_documents FOR INSERT
WITH CHECK (tenant_id = 'tenant-industrial-demo-uuid'::uuid);

CREATE POLICY "Atualização de documentos do tenant"
ON b2b_documents FOR UPDATE
USING (tenant_id = 'tenant-industrial-demo-uuid'::uuid);

CREATE POLICY "Exclusão de documentos do tenant"
ON b2b_documents FOR DELETE
USING (tenant_id = 'tenant-industrial-demo-uuid'::uuid);
