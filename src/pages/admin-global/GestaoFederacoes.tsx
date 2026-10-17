import { useState } from 'react';
import { Building, Search, Plus, Filter, MoreVertical, Edit2, ShieldOff, CheckCircle2, Building2, Download, ShieldCheck } from 'lucide-react';

export default function GestaoFederacoes() {
  const [federacoes] = useState([
    { id: 1, nome: 'Federação Sul de Habitação', cnpj: '11.111.111/0001-11', status: 'ATIVO', totalAssociacoes: 4, vidas: 1450, regiao: 'Região Sul', ultimaAtividade: 'Hoje, 09:41' },
    { id: 2, nome: 'Federação Nordeste de Moradia', cnpj: '22.222.222/0001-22', status: 'ATIVO', totalAssociacoes: 8, vidas: 3210, regiao: 'Região Nordeste', ultimaAtividade: 'Ontem, 15:30' },
    { id: 3, nome: 'Federação Sudeste Habitacional', cnpj: '33.333.333/0001-33', status: 'BLOQUEADO', totalAssociacoes: 12, vidas: 5890, regiao: 'Região Sudeste', ultimaAtividade: '15/08/2026' },
  ]);

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Governança de Federações
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Gestão das Federações da Rede
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cadastro, auditoria e controle de polos regionais master vinculados ao ecossistema.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exportando cadastro completo das Federações')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-[#EC0000]" /> Exportar Relatório
          </button>
          <button
            onClick={() => alert('Abrindo formulário de cadastro de nova Federação')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#EC0000] hover:bg-[#CC0000] rounded-xl transition-all shadow-md shadow-red-600/20"
          >
            <Plus className="h-4 w-4" /> Nova Federação
          </button>
        </div>
      </div>

      {/* Tabela Bancária de Federações */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-[#F4F6F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome da federação ou CNPJ..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs focus:border-[#EC0000] focus:ring-2 focus:ring-red-500/10 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filtros
            </button>
            <span className="text-[11px] font-bold text-slate-400">Total: 3 federações</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8FAFC] text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Federação & Polo</th>
                <th className="px-6 py-4">CNPJ Homologado</th>
                <th className="px-6 py-4">Associações</th>
                <th className="px-6 py-4">Vidas / Famílias</th>
                <th className="px-6 py-4">Status RLS</th>
                <th className="px-6 py-4">Última Atividade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {federacoes.map((fed) => (
                <tr key={fed.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-red-50 text-[#EC0000] rounded-xl border border-red-100">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{fed.nome}</p>
                        <p className="text-[11px] text-slate-400">{fed.regiao}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-700">{fed.cnpj}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-lg">
                      {fed.totalAssociacoes} entidades
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {fed.vidas.toLocaleString('pt-BR')} famílias
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      fed.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {fed.status === 'ATIVO' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
                      {fed.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-medium">{fed.ultimaAtividade}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => alert(`Editando ${fed.nome}`)}
                        className="p-2 text-slate-400 hover:text-[#EC0000] hover:bg-red-50 rounded-xl transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert(`Opções avançadas de governança para ${fed.nome}`)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Opções"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-[#F4F6F9] text-xs text-slate-500 flex justify-between items-center">
          <span>Mostrando 3 de 3 federações homologadas no Banco Central / OCB</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
