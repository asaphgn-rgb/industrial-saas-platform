import React, { useState } from 'react';
import {
  Package,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  MoreVertical,
  Building2,
  CreditCard,
  Gift,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter,
  Users,
  Send
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const ProductsOffersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalogo' | 'campanhas' | 'regras'>('catalogo');
  const [selectedProductFilter, setSelectedProductFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Campaign
  const [targetAudience, setTargetAudience] = useState('PME e Microempresa');
  const [campaignProduct, setCampaignProduct] = useState('Conta & PIX');
  const [channels, setChannels] = useState({
    app: true,
    email: true,
    sms: false,
    manager: true,
    portal: true,
    api: false,
  });

  const offers = [
    {
      id: 'o1',
      productIcon: Building2,
      productName: 'Conta & PIX',
      offerTitle: 'Conta PJ Essencial',
      audience: 'MEI e Microempresa',
      channel: 'App, Site',
      validity: '01/04/2025 a 30/06/2025',
      conversion: '27,4%',
      status: 'Ativa',
    },
    {
      id: 'o2',
      productIcon: CreditCard,
      productName: 'Cartão DYAMOND',
      offerTitle: 'Cartão Empresarial',
      audience: 'PME',
      channel: 'App, Gerente',
      validity: '10/03/2025 a 30/06/2025',
      conversion: '16,9%',
      status: 'Ativa',
    },
    {
      id: 'o3',
      productIcon: TrendingUp,
      productName: 'Crédito Empresarial',
      offerTitle: 'Capital de Giro',
      audience: 'PME e Corporativo',
      channel: 'Gerente, API',
      validity: '01/04/2025 a 31/07/2025',
      conversion: '12,8%',
      status: 'Ativa',
    },
    {
      id: 'o4',
      productIcon: Gift,
      productName: 'Clube de Benefícios',
      offerTitle: 'Parcerias que impulsionam',
      audience: 'Todos os clientes',
      channel: 'App, E-mail',
      validity: '01/03/2025 a 31/12/2025',
      conversion: '33,1%',
      status: 'Ativa',
    },
    {
      id: 'o5',
      productIcon: Building2,
      productName: 'Conta & PIX',
      offerTitle: 'Cashback PIX',
      audience: 'Todos os clientes',
      channel: 'App, E-mail',
      validity: '15/04/2025 a 15/08/2025',
      conversion: '22,7%',
      status: 'Programada',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Produtos e Ofertas</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Configuração, elegibilidade e comercialização de produtos DYAMOND.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs font-semibold text-slate-500">
            Transformando negócios em mais possibilidades.
          </span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'catalogo', label: 'Catálogo' },
          { id: 'campanhas', label: 'Campanhas' },
          { id: 'regras', label: 'Regras de elegibilidade' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 transition-colors relative ${
              activeTab === t.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Top 4 Product Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Product 1: Conta & PIX */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate hover:shadow-corporate-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conta & PIX</h3>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Conta digital completa para empresas, com PIX, cobrança e muito mais.
              </p>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              ● Ativo
            </span>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[10px]">Conversão</span>
            <div className="text-right">
              <strong className="text-slate-900 text-sm font-black font-sans">24,8%</strong>
              <span className="text-[10px] text-emerald-600 font-bold ml-1">↑ +12%</span>
            </div>
          </div>
        </div>

        {/* Product 2: Cartão DYAMOND */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate hover:shadow-corporate-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cartão DYAMOND</h3>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Mais controle e limite para o seu negócio com bandeira internacional.
              </p>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              ● Ativo
            </span>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[10px]">Conversão</span>
            <div className="text-right">
              <strong className="text-slate-900 text-sm font-black font-sans">18,6%</strong>
              <span className="text-[10px] text-emerald-600 font-bold ml-1">↑ +9%</span>
            </div>
          </div>
        </div>

        {/* Product 3: Crédito Empresarial */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate hover:shadow-corporate-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Crédito Empresarial</h3>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Capital para fazer o seu negócio crescer com taxas competitivas.
              </p>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              ● Ativo
            </span>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[10px]">Conversão</span>
            <div className="text-right">
              <strong className="text-slate-900 text-sm font-black font-sans">14,2%</strong>
              <span className="text-[10px] text-emerald-600 font-bold ml-1">↑ +28%</span>
            </div>
          </div>
        </div>

        {/* Product 4: Clube de Benefícios */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate hover:shadow-corporate-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Clube de Benefícios</h3>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Vantagens exclusivas para você e sua equipe em saúde, lazer e consumo.
              </p>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
              ● Em expansão
            </span>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[10px]">Conversão</span>
            <div className="text-right">
              <strong className="text-slate-900 text-sm font-black font-sans">31,5%</strong>
              <span className="text-[10px] text-emerald-600 font-bold ml-1">↑ +16%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Ofertas Ativas (8 cols) + Criar Campanha Form (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Ofertas Ativas Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Ofertas ativas</h2>
                <p className="text-[11px] text-slate-500">
                  Acompanhe o desempenho das ofertas em comercialização.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedProductFilter}
                  onChange={(e) => setSelectedProductFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="all">Todos os produtos</option>
                  <option value="Conta & PIX">Conta & PIX</option>
                  <option value="Cartão DYAMOND">Cartão DYAMOND</option>
                  <option value="Crédito Empresarial">Crédito Empresarial</option>
                  <option value="Clube de Benefícios">Clube de Benefícios</option>
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar oferta..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 border-y border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Produto</th>
                    <th className="py-2.5 px-3">Oferta</th>
                    <th className="py-2.5 px-3">Público</th>
                    <th className="py-2.5 px-3">Canal</th>
                    <th className="py-2.5 px-3">Vigência</th>
                    <th className="py-2.5 px-2">Conversão</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {offers.map((item) => {
                    const Icon = item.productIcon;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-semibold text-slate-900">{item.productName}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-medium text-slate-800">
                          {item.offerTitle}
                        </td>

                        <td className="py-3 px-3 text-slate-500">
                          {item.audience}
                        </td>

                        <td className="py-3 px-3 text-slate-500">
                          {item.channel}
                        </td>

                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                          {item.validity}
                        </td>

                        <td className="py-3 px-2 font-bold text-slate-900">
                          {item.conversion}
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Ativa'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            ● {item.status}
                          </span>
                        </td>

                        <td className="py-3 px-2 text-center">
                          <button className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Criar Campanha Box (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                Criar campanha
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Configure uma nova campanha e amplie seus resultados.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Público-alvo</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option>MEI e Microempresa</option>
                  <option>PME e Corporativo</option>
                  <option>Todos os clientes associados</option>
                  <option>Famílias e Dependentes</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Produto</label>
                <select
                  value={campaignProduct}
                  onChange={(e) => setCampaignProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option>Conta & PIX</option>
                  <option>Cartão DYAMOND</option>
                  <option>Crédito Empresarial</option>
                  <option>Clube de Benefícios</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-slate-700 font-semibold block">Canais de divulgação</label>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.app}
                      onChange={(e) => setChannels({ ...channels, app: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>App DYAMOND</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.manager}
                      onChange={(e) => setChannels({ ...channels, manager: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>Gerente relação</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.email}
                      onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>E-mail</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.portal}
                      onChange={(e) => setChannels({ ...channels, portal: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>Site / Portal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.sms}
                      onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>SMS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.api}
                      onChange={(e) => setChannels({ ...channels, api: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>API</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => alert(`Campanha criada com sucesso para ${targetAudience} no produto ${campaignProduct}!`)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <span>▶ Criar campanha</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Motor de Recomendação */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Motor de recomendação</h2>
              <p className="text-[11px] text-slate-500">
                Regras que transformam dados em oportunidades reais de conversão.
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Configurações de inteligência artificial e scoring bancário abertas.')}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            Gerenciar regras <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Pipeline Step Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Perfil do cliente</h3>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                Análise de comportamento, perfil e necessidades financeiras.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Elegibilidade</h3>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                Verificação de regras de risco e critérios de cada produto.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Melhor oferta</h3>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                Seleção da oferta mais aderente com maior probabilidade.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Campanha</h3>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                Ativação automática e omnicanal nos pontos mais eficientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
