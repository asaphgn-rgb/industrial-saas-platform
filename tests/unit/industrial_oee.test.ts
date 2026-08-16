import { describe, it, expect } from 'vitest';

describe('Industrial OEE & ISA-95 Calculations', () => {
  it('deve calcular corretamente o OEE (Disponibilidade x Performance x Qualidade)', () => {
    // Disponibilidade: 400 min produzidos / 480 min planejados = 0.8333 (83.33%)
    const availability = 400 / 480;
    // Performance: 1000 peças produzidas / 1200 capacidade nominal = 0.8333 (83.33%)
    const performance = 1000 / 1200;
    // Qualidade: 950 peças boas / 1000 peças totais = 0.95 (95.00%)
    const quality = 950 / 1000;

    const oee = availability * performance * quality;
    const oeePercentage = Number((oee * 100).toFixed(2));

    expect(oeePercentage).toBe(65.97);
    expect(oeePercentage).toBeLessThan(85.00); // Abaixo da meta world-class
  });
});
