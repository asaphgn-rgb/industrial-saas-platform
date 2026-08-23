# CLAUDE.md - Diretrizes Técnicas, Arquitetura e Governança

## 0. Idioma Obrigatório
- **TODA comunicação do assistente DEVE ser exclusivamente em Português (Brasil).**
- Isso inclui: respostas, comentários de código, mensagens de commit, nomes de variáveis descritivas, labels de UI, alertas e logs voltados ao usuário.
- NUNCA responda em inglês, a menos que o usuário solicite explicitamente.

## 1. Visão Geral do Sistema
Este repositório contém o **MORAR BEM BRASIL / PLATAFORMA DIAMOND**, uma plataforma SaaS fintech habitacional para gestão completa de:
Administração Global, Federações, Associações, Associados, Cadastro habitacional, Upload documental, Pastas digitais, Backup geral, Pré-análise de crédito, Consulta SPC/Serasa, Score, Produtos (disponíveis, desejados, personalizados), Contratos digitais, CRM comercial, Transações, Comissões, IA flutuante, Auditoria e LGPD.

## 2. Princípios Inegociáveis de Arquitetura & Segurança

1. **Stack Obrigatória:** React, TypeScript, Tailwind CSS, Supabase, PostgreSQL, Supabase Auth, RLS, Storage Privado, Edge Functions.
2. **Segurança de Dados e Segredos:**
   - NUNCA comite arquivos `.env`, `.env.local` ou credenciais em texto plano.
   - NUNCA exponha CPF, CNPJ, tokens, senhas ou documentos.
   - A `service_role_key` NUNCA deve ser exposta no código frontend ou enviada ao cliente.
3. **Isolamento de Dados (RLS Obrigatório):**
   - O Row Level Security (RLS) DEVE estar permanentemente ativado em 100% das tabelas sensíveis.
   - Nenhuma tabela sensível pode ficar sem RLS. NUNCA desabilite o RLS.
4. **Armazenamento Seguro:** 
   - Storage privado obrigatório. NENHUM documento público.
5. **Privacidade e LGPD:**
   - Consulta de crédito SOMENTE com consentimento ativo. CPF e CNPJ devem ser mascarados nas interfaces.
6. **Integridade de Informações Habitacionais/Financeiras:**
   - NENHUMA aprovação bancária definitiva deve ser prometida ou exibida. 
   - A pré-análise é EXCLUSIVAMENTE consultiva.

## 3. Hierarquia RBAC Obrigatória (Controle de Acesso)

O sistema segue uma estrutura hierárquica estrita: **Admin Global -> Federação -> Associação -> Associado**

1. **Admin Global:** Visualiza e gerencia 100% do sistema, cadastra qualquer nível, bloqueia/libera acessos, gerencia produtos exclusivos e configurações globais.
2. **Federação:** Visualiza e gerencia apenas a sua própria Federação, suas Associações vinculadas e seus dados. Pode cadastrar apenas suas Associações.
3. **Associação:** Visualiza apenas a própria Associação e os Associados vinculados a ela. Pode cadastrar apenas seus Associados.
4. **Associado:** Visualiza apenas os seus próprios dados, pasta digital, produtos e status. Não pode visualizar outros associados. Não cadastra usuários.

## 4. UI e Navegação

- **Menu Lateral Obrigatório:** Nenhuma página autenticada pode existir sem menu lateral. O menu deve ser responsivo e adaptado por perfil de usuário.
- **Não criar apenas telas visuais:** Não deixar botões sem função. Dados falsos em dashboards sem indicação clara de mock são proibidos. Nenhuma rota sem proteção.

## 5. Fluxo de Desenvolvimento e Fases

O desenvolvimento segue uma estrutura rigorosa de fases (Fase 1 à Fase 23, conforme definido no prompt original). Regras para evolução de código:
- Crie código modular, limpo, componentizado, reaproveitável e profissional.
- Antes de instalar qualquer biblioteca, verificar a real necessidade.
- Testes rigorosos em cada etapa, com validação de RLS e políticas de segurança.
- As mudanças no banco (Supabase) DEVEM sempre ser feitas via migrations locais (`supabase/migrations/`).

## 6. Trilha de Auditoria e Notificações (Audit Trail & Logs)

- Modificações sensíveis (criação de usuários, consultas, bloqueios, upload documental, contratos) devem gerar registros na trilha de auditoria e emitir notificações para a Administração Global quando aplicável.
- **Eventos Críticos:** Toda a trilha de acesso, aceite de LGPD, e visualização de dados devem possuir registro imutável com data, hora, IP, user_agent e status.

## 7. Regras de Blindagem Existentes (Manter)
- **NÃO ALTERE O MOTOR DE SINCRONIZAÇÃO `ntfySync.ts` (se existir/utilizado):** O sistema de chat criptografado opera perfeitamente sobre WebSocket via Porta 443 usando `ntfy.sh`. Sob nenhuma hipótese reverta para Supabase Broadcast, KVDB, Polling ou MQTT, pois isso causará quebra de firewall no 4G e bloqueios de Rate Limit por IP. Esta arquitetura está TRAVADA e HOMOLOGADA.