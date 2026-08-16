# Matriz de Segurança, Ameaças e Controles (ISO/IEC 27001 & OWASP)

## 1. Princípios Fundamentais
A plataforma SaaS Industrial foi concebida sob o modelo de **Zero Trust** e **Least Privilege** (Menor Privilégio), garantindo proteção em profundidade para dados operacionais e de qualidade.

---

## 2. Matriz de Ameaças e Controles

| ID | Vetor de Ameaça / Risco | Impacto | Controles Técnicos Implementados |
|---|---|---|---|
| **SEC-01** | Vazamento de dados entre Tenants (Cross-Tenant Data Leak) | Crítico | 1. `tenant_id` obrigatório em 100% das entidades.<br>2. Row Level Security (RLS) forçado no PostgreSQL.<br>3. Funções `SECURITY DEFINER` protegidas (`get_current_tenant_id()`). |
| **SEC-02** | Exposição de Credenciais Críticas (`service_role`, DB pass) | Crítico | 1. `.gitignore` rigoroso impedindo commit de `.env`.<br>2. `service_role` restrita a Edge Functions e scripts server-side seguros.<br>3. Auditoria contínua via CI. |
| **SEC-03** | Injeção de Dados / SQL Injection / XSS | Alto | 1. Consultas parametrizadas nativas do PostgreSQL/PostgREST.<br>2. Sanitização e validação de todas as entradas via schemas Zod.<br>3. Content Security Policy (CSP) no frontend. |
| **SEC-04** | Modificação ou Exclusão Indevida de Evidências SGQ | Alto | 1. Tabela `audit_logs` estritamente imutável (gatilho bloqueia UPDATE/DELETE).<br>2. Versionamento imutável de documentos e não conformidades. |
| **SEC-05** | Ataques de Chão de Fábrica / Invasão de Redes OT | Crítico | 1. Redes de CLPs isoladas sem saída direta para a Internet pública.<br>2. Comunicação intermediada exclusivamente por Edge Gateways autenticados com mTLS/JWT. |

---

## 3. Gestão de Segregação de Ambientes

```
[Desenvolvedor Local]
        │
        ▼ (PR / push develop)
[Ambiente DEV / STAGING] ──► Testes de Carga, Homologação e Validação SGQ
        │
        ▼ (Merge main + Aprovação Humana no GitHub Environment)
[Ambiente PRODUÇÃO] ───────► Alta Disponibilidade, RLS Ativo, Auditoria Imutável
```
