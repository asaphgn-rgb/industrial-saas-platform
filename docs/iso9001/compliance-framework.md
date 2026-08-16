# Sistema de Gestão da Qualidade (SGQ) - Alinhamento ISO 9001:2015

## 1. Estrutura Parametrizável de Conformidade
Para garantir flexibilidade sem engessar futuras revisões da norma, a plataforma modela os requisitos da **ISO 9001:2015** como módulos configuráveis e extensíveis.

---

## 2. Mapeamento de Requisitos e Implementação Técnica

| Cláusula ISO 9001 | Requisito da Norma | Módulo / Tabela no Sistema | Regra de Negócio & Rastreabilidade |
|---|---|---|---|
| **4. Contexto da Organização** | Compreensão da organização, partes interessadas e escopo. | `tenants`, `enterprise_units`, `departments` | Mapeamento da estrutura corporativa e suas plantas industriais. |
| **5. Liderança** | Política da qualidade e papéis organizacionais. | `user_profiles`, `role_permissions` | Definição clara de papéis e responsabilidades com RBAC. |
| **6. Planejamento** | Ações para abordar riscos e oportunidades, objetivos da qualidade. | `qms_risk_assessments` | Matriz de riscos com severidade, probabilidade e plano de mitigação. |
| **7. Apoio** | Controle de informação documentada e calibração de instrumentos. | `qms_documents`, `qms_calibrations` | Versionamento imutável de procedimentos, status de aprovação e prazos. |
| **8. Operação** | Planejamento, controle operacional e liberação de produtos. | `production_orders`, `qms_inspections` | Apontamento de produção, inspeções em linha e controle de lote. |
| **8.7 & 10.2** | Não Conformidades e Ação Corretiva (CAPA). | `qms_non_conformances` | Ciclo completo: Abertura -> Causa Raiz (5 Porquês/Ishikawa) -> Ação Corretiva -> Verificação de Eficácia. |
| **9. Avaliação de Desempenho** | Monitoramento, medição, análise e auditoria interna. | `industrial_work_centers` (OEE), `audit_logs` | Trilha de auditoria 100% rastreável (Quem, O quê, Quando, Onde e Por quê). |

---

## 3. Trilha de Auditoria Imutável (Audit Trail)
Toda transação no SGQ gera uma entrada em `audit_logs` que responde de forma incontestável:
1. **QUEM?** (`user_id` autenticado via Supabase Auth)
2. **O QUÊ?** (`table_name`, `record_id`, `action`)
3. **QUANDO?** (`created_at` timestamp UTC com precisão de microssegundos)
4. **ONDE?** (`tenant_id`, `unit_id`, `ip_address`)
5. **POR QUÊ?** (`reason` fornecido obrigatoriamente em alterações críticas)
6. **ANTES / DEPOIS?** (`old_data`, `new_data`, `diff` em formato JSONB)
