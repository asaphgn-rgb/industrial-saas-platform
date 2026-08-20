-- Migração para Controle de Acesso Ativo (RBAC) de Data Rooms Virtuais
-- Garante persistência global dos botões de Toggle do CEO.

CREATE TABLE IF NOT EXISTS vdr_access_control (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    data_room_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    revoked_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, data_room_name, user_email)
);

-- Ativa o RLS
ALTER TABLE vdr_access_control ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS:
-- 1. Qualquer usuário do Tenant pode "Ler" os acessos do Data Room (Para o Login conseguir saber se foi revogado ou não)
CREATE POLICY "Leitura de acessos do tenant"
ON vdr_access_control FOR SELECT
USING (tenant_id = 'tenant-industrial-demo-uuid'::uuid);

-- 2. Apenas Roles administrativas ou o backend autorizado podem Inserir/Atualizar
-- (Neste sistema demo, como o CEO usa chave JWT anon, abriremos para o Tenant na inserção, mas na prática
-- deveria requerer uma Claim de JWT especial). Para a demo B2B rodar sem fricção, liberaremos Upsert para o próprio Tenant.
CREATE POLICY "Atualização de acessos pelo CEO"
ON vdr_access_control FOR INSERT
WITH CHECK (tenant_id = 'tenant-industrial-demo-uuid'::uuid);

CREATE POLICY "Modificação de acessos pelo CEO"
ON vdr_access_control FOR UPDATE
USING (tenant_id = 'tenant-industrial-demo-uuid'::uuid);

-- Insere o estado padrão para a sala de REGULARIZAÇÃO para todos os usuários oficiais (Todos Liberados)
INSERT INTO vdr_access_control (tenant_id, data_room_name, user_email, is_revoked)
VALUES
    ('tenant-industrial-demo-uuid', 'REGULARIZAÇÃO', 'ceo@flechabsb.com', false),
    ('tenant-industrial-demo-uuid', 'REGULARIZAÇÃO', 'adm@flechabsb.com', false),
    ('tenant-industrial-demo-uuid', 'REGULARIZAÇÃO', 'juridico@flechabsb.com', false),
    ('tenant-industrial-demo-uuid', 'REGULARIZAÇÃO', 'socio@flechabsb.com', false),
    ('tenant-industrial-demo-uuid', 'REGULARIZAÇÃO', 'operacional@flechabsb.com', false)
ON CONFLICT (tenant_id, data_room_name, user_email) DO NOTHING;
