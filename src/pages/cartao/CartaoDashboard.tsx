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
  Flame,
  Award,
  Lock,
  Unlock,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar
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
  const [periodoFatura, setPeriodoFatura] = useState('atual');

  // Cartões Oficiais Santander / Diamond
  const cartoes = [
    {
      id: 'crd-1',
      titular: 'FABIANO ASAPH C SILVA',
      numero: '5582 •••• •••• 8472',
      validade: '11/31',
      cvv: '821',
      limiteTotal: 50000.00,
      limiteDisponivel: 38450.00,
      faturaAtual: 11550.00,
      pontosEsfera: 42800,
      tipo: 'Santander Unique Mastercard Black',
      categoria: 'Private & Corporate Banking',
      status: 'Ativo',
      corFundo: 'from-[#1A1A1A] via-[#111111] to-[#0A0A0A]',
      borda: 'border-neutral-800'
    },
    {
      id: 'crd-2',
      titular: 'FABIANO ASAPH C SILVA',
      numero: '4532 •••• •••• 4489',
      validade: '08/30',
      cvv: '394',
      limiteTotal: 25000.00,
      limiteDisponivel: 19800.00,
      faturaAtual: 5200.00,
      pontosEsfera: 18450,
      tipo: 'Santander Select Visa Infinite',
      categoria: 'Conta Corrente & Benefícios',
      status: 'Ativo',
      corFundo: 'from-[#EC0000] via-[#CC0000] to-[#8A0000]',
      borda: 'border-red-600/40'
    }
  ];

  const cartaoAtual = cartoes[cartaoAtivoIndex];

  // Dados do Fluxo Financeiro (Santander Analytics)
  const dadosFluxo = [
    { mes: 'Mai', entradas: 42000, saidas: 28500 },
    { mes: 'Jun', entradas: 48500, saidas: 31200 },
    { mes: 'Jul', entradas: 52000, saidas: 34000 },
    { mes: 'Ago', entradas: 49000, saidas: 29800 },
    { mes: 'Set', entradas: 56000, saidas: 36500 },
    { mes: 'Out', entradas: 61000, saidas: 38450 },
  ];

  // Gastos por Categoria (Santander Way Pattern)
  const gastosCategorias = [
    { nome: 'Moradia & Construção', valor: 14850, cor: '#EC0000' },
    { nome: 'Serviços & Negócios', valor: 9200, cor: '#1C1C1C' },
    { nome: 'Alimentação & Conveniados', valor: 6400, cor: '#7F0000' },
    { nome: 'Combustível & Frotas', valor: 4800, cor: '#CC0000' },
    { nome: 'Outros Repasses', valor: 3200, cor: '#94A3B8' },
  ];

  // Transações Recentes em Tempo Real
  const transacoes = [
    {
      id: 'tx-1',
      estabelecimento: 'Materiais de Construção Morar Bem',
      categoria: 'Habitação & Obra',
      data: 'Hoje, 15:42',
      valor: -2480.00,
      pontos: '+74 pts Esfera'
    },
    {
      id: 'tx-2',
      estabelecimento: 'Posto Petrobras Asa Sul',
      categoria: 'Transporte / Frotas',
      data: 'Hoje, 11:20',
      valor: -340.50,
      pontos: '+10 pts Esfera'
    },
    {
      id: 'tx-3',
      estabelecimento: 'Cashback Habitacional Parceria',
      categoria: 'Crédito de Moradia',
      data: 'Ontem, 18:00',
      valor: 450.00,
      pontos: 'Crédito em Cota'
    },
    {
      id: 'tx-4',
      estabelecimento: 'Supermercado Central Aliança',
      categoria: 'Alimentação',
      data: '15/10, 20:15',
      valor: -612.80,
      pontos: '+18 pts Esfera'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Banner Superior Santander Corporate */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-red-50 text-[#EC0000] border border-red-200 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-[#EC0000] text-[#EC0000]" />
              SANTANDER SELECT & PRIVATE
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Bacen Autorizado</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Central do Cartão Santander Diamond
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Gestão integrada de cartões corporativos, limites flexíveis, fatura digital em tempo real e conciliação bancária padrão Santander.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => alert('Simulação de antecipação e fatura Santander iniciada.')}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#EC0000]" />
            Baixar Fatura PDF
          </button>
          <button
            onClick={() => alert('Solicitação de novo cartão Santander enviada para análise de crédito.')}
            className="px-5 py-2.5 rounded-xl bg-[#EC0000] hover:bg-[#CC0000] text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Solicitar Cartão
          </button>
        </div>
      </div>

      {/* Grid Principal: Cartão Santander 3D à Esquerda + Métricas & Limites à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna 1: Cartão Santander (5 colunas) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#EC0000]" />
                <h3 className="text-sm font-black text-slate-900">Cartão em Uso</h3>
              </div>
              <div className="flex items-center gap-1.5">
                {cartoes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCartaoAtivoIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      cartaoAtivoIndex === idx ? 'w-6 bg-[#EC0000]' : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Visual Físico do Cartão Santander */}
            <div className={`mt-5 aspect-[1.586/1] w-full rounded-2xl p-6 bg-gradient-to-br ${cartaoAtual.corFundo} text-white shadow-2xl relative overflow-hidden border ${cartaoAtual.borda} flex flex-col justify-between`}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60 pointer-events-none" />

              {/* Linha Superior: Logo Santander + NFC */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EC0000] flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                      <path d="M12 2C10.5 4.5 9 6.5 9 9c0 1.8 1 3.2 2.5 3.8C10 13.5 9 15 9 17c0 2.8 2.2 5 5 5s5-2.2 5-5c0-3.5-3-6-3-9 0-.5.1-1 .2-1.5C14.5 8 13.5 5 12 2z" />
                      <path d="M9 13.5C7.8 14.2 7 15.5 7 17c0 2.2 1.8 4 4 4 .7 0 1.4-.2 2-.5-1.5-.8-2.5-2.3-2.5-4 0-1.2.5-2.3 1.5-3-.3 0-.7 0-1 0z" opacity="0.8" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-black tracking-tight text-white block leading-none">
                      Santander
                    </span>
                    <span className="text-[9px] font-bold text-red-300 uppercase tracking-widest block mt-0.5">
                      DIAMOND UNIQUE
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-white/80 rotate-90" />
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                    BLACK
                  </span>
                </div>
              </div>

              {/* Meio: Chip Metálico EMV */}
              <div className="my-auto relative z-10 flex items-center justify-between">
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#E2B755] via-[#D4AF37] to-[#996515] p-0.5 shadow-md border border-[#F3E5AB]/40 flex items-center justify-center">
                  <div className="w-full h-full border border-black/30 rounded-sm grid grid-cols-2 gap-0.5 opacity-70" />
                </div>
                <span className="text-[10px] font-mono text-slate-300 tracking-wider">
                  {cartaoAtual.categoria}
                </span>
              </div>

              {/* Linha Inferior: Titular e Mastercard Mark */}
              <div className="relative z-10 flex items-end justify-between pt-1">
                <div>
                  <p className="font-mono text-xs tracking-widest text-slate-200 mb-0.5">
                    {cartaoAtual.numero}
                  </p>
                  <p className="text-[11px] font-black text-white tracking-wider uppercase">
                    {cartaoAtual.titular}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block uppercase">Validade</span>
                  <span className="font-mono text-xs font-bold text-white">
                    {cartaoAtual.validade}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas Santander */}
            <div className="grid grid-cols-4 gap-2 mt-5">
              {[
                { label: 'Pagar Fatura', icone: Receipt, acao: () => alert('Direcionando para pagamento via PIX ou Débito Santander') },
                { label: 'Ajustar Limite', icone: Sliders, acao: () => alert('Ajuste de limite Santander Way') },
                { label: 'Bloqueio', icone: Lock, acao: () => alert('Bloqueio temporário Santander') },
                { label: 'Pontos Esfera', icone: Award, acao: () => alert(`Saldo Esfera: ${cartaoAtual.pontosEsfera} pontos`) },
              ].map((btn, i) => {
                const Icone = btn.icone;
                return (
                  <button
                    key={i}
                    onClick={btn.acao}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F4F6F9] hover:bg-red-50 hover:text-[#EC0000] border border-slate-200/60 text-slate-700 transition-all group"
                  >
                    <Icone className="w-4 h-4 mb-1 text-slate-600 group-hover:text-[#EC0000] transition-colors" />
                    <span className="text-[10px] font-bold text-center leading-tight">{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Consumo do Limite (Barra Santander) */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Fatura Atual em Aberto:</span>
              <span className="font-black text-[#EC0000]">
                R$ {cartaoAtual.faturaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-[#EC0000] h-full rounded-full transition-all"
                style={{ width: `${(cartaoAtual.faturaAtual / cartaoAtual.limiteTotal) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-0.5">
              <span>Disponível: R$ {cartaoAtual.limiteDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>Total: R$ {cartaoAtual.limiteTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Coluna 2: Análise de Fluxo de Caixa & Pontos Esfera (7 colunas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900">Fluxo de Movimentações (Santander Analytics)</h3>
                <p className="text-[11px] text-slate-400">Entradas vs. Saídas operacionais da carteira</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span className="w-3 h-3 rounded-md bg-[#1C1C1C]" /> Entradas
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#EC0000]">
                  <span className="w-3 h-3 rounded-md bg-[#EC0000]" /> Saídas
                </div>
              </div>
            </div>

            {/* Gráfico de Barras Santander */}
            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosFluxo} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="mes" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={v => `R$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.75rem',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                    formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR')}`, '']}
                  />
                  <Bar dataKey="entradas" fill="#1C1C1C" radius={[4, 4, 0, 0]} maxBarSize={22} />
                  <Bar dataKey="saidas" fill="#EC0000" radius={[4, 4, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cards de Métricas Santander no Rodapé */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 mt-4 text-xs">
            <div className="p-3 bg-[#F4F6F9] rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Volume Mensal</span>
              <p className="text-base font-black text-slate-900 mt-0.5">R$ 61.000</p>
              <span className="text-[10px] text-emerald-600 font-bold">+8.4% vs mês anterior</span>
            </div>
            <div className="p-3 bg-[#FFF5F5] rounded-2xl border border-red-100">
              <span className="text-[10px] font-bold text-red-400 uppercase">Fatura Atual</span>
              <p className="text-base font-black text-[#EC0000] mt-0.5">R$ 11.550</p>
              <span className="text-[10px] text-[#EC0000] font-semibold">Vencimento 10/11</span>
            </div>
            <div className="p-3 bg-[#F4F6F9] rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Esfera Acumulado</span>
              <p className="text-base font-black text-slate-900 mt-0.5">{cartaoAtual.pontosEsfera.toLocaleString('pt-BR')} pts</p>
              <span className="text-[10px] text-slate-500 font-semibold">Resgate p/ Moradia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Secundário: Categorias de Fatura + Extrato Santander Way */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico Donut de Despesas (5 colunas) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">Detalhamento por Categoria</h3>
              <span className="text-[10px] font-bold bg-red-50 text-[#EC0000] px-2.5 py-0.5 rounded-full border border-red-200">
                Outubro 2026
              </span>
            </div>

            <div className="h-48 relative flex items-center justify-center mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gastosCategorias}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="valor"
                  >
                    {gastosCategorias.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR')}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Fatura</span>
                <span className="text-base font-black text-slate-900">R$ 38.450</span>
              </div>
            </div>

            <div className="space-y-2 mt-2 divide-y divide-slate-100">
              {gastosCategorias.map((cat, i) => (
                <div key={i} className="flex items-center justify-between pt-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.cor }} />
                    <span className="text-slate-600 font-semibold">{cat.nome}</span>
                  </div>
                  <span className="font-black text-slate-900">R$ {cat.valor.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extrato Santander Way de Últimos Lançamentos (7 colunas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900">Lançamentos em Tempo Real</h3>
                <p className="text-[11px] text-slate-400">Extrato oficial Santander Way / Barramento Antifraude</p>
              </div>
              <button
                onClick={() => alert('Abrindo extrato completo dos últimos 90 dias')}
                className="text-xs font-bold text-[#EC0000] hover:underline"
              >
                Ver Extrato Completo
              </button>
            </div>

            <div className="space-y-3 mt-3 divide-y divide-slate-100">
              {transacoes.map((tx) => (
                <div key={tx.id} className="pt-3 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      tx.valor > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-[#EC0000]'
                    }`}>
                      {tx.valor > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">{tx.estabelecimento}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{tx.categoria} · {tx.data}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-black block ${
                      tx.valor > 0 ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {tx.valor > 0 ? '+' : ''} R$ {Math.abs(tx.valor).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 block">
                      {tx.pontos}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Autenticação protegida Santander Mastercard Identity Check
            </span>
            <button
              onClick={() => alert('Abrindo contestação de compra via Ouvidoria Santander')}
              className="text-[11px] font-bold text-slate-500 hover:text-[#EC0000]"
            >
              Reconhece todas as compras?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
