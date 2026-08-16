import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  Layers,
  X,
  FileCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import type { Database } from '../types/database.types';
import type { DocumentCategory, DocumentStatus } from '../types/qms-document.types';

type QmsDocumentRow = Database['public']['Tables']['qms_documents']['Row'];

interface QmsDocumentModuleProps {
  tenantId: string;
  unitId: string;
}

export const QmsDocumentModule: React.FC<QmsDocumentModuleProps> = ({
  tenantId,
  unitId
}) => {
  // Documentos mockados/ativos para demonstração interativa
  const [documents, setDocuments] = useState<QmsDocumentRow[]>([
    {
      id: 'doc-001-uuid',
      tenant_id: tenantId,
      unit_id: unitId,
      code: 'POP-QUAL-01',
      title: 'Procedimento de Controle de Informação Documentada e Registros',
      version: '2.0',
      category: 'PROCEDIMENTO_OPERACIONAL_PADRAO',
      status: 'APPROVED',
      content_url: 'https://docs.industrial-saas.local/pop-qual-01.pdf',
      metadata: {
        summary: 'Define as diretrizes de elaboração, revisão, aprovação e guarda de documentos conforme ISO 9001:2015.'
      },
      created_by: '00000000-0000-0000-0000-000000000000',
      reviewed_by: '00000000-0000-0000-0000-000000000000',
      approved_by: '00000000-0000-0000-0000-000000000000',
      effective_date: '2026-01-15',
      review_due_date: '2027-01-15',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    },
    {
      id: 'doc-002-uuid',
      tenant_id: tenantId,
      unit_id: unitId,
      code: 'IT-CNC-04',
      title: 'Instrução de Trabalho: Setup e Operação de Tornos CNC Mazak',
      version: '1.2',
      category: 'INSTRUCAO_DE_TRABALHO',
      status: 'UNDER_REVIEW',
      content_url: 'https://docs.industrial-saas.local/it-cnc-04.pdf',
      metadata: {
        summary: 'Instrução detalhada de preparação de ferramental, zeramento de peças e checagem de fluxo de refrigeração.'
      },
      created_by: '00000000-0000-0000-0000-000000000000',
      reviewed_by: '00000000-0000-0000-0000-000000000000',
      approved_by: null,
      effective_date: '2026-06-01',
      review_due_date: '2027-06-01',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    },
    {
      id: 'doc-003-uuid',
      tenant_id: tenantId,
      unit_id: unitId,
      code: 'POL-QUAL-01',
      title: 'Política da Qualidade e Diretrizes Estratégicas',
      version: '1.0',
      category: 'POLITICA_INSTITUCIONAL',
      status: 'APPROVED',
      content_url: 'https://docs.industrial-saas.local/pol-qual-01.pdf',
      metadata: {
        summary: 'Declaração formal do compromisso da alta direção com a melhoria contínua e foco no cliente.'
      },
      created_by: '00000000-0000-0000-0000-000000000000',
      reviewed_by: '00000000-0000-0000-0000-000000000000',
      approved_by: '00000000-0000-0000-0000-000000000000',
      effective_date: '2025-10-01',
      review_due_date: '2026-10-01',
      created_at: new Date(Date.now() - 86400000 * 120).toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    }
  ]);

  const [selectedDoc, setSelectedDoc] = useState<QmsDocumentRow | null>(documents[0]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modais
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState<boolean>(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);

  // Form states para criação
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('INSTRUCAO_DE_TRABALHO');
  const [newSummary, setNewSummary] = useState('');
  const [newEffectiveDate, setNewEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDueDate, setNewDueDate] = useState('2027-08-15');
  const [newReason, setNewReason] = useState('');

  // Form states para aprovação
  const [approvalComments, setApprovalComments] = useState('');

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle || !newSummary || !newReason) return;

    const newRecord: QmsDocumentRow = {
      id: `doc-${Date.now()}-uuid`,
      tenant_id: tenantId,
      unit_id: unitId,
      code: newCode,
      title: newTitle,
      version: '1.0',
      category: newCategory,
      status: 'DRAFT',
      content_url: null,
      metadata: { summary: newSummary },
      created_by: '00000000-0000-0000-0000-000000000000',
      reviewed_by: null,
      approved_by: null,
      effective_date: newEffectiveDate,
      review_due_date: newDueDate,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    };

    setDocuments([newRecord, ...documents]);
    setSelectedDoc(newRecord);
    setIsNewDocModalOpen(false);

    // Reset
    setNewCode('');
    setNewTitle('');
    setNewSummary('');
    setNewReason('');
  };

  const handleApproveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !approvalComments) return;

    const updated: QmsDocumentRow = {
      ...selectedDoc,
      status: 'APPROVED',
      approved_by: '00000000-0000-0000-0000-000000000000',
      updated_at: new Date().toISOString()
    };

    setDocuments(prev => prev.map(d => d.id === updated.id ? updated : d));
    setSelectedDoc(updated);
    setIsApproveModalOpen(false);
    setApprovalComments('');
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = filterCategory === 'ALL' || doc.category === filterCategory;
    const matchesSearch = doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">Aprovado / Vigente</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-950 text-purple-400 border border-purple-800">Em Revisão</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">Rascunho</span>;
      case 'OBSOLETE':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-red-950 text-red-400 border border-red-800">Obsoleto</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-400">Arquivado</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Controle de Informação Documentada</h2>
            <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
              ISO 9001:2015 • Cláusula 7.5
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Repositório corporativo de POPs, ITs, Políticas e Registros com controle rigoroso de versões, fluxo de aprovação e prazos de validade.
          </p>
        </div>
        <button
          onClick={() => setIsNewDocModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Documento SGQ</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por código ou título do documento..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
        >
          <option value="ALL">Todas as Categorias</option>
          <option value="PROCEDIMENTO_OPERACIONAL_PADRAO">POPs</option>
          <option value="INSTRUCAO_DE_TRABALHO">Instruções de Trabalho (ITs)</option>
          <option value="POLITICA_INSTITUCIONAL">Políticas</option>
          <option value="MANUAL_DA_QUALIDADE">Manual da Qualidade</option>
        </select>
      </div>

      {/* Split View: Lista de Documentos & Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Lista */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDocs.map(doc => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {doc.code} <span className="text-slate-400 font-normal">v{doc.version}</span>
                  </span>
                  {getStatusBadge(doc.status)}
                </div>
                <h4 className="text-sm font-semibold text-slate-100 mt-2 line-clamp-1">{doc.title}</h4>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[180px]">{doc.category.replace(/_/g, ' ')}</span>
                  <span>Validade: <strong>{new Date(doc.review_due_date || '').toLocaleDateString('pt-BR')}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Painel Direito: Detalhes do Documento */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col space-y-6">
          {selectedDoc ? (
            <>
              {/* Header do Documento Selecionado */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-400 px-2 py-1 bg-blue-950/80 border border-blue-900 rounded">
                      {selectedDoc.code}
                    </span>
                    <span className="text-xs font-bold text-slate-300 px-2 py-1 bg-slate-800 rounded">
                      Versão {selectedDoc.version}
                    </span>
                  </div>
                  {getStatusBadge(selectedDoc.status)}
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Categoria: <strong>{selectedDoc.category.replace(/_/g, ' ')}</strong></p>
              </div>

              {/* Informações de Validade e Vigência */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-400 block">Data de Vigência / Publicação:</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block">
                    {new Date(selectedDoc.effective_date || '').toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-400 block">Próxima Revisão Periódica:</span>
                  <span className="text-sm font-bold text-amber-400 mt-1 block">
                    {new Date(selectedDoc.review_due_date || '').toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Resumo do Conteúdo */}
              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resumo do Documento / Escopo</h5>
                <div className="mt-1.5 p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 leading-relaxed">
                  {(selectedDoc.metadata as any)?.summary || 'Nenhum resumo detalhado cadastrado.'}
                </div>
              </div>

              {/* Ações de Aprovação */}
              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {selectedDoc.status === 'APPROVED' ? (
                    <span className="text-emerald-400 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Documento vigente aprovado para uso fabril.
                    </span>
                  ) : (
                    <span className="text-purple-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> Aguardando parecer técnico e aprovação formal.
                    </span>
                  )}
                </div>

                {selectedDoc.status !== 'APPROVED' && (
                  <button
                    onClick={() => setIsApproveModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                  >
                    Aprovar e Publicar Versão
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12">
              <FileText className="w-12 h-12 mb-2 stroke-[1.5]" />
              <p className="text-sm">Selecione um documento para visualizar os detalhes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Novo Documento SGQ */}
      {isNewDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center">
                <FileText className="w-4 h-4 text-blue-400 mr-2" /> Novo Documento do SGQ (ISO 9001)
              </h3>
              <button onClick={() => setIsNewDocModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Código Identificador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: POP-MANUT-02"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Categoria *</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as DocumentCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="INSTRUCAO_DE_TRABALHO">Instrução de Trabalho (IT)</option>
                    <option value="PROCEDIMENTO_OPERACIONAL_PADRAO">POP</option>
                    <option value="POLITICA_INSTITUCIONAL">Política</option>
                    <option value="ESPECIFICACAO_TECNICA">Especificação Técnica</option>
                    <option value="MANUAL_DA_QUALIDADE">Manual da Qualidade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título do Documento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Procedimento de Manutenção Preventiva de Prensas Hidráulicas"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Resumo / Escopo *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Descreva o objetivo e a abrangência deste documento..."
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Data de Vigência *</label>
                  <input
                    type="date"
                    required
                    value={newEffectiveDate}
                    onChange={e => setNewEffectiveDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Próxima Revisão *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Justificativa para Auditoria *</label>
                <input
                  type="text"
                  required
                  placeholder="Motivo da criação da versão..."
                  value={newReason}
                  onChange={e => setNewReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewDocModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Salvar Rascunho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Aprovação Formal */}
      {isApproveModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5 mr-2" /> Aprovação Formal SGQ ({selectedDoc.code})
            </h3>
            <p className="text-xs text-slate-400">
              A aprovação deste documento registrará sua assinatura eletrônica na trilha de auditoria imutável e tornará a versão {selectedDoc.version} vigente.
            </p>
            <form onSubmit={handleApproveDoc} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Parecer Técnico / Comentários *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Parecer formal de aprovação..."
                  value={approvalComments}
                  onChange={e => setApprovalComments(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApproveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Assinar e Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
