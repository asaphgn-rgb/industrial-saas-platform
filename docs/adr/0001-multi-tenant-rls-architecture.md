# ADR 001: Arquitetura Multi-Tenant com Row Level Security (RLS) no PostgreSQL/Supabase

## Status
Aceito (2026-08-15)

## Contexto
O SaaS Industrial & SGQ ISO 9001 atenderá múltiplos grupos empresariais, plantas fabris e unidades operacionais. Era necessário decidir entre:
1. **Banco de Dados Isolado por Tenant (Database-per-tenant)**: Maior isolamento físico, porém alto custo de infraestrutura e complexidade de manutenção/migrations.
2. **Schema Separado por Tenant (Schema-per-tenant)**: Dificuldade de escalabilidade e complexidade no gerenciamento de migrações dinâmicas.
3. **Tabelas Compartilhadas com RLS (Row Level Security)**: Isolamento a nível de linha no PostgreSQL com alta eficiência de recursos, manutenibilidade simplificada e garantia criptográfica/lógica de isolamento.

## Decisão
Adotar **Tabelas Compartilhadas com Row Level Security (RLS)** nativo do PostgreSQL/Supabase. Todas as tabelas públicas de negócio devem ter a coluna `tenant_id UUID NOT NULL` com políticas RLS obrigatórias.

## Consequências
- **Positivas**: Migrações centralizadas, menor custo de infraestrutura, facilidade de auditoria e escalabilidade horizontal.
- **Mitigações de Risco**: Testes automatizados contínuos de RLS (`tests/rls/`) rodando no pipeline de CI para garantir que nenhuma consulta vaze dados entre organizações.
