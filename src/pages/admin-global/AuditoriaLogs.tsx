import { useState } from 'react';
import { Search, Filter, ShieldAlert, Activity, FileText, UserCheck, Calendar, ShieldCheck, Download, Lock } from 'lucide-react';

export default function AuditoriaLogs() {
  const [logs] = useState([
    { id: 'LOG-001', tipo: 'AUTH', acao: 'Login realizado com sucesso', usuario: 'ceo@morarbembrasil.com', ip: '189.120.48.91 (Brasília/DF)', data: '17/10/2026 14:30:22', nivel: 'INFO' },
    { id: 'LOG-002', tipo: 'SECURITY', acao: 'Bloqueio preventivo antifraude', usuario: 'sistema_antifraude_bacen', ip: 'Barramento Interno', data: '17/10/2026 11:15:00', nivel: 'CRITICAL' },
    { id: 'LOG-003', tipo: 'DATA', acao: 'Download de Pasta Digital (LGPD)', usuario: 'analista.credito@caixa.gov.br', ip: '172.16.0.45', data: '16/10/2026 09:45:11', nivel: 'WARNING' },
    { id: 'LOG-004', tipo: 'SYSTEM', acao: 'Atualização de RLS Policy PostgreSQL', usuario: 'admin_global', ip: '10.0.0.1', data: '15/10/2026 23:59:59', nivel: 'INFO' },
    { id: 'LOG-005', tipo: 'AUTH', acao: 'Emissão de Cartão Virtual com CVV Dinâmico', usuario: 'associado.titular', ip: '201.88.192.4', data: '15/10/2026 18:20:14', nivel: 'INFO' },
  ]);

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'AUTH': return <UserCheck className="h-4 w-4 text-[#EC0000]" />;
      case 'SECURITY': return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case 'DATA': return <FileText className="h-4 w-4 text-amber-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getNivelStyle = (nivel: string) => {
    switch (nivel) {
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
      case 'WARNING': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Compliance & Governança LGPD
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Trilha Imutável de Auditoria (Audit Trail)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registro cronológico inalterável (padrão WORM) para conformidade com o Banco Central e Art. 37 da LGPD.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exportando relatório formal de auditoria COAF/Bacen')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-[#EC0000]" /> Exportar Dossiê
          </button>
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Audit Trail Gravando 24/7
          </div>
        </div>
      </div>

      {/* Tabela Bancária de Logs */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-[#F4F6F9] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por ID, operador, evento ou IP..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs focus:border-[#EC0000] focus:ring-2 focus:ring-red-500/10 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Calendar className="h-3.5 w-3.5 text-[#EC0000]" /> Últimos 7 dias
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filtros Avançados
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8FAFC] text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Protocolo</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Ação Auditada</th>
                <th className="px-6 py-4">Operador Responsável</th>
                <th className="px-6 py-4">Endereço IP</th>
                <th className="px-6 py-4">Data & Horário</th>
                <th className="px-6 py-4 text-right">Severidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{log.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getIcon(log.tipo)}
                      <span className="font-semibold text-slate-700">{log.tipo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{log.acao}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-[11px]">{log.usuario}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono">{log.ip}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{log.data}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getNivelStyle(log.nivel)}`}>
                      {log.nivel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-[#F4F6F9] text-xs text-slate-500 flex justify-between items-center">
          <span>Trilha certificada com Hash SHA-256 encadeado anti-adulteração</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
