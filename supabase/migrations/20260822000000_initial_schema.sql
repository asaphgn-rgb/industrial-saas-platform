-- Migration 01: Setup base do sistema MORAR BEM BRASIL / PLATAFORMA DIAMOND
-- Estrutura RBAC: Admin Global -> Federação -> Associação -> Associado

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================================================
-- 1. ENUMS
-- =================================================================================
CREATE TYPE user_role AS ENUM ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO');
CREATE TYPE entity_status AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'PARTIAL_BLOCK');

-- =================================================================================
-- 2. TABELAS HIERÁRQUICAS
-- =================================================================================

-- 2.1 Federações
CREATE TABLE federacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    status entity_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Associações
CREATE TABLE associacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    federacao_id UUID NOT NULL REFERENCES federacoes(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    status entity_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Usuários / Profiles (Extensão do Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    
    -- Vínculos Hierárquicos (Nullabilidade condicional baseada na role)
    federacao_id UUID REFERENCES federacoes(id) ON DELETE SET NULL,
    associacao_id UUID REFERENCES associacoes(id) ON DELETE SET NULL,
    
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    
    status entity_status DEFAULT 'ACTIVE',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Associados (Dados Cadastrais Específicos)
CREATE TABLE associados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE, -- Vínculo com login (se houver)
    associacao_id UUID NOT NULL REFERENCES associacoes(id) ON DELETE CASCADE,
    
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    rg VARCHAR(20),
    data_nascimento DATE,
    telefone VARCHAR(20),
    
    -- Status no sistema
    status entity_status DEFAULT 'ACTIVE',
    
    -- Metadados de acompanhamento
    score_estimado INTEGER,
    status_credito VARCHAR(50) DEFAULT 'PENDENTE',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================================
-- 3. AUDITORIA (Imutável)
-- =================================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tabela VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    acao VARCHAR(50) NOT NULL,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para impedir DELETE e UPDATE na tabela de auditoria
CREATE OR REPLACE FUNCTION block_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'A tabela de logs de auditoria é imutável e não pode sofrer UPDATE ou DELETE.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_audit_log_changes
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION block_audit_log_modification();

-- =================================================================================
-- 4. ÍNDICES DE PERFORMANCE E SEGURANÇA
-- =================================================================================
CREATE INDEX idx_associacoes_federacao ON associacoes(federacao_id);
CREATE INDEX idx_profiles_federacao ON profiles(federacao_id);
CREATE INDEX idx_profiles_associacao ON profiles(associacao_id);
CREATE INDEX idx_associados_associacao ON associados(associacao_id);
CREATE INDEX idx_associados_user ON associados(user_id);

-- =================================================================================
-- 5. FUNÇÕES AUXILIARES DE SEGURANÇA (RLS Helpers)
-- =================================================================================

CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth_user_federacao()
RETURNS UUID AS $$
  SELECT federacao_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth_user_associacao()
RETURNS UUID AS $$
  SELECT associacao_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- =================================================================================
-- 6. HABILITAR RLS (Row Level Security)
-- =================================================================================
ALTER TABLE federacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE associacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE associados ENABLE ROW LEVEL SECURITY;

-- =================================================================================
-- 7. POLÍTICAS DE RLS - OBRIGATÓRIAS
-- =================================================================================

-- 7.1 FEDERAÇÕES
CREATE POLICY "Admin Global vê todas as federações" 
ON federacoes FOR ALL 
USING (auth_user_role() = 'ADMIN_GLOBAL');

CREATE POLICY "Federação vê apenas a si mesma" 
ON federacoes FOR SELECT 
USING (id = auth_user_federacao());

-- 7.2 ASSOCIAÇÕES
CREATE POLICY "Admin Global vê todas as associações" 
ON associacoes FOR ALL 
USING (auth_user_role() = 'ADMIN_GLOBAL');

CREATE POLICY "Federação vê suas associações" 
ON associacoes FOR ALL 
USING (federacao_id = auth_user_federacao());

CREATE POLICY "Associação vê apenas a si mesma" 
ON associacoes FOR SELECT 
USING (id = auth_user_associacao());

-- 7.3 PROFILES
CREATE POLICY "Admin Global gerencia todos os perfis" 
ON profiles FOR ALL 
USING (auth_user_role() = 'ADMIN_GLOBAL');

CREATE POLICY "Usuário vê e edita o próprio perfil" 
ON profiles FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Federação vê perfis da sua federação" 
ON profiles FOR SELECT 
USING (federacao_id = auth_user_federacao());

CREATE POLICY "Associação vê perfis da sua associação" 
ON profiles FOR SELECT 
USING (associacao_id = auth_user_associacao());

-- 7.4 ASSOCIADOS
CREATE POLICY "Admin Global gerencia todos os associados" 
ON associados FOR ALL 
USING (auth_user_role() = 'ADMIN_GLOBAL');

CREATE POLICY "Federação vê associados da sua estrutura" 
ON associados FOR SELECT 
USING (
    associacao_id IN (
        SELECT id FROM associacoes WHERE federacao_id = auth_user_federacao()
    )
);

CREATE POLICY "Associação gerencia seus associados" 
ON associados FOR ALL 
USING (associacao_id = auth_user_associacao());

CREATE POLICY "Associado vê apenas seu próprio cadastro" 
ON associados FOR SELECT 
USING (user_id = auth.uid());

