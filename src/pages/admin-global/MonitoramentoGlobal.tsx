import { useState } from 'react';
import { Activity, Server, Users, Database, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

export default function MonitoramentoGlobal() {
  const [metrics] = useState([
    { title: 'Tráfego Rede (Req/s)', value: '1.240', trend: 'up', change: '+12%', icon: <Activity className="h-5 w-5" /> },
    { title: 'Uso de Banco (CPU)', value: '45%', trend: 'down', change: '-5%', icon: <Database className="h-5 w-5" /> },
    { title: 'Usuários Concorrentes', value: '8.432', trend: 'up', change: '+24%', icon: <Users className="h-5 w-5" /> },
    { title: 'Latência Média (API)', value: '142ms', trend: 'up', change: '+10ms', icon: <Server className="h-5 w-5" /> },
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamond-950">Monitoramento Realtime</h2>
          <p className="text-sm text-diamond-400 mt-1">Status de infraestrutura e performance do sistema.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistemas Operacionais
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                {metric.icon}
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold ${metric.trend === 'up' && metric.title !== 'Latência Média (API)' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {metric.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-500">{metric.title}</h3>
            <p className="text-3xl font-bold text-diamond-950 mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-soft p-6">
          <h3 className="text-lg font-bold text-diamond-950 mb-6">Gráfico de Carga (Simulado)</h3>
          <div className="h-64 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 font-medium">
            [ Área reservada para gráfico Recharts ]
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft p-6">
          <h3 className="text-lg font-bold text-diamond-950 mb-6">Status dos Serviços</h3>
          <div className="space-y-4">
            {[
              { nome: 'Auth Supabase', status: 'Online', cor: 'bg-emerald-500' },
              { nome: 'PostgreSQL DB', status: 'Online', cor: 'bg-emerald-500' },
              { nome: 'Storage Privado', status: 'Online', cor: 'bg-emerald-500' },
              { nome: 'Edge Functions', status: 'Degradado', cor: 'bg-amber-500' },
              { nome: 'API SPC/Serasa', status: 'Online', cor: 'bg-emerald-500' },
            ].map((srv, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-sm font-semibold text-slate-700">{srv.nome}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">{srv.status}</span>
                  <div className={`h-2.5 w-2.5 rounded-full ${srv.cor}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
