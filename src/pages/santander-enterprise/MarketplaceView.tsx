import React, { useState } from 'react';
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Sparkles,
  Search,
  Filter,
  Plus,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  Building2,
  ExternalLink,
  CheckCircle2,
  Tag,
  Percent
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const MarketplaceView: React.FC = () => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const vitrineOffers = [
    {
      id: 'm1',
      category: 'Saúde',
      partner: 'SulAmérica',
      discount: 'Até 30% OFF',
      description: 'em planos de saúde e odontológicos',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
      badgeColor: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'm2',
      category: 'Educação',
      partner: 'Alura',
      discount: '20% OFF',
      description: 'em todos os cursos e formações de tecnologia',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80',
      badgeColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'm3',
      category: 'Viagens',
      partner: 'Decolar',
      discount: 'Até 15% OFF',
      description: 'em hotéis, pacotes e passagens aéreas',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
      badgeColor: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'm4',
      category: 'Casa',
      partner: 'Fast Shop',
      discount: 'Até 25% OFF',
      description: 'em eletrônicos, tecnologia e itens para casa',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&auto=format&fit=crop&q=80',
      badgeColor: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'm5',
      category: 'Serviços',
      partner: 'Localiza',
      discount: '10% OFF',
      description: 'em aluguel de carros e frotas empresariais',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80',
      badgeColor: 'bg-teal-50 text-teal-700',
    },
    {
      id: 'm6',
      category: 'Bem-estar',
      partner: 'Gympass',
      discount: 'Até 30% OFF',
      description: 'em planos de bem-estar, academias e saúde mental',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80',
      badgeColor: 'bg-rose-50 text-rose-700',
    },
  ];

  const partnersTable = [
    {
      name: 'SulAmérica',
      category: 'Saúde',
      commission: 'Até 15%',
      totalSales: 182400,
      totalCommission: 27360,
      status: 'Ativo',
    },
    {
      name: 'Alura',
      category: 'Educação',
      commission: '10%',
      totalSales: 98250,
      totalCommission: 9825,
      status: 'Ativo',
    },
    {
      name: 'Decolar',
      category: 'Viagens',
      commission: '8%',
      totalSales: 76300,
      totalCommission: 6104,
      status: 'Ativo',
    },
    {
      name: 'Fast Shop',
      category: 'Casa',
      commission: 'Até 12%',
      totalSales: 64880,
      totalCommission: 7786,
      status: 'Ativo',
    },
    {
      name: 'Localiza',
      category: 'Serviços',
      commission: '8%',
      totalSales: 52410,
      totalCommission: 4193,
      status: 'Ativo',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Marketplace DYAMOND
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Rede de parceiros, ofertas, comissões e compras coletivas.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs font-semibold text-slate-500">
            Parceiros hoje. Mais conquistas amanhã.
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ +12% <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Parceiros ativos
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">128</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ +28% <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Em vendas
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">R$ 486 mil</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ +35% <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Em cashback
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">R$ 42 mil</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              ↑ +20% <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Campanhas em andamento
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">18</p>
          </div>
        </div>
      </div>

      {/* Row 2: Vitrine de Ofertas (8 cols) + Desempenho por Categoria (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Vitrine de Ofertas (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Vitrine de ofertas</h2>
            <button
              onClick={() => alert('Visualização completa de todas as 48 ofertas ativas do marketplace.')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              Ver todas as ofertas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {vitrineOffers.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200/70 hover:border-blue-400 hover:shadow-corporate-md bg-white transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{item.partner}</span>
                  </div>

                  <div className="h-24 w-full rounded-lg overflow-hidden bg-slate-100 relative">
                    <img
                      src={item.image}
                      alt={item.partner}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900">{item.discount}</h3>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => alert(`Acessando detalhes da oferta exclusiva ${item.partner}`)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Ver oferta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desempenho por Categoria (Horizontal Bar Chart 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Desempenho por categoria</h2>
              <select className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none">
                <option>Últimos 6 meses</option>
                <option>Ano atual</option>
              </select>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                  <span>Saúde</span>
                  <strong className="text-slate-900 font-bold">R$ 186 mil</strong>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[90%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                  <span>Educação</span>
                  <strong className="text-slate-900 font-bold">R$ 98 mil</strong>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[55%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                  <span>Casa</span>
                  <strong className="text-slate-900 font-bold">R$ 76 mil</strong>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[42%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                  <span>Viagens</span>
                  <strong className="text-slate-900 font-bold">R$ 62 mil</strong>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[35%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                  <span>Serviços</span>
                  <strong className="text-slate-900 font-bold">R$ 49 mil</strong>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full w-[28%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span>0</span>
            <span>50 mil</span>
            <span>100 mil</span>
            <span>150 mil</span>
            <span>200 mil</span>
          </div>
        </div>
      </div>

      {/* Row 3: Parceiros e Comissões (8 cols) + Nova Parceria Stepper (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Parceiros e Comissões Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-base font-bold text-slate-900">Parceiros e comissões</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar parceiro ou categoria..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none"
                />
              </div>
              <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none">
                <option>Todas as categorias</option>
                <option>Saúde</option>
                <option>Educação</option>
                <option>Viagens</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-y border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Parceiro</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3">Comissão</th>
                  <th className="py-2.5 px-3">Total em vendas</th>
                  <th className="py-2.5 px-3">Total em comissões</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-2">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partnersTable.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {p.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {p.category}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">
                      {p.commission}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                      {formatCurrency(p.totalSales)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {formatCurrency(p.totalCommission)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        ● {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => alert(`Visualizando conciliação e repasse de ${p.name}`)}
                        className="text-blue-600 hover:underline font-semibold text-xs"
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nova Parceria Stepper (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Nova parceria</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Cadastre um novo parceiro e amplie as oportunidades para sua base de clientes.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Credenciar</h3>
                  <p className="text-[11px] text-slate-500">
                    Envie as informações e documentação do parceiro para validação.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Publicar oferta</h3>
                  <p className="text-[11px] text-slate-500">
                    Configure as condições, categoria e elementos da oferta no clube.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Acompanhar vendas</h3>
                  <p className="text-[11px] text-slate-500">
                    Monitore o desempenho e conversão em tempo real.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Repassar comissão</h3>
                  <p className="text-[11px] text-slate-500">
                    Concilie e repasse as comissões de forma automatizada via PIX.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => alert('Assistente de credenciamento de novo parceiro comercial aberto.')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <span>Iniciar nova parceria</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
