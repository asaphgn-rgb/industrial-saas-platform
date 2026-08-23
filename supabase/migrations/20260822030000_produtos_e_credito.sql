-- Migration 04: Motor de Crédito, Produtos e Contratos (Fases 11 a 17)

-- Consultas SPC/Serasa
CREATE TABLE consultas_credito (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    associado_id UUID REFERENCES associados(id) ON DELETE CASCADE,
    solicitante_id UUID REFERENCES auth.users(id),
    provedor VARCHAR(50) NOT NULL, -- 'SERASA', 'SPC', 'MOCK'
    score INTEGER,
    valor_restricoes DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'CONCLUIDO',
    payload_retorno JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Motor de Pré-análise
CREATE TABLE analises_credito (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    associado_id UUID REFERENCES associados(id) ON DELETE CASCADE,
    renda_comprovada DECIMAL(12,2),
    compromissos_mensais DECIMAL(12,2),
    parcela_maxima_estimada DECIMAL(12,2),
    classificacao VARCHAR(50), -- 'PRE_APROVADO', 'CREDITO_A_TRABALHAR', 'REPROVADO'
    observacao_interna TEXT,
    parecer_gerado TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gestão Global de Produtos (Exclusivo Admin Global)
CREATE TYPE status_produto AS ENUM ('RASCUNHO', 'PUBLICADO', 'PAUSADO', 'ARQUIVADO');

CREATE TABLE produtos_catalogo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL, -- 'CASA', 'TERRENO', 'CARTAO'
    descricao_comercial TEXT,
    valor_minimo DECIMAL(12,2),
    valor_maximo DECIMAL(12,2),
    percentual_minimo_entrada DECIMAL(5,2),
    prazo_estimado_meses INTEGER,
    federacao_autorizada_id UUID REFERENCES federacoes(id), -- Null = Todas
    score_minimo INTEGER DEFAULT 0,
    status status_produto DEFAULT 'RASCUNHO',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interesse em Produto (Associado solicita)
CREATE TABLE interesses_produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    associado_id UUID REFERENCES associados(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos_catalogo(id),
    valor_pretendido DECIMAL(12,2),
    entrada_disponivel DECIMAL(12,2),
    mensagem_associado TEXT,
    status VARCHAR(50) DEFAULT 'AGUARDANDO_ANALISE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transações e Comissões
CREATE TABLE comissoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produto_id UUID REFERENCES produtos_catalogo(id),
    associado_id UUID REFERENCES associados(id),
    federacao_id UUID REFERENCES federacoes(id),
    associacao_id UUID REFERENCES associacoes(id),
    valor_total_venda DECIMAL(12,2) NOT NULL,
    comissao_plataforma DECIMAL(12,2) NOT NULL,
    comissao_federacao DECIMAL(12,2) NOT NULL,
    comissao_associacao DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PROVISIONADA', -- 'PROVISIONADA', 'PAGA'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE consultas_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos_catalogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE interesses_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comissoes ENABLE ROW LEVEL SECURITY;

-- Exemplo RLS Produtos
CREATE POLICY "Admin Global gerencia produtos" ON produtos_catalogo FOR ALL USING (auth_user_role() = 'ADMIN_GLOBAL');
CREATE POLICY "Todos veem produtos publicados" ON produtos_catalogo FOR SELECT USING (status = 'PUBLICADO');
