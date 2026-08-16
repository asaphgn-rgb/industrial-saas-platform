# CLAUDE.md - Diretrizes Técnicas e de Governança

## 1. Visão Geral do Sistema
Este repositório contém a fundação do **SaaS Industrial & SGQ ISO 9001**, uma plataforma multi-tenant de missão crítica voltada para gestão fabril (MES/MOM), controle de qualidade, manutenção (PCM), rastreabilidade de lote e conformidade estrita com a norma **ISO 9001:2015**.

---

## 2. Princípios Inegociáveis de Arquitetura & Segurança

1. **Isolamento Multi-Tenant Estrito**:
   - Todas as tabelas de negócio DEVEM conter `tenant_id UUID NOT NULL REFERENCES tenants(id)`.
   - NUNCA execute consultas ou mutações sem filtrar pelo `tenant_id` do usuário autenticado.
   - O Row Level Security (RLS) DEVE estar permanentemente ativado em 100% das tabelas públicas.
   - NUNCA desabilite o RLS para contornar problemas de desenvolvimento.

2. **Segregação de Ambientes**:
   - **LOCAL / DEV**: Ambiente de desenvolvimento, migrations locais e testes unitários/integrados.
   - **HML / STAGING**: Ambiente espelho de produção para homologação, QA e validação de cliente.
   - **PROD**: Ambiente de produção estritamente protegido. Alterações diretas em PROD são PROIBIDAS.

3. **Gestão de Segredos & Credenciais**:
   - NUNCA comite arquivos `.env`, `.env.local` ou credenciais em texto plano.
   - A `service_role_key` do Supabase NUNCA deve ser exposta no código frontend ou enviada ao cliente.
   - Utilize variáveis de ambiente injetadas via GitHub Secrets / Supabase Secrets.

4. **Trilha de Auditoria Imutável (Audit Trail)**:
   - Toda alteração em registros críticos do SGQ (não conformidades, documentos, inspeções de lote) deve registrar:
     * **Quem** (`user_id`), **O quê** (`table_name`, `record_id`, `action`), **Quando** (`created_at`), **Dados anteriores** (`old_data`), **Novos dados** (`new_data`) e **Justificativa** (`reason`).
   - A tabela `audit_logs` é estritamente imutável (gatilho bloqueia UPDATE e DELETE).

---

## 3. Padrões de Código e Stack Tecnológica

- **Frontend**: React 18 / Vite / TypeScript / Tailwind CSS / Lucide React / TanStack Query.
- **Backend / Database**: Supabase (PostgreSQL 15+ / Auth / Storage / Edge Functions).
- **Validação de Schemas**: Zod para todas as entradas de usuário e respostas de API.
- **Testes**: Vitest + React Testing Library + testes dedicados de isolamento RLS.
- **Conformidade Industrial**: ISA-95 (Enterprise > Site > Area > Work Center > Work Unit).

---

## 4. Fluxo de Trabalho Git (Branch Strategy)

- `main`: Código em produção. Protegido contra commits diretos e force-push.
- `develop`: Integração contínua e homologação (Staging).
- `feature/<nome-da-feature>`: Branches criadas a partir de `develop` para desenvolvimento de novas capacidades.
- `hotfix/<correcao-emergencial>`: Branches criadas a partir de `main` para correção de incidentes críticos em produção.

---

## 5. Procedimentos de Modificação e Migrations no Supabase

1. Sempre crie migrations versionadas em `supabase/migrations/<timestamp>_<nome_descritivo>.sql`.
2. Nunca altere o schema diretamente no painel do Supabase sem gerar a migration correspondente.
3. Toda migration deve incluir políticas de RLS e índices correspondentes.
4. Execute `npm run test:rls` antes de submeter qualquer Pull Request com alterações de banco.

---

## 6. Comportamento Obrigatório do Agente / Assistente

- **Análise Prévia**: Entenda o impacto em multi-tenancy e segurança antes de sugerir código.
- **Testes pós-mudança**: Valide a compilação (`npm run typecheck`) e execute testes unitários.
- **Revisão de Diff**: Garanta que nenhum arquivo temporário, secret ou dependência desnecessária seja incluído.
