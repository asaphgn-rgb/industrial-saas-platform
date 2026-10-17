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
  Receipt,
  Flame,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ConciliacaoLojistaItem } from '@/types/cartao';

export default function PortalLojista() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  const [conciliacoes] = useState<ConciliacaoLojistaItem[]>([
    {
      id: 'conc-901',
      periodo_referencia: '16/10/2026',
      vendas_brutas: 18450.00,
      mdr_descontado: 332.10, // 1.80% MDR
      cashback_retido: 645.75, // 3.50% Cashback repassado ao associado
      valor_liquido_repasse: 17472.15,
      data_repasse: '17/10/2026',
      status: 'LIQUIDADO',
      chave_pix_comprovante: 'E2E-PIX-20261017-88192301923'
    },
    {
      id: 'conc-902',
      periodo_referencia: '15/10/2026',
      vendas_brutas: 22800.00,
      mdr_descontado: 410.40,
      cashback_retido: 798.00,
      valor_liquido_repasse: 21591.60,
      data_repasse: '16/10/2026',
      status: 'LIQUIDADO',
      chave_pix_comprovante: 'E2E-PIX-20261016-77182901844'
    },
    {
      id: 'conc-903',
      periodo_referencia: '17/10/2026',
      vendas_brutas: 14200.00,
      mdr_descontado: 255.60,
      cashback_retido: 497.00,
      valor_liquido_repasse: 13447.40,
      data_repasse: '18/10/2026',
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
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Liquidação Comercial & Repasses D+1
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Portal do Lojista Conveniado Santander
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Conciliação de vendas capturadas com Cartão Diamond, apuração de taxa MDR e liquidação via PIX SPI Bacen.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exportando extrato financeiro OFX / CSV')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 text-[#EC0000]" /> Extrato Financeiro
          </button>
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Repasses D+1 em Dia
          </span>
        </div>
      </div>

      {/* Cards de Métricas Santander Style */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vendas Brutas (Mês)</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">R$ 284.500</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">+14.2% crescimento na rede</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Repasse Líquido D+1</span>
          <p className="text-2xl sm:text-3xl font-black text-[#EC0000] mt-1">R$ 269.421</p>
          <p className="text-[11px] text-slate-500 mt-1">100% creditado via PIX Bacen</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cashback Habitacional</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">R$ 9.957</p>
          <p className="text-[11px] text-slate-400 mt-1">Fidelidade circular p/ cooperados</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Taxa MDR Contratual</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">1.80%</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">Sem custo de adesão/POS</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por data de venda ou comprovante PIX..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-[#F4F6F9] focus:bg-white focus:border-[#EC0000] focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
          />
        </div>

        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#EC0000] w-full md:w-auto"
        >
          <option value="TODOS">Todos os Lotes</option>
          <option value="LIQUIDADO">Liquidados via PIX</option>
          <option value="PENDENTE_LIQUIDACAO">Pendentes de Liquidação</option>
        </select>
      </div>

      {/* Tabela de Conciliação Financeira */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8FAFC] text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/80">
              <tr>
                <th className="py-4 px-6">Data de Venda</th>
                <th className="py-4 px-6">Vendas Brutas</th>
                <th className="py-4 px-6">Taxa MDR (-1.80%)</th>
                <th className="py-4 px-6">Cashback Retido</th>
                <th className="py-4 px-6">Líquido Creditado</th>
                <th className="py-4 px-6">Data de Repasse</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Comprovante PIX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {conciliacoesFiltradas.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {c.periodo_referencia}
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900">
                    R$ {c.vendas_brutas.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 text-[#EC0000] font-bold">
                    - R$ {c.mdr_descontado.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 text-amber-600 font-bold">
                    - R$ {c.cashback_retido.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 font-black text-emerald-600 text-sm">
                    R$ {c.valor_liquido_repasse.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">
                    {c.data_repasse}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      c.status === 'LIQUIDADO'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {c.status === 'LIQUIDADO' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      {c.status === 'LIQUIDADO' ? 'Liquidado PIX' : 'Em Processamento'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {c.chave_pix_comprovante ? (
                      <button
                        onClick={() => alert(`Comprovante de Transferência PIX Santander Bacen:\nProtocolo: ${c.chave_pix_comprovante}\nValor: R$ ${c.valor_liquido_repasse.toFixed(2)}`)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-[#EC0000] border border-red-200 hover:bg-red-100 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Receipt className="h-3.5 w-3.5" /> Ver Recibo
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Janela noturna Bacen</span>
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
