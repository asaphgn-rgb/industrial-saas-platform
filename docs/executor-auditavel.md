# Executor auditável

O executor recebe somente solicitações previamente aprovadas e sempre cria uma branch `agent/<id-da-solicitação>` a partir da `main`, seguida de Pull Request em rascunho. Ele nunca atualiza a `main`.

## Sequência

1. Um usuário autenticado, com `executor.request`, cria uma entrada `PENDING` em `approval_requests`.
2. Um usuário diferente, com `executor.approve`, aprova ou rejeita a solicitação.
3. O cliente chama a Edge Function `executar-comando` com somente `approval_request_id`.
4. A função reivindica a aprovação de forma atômica, valida o payload, cria branch, commit e PR em rascunho.
5. Resultado ou falha é gravado de forma imutável em `audit_events`.

## Secrets da Edge Function

Defina diretamente no cofre do Supabase; não coloque valores em `.env`, commits, Pull Requests, logs ou chat:

- `GITHUB_TOKEN`: token fine-grained limitado ao repositório permitido, com Contents: Read/Write e Pull requests: Read/Write.
- `GITHUB_ALLOWED_REPOSITORY`: `proprietario/repositorio`.
- `ALLOWED_ORIGINS`: lista separada por vírgulas dos domínios do portal.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`: fornecidos pelo ambiente Supabase.

## Implantação

1. Aplicar a migration primeiro em ambiente de preview.
2. Criar os papéis da organização e mapear permissões.
3. Configurar os secrets no painel seguro do Supabase.
4. Publicar a função `executar-comando`.
5. Executar teste com uma alteração não sensível e validar branch, PR e `audit_events`.
6. Só então habilitar o fluxo de produção.

A função restringe alterações a `src/`, `docs/`, `tests/`, `supabase/migrations/` e `index.html`. Mudanças em workflows, configurações de infraestrutura, secrets e `main` ficam fora do escopo do executor.
