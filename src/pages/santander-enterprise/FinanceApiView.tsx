import React, { useState } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Server,
  Building2,
  DollarSign,
  Lock,
  FileText,
  Key,
  Cpu,
  RefreshCw,
  Search,
  Download
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const FinanceApiView: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Últimos 30 dias');

  const operations = [
    {
      dateTime: '25/04/2025 14:32',
      type: 'PIX',
      client: 'João Silva',
      amount: 2500.0,
      status: 'Concluída',
      channel: 'App',
      operationId: 'OP78945612',
    },
    {
      dateTime: '25/04/2025 14:18',
      type: 'Pagamento',
      client: 'Empresa Alpha',
      amount: 12340.0,
      status: 'Concluída',
      channel: 'API',
      operationId: 'OP78945611',
    },
    {
      dateTime: '25/04/2025 13:57',
      type: 'Transferência',
      client: 'Mariana Costa',
      amount: 980.0,
      status: 'Concluída',
      channel: 'App',
      operationId: 'OP78945610',
    },
    {
      dateTime: '25/04/2025 13:24',
      type: 'Cartão',
      client: 'Carlos Mendes',
      amount: 1200.0,
      status: 'Concluída',
      channel: 'POS',
      operationId: 'OP78945609',
    },
    {
      dateTime: '25/04/2025 12:41',
      type: 'Crédito',
      client: 'Empresa Beta',
      amount: 50000.0,
      status: 'Concluída',
      channel: 'API',
      operationId: 'OP78945608',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Financeiro & API
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Monitoramento financeiro, integrações bancárias e conciliação operacional.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-sm focus:outline-none"
          >
            <option>Últimos 30 dias</option>
            <option>Últimos 7 dias</option>
            <option>Hoje</option>
          </select>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 12,4% <span className="text-slate-400 font-normal">vs. período anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Volume transacionado
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">
              R$ 1,86 mi
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 18,7% <span className="text-slate-400 font-normal">vs. período anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              PIX processados
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">
              4.782
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 0,01 p.p. <span className="text-slate-400 font-normal">vs. período anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Disponibilidade API
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">
              99,98%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 2,6 p.p. <span className="text-slate-400 font-normal">vs. período anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Conciliação
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">
              97,4%
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Fluxo Transacional (8 cols) + Saúde das Integrações (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Fluxo Transacional (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Fluxo transacional</h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Tempo médio: 2,3s
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Da solicitação do cliente à confirmação bancária, com segurança e rastreabilidade.
            </p>

            {/* Stepper Pipeline Architecture */}
            <div className="grid grid-cols-5 gap-2 mt-6">
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60 text-center flex flex-col items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                  1
                </div>
                <h3 className="text-xs font-bold text-slate-900">Cliente</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Inicia a transação no app ou portal
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-white text-center flex flex-col items-center justify-between shadow-md">
                <div className="w-8 h-8 rounded-full bg-dyamond-gold-500 text-dyamond-navy-950 flex items-center justify-center text-xs font-black mb-1">
                  DY
                </div>
                <h3 className="text-xs font-bold text-white">Plataforma DYAMOND</h3>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                  Valida, processa e orquestra
                </p>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60 text-center flex flex-col items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                  API
                </div>
                <h3 className="text-xs font-bold text-slate-900">API Gateway</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Gerencia integrações, segurança e roteamento
                </p>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60 text-center flex flex-col items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                  BACEN
                </div>
                <h3 className="text-xs font-bold text-slate-900">Banco Parceiro</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Processa a operação no ambiente bancário
                </p>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-300 text-center flex flex-col items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mb-1">
                  ✓
                </div>
                <h3 className="text-xs font-bold text-emerald-900">Confirmação</h3>
                <p className="text-[10px] text-emerald-700 mt-0.5 leading-tight">
                  Retorna o status em tempo real para o cliente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Saúde das Integrações (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">Saúde das integrações</h2>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Status em tempo real das principais APIs.
            </p>

            <div className="space-y-3 mt-4 text-xs">
              {[
                { name: 'PIX API', desc: 'Pagamentos instantâneos', latency: '124 ms', status: 'Operacional' },
                { name: 'KYC API', desc: 'Validação cadastral', latency: '210 ms', status: 'Operacional' },
                { name: 'Cartões API', desc: 'Emissão e gestão', latency: '168 ms', status: 'Operacional' },
                { name: 'Crédito API', desc: 'Análise e concessão', latency: '193 ms', status: 'Operacional' },
              ].map((api, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs">{api.name}</h3>
                      <p className="text-[10px] text-slate-400">{api.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-500">{api.latency}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[9px]">
                      ● {api.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Operações Recentes (8 cols) + Segurança e Conformidade (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Operações Recentes Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Operações recentes</h2>
              <p className="text-[11px] text-slate-500">
                Últimas transações processadas pela plataforma.
              </p>
            </div>
            <button
              onClick={() => alert('Abrindo extrato transacional global.')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              Ver todas as operações <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-y border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Data e hora</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Valor</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Canal</th>
                  <th className="py-2.5 px-3">ID da operação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operations.map((op, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {op.dateTime}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {op.type}
                    </td>
                    <td className="py-3 px-3 text-slate-900 font-medium">
                      {op.client}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {formatCurrency(op.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        ● {op.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {op.channel}
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                      {op.operationId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Segurança e Conformidade (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Segurança e conformidade</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Padrões de segurança que protegem suas operações.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <Lock className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-800">OAuth 2.0</h3>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Autenticação segura e autorizada
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-800">MFA</h3>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Autenticação em dois fatores
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <Key className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-800">Criptografia</h3>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Dados protegidos em trânsito e em repouso
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-800">Auditoria</h3>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Logs e trilhas de auditoria completos
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 mt-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-semibold text-emerald-800 leading-tight">
              Em conformidade com a LGPD, Banco Central e melhores práticas do mercado.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
