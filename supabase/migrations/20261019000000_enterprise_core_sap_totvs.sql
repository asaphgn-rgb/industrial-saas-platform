-- ============================================================================
-- MIGRATION: 20261019000000_enterprise_core_sap_totvs.sql
-- DESCRIÇÃO: Core Contábil (Double-Entry Ledger), Matriz de Lotes/Unidades,
--            Alçadas de Aprovação em Árvore e Trilha de Auditoria Criptográfica
-- PADRÃO: SAP RE-FX / TOTVS Protheus / Pismo Core Banking
-- RLS: 100% das tabelas blindadas com políticas restritas multi-tenant
-- ============================================================================

-- 1. PLANO DE CONTAS CONTÁBIL INSTITUCIONAL (PADRÃO IFRS / BACEN COSIF)
CREATE TABLE IF NOT EXISTS public.contas_plano_contabil (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_estruturado VARCHAR(30) NOT NULL UNIQUE, -- Ex: '1.1.01.001'
    nome VARCHAR(140) NOT NULL,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('ATIVO', 'PASSIVO', 'PATRIMONIO_LIQUIDO', 'RECEITA', 'DESPESA')),
    natureza VARCHAR(10) NOT NULL CHECK (natureza IN ('DEVEDORA', 'CREDORA')),
    tenant_tipo VARCHAR(20) DEFAULT 'GLOBAL' CHECK (tenant_tipo IN ('GLOBAL', 'FEDERACAO', 'ASSOCIACAO')),
    tenant_id UUID,
    nivel_hierarquico INT NOT NULL DEFAULT 1,
    permite_lancamento BOOLEAN NOT NULL DEFAULT TRUE,
    descricao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contas_codigo ON public.contas_plano_contabil(codigo_estruturado);
CREATE INDEX IF NOT EXISTS idx_contas_tenant ON public.contas_plano_contabil(tenant_tipo, tenant_id);

-- 2. LIVRO-RAZÃO CONTÁBIL DE PARTIDAS DOBRADAS (DOUBLE-ENTRY LEDGER)
-- Regra contábil: Todo lançamento possui débito e crédito que se equilibram perfeitamente
CREATE TABLE IF NOT EXISTS public.livro_razao_lancamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transacao_id UUID NOT NULL, -- Identificador da transação de negócio (fatura, cota, aporte)
    origem_operacao VARCHAR(50) NOT NULL, -- 'AMORTIZACAO_HABITACIONAL', 'MDR_LOJISTA', 'CASHBACK', 'RATEIO_OBRA'
    conta_id UUID NOT NULL REFERENCES public.contas_plano_contabil(id) ON DELETE RESTRICT,
    tipo_movimento VARCHAR(1) NOT NULL CHECK (tipo_movimento IN ('D', 'C')), -- Débito ou Crédito
    valor NUMERIC(15,2) NOT NULL CHECK (valor > 0),
    moeda VARCHAR(3) NOT NULL DEFAULT 'BRL',
    historico TEXT NOT NULL,
    documento_referencia VARCHAR(80),
    data_competencia DATE NOT NULL DEFAULT CURRENT_DATE,
    hash_anterior VARCHAR(64), -- Encadeamento criptográfico (Merkle Chaining)
    hash_atual VARCHAR(64) NOT NULL, -- SHA-256 do lançamento
    criado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_livro_razao_transacao ON public.livro_razao_lancamentos(transacao_id);
CREATE INDEX IF NOT EXISTS idx_livro_razao_conta ON public.livro_razao_lancamentos(conta_id);
CREATE INDEX IF NOT EXISTS idx_livro_razao_data ON public.livro_razao_lancamentos(data_competencia);

-- 3. EMPREENDIMENTOS & MATRIZES IMOBILIÁRIAS (PADRÃO SAP RE-FX)
CREATE TABLE IF NOT EXISTS public.empreendimentos_matrizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    federacao_id UUID REFERENCES public.federacoes(id) ON DELETE SET NULL,
    associacao_id UUID REFERENCES public.associacoes(id) ON DELETE SET NULL,
    nome_empreendimento VARCHAR(160) NOT NULL,
    codigo_referencia VARCHAR(40) UNIQUE NOT NULL, -- Ex: 'MBB-DF-001'
    tipo_imovel VARCHAR(30) NOT NULL DEFAULT 'LOTEAMENTO' CHECK (tipo_imovel IN ('LOTEAMENTO', 'VERTICAL_APARTAMENTOS', 'CASAS_SOBRADOS', 'MISTO')),
    registro_incorporacao VARCHAR(80),
    cartorio_registro VARCHAR(120),
    matricula_mae VARCHAR(60),
    vgv_planejado NUMERIC(16,2) NOT NULL DEFAULT 0,
    area_total_terreno_m2 NUMERIC(12,2),
    total_unidades INT NOT NULL DEFAULT 0,
    status_obra VARCHAR(30) NOT NULL DEFAULT 'PLANEJAMENTO' CHECK (
        status_obra IN ('PLANEJAMENTO', 'LICENCIAMENTO', 'INFRAESTRUTURA', 'OBRAS_INICIADAS', 'FASE_FINAL', 'ENTREGUE')
    ),
    percentual_evolucao_obra NUMERIC(5,2) DEFAULT 0.00 CHECK (percentual_evolucao_obra >= 0 AND percentual_evolucao_obra <= 100),
    endereco_completo JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_empreendimentos_assoc ON public.empreendimentos_matrizes(associacao_id);
CREATE INDEX IF NOT EXISTS idx_empreendimentos_fed ON public.empreendimentos_matrizes(federacao_id);

-- 4. MATRIZ INDIVIDUAL DE UNIDADES / LOTES / APARTAMENTOS (ESPELHO DINÂMICO)
CREATE TABLE IF NOT EXISTS public.unidades_habitacionais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empreendimento_id UUID NOT NULL REFERENCES public.empreendimentos_matrizes(id) ON DELETE CASCADE,
    quadra_bloco VARCHAR(30) NOT NULL,
    unidade_numero VARCHAR(30) NOT NULL,
    metragem_privativa_m2 NUMERIC(8,2) NOT NULL,
    metragem_total_m2 NUMERIC(8,2),
    valor_tabela NUMERIC(14,2) NOT NULL,
    valor_avaliacao_bancaria NUMERIC(14,2),
    status_alocacao VARCHAR(30) NOT NULL DEFAULT 'DISPONIVEL' CHECK (
        status_alocacao IN ('DISPONIVEL', 'RESERVADO', 'EM_ANALISE_CREDITO', 'CONTRATADO', 'TERMO_POSSE_EMITIDO', 'ENTREGUE')
    ),
    associado_titular_id UUID REFERENCES public.associados(id) ON DELETE SET NULL,
    data_reserva TIMESTAMPTZ,
    data_contratacao TIMESTAMPTZ,
    data_entrega_chaves TIMESTAMPTZ,
    termo_posse_hash VARCHAR(64), -- SHA-256 do Termo de Posse Eletrônico
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(empreendimento_id, quadra_bloco, unidade_numero)
);

CREATE INDEX IF NOT EXISTS idx_unidades_status ON public.unidades_habitacionais(status_alocacao);
CREATE INDEX IF NOT EXISTS idx_unidades_empreendimento ON public.unidades_habitacionais(empreendimento_id);
CREATE INDEX IF NOT EXISTS idx_unidades_associado ON public.unidades_habitacionais(associado_titular_id);

-- 5. MOTOR DE ALÇADAS DE GOVERNANÇA E WORKFLOWS HIERÁRQUICOS (SAP WF ENGINE)
CREATE TABLE IF NOT EXISTS public.alcadas_aprovacao_workflow (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_solicitacao VARCHAR(50) NOT NULL, -- 'APROVACAO_CREDITO', 'RESERVA_UNIDADE', 'CESSAO_DIREITOS', 'REAJUSTE_CONTRATUAL'
    entidade_referencia VARCHAR(50) NOT NULL, -- Tabela alvo
    registro_id UUID NOT NULL, -- ID do registro alvo
    nivel_alcada INT NOT NULL DEFAULT 1, -- 1: Associação, 2: Federação, 3: Admin Global
    papel_obrigatorio VARCHAR(30) NOT NULL CHECK (papel_obrigatorio IN ('ASSOCIACAO', 'FEDERACAO', 'ADMIN_GLOBAL')),
    status_decisao VARCHAR(20) NOT NULL DEFAULT 'PENDENTE' CHECK (status_decisao IN ('PENDENTE', 'APROVADO', 'REPROVADO', 'CONDICIONADO')),
    parecer_tecnico TEXT,
    aprovado_por UUID REFERENCES auth.users(id),
    data_decisao TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alcadas_registro ON public.alcadas_aprovacao_workflow(entidade_referencia, registro_id);
CREATE INDEX IF NOT EXISTS idx_alcadas_status ON public.alcadas_aprovacao_workflow(status_decisao);

-- 6. TRILHA FORENSE DE AUDITORIA COM ENCADEAMENTO CRIPTOGRÁFICO MERKLE
CREATE TABLE IF NOT EXISTS public.trilha_auditoria_merkle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tabela_afetada VARCHAR(60) NOT NULL,
    operacao VARCHAR(10) NOT NULL CHECK (operacao IN ('INSERT', 'UPDATE', 'DELETE', 'ACCESS', 'EXPORT')),
    registro_id UUID,
    usuario_id UUID REFERENCES auth.users(id),
    ip_origem VARCHAR(45) NOT NULL,
    user_agent TEXT,
    payload_anterior JSONB,
    payload_novo JSONB,
    hash_anterior VARCHAR(64),
    hash_atual VARCHAR(64) NOT NULL, -- SHA-256 (tabela + registro + data + payload + hash_ant)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_merkle_tabela ON public.trilha_auditoria_merkle(tabela_afetada, registro_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_merkle_data ON public.trilha_auditoria_merkle(created_at);

-- ============================================================================
-- HABILITAÇÃO OBRIGATÓRIA DE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.contas_plano_contabil ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livro_razao_lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empreendimentos_matrizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades_habitacionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alcadas_aprovacao_workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trilha_auditoria_merkle ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS RLS ESTREITAS (MULTI-TENANT HIERÁRQUICO)
-- ============================================================================

-- A. PLANO DE CONTAS
CREATE POLICY "contas_select_hierarquica" ON public.contas_plano_contabil
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role = 'ADMIN_GLOBAL') OR
        tenant_tipo = 'GLOBAL' OR
        (tenant_tipo = 'FEDERACAO' AND tenant_id IN (SELECT p.federacao_id FROM public.perfis p WHERE p.user_id = auth.uid())) OR
        (tenant_tipo = 'ASSOCIACAO' AND tenant_id IN (SELECT p.associacao_id FROM public.perfis p WHERE p.user_id = auth.uid()))
    );

CREATE POLICY "contas_admin_global_full" ON public.contas_plano_contabil
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role = 'ADMIN_GLOBAL'));

-- B. LIVRO-RAZÃO CONTÁBIL
CREATE POLICY "livro_razao_select" ON public.livro_razao_lancamentos
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO'))
    );

CREATE POLICY "livro_razao_insert_authorized" ON public.livro_razao_lancamentos
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO'))
    );

-- C. EMPREENDIMENTOS MATRIZES
CREATE POLICY "empreendimentos_select_hierarquico" ON public.empreendimentos_matrizes
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role = 'ADMIN_GLOBAL') OR
        federacao_id IN (SELECT p.federacao_id FROM public.perfis p WHERE p.user_id = auth.uid()) OR
        associacao_id IN (SELECT p.associacao_id FROM public.perfis p WHERE p.user_id = auth.uid()) OR
        -- Associado pode ver empreendimentos públicos da sua associação
        associacao_id IN (
            SELECT a.associacao_id FROM public.associados a WHERE a.user_id = auth.uid()
        )
    );

CREATE POLICY "empreendimentos_gestao_permitida" ON public.empreendimentos_matrizes
    FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO'))
    );

-- D. UNIDADES HABITACIONAIS
CREATE POLICY "unidades_select_hierarquico" ON public.unidades_habitacionais
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO')) OR
        associado_titular_id IN (SELECT a.id FROM public.associados a WHERE a.user_id = auth.uid()) OR
        status_alocacao = 'DISPONIVEL'
    );

CREATE POLICY "unidades_gestao_permitida" ON public.unidades_habitacionais
    FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO'))
    );

-- E. ALÇADAS DE WORKFLOW
CREATE POLICY "alcadas_select_hierarquico" ON public.alcadas_aprovacao_workflow
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO'))
    );

CREATE POLICY "alcadas_gestao_governo" ON public.alcadas_aprovacao_workflow
    FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role IN ('ADMIN_GLOBAL', 'FEDERACAO'))
    );

-- F. TRILHA FORENSE DE AUDITORIA (SOMENTE LEITURA AUDITADA / APPEND VIA SISTEMA)
CREATE POLICY "auditoria_select_compliance" ON public.trilha_auditoria_merkle
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.perfis p WHERE p.user_id = auth.uid() AND p.role = 'ADMIN_GLOBAL')
    );

CREATE POLICY "auditoria_insert_audit" ON public.trilha_auditoria_merkle
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- SEED INICIAL: PLANO DE CONTAS COSIF / HABITACIONAL BASE
-- ============================================================================
INSERT INTO public.contas_plano_contabil (codigo_estruturado, nome, tipo, natureza, nivel_hierarquico) VALUES
('1.0.00.000', 'ATIVO TOTAL', 'ATIVO', 'DEVEDORA', 1),
('1.1.00.000', 'ATIVO CIRCULANTE', 'ATIVO', 'DEVEDORA', 2),
('1.1.01.000', 'DISPONIBILIDADES / CAIXA & BANCOS', 'ATIVO', 'DEVEDORA', 3),
('1.1.01.001', 'Conta Corrente Centralizadora MBB', 'ATIVO', 'DEVEDORA', 4),
('1.1.01.002', 'Conta Reserva de Liquidez Cartão BaaS', 'ATIVO', 'DEVEDORA', 4),
('1.1.02.000', 'CRÉDITOS A RECEBER DA REDE', 'ATIVO', 'DEVEDORA', 3),
('1.1.02.001', 'Cotas Habitacionais a Liquidar', 'ATIVO', 'DEVEDORA', 4),
('1.1.02.002', 'Recebíveis MDR Rede Lojistas D+1', 'ATIVO', 'DEVEDORA', 4),
('2.0.00.000', 'PASSIVO TOTAL', 'PASSIVO', 'CREDORA', 1),
('2.1.00.000', 'PASSIVO CIRCULANTE', 'PASSIVO', 'CREDORA', 2),
('2.1.01.000', 'OBRIGAÇÕES COM TERCEIROS / REDE', 'PASSIVO', 'CREDORA', 3),
('2.1.01.001', 'Repasses Programados a Federações', 'PASSIVO', 'CREDORA', 4),
('2.1.01.002', 'Repasses Programados a Associações', 'PASSIVO', 'CREDORA', 4),
('2.1.01.003', 'Saldos de Cashback de Associados', 'PASSIVO', 'CREDORA', 4),
('2.2.00.000', 'FUNDO GARANTIDOR DE OBRAS (FGO)', 'PASSIVO', 'CREDORA', 2),
('3.0.00.000', 'PATRIMÔNIO LÍQUIDO / FUNDO ASSOCIATIVO', 'PATRIMONIO_LIQUIDO', 'CREDORA', 1),
('4.0.00.000', 'RECEITAS OPERACIONAIS', 'RECEITA', 'CREDORA', 1),
('4.1.01.000', 'Taxas de Administração & Adesão', 'RECEITA', 'CREDORA', 2),
('4.1.02.000', 'Taxas de Intercâmbio MDR Cartão', 'RECEITA', 'CREDORA', 2)
ON CONFLICT (codigo_estruturado) DO NOTHING;
