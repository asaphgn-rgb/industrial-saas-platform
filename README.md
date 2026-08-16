# SaaS Industrial & SGQ ISO 9001 - Plataforma Multi-Tenant

## Visão Geral
Plataforma SaaS corporativa e industrial desenvolvida para gerenciamento completo de manufatura (MOM/MES), apontamento de produção, cálculo de OEE em tempo real, manutenção preditiva/preventiva (PCM) e conformidade estrita com o Sistema de Gestão da Qualidade (**ISO 9001:2015**).

---

## Principais Recursos
- **Fundação Multi-Tenant Enterprise**: Isolamento total de dados entre organizações através de PostgreSQL Row Level Security (RLS).
- **Alinhamento ISA-95 (IEC 62264)**: Modelagem fabril de Nível 3/4 com gestão de unidades, plantas, centros de trabalho e ordens de produção.
- **SGQ & ISO 9001 Parametrizável**: Controle de documentos (7.5), gestão de não conformidades e CAPA (8.7/10.2), calibrações e rastreabilidade total de lote.
- **Trilha de Auditoria Imutável**: Registro à prova de adulteração de todas as operações críticas do sistema.
- **Integração IT/OT Segura**: Arquitetura pronta para Edge Gateway com protocolos industriais (OPC UA, MQTT, Modbus) sem exposição de CLPs à internet pública.

---

## Estrutura do Repositório
```
├── .claude/              # Configurações de governança e 14 Agentes Especializados
├── .github/workflows/    # Pipelines automatizados de CI/CD para DEV, HML e PROD
├── docs/                 # Documentação técnica viva (Arquitetura, Segurança, ISO 9001, ADRs)
├── src/                  # Código-fonte da aplicação React/TypeScript
├── supabase/             # Migrations versionadas, RLS e Edge Functions
└── tests/                # Testes unitários, de integração, SGQ e validação de RLS
```

---

## Como Executar Localmente

1. **Clone o repositório**:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd CLAUDE-TESTE
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env.local
   ```

4. **Inicie o Supabase Local**:
   ```bash
   npx supabase start
   ```

5. **Execute os testes**:
   ```bash
   npm run test
   ```
