import { useState } from 'react';
import { Package, Search, Plus, Filter, MoreVertical, Edit2, TrendingUp, Key, Building2, Download, Eye, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GestaoProdutos() {
  const [produtos] = useState([
    { id: 1, nome: 'Residencial Diamante Sul', tipo: 'APARTAMENTO', cidade: 'Brasília/DF', vgv: 'R$ 45.000.000', status: 'DISPONIVEL', unidades: 120, unidadesLivres: 34, faixaRenda: 'Faixa 2 e 3 (MCMV / SBPE)' },
    { id: 2, nome: 'Condomínio Reserva do Parque', tipo: 'CASA EM CONDOMINIO', cidade: 'Goiânia/GO', vgv: 'R$ 28.500.000', status: 'LANCAMENTO', unidades: 85, unidadesLivres: 62, faixaRenda: 'Faixa 3 e SBPE' },
    { id: 3, nome: 'Loteamento Solar Alvorada', tipo: 'LOTE URBANIZADO', cidade: 'Luziânia/GO', vgv: 'R$ 18.200.000', status: 'DISPONIVEL', unidades: 210, unidadesLivres: 95, faixaRenda: 'Faixa 1 e 2 (Cooperativo)' },
  ]);

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Santander Corporate */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Carteira de Ativos Habitacionais
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Gestão de Empreendimentos & Produtos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Portfólio de moradias, lotes urbanizados e controle de estoque de unidades para alocação de associados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/espelho-vendas"
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Building2 className="h-4 w-4 text-[#EC0000]" /> Espelho de Vendas
          </Link>
          <button
            onClick={() => alert('Abrindo formulário de cadastro de novo empreendimento')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#EC0000] hover:bg-[#CC0000] rounded-xl transition-all shadow-md shadow-red-600/20"
          >
            <Plus className="h-4 w-4" /> Novo Empreendimento
          </button>
        </div>
      </div>

      {/* KPI Cards Santander Style */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total de Empreendimentos</p>
            <p className="text-3xl font-black text-slate-900 mt-1">24</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Em 8 polos regionais</p>
          </div>
          <div className="p-3.5 bg-red-50 text-[#EC0000] border border-red-100 rounded-2xl">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">VGV em Carteira</p>
            <p className="text-3xl font-black text-slate-900 mt-1">R$ 180 Milhões</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1">+14.5% vs ano anterior</p>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Unidades Disponíveis</p>
            <p className="text-3xl font-black text-[#EC0000] mt-1">845</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Aptas para reserva imediata</p>
          </div>
          <div className="p-3.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl">
            <Key className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-[#F4F6F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por empreendimento, tipologia ou cidade..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs focus:border-[#EC0000] focus:ring-2 focus:ring-red-500/10 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filtrar
            </button>
            <button
              onClick={() => alert('Exportando catálogo completo')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8FAFC] text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Empreendimento</th>
                <th className="px-6 py-4">Tipologia</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4">VGV Estimado</th>
                <th className="px-6 py-4">Estoque / Livres</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {produtos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-red-50 text-[#EC0000] rounded-xl border border-red-100">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{p.nome}</p>
                        <p className="text-[11px] text-slate-400">{p.faixaRenda}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg">
                      {p.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{p.cidade}</td>
                  <td className="px-6 py-4 font-black text-slate-900">{p.vgv}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{p.unidadesLivres} disponíveis</p>
                    <p className="text-[10px] text-slate-400">Total: {p.unidades} unidades</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      p.status === 'DISPONIVEL' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      <CheckCircle2 className="h-3 w-3" />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        to="/admin/espelho-vendas"
                        className="p-2 text-slate-400 hover:text-[#EC0000] hover:bg-red-50 rounded-xl transition-colors"
                        title="Ver Mapa de Unidades"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => alert(`Editando empreendimento ${p.nome}`)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert(`Opções de gestão para ${p.nome}`)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Mais opções"
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
      </div>
    </div>
  );
}
