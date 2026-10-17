import React, { useState } from 'react';
import {
  Gift,
  HeartPulse,
  Pill,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Plane,
  Users,
  ChevronRight,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const BenefitsView: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState({
    name: 'Ricardo Costa',
    cpf: 'CPF 123.456.789-00',
    clientSince: '03/2022',
    planName: 'DYAMOND Mais',
    planStatus: 'Ativo',
    dependents: [
      { name: 'Ana Costa', relation: 'Cônjuge', status: 'Ativo' },
      { name: 'Lucas Costa', relation: 'Filho', status: 'Ativo' },
      { name: 'Mariana Costa', relation: 'Filha', status: 'Ativo' },
    ],
  });

  const categories = [
    {
      title: 'Saúde',
      icon: HeartPulse,
      count: '112 parceiros ativos',
      desc: 'Consultas, exames e bem-estar',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Farmácia',
      icon: Pill,
      count: '76 parceiros ativos',
      desc: 'Medicamentos e descontos em redes nacionais',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Educação',
      icon: GraduationCap,
      count: '54 parceiros ativos',
      desc: 'Cursos, idiomas e capacitação profissional',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Lazer',
      icon: Sparkles,
      count: '48 parceiros ativos',
      desc: 'Cinema, parques, teatros e entretenimento',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Assistência',
      icon: ShieldCheck,
      count: '62 parceiros ativos',
      desc: 'Residencial, automotiva e funeral familiar',
      color: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Viagens',
      icon: Plane,
      count: '36 parceiros ativos',
      desc: 'Hotéis, passagens aéreas e experiências',
      color: 'bg-sky-50 text-sky-600',
    },
  ];

  const recentRequests = [
    {
      date: '14/04/2025',
      client: 'Ricardo Costa',
      benefit: 'Farmácia',
      status: 'Aprovada',
      channel: 'Portal',
    },
    {
      date: '12/04/2025',
      client: 'Juliana Mendes',
      benefit: 'Saúde',
      status: 'Em análise',
      channel: 'Atendimento',
    },
    {
      date: '10/04/2025',
      client: 'Carlos Silva',
      benefit: 'Lazer',
      status: 'Aprovada',
      channel: 'App',
    },
    {
      date: '09/04/2025',
      client: 'Fernanda Alves',
      benefit: 'Educação',
      status: 'Aprovada',
      channel: 'Portal',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Benefícios</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Gestão de planos, elegibilidade, utilização e rede credenciada.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs font-semibold text-slate-500">
            Cuidar de pessoas também é um grande negócio.
          </span>
        </div>
      </div>

      {/* Main Grid: Left Column (8 cols) + Right Elegibilidade Column (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-5">
          {/* Banner Clube de Benefícios DYAMOND */}
          <div className="rounded-2xl p-6 bg-gradient-to-r from-dyamond-navy-950 via-dyamond-navy-900 to-blue-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-corporate border border-white/10 relative overflow-hidden">
            <div className="space-y-2 z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-dyamond-gold-400 font-bold">
                CLUBE CORPORATIVO DYAMOND
              </span>
              <h2 className="text-xl font-black">Clube de Benefícios DYAMOND</h2>
              <p className="text-xs text-slate-300 max-w-md">
                Mais saúde, bem-estar e oportunidades para o que realmente importa para sua equipe e associados.
              </p>
            </div>

            <div className="flex items-center gap-6 z-10">
              <div className="text-center">
                <span className="text-2xl font-black font-sans text-white block">1.436</span>
                <span className="text-[11px] text-slate-400">beneficiários ativos</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <span className="text-2xl font-black font-sans text-emerald-400 block">87%</span>
                <span className="text-[11px] text-slate-400">taxa de renovação</span>
              </div>
            </div>
          </div>

          {/* 3 Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Rede credenciada
                </span>
                <p className="text-xl font-black text-slate-900 font-sans mt-0.5">318</p>
                <p className="text-[10px] text-slate-500 mt-1">parceiros ativos</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Economia gerada
                </span>
                <p className="text-xl font-black text-emerald-600 font-sans mt-0.5">R$ 214 mil</p>
                <p className="text-[10px] text-slate-500 mt-1">em 12 meses</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Utilização mensal
                </span>
                <p className="text-xl font-black text-slate-900 font-sans mt-0.5">64%</p>
                <p className="text-[10px] text-slate-500 mt-1">dos beneficiários</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Categorias de Benefícios (6 Cards) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Categorias de benefícios</h2>
              <button
                onClick={() => alert('Lista completa de todos os 318 convênios credenciados.')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                Ver todos os parceiros <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200/70 hover:border-blue-400 hover:bg-slate-50/50 cursor-pointer transition-all flex items-start gap-3"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900">{cat.title}</h3>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </div>
                      <p className="text-[11px] font-bold text-blue-600 mt-0.5">{cat.count}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row: Solicitações Recentes (Table) + Uso por mês (Chart) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            {/* Solicitações Recentes */}
            <div className="sm:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Solicitações recentes</h3>
                <button className="text-xs text-blue-600 font-semibold hover:underline">
                  Ver todas →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="py-2 px-2.5">Data</th>
                      <th className="py-2 px-2.5">Cliente</th>
                      <th className="py-2 px-2.5">Benefício</th>
                      <th className="py-2 px-2.5">Status</th>
                      <th className="py-2 px-2.5">Canal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentRequests.map((req, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-400">
                          {req.date}
                        </td>
                        <td className="py-2.5 px-2.5 font-medium text-slate-900">
                          {req.client}
                        </td>
                        <td className="py-2.5 px-2.5 text-slate-600">
                          {req.benefit}
                        </td>
                        <td className="py-2.5 px-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              req.status === 'Aprovada'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            ● {req.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-slate-400 text-[11px]">
                          {req.channel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Uso por mês (Sparkline / Line chart) */}
            <div className="sm:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">Uso por mês</h3>
                  <span className="text-[10px] text-slate-400">Últimos 12 meses</span>
                </div>
                <p className="text-xl font-black text-blue-600 font-sans">64%</p>
                <p className="text-[10px] text-slate-400">taxa média de engajamento ativo</p>
              </div>

              {/* Simulated Line Graphic SVG */}
              <div className="py-4">
                <svg className="w-full h-24 text-blue-600" viewBox="0 0 300 80" fill="none">
                  <path
                    d="M 10 65 L 40 55 L 70 58 L 100 50 L 130 45 L 160 48 L 190 40 L 220 35 L 250 30 L 280 20"
                    stroke="#2563EB"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {[
                    [10, 65],
                    [40, 55],
                    [70, 58],
                    [100, 50],
                    [130, 45],
                    [160, 48],
                    [190, 40],
                    [220, 35],
                    [250, 30],
                    [280, 20],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="4" fill="#2563EB" className="animate-pulse" />
                  ))}
                </svg>
                <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>Mai</span>
                  <span>Jul</span>
                  <span>Set</span>
                  <span>Dez</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Elegibilidade do Cliente (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Elegibilidade do cliente</h3>
              <button className="text-xs text-blue-600 font-semibold hover:underline">
                Alterar cliente
              </button>
            </div>

            {/* Client Pill */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">
                RC
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedClient.name}</h4>
                <p className="text-xs font-mono text-slate-400">{selectedClient.cpf}</p>
                <p className="text-[10px] text-slate-500">Cliente desde {selectedClient.clientSince}</p>
              </div>
            </div>

            {/* Plano Atual Box */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Plano atual</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  ● Ativo
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900">{selectedClient.planName}</h4>
              <p className="text-[11px] text-slate-500">
                Cobertura completa com clube de benefícios corporativos.
              </p>
              <button className="text-xs text-blue-600 font-semibold hover:underline block pt-1">
                Ver detalhes do plano →
              </button>
            </div>

            {/* Dependentes (3) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Dependentes ({selectedClient.dependents.length})
                </span>
                <button className="text-[10px] text-blue-600 font-semibold hover:underline">
                  Gerenciar
                </button>
              </div>

              <div className="space-y-1.5">
                {selectedClient.dependents.map((dep, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{dep.name}</p>
                      <p className="text-[10px] text-slate-400">{dep.relation}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      {dep.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => alert(`Liberando benefício especial para ${selectedClient.name}`)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>Liberar benefício</span>
            </button>
            <button
              onClick={() => alert(`Consultando elegibilidade regulatória no bureau para ${selectedClient.name}`)}
              className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Consultar elegibilidade</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
