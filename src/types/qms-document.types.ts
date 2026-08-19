import { z } from 'zod';

export const DocumentCategorySchema = z.enum([
  'PROCEDIMENTO_OPERACIONAL_PADRAO', // POP
  'INSTRUCAO_DE_TRABALHO',           // IT
  'MANUAL_DA_QUALIDADE',             // MQ
  'POLITICA_INSTITUCIONAL',          // POL
  'ESPECIFICACAO_TECNICA',           // ET
  'FORMULARIO_PADRAO',               // FOR
  'REGISTRO_DA_QUALIDADE'            // REG
]);
export type DocumentCategory = z.infer<typeof DocumentCategorySchema>;

export const DocumentStatusSchema = z.enum([
  'DRAFT',        // Rascunho / Elaboração
  'UNDER_REVIEW', // Em Revisão por Pares
  'APPROVED',     // Aprovado e Vigente
  'OBSOLETE',     // Obsoleto / Substituído por Nova Versão
  'ARCHIVED'      // Arquivado / Descontinuado
]);
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;

// Histórico de Revisões / Versões
export const DocumentRevisionRecordSchema = z.object({
  version: z.string().regex(/^\d+\.\d+$/, 'Formato de versão deve ser X.Y (Ex: 1.0, 1.1, 2.0)'),
  summaryOfChanges: z.string().min(5, 'Resumo das alterações realizadas nesta revisão'),
  authorUserId: z.string(),
  reviewedByUserId: z.string().optional(),
  approvedByUserId: z.string().optional(),
  effectiveDate: z.string(),
  reviewDueDate: z.string(), // Data limite para próxima revisão periódica
});
export type DocumentRevisionRecord = z.infer<typeof DocumentRevisionRecordSchema>;

// Schema de Criação de Documento SGQ
export const CreateQmsDocumentSchema = z.object({
  tenantId: z.string().uuid(),
  unitId: z.string().uuid(),
  code: z.string().min(3, 'Código identificador do documento (Ex: POP-ENG-01)'),
  title: z.string().min(5, 'Título descritivo do documento'),
  category: DocumentCategorySchema,
  initialVersion: z.string().default('1.0'),
  summaryOfChanges: z.string().min(5, 'Resumo do conteúdo inicial da versão'),
  contentUrl: z.string().url().optional().or(z.literal('')),
  effectiveDate: z.string(),
  reviewDueDate: z.string(),
  reasonForCreation: z.string().min(5, 'Justificativa de criação para trilha de auditoria'),
});
export type CreateQmsDocumentInput = z.infer<typeof CreateQmsDocumentSchema>;

// Schema de Aprovação e Emissão de Nova Versão
export const ApproveDocumentSchema = z.object({
  documentId: z.string().uuid(),
  tenantId: z.string().uuid(),
  approverUserId: z.string(),
  comments: z.string().min(3, 'Parecer técnico / Justificativa da aprovação'),
  effectiveDate: z.string(),
  nextReviewDate: z.string(),
});
export type ApproveDocumentInput = z.infer<typeof ApproveDocumentSchema>;
