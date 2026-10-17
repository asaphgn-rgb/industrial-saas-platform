-- ==============================================================================
-- MIGRATION: 20261016000000_cartao_diamond_schema.sql
-- DESCRIÇÃO: Segregação completa e estrutura do ecossistema CARTÃO DIAMOND
-- ==============================================================================

-- 1. ENUMS ESPECÍFICOS DO SISTEMA DE CARTÕES
DO $$ BEGIN
  CREATE TYPE tipo_cartao_diamond AS ENUM ('BENEFICIO', 'CREDITO', 'CONSIGNADO', 'CORPORATIVO');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE status_cartao_diamond AS ENUM ('ATIVO', 'BLOQUEADO', 'EM_ANALISE', 'CANCELADO');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE status_transacao_diamond AS ENUM ('APROVADA', 'RECUSADA', 'ESTORNADA', 'EM_ANALISE_ANTIFRAUDE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE status_fatura_diamond AS ENUM ('ABERTA', 'FECHADA', 'PAGA', 'VENCIDA', 'PARCELADA');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABELA DE CARTÕES EMITIDOS
CREATE TABLE IF NOT EXISTS public.cartoes_diamond (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titular_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  numero_mascarado VARCHAR(19) NOT NULL,
  bandeira VARCHAR(30) NOT NULL DEFAULT 'DIAMOND_ELO',
  tipo tipo_cartao_diamond NOT NULL DEFAULT 'BENEFICIO',
  status status_cartao_diamond NOT NULL DEFAULT 'ATIVO',
  limite_total NUMERIC(12,2) NOT NULL DEFAULT 1000.00,
  limite_disponivel NUMERIC(12,2) NOT NULL DEFAULT 1000.00,
  dia_vencimento INT NOT NULL DEFAULT 10,
  cashback_acumulado NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  bloqueio_antifraude BOOLEAN NOT NULL DEFAULT false,
  motivo_bloqueio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE FATURAS DO CARTÃO
CREATE TABLE IF NOT EXISTS public.faturas_cartao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartao_id UUID NOT NULL REFERENCES public.cartoes_diamond(id) ON DELETE CASCADE,
  mes_referencia VARCHAR(7) NOT NULL, -- Ex: 2026-10
  data_vencimento DATE NOT NULL,
  data_fechamento DATE NOT NULL,
  valor_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  valor_minimo NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  valor_pago NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  status status_fatura_diamond NOT NULL DEFAULT 'ABERTA',
  codigo_barras_boleto TEXT,
  pix_copia_cola TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA DE ESTABELECIMENTOS CREDENCIADOS (REDE DE PARCEIROS & CASHBACK)
CREATE TABLE IF NOT EXISTS public.estabelecimentos_credenciados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_fantasia TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  cnpj_mascarado VARCHAR(18) NOT NULL,
  categoria TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cashback_pct NUMERIC(5,2) NOT NULL DEFAULT 2.00,
  taxa_mdr_pct NUMERIC(5,2) NOT NULL DEFAULT 1.80,
  status TEXT NOT NULL DEFAULT 'CONVENIADO',
  volume_transacionado_acumulado NUMERIC(14,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABELA DE TRANSAÇÕES FINANCEIRAS & ANTIFRAUDE
CREATE TABLE IF NOT EXISTS public.transacoes_cartao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartao_id UUID NOT NULL REFERENCES public.cartoes_diamond(id) ON DELETE CASCADE,
  fatura_id UUID REFERENCES public.faturas_cartao(id) ON DELETE SET NULL,
  estabelecimento_id UUID REFERENCES public.estabelecimentos_credenciados(id),
  estabelecimento_nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  valor_cashback NUMERIC(12,2) DEFAULT 0.00,
  tipo VARCHAR(20) NOT NULL DEFAULT 'DEBITO',
  status status_transacao_diamond NOT NULL DEFAULT 'APROVADA',
  score_risco_antifraude INT DEFAULT 12, -- 0 a 100
  ip_origem TEXT,
  geolocalizacao JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABELA DE REGRAS E POLÍTICAS DE RISCO BACEN / ANTIFRAUDE
CREATE TABLE IF NOT EXISTS public.politicas_risco_cartao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_regra TEXT NOT NULL,
  tipo_verificacao VARCHAR(50) NOT NULL,
  limite_disparo NUMERIC(12,2),
  acao_automatica VARCHAR(50) NOT NULL DEFAULT 'ALERTA',
  ativo BOOLEAN NOT NULL DEFAULT true,
  descricao TEXT,
  criado_por UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SEGURANÇA E ISOLAMENTO VIA ROW LEVEL SECURITY (RLS)
ALTER TABLE public.cartoes_diamond ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faturas_cartao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estabelecimentos_credenciados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_cartao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.politicas_risco_cartao ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS: cartoes_diamond
DROP POLICY IF EXISTS "Titular acessa seus cartões ou Admin Global" ON public.cartoes_diamond;
CREATE POLICY "Titular acessa seus cartões ou Admin Global" ON public.cartoes_diamond
  FOR SELECT USING (
    auth.uid() = titular_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN_GLOBAL')
  );

-- POLÍTICAS: faturas_cartao
DROP POLICY IF EXISTS "Titular acessa suas faturas ou Admin Global" ON public.faturas_cartao;
CREATE POLICY "Titular acessa suas faturas ou Admin Global" ON public.faturas_cartao
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cartoes_diamond
      WHERE cartoes_diamond.id = faturas_cartao.cartao_id
      AND (cartoes_diamond.titular_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN_GLOBAL'
      ))
    )
  );

-- POLÍTICAS: estabelecimentos_credenciados (Pública para rede autenticada)
DROP POLICY IF EXISTS "Visualização pública da rede credenciada" ON public.estabelecimentos_credenciados;
CREATE POLICY "Visualização pública da rede credenciada" ON public.estabelecimentos_credenciados
  FOR SELECT TO authenticated USING (true);

-- POLÍTICAS: transacoes_cartao
DROP POLICY IF EXISTS "Titular acessa suas transações ou Admin Global" ON public.transacoes_cartao;
CREATE POLICY "Titular acessa suas transações ou Admin Global" ON public.transacoes_cartao
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cartoes_diamond
      WHERE cartoes_diamond.id = transacoes_cartao.cartao_id
      AND (cartoes_diamond.titular_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN_GLOBAL'
      ))
    )
  );

-- POLÍTICAS: politicas_risco_cartao (Restrito a Admin Global)
DROP POLICY IF EXISTS "Admin Global gerencia politicas de risco" ON public.politicas_risco_cartao;
CREATE POLICY "Admin Global gerencia politicas de risco" ON public.politicas_risco_cartao
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN_GLOBAL')
  );
