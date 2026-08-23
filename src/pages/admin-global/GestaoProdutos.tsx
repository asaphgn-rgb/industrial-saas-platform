import { useState } from 'react';
import { Package, Search, Plus, Filter, MoreVertical, Edit2, TrendingUp, Key } from 'lucide-react';

export default function GestaoProdutos() {
  const [produtos] = useState([
    { id: 1, nome: 'Residencial Diamante Azul', tipo: 'APARTAMENTO', cidade: 'São Paulo/SP', vg: 'R$ 45.000.000', status: 'DISPONIVEL', unidades: 120 },
    { id: 2, nome: 'Condomínio Safira', tipo: 'CASA', cidade: 'Campinas/SP', vg: 'R$ 12.500.000', status: 'LANCAMENTO', unidades: 45 },
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamond-950">Gestão de Produtos</h2>
          <p className="text-sm text-diamond-400 mt-1">Cadastro e controle de empreendimentos habitacionais.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-diamond-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="h-4 w-4" /> Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-diamond-500 rounded-lg hover:bg-diamond-600 transition-colors shadow-sm shadow-blue-500/20">
            <Plus className="h-4 w-4" /> Novo Produto
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Produtos</p>
            <p className="text-2xl font-bold text-diamond-950">24</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">VGV Potencial</p>
            <p className="text-2xl font-bold text-diamond-950">R$ 180 Milhões</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Key className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Unidades Disponíveis</p>
            <p className="text-2xl font-bold text-diamond-950">845</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome do empreendimento..." 
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-diamond-500 focus:ring-2 focus:ring-diamond-500/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Empreendimento</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold">Localização</th>
                <th className="px-6 py-4 font-semibold">VGV</th>
                <th className="px-6 py-4 font-semibold">Unidades</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {produtos.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-diamond-950">{prod.nome}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{prod.tipo}</td>
                  <td className="px-6 py-4">{prod.cidade}</td>
                  <td className="px-6 py-4 font-medium text-diamond-950">{prod.vg}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-md">
                      {prod.unidades}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      prod.status === 'DISPONIVEL' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
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
      </div>
    </div>
  );
}
