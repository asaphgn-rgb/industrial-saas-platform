import { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  Users,
  Store,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Percent,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Download,
  PlusCircle,
  Lock,
  Unlock,
  DollarSign
} from 'lucide-react';
import { CartaoItem, TransacaoCartao } from '@/types/cartao';

export default function CartaoDashboard() {
  const [periodo, setPeriodo] = useState('mes');

  // Métricas Consolidadas do Sistema CARTÃO DIAMOND
  const kpis = [
    {
      titulo: 'Cartões Ativos em Circulação',
      valor: '8.420',
      variacao: '+12.4% este mês',
      icone: CreditCard,
      corIcone: 'text-blue-500 bg-blue-50'
    },
    {
      titulo: 'Volume Transacionado (TPV)',
      valor: 'R$ 4.850.210,00',
      variacao: '+18.2% vs mês anterior',
      icone: TrendingUp,
      corIcone: 'text-emerald-500 bg-emerald-50'
    },
    {
      titulo: 'Rede de Parceiros Credenciados',
      valor: '342',
      variacao: '28 novos comércios',
      icone: Store,
      corIcone: 'text-purple-500 bg-purple-50'
    },
    {
      titulo: 'Cashback Distribuído (Clube)',
      valor: 'R$ 142.380,50',
      variacao: '3.2% média devolvida',
      icone: Percent,
      corIcone: 'text-amber-500 bg-amber-50'
    }
  ];

  // Últimas Transações Realizadas
  const ultimasTransacoes: TransacaoCartao[] = [
    {
      id: 'tx-001',
      cartao_id: 'cart-1',
      estabelecimento: 'Supermercado Central Aliança',
      categoria: 'ALIMENTACAO',
      valor: 284.50,
      tipo: 'DEBITO',
      data_hora: '16/10/2026 14:32',
      status: 'APROVADA'
    },
    {
      id: 'tx-002',
      cartao_id: 'cart-2',
      estabelecimento: 'Farmácia & Drogaria Popular',
      categoria: 'FARMACIA',
      valor: 89.90,
      tipo: 'DEBITO',
      data_hora: '16/10/2026 13:45',
      status: 'APROVADA'
    },
    {
      id: 'tx-003',
      cartao_id: 'cart-3',
      estabelecimento: 'Posto Petrobrás Asa Sul',
      categoria: 'COMBUSTIVEL',
      valor: 220.00,
      tipo: 'DEBITO',
      data_hora: '16/10/2026 11:20',
      status: 'APROVADA'
    },
    {
      id: 'tx-004',
      cartao_id: 'cart-4',
      estabelecimento: 'Loja Eletrônicos & Informática',
      categoria: 'SERVICOS',
      valor: 1450.00,
      tipo: 'CREDITO',
      data_hora: '16/10/2026 09:15',
      status: 'RECUSADA'
    },
    {
      id: 'tx-005',
      cartao_id: 'cart-5',
      estabelecimento: 'Cashback Mensal Bonificação',
      categoria: 'HABITACAO',
      valor: 45.20,
      tipo: 'CASHBACK',
      data_hora: '15/10/2026 18:00',
      status: 'APROVADA'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Informativo de Separação de Módulo */}
      <div className="bg-gradient-to-r from-diamond-950 via-slate-900 to-diamond-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <CreditCard className="h-3.5 w-3.5" /> Módulo Independente · Fintech & Benefícios
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Gestão Exclusiva: CARTÃO DIAMOND
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Sistema segregado e autônomo para emissão de cartões, gestão de faturas, limite de crédito, antecipações consignadas e controle da rede credenciada de benefícios.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all">
              <PlusCircle className="h-4 w-4" />
              Emitir Novo Cartão
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all">
              <Download className="h-4 w-4" />
              Relatório Bacen
            </button>
          </div>
        </div>
      </div>

      {/* Grid de KPIs Financeiros */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icone = kpi.icone;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  {kpi.titulo}
                </span>
                <div className={`p-2.5 rounded-xl ${kpi.corIcone}`}>
                  <Icone className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{kpi.valor}</h3>
                <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {kpi.variacao}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seção 2 Colunas: Visualização do Cartão Físico/Virtual & Painel de Transações */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cartão Físico / Virtual Preview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Cartão Modelo Padrão</h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                BENEFÍCIO & CRÉDITO
              </span>
            </div>

            {/* Simulação Visual do Cartão Diamond */}
            <div className="mt-6 aspect-[1.586/1] w-full rounded-2xl p-6 bg-gradient-to-br from-[#0A0F1E] via-[#1B2A41] to-[#0A0F1E] text-white shadow-2xl relative overflow-hidden border border-slate-700 flex flex-col justify-between">
              {/* Marca d'água */}
              <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
                <CreditCard className="w-64 h-64 text-blue-400" />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center font-black text-white text-xs shadow-md">
                    D
                  </div>
                  <span className="font-extrabold tracking-widest text-sm text-slate-100">DIAMOND CARD</span>
                </div>
                <span className="text-[10px] tracking-widest text-blue-400 font-mono font-bold uppercase">
                  Black Edition
                </span>
              </div>

              {/* Chip Inteligente */}
              <div className="my-auto relative z-10 flex items-center gap-3">
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 to-amber-100 border border-amber-400/50 shadow-inner flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-500/40 rounded-sm" />
                </div>
                <span className="text-xs text-slate-400 font-mono tracking-widest">Aproximação NFC</span>
              </div>

              <div className="relative z-10 space-y-1">
                <p className="font-mono text-base tracking-widest text-slate-200">
                  •••• •••• •••• 4892
                </p>
                <div className="flex justify-between items-end pt-1">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400">Titular Associado</p>
                    <p className="text-xs font-bold text-white tracking-wide">MARCOS VINICIUS ALMEIDA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400">Validade</p>
                    <p className="text-xs font-mono font-bold text-white">10/31</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Limite Utilizado:</span>
              <span className="font-bold text-slate-900">R$ 1.840,00 de R$ 5.000,00</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full w-[36.8%]" />
            </div>
          </div>
        </div>

        {/* Extrato e Conciliação em Tempo Real */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Últimas Transações Autorizadas</h3>
              <p className="text-xs text-slate-500 mt-0.5">Processamento em tempo real com barramento antifraude ativo</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" /> Filtrar
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {ultimasTransacoes.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    tx.tipo === 'CASHBACK'
                      ? 'bg-amber-50 text-amber-600'
                      : tx.status === 'APROVADA'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {tx.tipo === 'CASHBACK' ? (
                      <Percent className="h-4 w-4" />
                    ) : tx.status === 'APROVADA' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{tx.estabelecimento}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{tx.data_hora}</span>
                      <span>•</span>
                      <span className="uppercase text-[10px] tracking-wide bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {tx.categoria}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    tx.tipo === 'CASHBACK'
                      ? 'text-emerald-600'
                      : tx.status === 'APROVADA'
                      ? 'text-slate-900'
                      : 'text-red-500 line-through'
                  }`}>
                    {tx.tipo === 'CASHBACK' ? '+' : '-'} R$ {tx.valor.toFixed(2).replace('.', ',')}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    tx.status === 'APROVADA'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
