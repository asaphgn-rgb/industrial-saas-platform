import { Users, Building2, ShieldCheck, TrendingUp, AlertTriangle, ArrowRight, DollarSign, Award, ChevronRight, FileCheck, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminGlobalDashboard() {
  const kpis = [
    { title: 'Total de Federações', value: '12', sub: '+2 homologadas este ano', icon: Building2, color: 'text-[#EC0000]', bg: 'bg-red-50', border: 'border-red-100' },
    { title: 'Associações Ativas', value: '148', sub: 'Rede em 18 estados', icon: Users, color: 'text-slate-900', bg: 'bg-slate-100', border: 'border-slate-200' },
    { title: 'Associados (Base)', value: '15.430', sub: 'Cadastros auditados LGPD', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Crédito Pré-Aprovado', value: '4.210', sub: 'Aptos ao financiamento', icon: ShieldCheck, color: 'text-[#EC0000]', bg: 'bg-red-50', border: 'border-red-100' }
  ];

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Top Header Santander Corporate Style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Módulo Habitacional & Gestão Global
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Painel Executivo da Presidência
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Governança corporativa, esteira imobiliária e controle central da rede Morar Bem Brasil.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/simulador-santander"
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
          >
            Simulador Santander
          </Link>
          <Link
            to="/admin/espelho-vendas"
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#EC0000] hover:bg-[#CC0000] rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
          >
            Espelho de Vendas <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid de 4 KPIs Institucionais */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1.5">{kpi.title}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{kpi.value}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">{kpi.sub}</p>
              </div>
              <div className={`rounded-2xl p-3 ${kpi.bg} ${kpi.border} border`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seção 2 Colunas: Funil Comercial e Monitoramento de Risco */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card Comercial */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-[#EC0000] rounded-xl border border-red-100">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Funil da Carteira Habitacional
                  </h3>
                  <p className="text-xs text-slate-400">Conversão de famílias por estágio de habilitação</p>
                </div>
              </div>
              <Link to="/admin/crm" className="text-xs font-bold text-[#EC0000] hover:underline flex items-center gap-1">
                Ver CRM <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">1. Cadastros em Triagem</span>
                  <span className="text-slate-900">15.430 famílias (100%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-slate-800 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">2. Pré-Análise Favorável (Elegíveis)</span>
                  <span className="text-[#EC0000]">4.210 aptos (27.2%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#EC0000] w-[27.2%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">3. Documentação em Conformidade (Pasta Digital)</span>
                  <span className="text-emerald-600">2.180 aprovados (14.1%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-[14.1%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">4. Contratos Assinados & Unidade Alocada</span>
                  <span className="text-slate-900">845 contratos (5.4%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-neutral-900 w-[5.4%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>VGV Total Habilitado: <strong className="text-slate-900 font-bold">R$ 180 Milhões</strong></span>
            <Link to="/admin/contratos" className="font-bold text-[#EC0000] hover:underline">
              Gerenciar Contratos Digitais →
            </Link>
          </div>
        </div>

        {/* Card Alertas e Integridade do Barramento */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Governança, RLS & Auditoria
                  </h3>
                  <p className="text-xs text-slate-400">Proteção de dados LGPD e trilha de eventos</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                100% RLS ATIVO
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Barramento Bancário Operacional</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Conexões com serviços de esteira de crédito, geração de hashes SHA-256 e Webhooks operando sem falhas nas últimas 24h.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Isolamento Multi-Tenant Homologado</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Políticas de Row Level Security ativas em 100% das tabelas. Federações e associações visualizam estritamente seus próprios dados.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Mascaramento Ativo de Dados Sensíveis</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    CPFs, CNPJs e cartões tokenizados mascarados nas interfaces em conformidade com o Artigo 46 da LGPD.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Trilha de Auditoria Audit Trail ativa</span>
            <Link to="/admin/auditoria" className="font-bold text-slate-700 hover:text-[#EC0000] transition-colors">
              Consultar Logs de Acesso →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
