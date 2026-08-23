-- Migration 02: Tabela de Notificações para Monitoramento Global (Fase 6)

CREATE TYPE notification_type AS ENUM ('INFO', 'WARNING', 'SUCCESS', 'ERROR');
CREATE TYPE notification_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TABLE notificacoes_admin_global (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'INFO',
    priority notification_priority DEFAULT 'MEDIUM',
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE notificacoes_admin_global ENABLE ROW LEVEL SECURITY;

-- Políticas (Apenas Admin Global pode ver e gerenciar todas as notificações)
CREATE POLICY "Admin Global gerencia notificações do sistema" 
ON notificacoes_admin_global FOR ALL 
USING (auth_user_role() = 'ADMIN_GLOBAL');

-- A tabela é essencialmente append-only para as outras roles por meio da Edge Function.
