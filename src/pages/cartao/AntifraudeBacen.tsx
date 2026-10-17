import { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
  Eye,
  FileCheck2,
  Radio
} from 'lucide-react';

interface EventoAntifraude {
  id: string;
  data_hora: string;
  cartao_mascarado: string;
  titular: string;
  estabelecimento: string;
  valor: number;
  score_risco: number; // 0 - 100
  motivo_alerta: string;
  decisao: 'BLOQUEADA' | 'LIBERADA_MANUAL' | 'EM_ANALISE';
  comunicado_bacen: boolean;
}

export default function AntifraudeBacen() {
  const [busca, setBusca] = useState('');
  const [filtroDecisao, setFiltroDecisao] = useState('TODOS');

  const [alertas] = useState<EventoAntifraude[]>([
    {
      id: 'sec-8901',
      data_hora: '16/10/2026 14:12',
      cartao_mascarado: '•••• •••• •••• 4892',
      titular: 'Marcos Vinicius Almeida',
      estabelecimento: 'Loja Virtual Eletro Shop SP',
      valor: 4890.00,
      score_risco: 88,
      motivo_alerta: 'Tentativa de compra de alto valor em IP internacional com cartão físico ativo em Brasília',
      decisao: 'BLOQUEADA',
      comunicado_bacen: true
    },
    {
      id: 'sec-8902',
      data_hora: '16/10/2026 11:45',
      cartao_mascarado: '•••• •••• •••• 9921',
      titular: 'Ana Cláudia Fontes',
      estabelecimento: 'Posto Petrobrás Asa Sul',
      valor: 220.00,
      score_risco: 15,
      motivo_alerta: 'Transação dentro do padrão habitual de consumo',
      decisao: 'LIBERADA_MANUAL',
      comunicado_bacen: false
    },
    {
      id: 'sec-8903',
      data_hora: '16/10/2026 09:30',
      cartao_mascarado: '•••• •••• •••• 3341',
      titular: 'Roberto Carlos Silveira',
      estabelecimento: 'Supermercado Central Aliança',
      valor: 1350.00,
      score_risco: 72,
      motivo_alerta: '4 tentativas de aproximação consecutivas em menos de 3 minutos',
      decisao: 'EM_ANALISE',
      comunicado_bacen: true
    }
  ]);

  const alertasFiltrados = alertas.filter(a => {
    const matchBusca =
      a.titular.toLowerCase().includes(busca.toLowerCase()) ||
      a.cartao_mascarado.includes(busca) ||
      a.estabelecimento.toLowerCase().includes(busca.toLowerCase());
    const matchDecisao = filtroDecisao === 'TODOS' || a.decisao === filtroDecisao;
    return matchBusca && matchDecisao;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Antifraude & Auditoria Regulatória (Bacen)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 flex items-center gap-1">
              <Radio className="h-3 w-3 animate-pulse text-red-600" />
              Monitoramento 24/7 Ativo
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Trilha de auditoria antifraude, relatórios de PLD-FT (Prevenção à Lavagem de Dinheiro) e comunicações automáticas ao COAF / Bacen.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Exportar DLO / COAF
          </button>
          <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors">
            <FileCheck2 className="h-4 w-4" /> Emitir Parecer de Conformidade
          </button>
        </div>
      </div>

      {/* Cards de Status Regulatório */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Índice de Fraude (EIR)</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">0.02%</p>
          <p className="text-xs text-slate-400 mt-1">Teto Bacen: 0.10%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Comunicações COAF</span>
          <p className="text-2xl font-black text-slate-900 mt-2">14</p>
          <p className="text-xs text-slate-400 mt-1">Protocoladas via SISCOAF</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Bloqueios Preventivos</span>
          <p className="text-2xl font-black text-red-600 mt-2">128</p>
          <p className="text-xs text-emerald-600 mt-1">100% tempestivos</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Status do Barramento</span>
          <p className="text-2xl font-black text-blue-600 mt-2">OPERACIONAL</p>
          <p className="text-xs text-slate-400 mt-1">Criptografia E2E HSM</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por titular, cartão ou estabelecimento suspeito..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none transition-all"
          />
        </div>

        <select
          value={filtroDecisao}
          onChange={e => setFiltroDecisao(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-purple-500 w-full md:w-auto"
        >
          <option value="TODOS">Todas as Decisões</option>
          <option value="BLOQUEADA">Bloqueadas</option>
          <option value="LIBERADA_MANUAL">Liberadas Manualmente</option>
          <option value="EM_ANALISE">Em Análise</option>
        </select>
      </div>

      {/* Lista de Alertas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">ID & Horário</th>
                <th className="py-4 px-6">Titular & Cartão</th>
                <th className="py-4 px-6">Estabelecimento & Valor</th>
                <th className="py-4 px-6">Score Antifraude</th>
                <th className="py-4 px-6">Diagnóstico do Alerta</th>
                <th className="py-4 px-6">Decisão</th>
                <th className="py-4 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alertasFiltrados.map(alerta => (
                <tr key={alerta.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-mono text-xs font-bold text-slate-900">{alerta.id}</p>
                    <p className="text-xs text-slate-400">{alerta.data_hora}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{alerta.titular}</p>
                    <p className="text-xs text-slate-400 font-mono">{alerta.cartao_mascarado}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{alerta.estabelecimento}</p>
                    <p className="text-xs font-bold text-slate-700">
                      R$ {alerta.valor.toFixed(2).replace('.', ',')}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            alerta.score_risco > 70
                              ? 'bg-red-500'
                              : alerta.score_risco > 40
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${alerta.score_risco}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-bold ${
                        alerta.score_risco > 70 ? 'text-red-600' : 'text-slate-700'
                      }`}>
                        {alerta.score_risco}/100
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    <p className="text-xs text-slate-600 truncate" title={alerta.motivo_alerta}>
                      {alerta.motivo_alerta}
                    </p>
                    {alerta.comunicado_bacen && (
                      <span className="text-[10px] font-semibold text-purple-600 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Comunicação Bacen Gerada
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      alerta.decisao === 'BLOQUEADA'
                        ? 'bg-red-100 text-red-800'
                        : alerta.decisao === 'EM_ANALISE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {alerta.decisao === 'BLOQUEADA' && <Lock className="h-3 w-3" />}
                      {alerta.decisao === 'EM_ANALISE' && <Clock className="h-3 w-3" />}
                      {alerta.decisao === 'LIBERADA_MANUAL' && <CheckCircle2 className="h-3 w-3" />}
                      {alerta.decisao}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-3 py-1.5 text-xs font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      Detalhes ➔
                    </button>
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
