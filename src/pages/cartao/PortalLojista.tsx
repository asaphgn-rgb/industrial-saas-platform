import { useState } from 'react';
import {
  Store,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Search,
  ExternalLink,
  ArrowDownLeft,
  Building2,
  Receipt
} from 'lucide-react';
import { ConciliacaoLojistaItem } from '@/types/cartao';

export default function PortalLojista() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  const [conciliacoes] = useState<ConciliacaoLojistaItem[]>([
    {
      id: 'conc-901',
      periodo_referencia: '15/10/2026',
      vendas_brutas: 18450.00,
      mdr_descontado: 332.10, // 1.80% MDR
      cashback_retido: 645.75, // 3.50% Cashback repassado ao associado
      valor_liquido_repasse: 17472.15,
      data_repasse: '16/10/2026',
      status: 'LIQUIDADO',
      chave_pix_comprovante: 'E2E-PIX-20261016-88192301923'
    },
    {
      id: 'conc-902',
      periodo_referencia: '14/10/2026',
      vendas_brutas: 22800.00,
      mdr_descontado: 410.40,
      cashback_retido: 798.00,
      valor_liquido_repasse: 21591.60,
      data_repasse: '15/10/2026',
      status: 'LIQUIDADO',
      chave_pix_comprovante: 'E2E-PIX-20261015-77182901844'
    },
    {
      id: 'conc-903',
      periodo_referencia: '16/10/2026',
      vendas_brutas: 14200.00,
      mdr_descontado: 255.60,
      cashback_retido: 497.00,
      valor_liquido_repasse: 13447.40,
      data_repasse: '17/10/2026',
      status: 'PENDENTE_LIQUIDACAO'
    }
  ]);

  const conciliacoesFiltradas = conciliacoes.filter(c => {
    const matchBusca =
      c.periodo_referencia.includes(busca) ||
      (c.chave_pix_comprovante && c.chave_pix_comprovante.includes(busca));
    const matchStatus = filtroStatus === 'TODOS' || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Portal do Lojista Parceiro & Conciliação
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Liquidação D+1 Automática
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhamento transparente de vendas com Cartão Diamond, desconto de taxa MDR, retenção de cashback e repasses via PIX.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Extrato Financeiro OFX
          </button>
        </div>
      </div>

      {/* Cards de Métricas do Estabelecimento */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Vendas Brutas (Mês)</span>
          <p className="text-3xl font-black text-slate-900 mt-2">R$ 284.500</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">+14.2% em relação ao mês anterior</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Repasse Líquido D+1</span>
          <p className="text-3xl font-black text-purple-600 mt-2">R$ 269.421</p>
          <p className="text-xs text-slate-400 mt-1">100% liquidado em conta bancária</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Cashback Distribuído</span>
          <p className="text-3xl font-black text-amber-600 mt-2">R$ 9.957</p>
          <p className="text-xs text-slate-400 mt-1">Fidelidade aos cooperados</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Taxa MDR Contratual</span>
          <p className="text-3xl font-black text-blue-600 mt-2">1.80%</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Sem tarifa de adesão ou aluguel</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por data de referência ou comprovante PIX..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none transition-all"
          />
        </div>

        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-purple-500 w-full md:w-auto"
        >
          <option value="TODOS">Todos os Repasses</option>
          <option value="LIQUIDADO">Liquidados via PIX</option>
          <option value="PENDENTE_LIQUIDACAO">Pendentes de Liquidação</option>
        </select>
      </div>

      {/* Tabela de Conciliação Financeira */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Data de Venda</th>
                <th className="py-4 px-6">Vendas Brutas</th>
                <th className="py-4 px-6">Taxa MDR (-1.80%)</th>
                <th className="py-4 px-6">Cashback Associado</th>
                <th className="py-4 px-6">Líquido Creditado</th>
                <th className="py-4 px-6">Data de Repasse</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Comprovante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {conciliacoesFiltradas.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {c.periodo_referencia}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    R$ {c.vendas_brutas.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 text-red-600 font-medium">
                    - R$ {c.mdr_descontado.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 text-amber-600 font-medium">
                    - R$ {c.cashback_retido.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 font-black text-emerald-600 text-base">
                    R$ {c.valor_liquido_repasse.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {c.data_repasse}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      c.status === 'LIQUIDADO'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status === 'LIQUIDADO' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      {c.status === 'LIQUIDADO' ? 'Creditado PIX' : 'Aguardando Janela'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {c.chave_pix_comprovante ? (
                      <button
                        onClick={() => alert(`Comprovante de transferência PIX Bacen:\n${c.chave_pix_comprovante}\nValor: R$ ${c.valor_liquido_repasse.toFixed(2)}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors inline-flex items-center gap-1"
                      >
                        <Receipt className="h-3.5 w-3.5" /> Recibo
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Em processamento</span>
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
