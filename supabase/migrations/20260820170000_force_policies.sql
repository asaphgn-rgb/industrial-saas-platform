-- Injeção Forçada de Políticas Ignorando Erros (RLS Bancário)
-- TABELAS (Caso ainda estejam corrompidas)
CREATE TABLE IF NOT EXISTS vdr_access_control (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    data_room_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, data_room_name, user_email)
);

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
    file_data TEXT, 
    file_type VARCHAR(50),
    is_too_large BOOLEAN DEFAULT false,
    uploader_name VARCHAR(100),
    uploader_role VARCHAR(100),
    uploader_email VARCHAR(100),
    deletion_requested BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('vdr_secure_files', 'vdr_secure_files', false) ON CONFLICT DO NOTHING;

-- DESTRUIÇÃO DE POLÍTICAS QUEBRADAS
DROP POLICY IF EXISTS "Leitura livre para usuarios app" ON storage.objects;
DROP POLICY IF EXISTS "Upload livre para usuarios app" ON storage.objects;
DROP POLICY IF EXISTS "Delecao livre para usuarios app" ON storage.objects;
DROP POLICY IF EXISTS "b2b_docs_select" ON b2b_documents;
DROP POLICY IF EXISTS "b2b_docs_insert" ON b2b_documents;
DROP POLICY IF EXISTS "b2b_docs_update" ON b2b_documents;
DROP POLICY IF EXISTS "b2b_docs_delete" ON b2b_documents;
DROP POLICY IF EXISTS "vdr_access_select" ON vdr_access_control;
DROP POLICY IF EXISTS "vdr_access_insert" ON vdr_access_control;
DROP POLICY IF EXISTS "vdr_access_update" ON vdr_access_control;
DROP POLICY IF EXISTS "vdr_access_delete" ON vdr_access_control;

-- RECRIAR POLÍTICAS CORRETAS (SEM TRADUTOR CHROMIUM NO MEIO)
ALTER TABLE b2b_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "b2b_docs_select" ON b2b_documents FOR SELECT USING (true);
CREATE POLICY "b2b_docs_insert" ON b2b_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "b2b_docs_update" ON b2b_documents FOR UPDATE USING (true);
CREATE POLICY "b2b_docs_delete" ON b2b_documents FOR DELETE USING (true);

ALTER TABLE vdr_access_control ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vdr_access_select" ON vdr_access_control FOR SELECT USING (true);
CREATE POLICY "vdr_access_insert" ON vdr_access_control FOR INSERT WITH CHECK (true);
CREATE POLICY "vdr_access_update" ON vdr_access_control FOR UPDATE USING (true);
CREATE POLICY "vdr_access_delete" ON vdr_access_control FOR DELETE USING (true);

CREATE POLICY "Leitura livre para usuarios app" ON storage.objects FOR SELECT USING (bucket_id = 'vdr_secure_files');
CREATE POLICY "Upload livre para usuarios app" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vdr_secure_files');
CREATE POLICY "Delecao livre para usuarios app" ON storage.objects FOR DELETE USING (bucket_id = 'vdr_secure_files');
