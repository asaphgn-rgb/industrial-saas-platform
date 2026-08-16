import { z } from 'zod';

export const ProductionOrderStatusSchema = z.enum([
  'PLANNED',
  'RELEASED',
  'IN_PROGRESS',
  'SUSPENDED',
  'COMPLETED',
  'CANCELLED'
]);
export type ProductionOrderStatus = z.infer<typeof ProductionOrderStatusSchema>;

export const DowntimeReasonCategorySchema = z.enum([
  'MANUTENCAO_MECANICA',
  'MANUTENCAO_ELETRICA',
  'SETUP_FERRAMENTAL',
  'FALTA_MATERIAL',
  'FALTA_OPERADOR',
  'QUALIDADE_AJUSTE',
  'ABASTECIMENTO',
  'OUTROS'
]);
export type DowntimeReasonCategory = z.infer<typeof DowntimeReasonCategorySchema>;

export const ScrapReasonCategorySchema = z.enum([
  'DEFEITO_DIMENSIONAL',
  'ACABAMENTO_SUPERFICIAL',
  'TRINCA_MATERIAL',
  'REBABAS_EXCESSIVAS',
  'AJUSTE_SETUP',
  'OUTROS'
]);
export type ScrapReasonCategory = z.infer<typeof ScrapReasonCategorySchema>;

// Apontamento de Produção (Peças Boas)
export const ProductionEntrySchema = z.object({
  productionOrderId: z.string().uuid(),
  workCenterId: z.string().uuid(),
  tenantId: z.string().uuid(),
  unitId: z.string().uuid(),
  quantityProduced: z.number().positive('Quantidade produzida deve ser maior que zero'),
  cycleTimeSeconds: z.number().positive().optional(),
  operatorBadge: z.string().min(2, 'Matrícula/Crachá do operador é obrigatória'),
  timestamp: z.string().optional(),
});
export type ProductionEntry = z.infer<typeof ProductionEntrySchema>;

// Registro de Refugo (Scrap)
export const ScrapEntrySchema = z.object({
  productionOrderId: z.string().uuid(),
  workCenterId: z.string().uuid(),
  tenantId: z.string().uuid(),
  unitId: z.string().uuid(),
  quantityScrap: z.number().positive('Quantidade de refugo deve ser maior que zero'),
  reasonCategory: ScrapReasonCategorySchema,
  description: z.string().min(3, 'Descrição do motivo do refugo'),
  operatorBadge: z.string().min(2, 'Matrícula/Crachá do operador'),
  timestamp: z.string().optional(),
});
export type ScrapEntry = z.infer<typeof ScrapEntrySchema>;

// Registro de Parada de Linha / Máquina (Downtime)
export const DowntimeEntrySchema = z.object({
  workCenterId: z.string().uuid(),
  productionOrderId: z.string().uuid().optional(),
  tenantId: z.string().uuid(),
  unitId: z.string().uuid(),
  reasonCategory: DowntimeReasonCategorySchema,
  description: z.string().min(3, 'Descrição da causa da parada'),
  startTime: z.string(),
  endTime: z.string().optional(),
  durationMinutes: z.number().nonnegative().optional(),
  operatorBadge: z.string().min(2, 'Matrícula do operador'),
});
export type DowntimeEntry = z.infer<typeof DowntimeEntrySchema>;

// Indicadores de OEE (Overall Equipment Effectiveness)
export const OeeMetricsSchema = z.object({
  availability: z.number().min(0).max(100), // Disponibilidade % (Tempo Real / Tempo Planejado)
  performance: z.number().min(0).max(100),  // Performance % (Velocidade Real / Capacidade Nominal)
  quality: z.number().min(0).max(100),      // Qualidade % (Peças Boas / Peças Totais)
  oee: z.number().min(0).max(100),          // OEE Global % (A x P x Q)
  plannedTimeMinutes: z.number(),
  operatingTimeMinutes: z.number(),
  downtimeMinutes: z.number(),
  targetHourlyCapacity: z.number(),
  actualProducedCount: z.number(),
  scrapCount: z.number(),
  goodPartsCount: z.number(),
});
export type OeeMetrics = z.infer<typeof OeeMetricsSchema>;
