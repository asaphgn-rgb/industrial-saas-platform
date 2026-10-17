import { useState } from 'react';
import {
  Store,
  Search,
  Filter,
  PlusCircle,
  Percent,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Download,
  Building2,
  ExternalLink
} from 'lucide-react';
import { EstabelecimentoParceiro } from '@/types/cartao';

export default function RedeParceiros() {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');

  const [parceiros, setParceiros] = useState<EstabelecimentoParceiro[]>([
    {
      id: 'parc-01',
      nome_fantasia: 'Supermercado Central Aliança',
      razao_social: 'Aliança Comércio de Alimentos LTDA',
      cnpj_mascarado: '12.***.***/0001-92',
      categoria: 'Alimentação & Varejo',
      cidade: 'Brasília',
      estado: 'DF',
      desconto_cashback_pct: 3.5,
      status: 'CONVENIADO',
      volume_transacionado_mes: 284500.00
    },
    {
      id: 'parc-02',
      nome_fantasia: 'Farmácia & Drogaria Popular',
      razao_social: 'Drogaria Popular Medicamentos S/A',
      cnpj_mascarado: '04.***.***/0001-18',
      categoria: 'Saúde & Farmácia',
      cidade: 'Goiânia',
      estado: 'GO',
      desconto_cashback_pct: 5.0,
      status: 'CONVENIADO',
      volume_transacionado_mes: 98400.00
    },
    {
      id: 'parc-03',
      nome_fantasia: 'Posto Petrobrás Asa Sul',
      razao_social: 'Auto Posto Alvorada Combustíveis LTDA',
      cnpj_mascarado: '01.***.***/0001-55',
      categoria: 'Combustíveis',
      cidade: 'Brasília',
      estado: 'DF',
      desconto_cashback_pct: 2.0,
      status: 'CONVENIADO',
      volume_transacionado_mes: 345000.00
    },
    {
      id: 'parc-04',
      nome_fantasia: 'Materiais de Construção MorarBem',
      razao_social: 'MB Construção e Reforma EIRELI',
      cnpj_mascarado: '33.***.***/0001-44',
      categoria: 'Construção & Reforma',
      cidade: 'Taguatinga',
      estado: 'DF',
      desconto_cashback_pct: 6.5,
      status: 'PENDENTE',
      volume_transacionado_mes: 0.00
    }
  ]);

  const parceirosFiltrados = parceiros.filter(p => {
    const matchBusca =
      p.nome_fantasia.toLowerCase().includes(busca.toLowerCase()) ||
      p.razao_social.toLowerCase().includes(busca.toLowerCase()) ||
      p.cidade.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoriaFiltro === 'TODAS' || p.categoria === categoriaFiltro;
    return matchBusca && matchCat;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Rede de Parceiros Credenciados
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Clube Diamond
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Comércios conveniados que oferecem descontos e cashback exclusivo para titulares do Cartão Diamond.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Exportar Convênios
          </button>
          <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors">
            <PlusCircle className="h-4 w-4" /> Credenciar Estabelecimento
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parceiros Ativos</span>
            <Store className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">342</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">+14 este mês</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Média de Cashback</span>
            <Percent className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">4.2%</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Economia direta ao associado</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume Mensal (Rede)</span>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">R$ 1.820.400</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Liquidação automática D+1</p>
        </div>
      </div>

      {/* Barra de Busca e Filtro */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome fantasia, razão social ou cidade..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none transition-all"
          />
        </div>

        <select
          value={categoriaFiltro}
          onChange={e => setCategoriaFiltro(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-purple-500 w-full md:w-auto"
        >
          <option value="TODAS">Todas as Categorias</option>
          <option value="Alimentação & Varejo">Alimentação & Varejo</option>
          <option value="Saúde & Farmácia">Saúde & Farmácia</option>
          <option value="Combustíveis">Combustíveis</option>
          <option value="Construção & Reforma">Construção & Reforma</option>
        </select>
      </div>

      {/* Grid de Estabelecimentos */}
      <div className="grid gap-6 sm:grid-cols-2">
        {parceirosFiltrados.map(parc => (
          <div key={parc.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{parc.nome_fantasia}</h3>
                    <p className="text-xs text-slate-400">{parc.razao_social}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  parc.status === 'CONVENIADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {parc.status}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Categoria</span>
                  <span className="font-semibold text-slate-700">{parc.categoria}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Localização</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {parc.cidade}/{parc.estado}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Cashback ao Mutuário</span>
                  <span className="font-bold text-emerald-600 text-sm">{parc.desconto_cashback_pct}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">CNPJ Mascarado</span>
                  <span className="font-mono text-slate-600">{parc.cnpj_mascarado}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Volume Mensal: <strong className="text-slate-900">R$ {parc.volume_transacionado_mes.toLocaleString('pt-BR')}</strong>
              </span>
              <button className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 transition-colors">
                Ver Contrato <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
