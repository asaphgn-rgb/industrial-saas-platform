import { Users, Building2, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminGlobalDashboard() {
  const kpis = [
    { title: 'Total de Federações', value: '12', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Associações Ativas', value: '148', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Associados (Base)', value: '15.430', icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Pré-aprovados', value: '4.210', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Global</h2>
        <p className="text-sm text-slate-500">Visão executiva consolidada de toda a Plataforma Diamond.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{kpi.value}</p>
              </div>
              <div className={`rounded-full p-3 ${kpi.bg}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card Comercial */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-slate-800">
            <TrendingUp className="h-5 w-5 text-amber-500" /> Funil Comercial Habitacional
          </h3>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Leads / Cadastros Base</span>
                <span className="font-medium">15.430</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-slate-300 w-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Pré-aprovados (Apto a Produto)</span>
                <span className="font-medium">4.210</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Crédito a Trabalhar (Pendentes)</span>
                <span className="font-medium">8.150</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Alertas */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-slate-800">
            <AlertTriangle className="h-5 w-5 text-red-500" /> Alertas Críticos Recentes
          </h3>
          <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center bg-slate-50">
            <p className="text-sm text-slate-500">
              Conectado ao módulo de monitoramento.<br/>Nenhum alerta crítico nas últimas 24h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
