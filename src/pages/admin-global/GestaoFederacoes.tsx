import { useState } from 'react';
import { Building, Search, Plus, Filter, MoreVertical, Edit2, ShieldOff, CheckCircle } from 'lucide-react';

export default function GestaoFederacoes() {
  const [federacoes] = useState([
    { id: 1, nome: 'Federação Sul', cnpj: '11.111.111/0001-11', status: 'ATIVO', totalAssociacoes: 4, ultimaAtividade: 'Hoje, 09:41' },
    { id: 2, nome: 'Federação Nordeste', cnpj: '22.222.222/0001-22', status: 'ATIVO', totalAssociacoes: 8, ultimaAtividade: 'Ontem, 15:30' },
    { id: 3, nome: 'Federação Sudeste', cnpj: '33.333.333/0001-33', status: 'BLOQUEADO', totalAssociacoes: 12, ultimaAtividade: '15/08/2026' },
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamond-950">Gestão de Federações</h2>
          <p className="text-sm text-diamond-400 mt-1">Controle total sobre as entidades master do sistema.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-diamond-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="h-4 w-4" /> Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-diamond-500 rounded-lg hover:bg-diamond-600 transition-colors shadow-sm shadow-blue-500/20">
            <Plus className="h-4 w-4" /> Nova Federação
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou CNPJ..." 
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-diamond-500 focus:ring-2 focus:ring-diamond-500/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Federação</th>
                <th className="px-6 py-4 font-semibold">CNPJ</th>
                <th className="px-6 py-4 font-semibold">Associações Vinculadas</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Última Atividade</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {federacoes.map((fed) => (
                <tr key={fed.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Building className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-diamond-950">{fed.nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{fed.cnpj}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-md">
                      {fed.totalAssociacoes}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      fed.status === 'ATIVO' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {fed.status === 'ATIVO' ? <CheckCircle className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
                      {fed.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{fed.ultimaAtividade}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-diamond-600 hover:bg-diamond-50 rounded-md transition-colors" title="Editar">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-diamond-950 hover:bg-slate-100 rounded-md transition-colors" title="Opções">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 flex justify-between items-center">
          <span>Mostrando 1 a 3 de 3 registros</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 rounded border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
