import { useState } from 'react';
import {
  Building2,
  Home,
  CheckCircle2,
  Clock,
  Lock,
  UserCheck,
  Search,
  Filter,
  Download,
  PlusCircle,
  Eye,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UnidadeHabitacional, StatusUnidade } from '@/types/habitacional';

export default function EspelhoUnidades() {
  const [empreendimentoSelecionado, setEmpreendimentoSelecionado] = useState('emp-1');
  const [blocoFiltro, setBlocoFiltro] = useState('TODOS');
  const [statusFiltro, setStatusFiltro] = useState<string>('TODOS');
  const [busca, setBusca] = useState('');
  const [unidadeModal, setUnidadeModal] = useState<UnidadeHabitacional | null>(null);

  const [unidades, setUnidades] = useState<UnidadeHabitacional[]>([
    {
      id: 'und-101',
      produto_id: 'emp-1',
      empreendimento_nome: 'Residencial Diamante Sul',
      bloco_quadra: 'Bloco A',
      numero_unidade: '101',
      andar: 1,
      metragem_m2: 58.5,
      quartos: 2,
      vagas: 1,
      valor_unidade: 185000.00,
      status: 'DISPONIVEL'
    },
    {
      id: 'und-102',
      produto_id: 'emp-1',
      empreendimento_nome: 'Residencial Diamante Sul',
      bloco_quadra: 'Bloco A',
      numero_unidade: '102',
      andar: 1,
      metragem_m2: 64.0,
      quartos: 3,
      vagas: 1,
      valor_unidade: 215000.00,
      status: 'RESERVADA',
      associado_vinculado_nome: 'Marcos Vinicius Almeida',
      associado_vinculado_cpf: '***.482.918-**',
      reservado_em: '14/10/2026'
    },
    {
      id: 'und-103',
      produto_id: 'emp-1',
      empreendimento_nome: 'Residencial Diamante Sul',
      bloco_quadra: 'Bloco A',
      numero_unidade: '103',
      andar: 1,
      metragem_m2: 58.5,
      quartos: 2,
      vagas: 1,
      valor_unidade: 185000.00,
      status: 'EM_ANALISE_CREDITO',
      associado_vinculado_nome: 'Ana Cláudia Fontes',
      associado_vinculado_cpf: '***.723.101-**'
    },
    {
      id: 'und-104',
      produto_id: 'emp-1',
      empreendimento_nome: 'Residencial Diamante Sul',
      bloco_quadra: 'Bloco A',
      numero_unidade: '104',
      andar: 1,
      metragem_m2: 58.5,
      quartos: 2,
      vagas: 1,
      valor_unidade: 185000.00,
      status: 'CONTRATADA',
      associado_vinculado_nome: 'Roberto Carlos Silveira',
      associado_vinculado_cpf: '***.195.448-**'
    },
    {
      id: 'und-201',
      produto_id: 'emp-1',
      empreendimento_nome: 'Residencial Diamante Sul',
      bloco_quadra: 'Bloco A',
      numero_unidade: '201',
      andar: 2,
      metragem_m2: 58.5,
      quartos: 2,
      vagas: 1,
      valor_unidade: 188000.00,
      status: 'DISPONIVEL'
    },
    {
      id: 'und-202',
      produto_id: 'emp-1',
      empreendimento_nome: 'Residencial Diamante Sul',
      bloco_quadra: 'Bloco A',
      numero_unidade: '202',
      andar: 2,
      metragem_m2: 64.0,
      quartos: 3,
      vagas: 1,
      valor_unidade: 218000.00,
      status: 'ENTREGUE',
      associado_vinculado_nome: 'Patrícia Mendes Castro'
    },
    {
      id: 'und-203',
      produto_id: 'emp-1',
      empreendimento_nome: 'Residencial Diamante Sul',
      bloco_quadra: 'Bloco B',
      numero_unidade: '101',
      andar: 1,
      metragem_m2: 58.5,
      quartos: 2,
      vagas: 1,
      valor_unidade: 185000.00,
      status: 'DISPONIVEL'
    },
    {
      id: 'und-204',
      produto_id: 'emp-1',
      empreendimento_nome: 'Residencial Diamante Sul',
      bloco_quadra: 'Bloco B',
      numero_unidade: '102',
      andar: 1,
      metragem_m2: 64.0,
      quartos: 3,
      vagas: 1,
      valor_unidade: 215000.00,
      status: 'RESERVADA',
      associado_vinculado_nome: 'João M. Silva'
    }
  ]);

  const statusCores: Record<StatusUnidade, { bg: string; text: string; borda: string; label: string }> = {
    DISPONIVEL: { bg: 'bg-emerald-50', text: 'text-emerald-700', borda: 'border-emerald-300', label: 'Disponível' },
    RESERVADA: { bg: 'bg-amber-50', text: 'text-amber-700', borda: 'border-amber-300', label: 'Reservada' },
    EM_ANALISE_CREDITO: { bg: 'bg-blue-50', text: 'text-blue-700', borda: 'border-blue-300', label: 'Em Análise Caixa/Banco' },
    CONTRATADA: { bg: 'bg-purple-50', text: 'text-purple-700', borda: 'border-purple-300', label: 'Contratada' },
    ENTREGUE: { bg: 'bg-slate-100', text: 'text-slate-700', borda: 'border-slate-300', label: 'Chaves Entregues' }
  };

  const unidadesFiltradas = unidades.filter(u => {
    const matchBloco = blocoFiltro === 'TODOS' || u.bloco_quadra === blocoFiltro;
    const matchStatus = statusFiltro === 'TODOS' || u.status === statusFiltro;
    const matchBusca =
      u.numero_unidade.includes(busca) ||
      u.bloco_quadra.toLowerCase().includes(busca.toLowerCase()) ||
      (u.associado_vinculado_nome && u.associado_vinculado_nome.toLowerCase().includes(busca.toLowerCase()));
    return matchBloco && matchStatus && matchBusca;
  });

  const totalDisponiveis = unidades.filter(u => u.status === 'DISPONIVEL').length;
  const totalReservadas = unidades.filter(u => u.status === 'RESERVADA' || u.status === 'EM_ANALISE_CREDITO').length;
  const totalContratadas = unidades.filter(u => u.status === 'CONTRATADA' || u.status === 'ENTREGUE').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Espelho de Vendas & Mapeamento de Unidades
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Padrão Cooperativo & Construtora
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Matriz interativa de alocação de lotes e apartamentos em tempo real com vinculação aos associados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Exportar Espelho
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors">
            <PlusCircle className="h-4 w-4" /> Cadastrar Lote / Bloco
          </button>
        </div>
      </div>

      {/* Cards de Resumo do Empreendimento */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total de Unidades</span>
          <p className="text-3xl font-black text-slate-900 mt-2">{unidades.length}</p>
          <p className="text-xs text-slate-400 mt-1">Residencial Diamante Sul</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-soft">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Disponíveis</span>
          <p className="text-3xl font-black text-emerald-600 mt-2">{totalDisponiveis}</p>
          <p className="text-xs text-emerald-600 mt-1">Aptas para reserva</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-soft">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">Em Negociação / Reserva</span>
          <p className="text-3xl font-black text-amber-600 mt-2">{totalReservadas}</p>
          <p className="text-xs text-amber-600 mt-1">Aguardando parecer bancário</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-soft">
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block">Contratadas / Entregues</span>
          <p className="text-3xl font-black text-purple-600 mt-2">{totalContratadas}</p>
          <p className="text-xs text-purple-600 mt-1">Formalizadas com contrato</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por unidade, bloco ou associado vinculado..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={blocoFiltro}
            onChange={e => setBlocoFiltro(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos os Blocos</option>
            <option value="Bloco A">Bloco A</option>
            <option value="Bloco B">Bloco B</option>
          </select>

          <select
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="DISPONIVEL">Disponível</option>
            <option value="RESERVADA">Reservada</option>
            <option value="EM_ANALISE_CREDITO">Em Análise</option>
            <option value="CONTRATADA">Contratada</option>
            <option value="ENTREGUE">Entregue</option>
          </select>
        </div>
      </div>

      {/* Grid Visual de Unidades - Matriz Espelho */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Mapa de Ocupação por Unidade
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {Object.entries(statusCores).map(([st, c]) => (
              <span key={st} className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className={`w-3 h-3 rounded-full border ${c.bg} ${c.borda}`} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {unidadesFiltradas.map(unidade => {
            const estilo = statusCores[unidade.status];
            return (
              <div
                key={unidade.id}
                onClick={() => setUnidadeModal(unidade)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between ${estilo.bg} ${estilo.borda}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">{unidade.bloco_quadra}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${estilo.bg} ${estilo.text} border ${estilo.borda}`}>
                      {estilo.label}
                    </span>
                  </div>

                  <h4 className="text-2xl font-black text-slate-900 mt-2">
                    Apto {unidade.numero_unidade}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1">
                    {unidade.metragem_m2}m² · {unidade.quartos} quartos · {unidade.vagas} vaga
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <p className="text-xs font-bold text-slate-900">
                    R$ {unidade.valor_unidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {unidade.associado_vinculado_nome ? (
                    <p className="text-[11px] text-slate-600 truncate mt-0.5 flex items-center gap-1">
                      <UserCheck className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      {unidade.associado_vinculado_nome}
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      ✓ Liberado para Alocação
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalhes da Unidade */}
      {unidadeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Unidade {unidadeModal.numero_unidade} — {unidadeModal.bloco_quadra}
              </h3>
              <button
                onClick={() => setUnidadeModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-xs text-slate-400 block">Metragem Privativa</span>
                  <span className="font-bold text-slate-800">{unidadeModal.metragem_m2} m²</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Quartos / Vagas</span>
                  <span className="font-bold text-slate-800">{unidadeModal.quartos} Qts · {unidadeModal.vagas} Vaga</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Valor Avaliado</span>
                  <span className="font-bold text-emerald-600">R$ {unidadeModal.valor_unidade.toLocaleString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Situação Atual</span>
                  <span className="font-bold text-blue-600">{statusCores[unidadeModal.status].label}</span>
                </div>
              </div>

              {unidadeModal.associado_vinculado_nome && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-xs font-semibold text-blue-900">Associado Vinculado:</p>
                  <p className="font-bold text-slate-900 text-sm">{unidadeModal.associado_vinculado_nome}</p>
                  {unidadeModal.associado_vinculado_cpf && (
                    <p className="text-xs text-slate-500 font-mono">CPF: {unidadeModal.associado_vinculado_cpf}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setUnidadeModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Fechar
              </button>
              {unidadeModal.status === 'DISPONIVEL' && (
                <button
                  onClick={() => {
                    alert(`Unidade ${unidadeModal.numero_unidade} vinculada para convocação de associado!`);
                    setUnidadeModal(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Alocar Próximo da Fila Social
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
