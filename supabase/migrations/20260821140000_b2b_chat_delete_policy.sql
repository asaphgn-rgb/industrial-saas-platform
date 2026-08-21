-- Liberar politicas de RLS para exclusao de mensagens na tabela de chat
DROP POLICY IF EXISTS "Usuários podem ver mensagens da sua sala no seu tenant" ON public.b2b_secure_chat;
DROP POLICY IF EXISTS "Usuários podem inserir mensagens" ON public.b2b_secure_chat;
DROP POLICY IF EXISTS "b2b_chat_select_all" ON public.b2b_secure_chat;
DROP POLICY IF EXISTS "b2b_chat_insert_all" ON public.b2b_secure_chat;
DROP POLICY IF EXISTS "b2b_chat_delete_all" ON public.b2b_secure_chat;

CREATE POLICY "b2b_chat_select_all" ON public.b2b_secure_chat FOR SELECT USING (true);
CREATE POLICY "b2b_chat_insert_all" ON public.b2b_secure_chat FOR INSERT WITH CHECK (true);
CREATE POLICY "b2b_chat_delete_all" ON public.b2b_secure_chat FOR DELETE USING (true);
