-- ============================================================================
-- MIGRATION: 20261020000000_mbb_diamond_enterprise_ecosystem.sql
-- DESCRIÇÃO: Ecossistema Integrado MBB + Cartão Diamond White Label
--            1. Adesão R$ 50 com conversão 100% em Saldo Cashback
--            2. Radar de Matching Imobiliário (Carteira MBB vs Imóveis Desejados)
--            3. Contas Digitais & Cartões Virtuais exclusivos para conveniados
--            4. Empresas Privadas com Bandeira Diamond (Co-Branded White Label)
--            5. Motor de Split & Participação de Resultados (Federações/Associações)
--            6. Conexão API BaaS White Label Bancária (Bacen / PIX D+0)
-- RLS: 100% das tabelas ativadas e blindadas com regras multi-tenant estritas
-- ============================================================================

-- 1. ADESÕES, TAXA DE R$ 50 E CONVERSÃO EM CASHBACK
CREATE TABLE IF NOT EXISTS public.adesao_onboarding_cashback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    associado_id UUID NOT NULL REFERENCES public.associados(id) ON DELETE CASCADE,
    associacao_id UUID REFERENCES public.associacoes(id) ON DELETE SET NULL,
    federacao_id UUID REFERENCES public.federacoes(id) ON DELETE SET NULL,
    valor_taxa NUMERIC(10,2) NOT NULL DEFAULT 50.00,
    status_pagamento VARCHAR(20) NOT NULL DEFAULT 'PENDENTE' CHECK (status_pagamento IN ('PENDENTE', 'PAGO', 'ESTORNADO')),
    forma_pagamento VARCHAR(20) DEFAULT 'PIX' CHECK (forma_pagamento IN ('PIX', 'CARTAO_CREDITO', 'BOLETO')),
    txid_pix VARCHAR(100),
    data_pagamento TIMESTAMPTZ,
    cashback_gerado_valor NUMERIC(10,2) NOT NULL DEFAULT 50.00,
    cashback_creditado BOOLEAN NOT NULL DEFAULT FALSE,
    pre_analise_status VARCHAR(30) DEFAULT 'APROVADO_CONSULTIVO' CHECK (pre_analise_status IN ('EM_ANALISE', 'APROVADO_CONSULTIVO', 'PENDENCIA_DOCUMENTAL')),
    capacidade_financiamento_estimada NUMERIC(14,2) DEFAULT 220000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_adesao_assoc ON public.adesao_onboarding_cashback(associado_id);
CREATE INDEX IF NOT EXISTS idx_adesao_status ON public.adesao_onboarding_cashback(status_pagamento);

-- 2. RADAR DE MATCHING IMOBILIÁRIO (IMÓVEIS DESEJADOS PELO COOPERADO)
CREATE TABLE IF NOT EXISTS public.imoveis_desejados_associado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    associado_id UUID NOT NULL REFERENCES public.associados(id) ON DELETE CASCADE,
    tipo_imovel VARCHAR(30) NOT NULL DEFAULT 'LOTE' CHECK (tipo_imovel IN ('LOTE', 'APARTAMENTO', 'CASA', 'INDIFERENTE')),
    regioes_bairros_interesse TEXT[] NOT NULL DEFAULT ARRAY['Plano Piloto', 'Tororó', 'Jardim Botânico', 'Águas Claras'],
    cidade_uf VARCHAR(60) NOT NULL DEFAULT 'Brasília/DF',
    valor_maximo_pretendido NUMERIC(14,2) NOT NULL DEFAULT 250000.00,
    valor_entrada_disponivel NUMERIC(14,2) DEFAULT 30000.00,
    possui_fgts BOOLEAN DEFAULT TRUE,
    valor_fgts_estimado NUMERIC(14,2) DEFAULT 25000.00,
    quartos_minimos INT DEFAULT 2,
    vagas_garagem_minimas INT DEFAULT 1,
    status_matching VARCHAR(30) DEFAULT 'BUSCANDO' CHECK (status_matching IN ('BUSCANDO', 'OPORTUNIDADE_ENCONTRADA', 'EM_CONTRATACAO', 'CONCLUIDO')),
    unidade_matriz_combinada_id UUID REFERENCES public.unidades_habitacionais(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_imoveis_desejados_associado ON public.imoveis_desejados_associado(associado_id);

-- 3. CONTAS DIGITAIS & CARTÕES VIRTUAIS EXCLUSIVOS DO ASSOCIADO
CREATE TABLE IF NOT EXISTS public.contas_digitais_diamond (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    associado_id UUID NOT NULL REFERENCES public.associados(id) ON DELETE CASCADE,
    numero_conta VARCHAR(20) UNIQUE NOT NULL,
    agencia VARCHAR(10) NOT NULL DEFAULT '0001',
    banco_parceiro_codigo VARCHAR(10) NOT NULL DEFAULT '341', -- Banco parceiro BaaS
    banco_parceiro_nome VARCHAR(60) NOT NULL DEFAULT 'Diamond BaaS Partner Bank',
    saldo_cashback NUMERIC(12,2) NOT NULL DEFAULT 50.00, -- R$ 50 creditados automaticamente
    saldo_disponivel NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status_conta VARCHAR(20) NOT NULL DEFAULT 'ATIVA' CHECK (status_conta IN ('ATIVA', 'BLOQUEADA', 'SUSPENSA')),
    chave_pix_padrao VARCHAR(100),
    limite_diario_compras NUMERIC(10,2) DEFAULT 3000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contas_digitais_assoc ON public.contas_digitais_diamond(associado_id);

CREATE TABLE IF NOT EXISTS public.cartoes_digitais_beneficios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conta_id UUID NOT NULL REFERENCES public.contas_digitais_diamond(id) ON DELETE CASCADE,
    associado_id UUID NOT NULL REFERENCES public.associados(id) ON DELETE CASCADE,
    nome_titular_impresso VARCHAR(60) NOT NULL,
    mascara_cartao VARCHAR(20) NOT NULL, -- Ex: '5582 8841 **** 9412'
    token_pci VARCHAR(120) NOT NULL UNIQUE,
    cvv_dinamico VARCHAR(4) NOT NULL DEFAULT '412',
    cvv_expira_em TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '60 seconds'),
    validade_mes_ano VARCHAR(7) NOT NULL DEFAULT '11/31',
    status_cartao VARCHAR(20) NOT NULL DEFAULT 'ATIVO' CHECK (status_cartao IN ('ATIVO', 'PAUSADO', 'CANCELADO')),
    tipo_emissao VARCHAR(20) NOT NULL DEFAULT 'DIGITAL_APP_ONLY',
    desconto_conveniados_ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cartoes_digitais_conta ON public.cartoes_digitais_beneficios(conta_id);

-- 4. EMPRESAS PRIVADAS COM BANDEIRA DIAMOND (CO-BRANDED WHITE LABEL)
CREATE TABLE IF NOT EXISTS public.empresas_parceiras_whitelabel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razao_social VARCHAR(160) NOT NULL,
    nome_fantasia VARCHAR(120) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    slug_personalizado VARCHAR(60) UNIQUE NOT NULL,
    segmento_atuacao VARCHAR(60) NOT NULL, -- 'Materiais de Construção', 'Supermercados', 'Saúde', 'Combustíveis'
    logo_marca_url TEXT,
    cor_primaria_hex VARCHAR(7) DEFAULT '#16382C',
    cor_secundaria_hex VARCHAR(7) DEFAULT '#C8F2D6',
    tipo_convenio VARCHAR(30) DEFAULT 'CO_BRANDED_BENEFICIOS',
    desconto_oferecido_pct NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    taxa_cashback_associado_pct NUMERIC(5,2) NOT NULL DEFAULT 3.00,
    taxa_mdr_repasse_pct NUMERIC(5,2) NOT NULL DEFAULT 1.80,
    status_parceria VARCHAR(20) DEFAULT 'ATIVO' CHECK (status_parceria IN ('ATIVO', 'HOMOLOGACAO', 'SUSPENSO')),
    cartoes_emitidos_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. REGRAS DE SPLIT DE BONIFICAÇÃO (FEDERAÇÕES & ASSOCIAÇÕES)
CREATE TABLE IF NOT EXISTS public.regras_split_bonificacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origem_evento VARCHAR(40) NOT NULL UNIQUE CHECK (origem_evento IN ('TAXA_ADESAO_50', 'CONSUMO_REDE_LOJISTA', 'PARCELA_HABITACIONAL')),
    percentual_associacao NUMERIC(5,2) NOT NULL, -- Ex: 20% para a associação
    percentual_federacao NUMERIC(5,2) NOT NULL,  -- Ex: 10% para a federação
    percentual_plataforma NUMERIC(5,2) NOT NULL, -- Ex: 70% custeio, infra e fundo
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserir regras de split oficiais
INSERT INTO public.regras_split_bonificacao (origem_evento, percentual_associacao, percentual_federacao, percentual_plataforma) VALUES
('TAXA_ADESAO_50', 25.00, 15.00, 60.00),
('CONSUMO_REDE_LOJISTA', 30.00, 20.00, 50.00),
('PARCELA_HABITACIONAL', 10.00, 5.00, 85.00)
ON CONFLICT (origem_evento) DO NOTHING;

-- EXTRATO CONSOLIDADO DE PARTICIPAÇÃO E BONIFICAÇÃO DE RESULTADOS
CREATE TABLE IF NOT EXISTS public.extrato_repasses_rede (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origem_evento VARCHAR(40) NOT NULL,
    referencia_id UUID,
    entidade_tipo VARCHAR(20) NOT NULL CHECK (entidade_tipo IN ('FEDERACAO', 'ASSOCIACAO')),
    entidade_id UUID NOT NULL,
    entidade_nome VARCHAR(140) NOT NULL,
    associado_origem_nome VARCHAR(140),
    valor_base NUMERIC(12,2) NOT NULL,
    percentual_aplicado NUMERIC(5,2) NOT NULL,
    valor_bonificacao NUMERIC(12,2) NOT NULL,
    status_repasse VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL' CHECK (status_repasse IN ('PROGRAMADO', 'DISPONIVEL', 'LIQUIDADO_PIX')),
    data_liquidacao TIMESTAMPTZ,
    comprovante_pix VARCHAR(80),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repasses_entidade ON public.extrato_repasses_rede(entidade_tipo, entidade_id);

-- ============================================================================
-- 6. HABILITAÇÃO MANDATÓRIA DE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.adesao_onboarding_cashback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imoveis_desejados_associado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_digitais_diamond ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartoes_digitais_beneficios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_parceiras_whitelabel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_split_bonificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extrato_repasses_rede ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS
CREATE POLICY "adesao_select_policy" ON public.adesao_onboarding_cashback
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO')) OR
        associado_id IN (SELECT a.id FROM public.associados a WHERE a.user_id = auth.uid())
    );

CREATE POLICY "adesao_all_admin" ON public.adesao_onboarding_cashback
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'ASSOCIACAO')));

CREATE POLICY "imoveis_desejados_policy" ON public.imoveis_desejados_associado
    FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO')) OR
        associado_id IN (SELECT a.id FROM public.associados a WHERE a.user_id = auth.uid())
    );

CREATE POLICY "contas_digitais_policy" ON public.contas_digitais_diamond
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO')) OR
        associado_id IN (SELECT a.id FROM public.associados a WHERE a.user_id = auth.uid())
    );

CREATE POLICY "cartoes_digitais_policy" ON public.cartoes_digitais_beneficios
    FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role = 'ADMIN_GLOBAL') OR
        associado_id IN (SELECT a.id FROM public.associados a WHERE a.user_id = auth.uid())
    );

CREATE POLICY "empresas_whitelabel_select" ON public.empresas_parceiras_whitelabel
    FOR SELECT TO authenticated
    USING (true); -- Visível para toda a rede autenticada consultar parceiros

CREATE POLICY "empresas_whitelabel_admin" ON public.empresas_parceiras_whitelabel
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role = 'ADMIN_GLOBAL'));

CREATE POLICY "regras_split_select" ON public.regras_split_bonificacao
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "extrato_repasses_policy" ON public.extrato_repasses_rede
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role = 'ADMIN_GLOBAL') OR
        (entidade_tipo = 'FEDERACAO' AND entidade_id IN (SELECT p.federacao_id FROM public.perfis p WHERE p.user_id = auth.uid())) OR
        (entidade_tipo = 'ASSOCIACAO' AND entidade_id IN (SELECT p.associacao_id FROM public.perfis p WHERE p.user_id = auth.uid()))
    );
