# Módulo de Comunicação Restrita e Gestão Documental

Atendendo aos requisitos do "SaaS Industrial Secreto":

## 1. Segurança Anti-Brute Force (Wipe Data)
- **Tabela:** `security_login_attempts`
- **Edge Function:** `verify-login` verifica as tentativas de login.
- **Frontend Wipe:** O serviço `SecureAuthService.ts` aciona a Edge Function após o login do Supabase. Se retornar bloqueado (2 falhas), ele invoca a função `performLocalWipe()`, que limpa instantaneamente o `localStorage`, `sessionStorage` e redireciona o usuário (simulando a desinstalação de um app via navegador/PWA).

## 2. Comunicação Restrita (Chat)
- As tabelas `chat_rooms`, `chat_participants` e `chat_messages` possuem **RLS Extremo**: um usuário só consegue acessar e ler mensagens de salas onde foi explicitamente adicionado como participante na tabela `chat_participants`.
- Relaciona-se com a trigger de auditoria para atender à ISO 9001 (embora o conteúdo do chat não vá para o log para não inchar o DB, a criação/remoção de salas e participantes é auditada).

## 3. Gestão e Relacionamento de Documentos (Kanban e Upload Inteligente)
- **Tabela:** `document_groups` e `documents` (com referências a `chat_room_id` e `kanban_card_id`).
- Permite que documentos confidenciais de transações de terra, laudos, CAR, etc., transitem na mesma esteira visual (Kanban) ou sejam trocados em uma sala de chat restrita (negociações).
- Os documentos herdam as políticas do tenant_id. A gestão completa via pipeline (Kanban) foi estabelecida pelas tabelas `kanban_boards`, `kanban_columns` e `kanban_cards`.
- **Inteligência Consultiva no Upload:** A página `SecureUploadPage` varre o nome e o tipo do arquivo em tempo real (ex: CAR, Matrícula, Laudo, CCIR) e *recomenda agrupamentos e passos no Kanban*, atuando como um consultor e ajudando na tomada de decisões.
- **Storage Seguro (Cofre):** Criação do bucket privado `secure_documents` e políticas restritas `tenant_id` garantindo isolamento total de disco.

## 4. Frontend e Interface (React + Tailwind)
Foram desenvolvidos componentes de interface de alto nível focados na experiência do usuário e na segurança:
- **`SecureChat.tsx`**: Interface similar ao WhatsApp Web, porém com comunicação blindada e suporte a websockets (Realtime).
- **`KanbanBoard.tsx`**: Pipeline visual de processos, laudos e documentos via Drag & Drop.
- **`SecureUploadPage.tsx`**: Tela com área de soltar arquivos e feedback automático consultivo (parecer técnico simulado).
