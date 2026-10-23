import { useState } from 'react';
import {
  Wallet,
  CreditCard,
  Building2,
  Gift,
  Plus,
  ArrowRight,
  TrendingUp,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Send,
  MoreVertical,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function ProdutosOfertas() {
  const [activeTab, setActiveTab] = useState<'catalogo' | 'campanhas' | 'regras'>('catalogo');
  const [busca, setBusca] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('MEI e Microempresa');

  // 4 Cards de Produtos Principais no Topo
  const produtosPrincipais = [
    {
      id: 'p1',
      title: 'Conta & PIX',
      desc: 'Conta digital completa para empresas, com PIX, cobrança e muito mais.',
      icon: Building2,
      status: 'Ativo',
      statusColor: 'bg-[#ECFDF5] text-[#047857]',
      conversao: '24,8%',
      trend: '+ 12%',
      color: '#22396F',
    },
    {
      id: 'p2',
      title: 'Cartão DYAMOND',
      desc: 'Mais controle e limite para o seu negócio.',
      icon: CreditCard,
      status: 'Ativo',
      statusColor: 'bg-[#ECFDF5] text-[#047857]',
      conversao: '18,6%',
      trend: '+ 9%',
      color: '#22396F',
    },
    {
      id: 'p3',
      title: 'Crédito Empresarial',
      desc: 'Capital para fazer o seu negócio crescer.',
      icon: TrendingUp,
      status: 'Ativo',
      statusColor: 'bg-[#ECFDF5] text-[#047857]',
      conversao: '14,2%',
      trend: '+ 28%',
      color: '#047857',
    },
    {
      id: 'p4',
      title: 'Clube de Benefícios',
      desc: 'Vantagens exclusivas para você e sua equipe.',
      icon: Gift,
      status: 'Em expansão',
      statusColor: 'bg-[#F8FAFD] text-[#22396F]',
      conversao: '31,5%',
      trend: '+ 16%',
      color: '#FCF1D0',
    },
  ];

  // Tabela de Ofertas Ativas
  const ofertasAtivas = [
    {
      id: 'of-1',
      produto: 'Conta & PIX',
      oferta: 'Conta PJ Essencial',
      publico: 'MEI e Microempresa',
      canal: 'App, Site',
      vigencia: '01/04/2026 a 30/06/2026',
      conversao: '27,4%',
      status: 'Ativa',
      statusColor: 'bg-[#ECFDF5] text-[#047857]',
      icon: Building2,
    },
    {
      id: 'of-2',
      produto: 'Cartão DYAMOND',
      oferta: 'Cartão Empresarial',
      publico: 'PME',
      canal: 'App, Gerente',
      vigencia: '10/03/2026 a 30/06/2026',
      conversao: '16,9%',
      status: 'Ativa',
      statusColor: 'bg-[#ECFDF5] text-[#047857]',
      icon: CreditCard,
    },
    {
      id: 'of-3',
      produto: 'Crédito Empresarial',
      oferta: 'Capital de Giro',
      publico: 'PME e Corporativo',
      canal: 'Gerente, API',
      vigencia: '01/04/2026 a 31/07/2026',
      conversao: '12,8%',
      status: 'Ativa',
      statusColor: 'bg-[#ECFDF5] text-[#047857]',
      icon: TrendingUp,
    },
    {
      id: 'of-4',
      produto: 'Clube de Benefícios',
      oferta: 'Parcerias que impulsionam',
      publico: 'Todos os clientes',
      canal: 'App, E-mail',
      vigencia: '01/03/2026 a 31/12/2026',
      conversao: '33,1%',
      status: 'Ativa',
      statusColor: 'bg-[#ECFDF5] text-[#047857]',
      icon: Gift,
    },
    {
      id: 'of-5',
      produto: 'Conta & PIX',
      oferta: 'Cashback PIX',
      publico: 'Todos os clientes',
      canal: 'App, E-mail',
      vigencia: '15/04/2026 a 15/08/2026',
      conversao: '22,7%',
      status: 'Programada',
      statusColor: 'bg-[#F8FAFD] text-[#22396F]',
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#010736] tracking-tight font-sans">
            Produtos e Ofertas
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Configuração, elegibilidade e comercialização de produtos DYAMOND.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#64748B] self-start sm:self-center">
          Transformando negócios em mais possibilidades.
        </span>
      </div>

      {/* ABAS SUPERIORES */}
      <div className="flex border-b border-[#E2E8F0] gap-6 text-xs font-bold">
        {[
          { id: 'catalogo', label: 'Catálogo' },
          { id: 'campanhas', label: 'Campanhas' },
          { id: 'regras', label: 'Regras de elegibilidade' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 transition-colors relative ${
              activeTab === tab.id
                ? 'text-[#22396F] border-b-2 border-[#22396F]'
                : 'text-[#64748B] hover:text-[#010736]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 CARDS DE PRODUTOS PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {produtosPrincipais.map((prod) => (
          <div
            key={prod.id}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#22396F] text-white flex items-center justify-center">
                  <prod.icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#22396F] transition-colors" />
              </div>
              <h3 className="text-sm font-black text-[#010736]">{prod.title}</h3>
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">{prod.desc}</p>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase font-bold block">Conversão</span>
                <span className="text-xs font-black text-[#010736]">{prod.conversao}</span>
                <span className="text-[10px] text-[#047857] font-bold ml-1">{prod.trend}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${prod.statusColor}`}>
                ● {prod.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* SEÇÃO PRINCIPAL: TABELA DE OFERTAS ATIVAS + FORM CRIAR CAMPANHA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela Ofertas Ativas (8 Colunas) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-black text-[#010736]">Ofertas ativas</h3>
              <p className="text-xs text-[#64748B]">Acompanhe o desempenho das ofertas em comercialização.</p>
            </div>

            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] text-xs font-semibold text-[#64748B] outline-none">
                <option>Todos os produtos</option>
                <option>Conta & PIX</option>
                <option>Cartão DYAMOND</option>
                <option>Crédito Empresarial</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Buscar oferta..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] outline-none text-[#010736]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold text-[11px]">
                  <th className="pb-3">Produto</th>
                  <th className="pb-3">Oferta</th>
                  <th className="pb-3">Público</th>
                  <th className="pb-3">Canal</th>
                  <th className="pb-3">Vigência</th>
                  <th className="pb-3">Conversão</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/60 font-medium">
                {ofertasAtivas.map((of) => (
                  <tr key={of.id} className="hover:bg-[#F8FAFD] transition-colors">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F8FAFD] text-[#22396F] flex items-center justify-center shrink-0">
                          <of.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-[#010736]">{of.produto}</span>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-[#010736]">{of.oferta}</td>
                    <td className="py-3 text-[#64748B]">{of.publico}</td>
                    <td className="py-3 text-[#64748B] text-[11px]">{of.canal}</td>
                    <td className="py-3 text-[#64748B] text-[11px] whitespace-nowrap">{of.vigencia}</td>
                    <td className="py-3 font-bold text-[#010736]">{of.conversao}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${of.statusColor}`}>
                        ● {of.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-[#94A3B8]">
                      <span className="cursor-pointer hover:text-[#010736]">•••</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Lateral: Criar Campanha (4 Colunas) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-xl bg-[#F8FAFD] text-[#22396F] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#010736]">Criar campanha</h4>
              <p className="text-[11px] text-[#64748B]">Configure uma nova campanha e amplie resultados.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#010736] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#64748B]" /> Público-alvo
              </label>
              <select
                value={publicoAlvo}
                onChange={(e) => setPublicoAlvo(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] outline-none text-[#010736]"
              >
                <option value="MEI e Microempresa">MEI e Microempresa</option>
                <option value="PME e Corporativo">PME e Corporativo</option>
                <option value="Famílias e Associados">Famílias e Associados</option>
                <option value="Todos os clientes">Todos os clientes</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#010736] flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#64748B]" /> Produto
              </label>
              <select className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] outline-none text-[#010736]">
                <option>Conta & PIX</option>
                <option>Cartão DYAMOND</option>
                <option>Crédito Empresarial</option>
                <option>Clube de Benefícios</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="font-bold text-[#010736] block">Canais de divulgação</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'App DYAMOND', checked: true },
                  { label: 'Gerente de relacionamento', checked: true },
                  { label: 'E-mail', checked: true },
                  { label: 'Site / Portal', checked: true },
                  { label: 'SMS', checked: false },
                  { label: 'API', checked: false },
                ].map((c, i) => (
                  <label key={i} className="flex items-center gap-2 text-[11px] text-[#64748B] cursor-pointer">
                    <input type="checkbox" defaultChecked={c.checked} className="rounded text-[#22396F]" />
                    <span>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert('Campanha criada e programada com sucesso!')}
              className="w-full py-3 rounded-xl bg-[#22396F] hover:bg-[#0D1C42] text-white text-xs font-bold transition-all shadow-md shadow-[#22396F]/20 flex items-center justify-center gap-2 mt-4"
            >
              ▶ Criar campanha
            </button>
          </div>
        </div>
      </div>

      {/* SEÇÃO INFERIOR: MOTOR DE RECOMENDAÇÃO FLOWCHART */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#22396F]" />
            <h3 className="text-base font-black text-[#010736]">Motor de recomendação</h3>
            <span className="text-xs text-[#64748B]">Regras que transformam dados em oportunidades reais.</span>
          </div>
          <span className="text-xs font-bold text-[#22396F] cursor-pointer hover:underline flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> Gerenciar regras
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {[
            { step: 'Perfil do cliente', desc: 'Análise de comportamento, perfil e necessidades.', icon: Users, bg: 'bg-[#F8FAFD]', color: 'text-[#22396F]' },
            { step: 'Elegibilidade', desc: 'Verificação de regras e critérios de cada produto.', icon: ShieldCheck, bg: 'bg-[#ECFDF5]', color: 'text-[#047857]' },
            { step: 'Melhor oferta', desc: 'Seleção da oferta mais aderente com maior probabilidade.', icon: Sparkles, bg: 'bg-[#FEF3C7]', color: 'text-[#D97706]' },
            { step: 'Campanha', desc: 'Ativação automática nos canais mais eficientes.', icon: Share2, bg: 'bg-[#F3E8FF]', color: 'text-[#9333EA]' },
          ].map((flow, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] space-y-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${flow.bg} ${flow.color} flex items-center justify-center`}>
                  <flow.icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#010736]">{flow.step}</p>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">{flow.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
