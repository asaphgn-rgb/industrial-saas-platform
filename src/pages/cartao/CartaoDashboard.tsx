import { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Percent,
  Plus,
  Send,
  Download,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Receipt,
  Building,
  Award,
  Lock,
  Unlock,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  Wallet,
  ArrowDownRight,
  Shield
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function CartaoDashboard() {
  const [cartaoAtivoIndex, setCartaoAtivoIndex] = useState(0);

  // Cartões Oficiais Coinest Fintech Benchmark
  const cartoes = [
    {
      id: 'crd-1',
      titular: 'FABIANO ASAPH C SILVA',
      numero: '5582 5574 8376 5487',
      validade: '05/29',
      cvv: '411',
      limiteTotal: 45000.00,
      limiteGasto: 4500.00,
      limiteDisponivel: 40500.00,
      saldo: 562000.00,
      faturaAtual: 4500.00,
      cashback: 1845.00,
      tipo: 'Platinum Plus Visa',
      categoria: 'Debit & Corporate',
      status: 'Active',
      corFundo: 'bg-[#16382C]',
      ativo: true
    },
    {
      id: 'crd-2',
      titular: 'FABIANO ASAPH C SILVA',
      numero: '4532 8921 0045 9967',
      validade: '12/29',
      cvv: '313',
      limiteTotal: 65000.00,
      limiteGasto: 12400.00,
      limiteDisponivel: 52600.00,
      saldo: 415000.00,
      faturaAtual: 12400.00,
      cashback: 3200.00,
      tipo: 'Freedom Unlimited Mastercard',
      categoria: 'Credit & BaaS',
      status: 'Active',
      corFundo: 'bg-[#1F4E3D]',
      ativo: false
    }
  ];

  const cartaoAtual = cartoes[cartaoAtivoIndex];

  // Cashflow mensal padrão Coinest
  const dadosCashflow = [
    { mes: 'Jan', income: 6000, expense: 4000 },
    { mes: 'Feb', income: 7200, expense: 4500 },
    { mes: 'Mar', income: 5800, expense: 3900 },
    { mes: 'Apr', income: 8400, expense: 5100 },
    { mes: 'May', income: 7900, expense: 4800 },
    { mes: 'Jun', income: 9200, expense: 5600 },
    { mes: 'Jul', income: 8800, expense: 5200 },
    { mes: 'Aug', income: 9500, expense: 5800 },
    { mes: 'Sep', income: 8900, expense: 5400 },
    { mes: 'Oct', income: 10400, expense: 6200 },
    { mes: 'Nov', income: 9800, expense: 5900 },
    { mes: 'Dec', income: 11200, expense: 6800 },
  ];

  // Categorias de Gastos (Statistic Breakdown Coinest Donut)
  const gastosCategorias = [
    { nome: 'Rent & Living', valor: 2100, pct: '60%', cor: '#16382C' },
    { nome: 'Investment', valor: 525, pct: '15%', cor: '#10B981' },
    { nome: 'Education', valor: 420, pct: '12%', cor: '#C8F2D6' },
    { nome: 'Food & Drink', valor: 280, pct: '8%', cor: '#F59E0B' },
    { nome: 'Entertainment', valor: 175, pct: '5%', cor: '#88A395' },
  ];

  // Transações Recentes Padrão Coinest
  const transacoes = [
    {
      id: 'tx-1',
      nome: 'Electricity Bill',
      categoria: 'Payments',
      data: '2026-10-17 04:28:48',
      valor: -295.81,
      nota: 'Payment for monthly electricity bill',
      status: 'Completed',
      statusCor: 'bg-[#E8F8EE] text-[#16382C]'
    },
    {
      id: 'tx-2',
      nome: 'Weekly Groceries',
      categoria: 'Food & Drink',
      data: '2026-10-16 18:20:15',
      valor: -204.07,
      nota: 'Groceries shopping at local supermarket',
      status: 'Completed',
      statusCor: 'bg-[#E8F8EE] text-[#16382C]'
    },
    {
      id: 'tx-3',
      nome: 'Cashback Habitacional',
      categoria: 'Mortgage Savings',
      data: '2026-10-15 12:00:00',
      valor: 450.00,
      nota: 'Crédito amortizado na parcela da moradia',
      status: 'Completed',
      statusCor: 'bg-[#C8F2D6] text-[#16382C]'
    },
    {
      id: 'tx-4',
      nome: 'Repasse Credenciado Lojista',
      categoria: 'MDR Settlement',
      data: '2026-10-14 09:30:12',
      valor: -1250.00,
      nota: 'Liquidação D+1 rede de materiais de construção',
      status: 'Completed',
      statusCor: 'bg-[#E8F8EE] text-[#16382C]'
    }
  ];

  // Planos de Poupança (Saving Plans Coinest)
  const savingPlans = [
    { nome: 'Emergency Fund', atual: 6000, meta: 10000, progresso: 60 },
    { nome: 'Vacation Fund', atual: 3000, meta: 5000, progresso: 60 },
    { nome: 'Home Down Payment (Moradia)', atual: 25000, meta: 25000, progresso: 100 }
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* 4 Cards de Métricas Superiores Coinest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Income', valor: '$78,000', trend: '+1.75%', positive: true, icon: ArrowDownLeft },
          { label: 'Total Expense', valor: '$43,000', trend: '-1.75%', positive: false, icon: ArrowUpRight },
          { label: 'Total Savings', valor: '$56,000', trend: '+1.24%', positive: true, icon: Wallet },
          { label: 'Total Investment', valor: '$94,500', trend: '+3.85%', positive: true, icon: TrendingUp },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.positive ? 'bg-[#E8F8EE] text-[#16382C]' : 'bg-red-50 text-red-600'
              }`}>
                {item.trend}
              </span>
              <p className="text-2xl font-black text-[#15241E] tracking-tight">{item.valor}</p>
              <p className="text-xs font-semibold text-[#88A395]">{item.label}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5] flex items-center justify-center text-[#16382C]">
              <item.icon className="w-5 h-5 text-[#16382C]" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid Principal: Seção Superior do Layout Coinest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Cartão Coinest + Ações Rápidas + Spending Limits (5 Colunas) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card Principal Verde Floresta Coinest */}
          <div className="bg-[#16382C] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1F4E3D] rounded-full blur-2xl opacity-40 pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[#C8F2D6] uppercase tracking-wider">Balance Amount</p>
                <h3 className="text-3xl font-black text-white mt-1">$562,000</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#C8F2D6]">
                <Wifi className="w-4 h-4 rotate-90" />
              </div>
            </div>

            <div className="relative z-10 my-4">
              <p className="font-mono text-sm tracking-widest text-[#E8F8EE] font-bold">
                {cartaoAtual.numero}
              </p>
            </div>

            <div className="relative z-10 flex items-end justify-between pt-3 border-t border-white/15 text-xs">
              <div>
                <p className="text-[10px] text-[#88A395] uppercase font-bold">Expiry Date</p>
                <p className="font-mono font-bold text-white">{cartaoAtual.validade}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#88A395] uppercase font-bold">CVC</p>
                <p className="font-mono font-bold text-white">{cartaoAtual.cvv}</p>
              </div>
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C8F2D6] text-[#16382C]">
                  {cartaoAtual.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons Coinest (Top Up, Transfer, Payment, History) */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Top Up', icon: Plus },
              { label: 'Transfer', icon: Send },
              { label: 'Payment', icon: Receipt },
              { label: 'History', icon: Clock }
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => alert(`Ação ${btn.label} acionada no padrão Coinest.`)}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white border border-[#E2EBE5] hover:bg-[#F4F7F5] transition-all shadow-sm group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#E8F8EE] text-[#16382C] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <btn.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#15241E]">{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Spending Limits Slider Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#15241E]">Spending Limits</h4>
              <span className="text-xs font-bold text-[#16382C]">45%</span>
            </div>
            <p className="text-xs font-medium text-[#88A395]">
              <strong className="text-[#15241E]">$4,500.00</strong> spent of $10,000.00
            </p>
            <div className="w-full bg-[#E2EBE5] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#16382C] h-full rounded-full transition-all" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* Coluna Central: Cashflow BarChart (4 Colunas) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E2EBE5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#15241E]">Cashflow</h4>
                <p className="text-xs text-[#88A395]">Income vs Expense</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F4F7F5] text-[#526E62] border border-[#E2EBE5]">
                This Year
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosCashflow} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF3EF" />
                  <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: '#88A395', fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#88A395', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16382C', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '11px' }}
                    itemStyle={{ color: '#C8F2D6' }}
                  />
                  <Bar dataKey="income" fill="#16382C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#C8F2D6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#E2EBE5]/60 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16382C]" />
              <span className="text-[#15241E]">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8F2D6]" />
              <span className="text-[#526E62]">Expense</span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Statistic Breakdown Donut Chart (3 Colunas) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-[#E2EBE5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#15241E]">Statistic</h4>
              <span className="text-[10px] font-bold text-[#88A395]">This Month</span>
            </div>
            <p className="text-[11px] text-[#88A395] mb-3">Expense Breakdown</p>

            {/* Donut Chart com Valor Central */}
            <div className="h-40 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gastosCategorias}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="valor"
                  >
                    {gastosCategorias.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-xs text-[#88A395] block font-medium">Expense</span>
                <span className="text-base font-black text-[#15241E] leading-none">$3,500</span>
              </div>
            </div>

            {/* Lista de Categorias com porcentagens */}
            <div className="space-y-2 mt-2">
              {gastosCategorias.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.cor }} />
                    <span className="text-[#526E62] truncate">{cat.nome}</span>
                  </div>
                  <span className="font-bold text-[#15241E] shrink-0">${cat.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seção Inferior: Saving Plans + Tabela de Transações Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Saving Plans (4 Colunas) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E2EBE5] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#15241E]">Saving Plans</h4>
              <p className="text-xs text-[#88A395]">Total Savings: $84,500</p>
            </div>
            <button
              onClick={() => alert('Adicionar novo plano de economia')}
              className="text-xs font-bold text-[#16382C] bg-[#E8F8EE] px-3 py-1.5 rounded-full hover:bg-[#C8F2D6] transition-colors"
            >
              + Add Plan
            </button>
          </div>

          <div className="space-y-3">
            {savingPlans.map((plan, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#15241E]">{plan.nome}</span>
                  <span className="font-bold text-[#16382C]">{plan.progresso}%</span>
                </div>
                <div className="w-full bg-[#E2EBE5] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#16382C] h-full rounded-full transition-all" style={{ width: `${plan.progresso}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-[#88A395]">
                  <span>${plan.atual.toLocaleString()}</span>
                  <span>Target: ${plan.meta.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de Transações Recentes (8 Colunas) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E2EBE5] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#15241E]">Recent Transactions</h4>
              <p className="text-xs text-[#88A395]">Extrato em tempo real com conciliação</p>
            </div>
            <span className="text-xs font-bold text-[#526E62] bg-[#F4F7F5] px-3 py-1.5 rounded-full border border-[#E2EBE5]">
              This Month
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2EBE5] text-[#88A395] uppercase font-bold text-[10px]">
                  <th className="pb-3">Transaction</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE5]/60 font-medium">
                {transacoes.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F4F7F5]/50 transition-colors">
                    <td className="py-3 pr-3">
                      <p className="font-bold text-[#15241E]">{tx.nome}</p>
                      <p className="text-[10px] text-[#88A395]">{tx.categoria}</p>
                    </td>
                    <td className="py-3 text-[#526E62] text-[11px]">{tx.data}</td>
                    <td className={`py-3 text-right font-bold ${tx.valor > 0 ? 'text-[#10B981]' : 'text-[#15241E]'}`}>
                      {tx.valor > 0 ? `+$${tx.valor.toFixed(2)}` : `-$${Math.abs(tx.valor).toFixed(2)}`}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${tx.statusCor}`}>
                        {tx.status}
                      </span>
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
