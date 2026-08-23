import { useState } from 'react';
import { PackageSearch, Plus, Search, Filter } from 'lucide-react';

export default function GestaoProdutos() {
  const [produtos] = useState([
    { id: 1, nome: 'Residencial Aurora', categoria: 'CASA', valor: 'R$ 180.000', status: 'PUBLICADO' },
    { id: 2, nome: 'Loteamento Sol Nascente', categoria: 'TERRENO', valor: 'R$ 45.000', status: 'PUBLICADO' },
    { id: 3, nome: 'Reforma Fácil Diamond', categoria: 'REFORMA', valor: 'R$ 20.000', status: 'PAUSADO' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gestão Global de Produtos</h2>
          <p className="text-sm text-slate-500">Administração exclusiva do catálogo de soluções habitacionais.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
          <Plus className="h-4 w-4" /> Novo Produto
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar produto por nome ou categoria..." 
            className="w-full rounded-md border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
        <button className="flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          <Filter className="h-4 w-4" /> Filtros
        </button>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-500">
          <thead className="bg-slate-50 text-xs uppercase text-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Produto</th>
              <th className="px-6 py-4 font-semibold">Categoria</th>
              <th className="px-6 py-4 font-semibold">Valor Base</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {produtos.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <PackageSearch className="h-5 w-5 text-slate-500" />
                  </div>
                  {p.nome}
                </td>
                <td className="px-6 py-4">{p.categoria}</td>
                <td className="px-6 py-4">{p.valor}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    p.status === 'PUBLICADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-amber-600 hover:text-amber-900 font-medium text-sm">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
