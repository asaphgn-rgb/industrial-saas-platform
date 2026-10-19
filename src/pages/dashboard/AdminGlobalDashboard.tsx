import { useState } from 'react';
import {
  Users,
  Building2,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Award,
  ChevronRight,
  FileCheck,
  Landmark,
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  ArrowDownRight,
  Wallet,
  Clock,
  Check,
  X,
  FileSpreadsheet,
  Layers,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlcadaAprovacaoWorkflow } from '@/types/enterprise-core';

export default function AdminGlobalDashboard() {
  const kpis = [
    { title: 'Total de Federações', value: '12', sub: '+2 homologadas este ano', trend: '+16.8%', trendPositive: true, icon: Building2 },
    { title: 'Associações Ativas', value: '148', sub: 'Rede em 18 estados', trend: '+8.4%', trendPositive: true, icon: Users },
    { title: 'Associados (Base)', value: '15.430', sub: 'Cadastros auditados LGPD', trend: '+12.5%', trendPositive: true, icon: Users },
    { title: 'Crédito Pré-Aprovado', value: 'R$ 84.5M', sub: '4.210 famílias aptas', trend: '+24.1%', trendPositive: true, icon: ShieldCheck }
  ];

  // Alçadas de Aprovação Pendentes (SAP Workflow Engine Model)
  const [alcadas, setAlcadas] = useState<AlcadaAprovacaoWorkflow[]>([
    {
      id: 'alc-101',
      tipo_solicitacao: 'APROVACAO_CREDITO',
      entidade_referencia: 'propostas',
      registro_id: 'prop-8842',
      nivel_alcada: 3,
      papel_obrigatorio: 'ADMIN_GLOBAL',
      status_decisao: 'PENDENTE',
      parecer_tecnico: 'Proposta habitacional acima de R$ 350.000,00 (Quadra 01, Lote 04) - Parecer da Associação e Federação favoráveis.',
      data_decisao: undefined,
      created_at: 'Hoje, 10:15'
    },
    {
      id: 'alc-102',
      tipo_solicitacao: 'RESERVA_UNIDADE',
      entidade_referencia: 'unidades_habitacionais',
      registro_id: 'und-102',
      nivel_alcada: 2,
      papel_obrigatorio: 'ADMIN_GLOBAL',
      status_decisao: 'PENDENTE',
      parecer_tecnico: 'Reserva especial de lote para mutuário cotista prioritário com pontuação social 94.2 pts.',
      data_decisao: undefined,
      created_at: 'Hoje, 09:40'
    },
    {
      id: 'alc-103',
      tipo_solicitacao: 'CESSAO_DIREITOS',
      entidade_referencia: 'contratos_digitais',
      registro_id: 'cnt-4402',
      nivel_alcada: 3,
      papel_obrigatorio: 'ADMIN_GLOBAL',
      status_decisao: 'PENDENTE',
      parecer_tecnico: 'Transferência de titularidade de cota habitacional com quitação de taxas e termo de anuência.',
      data_decisao: undefined,
      created_at: 'Ontem, 17:20'
    }
  ]);

  const despacharAlcada = (id: string, decisao: 'APROVADO' | 'REPROVADO') => {
    setAlcadas(prev =>
      prev.map(a => (a.id === id ? { ...a, status_decisao: decisao, data_decisao: new Date().toISOString() } : a))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Header Coinest Style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E2EBE5]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              Painel de Controle Executivo
            </span>
            <span className="text-xs text-[#88A395] font-semibold">Padrão SAP RE-FX / TOTVS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#15241E] mt-1.5 font-sans">
            Visão Geral da Rede Habitacional
          </h2>
          <p className="text-xs sm:text-sm text-[#526E62] mt-0.5">
            Governança da rede Morar Bem Brasil, esteiras de crédito e auditoria multi-tenant.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/livro-razao"
            className="px-4 py-2.5 text-xs font-bold text-[#16382C] bg-white border border-[#E2EBE5] rounded-2xl hover:bg-[#F4F7F5] transition-all shadow-sm flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4 text-[#16382C]" />
            Livro-Razão Contábil
          </Link>
          <Link
            to="/admin/simulador-santander"
            className="px-4 py-2.5 text-xs font-bold text-[#16382C] bg-white border border-[#E2EBE5] rounded-2xl hover:bg-[#F4F7F5] transition-all shadow-sm flex items-center gap-2"
          >
            <Sliders className="h-4 w-4 text-[#16382C]" />
            Simulador Habitacional
          </Link>
          <Link
            to="/admin/espelho-vendas"
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#16382C] hover:bg-[#112B22] rounded-2xl transition-all shadow-md shadow-[#16382C]/10 flex items-center gap-2"
          >
            Espelho de Lotes <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid de 4 KPIs no Formato Coinest Card */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="rounded-3xl border border-[#E2EBE5] bg-white p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-[#88A395] uppercase mb-1.5">{kpi.title}</p>
                <p className="text-3xl font-black text-[#15241E] tracking-tight">{kpi.value}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    kpi.trendPositive ? 'bg-[#E8F8EE] text-[#16382C]' : 'bg-red-50 text-red-600'
                  }`}>
                    {kpi.trendPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.trend}
                  </span>
                  <span className="text-[11px] font-medium text-[#88A395] truncate">{kpi.sub}</span>
                </div>
              </div>
              <div className="rounded-2xl p-3 bg-[#E8F8EE] border border-[#C8F2D6]">
                <kpi.icon className="h-5 w-5 text-[#16382C]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seção Principal: Funil da Carteira + Gráfico de Fluxo e Distribuição */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Funil da Carteira Habitacional (7 Colunas) */}
        <div className="lg:col-span-7 rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E2EBE5]/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#E8F8EE] text-[#16382C] rounded-2xl border border-[#C8F2D6]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#15241E]">
                    Funil da Carteira Habitacional
                  </h3>
                  <p className="text-xs text-[#88A395]">Etapas de habilitação e contratação das famílias</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#16382C] bg-[#C8F2D6] px-3 py-1 rounded-full">
                15.430 inscritos
              </span>
            </div>

            <div className="space-y-4">
              {[
                { etapa: '1. Cadastro & Documentação', total: 15430, pct: 100, cor: 'bg-[#16382C]' },
                { etapa: '2. Scoring Social Concluído', total: 11200, pct: 72, cor: 'bg-[#1F4E3D]' },
                { etapa: '3. Pré-Aprovação de Crédito', total: 4210, pct: 27, cor: 'bg-[#10B981]' },
                { etapa: '4. Unidade Selecionada & Contrato', total: 1850, pct: 12, cor: 'bg-[#C8F2D6] text-[#16382C]' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5]">
                  <div className="flex justify-between text-xs font-bold text-[#15241E]">
                    <span>{item.etapa}</span>
                    <span>{item.total.toLocaleString()} ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-[#E2EBE5] h-2.5 rounded-full overflow-hidden">
                    <div className={`${item.cor} h-full rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2EBE5]/60 flex items-center justify-between text-xs">
            <span className="text-[#88A395]">Critérios auditados conforme termo de adesão e LGPD</span>
            <Link to="/admin/crm" className="text-[#16382C] font-bold hover:underline inline-flex items-center gap-1">
              Ver CRM Completo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Card em Destaque: Cartão Verde Floresta Coinest (5 Colunas) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#16382C] text-white p-7 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F4E3D] rounded-full blur-3xl opacity-50 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#C8F2D6] text-[#16382C]">
                Cartão Diamond BaaS
              </span>
              <span className="text-xs text-[#C8F2D6] font-semibold">Conta Corporativa</span>
            </div>

            <div className="pt-2">
              <p className="text-xs text-[#88A395] uppercase tracking-wider font-bold">Saldo sob Gestão</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
                R$ 1.377.000<span className="text-lg text-[#C8F2D6]">,00</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-[10px] text-[#C8F2D6] font-bold uppercase">Repasses Lojistas</p>
                <p className="text-base font-bold text-white mt-0.5">R$ 415.000,00</p>
                <p className="text-[10px] text-[#A3E635] mt-0.5">D+1 Liquidado</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-[10px] text-[#C8F2D6] font-bold uppercase">Cashback Moradia</p>
                <p className="text-base font-bold text-white mt-0.5">R$ 56.400,00</p>
                <p className="text-[10px] text-[#C8F2D6] mt-0.5">Amortizado</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-[#C8F2D6]" />
              </div>
              <span className="text-xs text-[#C8F2D6] font-medium">Bacen & PCI-DSS Blindado</span>
            </div>
            <Link
              to="/cartao"
              className="px-4 py-2 rounded-xl bg-[#C8F2D6] hover:bg-[#b5e8c4] text-[#16382C] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              Acessar Cartão <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* NOVO: Motor de Alçadas de Aprovação & Workflow Hierárquico (Padrão SAP/TOTVS) */}
      <div className="bg-white rounded-3xl border border-[#E2EBE5] p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2EBE5]/60 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#15241E]">
                Alçadas de Decisão & Workflow de Governança
              </h3>
              <p className="text-xs text-[#88A395]">
                Despachos mandatórios da Presidência e Federações conforme limites de competência
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#16382C] bg-[#E8F8EE] border border-[#C8F2D6] px-3 py-1 rounded-full">
            {alcadas.filter(a => a.status_decisao === 'PENDENTE').length} Solicitações Pendentes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2EBE5] text-[#88A395] uppercase font-bold text-[10px]">
                <th className="pb-3">Tipo de Solicitação</th>
                <th className="pb-3">Alçada Requerida</th>
                <th className="pb-3">Parecer Técnico / Objeto</th>
                <th className="pb-3">Data</th>
                <th className="pb-3 text-right">Status / Despacho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EBE5]/60 font-medium">
              {alcadas.map(a => (
                <tr key={a.id} className="hover:bg-[#F4F7F5]/50 transition-colors">
                  <td className="py-3.5 pr-3">
                    <span className="font-bold text-[#15241E] block">
                      {a.tipo_solicitacao.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-[#88A395] font-mono">Ref: {a.registro_id}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F4F7F5] border border-[#E2EBE5] text-[#16382C]">
                      Nível {a.nivel_alcada} · {a.papel_obrigatorio}
                    </span>
                  </td>
                  <td className="py-3.5 text-[#526E62] max-w-md">
                    <p className="line-clamp-2">{a.parecer_tecnico}</p>
                  </td>
                  <td className="py-3.5 text-[#88A395] whitespace-nowrap text-[11px]">
                    {a.created_at}
                  </td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    {a.status_decisao === 'PENDENTE' ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => despacharAlcada(a.id, 'APROVADO')}
                          className="px-3 py-1.5 rounded-xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 text-[#C8F2D6]" />
                          Homologar
                        </button>
                        <button
                          onClick={() => despacharAlcada(a.id, 'REPROVADO')}
                          className="px-2.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        a.status_decisao === 'APROVADO' ? 'bg-[#E8F8EE] text-[#16382C]' : 'bg-red-50 text-red-600'
                      }`}>
                        {a.status_decisao}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
