-- Seed para criação do usuário Admin Global (CEO)

-- NOTA: O Supabase exige que senhas sejam encriptadas via função Pgcrypto no SQL, 
-- ou que os usuários sejam criados diretamente pela CLI / Interface do Auth.
-- Para o ambiente local de testes (Vite / localhost), vamos injetar um mock manual
-- na tabela profiles caso a Auth ainda não esteja instanciada.

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'ceo@morarbembrasil.com',
    crypt('diamond2026', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (
    id,
    email,
    nome_completo,
    role,
    status
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'ceo@morarbembrasil.com',
    'CEO Plataforma Diamond',
    'ADMIN_GLOBAL',
    'ACTIVE'
) ON CONFLICT (id) DO NOTHING;
