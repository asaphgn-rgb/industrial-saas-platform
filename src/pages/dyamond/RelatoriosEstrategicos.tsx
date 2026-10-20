import { useState } from 'react';
import {
  FileText,
  TrendingUp,
  Users,
  Award,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  Eye,
  FileSpreadsheet,
  PieChart as PieIcon,
  BarChart3,
  Building2,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

export default function RelatoriosEstrategicos() {
  const [periodo, setPeriodo] = useState('12_meses');

  const kpis = [
    { title: 'Receita gerada', value: 'R$ 3,84 mi', sub: 'vs. período anterior', trend: '+ 12%', icon: TrendingUp, bg: 'bg-[#E6F7ED]', color: 'text-[#00A854]' },
    { title: 'Taxa de ativação', value: '74%', sub: 'vs. período anterior', trend: '+ 6 p.p.', icon: Users, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
    { title: 'Retenção', value: '87%', sub: 'vs. período anterior', trend: '+ 4 p.p.', icon: Award, bg: 'bg-[#FEF3C7]', color: 'text-[#D97706]' },
    { title: 'NPS', value: '92', sub: 'vs. período anterior', trend: '+ 8', icon: Award, bg: 'bg-[#FFE4E6]', color: 'text-[#E11D48]' },
  ];

  // Dados de Evolução de Receita e Clientes (Linhas)
  const dadosEvolucao = [
    { mes: 'Jan', receita: 0.7, clientes: 20 },
    { mes: 'Fev', receita: 0.85, clientes: 22 },
    { mes: 'Mar', receita: 0.9, clientes: 25 },
    { mes: 'Abr', receita: 1.1, clientes: 28 },
    { mes: 'Mai', receita: 1.25, clientes: 30 },
    { mes: 'Jun', receita: 1.35, clientes: 33 },
    { mes: 'Jul', receita: 1.45, clientes: 36 },
    { mes: 'Ago', receita: 1.6, clientes: 39 },
    { mes: 'Set', receita: 1.75, clientes: 42 },
    { mes: 'Out', receita: 1.9, clientes: 45 },
    { mes: 'Nov', receita: 2.05, clientes: 47 },
    { mes: 'Dez', receita: 3.84, clientes: 48 },
  ];

  // Mix de Produtos (Donut Chart)
  const mixProdutos = [
    { nome: 'Conta & PIX', pct: 32, valor: 'R$ 1,23 mi', cor: '#0066FF' },
    { nome: 'Benefícios', pct: 24, valor: 'R$ 0,92 mi', cor: '#00A854' },
    { nome: 'Crédito', pct: 18, valor: 'R$ 0,69 mi', cor: '#F59E0B' },
    { nome: 'Cartão', pct: 16, valor: 'R$ 0,61 mi', cor: '#9333EA' },
    { nome: 'Marketplace', pct: 10, valor: 'R$ 0,38 mi', cor: '#64748B' },
  ];

  // Desempenho por Canal (BarChart)
  const desempenhoCanal = [
    { canal: 'Canal próprio', receita: 1.42, pct: '37%', cor: '#0066FF' },
    { canal: 'Correspondentes', receita: 0.96, pct: '25%', cor: '#00A854' },
    { canal: 'Parcerias', receita: 0.73, pct: '19%', cor: '#F59E0B' },
    { canal: 'Marketplace', receita: 0.50, pct: '13%', cor: '#9333EA' },
    { canal: 'Outros', receita: 0.23, pct: '6%', cor: '#64748B' },
  ];

  // Relatórios Salvos
  const relatoriosSalvos = [
    { nome: 'Desempenho Comercial', peri: 'Mensal', resp: 'Fabiano Asaph', data: '02/01/2026 10:24', icon: Building2 },
    { nome: 'Receita por Produto', peri: 'Semanal', resp: 'Time Comercial', data: '01/01/2026 08:17', icon: TrendingUp },
    { nome: 'Base de Clientes', peri: 'Mensal', resp: 'Inteligência de Negócios', data: '31/12/2025 19:03', icon: Users },
    { nome: 'Rentabilidade por Canal', peri: 'Mensal', resp: 'Financeiro', data: '31/12/2025 16:41', icon: DollarSign },
    { nome: 'NPS e Satisfação', peri: 'Trimestral', resp: 'Experiência do Cliente', data: '30/12/2025 11:28', icon: Award },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight font-sans">
            Relatórios
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Indicadores estratégicos para gestão comercial, financeira e operacional.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Agendamento de relatório automático configurado')}
            className="px-4 py-2.5 rounded-xl border border-[#E2EBE4] bg-white hover:bg-[#F8FAFD] text-xs font-bold text-[#0A192F] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-4 h-4 text-[#64748B]" /> Agendar relatório
          </button>
          <button
            onClick={() => alert('Exportando relatório consolidado em PDF/Excel')}
            className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-all shadow-md shadow-[#0066FF]/20 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      {/* 4 CARDS DE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border border-[#E2E8F4] bg-white p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#64748B]">{k.title}</span>
              <p className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">{k.value}</p>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-bold text-[#00A854] inline-flex items-center">
                  ↑ {k.trend}
                </span>
                <span className="text-[#94A3B8]">{k.sub}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${k.bg} flex items-center justify-center shrink-0`}>
              <k.icon className={`w-6 h-6 ${k.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* SEÇÃO 2: EVOLUÇÃO DE RECEITA (7 COLUNAS) + MIX DE PRODUTOS DONUT (5 COLUNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico de Linha Dupla: Receita e Clientes */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2EBE4] gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#0A192F]">Evolução de receita e clientes</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A192F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" /> Receita (R$ mi)
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A192F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A854]" /> Clientes (mil)
                </div>
                <select className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-[#E2EBE4] bg-[#F8FAFD] outline-none text-[#64748B]">
                  <option>Últimos 12 meses</option>
                  <option>Últimos 6 meses</option>
                  <option>Ano atual</option>
                </select>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosEvolucao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F9" />
                  <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#06152B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="receita" stroke="#0066FF" strokeWidth={3} dot={{ fill: '#0066FF', r: 3 }} />
                  <Line type="monotone" dataKey="clientes" stroke="#00A854" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: '#00A854', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mix de Produtos Donut Chart */}
        <div className="lg:col-span-5 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <h3 className="text-sm sm:text-base font-black text-[#0A192F]">Mix de produtos</h3>
              <select className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-[#E2EBE4] bg-[#F8FAFD] outline-none text-[#64748B]">
                <option>Últimos 12 meses</option>
                <option>Últimos 6 meses</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              {/* Donut Chart */}
              <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={mixProdutos} dataKey="pct" innerRadius={48} outerRadius={68} paddingAngle={2}>
                      {mixProdutos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center leading-tight">
                  <span className="text-xs font-black text-[#0A192F] block">R$ 3,84 mi</span>
                  <span className="text-[10px] text-[#64748B]">em receita</span>
                </div>
              </div>

              {/* Legenda Lateral */}
              <div className="space-y-1.5 flex-1 w-full text-xs">
                {mixProdutos.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: m.cor }} />
                      <span className="text-[#64748B] truncate">{m.nome}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-[#94A3B8]">{m.pct}%</span>
                      <strong className="text-[#0A192F]">{m.valor}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: DESEMPENHO POR CANAL (BARCHART) + TABELA RELATÓRIOS SALVOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Desempenho por Canal (5 Colunas) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <h3 className="text-sm sm:text-base font-black text-[#0A192F]">Desempenho por canal</h3>
              <select className="px-2 py-1 text-[10px] font-bold rounded-lg border border-[#E2EBE4] bg-[#F8FAFD] outline-none text-[#64748B]">
                <option>Receita gerada (R$)</option>
                <option>Conversão (%)</option>
              </select>
            </div>

            <div className="space-y-3 pt-4">
              {desempenhoCanal.map((d, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#0A192F]">{d.canal}</span>
                    <strong className="text-[#0A192F]">R$ {d.receita.toFixed(2).replace('.', ',')} mi ({d.pct})</strong>
                  </div>
                  <div className="w-full bg-[#E2E8F4] h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: d.pct, backgroundColor: d.cor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela de Relatórios Salvos (7 Colunas) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
            <h3 className="text-sm sm:text-base font-black text-[#0A192F]">Relatórios salvos</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2EBE4] text-[#64748B] font-semibold text-[11px]">
                  <th className="pb-3">Nome do relatório</th>
                  <th className="pb-3">Periodicidade</th>
                  <th className="pb-3">Responsável</th>
                  <th className="pb-3">Última atualização</th>
                  <th className="pb-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE4]/60 font-medium">
                {relatoriosSalvos.map((rel, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFD] transition-colors">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EBF3FF] text-[#0066FF] flex items-center justify-center shrink-0">
                          <rel.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-[#0A192F]">{rel.nome}</span>
                      </div>
                    </td>
                    <td className="py-3 text-[#64748B]">{rel.peri}</td>
                    <td className="py-3 text-[#64748B]">{rel.resp}</td>
                    <td className="py-3 text-[#94A3B8] text-[11px] whitespace-nowrap">{rel.data}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => alert(`Baixando relatório: ${rel.nome}`)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0066FF] hover:bg-[#EBF3FF] transition-colors"
                        title="Baixar relatório"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
