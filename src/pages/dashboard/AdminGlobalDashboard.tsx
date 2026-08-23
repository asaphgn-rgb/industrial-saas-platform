import { Users, Building2, ShieldCheck, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

export default function AdminGlobalDashboard() {
  const kpis = [
    { title: 'Total de Federações', value: '12', icon: Building2, color: 'text-diamond-500', bg: 'bg-diamond-50', border: 'border-diamond-100' },
    { title: 'Associações Ativas', value: '148', icon: Users, color: 'text-diamond-900', bg: 'bg-slate-100', border: 'border-slate-200' },
    { title: 'Associados (Base)', value: '15.430', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { title: 'Pré-aprovados', value: '4.210', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamond-950">Dashboard Global</h2>
          <p className="text-sm text-diamond-400 mt-1">Visão executiva consolidada de toda a Plataforma Diamond.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-diamond-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            Exportar PDF
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-diamond-500 rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
            Gerar Relatório
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div key={i} className={`rounded-2xl border bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group`}>
            {/* Decalque decorativo no card */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${kpi.bg} opacity-50 group-hover:scale-150 transition-transform duration-500`} />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">{kpi.title}</p>
                <p className="text-4xl font-extrabold text-diamond-950 tracking-tight">{kpi.value}</p>
              </div>
              <div className={`rounded-xl p-3 ${kpi.bg} ${kpi.border} border`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card Comercial */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="flex justify-between items-center mb-8">
            <h3 className="flex items-center gap-3 text-lg font-bold text-diamond-950">
              <div className="p-2 bg-amber-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              Funil Comercial Habitacional
            </h3>
            <button className="text-sm font-semibold text-diamond-500 flex items-center gap-1 hover:text-diamond-900 transition-colors">
              Ver Detalhes <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Leads / Cadastros Base</span>
                <span className="font-bold text-diamond-950">15.430</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-diamond-400 w-full relative">
                  <div className="absolute inset-0 bg-white/20"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Pré-aprovados (Apto a Produto)</span>
                <span className="font-bold text-diamond-950">4.210</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 relative" style={{ width: '30%' }}>
                   <div className="absolute inset-0 bg-white/20"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Crédito a Trabalhar (Pendentes)</span>
                <span className="font-bold text-diamond-950">8.150</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-amber-500 relative" style={{ width: '55%' }}>
                   <div className="absolute inset-0 bg-white/20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Alertas */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="flex items-center gap-3 text-lg font-bold text-diamond-950">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              Alertas Críticos Recentes
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-900 mb-1">Tudo operando normalmente</p>
            <p className="text-sm text-slate-500 max-w-[250px]">
              O módulo de monitoramento em tempo real não detectou anomalias nas últimas 24h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
