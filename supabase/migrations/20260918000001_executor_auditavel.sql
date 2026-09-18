-- Governança auditável para comandos GPT -> GitHub -> Supabase.
-- Esta migration não executa mudanças diretamente na branch main.

CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{3,80}$'),
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 3 AND 160),
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  codigo text NOT NULL CHECK (codigo ~ '^[a-z0-9._-]{3,80}$'),
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 3 AND 120),
  descricao text,
  system_role boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, codigo)
);

CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  UNIQUE (organization_id, profile_id)
);

CREATE TABLE IF NOT EXISTS public.organization_role_permissions (
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  requested_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  approved_by uuid REFERENCES public.profiles(id) ON DELETE RESTRICT,
  command_type text NOT NULL CHECK (command_type IN ('github_change')),
  payload jsonb NOT NULL,
  payload_sha256 text NOT NULL CHECK (payload_sha256 ~ '^[a-f0-9]{64}$'),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXECUTING', 'EXECUTED', 'FAILED')),
  justification text NOT NULL CHECK (char_length(justification) BETWEEN 3 AND 2000),
  review_note text,
  execution_result jsonb,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  executed_at timestamptz,
  CHECK (jsonb_typeof(payload) = 'object')
);

CREATE TABLE IF NOT EXISTS public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approval_request_id uuid REFERENCES public.approval_requests(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type ~ '^[a-z0-9._-]{3,100}$'),
  outcome text NOT NULL CHECK (outcome IN ('SUCCESS', 'FAILURE', 'DENIED')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memberships_profile_organization ON public.memberships(profile_id, organization_id) WHERE ativo;
CREATE INDEX IF NOT EXISTS idx_approval_requests_queue ON public.approval_requests(organization_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_organization_created ON public.audit_events(organization_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.app_is_organization_member(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships m
    WHERE m.organization_id = p_organization_id
      AND m.profile_id = auth.uid()
      AND m.ativo = true
      AND m.revoked_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.app_has_permission(p_organization_id uuid, p_permission_code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships m
    JOIN public.organization_role_permissions rp ON rp.role_id = m.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE m.organization_id = p_organization_id
      AND m.profile_id = auth.uid()
      AND m.ativo = true
      AND m.revoked_at IS NULL
      AND p.code = p_permission_code
  );
$$;

CREATE OR REPLACE FUNCTION public.prevent_audit_event_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_events é imutável';
END;
$$;

DROP TRIGGER IF EXISTS prevent_audit_event_mutation ON public.audit_events;
CREATE TRIGGER prevent_audit_event_mutation
BEFORE UPDATE OR DELETE ON public.audit_events
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_event_mutation();

CREATE OR REPLACE FUNCTION public.claim_approved_command(p_approval_id uuid)
RETURNS public.approval_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request public.approval_requests;
BEGIN
  SELECT * INTO v_request
  FROM public.approval_requests
  WHERE id = p_approval_id
    AND requested_by = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Solicitação não encontrada ou não pertence ao usuário autenticado';
  END IF;

  IF v_request.status <> 'APPROVED' OR v_request.expires_at <= now() THEN
    RAISE EXCEPTION 'Solicitação não está aprovada ou expirou';
  END IF;

  UPDATE public.approval_requests
  SET status = 'EXECUTING'
  WHERE id = p_approval_id
  RETURNING * INTO v_request;

  RETURN v_request;
END;
$$;

REVOKE ALL ON FUNCTION public.app_is_organization_member(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.app_has_permission(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_approved_command(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.app_is_organization_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.app_has_permission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_approved_command(uuid) TO authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "permissions_authenticated_read" ON public.permissions;
CREATE POLICY "permissions_authenticated_read"
ON public.permissions FOR SELECT TO authenticated
USING (true);

CREATE POLICY "organizations_member_read"
ON public.organizations FOR SELECT TO authenticated
USING (public.app_is_organization_member(id));

CREATE POLICY "roles_member_read"
ON public.roles FOR SELECT TO authenticated
USING (public.app_is_organization_member(organization_id));

CREATE POLICY "memberships_member_read"
ON public.memberships FOR SELECT TO authenticated
USING (profile_id = auth.uid() OR public.app_has_permission(organization_id, 'membership.manage'));

CREATE POLICY "role_permissions_member_read"
ON public.organization_role_permissions FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.roles r
    WHERE r.id = role_id
      AND public.app_is_organization_member(r.organization_id)
  )
);

CREATE POLICY "approval_requests_requester_read"
ON public.approval_requests FOR SELECT TO authenticated
USING (
  requested_by = auth.uid()
  OR public.app_has_permission(organization_id, 'executor.approve')
);

CREATE POLICY "approval_requests_requester_create"
ON public.approval_requests FOR INSERT TO authenticated
WITH CHECK (
  requested_by = auth.uid()
  AND public.app_has_permission(organization_id, 'executor.request')
  AND status = 'PENDING'
  AND approved_by IS NULL
);

CREATE POLICY "approval_requests_requester_cancel"
ON public.approval_requests FOR UPDATE TO authenticated
USING (requested_by = auth.uid() AND status = 'PENDING')
WITH CHECK (
  requested_by = auth.uid()
  AND status = 'CANCELLED'
  AND approved_by IS NULL
);

CREATE POLICY "approval_requests_approver_decide"
ON public.approval_requests FOR UPDATE TO authenticated
USING (public.app_has_permission(organization_id, 'executor.approve') AND status = 'PENDING')
WITH CHECK (
  public.app_has_permission(organization_id, 'executor.approve')
  AND status IN ('APPROVED', 'REJECTED')
  AND approved_by = auth.uid()
);

CREATE POLICY "audit_events_member_read"
ON public.audit_events FOR SELECT TO authenticated
USING (
  actor_id = auth.uid()
  OR public.app_has_permission(organization_id, 'audit.read')
);

INSERT INTO public.permissions (code, module, action, description)
VALUES
  ('executor.request', 'executor', 'request', 'Solicitar alteração auditável'),
  ('executor.approve', 'executor', 'approve', 'Aprovar alteração auditável'),
  ('audit.read', 'audit', 'read', 'Consultar trilha de auditoria'),
  ('membership.manage', 'membership', 'manage', 'Gerenciar membros e papéis')
ON CONFLICT (code) DO NOTHING;
