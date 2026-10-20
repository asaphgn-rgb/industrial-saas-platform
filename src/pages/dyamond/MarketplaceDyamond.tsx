import { useState } from 'react';
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Gift,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Percent
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function MarketplaceDyamond() {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');

  const kpis = [
    { title: 'parceiros ativos', value: '128', sub: 'vs. mês anterior', trend: '+ 12%', icon: ShoppingCart, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
    { title: 'em vendas', value: 'R$ 486 mil', sub: 'vs. mês anterior', trend: '+ 28%', icon: TrendingUp, bg: 'bg-[#E6F7ED]', color: 'text-[#00A854]' },
    { title: 'em cashback', value: 'R$ 42 mil', sub: 'vs. mês anterior', trend: '+ 35%', icon: DollarSign, bg: 'bg-[#FEF3C7]', color: 'text-[#D97706]' },
    { title: 'campanhas em andamento', value: '18', sub: 'vs. mês anterior', trend: '+ 20%', icon: Gift, bg: 'bg-[#F3E8FF]', color: 'text-[#9333EA]' },
  ];

  // Vitrine de Ofertas dos Grandes Parceiros
  const vitrineOfertas = [
    {
      id: 'of-1',
      categoria: 'Saúde',
      parceiro: 'SulAmérica',
      desconto: 'Até 30% OFF',
      sub: 'em planos de saúde',
      imagem: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'of-2',
      categoria: 'Educação',
      parceiro: 'Alura',
      desconto: '20% OFF',
      sub: 'em todos os cursos',
      imagem: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'of-3',
      categoria: 'Viagens',
      parceiro: 'Decolar',
      desconto: 'Até 15% OFF',
      sub: 'em hotéis e pacotes',
      imagem: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'of-4',
      categoria: 'Casa',
      parceiro: 'Fast Shop',
      desconto: 'Até 25% OFF',
      sub: 'em eletrônicos e itens para casa',
      imagem: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'of-5',
      categoria: 'Serviços',
      parceiro: 'Localiza',
      desconto: '10% OFF',
      sub: 'em aluguel de carros',
      imagem: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'of-6',
      categoria: 'Bem-estar',
      parceiro: 'Gympass',
      desconto: 'Até 30% OFF',
      sub: 'em planos de bem-estar',
      imagem: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Desempenho por Categoria
  const desempenhoCategorias = [
    { cat: 'Saúde', valor: 186, formatado: 'R$ 186 mil', pct: '92%', cor: '#0066FF' },
    { cat: 'Educação', valor: 98, formatado: 'R$ 98 mil', pct: '48%', cor: '#00A854' },
    { cat: 'Casa', valor: 76, formatado: 'R$ 76 mil', pct: '38%', cor: '#F59E0B' },
    { cat: 'Viagens', valor: 62, formatado: 'R$ 62 mil', pct: '31%', cor: '#9333EA' },
    { cat: 'Serviços', valor: 49, formatado: 'R$ 49 mil', pct: '24%', cor: '#64748B' },
  ];

  // Parceiros e Comissões
  const parceirosTabela = [
    { nome: 'SulAmérica', cat: 'Saúde', comissao: 'Até 15%', vendas: 'R$ 182.400', comissaoTotal: 'R$ 27.360', status: 'Ativo' },
    { nome: 'Alura', cat: 'Educação', comissao: '10%', vendas: 'R$ 98.250', comissaoTotal: 'R$ 9.825', status: 'Ativo' },
    { nome: 'Decolar', cat: 'Viagens', comissao: '8%', vendas: 'R$ 76.300', comissaoTotal: 'R$ 6.104', status: 'Ativo' },
    { nome: 'Fast Shop', cat: 'Casa', comissao: 'Até 12%', vendas: 'R$ 64.880', comissaoTotal: 'R$ 7.786', status: 'Ativo' },
    { nome: 'Localiza', cat: 'Serviços', comissao: '8%', vendas: 'R$ 52.410', comissaoTotal: 'R$ 4.193', status: 'Ativo' },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight font-sans">
            Marketplace DYAMOND
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Rede de parceiros, ofertas, comissões e compras coletivas.
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">Parceiros hoje.</span>
          <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider">Mais conquistas amanhã.</span>
        </div>
      </div>

      {/* 4 CARDS DE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border border-[#E2E8F4] bg-white p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl ${k.bg} flex items-center justify-center shrink-0`}>
              <k.icon className={`w-6 h-6 ${k.color}`} />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">{k.value}</p>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>{k.title}</span>
                <span className="text-[#00A854] font-bold">↑ {k.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SEÇÃO 2: VITRINE DE OFERTAS (8 COLUNAS) + DESEMPENHO POR CATEGORIA (4 COLUNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vitrine de Ofertas */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
            <h3 className="text-base font-black text-[#0A192F]">Vitrine de ofertas</h3>
            <span className="text-xs font-bold text-[#0066FF] cursor-pointer hover:underline">
              Ver todas as ofertas →
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vitrineOfertas.map((of) => (
              <div
                key={of.id}
                className="rounded-2xl border border-[#E2EBE4] bg-[#F8FAFD] p-4 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#EBF3FF] text-[#0066FF]">
                      {of.categoria}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#0A192F]">{of.parceiro}</h4>
                  <p className="text-base font-black text-[#0A192F] mt-1">{of.desconto}</p>
                  <p className="text-[11px] text-[#64748B] line-clamp-1">{of.sub}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E2EBE4] flex items-center justify-between">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-200">
                    <img src={of.imagem} alt={of.parceiro} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <button
                    onClick={() => alert(`Acessando oferta da ${of.parceiro}`)}
                    className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-[11px] font-bold transition-all shadow-xs"
                  >
                    Ver oferta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desempenho por Categoria (Barras Horizontais) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <h3 className="text-sm sm:text-base font-black text-[#0A192F]">Desempenho por categoria</h3>
              <select className="px-2 py-1 text-[10px] font-bold rounded-lg border border-[#E2EBE4] bg-[#F8FAFD] outline-none text-[#64748B]">
                <option>Últimos 6 meses</option>
                <option>Últimos 12 meses</option>
              </select>
            </div>

            <div className="space-y-4 pt-4">
              {desempenhoCategorias.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#0A192F]">{cat.cat}</span>
                    <strong className="text-[#0A192F] font-black">{cat.formatado}</strong>
                  </div>
                  <div className="w-full bg-[#E2E8F4] h-2.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: cat.pct, backgroundColor: cat.cor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2EBE4] flex justify-between text-xs text-[#94A3B8] font-mono">
            <span>0</span>
            <span>50 mil</span>
            <span>100 mil</span>
            <span>150 mil</span>
            <span>200 mil</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: PARCEIROS E COMISSÕES (8 COLUNAS) + FORM NOVA PARCERIA (4 COLUNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela Parceiros e Comissões */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2EBE4]">
            <h3 className="text-base font-black text-[#0A192F]">Parceiros e comissões</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Buscar parceiro ou categoria..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] outline-none text-[#0A192F]"
                />
              </div>
              <select className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] text-[#64748B] outline-none">
                <option>Todas as categorias</option>
                <option>Saúde</option>
                <option>Educação</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2EBE4] text-[#64748B] font-semibold text-[11px]">
                  <th className="pb-3">Parceiro</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3">Comissão</th>
                  <th className="pb-3 text-right">Total em vendas</th>
                  <th className="pb-3 text-right">Total em comissões</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE4]/60 font-medium">
                {parceirosTabela.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFD] transition-colors">
                    <td className="py-3 font-bold text-[#0A192F]">{p.nome}</td>
                    <td className="py-3 text-[#64748B]">{p.cat}</td>
                    <td className="py-3 text-[#0066FF] font-semibold">{p.comissao}</td>
                    <td className="py-3 text-right font-black text-[#0A192F]">{p.vendas}</td>
                    <td className="py-3 text-right font-black text-[#00A854]">{p.comissaoTotal}</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F7ED] text-[#00A854]">
                        ● {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-[#0066FF] font-bold hover:underline cursor-pointer">
                      Ver detalhes
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Lateral: Nova Parceria Stepper */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-[#0A192F]">Nova parceria</h3>
            <p className="text-xs text-[#64748B]">Cadastre um novo parceiro e amplie as oportunidades para sua base de clientes.</p>

            <div className="space-y-3.5 pt-4">
              {[
                { step: 1, title: 'Credenciar', desc: 'Envie as informações e documentação do parceiro.' },
                { step: 2, title: 'Publicar oferta', desc: 'Configure as condições, categoria e elementos da oferta.' },
                { step: 3, title: 'Acompanhar vendas', desc: 'Monitore o desempenho em tempo real.' },
                { step: 4, title: 'Repassar comissão', desc: 'Concilie e repasse as comissões de forma automatizada.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EBF3FF] text-[#0066FF] font-bold text-xs flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0A192F]">{s.title}</p>
                    <p className="text-[11px] text-[#64748B] leading-snug">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => alert('Abrindo credenciamento de novo parceiro comercial')}
            className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-all shadow-md shadow-[#0066FF]/20 mt-4"
          >
            Iniciar nova parceria
          </button>
        </div>
      </div>
    </div>
  );
}
