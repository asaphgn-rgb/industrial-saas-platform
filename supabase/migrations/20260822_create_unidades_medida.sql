CREATE TABLE IF NOT EXISTS public.unidades_medida (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid not null,
  sigla text not null,
  nome text not null,
  casas_decimais integer default 0,
  created_by uuid,
  created_at timestamp with time zone default now()
);

ALTER TABLE public.unidades_medida DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.unidades_medida TO anon, authenticated, service_role;
DROP POLICY IF EXISTS "allow_all_unidades" ON public.unidades_medida;
CREATE POLICY "allow_all_unidades" ON public.unidades_medida FOR ALL USING (true) WITH CHECK (true);
