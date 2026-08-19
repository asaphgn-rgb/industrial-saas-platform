-- Migration: Secure Communication & Kanban Module
-- Description: Creates tables and RLS policies for secure chat and kanban boards

BEGIN;

-- ==============================================================================
-- 1. CHAT MODULE (SECURE COMMUNICATION)
-- ==============================================================================

-- 1.1 Table: chat_rooms
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT,
    type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.2 Table: chat_participants
CREATE TABLE IF NOT EXISTS public.chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- 1.3 Table: chat_messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. KANBAN MODULE (PROCESSES & NEGOTIATIONS)
-- ==============================================================================

-- 2.1 Table: kanban_boards
CREATE TABLE IF NOT EXISTS public.kanban_boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Table: kanban_columns
CREATE TABLE IF NOT EXISTS public.kanban_columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    board_id UUID NOT NULL REFERENCES public.kanban_boards(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 Table: kanban_cards
CREATE TABLE IF NOT EXISTS public.kanban_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    board_id UUID NOT NULL REFERENCES public.kanban_boards(id) ON DELETE CASCADE,
    column_id UUID NOT NULL REFERENCES public.kanban_columns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_cards ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. RLS POLICIES
-- ==============================================================================

-- Helper function to check if user is participant of a room
CREATE OR REPLACE FUNCTION public.is_room_participant(room_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.chat_participants cp
    WHERE cp.room_id = $1
    AND cp.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- chat_rooms: Users can see rooms they are participants of
CREATE POLICY "Users can view rooms they participate in" ON public.chat_rooms
    FOR SELECT
    USING (public.is_room_participant(id) AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can create rooms in their tenant" ON public.chat_rooms
    FOR INSERT
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- chat_participants: Users can see participants of rooms they are in
CREATE POLICY "Users can view participants of their rooms" ON public.chat_participants
    FOR SELECT
    USING (public.is_room_participant(room_id) AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can add participants to their rooms" ON public.chat_participants
    FOR INSERT
    WITH CHECK (public.is_room_participant(room_id) AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- chat_messages: Users can read/write messages in rooms they participate in
CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages
    FOR SELECT
    USING (public.is_room_participant(room_id) AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can insert messages in their rooms" ON public.chat_messages
    FOR INSERT
    WITH CHECK (public.is_room_participant(room_id) AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND sender_id = auth.uid());

-- kanban_boards: Users can view/manage boards in their tenant
CREATE POLICY "Users can view boards in their tenant" ON public.kanban_boards
    FOR SELECT
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can manage boards in their tenant" ON public.kanban_boards
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- kanban_columns: Users can view/manage columns in their tenant
CREATE POLICY "Users can view columns in their tenant" ON public.kanban_columns
    FOR SELECT
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can manage columns in their tenant" ON public.kanban_columns
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- kanban_cards: Users can view/manage cards in their tenant
CREATE POLICY "Users can view cards in their tenant" ON public.kanban_cards
    FOR SELECT
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can manage cards in their tenant" ON public.kanban_cards
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- ==============================================================================
-- 5. AUDIT LOG TRIGGERS (ISO 9001 Compliance)
-- ==============================================================================
-- Assuming the audit log function 'public.log_audit_event' exists from previous migrations.

CREATE TRIGGER audit_chat_rooms_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.chat_rooms
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_chat_participants_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.chat_participants
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_kanban_boards_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.kanban_boards
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_kanban_columns_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.kanban_columns
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_kanban_cards_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.kanban_cards
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Note: We typically do not audit every single chat message content to avoid massive DB bloat,
-- but we audit the rooms and participants for security reasons.

-- ==============================================================================
-- 6. REALTIME REPLICATION
-- ==============================================================================
-- Enable Realtime for chat and kanban tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kanban_boards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kanban_columns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kanban_cards;

COMMIT;
