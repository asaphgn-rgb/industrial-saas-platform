-- Tabela para armazenar as mensagens do Chat E2E de forma efêmera no backend
CREATE TABLE IF NOT EXISTS public.b2b_secure_chat (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  room_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  sender_name text NOT NULL,
  sender_role text NOT NULL,
  content text NOT NULL, -- será gravado E2E encriptado
  audio_data text, -- base64 (opcional)
  attachment_url text, -- base64 (opcional)
  attachment_type text, -- 'image', 'pdf', 'audio'
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.b2b_secure_chat ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Usuários podem ver mensagens da sua sala no seu tenant" 
ON public.b2b_secure_chat FOR SELECT 
USING (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE id = auth.uid()));

CREATE POLICY "Usuários podem inserir mensagens" 
ON public.b2b_secure_chat FOR INSERT 
WITH CHECK (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE id = auth.uid()));

-- Habilitar replicação Realtime do Supabase para esta tabela
ALTER PUBLICATION supabase_realtime ADD TABLE public.b2b_secure_chat;
