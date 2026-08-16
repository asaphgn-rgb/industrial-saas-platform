import { describe, it, expect } from 'vitest';
import { IndustrialMesService } from '../../src/services/industrial-mes.service';
import {
  ProductionEntrySchema,
  ScrapEntrySchema,
  DowntimeEntrySchema
} from '../../src/types/industrial-mes.types';

describe('MES & ISA-95 - Suíte de Testes de Chão de Fábrica e OEE', () => {
  it('deve calcular métricas de OEE com exatidão matemática (A x P x Q)', () => {
    // Cenário: Turno de 8h (480 min), 60 min de parada, capacidade nominal 60 pçs/h (1 pç/min)
    // Produzidas: 380 peças boas + 20 peças de refugo = 400 peças totais
    const metrics = IndustrialMesService.calculateOeeMetrics({
      plannedMinutes: 480,
      downtimeMinutes: 60,
      nominalHourlyCapacity: 60,
      goodParts: 380,
      scrapParts: 20
    });

    // 1. Disponibilidade = (420 / 480) * 100 = 87.5%
    expect(metrics.availability).toBe(87.5);

    // 2. Performance = (400 produzidas / 420 esperadas no tempo operacional) * 100 = 95.24%
    expect(metrics.performance).toBe(95.24);

    // 3. Qualidade = (380 boas / 400 totais) * 100 = 95.0%
    expect(metrics.quality).toBe(95.0);

    // 4. OEE Global = (0.875 * 0.95238 * 0.95) * 100 = 79.17%
    expect(metrics.oee).toBe(79.17);
    expect(metrics.actualProducedCount).toBe(400);
    expect(metrics.downtimeMinutes).toBe(60);
  });

  it('deve validar schema de apontamento de peças boas com crachá de operador', () => {
    const validEntry = {
      productionOrderId: '11111111-1111-1111-1111-111111111111',
      workCenterId: '22222222-2222-2222-2222-222222222222',
      tenantId: '33333333-3333-3333-3333-333333333333',
      unitId: '44444444-4444-4444-4444-444444444444',
      quantityProduced: 25,
      operatorBadge: 'OP-4102'
    };

    const result = ProductionEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it('deve validar schema de registro de refugo com categoria obrigatória', () => {
    const scrapEntry = {
      productionOrderId: '11111111-1111-1111-1111-111111111111',
      workCenterId: '22222222-2222-2222-2222-222222222222',
      tenantId: '33333333-3333-3333-3333-333333333333',
      unitId: '44444444-4444-4444-4444-444444444444',
      quantityScrap: 3,
      reasonCategory: 'DEFEITO_DIMENSIONAL' as const,
      description: 'Diâmetro externo com sobremetal fora de especificação',
      operatorBadge: 'OP-4102'
    };

    const result = ScrapEntrySchema.safeParse(scrapEntry);
    expect(result.success).toBe(true);
  });

  it('deve validar registro de parada de máquina com motivo categorizado', () => {
    const downtimeEntry = {
      workCenterId: '22222222-2222-2222-2222-222222222222',
      tenantId: '33333333-3333-3333-3333-333333333333',
      unitId: '44444444-4444-4444-4444-444444444444',
      reasonCategory: 'SETUP_FERRAMENTAL' as const,
      description: 'Troca de insertos de metal duro e alinhamento de castanhas',
      startTime: new Date().toISOString(),
      operatorBadge: 'OP-4102'
    };

    const result = DowntimeEntrySchema.safeParse(downtimeEntry);
    expect(result.success).toBe(true);
  });
});
