-- Script para criar um Usuário Administrador Global na plataforma
-- Deve ser executado no SQL Editor do seu projeto Supabase

-- 1. Inserir na tabela auth.users (Tabela nativa de autenticação do Supabase)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  aud,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@morarbembrasil.com',
  crypt('AdminDiamond2026!', gen_salt('bf')),
  now(),
  'authenticated',
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{"nome":"Administrador Global"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Inserir na tabela auth.identities (Relacionamento de provedor)
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@morarbembrasil.com"}',
  'email',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 3. Inserir na tabela pública de Perfis (Sua tabela hierárquica)
INSERT INTO public.profiles (
  id,
  role,
  nome_completo,
  email
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ADMIN_GLOBAL',
  'Administrador Global',
  'admin@morarbembrasil.com'
) ON CONFLICT (id) DO NOTHING;
