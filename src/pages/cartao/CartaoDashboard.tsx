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
  Upload,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Sliders,
  Sparkles,
  Wifi,
  ChevronDown,
  Calendar,
  Layers,
  ArrowRight,
  PiggyBank,
  Receipt
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
  Cell
} from 'recharts';

export default function CartaoDashboard() {
  const [cartaoAtivoIndex, setCartaoAtivoIndex] = useState(0);
  const [periodoCashflow, setPeriodoCashflow] = useState('6M');

  // Cartões disponíveis no padrão Coinest (Forest Green e Dark Mint)
  const cartoes = [
    {
      id: 'crd-1',
      titular: 'ANDREW FORBIST',
      numero: '5582 5574 8376 5487',
      validade: '05/29',
      cvv: '411',
      saldo: 415000.00,
      tipo: 'Platinum Plus Visa',
      categoria: 'Débito & Benefício',
      status: 'Ativo',
      limiteTotal: 20000.00,
      limiteGasto: 4500.00,
      corFundo: 'from-[#133E32] to-[#0A261E]'
    },
    {
      id: 'crd-2',
      titular: 'ANDREW FORBIST',
      numero: '4532 9920 1845 8819',
      validade: '11/31',
      cvv: '742',
      saldo: 532000.00,
      tipo: 'Freedom Unlimited Mastercard',
      categoria: 'Crédito Corporativo',
      status: 'Ativo',
      limiteTotal: 30000.00,
      limiteGasto: 12350.00,
      corFundo: 'from-[#174D3E] to-[#0D2E24]'
    }
  ];

  const cartaoAtual = cartoes[cartaoAtivoIndex];

  // Dados do Gráfico Cashflow (Comparativo Entradas x Saídas - Bar Chart Verde/Mint)
  const dadosCashflow = [
    { mes: 'Jan', receitas: 6500, despesas: 4200 },
    { mes: 'Fev', receitas: 7200, despesas: 4800 },
    { mes: 'Mar', receitas: 8000, despesas: 5100 },
    { mes: 'Abr', receitas: 6900, despesas: 3900 },
    { mes: 'Mai', receitas: 8400, despesas: 6000 },
    { mes: 'Jun', receitas: 9100, despesas: 5400 },
  ];

  // Dados do Gráfico de Rosca de Gastos por Categoria
  const dadosCategorias = [
    { nome: 'Moradia & Cota', valor: 2100, cor: '#133E32' },
    { nome: 'Investimentos', valor: 525, cor: '#2C664F' },
    { nome: 'Educação & Cursos', valor: 420, cor: '#3D8165' },
    { nome: 'Alimentação & Mercado', valor: 280, cor: '#5FD288' },
    { nome: 'Lazer & Benefícios', valor: 175, cor: '#95E3AF' },
  ];

  // Planos de Poupança / Metas Habitacionais
  const savingPlans = [
    {
      titulo: 'Fundo Emergencial',
      acumulado: 6000,
      meta: 10000,
      progresso: 60,
      status: 'Em Andamento',
      corBarra: 'bg-[#133E32]'
    },
    {
      titulo: 'Entrada Moradia Própria',
      acumulado: 25000,
      meta: 25000,
      progresso: 100,
      status: 'Concluído',
      corBarra: 'bg-[#34B765]'
    },
    {
      titulo: 'Poupança Reforma & Obra',
      acumulado: 5600,
      meta: 20000,
      progresso: 28,
      status: 'Em Andamento',
      corBarra: 'bg-[#5F9E82]'
    },
  ];

  // Extrato de Transações Recentes
  const transacoesRecentes = [
    {
      id: 'tx-101',
      nome: 'Conta de Energia Elétrica',
      categoria: 'Moradia / Utilidades',
      data: '17/10/2026 14:32',
      valor: -295.80,
      status: 'Concluído'
    },
    {
      id: 'tx-102',
      nome: 'Supermercado Central Aliança',
      categoria: 'Alimentação (Cashback 3.5%)',
      data: '17/10/2026 11:15',
      valor: -204.07,
      status: 'Concluído'
    },
    {
      id: 'tx-103',
      nome: 'Cashback Mensal Creditado',
      categoria: 'Bonificação Rede Parceira',
      data: '16/10/2026 18:00',
      valor: 145.20,
      status: 'Concluído'
    },
    {
      id: 'tx-104',
      nome: 'Assinatura Consultoria Jurídica',
      categoria: 'Serviços Profissionais',
      data: '16/10/2026 09:40',
      valor: -450.00,
      status: 'Concluído'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Header com Título do Módulo e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#133E32] tracking-tight">
              Gestão de Cartões & Finanças
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E1F7E8] text-[#133E32] border border-emerald-200">
              Coinest Standard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Visão consolidada de limites, cartões físicos/virtuais, fluxo de caixa e economia habitacional.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="px-4 py-2 rounded-xl bg-white border border-emerald-200/80 text-xs font-bold text-[#133E32] hover:bg-emerald-50 transition-colors shadow-sm flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5 text-emerald-600" /> Exportar Extrato
          </button>
          <button className="px-4 py-2 rounded-xl bg-[#133E32] hover:bg-[#0E2C24] text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-[#5FD288]" /> Novo Cartão
          </button>
        </div>
      </div>

      {/* Grid Principal: 2 Colunas (Cards & Limites à Esquerda, Cashflow à Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel do Cartão Físico/Digital Ativo (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100/60">
              <div>
                <h3 className="text-sm font-black text-[#133E32]">Meus Cartões</h3>
                <p className="text-[11px] text-slate-400">Clique para alternar entre cartões</p>
              </div>
              <div className="flex gap-1.5">
                {cartoes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCartaoAtivoIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      cartaoAtivoIndex === idx ? 'w-6 bg-[#133E32]' : 'w-2 bg-emerald-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Cartão Estilo Coinest / Deep Forest */}
            <div className={`mt-5 aspect-[1.586/1] w-full rounded-2xl p-6 bg-gradient-to-br ${cartaoAtual.corFundo} text-white shadow-xl relative overflow-hidden border border-emerald-800/40 flex flex-col justify-between`}>
              {/* Marca d'água sutil */}
              <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-5 pointer-events-none">
                <CreditCard className="w-56 h-56 text-white" />
              </div>

              {/* Linha Superior */}
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#5FD288] block">
                    {cartaoAtual.tipo}
                  </span>
                  <p className="text-2xl font-black text-white mt-1">
                    R$ {cartaoAtual.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-white/80 rotate-90" />
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                    NFC
                  </span>
                </div>
              </div>

              {/* Chip Metálico */}
              <div className="my-auto relative z-10 flex items-center justify-between">
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 to-amber-100 border border-amber-400/50 shadow-inner flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-500/40 rounded-sm" />
                </div>
                <span className="text-[11px] font-mono text-emerald-200 tracking-wider">
                  {cartaoAtual.categoria}
                </span>
              </div>

              {/* Dados do Cartão */}
              <div className="relative z-10 flex items-end justify-between pt-1">
                <div>
                  <p className="font-mono text-xs tracking-widest text-slate-200 mb-0.5">
                    {cartaoAtual.numero}
                  </p>
                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">
                    {cartaoAtual.titular}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-emerald-300 block uppercase">Exp / CVV</span>
                  <span className="font-mono text-xs font-bold text-white">
                    {cartaoAtual.validade} · {cartaoAtual.cvv}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas (Pills estilo Coinest) */}
            <div className="grid grid-cols-4 gap-2 mt-5">
              {[
                { label: 'Recarregar', icone: Plus, acao: () => alert('Recarga via Pix') },
                { label: 'Transferir', icone: Send, acao: () => alert('Transferência iniciada') },
                { label: 'Pagar', icone: Receipt, acao: () => alert('Leitor de boleto') },
                { label: 'Histórico', icone: Clock, acao: () => alert('Histórico completo') },
              ].map((btn, i) => {
                const Icone = btn.icone;
                return (
                  <button
                    key={i}
                    onClick={btn.acao}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F0F7F4] hover:bg-[#DCEDE5] border border-emerald-100 text-[#133E32] transition-colors"
                  >
                    <Icone className="h-4 w-4 mb-1 text-[#133E32]" />
                    <span className="text-[10px] font-bold">{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barra de Limites de Gastos (Spending Limits) */}
          <div className="mt-5 pt-4 border-t border-emerald-100/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#133E32]">Limite de Gastos Mensais:</span>
              <span className="font-extrabold text-[#133E32]">
                R$ {cartaoAtual.limiteGasto.toLocaleString('pt-BR')} <span className="text-slate-400 font-normal">de R$ {cartaoAtual.limiteTotal.toLocaleString('pt-BR')}</span>
              </span>
            </div>
            <div className="w-full bg-emerald-100/80 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-[#133E32] h-full rounded-full transition-all"
                style={{ width: `${(cartaoAtual.limiteGasto / cartaoAtual.limiteTotal) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-right font-bold text-emerald-700">
              {((cartaoAtual.limiteGasto / cartaoAtual.limiteTotal) * 100).toFixed(0)}% utilizado · R$ {(cartaoAtual.limiteTotal - cartaoAtual.limiteGasto).toLocaleString('pt-BR')} disponível
            </p>
          </div>
        </div>

        {/* Gráfico de Cashflow (Receitas x Despesas) (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-emerald-100/60">
              <div>
                <h3 className="text-sm font-black text-[#133E32]">Fluxo de Caixa (Cashflow)</h3>
                <p className="text-[11px] text-slate-400">Comparativo mensal entre entradas e despesas da carteira</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#133E32]">
                  <span className="w-3 h-3 rounded-md bg-[#133E32]" /> Receitas
                </div>
                <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                  <span className="w-3 h-3 rounded-md bg-[#5FD288]" /> Despesas
                </div>
                <select
                  value={periodoCashflow}
                  onChange={e => setPeriodoCashflow(e.target.value)}
                  className="bg-[#F0F7F4] border border-emerald-100 rounded-xl px-2.5 py-1 text-xs font-bold text-[#133E32] outline-none"
                >
                  <option value="6M">Últimos 6 Meses</option>
                  <option value="1Y">Ano Vigente</option>
                </select>
              </div>
            </div>

            {/* Gráfico de Barras Duplo */}
            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosCashflow} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4EDE6" />
                  <XAxis dataKey="mes" stroke="#97A596" fontSize={11} tickLine={false} />
                  <YAxis stroke="#97A596" fontSize={11} tickLine={false} tickFormatter={v => `R$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '1rem',
                      border: '1px solid #C9DCD0',
                      boxShadow: '0 4px 20px -2px rgba(19, 62, 50, 0.1)',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                    formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR')}`, '']}
                  />
                  <Bar dataKey="receitas" fill="#133E32" radius={[6, 6, 0, 0]} maxBarSize={22} />
                  <Bar dataKey="despesas" fill="#5FD288" radius={[6, 6, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cards de Métricas Rápidas no Rodapé do Cashflow */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-100/60 mt-4 text-xs">
            <div className="p-3 bg-[#F4F8F5] rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Receita Total</span>
              <p className="text-base font-black text-[#133E32] mt-0.5">R$ 78.000,00</p>
              <span className="text-[10px] text-emerald-600 font-bold">+1.75% este mês</span>
            </div>
            <div className="p-3 bg-[#F4F8F5] rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Despesas Totais</span>
              <p className="text-base font-black text-slate-800 mt-0.5">R$ 43.000,00</p>
              <span className="text-[10px] text-slate-400 font-semibold">-1.15% controlado</span>
            </div>
            <div className="p-3 bg-[#E1F7E8] rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Economia Gerada</span>
              <p className="text-base font-black text-[#133E32] mt-0.5">R$ 56.000,00</p>
              <span className="text-[10px] text-emerald-700 font-extrabold">+12.4% p/ habitação</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Secundário: Categorias de Gastos (Donut Chart) + Planos de Poupança + Transações */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Distribuição por Categorias (Donut Chart) (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100/60">
              <h3 className="text-sm font-black text-[#133E32]">Gastos por Categoria</h3>
              <span className="text-[10px] font-bold bg-[#F0F7F4] text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Este Mês
              </span>
            </div>

            {/* Donut Chart com Total no Centro */}
            <div className="h-48 relative flex items-center justify-center mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosCategorias}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="valor"
                  >
                    {dadosCategorias.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR')}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Faturado</span>
                <span className="text-base font-black text-[#133E32]">R$ 3.500</span>
              </div>
            </div>

            {/* Legenda Estruturada com % */}
            <div className="space-y-2 mt-2 divide-y divide-emerald-50">
              {dadosCategorias.map((cat, i) => (
                <div key={i} className="flex items-center justify-between pt-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.cor }} />
                    <span className="text-slate-600 font-semibold">{cat.nome}</span>
                  </div>
                  <span className="font-extrabold text-[#133E32]">R$ {cat.valor.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metas & Poupança Habitacional (Saving Plans) (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100/60">
              <div>
                <h3 className="text-sm font-black text-[#133E32]">Metas Habitacionais</h3>
                <p className="text-[10px] text-slate-400">Poupança e amortização de cotas</p>
              </div>
              <button
                onClick={() => alert('Criar novo plano de poupança')}
                className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#133E32] transition-colors"
                title="Adicionar Plano"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {savingPlans.map((plan, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#F4F8F5] border border-emerald-100/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-[#133E32]">{plan.titulo}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      plan.progresso === 100
                        ? 'bg-[#E1F7E8] text-emerald-800'
                        : 'bg-emerald-100/60 text-[#133E32]'
                    }`}>
                      {plan.progresso}% {plan.status}
                    </span>
                  </div>

                  <div className="w-full bg-emerald-200/50 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${plan.corBarra}`}
                      style={{ width: `${plan.progresso}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold pt-1">
                    <span>R$ {plan.acumulado.toLocaleString('pt-BR')}</span>
                    <span>Meta: R$ {plan.meta.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Total Alocado em Metas:</span>
            <span className="font-black text-[#133E32]">R$ 36.600,00</span>
          </div>
        </div>

        {/* Extrato de Transações Recentes (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100/60">
              <div>
                <h3 className="text-sm font-black text-[#133E32]">Transações Recentes</h3>
                <p className="text-[10px] text-slate-400">Atividades em tempo real</p>
              </div>
              <button className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
                Ver Todas
              </button>
            </div>

            <div className="space-y-3 mt-3 divide-y divide-emerald-50">
              {transacoesRecentes.map((tx) => (
                <div key={tx.id} className="pt-3 flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      tx.valor > 0 ? 'bg-[#E1F7E8] text-[#133E32]' : 'bg-[#F0F7F4] text-slate-600'
                    }`}>
                      {tx.valor > 0 ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#133E32] leading-snug">{tx.nome}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{tx.categoria}</p>
                      <span className="text-[9px] font-mono text-slate-400">{tx.data}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-black block ${
                      tx.valor > 0 ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {tx.valor > 0 ? '+' : ''} R$ {Math.abs(tx.valor).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 uppercase bg-[#E1F7E8] px-1.5 py-0.2 rounded-full">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100/60 text-center">
            <span className="text-[10px] font-mono text-slate-400">Protegido por barramento Antifraude Bacen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
