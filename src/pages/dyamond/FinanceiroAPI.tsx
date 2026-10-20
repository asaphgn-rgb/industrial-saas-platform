import { useState } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  DollarSign,
  Database,
  Code2,
  FileCheck2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  CreditCard,
  Lock,
  Download,
  Search,
  ExternalLink,
  Activity,
  Layers,
  Sparkles,
  Server,
  Zap,
  Users
} from 'lucide-react';

export default function FinanceiroAPI() {
  const [periodo, setPeriodo] = useState('30_dias');

  const kpis = [
    { title: 'Volume transacionado', value: 'R$ 1,86 mi', trend: '↑ 12,4%', sub: 'vs. período anterior', icon: Database, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
    { title: 'PIX processados', value: '4.782', trend: '↑ 18,7%', sub: 'vs. período anterior', icon: Zap, bg: 'bg-[#E6F7ED]', color: 'text-[#00A854]' },
    { title: 'Disponibilidade API', value: '99,98%', trend: '↑ 0,01 p.p.', sub: 'vs. período anterior', icon: Code2, bg: 'bg-[#FEF3C7]', color: 'text-[#D97706]' },
    { title: 'Conciliação', value: '97,4%', trend: '↑ 2,6 p.p.', sub: 'vs. período anterior', icon: FileCheck2, bg: 'bg-[#F3E8FF]', color: 'text-[#9333EA]' },
  ];

  const integracoesStatus = [
    { nome: 'PIX API', desc: 'Pagamentos instantâneos', latencia: '124 ms', status: 'Operacional', cor: 'text-[#00A854]' },
    { nome: 'KYC API', desc: 'Validação cadastral', latencia: '210 ms', status: 'Operacional', cor: 'text-[#00A854]' },
    { nome: 'Cartões API', desc: 'Emissão e gestão', latencia: '168 ms', status: 'Operacional', cor: 'text-[#00A854]' },
    { nome: 'Crédito API', desc: 'Análise e concessão', latencia: '193 ms', status: 'Operacional', cor: 'text-[#00A854]' },
  ];

  const operacoesRecentes = [
    { data: '25/04/2026 14:32', tipo: 'PIX', cliente: 'João Silva', valor: 'R$ 2.500,00', status: 'Concluída', canal: 'App', opId: 'OP78945612' },
    { data: '25/04/2026 14:18', tipo: 'Pagamento', cliente: 'Empresa Alpha', valor: 'R$ 12.340,00', status: 'Concluída', canal: 'API', opId: 'OP78945611' },
    { data: '25/04/2026 13:57', tipo: 'Transferência', cliente: 'Mariana Costa', valor: 'R$ 980,00', status: 'Concluída', canal: 'App', opId: 'OP78945610' },
    { data: '25/04/2026 13:24', tipo: 'Cartão', cliente: 'Carlos Mendes', valor: 'R$ 1.200,00', status: 'Concluída', canal: 'POS', opId: 'OP78945609' },
    { data: '25/04/2026 12:41', tipo: 'Crédito', cliente: 'Empresa Beta', valor: 'R$ 50.000,00', status: 'Concluída', canal: 'API', opId: 'OP78945608' },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight font-sans">
            Financeiro & API
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Monitoramento financeiro, integrações bancárias e conciliação operacional.
          </p>
        </div>
        <select
          value={periodo}
          onChange={e => setPeriodo(e.target.value)}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#E2EBE4] bg-white text-[#0A192F] outline-none shadow-xs self-start sm:self-center"
        >
          <option value="30_dias">Últimos 30 dias</option>
          <option value="60_dias">Últimos 60 dias</option>
          <option value="ano_atual">Ano atual</option>
        </select>
      </div>

      {/* 4 CARDS DE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border border-[#E2E8F4] bg-white p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#64748B]">{k.title}</span>
              <p className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">{k.value}</p>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-bold text-[#00A854] inline-flex items-center">
                  {k.trend}
                </span>
                <span className="text-[#94A3B8]">{k.sub}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${k.bg} flex items-center justify-center shrink-0`}>
              <k.icon className={`w-6 h-6 ${k.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* SEÇÃO 2: FLUXO TRANSACIONAL (DIAGRAMA) + SAÚDE DAS INTEGRAÇÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Diagrama de Fluxo Transacional (7 Colunas) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#0A192F]">Fluxo transacional</h3>
                <p className="text-xs text-[#64748B]">Da solicitação do cliente à confirmação bancária, com segurança e rastreabilidade.</p>
              </div>
              <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5 bg-[#F8FAFD] px-2.5 py-1 rounded-lg border border-[#E2EBE4]">
                <Clock className="w-3.5 h-3.5 text-[#0066FF]" /> Tempo médio: 2,3s
              </span>
            </div>

            {/* Stepper Diagrama Horizontal */}
            <div className="grid grid-cols-5 gap-2 pt-6 pb-2 text-center items-center">
              {/* Etapa 1 */}
              <div className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] flex flex-col items-center justify-between min-h-[140px]">
                <div className="w-9 h-9 rounded-full bg-[#EBF3FF] text-[#0066FF] flex items-center justify-center mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <strong className="text-xs text-[#0A192F]">Cliente</strong>
                <p className="text-[10px] text-[#64748B] mt-1 leading-snug">Inicia a transação no app ou portal</p>
              </div>

              {/* Etapa 2 */}
              <div className="p-3 rounded-xl border border-[#06152B] bg-[#06152B] text-white flex flex-col items-center justify-between min-h-[140px] shadow-sm">
                <div className="w-9 h-9 rounded-full bg-white/10 text-[#D4AF37] flex items-center justify-center mb-2 font-black text-xs">
                  DY
                </div>
                <strong className="text-xs text-white">Plataforma DYAMOND</strong>
                <p className="text-[10px] text-white/70 mt-1 leading-snug">Valida, processa e orquestra</p>
              </div>

              {/* Etapa 3 */}
              <div className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] flex flex-col items-center justify-between min-h-[140px]">
                <div className="w-9 h-9 rounded-full bg-[#EBF3FF] text-[#0066FF] flex items-center justify-center mb-2">
                  <Code2 className="w-4 h-4" />
                </div>
                <strong className="text-xs text-[#0A192F]">API Gateway</strong>
                <p className="text-[10px] text-[#64748B] mt-1 leading-snug">Gerencia integrações e roteamento</p>
              </div>

              {/* Etapa 4 */}
              <div className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] flex flex-col items-center justify-between min-h-[140px]">
                <div className="w-9 h-9 rounded-full bg-[#E6F7ED] text-[#00A854] flex items-center justify-center mb-2">
                  <Building2 className="w-4 h-4" />
                </div>
                <strong className="text-xs text-[#0A192F]">Banco Parceiro</strong>
                <p className="text-[10px] text-[#64748B] mt-1 leading-snug">Processa no ambiente bancário</p>
              </div>

              {/* Etapa 5 */}
              <div className="p-3 rounded-xl border border-[#A7E8BD] bg-[#E6F7ED] text-[#00A854] flex flex-col items-center justify-between min-h-[140px]">
                <div className="w-9 h-9 rounded-full bg-[#00A854] text-white flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <strong className="text-xs text-[#00A854]">Confirmação</strong>
                <p className="text-[10px] text-[#0A192F] mt-1 leading-snug">Retorna status em tempo real</p>
              </div>
            </div>
          </div>
        </div>

        {/* Saúde das Integrações (5 Colunas) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#0A192F]">Saúde das integrações</h3>
                <p className="text-xs text-[#64748B]">Status em tempo real das principais APIs.</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {integracoesStatus.map((api, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00A854] animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-[#0A192F]">{api.nome}</p>
                      <p className="text-[11px] text-[#64748B]">{api.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#0A192F]">{api.latencia}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F7ED] text-[#00A854]">
                      ● {api.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: OPERAÇÕES RECENTES (8 COLUNAS) + SEGURANÇA E CONFORMIDADE (4 COLUNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela de Operações Recentes (8 Colunas) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
            <div>
              <h3 className="text-base font-black text-[#0A192F]">Operações recentes</h3>
              <p className="text-xs text-[#64748B]">Últimas transações processadas pela plataforma.</p>
            </div>
            <span className="text-xs font-bold text-[#0066FF] cursor-pointer hover:underline">
              Ver todas as operações →
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2EBE4] text-[#64748B] font-semibold text-[11px]">
                  <th className="pb-3">Data e hora</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3 text-right">Valor</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Canal</th>
                  <th className="pb-3">ID da operação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE4]/60 font-medium">
                {operacoesRecentes.map((op, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFD] transition-colors">
                    <td className="py-3 text-[#64748B] font-mono text-[11px] whitespace-nowrap">{op.data}</td>
                    <td className="py-3 font-bold text-[#0A192F]">{op.tipo}</td>
                    <td className="py-3 text-[#0A192F]">{op.cliente}</td>
                    <td className="py-3 text-right font-black text-[#0A192F] whitespace-nowrap">{op.valor}</td>
                    <td className="py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F7ED] text-[#00A854]">
                        ● {op.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#64748B]">{op.canal}</td>
                    <td className="py-3 text-[#64748B] font-mono text-[10px]">{op.opId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Segurança e Conformidade (4 Colunas) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2EBE4]">
              <ShieldCheck className="w-5 h-5 text-[#0066FF]" />
              <h3 className="text-base font-black text-[#0A192F]">Segurança e conformidade</h3>
            </div>
            <p className="text-xs text-[#64748B] mt-1">Padrões de segurança que protegem suas operações.</p>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] space-y-1">
                <span className="text-xs font-bold text-[#0A192F] block">OAuth 2.0</span>
                <p className="text-[10px] text-[#64748B] leading-tight">Autenticação segura e autorizada</p>
              </div>

              <div className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] space-y-1">
                <span className="text-xs font-bold text-[#0A192F] block">MFA</span>
                <p className="text-[10px] text-[#64748B] leading-tight">Autenticação em dois fatores</p>
              </div>

              <div className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] space-y-1">
                <span className="text-xs font-bold text-[#0A192F] block">Criptografia</span>
                <p className="text-[10px] text-[#64748B] leading-tight">Dados protegidos em trânsito e em repouso</p>
              </div>

              <div className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] space-y-1">
                <span className="text-xs font-bold text-[#0A192F] block">Auditoria</span>
                <p className="text-[10px] text-[#64748B] leading-tight">Logs e trilhas de auditoria completos</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2EBE4] flex items-center gap-2 text-xs font-bold text-[#00A854]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Em conformidade com a LGPD, Banco Central e melhores práticas do mercado.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
