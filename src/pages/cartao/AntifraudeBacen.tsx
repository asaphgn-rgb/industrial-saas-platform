import { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Lock,
  Radio,
  Flame,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  FileCheck2
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
      id: 'SEC-8901',
      data_hora: '17/10/2026 14:12',
      cartao_mascarado: '5582 •••• •••• 8472',
      titular: 'Marcos Vinicius Almeida',
      estabelecimento: 'Loja Virtual Eletro Shop SP',
      valor: 4890.00,
      score_risco: 88,
      motivo_alerta: 'Tentativa de compra de alto valor em IP internacional com cartão físico ativo em Brasília',
      decisao: 'BLOQUEADA',
      comunicado_bacen: true
    },
    {
      id: 'SEC-8902',
      data_hora: '17/10/2026 11:45',
      cartao_mascarado: '4532 •••• •••• 9921',
      titular: 'Ana Cláudia Fontes',
      estabelecimento: 'Posto Petrobrás Asa Sul',
      valor: 220.00,
      score_risco: 15,
      motivo_alerta: 'Transação dentro do padrão habitual de consumo na rede credenciada',
      decisao: 'LIBERADA_MANUAL',
      comunicado_bacen: false
    },
    {
      id: 'SEC-8903',
      data_hora: '17/10/2026 09:30',
      cartao_mascarado: '5582 •••• •••• 3341',
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
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Antifraude & Compliance COAF / Bacen
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Auditoria Antifraude Santander Way
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Trilha de monitoramento 24/7, relatórios PLD-FT (Prevenção à Lavagem de Dinheiro) e comunicações automáticas ao SISCOAF.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exportando comunicado formal COAF / DLO')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 text-[#EC0000]" /> Exportar DLO / COAF
          </button>
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
            <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            Barramento 24/7 Ativo
          </span>
        </div>
      </div>

      {/* Cards de Status Regulatório Santander Style */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Índice de Fraude (EIR)</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">0.02%</p>
          <p className="text-[11px] text-slate-400 mt-1">Teto regulatório Bacen: 0.10%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Comunicações COAF</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">14</p>
          <p className="text-[11px] text-slate-500 mt-1">Protocoladas via SISCOAF</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bloqueios Preventivos</span>
          <p className="text-2xl sm:text-3xl font-black text-[#EC0000] mt-1">128</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">100% tempestivos</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status do Barramento</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">OPERACIONAL</p>
          <p className="text-[11px] text-slate-400 mt-1">Criptografia E2E HSM</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por titular, cartão ou estabelecimento sob alerta..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-[#F4F6F9] focus:bg-white focus:border-[#EC0000] focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
          />
        </div>

        <select
          value={filtroDecisao}
          onChange={e => setFiltroDecisao(e.target.value)}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#EC0000] w-full md:w-auto"
        >
          <option value="TODOS">Todas as Decisões</option>
          <option value="BLOQUEADA">Bloqueadas</option>
          <option value="LIBERADA_MANUAL">Liberadas Manualmente</option>
          <option value="EM_ANALISE">Em Análise</option>
        </select>
      </div>

      {/* Tabela de Alertas Antifraude */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8FAFC] text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/80">
              <tr>
                <th className="py-4 px-6">ID & Horário</th>
                <th className="py-4 px-6">Titular & Cartão</th>
                <th className="py-4 px-6">Estabelecimento & Valor</th>
                <th className="py-4 px-6">Score de Risco</th>
                <th className="py-4 px-6">Diagnóstico do Alerta</th>
                <th className="py-4 px-6">Decisão</th>
                <th className="py-4 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {alertasFiltrados.map(alerta => (
                <tr key={alerta.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-mono font-bold text-slate-900">{alerta.id}</p>
                    <p className="text-[10px] text-slate-400">{alerta.data_hora}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900 text-sm">{alerta.titular}</p>
                    <p className="text-xs text-slate-400 font-mono">{alerta.cartao_mascarado}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{alerta.estabelecimento}</p>
                    <p className="text-xs font-black text-slate-900">
                      R$ {alerta.valor.toFixed(2).replace('.', ',')}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            alerta.score_risco > 70
                              ? 'bg-[#EC0000]'
                              : alerta.score_risco > 40
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${alerta.score_risco}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-bold ${
                        alerta.score_risco > 70 ? 'text-[#EC0000]' : 'text-slate-700'
                      }`}>
                        {alerta.score_risco}/100
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    <p className="text-xs text-slate-700 truncate font-medium" title={alerta.motivo_alerta}>
                      {alerta.motivo_alerta}
                    </p>
                    {alerta.comunicado_bacen && (
                      <span className="text-[10px] font-bold text-[#EC0000] flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Comunicação Bacen Gerada
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      alerta.decisao === 'BLOQUEADA'
                        ? 'bg-red-50 text-[#EC0000] border border-red-200'
                        : alerta.decisao === 'EM_ANALISE'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {alerta.decisao === 'BLOQUEADA' && <Lock className="h-3 w-3" />}
                      {alerta.decisao === 'EM_ANALISE' && <Clock className="h-3 w-3" />}
                      {alerta.decisao === 'LIBERADA_MANUAL' && <CheckCircle2 className="h-3 w-3" />}
                      {alerta.decisao}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert(`Visualizando detalhes forenses do alerta ${alerta.id}`)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#EC0000] bg-red-50 hover:bg-red-100 transition-colors shadow-sm"
                    >
                      Dossiê →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-[#F4F6F9] text-xs text-slate-500 flex justify-between items-center">
          <span>Integração Mastercard Decision Intelligence e Banco Santander Brasil S.A.</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
