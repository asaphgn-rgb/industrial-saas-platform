import { describe, it, expect } from 'vitest';
import {
  CreateNonConformanceSchema,
  FiveWhysSchema,
  ActionPlan5W2HItemSchema,
  EffectivenessCheckSchema
} from '../../src/types/qms-capa.types';

describe('SGQ / ISO 9001 - Suíte de Validação CAPA & Não Conformidades', () => {
  it('deve validar abertura de Não Conformidade com dados obrigatórios da Cláusula 8.7', () => {
    const validPayload = {
      tenantId: '11111111-1111-1111-1111-111111111111',
      unitId: '22222222-2222-2222-2222-222222222222',
      code: 'NC-2026-001',
      title: 'Desvio dimensional no diâmetro externo da bucha de bronze',
      description: 'Durante a inspeção volante da Célula CNC 01, mediu-se +0.15mm acima da tolerância máxima.',
      source: 'PROCESSO_FABRIL' as const,
      severity: 'HIGH' as const,
      containmentActions: 'Lote segregado imediatamente no almoxarifado de quarentena com etiqueta vermelha.',
      reasonForOpening: 'Desvio reincidente detectado durante auditoria interna.'
    };

    const result = CreateNonConformanceSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar abertura de Não Conformidade sem justificativa de auditoria', () => {
    const invalidPayload = {
      tenantId: '11111111-1111-1111-1111-111111111111',
      unitId: '22222222-2222-2222-2222-222222222222',
      code: 'NC-2026-002',
      title: 'Título de Teste',
      description: 'Descrição de teste detalhada',
      source: 'AUDITORIA_INTERNA' as const,
      severity: 'LOW' as const,
      reasonForOpening: '' // Inválido (vazio)
    };

    const result = CreateNonConformanceSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it('deve validar estrutura de 5 Porquês com resumo conclusivo da causa raiz', () => {
    const fiveWhysData = {
      why1: 'A ferramenta de corte sofreu desgaste prematuro durante a usinagem.',
      why2: 'A refrigeração da máquina estava abaixo do fluxo ideal.',
      why3: 'O bocal injetor de fluido de corte estava parcialmente obstruído por cavacos.',
      why4: 'A limpeza do bocal não foi realizada no checklist de setup do turno.',
      why5: 'A instrução de trabalho de setup não detalhava a checagem da desobstrução do bocal.',
      rootCauseSummary: 'Ausência de ponto de controle explícito de desobstrução de refrigeração na Instrução de Trabalho IT-CNC-04.'
    };

    const result = FiveWhysSchema.safeParse(fiveWhysData);
    expect(result.success).toBe(true);
  });

  it('deve validar estrutura 5W2H do plano de ação corretiva', () => {
    const action5W2H = {
      id: '33333333-3333-3333-3333-333333333333',
      what: 'Revisar a Instrução de Trabalho IT-CNC-04 incluindo checagem obrigatória de vazão de fluido.',
      why: 'Garantir lubrificação contínua e evitar desgaste prematuro da ferramenta.',
      where: 'Célula de Usinagem CNC 01 e 02',
      when: '2026-08-20',
      who: 'Engenheiro de Processos (Carlos Silva)',
      how: 'Atualização no módulo de Documentos SGQ e treinamento com operadores.',
      howMuch: 'R$ 0,00',
      status: 'PENDING' as const
    };

    const result = ActionPlan5W2HItemSchema.safeParse(action5W2H);
    expect(result.success).toBe(true);
  });

  it('deve validar verificação de eficácia com evidências auditadas (Cláusula 10.2)', () => {
    const effectivenessData = {
      isEffective: true,
      evidenceDescription: 'Inspecionados 3 lotes subsequentes com 100% de conformidade dimensional e 0 desvios.',
      recurrenceObserved: false,
      verifiedBy: '44444444-4444-4444-4444-444444444444',
      verifiedAt: new Date().toISOString(),
      observations: 'Treinamento concluído com todos os operadores do turno A e B.'
    };

    const result = EffectivenessCheckSchema.safeParse(effectivenessData);
    expect(result.success).toBe(true);
  });
});
