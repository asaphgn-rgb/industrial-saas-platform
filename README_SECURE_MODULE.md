# Módulo de Comunicação Restrita e Gestão Documental

Atendendo aos requisitos do "SaaS Industrial Secreto":

## 1. Segurança Anti-Brute Force (Wipe Data)
- **Tabela:** `security_login_attempts`
- **Edge Function:** `verify-login` verifica as tentativas de login.
- **Frontend Wipe:** O serviço `SecureAuthService.ts` aciona a Edge Function após o login do Supabase. Se retornar bloqueado (2 falhas), ele invoca a função `performLocalWipe()`, que limpa instantaneamente o `localStorage`, `sessionStorage` e redireciona o usuário (simulando a desinstalação de um app via navegador/PWA).

## 2. Comunicação Restrita (Chat)
- As tabelas `chat_rooms`, `chat_participants` e `chat_messages` possuem **RLS Extremo**: um usuário só consegue acessar e ler mensagens de salas onde foi explicitamente adicionado como participante na tabela `chat_participants`.
- Relaciona-se com a trigger de auditoria para atender à ISO 9001 (embora o conteúdo do chat não vá para o log para não inchar o DB, a criação/remoção de salas e participantes é auditada).

## 3. Gestão e Relacionamento de Documentos (Kanban)
- **Tabela:** `document_groups` e `documents` (com referências a `chat_room_id` e `kanban_card_id`).
- Permite que documentos confidenciais de transações de terra, laudos, CAR, etc., transitem na mesma esteira visual (Kanban) ou sejam trocados em uma sala de chat restrita (negociações).
- Os documentos herdam as políticas do tenant_id. A gestão completa via pipeline (Kanban) foi estabelecida pelas tabelas `kanban_boards`, `kanban_columns` e `kanban_cards`.

## Pendências Typescript no Repositório
Observou-se que o repositório atual possui falhas de tipagem no `src/services/` (`industrial-mes.service.ts`, `qms-capa.service.ts`, `qms-document.service.ts`) relacionadas aos tipos inferidos do schema do Supabase (argumentos sendo reconhecidos como `never`). Para resolver esses bugs, normalmente é necessário gerar as tipagens do Supabase novamente com `npx supabase gen types typescript --local > src/types/supabase.ts`, mas isso foge ao escopo estrito da implementação de backend solicitada nesta etapa.
