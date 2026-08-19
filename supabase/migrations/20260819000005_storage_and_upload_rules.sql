-- Migration: Storage Rules for Document Uploads
-- Description: Creates a storage bucket for secure documents and applies RLS

BEGIN;

-- 1. Inserir bucket se nao existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('secure_documents', 'secure_documents', false)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS do Storage
-- Somente usuarios autenticados podem interagir com os objetos (base RLS)
-- No Supabase Storage, a tabela que rege os arquivos é 'storage.objects'

-- Política: Usuário pode fazer upload apenas para pastas nomeadas com seu tenant_id
-- Exemplo de path: "tenant-uuid/laudos/nome-do-arquivo.pdf"
CREATE POLICY "Tenant users can upload their own documents" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'secure_documents' 
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = (SELECT tenant_id::text FROM public.users WHERE id = auth.uid())
    );

-- Política: Usuário pode ler arquivos que estão dentro da pasta do seu tenant_id
CREATE POLICY "Tenant users can read their own documents" ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'secure_documents'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = (SELECT tenant_id::text FROM public.users WHERE id = auth.uid())
    );

-- Política: Usuário pode apagar arquivos que estão dentro da pasta do seu tenant_id
CREATE POLICY "Tenant users can delete their own documents" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'secure_documents'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = (SELECT tenant_id::text FROM public.users WHERE id = auth.uid())
    );

COMMIT;
