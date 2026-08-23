import { useState } from 'react';
import { Shield, Search, Download, Database, Key, FileText } from 'lucide-react';

export default function AuditoriaLogs() {
  const [logs] = useState([
    { id: 'log-1', data: '23/08/2026 14:32:00', ator: 'ceo@morarbembrasil.com', role: 'ADMIN_GLOBAL', acao: 'BLOQUEIO_USUARIO', alvo: 'FEDERACAO_CENTRO_OESTE', ip: '189.122.44.1' },
    { id: 'log-2', data: '23/08/2026 14:15:22', ator: 'sistema', role: 'SYSTEM', acao: 'GERAR_PRE_ANALISE', alvo: 'ASSOCIADO_4591', ip: '10.0.0.5' },
    { id: 'log-3', data: '23/08/2026 11:05:10', ator: 'joao@associacao.com', role: 'ASSOCIACAO', acao: 'UPLOAD_DOCUMENTO_RENDA', alvo: 'ASSOCIADO_112', ip: '201.55.12.99' },
    { id: 'log-4', data: '22/08/2026 09:40:00', ator: 'maria@fednorte.com', role: 'FEDERACAO', acao: 'CRIAR_ASSOCIACAO', alvo: 'ASSOC_MORADIA_DIGNA', ip: '177.34.12.3' }
  ]);

  const getActionIcon = (acao: string) => {
    if (acao.includes('BLOQUEIO')) return <Shield className="h-4 w-4 text-red-500" />;
    if (acao.includes('PRE_ANALISE')) return <Database className="h-4 w-4 text-emerald-500" />;
    if (acao.includes('LOGIN') || acao.includes('CRIAR')) return <Key className="h-4 w-4 text-blue-500" />;
    return <FileText className="h-4 w-4 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Auditoria de Segurança (Logs)</h2>
          <p className="text-sm text-slate-500">Trilha imutável de todas as ações de usuários, modificações e acessos a dados sensíveis (LGPD).</p>
        </div>
        <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Download className="h-4 w-4" /> Exportar CSV Seguro
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filtrar por ator, IP, ação ou ID alvo..." 
            className="w-full rounded-md border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
        <select className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm focus:border-amber-500 focus:ring-amber-500">
          <option>Últimas 24h</option>
          <option>Últimos 7 dias</option>
          <option>Últimos 30 dias</option>
          <option>Todo o Histórico</option>
        </select>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-900 text-xs uppercase text-slate-300">
              <tr>
                <th className="px-6 py-4 font-semibold">Data/Hora</th>
                <th className="px-6 py-4 font-semibold">Ação (Evento)</th>
                <th className="px-6 py-4 font-semibold">Ator (Quem fez)</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Alvo Modificado</th>
                <th className="px-6 py-4 font-semibold">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors font-mono text-xs">
                  <td className="px-6 py-3 whitespace-nowrap text-slate-700">{log.data}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      {getActionIcon(log.acao)}
                      {log.acao}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{log.ator}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{log.alvo}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
