import { useState } from 'react';
import {
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  CreditCard,
  QrCode,
  Barcode,
  Clock
} from 'lucide-react';

interface FaturaRegistro {
  id: string;
  titular: string;
  cpf_mascarado: string;
  cartao_final: string;
  mes_referencia: string;
  valor_total: number;
  valor_minimo: number;
  valor_pago: number;
  vencimento: string;
  status: 'PAGA' | 'ABERTA' | 'VENCIDA' | 'PARCELADA';
  liquidado_em?: string;
}

export default function FaturasLiquidacao() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  const [faturas] = useState<FaturaRegistro[]>([
    {
      id: 'fat-1001',
      titular: 'Marcos Vinicius Almeida',
      cpf_mascarado: '***.482.918-**',
      cartao_final: '4892',
      mes_referencia: '10/2026',
      valor_total: 1840.00,
      valor_minimo: 276.00,
      valor_pago: 1840.00,
      vencimento: '10/11/2026',
      status: 'PAGA',
      liquidado_em: '15/10/2026 via PIX'
    },
    {
      id: 'fat-1002',
      titular: 'Ana Cláudia Fontes',
      cpf_mascarado: '***.723.101-**',
      cartao_final: '9921',
      mes_referencia: '10/2026',
      valor_total: 3500.00,
      valor_minimo: 525.00,
      valor_pago: 0.00,
      vencimento: '15/11/2026',
      status: 'ABERTA'
    },
    {
      id: 'fat-1003',
      titular: 'Roberto Carlos Silveira',
      cpf_mascarado: '***.195.448-**',
      cartao_final: '3341',
      mes_referencia: '09/2026',
      valor_total: 2890.00,
      valor_minimo: 433.50,
      valor_pago: 500.00,
      vencimento: '20/10/2026',
      status: 'VENCIDA'
    },
    {
      id: 'fat-1004',
      titular: 'Cláudio Ferreira Prado',
      cpf_mascarado: '***.512.809-**',
      cartao_final: '7104',
      mes_referencia: '10/2026',
      valor_total: 4210.50,
      valor_minimo: 631.50,
      valor_pago: 1200.00,
      vencimento: '12/11/2026',
      status: 'PARCELADA',
      liquidado_em: 'Parcelamento 12x'
    }
  ]);

  const faturasFiltradas = faturas.filter(f => {
    const matchBusca =
      f.titular.toLowerCase().includes(busca.toLowerCase()) ||
      f.cpf_mascarado.includes(busca) ||
      f.cartao_final.includes(busca);
    const matchStatus = filtroStatus === 'TODOS' || f.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Faturas & Liquidação Financeira
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Controle Bacen D+1
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Conciliação bancária de recebíveis, boletos registrados, QR Code PIX e liquidação de repasses da rede de cartões.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Arquivo CNAB 240 / 400
          </button>
          <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors">
            <DollarSign className="h-4 w-4" /> Rodar Liquidação em Lote
          </button>
        </div>
      </div>

      {/* Cards de Métricas de Faturamento */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Volume Faturado</span>
          <p className="text-2xl font-black text-slate-900 mt-2">R$ 1.480.200</p>
          <p className="text-xs text-slate-400 mt-1">Competência atual</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Liquidado via PIX</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">R$ 984.150</p>
          <p className="text-xs text-emerald-600 mt-1">66.4% da carteira</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Boletos Compensados</span>
          <p className="text-2xl font-black text-blue-600 mt-2">R$ 382.400</p>
          <p className="text-xs text-slate-400 mt-1">Via CIP / Febraban</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Inadimplência (&gt;30d)</span>
          <p className="text-2xl font-black text-red-600 mt-2">1.82%</p>
          <p className="text-xs text-emerald-600 mt-1">Abaixo do teto Bacen (3%)</p>
        </div>
      </div>

      {/* Busca e Filtro */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar fatura por titular, CPF ou cartão final..."
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
          <option value="TODOS">Todos os Status</option>
          <option value="PAGA">Pagas / Liquidadas</option>
          <option value="ABERTA">Abertas</option>
          <option value="VENCIDA">Vencidas</option>
          <option value="PARCELADA">Parceladas</option>
        </select>
      </div>

      {/* Tabela de Faturas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Titular & Cartão</th>
                <th className="py-4 px-6">Referência</th>
                <th className="py-4 px-6">Vencimento</th>
                <th className="py-4 px-6">Valor Total / Mínimo</th>
                <th className="py-4 px-6">Valor Pago</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {faturasFiltradas.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{f.titular}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      Final •••• {f.cartao_final} · CPF {f.cpf_mascarado}
                    </p>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-700">
                    {f.mes_referencia}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {f.vencimento}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">
                      R$ {f.valor_total.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs text-slate-400">
                      Mínimo: R$ {f.valor_minimo.toFixed(2).replace('.', ',')}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-emerald-600">
                      R$ {f.valor_pago.toFixed(2).replace('.', ',')}
                    </p>
                    {f.liquidado_em && (
                      <p className="text-[11px] text-slate-400">{f.liquidado_em}</p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      f.status === 'PAGA'
                        ? 'bg-emerald-100 text-emerald-800'
                        : f.status === 'ABERTA'
                        ? 'bg-blue-100 text-blue-800'
                        : f.status === 'VENCIDA'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {f.status === 'PAGA' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {f.status === 'ABERTA' && <Clock className="h-3.5 w-3.5" />}
                      {f.status === 'VENCIDA' && <AlertCircle className="h-3.5 w-3.5" />}
                      {f.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Código de Barras">
                        <Barcode className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="PIX QR Code">
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Baixar PDF">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
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
