import { describe, it, expect } from 'vitest';
import {
  CreateQmsDocumentSchema,
  ApproveDocumentSchema,
  DocumentRevisionRecordSchema,
  DocumentCategorySchema,
  DocumentStatusSchema
} from '../../src/types/qms-document.types';

describe('SGQ & ISO 9001:2015 - Cláusula 7.5 (Informação Documentada)', () => {
  it('deve validar categorias oficiais de documentos do SGQ', () => {
    const validCategories = [
      'PROCEDIMENTO_OPERACIONAL_PADRAO',
      'INSTRUCAO_DE_TRABALHO',
      'MANUAL_DA_QUALIDADE',
      'POLITICA_INSTITUCIONAL',
      'ESPECIFICACAO_TECNICA',
      'FORMULARIO_PADRAO',
      'REGISTRO_DA_QUALIDADE'
    ];

    validCategories.forEach(cat => {
      expect(DocumentCategorySchema.safeParse(cat).success).toBe(true);
    });

    // Categoria inválida
    expect(DocumentCategorySchema.safeParse('DOCUMENTO_INVALIDO').success).toBe(false);
  });

  it('deve validar ciclo de vida e status de documentos (Draft, Review, Approved, Obsolete)', () => {
    const statuses = ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'OBSOLETE', 'ARCHIVED'];
    statuses.forEach(st => {
      expect(DocumentStatusSchema.safeParse(st).success).toBe(true);
    });
  });

  it('deve validar schema de criação de documento com versionamento semântico', () => {
    const validDoc = {
      tenantId: '11111111-1111-1111-1111-111111111111',
      unitId: '22222222-2222-2222-2222-222222222222',
      code: 'POP-QUAL-01',
      title: 'Controle de Informação Documentada e Registros',
      category: 'PROCEDIMENTO_OPERACIONAL_PADRAO' as const,
      initialVersion: '1.0',
      summaryOfChanges: 'Emissão inicial do procedimento alinhado à ISO 9001:2015.',
      effectiveDate: '2026-08-15',
      reviewDueDate: '2027-08-15',
      reasonForCreation: 'Estruturação do SGQ para certificação ISO 9001.'
    };

    const result = CreateQmsDocumentSchema.safeParse(validDoc);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar criação com código ou título muito curto', () => {
    const invalidDoc = {
      tenantId: '11111111-1111-1111-1111-111111111111',
      unitId: '22222222-2222-2222-2222-222222222222',
      code: 'P1', // Muito curto (< 3 chars)
      title: 'Doc', // Muito curto (< 5 chars)
      category: 'INSTRUCAO_DE_TRABALHO' as const,
      initialVersion: '1.0',
      summaryOfChanges: 'Ok',
      effectiveDate: '2026-08-15',
      reviewDueDate: '2027-08-15',
      reasonForCreation: 'Req'
    };

    const result = CreateQmsDocumentSchema.safeParse(invalidDoc);
    expect(result.success).toBe(false);
  });

  it('deve validar aprovação formal com parecer técnico obrigatório', () => {
    const approval = {
      documentId: '33333333-3333-3333-3333-333333333333',
      tenantId: '11111111-1111-1111-1111-111111111111',
      approverUserId: '44444444-4444-4444-4444-444444444444',
      comments: 'Documento revisado e aprovado em conformidade com as diretrizes da Engenharia e Qualidade.',
      effectiveDate: '2026-08-15',
      nextReviewDate: '2027-08-15'
    };

    const result = ApproveDocumentSchema.safeParse(approval);
    expect(result.success).toBe(true);
  });

  it('deve validar registro de histórico de revisão com formato X.Y', () => {
    const revision = {
      version: '2.1',
      summaryOfChanges: 'Atualização dos parâmetros de corte e refrigeração na usinagem.',
      authorUserId: '44444444-4444-4444-4444-444444444444',
      effectiveDate: '2026-08-15',
      reviewDueDate: '2027-08-15'
    };

    const result = DocumentRevisionRecordSchema.safeParse(revision);
    expect(result.success).toBe(true);

    const invalidRevision = {
      ...revision,
      version: 'v2.1.0' // Formato inválido pelo regex ^\d+\.\d+$
    };
    expect(DocumentRevisionRecordSchema.safeParse(invalidRevision).success).toBe(false);
  });
});
