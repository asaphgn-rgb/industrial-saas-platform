-- Migration 03: Pastas Digitais e Documentos (Fase 9 e 10)

-- Tabela de Consentimentos LGPD
CREATE TABLE consentimentos_lgpd (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    associado_id UUID REFERENCES associados(id) ON DELETE CASCADE,
    tipo VARCHAR(100) NOT NULL, -- Ex: 'TRATAMENTO_DADOS', 'CONSULTA_CREDITO'
    versao_termo VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    revogado BOOLEAN DEFAULT FALSE,
    data_aceite TIMESTAMPTZ DEFAULT NOW(),
    data_revogacao TIMESTAMPTZ
);

-- Tabela de Documentos
CREATE TYPE status_documento AS ENUM ('PENDENTE', 'ENVIADO', 'EM_ANALISE', 'APROVADO', 'REPROVADO', 'ILEGIVEL');

CREATE TABLE documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    associado_id UUID REFERENCES associados(id) ON DELETE CASCADE,
    federacao_id UUID REFERENCES federacoes(id) ON DELETE CASCADE,
    associacao_id UUID REFERENCES associacoes(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(100) NOT NULL, -- Ex: 'RG_CNH', 'COMPROVANTE_RENDA'
    nome_original VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    tamanho_bytes BIGINT NOT NULL,
    hash_sha256 VARCHAR(64),
    status status_documento DEFAULT 'ENVIADO',
    observacao_admin TEXT,
    created_by UUID REFERENCES auth.users(id),
    validated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE consentimentos_lgpd ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Policies Consentimentos (Só o dono pode ver, Admin Global vê todos)
CREATE POLICY "Associado ve seu proprio consentimento" 
ON consentimentos_lgpd FOR SELECT 
USING (associado_id = (SELECT id FROM associados WHERE user_id = auth.uid()));

CREATE POLICY "Admin Global ve todos consentimentos" 
ON consentimentos_lgpd FOR ALL 
USING (auth_user_role() = 'ADMIN_GLOBAL');

-- Policies Documentos
CREATE POLICY "Associado ve seus documentos" 
ON documentos FOR SELECT 
USING (associado_id = (SELECT id FROM associados WHERE user_id = auth.uid()));

CREATE POLICY "Admin Global ve e gerencia todos documentos" 
ON documentos FOR ALL 
USING (auth_user_role() = 'ADMIN_GLOBAL');

CREATE POLICY "Associacao ve documentos dos seus associados" 
ON documentos FOR SELECT 
USING (associacao_id = (SELECT associacao_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Federacao ve documentos de sua arvore" 
ON documentos FOR SELECT 
USING (federacao_id = (SELECT federacao_id FROM profiles WHERE id = auth.uid()));
