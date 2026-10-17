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
  ExternalLink,
  Flame,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { EstabelecimentoParceiro } from '@/types/cartao';

export default function RedeParceiros() {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');

  const [parceiros] = useState<EstabelecimentoParceiro[]>([
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
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Santander Corporate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Rede de Estabelecimentos Credenciados
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Rede Credenciada & Convênios Santander Diamond
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestão de comércios credenciados com captura de taxas MDR contratuais e retorno em cashback habitacional.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exportando tabela de comércios conveniados')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 text-[#EC0000]" /> Exportar Convênios
          </button>
          <button
            onClick={() => alert('Abrindo credenciamento de novo lojista parceiro')}
            className="px-4 py-2.5 rounded-xl bg-[#EC0000] hover:bg-[#CC0000] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-600/20 transition-all"
          >
            <PlusCircle className="h-4 w-4" /> Credenciar Lojista
          </button>
        </div>
      </div>

      {/* Cards de Métricas Santander Style */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Parceiros Ativos</span>
            <p className="text-3xl font-black text-slate-900 mt-1">342</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">+14 novos este mês</p>
          </div>
          <div className="p-3.5 bg-red-50 text-[#EC0000] border border-red-100 rounded-2xl">
            <Store className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cashback Médio p/ Moradia</span>
            <p className="text-3xl font-black text-[#EC0000] mt-1">4.2%</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Abatimento direto na cota</p>
          </div>
          <div className="p-3.5 bg-red-50 text-[#EC0000] border border-red-100 rounded-2xl">
            <Percent className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Volume Mensal Capturado</span>
            <p className="text-3xl font-black text-slate-900 mt-1">R$ 1.820.400</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">Liquidação automática D+1</p>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Barra de Busca e Filtro */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome fantasia, razão social ou cidade..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-[#F4F6F9] focus:bg-white focus:border-[#EC0000] focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
          />
        </div>

        <select
          value={categoriaFiltro}
          onChange={e => setCategoriaFiltro(e.target.value)}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#EC0000] w-full md:w-auto"
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
          <div key={parc.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#141414] text-[#EC0000] border border-neutral-800">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{parc.nome_fantasia}</h3>
                    <p className="text-xs text-slate-400">{parc.razao_social}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                  parc.status === 'CONVENIADO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {parc.status}
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Categoria</span>
                  <span className="font-bold text-slate-800">{parc.categoria}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Localização</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#EC0000]" /> {parc.cidade}/{parc.estado}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Cashback ao Mutuário</span>
                  <span className="font-black text-[#EC0000] text-sm">{parc.desconto_cashback_pct}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">CNPJ Homologado</span>
                  <span className="font-mono text-slate-600">{parc.cnpj_mascarado}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Volume Mensal: <strong className="text-slate-900 font-black">R$ {parc.volume_transacionado_mes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </span>
              <button
                onClick={() => alert(`Visualizando contrato de credenciamento do lojista ${parc.nome_fantasia}`)}
                className="text-[#EC0000] hover:underline font-bold flex items-center gap-1 transition-colors"
              >
                Ver Contrato <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
