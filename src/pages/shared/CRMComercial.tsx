import { useState } from 'react';
import { Phone, Mail, FileText, ArrowRight, Search, Filter, Plus, Calendar, Clock, DollarSign, CheckCircle2, AlertCircle, Building2, Flame, UserCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LeadHabitacional {
  id: number;
  nome: string;
  cpfMascarado: string;
  status: 'PRE_APROVADO' | 'CREDITO_A_TRABALHAR' | 'DOCUMENTACAO_PENDENTE' | 'CONTRATADO';
  potencial: number;
  associacaoVinculada: string;
  ultimaAcao: string;
  proximaAcao: string;
  dataProximaAcao: string;
  scoreBancario: number;
}

export default function CRMComercial() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  const [leads] = useState<LeadHabitacional[]>([
    {
      id: 1,
      nome: 'João M. Silva',
      cpfMascarado: '***.482.918-**',
      status: 'PRE_APROVADO',
      potencial: 180000,
      associacaoVinculada: 'Associação Sol Nascente',
      ultimaAcao: 'Simulação realizada via esteira Santander',
      proximaAcao: 'Apresentar Unidade no Espelho de Vendas',
      dataProximaAcao: 'Amanhã, 10:00',
      scoreBancario: 785
    },
    {
      id: 2,
      nome: 'Maria C. Santos',
      cpfMascarado: '***.723.101-**',
      status: 'CREDITO_A_TRABALHAR',
      potencial: 145000,
      associacaoVinculada: 'Associação Moradia Digna Ceilândia',
      ultimaAcao: 'Ajuste de entrada com saldo FGTS',
      proximaAcao: 'Follow-up de composição de renda familiar',
      dataProximaAcao: '20/10/2026',
      scoreBancario: 620
    },
    {
      id: 3,
      nome: 'Carlos Eduardo Peixoto',
      cpfMascarado: '***.195.448-**',
      status: 'DOCUMENTACAO_PENDENTE',
      potencial: 215000,
      associacaoVinculada: 'Associação Parque das Flores',
      ultimaAcao: 'Notificação de pendência de comprovante',
      proximaAcao: 'Receber últimos holerites atualizados',
      dataProximaAcao: '19/10/2026',
      scoreBancario: 710
    },
    {
      id: 4,
      nome: 'Ana Paula Ferreira',
      cpfMascarado: '***.889.332-**',
      status: 'CONTRATADO',
      potencial: 220000,
      associacaoVinculada: 'Associação Sol Nascente',
      ultimaAcao: 'Contrato assinado eletronicamente MP 2.200-2',
      proximaAcao: 'Vistoria e entrega das chaves da unidade',
      dataProximaAcao: '25/10/2026',
      scoreBancario: 840
    }
  ]);

  const leadsFiltrados = leads.filter(l => {
    const matchBusca = l.nome.toLowerCase().includes(busca.toLowerCase()) ||
      l.cpfMascarado.includes(busca) ||
      l.associacaoVinculada.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'TODOS' || l.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const statusMap = {
    PRE_APROVADO: { label: 'Pré-Aprovado', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    CREDITO_A_TRABALHAR: { label: 'Ajuste de Crédito', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    DOCUMENTACAO_PENDENTE: { label: 'Docs Pendentes', bg: 'bg-red-50', text: 'text-[#EC0000]', border: 'border-red-200' },
    CONTRATADO: { label: 'Contratado & Alocado', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' }
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Pipeline Comercial & Habilitação
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            CRM & Gestão de Propostas Habitacionais
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Acompanhamento do funil de conversão, qualificação de crédito e agendamento de formalizações.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/simulador-santander"
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Simular Novo Crédito
          </Link>
          <button
            onClick={() => alert('Abrindo cadastro rápido de novo lead/proponente')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#EC0000] hover:bg-[#CC0000] rounded-xl transition-all shadow-md shadow-red-600/20"
          >
            <Plus className="h-4 w-4" /> Novo Proponente
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome do mutuário, CPF ou associação..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-[#F4F6F9] focus:bg-white focus:border-[#EC0000] focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#EC0000] w-full md:w-auto"
          >
            <option value="TODOS">Todos os Estágios</option>
            <option value="PRE_APROVADO">Pré-Aprovados</option>
            <option value="CREDITO_A_TRABALHAR">Ajuste de Crédito</option>
            <option value="DOCUMENTACAO_PENDENTE">Docs Pendentes</option>
            <option value="CONTRATADO">Contratados</option>
          </select>
        </div>
      </div>

      {/* Grid de Cards de Propostas - Santander Way Style */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {leadsFiltrados.map((lead) => {
          const badge = statusMap[lead.status];
          return (
            <div
              key={lead.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between relative group overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {lead.associacaoVinculada}
                    </span>
                    <h3 className="font-black text-slate-900 text-lg leading-tight">
                      {lead.nome}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      CPF {lead.cpfMascarado} · Score: <strong className="text-slate-800">{lead.scoreBancario} pts</strong>
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F4F6F9] rounded-2xl text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Capacidade / VGV</span>
                    <span className="text-base font-black text-slate-900 mt-0.5 block">
                      R$ {lead.potencial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Previsão Contrato</span>
                    <span className="text-xs font-bold text-slate-800 mt-1 block flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#EC0000]" /> {lead.dataProximaAcao}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Última Ação Realizada:</span>
                    <p className="font-semibold text-slate-800 leading-snug">{lead.ultimaAcao}</p>
                  </div>

                  <div className="p-3 bg-[#FFF5F5] rounded-xl border border-red-100">
                    <span className="text-[10px] uppercase font-bold text-[#EC0000] block mb-1">Próxima Etapa do Pipeline:</span>
                    <p className="font-bold text-slate-900 leading-snug">{lead.proximaAcao}</p>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => alert(`Iniciando contato via WhatsApp com ${lead.nome}`)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5" /> Chamar WhatsApp
                </button>

                <Link
                  to="/admin/espelho-vendas"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#EC0000] hover:bg-[#CC0000] text-white shadow-sm flex items-center gap-1.5 transition-all shadow-red-600/20"
                >
                  Alocar Unidade <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
