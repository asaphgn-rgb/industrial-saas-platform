-- Run this in the Supabase SQL Editor to forcefully create and bypass the confirmation blocks for all these essential users.
-- This creates them directly in the auth schema and the public.profiles schema.

DO $$
DECLARE
  v_user_id uuid;
  v_ceo_id uuid;
  v_adm_id uuid;
  v_jur_id uuid;
  v_socio_id uuid;
  v_ops_id uuid;
BEGIN
  -- CEO
  v_ceo_id := gen_random_uuid();
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
  VALUES (v_ceo_id, '00000000-0000-0000-0000-000000000000', 'ceo@flechabsb.com', crypt('ceovault', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated')
  ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('ceovault', gen_salt('bf')), email_confirmed_at = now()
  RETURNING id INTO v_ceo_id;

  INSERT INTO public.profiles (id, email, role, nome_completo)
  VALUES (v_ceo_id, 'ceo@flechabsb.com', 'ADMIN_GLOBAL', 'Direção Executiva (CEO)')
  ON CONFLICT (id) DO UPDATE SET role = 'ADMIN_GLOBAL';

  -- ADM
  v_adm_id := gen_random_uuid();
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
  VALUES (v_adm_id, '00000000-0000-0000-0000-000000000000', 'adm@flechabsb.com', crypt('adminvault', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated')
  ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('adminvault', gen_salt('bf')), email_confirmed_at = now()
  RETURNING id INTO v_adm_id;

  INSERT INTO public.profiles (id, email, role, nome_completo)
  VALUES (v_adm_id, 'adm@flechabsb.com', 'ADMIN_GLOBAL', 'Gestão Administrativa / Backoffice')
  ON CONFLICT (id) DO UPDATE SET role = 'ADMIN_GLOBAL';

  -- JURIDICO
  v_jur_id := gen_random_uuid();
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
  VALUES (v_jur_id, '00000000-0000-0000-0000-000000000000', 'juridico@flechabsb.com', crypt('legalvault', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated')
  ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('legalvault', gen_salt('bf')), email_confirmed_at = now()
  RETURNING id INTO v_jur_id;

  INSERT INTO public.profiles (id, email, role, nome_completo)
  VALUES (v_jur_id, 'juridico@flechabsb.com', 'ADMIN_GLOBAL', 'Jurídico / Compliance')
  ON CONFLICT (id) DO UPDATE SET role = 'ADMIN_GLOBAL';

  -- SOCIO
  v_socio_id := gen_random_uuid();
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
  VALUES (v_socio_id, '00000000-0000-0000-0000-000000000000', 'socio@flechabsb.com', crypt('auditvault', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated')
  ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('auditvault', gen_salt('bf')), email_confirmed_at = now()
  RETURNING id INTO v_socio_id;

  INSERT INTO public.profiles (id, email, role, nome_completo)
  VALUES (v_socio_id, 'socio@flechabsb.com', 'ADMIN_GLOBAL', 'Sócio / Auditoria')
  ON CONFLICT (id) DO UPDATE SET role = 'ADMIN_GLOBAL';

  -- OPERACOES
  v_ops_id := gen_random_uuid();
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
  VALUES (v_ops_id, '00000000-0000-0000-0000-000000000000', 'operacional@flechabsb.com', crypt('opsvault', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated')
  ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('opsvault', gen_salt('bf')), email_confirmed_at = now()
  RETURNING id INTO v_ops_id;

  INSERT INTO public.profiles (id, email, role, nome_completo)
  VALUES (v_ops_id, 'operacional@flechabsb.com', 'FEDERACAO', 'Operações / Campo & Técnico')
  ON CONFLICT (id) DO UPDATE SET role = 'FEDERACAO';

END $$;
