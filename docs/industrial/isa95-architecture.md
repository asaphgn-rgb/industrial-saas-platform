# Arquitetura Industrial ISA-95 e Integração IT/OT

## 1. Visão Geral
A arquitetura do sistema segue rigorosamente o padrão **ANSI/ISA-95 (IEC 62264)** para integração de sistemas de controle empresarial e chão de fábrica.

```
+-------------------------------------------------------------------------+
| NÍVEL 4: ERP / Administrativo / Financeiro / Comercial                  |
| (Planejamento de Recursos, Contabilidade, Vendas, Faturamento)          |
+-------------------------------------------------------------------------+
                                  ▲
                                  │ APIs REST / Webhooks / GraphQL
                                  ▼
+-------------------------------------------------------------------------+
| NÍVEL 3: SaaS Industrial (MOM/MES) & SGQ ISO 9001                      |
| - Programação da Produção & PCP        - Não Conformidades & CAPA       |
| - Apontamento & Ordens de Produção     - Controle Documental            |
| - Cálculo de OEE, Paradas e Scrap      - Rastreabilidade de Lote        |
| - Manutenção Preventiva / PCM          - Calibração de Instrumentos     |
+-------------------------------------------------------------------------+
                                  ▲
                                  │ HTTPS / WebSockets / mTLS (JSON)
                                  ▼
+-------------------------------------------------------------------------+
| INDUSTRIAL EDGE GATEWAY (Isolamento de Rede Fabril)                     |
| - Buffer Local & Offline-First          - Normalização de Telemetria    |
| - Criptografia ponta a ponta           - Gerenciamento de Conectores   |
+-------------------------------------------------------------------------+
                                  ▲
                                  │ OPC UA / MQTT / Modbus TCP / Profinet
                                  ▼
+-------------------------------------------------------------------------+
| NÍVEIS 1 & 2: Automação & Chão de Fábrica (OT)                          |
| - CLPs (Siemens S7, Rockwell ControlLogix, Schneider Modicon)           |
| - IHM, Sensores, Balanças, Medidores de Energia, Scanners               |
+-------------------------------------------------------------------------+
```

---

## 2. Princípio de Segurança OT: Zona Desmilitarizada (DMZ) Fabril
- Dispositivos de nível 1 e 2 **NUNCA** devem possuir IP público ou conexão direta com a internet.
- O **Industrial Edge Gateway** atua como único ponto de coleta e encaminhamento, estabelecendo túnel seguro de saída (outbound-only) em direção à nuvem.
