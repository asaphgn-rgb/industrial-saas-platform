import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Users,
  PieChart as PieIcon,
  Clock,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Filter,
  Share2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const ReportsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Últimos 12 meses');
  const [reportCategory, setReportCategory] = useState('Todos');

  const scheduledReports = [
    {
      title: 'Relatório Regulatório BACEN - SCR 3040',
      period: 'Mensal (todo dia 05)',
      format: 'XML / PDF',
      status: 'Transmitido',
      lastRun: '05/05/2025',
    },
    {
      title: 'Demonstrativo de Resultados Gerenciais (DRE)',
      period: 'Mensal (todo dia 01)',
      format: 'XLSX / PDF',
      status: 'Concluído',
      lastRun: '01/05/2025',
    },
    {
      title: 'Auditoria de Transações Pix & BaaS',
      period: 'Semanal (Segundas-feiras)',
      format: 'CSV Criptografado',
      status: 'Concluído',
      lastRun: '12/05/2025',
    },
    {
      title: 'Painel de Retenção & Churn de Associados',
      period: 'Quinzenal',
      format: 'PDF Executivo',
      status: 'Agendado',
      lastRun: '15/05/2025',
    },
  ];

  const productMix = [
    { name: 'Conta Digital & Pix', share: '38%', color: 'bg-blue-600' },
    { name: 'Clube de Benefícios', share: '26%', color: 'bg-emerald-500' },
    { name: 'Crédito PJ & Giro', share: '18%', color: 'bg-amber-500' },
    { name: 'Cartões & Meios', share: '12%', color: 'bg-purple-500' },
    { name: 'Seguros & Previdência', share: '6%', color: 'bg-rose-500' },
  ];

  const channelPerformance = [
    { channel: 'App Mobile DYAMOND', conversion: '68%', volume: 'R$ 840 mil', color: 'bg-blue-600' },
    { channel: 'Mesa de Crédito / Gerente', conversion: '22%', volume: 'R$ 620 mil', color: 'bg-emerald-600' },
    { channel: 'Marketplace de Parceiros', conversion: '7%', volume: 'R$ 290 mil', color: 'bg-amber-600' },
    { channel: 'Portal Web Corporativo', conversion: '3%', volume: 'R$ 110 mil', color: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Relatórios</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Inteligência financeira, métricas operacionais e prestação de contas regulatória.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none"
          >
            <option>Últimos 12 meses</option>
            <option>Últimos 90 dias</option>
            <option>Últimos 30 dias</option>
            <option>Ano corrente (2025)</option>
          </select>

          <button
            onClick={() => alert('Exportando dossiê executivo completo em PDF institucional.')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 24,8% a.a.
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Receita bruta acumulada
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">R$ 2,42 mi</p>
            <p className="text-[10px] text-slate-500 mt-1">Margem líquida operacional: 38,2%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 18,4% a.a.
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Base de associados
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">1.436</p>
            <p className="text-[10px] text-slate-500 mt-1">87% associados com &gt;2 produtos</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              R$ 148 / mês
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              LTV médio por cliente
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">R$ 3.550</p>
            <p className="text-[10px] text-slate-500 mt-1">Tempo médio de permanência: 24 meses</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Benchmark &lt; 2%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Taxa de churn anual
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">1,2%</p>
            <p className="text-[10px] text-slate-500 mt-1">Retenção de elite padrão bancário</p>
          </div>
        </div>
      </div>

      {/* Row 2: Evolução de Receita e Associados (8 cols) + Mix de Produtos (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Curva de Crescimento (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Evolução de receita e crescimento da base
                </h2>
                <p className="text-[11px] text-slate-500">
                  Comparativo mensal em milhares de reais vs novos contratos ativos.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-blue-600" /> Receita (R$)
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Associados
                </span>
              </div>
            </div>

            {/* Simulated High-Res Curve SVG */}
            <div className="py-6">
              <svg className="w-full h-44" viewBox="0 0 600 160" fill="none">
                {/* Background Grid Lines */}
                <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="60" x2="600" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="20" x2="600" y2="20" stroke="#F1F5F9" strokeWidth="1" />

                {/* Revenue Curve (Blue) */}
                <path
                  d="M 20 120 C 80 115, 140 105, 200 90 C 260 75, 320 80, 380 60 C 440 45, 500 35, 580 20"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Clients Curve (Emerald) */}
                <path
                  d="M 20 135 C 80 130, 140 125, 200 110 C 260 95, 320 90, 380 75 C 440 60, 500 50, 580 35"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Dots along blue curve */}
                {[
                  [20, 120],
                  [110, 110],
                  [200, 90],
                  [290, 78],
                  [380, 60],
                  [480, 40],
                  [580, 20],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                ))}
              </svg>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Mai/24</span>
                <span>Jul/24</span>
                <span>Set/24</span>
                <span>Nov/24</span>
                <span>Jan/25</span>
                <span>Mar/25</span>
                <span>Mai/25</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Crescimento médio composto mensal: <strong className="text-emerald-600">+4,1%</strong>
            </span>
            <button
              onClick={() => alert('Download do modelo de projeção em planilha Excel.')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              Baixar modelo financeiro (XLSX) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mix de Produtos (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900">Mix de Receita</h2>
              <PieIcon className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              Distribuição percentual por vertical de negócio.
            </p>

            {/* Stacked Bar Representation */}
            <div className="h-4 w-full rounded-full overflow-hidden flex my-4 bg-slate-100">
              <div className="h-full bg-blue-600" style={{ width: '38%' }} title="Conta & Pix (38%)" />
              <div className="h-full bg-emerald-500" style={{ width: '26%' }} title="Benefícios (26%)" />
              <div className="h-full bg-amber-500" style={{ width: '18%' }} title="Crédito (18%)" />
              <div className="h-full bg-purple-500" style={{ width: '12%' }} title="Cartões (12%)" />
              <div className="h-full bg-rose-500" style={{ width: '6%' }} title="Seguros (6%)" />
            </div>

            {/* Product breakdown list */}
            <div className="space-y-2 text-xs">
              {productMix.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${p.color}`} />
                    <span className="font-semibold text-slate-800">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{p.share}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-[11px] text-blue-900">
            <strong>Insight Corporativo:</strong> O Clube de Benefícios e a Conta Digital possuem a maior taxa de cross-sell (64%), elevando o LTV da base.
          </div>
        </div>
      </div>

      {/* Row 3: Desempenho por Canal (6 cols) + Relatórios Agendados (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Desempenho por Canal */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Desempenho por Canal</h2>
            <p className="text-[11px] text-slate-500">
              Volume e taxa de conversão das contratações por ponto de contato.
            </p>
          </div>

          <div className="space-y-3">
            {channelPerformance.map((ch, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{ch.channel}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">{ch.volume}</span>
                    <span className="font-bold text-blue-600">{ch.conversion}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${ch.color} rounded-full`}
                    style={{ width: ch.conversion }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Relatórios Agendados & Regulatórios */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Relatórios Agendados & Regulatórios</h2>
              <p className="text-[11px] text-slate-500">
                Rotinas automáticas de geração e envio para órgãos e diretoria.
              </p>
            </div>
            <button
              onClick={() => alert('Configurar nova rotina de relatório agendado.')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              + Novo Agendamento
            </button>
          </div>

          <div className="space-y-2.5">
            {scheduledReports.map((rep, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{rep.title}</h3>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      ● {rep.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Frequência: {rep.period} • Formato: {rep.format} • Último envio: {rep.lastRun}
                  </p>
                </div>

                <button
                  onClick={() => alert(`Baixando cópia oficial de: ${rep.title}`)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-slate-200 shadow-xs transition-all"
                  title="Baixar arquivo"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
