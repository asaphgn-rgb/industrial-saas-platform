import React from 'react';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Smartphone,
  CreditCard,
  Building2,
  FileText,
  Lock,
  RefreshCw,
  Users,
  Eye
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ActiveModule } from '@/components/layout/Sidebar';

interface OverviewViewProps {
  onNavigate: (module: ActiveModule) => void;
  onOpenProposal?: (code: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onOpenProposal }) => {
  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Central de Operações
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Visão unificada da carteira, vendas, benefícios e operações financeiras.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-slate-600">
            Hoje é um grande dia para gerar mais possibilidades.
          </p>
          <div className="h-0.5 w-16 bg-dyamond-gold-500 ml-auto mt-1" />
        </div>
      </div>

      {/* Row 1: 4 Top KPI Cards (Corporate Banking Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Carteira Ativa */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate hover:shadow-corporate-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              ↑ +12% <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Carteira ativa
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">
              2.048
            </p>
          </div>
        </div>

        {/* Card 2: Conversão Comercial */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate hover:shadow-corporate-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              ↑ +4,2 p.p. <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Conversão comercial
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">
              28,4%
            </p>
          </div>
        </div>

        {/* Card 3: Operações Financeiras */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate hover:shadow-corporate-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              ↑ +18% <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Operações financeiras
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">
              R$ 1,86 mi
            </p>
          </div>
        </div>

        {/* Card 4: Pendências para Ação */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate hover:shadow-corporate-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              ↑ +6 <span className="text-slate-400 font-normal">vs. ontem</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Pendências para ação
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">
              38
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Jornada do Cliente, Esteira de Produtos e Decisões */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Jornada do Cliente (Left 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900">Jornada do cliente e produtos</h2>
              <button
                onClick={() => onNavigate('portfolio360')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                Ver detalhes <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Da aquisição ao relacionamento, em uma jornada integrada.
            </p>

            {/* Step Pipeline */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-6 gap-2 relative">
                <div className="absolute top-3.5 left-3 right-3 h-0.5 bg-slate-200 -z-0" />
                {[
                  { num: 1, label: 'Aquisição', sub: 'Atrair e conquistar' },
                  { num: 2, label: 'Cadastro', sub: 'LGPD seguro' },
                  { num: 3, label: 'Perfil 360°', sub: 'Visão completa' },
                  { num: 4, label: 'Oferta', sub: 'Inteligente', active: true },
                  { num: 5, label: 'Contratação', sub: 'Processo ágil' },
                  { num: 6, label: 'Fidelização', sub: 'Pós-venda' },
                ].map((s) => (
                  <div key={s.num} className="flex flex-col items-center text-center z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        s.active
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-4 ring-blue-100'
                          : s.num < 4
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {s.num < 4 ? '✓' : s.num}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${s.active ? 'text-blue-600' : 'text-slate-700'}`}>
                      {s.label}
                    </span>
                    <span className="text-[9px] text-slate-400 hidden sm:block leading-tight mt-0.5">
                      {s.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Taxa média de passagem entre etapas:
            </span>
            <span className="font-bold text-emerald-600">82,4% de aderência</span>
          </div>
        </div>

        {/* Esteira de Produtos (Middle 3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900">Esteira de produtos</h2>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                Gerenciar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Acompanhe o status dos principais produtos.
            </p>

            <div className="mt-4 space-y-2.5">
              {[
                { title: 'Conta & PIX', sub: 'Conta digital, PIX e serviços', status: 'Ativo', statusColor: 'bg-emerald-50 text-emerald-700' },
                { title: 'Cartão DYAMOND', sub: 'Cartão físico e virtual', status: 'Em análise', statusColor: 'bg-amber-50 text-amber-700' },
                { title: 'Crédito', sub: 'Pessoal, consignado e empresarial', status: '12 oportunidades', statusColor: 'bg-blue-50 text-blue-700' },
                { title: 'Benefícios', sub: 'Vale, saúde, educação e mais', status: '1.436 ativos', statusColor: 'bg-emerald-50 text-emerald-700' },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate('products')}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{item.title}</h3>
                    <p className="text-[10px] text-slate-400">{item.sub}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decisões e Aprovações (Right 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900">Decisões e aprovações</h2>
              <button
                onClick={() => onNavigate('approvals')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                Ver fila <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Análises, regras e aprovações em um só lugar.
            </p>

            {/* Active Proposal Card */}
            <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">Proposta #DM-8421</span>
                  <p className="text-[10px] text-slate-500">Crédito Empresarial</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Aguardando banco
                </span>
              </div>

              <p className="text-lg font-black text-slate-900 font-sans">
                R$ 18.500
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigate('approvals')}
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Analisar
                </button>
                <button
                  onClick={() => onNavigate('approvals')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                  Aprovar pré-análise
                </button>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="mt-3 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-600">
                <span>Etapas da análise</span>
                <strong className="text-blue-600">76% concluído</strong>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-blue-600 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                  ✓ Documentação
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                  ✓ Análise de risco
                </span>
                <span className="text-blue-600 font-semibold">
                  • Validação bancária
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Mapa de Integrações, Ofertas Recomendadas e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Mapa de Integrações (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900">Mapa de Integrações</h2>
              <button
                onClick={() => onNavigate('finance')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                Ver integrações <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Conexões seguras para um ecossistema mais poderoso.
            </p>

            {/* Integration visual diagram */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-around">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-dyamond-navy-950 text-dyamond-gold-400 flex items-center justify-center mx-auto shadow-sm">
                  <span className="font-black text-xs">DY</span>
                </div>
                <span className="text-[10px] font-bold text-slate-700 block">DYAMOND</span>
              </div>

              <div className="flex items-center text-slate-400 text-xs">
                ••••▶
              </div>

              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block">API Gateway</span>
              </div>

              <div className="flex items-center text-slate-400 text-xs">
                ••••▶
              </div>

              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block">Banco Parceiro</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] text-slate-500 pt-3 border-t border-slate-100">
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <Lock className="w-3 h-3 text-slate-500 mx-auto mb-1" />
              <span>OAuth 2.0</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-3 h-3 text-emerald-500 mx-auto mb-1" />
              <span>MFA Ativo</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <FileText className="w-3 h-3 text-blue-500 mx-auto mb-1" />
              <span>LGPD</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-3 h-3 text-purple-500 mx-auto mb-1" />
              <span>Auditoria</span>
            </div>
          </div>
        </div>

        {/* Ofertas Recomendadas (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900">Ofertas recomendadas</h2>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                Ver todas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Com base no perfil da carteira e nas oportunidades do momento.
            </p>

            <div className="mt-3 space-y-2.5">
              {[
                { title: 'Clube de Benefícios', desc: 'Descontos exclusivos em grandes marcas', tags: ['Fidelização', 'Recorrência'] },
                { title: 'Seguro Proteção', desc: 'Mais segurança para o que importa', tags: ['Vida', 'Patrimônio'] },
                { title: 'Crédito Empresarial', desc: 'Capital para fazer o negócio crescer', tags: ['Expansão', 'Investimento'] },
              ].map((rec, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{rec.title}</h3>
                    <p className="text-[10px] text-slate-400">{rec.desc}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {rec.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.2 bg-white border border-slate-200 text-slate-500 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('products')}
                    className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-600 rounded-lg text-[10px] font-bold transition-all shrink-0"
                  >
                    Criar campanha
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas Operacionais (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900">Alertas operacionais</h2>
              <button
                onClick={() => onNavigate('governance')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Fique por dentro do que precisa da sua atenção.
            </p>

            <div className="mt-3 space-y-2.5">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Documentações pendentes</span>
                    <span className="text-[10px] text-slate-400">Hoje, 10:24</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    12 propostas com documentos incompletos aguardando envio.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Retorno da API em nível normal</span>
                    <span className="text-[10px] text-slate-400">Hoje, 09:17</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Integrações operando dentro do esperado (latência média de 124ms).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Campanha pronta para publicação</span>
                    <span className="text-[10px] text-slate-400">Hoje, 08:41</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Clube de Benefícios - Q2/2025 pronta para disparo a 2.048 clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => alert('Assistente DYAMOND Inteligente ativado. Análise de risco e portfólio em andamento.')}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
            >
              <Sparkles className="w-4 h-4 text-dyamond-gold-300" />
              <span>Assistente DYAMOND</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
