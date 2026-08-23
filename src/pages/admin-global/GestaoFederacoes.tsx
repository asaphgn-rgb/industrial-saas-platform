import { useState } from 'react';
import { Plus, Search, MapPin, Building, ShieldCheck, UserCog } from 'lucide-react';

export default function GestaoFederacoes() {
  const [federacoes] = useState([
    { id: 1, nome: 'Federação Sul (FEDSUL)', presidente: 'Carlos Almeida', associacoes: 24, associados: '4.500', status: 'ATIVO', regiao: 'Região Sul' },
    { id: 2, nome: 'Federação Nordeste (FENOR)', presidente: 'Maria Lima', associacoes: 48, associados: '6.200', status: 'ATIVO', regiao: 'Região Nordeste' },
    { id: 3, nome: 'Federação Centro-Oeste (FCO)', presidente: 'João Santos', associacoes: 12, associados: '1.800', status: 'BLOQUEIO_PARCIAL', regiao: 'Centro-Oeste' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gestão de Federações</h2>
          <p className="text-sm text-slate-500">Controle hierárquico, criação e bloqueio de matrizes regionais.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 shadow-sm">
          <Plus className="h-4 w-4" /> Nova Federação
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar federação, CNPJ ou presidente..." 
          className="w-full max-w-md rounded-md border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {federacoes.map((fed) => (
          <div key={fed.id} className="rounded-xl border bg-white overflow-hidden shadow-sm flex flex-col">
            <div className={`p-4 border-b ${fed.status === 'ATIVO' ? 'bg-slate-50' : 'bg-red-50 border-red-100'}`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className={`mt-1 p-2 rounded-lg ${fed.status === 'ATIVO' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{fed.nome}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {fed.regiao}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex-1 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Presidente / Contato</p>
                <p className="text-sm text-slate-700 font-medium">{fed.presidente}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Associações</p>
                  <p className="font-bold text-slate-900">{fed.associacoes}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Associados</p>
                  <p className="font-bold text-slate-900">{fed.associados}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t bg-slate-50 p-3 flex gap-2">
              <button className="flex-1 flex justify-center items-center gap-1.5 rounded bg-white border border-slate-300 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                <UserCog className="h-4 w-4" /> Gerenciar
              </button>
              {fed.status === 'ATIVO' ? (
                <button className="flex justify-center items-center px-3 rounded bg-red-50 border border-red-200 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors">
                  Bloquear
                </button>
              ) : (
                <button className="flex justify-center items-center px-3 rounded bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
                  <ShieldCheck className="h-4 w-4 mr-1" /> Liberar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
