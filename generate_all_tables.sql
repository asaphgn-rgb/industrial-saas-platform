-- Criando as tabelas vitais para recebimento das planilhas de implantação

-- Centros de Custo
CREATE TABLE IF NOT EXISTS public.centros_custo (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid not null,
  codigo text not null,
  nome text not null,
  tipo text,
  ativo boolean default true,
  created_by uuid,
  created_at timestamp with time zone default now()
);
ALTER TABLE public.centros_custo DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.centros_custo TO anon, authenticated, service_role;

-- Depósitos
CREATE TABLE IF NOT EXISTS public.depositos (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid not null,
  codigo text not null,
  nome text not null,
  tipo text,
  capacidade_kg numeric,
  created_by uuid,
  created_at timestamp with time zone default now()
);
ALTER TABLE public.depositos DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.depositos TO anon, authenticated, service_role;

-- Clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid not null,
  cnpj_cpf text not null,
  razao_social text not null,
  nome_fantasia text,
  email text,
  telefone text,
  endereco_completo text,
  created_by uuid,
  created_at timestamp with time zone default now()
);
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.clientes TO anon, authenticated, service_role;

-- Fornecedores
CREATE TABLE IF NOT EXISTS public.fornecedores (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid not null,
  cnpj_cpf text not null,
  razao_social text not null,
  nome_fantasia text,
  categoria text,
  email text,
  created_by uuid,
  created_at timestamp with time zone default now()
);
ALTER TABLE public.fornecedores DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.fornecedores TO anon, authenticated, service_role;

-- Produtos
CREATE TABLE IF NOT EXISTS public.produtos (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid not null,
  codigo text not null,
  descricao text not null,
  tipo text,
  unidade_medida_id uuid,
  peso_kg numeric,
  largura_mm numeric,
  espessura_micras numeric,
  created_by uuid,
  created_at timestamp with time zone default now()
);
ALTER TABLE public.produtos DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.produtos TO anon, authenticated, service_role;

-- Materias Primas
CREATE TABLE IF NOT EXISTS public.materias_primas (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid not null,
  codigo text not null,
  descricao text not null,
  categoria text,
  unidade_medida_id uuid,
  estoque_minimo numeric,
  created_by uuid,
  created_at timestamp with time zone default now()
);
ALTER TABLE public.materias_primas DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.materias_primas TO anon, authenticated, service_role;

