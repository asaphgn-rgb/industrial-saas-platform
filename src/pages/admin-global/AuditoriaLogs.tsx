import { useState } from 'react';
import { Search, Filter, ShieldAlert, Activity, FileText, UserCheck, Calendar } from 'lucide-react';

export default function AuditoriaLogs() {
  const [logs] = useState([
    { id: 'LOG-001', tipo: 'AUTH', acao: 'Login realizado', usuario: 'admin@morarbembrasil.com', ip: '192.168.1.100', data: '23/08/2026 14:30:22', nivel: 'INFO' },
    { id: 'LOG-002', tipo: 'SECURITY', acao: 'Bloqueio de Associação', usuario: 'ceo@morarbembrasil.com', ip: '172.16.0.45', data: '23/08/2026 11:15:00', nivel: 'CRITICAL' },
    { id: 'LOG-003', tipo: 'DATA', acao: 'Download de Pasta Digital', usuario: 'analista@federa.com', ip: '10.0.0.12', data: '22/08/2026 09:45:11', nivel: 'WARNING' },
    { id: 'LOG-004', tipo: 'SYSTEM', acao: 'Atualização de RLS Policy', usuario: 'system_admin', ip: 'localhost', data: '21/08/2026 23:59:59', nivel: 'INFO' },
  ]);

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'AUTH': return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'SECURITY': return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'DATA': return <FileText className="h-4 w-4 text-amber-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getNivelStyle = (nivel: string) => {
    switch (nivel) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARNING': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamond-950">Auditoria & Logs (LGPD)</h2>
          <p className="text-sm text-diamond-400 mt-1">Trilha imutável de eventos e acessos ao sistema.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-diamond-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Calendar className="h-4 w-4" /> Últimos 7 dias
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-diamond-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="h-4 w-4" /> Filtros Avançados
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID, usuário ou IP..." 
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-diamond-500 focus:ring-2 focus:ring-diamond-500/20 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Status do Audit Trail:</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Ativo e Gravando
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Log ID</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold">Ação Registrada</th>
                <th className="px-6 py-4 font-semibold">Usuário Responsável</th>
                <th className="px-6 py-4 font-semibold">Endereço IP</th>
                <th className="px-6 py-4 font-semibold">Data / Hora</th>
                <th className="px-6 py-4 font-semibold text-right">Nível</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[13px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400">{log.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getIcon(log.tipo)}
                      <span className="font-semibold text-slate-700">{log.tipo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-diamond-950 font-sans">{log.acao}</td>
                  <td className="px-6 py-4 text-slate-500">{log.usuario}</td>
                  <td className="px-6 py-4 text-slate-400">{log.ip}</td>
                  <td className="px-6 py-4 text-slate-500">{log.data}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex px-2 py-1 rounded text-[11px] font-bold border ${getNivelStyle(log.nivel)}`}>
                      {log.nivel}
                    </span>
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
