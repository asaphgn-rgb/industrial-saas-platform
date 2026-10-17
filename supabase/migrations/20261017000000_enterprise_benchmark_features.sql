-- ==============================================================================
-- MIGRATION: 20261017000000_enterprise_benchmark_features.sql
-- DESCRIÇÃO: Expansão Enterprise - Benchmark Habitacional e Fintech White Label
-- ==============================================================================

-- 1. ENUMS ADICIONAIS DO SETOR HABITACIONAL & CONTRATUAL
DO $$ BEGIN
  CREATE TYPE status_unidade_habitacional AS ENUM ('DISPONIVEL', 'RESERVADA', 'EM_ANALISE_CREDITO', 'CONTRATADA', 'ENTREGUE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE status_contrato_digital AS ENUM ('RASCUNHO', 'AGUARDANDO_ASSINATURAS', 'ASSINADO', 'REGISTRADO_CARTORIO', 'CANCELADO');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE status_fila_social AS ENUM ('HABILITADO', 'CONVOCADO', 'EM_DOCUMENTACAO', 'DESISTENTE', 'CONTEMPLADO');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABELA DE UNIDADES HABITACIONAIS (ESPELHO DE VENDAS / MAPA DE LOTES/APS)
CREATE TABLE IF NOT EXISTS public.empreendimentos_unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID REFERENCES public.produtos_habitacionais(id) ON DELETE CASCADE,
  bloco_quadra VARCHAR(50) NOT NULL,
  numero_unidade VARCHAR(50) NOT NULL,
  andar INT DEFAULT 1,
  metragem_m2 NUMERIC(8,2) NOT NULL,
  quartos INT DEFAULT 2,
  vagas INT DEFAULT 1,
  valor_unidade NUMERIC(12,2) NOT NULL,
  status status_unidade_habitacional NOT NULL DEFAULT 'DISPONIVEL',
  associado_vinculado_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reservado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE MOTOR DE SCORING E FILA SOCIAL AUDITÁVEL
CREATE TABLE IF NOT EXISTS public.fila_classificacao_social (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  associado_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  federacao_id UUID REFERENCES public.federacoes(id),
  associacao_id UUID REFERENCES public.associacoes(id),
  pontuacao_total NUMERIC(8,2) NOT NULL DEFAULT 0.00,
  posicao_geral INT,
  renda_per_capita NUMERIC(10,2) NOT NULL,
  tempo_associacao_meses INT DEFAULT 0,
  numero_dependentes INT DEFAULT 0,
  possui_pcd BOOLEAN DEFAULT false,
  mulher_chefe_familia BOOLEAN DEFAULT false,
  idoso_na_familia BOOLEAN DEFAULT false,
  status status_fila_social NOT NULL DEFAULT 'HABILITADO',
  data_ultima_convocacao TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA DE CONTRATOS DIGITAIS E TRILHA DE ASSINATURA ELETRÔNICA
CREATE TABLE IF NOT EXISTS public.contratos_digitais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo_contrato VARCHAR(50) NOT NULL, -- ADESAO_ASSOCIATIVA, PROMESSA_COMPRA_VENDA, COTA_PARTE
  associado_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  unidade_id UUID REFERENCES public.empreendimentos_unidades(id) ON DELETE SET NULL,
  valor_contrato NUMERIC(14,2) NOT NULL,
  status status_contrato_digital NOT NULL DEFAULT 'RASCUNHO',
  hash_sha256 TEXT,
  minuta_url TEXT,
  assinado_associado_em TIMESTAMPTZ,
  ip_assinatura_associado TEXT,
  user_agent_associado TEXT,
  assinado_diretoria_em TIMESTAMPTZ,
  diretor_assinante_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABELA DE CARTÕES VIRTUAIS COM CVV ROTATIVO (FINTECH BAAS)
CREATE TABLE IF NOT EXISTS public.cartoes_virtuais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartao_fisico_id UUID NOT NULL REFERENCES public.cartoes_diamond(id) ON DELETE CASCADE,
  titular_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  apelido VARCHAR(50) NOT NULL DEFAULT 'Compras Online',
  numero_mascarado VARCHAR(19) NOT NULL,
  cvv_dinamico VARCHAR(4) NOT NULL,
  validade_cvv TIMESTAMPTZ NOT NULL,
  limite_temporario NUMERIC(12,2) NOT NULL DEFAULT 500.00,
  uso_unico BOOLEAN NOT NULL DEFAULT false,
  bloqueado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABELA DE PARCELAMENTO DE FATURA (CONFORMIDADE BACEN RES. 4.549/17)
CREATE TABLE IF NOT EXISTS public.faturas_parcelamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fatura_id UUID NOT NULL REFERENCES public.faturas_cartao(id) ON DELETE CASCADE,
  valor_entrada NUMERIC(12,2) NOT NULL,
  quantidade_parcelas INT NOT NULL,
  valor_parcela NUMERIC(12,2) NOT NULL,
  taxa_juros_mensal_pct NUMERIC(5,2) NOT NULL,
  cet_mensal_pct NUMERIC(5,2) NOT NULL,
  cet_anual_pct NUMERIC(6,2) NOT NULL,
  iof_total NUMERIC(10,2) NOT NULL,
  contratado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(30) NOT NULL DEFAULT 'ATIVO'
);

-- 7. TABELA DE CONCILIAÇÃO & REPASSE DO LOJISTA PARCEIRO
CREATE TABLE IF NOT EXISTS public.lojistas_conciliacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id UUID NOT NULL REFERENCES public.estabelecimentos_credenciados(id) ON DELETE CASCADE,
  periodo_referencia VARCHAR(10) NOT NULL, -- Ex: 2026-10-15
  total_vendas_bruto NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  total_mdr_descontado NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_cashback_retido NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_liquido_repasse NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  data_repasse_programada DATE NOT NULL,
  status_repasse VARCHAR(30) NOT NULL DEFAULT 'PENDENTE_LIQUIDACAO',
  comprovante_pix TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TABELA DE CASHBACK HABITACIONAL (FIDELIDADE SOCIAL)
CREATE TABLE IF NOT EXISTS public.cashback_amortizacoes_habitacionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  associado_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cartao_id UUID REFERENCES public.cartoes_diamond(id),
  contrato_id UUID REFERENCES public.contratos_digitais(id),
  valor_amortizado NUMERIC(12,2) NOT NULL,
  saldo_anterior NUMERIC(12,2) NOT NULL,
  saldo_remanescente NUMERIC(12,2) NOT NULL,
  descricao TEXT NOT NULL,
  solicitado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(30) NOT NULL DEFAULT 'CONCLUIDO'
);

-- 9. HABILITAÇÃO OBRIGATÓRIA DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.empreendimentos_unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fila_classificacao_social ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos_digitais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartoes_virtuais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faturas_parcelamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lojistas_conciliacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_amortizacoes_habitacionais ENABLE ROW LEVEL SECURITY;

-- 10. POLÍTICAS DE RLS
-- Unidades Habitacionais: Visualização pública autenticada; escrita ADMIN_GLOBAL
CREATE POLICY "Unidades habitacionais visualizacao" ON public.empreendimentos_unidades
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin gerencia unidades" ON public.empreendimentos_unidades
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN_GLOBAL'));

-- Fila Social: Associado vê sua própria posição; Federação/Associação vê seus vinculados; Admin vê todos
CREATE POLICY "Visualizacao fila social" ON public.fila_classificacao_social
  FOR SELECT USING (
    auth.uid() = associado_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO'))
  );

-- Contratos Digitais: Associado vê seus contratos; Admin vê todos
CREATE POLICY "Visualizacao contratos" ON public.contratos_digitais
  FOR SELECT USING (
    auth.uid() = associado_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN_GLOBAL')
  );

-- Cartões Virtuais: Titular vê seus próprios cartões virtuais; Admin vê todos
CREATE POLICY "Visualizacao cartoes virtuais" ON public.cartoes_virtuais
  FOR SELECT USING (
    auth.uid() = titular_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN_GLOBAL')
  );

CREATE POLICY "Titular gerencia cartoes virtuais" ON public.cartoes_virtuais
  FOR ALL USING (auth.uid() = titular_id);

-- Conciliação de Lojistas: Lojista vê suas conciliações; Admin vê todas
CREATE POLICY "Visualizacao conciliacao lojistas" ON public.lojistas_conciliacao
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN_GLOBAL'));

-- Cashback Amortizações
CREATE POLICY "Visualizacao amortizacoes cashback" ON public.cashback_amortizacoes_habitacionais
  FOR SELECT USING (
    auth.uid() = associado_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN_GLOBAL')
  );
