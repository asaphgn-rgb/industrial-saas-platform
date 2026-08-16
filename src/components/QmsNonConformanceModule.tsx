import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  X,
  ChevronRight
} from 'lucide-react';
import type { Database } from '../types/database.types';
import type {
  CreateNonConformanceInput,
  NcSeverity,
  NcStatus,
  NcSource,
  ActionPlan5W2HItem,
  FiveWhys,
  EffectivenessCheck
} from '../types/qms-capa.types';

type NonConformanceRow = Database['public']['Tables']['qms_non_conformances']['Row'];

interface QmsNonConformanceModuleProps {
  tenantId: string;
  unitId: string;
}

export const QmsNonConformanceModule: React.FC<QmsNonConformanceModuleProps> = ({
  tenantId,
  unitId
}) => {
  // Estado de lista mockada/ativa para demonstração e interação em tempo real
  const [nonConformances, setNonConformances] = useState<NonConformanceRow[]>([
    {
      id: 'nc-001-uuid',
      tenant_id: tenantId,
      unit_id: unitId,
      code: 'NC-2026-001',
      title: 'Desvio dimensional acima da tolerância no lote #4892 (Peça CNC-A12)',
      description: 'Durante a inspeção volante na Célula CNC 01, constatou-se diâmetro externo com +0.15mm além da tolerância máxima da ficha técnica.',
      source: 'PROCESSO_FABRIL',
      severity: 'HIGH',
      status: 'INVESTIGATION',
      root_cause_analysis: {
        methodology: '5_WHYS',
        fiveWhys: {
          why1: 'A ferramenta de corte sofreu desgaste prematuro durante a usinagem.',
          why2: 'A refrigeração da máquina estava abaixo do fluxo ideal.',
          why3: 'O bocal injetor de fluido de corte estava parcialmente obstruído por cavacos.',
          why4: 'A limpeza do bocal não foi realizada no checklist de setup do turno.',
          why5: 'A instrução de trabalho de setup não detalhava a checagem da desobstrução do bocal.',
          rootCauseSummary: 'Ausência de ponto de controle explícito de desobstrução de refrigeração na Instrução de Trabalho IT-CNC-04.'
        }
      },
      containment_actions: 'Lote #4892 segregado imediatamente no Almoxarifado de Quarentena com etiqueta vermelha de bloqueio.',
      corrective_actions: [
        {
          id: 'act-1',
          what: 'Revisar a Instrução de Trabalho IT-CNC-04 incluindo verificação obrigatória de vazão de fluido.',
          why: 'Garantir lubrificação e evitar desgaste prematuro da ferramenta.',
          where: 'Célula de Usinagem CNC 01 e 02',
          when: '2026-08-20',
          who: 'Engenheiro de Processos (Carlos Silva)',
          how: 'Atualização no módulo de Documentos SGQ e treinamento com operadores.',
          howMuch: 'R$ 0,00',
          status: 'IN_PROGRESS'
        }
      ],
      responsible_user_id: null,
      opened_by: '00000000-0000-0000-0000-000000000000',
      closed_by: null,
      closed_at: null,
      effectiveness_verified_by: null,
      effectiveness_verified_at: null,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'nc-002-uuid',
      tenant_id: tenantId,
      unit_id: unitId,
      code: 'NC-2026-002',
      title: 'Certificado de Calibração vencido no paquímetro digital PAQ-09',
      description: 'Auditoria interna de produto identificou utilização de instrumento com calibração expirada há 12 dias no setor de Montagem.',
      source: 'AUDITORIA_INTERNA',
      severity: 'MEDIUM',
      status: 'EFFECTIVENESS_CHECK',
      root_cause_analysis: { methodology: '5_WHYS', causes: [] },
      containment_actions: 'Instrumento PAQ-09 recolhido para laboratório metrológico e substituído por instrumento aferido.',
      corrective_actions: [
        {
          id: 'act-2',
          what: 'Enviar PAQ-09 para calibração acreditada RBC e configurar alerta de 30 dias de antecedência no sistema.',
          why: 'Conformidade com a Cláusula 7.1.5 da ISO 9001.',
          where: 'Laboratório Metrológico',
          when: '2026-08-16',
          who: 'Metrologista Líder (Mariana Souza)',
          how: 'Envio ao fornecedor credenciado e ativação de trigger de notificação.',
          status: 'COMPLETED'
        }
      ],
      responsible_user_id: null,
      opened_by: '00000000-0000-0000-0000-000000000000',
      closed_by: null,
      closed_at: null,
      effectiveness_verified_by: null,
      effectiveness_verified_at: null,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);

  const [selectedNc, setSelectedNc] = useState<NonConformanceRow | null>(nonConformances[0]);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'root_cause' | 'action_plan' | 'effectiveness'>('details');

  // Form states para abertura de nova NC
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState(`NC-2026-00${nonConformances.length + 1}`);
  const [newDescription, setNewDescription] = useState('');
  const [newSource, setNewSource] = useState<NcSource>('PROCESSO_FABRIL');
  const [newSeverity, setNewSeverity] = useState<NcSeverity>('MEDIUM');
  const [newContainment, setNewContainment] = useState('');
  const [newReason, setNewReason] = useState('');

  // Form states para 5 Porquês
  const [why1, setWhy1] = useState('');
  const [why2, setWhy2] = useState('');
  const [why3, setWhy3] = useState('');
  const [why4, setWhy4] = useState('');
  const [why5, setWhy5] = useState('');
  const [rootSummary, setRootSummary] = useState('');

  // Form states para 5W2H
  const [what, setWhat] = useState('');
  const [why, setWhy] = useState('');
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState('');
  const [who, setWho] = useState('');
  const [how, setHow] = useState('');

  // Form states para Eficácia
  const [isEffective, setIsEffective] = useState(true);
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [recurrence, setRecurrence] = useState(false);

  const handleCreateNc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newReason) return;

    const created: NonConformanceRow = {
      id: `nc-${Date.now()}-uuid`,
      tenant_id: tenantId,
      unit_id: unitId,
      code: newCode,
      title: newTitle,
      description: newDescription,
      source: newSource,
      severity: newSeverity,
      status: 'OPENED',
      containment_actions: newContainment || null,
      corrective_actions: [],
      root_cause_analysis: { methodology: '5_WHYS', causes: [] },
      responsible_user_id: null,
      opened_by: '00000000-0000-0000-0000-000000000000',
      closed_by: null,
      closed_at: null,
      effectiveness_verified_by: null,
      effectiveness_verified_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setNonConformances([created, ...nonConformances]);
    setSelectedNc(created);
    setIsNewModalOpen(false);

    // Reset
    setNewTitle('');
    setNewDescription('');
    setNewContainment('');
    setNewReason('');
  };

  const handleSave5Whys = () => {
    if (!selectedNc || !why1 || !rootSummary) return;

    const analysis: FiveWhys = {
      why1,
      why2,
      why3,
      why4,
      why5,
      rootCauseSummary: rootSummary
    };

    const updated: NonConformanceRow = {
      ...selectedNc,
      status: 'ACTION_PLAN',
      root_cause_analysis: {
        methodology: '5_WHYS',
        fiveWhys: analysis
      },
      updated_at: new Date().toISOString()
    };

    updateNcInState(updated);
  };

  const handleAdd5W2H = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNc || !what || !who || !when) return;

    const newItem: ActionPlan5W2HItem = {
      id: `act-${Date.now()}`,
      what,
      why,
      where,
      when,
      who,
      how,
      status: 'PENDING'
    };

    const currentActions = (selectedNc.corrective_actions as ActionPlan5W2HItem[]) || [];
    const updated: NonConformanceRow = {
      ...selectedNc,
      corrective_actions: [...currentActions, newItem],
      updated_at: new Date().toISOString()
    };

    updateNcInState(updated);
    setWhat('');
    setWhy('');
    setWhere('');
    setWhen('');
    setWho('');
    setHow('');
  };

  const handleSaveEffectiveness = () => {
    if (!selectedNc || !evidenceDesc) return;

    const updated: NonConformanceRow = {
      ...selectedNc,
      status: isEffective ? 'CLOSED' : 'INVESTIGATION',
      closed_at: isEffective ? new Date().toISOString() : null,
      effectiveness_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    updateNcInState(updated);
  };

  const updateNcInState = (updated: NonConformanceRow) => {
    setNonConformances(prev => prev.map(nc => nc.id === updated.id ? updated : nc));
    setSelectedNc(updated);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-red-950 text-red-400 border border-red-800">Crítica</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-orange-950 text-orange-400 border border-orange-800">Alta</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">Média</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-950 text-blue-400 border border-blue-800">Baixa</span>;
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'OPENED':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">Aberto</span>;
      case 'INVESTIGATION':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-950 text-purple-400 border border-purple-800">Investigação Causa Raiz</span>;
      case 'ACTION_PLAN':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-950 text-blue-400 border border-blue-800">Plano de Ação (5W2H)</span>;
      case 'EFFECTIVENESS_CHECK':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">Verificação de Eficácia</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">Concluído / Fechado</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-400">Cancelado</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Não Conformidades & Ciclo CAPA</h2>
            <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
              ISO 9001:2015 • Cláusulas 8.7 & 10.2
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de desvios, contenção imediata, análise de causa raiz (5 Porquês / 6M), 5W2H e verificação de eficácia com trilha de auditoria imutável.
          </p>
        </div>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Não Conformidade</span>
        </button>
      </div>

      {/* Conteúdo Principal: Split View (Lista à Esquerda | Detalhes do Ciclo CAPA à Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Lista de NCs */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Registros Ativos ({nonConformances.length})
          </div>

          <div className="space-y-3">
            {nonConformances.map((nc) => {
              const isSelected = selectedNc?.id === nc.id;
              return (
                <div
                  key={nc.id}
                  onClick={() => setSelectedNc(nc)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400">{nc.code}</span>
                    <div className="flex items-center space-x-2">
                      {getSeverityBadge(nc.severity)}
                      {getStatusBadge(nc.status)}
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 mt-2 line-clamp-1">{nc.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{nc.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Origem: <strong>{nc.source}</strong></span>
                    <span>{new Date(nc.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel Direito: Ciclo CAPA Detalhado */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col space-y-6">
          {selectedNc ? (
            <>
              {/* Header do Registro Selecionado */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 px-2 py-1 bg-blue-950/80 border border-blue-900 rounded">
                    {selectedNc.code}
                  </span>
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(selectedNc.severity)}
                    {getStatusBadge(selectedNc.status)}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{selectedNc.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Registrado em {new Date(selectedNc.created_at).toLocaleString('pt-BR')}</p>
              </div>

              {/* Sub-navegação do Ciclo CAPA */}
              <div className="flex border-b border-slate-800 text-xs font-medium space-x-4">
                <button
                  onClick={() => setActiveSubTab('details')}
                  className={`pb-2 transition ${activeSubTab === 'details' ? 'text-blue-400 border-b-2 border-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  1. Desvio & Contenção
                </button>
                <button
                  onClick={() => setActiveSubTab('root_cause')}
                  className={`pb-2 transition ${activeSubTab === 'root_cause' ? 'text-blue-400 border-b-2 border-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  2. Causa Raiz (5 Porquês)
                </button>
                <button
                  onClick={() => setActiveSubTab('action_plan')}
                  className={`pb-2 transition ${activeSubTab === 'action_plan' ? 'text-blue-400 border-b-2 border-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  3. Plano de Ação (5W2H)
                </button>
                <button
                  onClick={() => setActiveSubTab('effectiveness')}
                  className={`pb-2 transition ${activeSubTab === 'effectiveness' ? 'text-blue-400 border-b-2 border-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  4. Eficácia & Fechamento
                </button>
              </div>

              {/* Conteúdo da Aba 1: Detalhes & Contenção */}
              {activeSubTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase">Descrição Factual do Desvio</h5>
                    <div className="mt-1.5 p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 leading-relaxed">
                      {selectedNc.description}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-amber-400 uppercase flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Ação Imediata de Contenção (Disposição)
                    </h5>
                    <div className="mt-1.5 p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-lg text-sm text-amber-200 leading-relaxed">
                      {selectedNc.containment_actions || 'Nenhuma ação de contenção imediata registrada.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Conteúdo da Aba 2: Causa Raiz (5 Porquês) */}
              {activeSubTab === 'root_cause' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-950/30 border border-blue-900/40 rounded-lg text-xs text-blue-300">
                    A metodologia dos <strong>5 Porquês</strong> identifica a causa fundamental do desvio, evitando correções superficiais.
                  </div>

                  {(selectedNc.root_cause_analysis as any)?.fiveWhys ? (
                    <div className="space-y-2.5">
                      {['why1', 'why2', 'why3', 'why4', 'why5'].map((k, idx) => {
                        const val = (selectedNc.root_cause_analysis as any).fiveWhys[k];
                        if (!val) return null;
                        return (
                          <div key={k} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start space-x-3">
                            <span className="bg-blue-600/20 text-blue-400 font-bold text-xs px-2 py-1 rounded">
                              {idx + 1}º Por quê?
                            </span>
                            <span className="text-sm text-slate-200">{val}</span>
                          </div>
                        );
                      })}
                      <div className="mt-4 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-lg">
                        <span className="text-xs font-bold text-emerald-400 uppercase">Causa Raiz Conclusiva:</span>
                        <p className="text-sm text-emerald-200 mt-1 font-medium">
                          {(selectedNc.root_cause_analysis as any).fiveWhys.rootCauseSummary}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="1º Por quê? (Causa imediata constatada)"
                        value={why1}
                        onChange={e => setWhy1(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="2º Por quê? (Motivo da causa anterior)"
                        value={why2}
                        onChange={e => setWhy2(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="3º Por quê?"
                        value={why3}
                        onChange={e => setWhy3(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="4º Por quê?"
                        value={why4}
                        onChange={e => setWhy4(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="5º Por quê?"
                        value={why5}
                        onChange={e => setWhy5(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <textarea
                        rows={2}
                        placeholder="Resumo conclusivo da causa raiz fundamental..."
                        value={rootSummary}
                        onChange={e => setRootSummary(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleSave5Whys}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-lg transition"
                      >
                        Salvar Análise de Causa Raiz
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Conteúdo da Aba 3: Plano de Ação 5W2H */}
              {activeSubTab === 'action_plan' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {((selectedNc.corrective_actions as ActionPlan5W2HItem[]) || []).map((action) => (
                      <div key={action.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{action.what}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            action.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {action.status === 'COMPLETED' ? 'Concluída' : 'Em Andamento'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                          <div><strong>Quem (Who):</strong> {action.who}</div>
                          <div><strong>Quando (When):</strong> {action.when}</div>
                          <div><strong>Onde (Where):</strong> {action.where}</div>
                          <div><strong>Por quê (Why):</strong> {action.why}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Formulário para adicionar nova ação 5W2H */}
                  <form onSubmit={handleAdd5W2H} className="border-t border-slate-800 pt-4 space-y-3">
                    <span className="text-xs font-semibold text-slate-300 block">Adicionar Ação Corretiva (5W2H)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="O que fazer (What) *"
                        value={what}
                        onChange={e => setWhat(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Por que fazer (Why)"
                        value={why}
                        onChange={e => setWhy(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="Quem executará (Who) *"
                        value={who}
                        onChange={e => setWho(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        required
                      />
                      <input
                        type="date"
                        value={when}
                        onChange={e => setWhen(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-lg transition"
                    >
                      Adicionar Ação ao Plano
                    </button>
                  </form>
                </div>
              )}

              {/* Conteúdo da Aba 4: Eficácia & Fechamento */}
              {activeSubTab === 'effectiveness' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-lg text-xs text-amber-300">
                    A verificação de eficácia (Cláusula 10.2) avalia se as ações corretivas eliminaram a causa raiz e impediram a reincidência do desvio.
                  </div>

                  {selectedNc.status === 'CLOSED' ? (
                    <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-lg text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <h4 className="text-sm font-bold text-emerald-300">Não Conformidade Concluída com Eficácia Comprovada</h4>
                      <p className="text-xs text-slate-400">
                        Fechamento registrado em {new Date(selectedNc.closed_at || '').toLocaleDateString('pt-BR')} com log de auditoria imutável.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <label className="text-xs text-slate-300">Ação foi eficaz na eliminação da causa?</label>
                        <select
                          value={isEffective ? 'true' : 'false'}
                          onChange={e => setIsEffective(e.target.value === 'true')}
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200"
                        >
                          <option value="true">SIM - Eficaz (Concluir NC)</option>
                          <option value="false">NÃO - Ineficaz (Reabrir Investigação)</option>
                        </select>
                      </div>

                      <textarea
                        rows={3}
                        placeholder="Evidências objetivas auditadas (ex: 3 lotes subsequentes inspecionados com 0 defeitos)..."
                        value={evidenceDesc}
                        onChange={e => setEvidenceDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />

                      <button
                        onClick={handleSaveEffectiveness}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-lg transition"
                      >
                        Concluir e Assinar Verificação de Eficácia
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12">
              <FileText className="w-12 h-12 mb-2 stroke-[1.5]" />
              <p className="text-sm">Selecione uma Não Conformidade para visualizar o ciclo CAPA.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Registro de Nova Não Conformidade */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center">
                <AlertTriangle className="w-4 h-4 text-amber-400 mr-2" /> Abertura de Não Conformidade (ISO 9001)
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNc} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Título do Desvio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Trinca superficial em lote de eixos usinados"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Origem *</label>
                  <select
                    value={newSource}
                    onChange={e => setNewSource(e.target.value as NcSource)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="PROCESSO_FABRIL">Processo Fabril</option>
                    <option value="AUDITORIA_INTERNA">Auditoria Interna</option>
                    <option value="RECLAMACAO_CLIENTE">Reclamação de Cliente</option>
                    <option value="INSPECAO_RECEBIMENTO">Inspeção de Recebimento</option>
                    <option value="QUALIFICACAO_FORNECEDOR">Fornecedor</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Severidade *</label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value as NcSeverity)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Descrição Factual Detalhada *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Descreva o que ocorreu, local exato, lote afetado e quantidade..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-amber-300 font-medium block mb-1">Ação Imediata de Contenção (Disposição)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Segregação imediata no almoxarifado de quarentena..."
                  value={newContainment}
                  onChange={e => setNewContainment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Justificativa para Trilha de Auditoria *</label>
                <input
                  type="text"
                  required
                  placeholder="Motivo da abertura do registro para conformidade ISO"
                  value={newReason}
                  onChange={e => setNewReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
                >
                  Registrar e Assinar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
