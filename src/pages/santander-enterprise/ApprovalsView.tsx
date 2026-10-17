import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Search,
  Filter,
  Building2,
  User,
  ShieldCheck,
  FileText,
  DollarSign,
  ArrowRight,
  Paperclip,
  Send,
  Eye,
  Check,
  X
} from 'lucide-react';
import { MOCK_PROPOSALS, ProposalItem } from '@/data/enterpriseData';
import { formatCurrency } from '@/lib/utils';

export const ApprovalsView: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalItem[]>(MOCK_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem>(MOCK_PROPOSALS[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [analystNotes, setAnalystNotes] = useState<string>(
    'Documentação contábil e fiscal analisada. Faturamento recorrente de R$ 4,2M/ano compatível com a linha de crédito solicitada. Garantia fidejussória dos sócios validada.'
  );

  const filteredProposals = proposals.filter((p) => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'analysis' && p.status === 'Em análise') ||
      (filterStatus === 'pending' && p.status === 'Pendente') ||
      (filterStatus === 'approved' && p.status === 'Aprovada') ||
      (filterStatus === 'rejected' && p.status === 'Reprovada');

    const matchesSearch =
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleApprove = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'Aprovada' as const,
              stage: 'Aprovação final' as const,
              stageStatus: 'concluido' as const,
            }
          : p
      )
    );
    if (selectedProposal.id === proposalId) {
      setSelectedProposal((prev) => ({
        ...prev,
        status: 'Aprovada',
        stage: 'Aprovação final',
        stageStatus: 'concluido',
      }));
    }
    alert(`Proposta ${selectedProposal.code} aprovada pela alçada executiva com sucesso!`);
  };

  const handleReject = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: 'Reprovada' as const } : p
      )
    );
    if (selectedProposal.id === proposalId) {
      setSelectedProposal((prev) => ({ ...prev, status: 'Reprovada' }));
    }
    alert(`Proposta ${selectedProposal.code} reprovada.`);
  };

  const stages = [
    { name: 'Dados cadastrais', key: 'Dados cadastrais' },
    { name: 'Elegibilidade', key: 'Elegibilidade' },
    { name: 'Documentação', key: 'Documentação' },
    { name: 'Retorno bancário', key: 'Retorno bancário' },
    { name: 'Aprovação final', key: 'Aprovação final' },
  ];

  const getStageState = (stageName: string) => {
    const stageOrder = [
      'Dados cadastrais',
      'Elegibilidade',
      'Documentação',
      'Retorno bancário',
      'Aprovação final',
    ];
    const currentIndex = stageOrder.indexOf(selectedProposal.stage);
    const targetIndex = stageOrder.indexOf(stageName);

    if (selectedProposal.status === 'Aprovada') {
      return 'completed';
    }

    if (targetIndex < currentIndex) {
      return 'completed';
    } else if (targetIndex === currentIndex) {
      return selectedProposal.stageStatus === 'concluido'
        ? 'completed'
        : selectedProposal.stageStatus === 'em_andamento'
        ? 'in_progress'
        : 'pending';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Aprovações</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Mesa de análise, esteira de crédito e governança de alçadas operacionais.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            48 propostas aguardando análise
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Fila ativa
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Propostas em fila
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">48</p>
            <p className="text-[10px] text-slate-500 mt-1">↑ 6 novas entradas hoje</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Ticket R$ 71,8k
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Volume em análise
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">R$ 3,45 mi</p>
            <p className="text-[10px] text-slate-500 mt-1">82% crédito corporativo PJ</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Dentro da meta
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              SLA médio
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">3,2h</p>
            <p className="text-[10px] text-slate-500 mt-1">Meta interna máxima: 4,0h</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 3,1 p.p.
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Taxa de aprovação
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">74,2%</p>
            <p className="text-[10px] text-slate-500 mt-1">Últimos 30 dias na esteira</p>
          </div>
        </div>
      </div>

      {/* Main Content: Left Proposal Queue (7 cols) + Right Analysis Drawer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Proposals List / Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Fila de propostas</h2>
                <p className="text-[11px] text-slate-500">
                  Selecione uma proposta para visualizar o dossiê e deliberar.
                </p>
              </div>

              {/* Status Filter Pill Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterStatus === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Todas ({proposals.length})
                </button>
                <button
                  onClick={() => setFilterStatus('analysis')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterStatus === 'analysis'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Em análise
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterStatus === 'pending'
                      ? 'bg-white text-amber-600 shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Pendentes
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterStatus === 'approved'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Aprovadas
                </button>
              </div>
            </div>

            {/* Search and Filters Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por código, cliente ou produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Proposals Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Produto</th>
                    <th className="py-2.5 px-3">Valor</th>
                    <th className="py-2.5 px-3">Etapa</th>
                    <th className="py-2.5 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProposals.map((item) => {
                    const isSelected = selectedProposal.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedProposal(item)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 border-l-4 border-l-blue-600 font-medium'
                            : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">
                          {item.code}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900 leading-tight">{item.client}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {item.document}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-slate-800 font-medium">{item.product}</p>
                          <p className="text-[10px] text-slate-400">{item.subProduct}</p>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Aprovada'
                                ? 'bg-emerald-50 text-emerald-700'
                                : item.status === 'Reprovada'
                                ? 'bg-rose-50 text-rose-700'
                                : item.status === 'Pendente'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            ● {item.stage}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProposal(item);
                            }}
                            className={`p-1.5 rounded-lg border text-xs font-semibold ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Mostrando {filteredProposals.length} de {proposals.length} propostas</span>
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
              Exportar fila de crédito (CSV)
            </span>
          </div>
        </div>

        {/* Right Underwriting Workbench / Drawer (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate space-y-5">
          {/* Header of proposal */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedProposal.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedProposal.status === 'Aprovada'
                      ? 'bg-emerald-50 text-emerald-700'
                      : selectedProposal.status === 'Reprovada'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  ● {selectedProposal.status}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                {selectedProposal.client}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                {selectedProposal.document}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Valor solicitado</span>
              <p className="text-lg font-black text-slate-900 font-mono">
                {formatCurrency(selectedProposal.amount)}
              </p>
              <span className="text-[10px] text-slate-500 block">
                {selectedProposal.termMonths ? `${selectedProposal.termMonths} parcelas` : 'À vista'}
              </span>
            </div>
          </div>

          {/* 5-Step Underwriting Pipeline Stepper */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Esteira de Aprovação (5 Etapas)
            </span>
            <div className="grid grid-cols-5 gap-1 text-center">
              {stages.map((stg, idx) => {
                const state = getStageState(stg.name);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : state === 'in_progress'
                          ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {state === 'completed' ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[9px] font-medium leading-tight line-clamp-2 ${
                        state === 'completed'
                          ? 'text-emerald-700 font-bold'
                          : state === 'in_progress'
                          ? 'text-blue-700 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {stg.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bureau & Risk Indicators */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Score de Risco & Compliance
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Score 845 / 1000 (Baixo Risco)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {selectedProposal.notes}
            </p>
          </div>

          {/* Dossiê de Documentos Anexados */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Dossiê Documental
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: 'DRE & Balanço 2024', size: '2.4 MB PDF', ok: true },
                { name: 'Certidão Negativa CND', size: '412 KB PDF', ok: true },
                { name: 'Contrato Social Consolidado', size: '1.8 MB PDF', ok: true },
                { name: 'Comprovante Faturamento Bancário', size: '3.1 MB PDF', ok: true },
              ].map((doc, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                  onClick={() => alert(`Visualizando documento: ${doc.name}`)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 text-[11px] line-clamp-1">
                        {doc.name}
                      </p>
                      <p className="text-[9px] text-slate-400">{doc.size}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Analyst Notes Textarea */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Parecer do Analista / Justificativa de Alçada
            </label>
            <textarea
              rows={2}
              value={analystNotes}
              onChange={(e) => setAnalystNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Decision Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => handleApprove(selectedProposal.id)}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Aprovar Proposta</span>
            </button>
            <button
              onClick={() => alert(`Solicitando complemento documental para ${selectedProposal.client}`)}
              className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
            >
              <span>Pendenciar</span>
            </button>
            <button
              onClick={() => handleReject(selectedProposal.id)}
              className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
