import { z } from 'zod';

export const NcSeveritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type NcSeverity = z.infer<typeof NcSeveritySchema>;

export const NcStatusSchema = z.enum([
  'OPENED',
  'INVESTIGATION',
  'ACTION_PLAN',
  'EFFECTIVENESS_CHECK',
  'CLOSED',
  'CANCELLED'
]);
export type NcStatus = z.infer<typeof NcStatusSchema>;

export const NcSourceSchema = z.enum([
  'AUDITORIA_INTERNA',
  'AUDITORIA_EXTERNA',
  'RECLAMACAO_CLIENTE',
  'PROCESSO_FABRIL',
  'INSPECAO_RECEBIMENTO',
  'QUALIFICACAO_FORNECEDOR',
  'MANUTENCAO_PREVENTIVA'
]);
export type NcSource = z.infer<typeof NcSourceSchema>;

// Análise de Causa Raiz: 5 Porquês
export const FiveWhysSchema = z.object({
  why1: z.string().min(3, '1º Por quê é obrigatório'),
  why2: z.string().optional(),
  why3: z.string().optional(),
  why4: z.string().optional(),
  why5: z.string().optional(),
  rootCauseSummary: z.string().min(5, 'Resumo da causa raiz identificada é obrigatório'),
});
export type FiveWhys = z.infer<typeof FiveWhysSchema>;

// Análise de Causa Raiz: Diagrama de Ishikawa (6M)
export const IshikawaSchema = z.object({
  metodo: z.array(z.string()).default([]),
  maquina: z.array(z.string()).default([]),
  maoDeObra: z.array(z.string()).default([]),
  material: z.array(z.string()).default([]),
  meioAmbiente: z.array(z.string()).default([]),
  medicao: z.array(z.string()).default([]),
  conclusao: z.string().min(5, 'Conclusão da análise Ishikawa é obrigatória'),
});
export type Ishikawa = z.infer<typeof IshikawaSchema>;

export const RootCauseAnalysisSchema = z.object({
  methodology: z.enum(['5_WHYS', 'ISHIKAWA', 'HYBRID']),
  fiveWhys: FiveWhysSchema.optional(),
  ishikawa: IshikawaSchema.optional(),
  analyzedBy: z.string().optional(),
  analyzedAt: z.string().optional(),
});
export type RootCauseAnalysis = z.infer<typeof RootCauseAnalysisSchema>;

// Ação Corretiva no modelo 5W2H
export const ActionPlan5W2HItemSchema = z.object({
  id: z.string().uuid(),
  what: z.string().min(3, 'O que será feito (What)'),
  why: z.string().min(3, 'Por que será feito (Why)'),
  where: z.string().min(2, 'Onde será feito (Where)'),
  when: z.string().min(2, 'Quando/Prazo (When)'),
  who: z.string().min(2, 'Quem é o responsável (Who)'),
  how: z.string().min(3, 'Como será executado (How)'),
  howMuch: z.string().optional(), // Custo estimado (How Much)
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  completedAt: z.string().optional(),
  evidenceUrl: z.string().optional(),
});
export type ActionPlan5W2HItem = z.infer<typeof ActionPlan5W2HItemSchema>;

// Verificação de Eficácia (Cláusula 10.2 ISO 9001)
export const EffectivenessCheckSchema = z.object({
  isEffective: z.boolean(),
  evidenceDescription: z.string().min(10, 'Descrição detalhada das evidências de eficácia'),
  recurrenceObserved: z.boolean(),
  verifiedBy: z.string(),
  verifiedAt: z.string(),
  observations: z.string().optional(),
});
export type EffectivenessCheck = z.infer<typeof EffectivenessCheckSchema>;

// Schema de Criação de Não Conformidade
export const CreateNonConformanceSchema = z.object({
  tenantId: z.string().uuid('ID do Tenant inválido'),
  unitId: z.string().uuid('ID da Unidade fabril inválido'),
  code: z.string().min(3, 'Código identificador da NC (Ex: NC-2026-001)'),
  title: z.string().min(5, 'Título descritivo da Não Conformidade'),
  description: z.string().min(10, 'Descrição factual detalhada do desvio/problema'),
  source: NcSourceSchema,
  severity: NcSeveritySchema,
  containmentActions: z.string().optional(), // Ação Imediata / Disposição
  responsibleUserId: z.string().uuid().optional(),
  reasonForOpening: z.string().min(5, 'Justificativa de abertura para auditoria'),
});
export type CreateNonConformanceInput = z.infer<typeof CreateNonConformanceSchema>;
