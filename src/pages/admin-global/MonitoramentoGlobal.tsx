import { useState } from 'react';
import { Activity, Server, Users, Database, ArrowUpRight, ArrowDownRight, ShieldCheck, CheckCircle2, Clock, AlertTriangle, RefreshCw, Cpu, HardDrive, Wifi } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonitoramentoGlobal() {
  const [telemetria] = useState([
    { hora: '10:00', reqs: 820, latencia: 42, cpu: 28 },
    { hora: '11:00', reqs: 1140, latencia: 45, cpu: 34 },
    { hora: '12:00', reqs: 1450, latencia: 52, cpu: 48 },
    { hora: '13:00', reqs: 1280, latencia: 48, cpu: 39 },
    { hora: '14:00', reqs: 1620, latencia: 58, cpu: 52 },
    { hora: '15:00', reqs: 1890, latencia: 44, cpu: 45 },
  ]);

  const metrics = [
    { title: 'Taxa de Requisições', value: '1.890 req/s', trend: 'up', change: '+14.2%', icon: <Activity className="h-5 w-5 text-[#EC0000]" />, bg: 'bg-red-50' },
    { title: 'Latência Média da API', value: '44 ms', trend: 'down', change: '-8 ms (Ótima)', icon: <Server className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50' },
    { title: 'Sessões Concorrentes', value: '4.820 ativas', trend: 'up', change: '+18.5%', icon: <Users className="h-5 w-5 text-slate-800" />, bg: 'bg-slate-100' },
    { title: 'Carga de Banco PostgreSQL', value: '38% CPU', trend: 'down', change: 'Pool Otimizado', icon: <Database className="h-5 w-5 text-[#EC0000]" />, bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Santander Corporate */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              NOC & Telemetria em Tempo Real
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Monitoramento Global da Infraestrutura
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            SLA de alta disponibilidade (99.98%), monitoramento de barramento financeiro e telemetria de microsserviços.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Disparando teste de carga e latência no barramento bancário')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4 text-[#EC0000]" /> Teste de Carga
          </button>
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistemas Operando em Alta Performance
          </span>
        </div>
      </div>

      {/* Grid de Métricas de Infraestrutura */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl border border-slate-100 ${metric.bg}`}>
                {metric.icon}
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                {metric.change}
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{metric.title}</h3>
            <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Seção Gráfica e Status dos Serviços */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gráfico de Telemetria de Requisições */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Volumetria de Requisições & Concorrência</h3>
                <p className="text-xs text-slate-400">Throughput transacional das últimas 6 horas</p>
              </div>
              <span className="text-xs font-bold text-[#EC0000] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                Pico: 1.890 req/s
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetria}>
                  <defs>
                    <linearGradient id="corSantanderReqs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC0000" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#EC0000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="hora" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.75rem',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  />
                  <Area type="monotone" dataKey="reqs" stroke="#EC0000" strokeWidth={2.5} fillOpacity={1} fill="url(#corSantanderReqs)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 mt-4 text-xs">
            <div className="p-3 bg-[#F4F6F9] rounded-xl">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Uptime no Mês</span>
              <span className="text-slate-900 font-black text-sm">99.98%</span>
            </div>
            <div className="p-3 bg-[#F4F6F9] rounded-xl">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Erros 5xx</span>
              <span className="text-emerald-600 font-black text-sm">0.001%</span>
            </div>
            <div className="p-3 bg-[#F4F6F9] rounded-xl">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Taxa de Conexão</span>
              <span className="text-slate-900 font-black text-sm">100% Estável</span>
            </div>
          </div>
        </div>

        {/* Status dos Microsserviços e Integrações */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">Saúde dos Serviços</h3>
              <span className="text-[10px] font-bold text-slate-400">5 Serviços Ativos</span>
            </div>

            <div className="space-y-3">
              {[
                { nome: 'Supabase Auth & Sessões', lat: '32ms', status: 'Online', cor: 'bg-emerald-500' },
                { nome: 'PostgreSQL Relacional (RLS)', lat: '18ms', status: 'Online', cor: 'bg-emerald-500' },
                { nome: 'Storage Privado & VDR', lat: '65ms', status: 'Online', cor: 'bg-emerald-500' },
                { nome: 'Barramento Antifraude Bacen', lat: '42ms', status: 'Online', cor: 'bg-emerald-500' },
                { nome: 'API de Consulta de Crédito', lat: '120ms', status: 'Online', cor: 'bg-emerald-500' },
              ].map((srv, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-[#F8FAFC]">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{srv.nome}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Latência: {srv.lat}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-700">{srv.status}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${srv.cor} shadow-sm`}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 text-center">
            <p className="text-[11px] text-slate-400 font-medium">Infraestrutura em nuvem redundante com alta disponibilidade</p>
          </div>
        </div>
      </div>
    </div>
  );
}
