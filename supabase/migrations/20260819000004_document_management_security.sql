-- Migration: Document Management & Extreme Security (Anti-Brute Force)
-- Description: Enhances the system for grouped documents, Kanban relations, and failed login tracking

BEGIN;

-- ==============================================================================
-- 1. SECURITY: ANTI-BRUTE FORCE / WIPE DATA
-- ==============================================================================

-- We add a table to track failed login attempts per email/user for the extreme security requirement
CREATE TABLE IF NOT EXISTS public.security_login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_at TIMESTAMPTZ,
    UNIQUE(email)
);

-- ==============================================================================
-- 2. DOCUMENT MANAGEMENT & GROUPING
-- ==============================================================================

-- 2.1 Table: document_groups (Assunto e ligação direta)
CREATE TABLE IF NOT EXISTS public.document_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "Matrículas e Certidões", "Laudos Técnicos", "CAR e Meio Ambiente"
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Relational mapping for existing 'documents' table to groups and kanban cards
-- Assuming a documents table exists or will exist in this schema standard
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    document_group_id UUID REFERENCES public.document_groups(id) ON DELETE SET NULL,
    kanban_card_id UUID REFERENCES public.kanban_cards(id) ON DELETE SET NULL,
    chat_room_id UUID REFERENCES public.chat_rooms(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.security_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. RLS POLICIES
-- ==============================================================================

-- security_login_attempts: Only accessible by service role or admins (not normal users)
-- Normal users should NOT be able to read this table to prevent enumeration
CREATE POLICY "Service role and admins can manage login attempts" ON public.security_login_attempts
    FOR ALL USING (auth.role() = 'service_role');

-- document_groups: Users can view/manage groups in their tenant
CREATE POLICY "Users can view document groups in their tenant" ON public.document_groups
    FOR SELECT
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can manage document groups in their tenant" ON public.document_groups
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- documents: Users can view/manage documents in their tenant 
-- (Additional restrictions can be applied based on chat_room participation if needed)
CREATE POLICY "Users can view documents in their tenant" ON public.documents
    FOR SELECT
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can manage documents in their tenant" ON public.documents
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- ==============================================================================
-- 5. AUDIT LOG TRIGGERS
-- ==============================================================================
CREATE TRIGGER audit_document_groups_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.document_groups
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_documents_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- ==============================================================================
-- 6. REALTIME REPLICATION
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;

COMMIT;
