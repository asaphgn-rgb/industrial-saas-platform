import { describe, it, expect } from 'vitest';
import {
  CreateQmsDocumentSchema,
  ApproveDocumentSchema,
  DocumentRevisionRecordSchema,
} from '../../src/types/qms-document.types';

describe('SGQ ISO 9001:2015 - Suíte de Testes de Controle de Informação Documentada (Cláusula 7.5)', () => {
  it('deve validar criação de documento SGQ (POP/IT/Política) com dados válidos', () => {
    const validDocInput = {
      tenantId: '11111111-1111-1111-1111-111111111111',
      unitId: '22222222-2222-2222-2222-222222222222',
      code: 'POP-PROD-01',
      title: 'Procedimento Operacional Padrão de Setup de Injetoras',
      category: 'PROCEDIMENTO_OPERACIONAL_PADRAO' as const,
      initialVersion: '1.0',
      summaryOfChanges: 'Emissão inicial do procedimento técnico de setup.',
      effectiveDate: '2026-08-15',
      reviewDueDate: '2027-08-15',
      reasonForCreation: 'Padronização dos processos produtivos conforme ISO 9001:2015.',
    };

    const result = CreateQmsDocumentSchema.safeParse(validDocInput);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar documento com código muito curto ou versão inválida', () => {
    const invalidDoc = {
      tenantId: '11111111-1111-1111-1111-111111111111',
      unitId: '22222222-2222-2222-2222-222222222222',
      code: 'PO', // menor que 3 chars
      title: 'Doc', // menor que 5 chars
      category: 'PROCEDIMENTO_OPERACIONAL_PADRAO' as const,
      initialVersion: '1.0',
      summaryOfChanges: 'Ok',
      effectiveDate: '2026-08-15',
      reviewDueDate: '2027-08-15',
      reasonForCreation: 'Iso',
    };

    const result = CreateQmsDocumentSchema.safeParse(invalidDoc);
    expect(result.success).toBe(false);
  });

  it('deve validar estrutura de histórico de revisões com versionamento semântico X.Y', () => {
    const validRevision = {
      version: '1.2',
      summaryOfChanges: 'Inclusão de parâmetros de temperatura de molde.',
      authorUserId: '33333333-3333-3333-3333-333333333333',
      effectiveDate: '2026-08-15',
      reviewDueDate: '2027-08-15',
    };

    const result = DocumentRevisionRecordSchema.safeParse(validRevision);
    expect(result.success).toBe(true);

    const invalidRevision = {
      ...validRevision,
      version: 'v1.2.3.alpha', // formato inválido (deve ser X.Y)
    };
    const invalidResult = DocumentRevisionRecordSchema.safeParse(invalidRevision);
    expect(invalidResult.success).toBe(false);
  });

  it('deve validar schema de aprovação formal com justificativa e parecer', () => {
    const approvalInput = {
      documentId: '44444444-4444-4444-4444-444444444444',
      tenantId: '11111111-1111-1111-1111-111111111111',
      approverUserId: '55555555-5555-5555-5555-555555555555',
      comments: 'Documento revisado e aprovado pela Engenharia de Processos e Garantia da Qualidade.',
      effectiveDate: '2026-08-15',
      nextReviewDate: '2027-08-15',
    };

    const result = ApproveDocumentSchema.safeParse(approvalInput);
    expect(result.success).toBe(true);
  });
});
