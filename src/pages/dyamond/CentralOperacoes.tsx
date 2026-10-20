import { useState } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  CreditCard,
  Building2,
  Wallet,
  Activity,
  FileText,
  Lock,
  Compass,
  Plus,
  HeartHandshake
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

export default function CentralOperacoes() {
  const kpis = [
    { title: 'Carteira ativa', value: '2.048', sub: 'vs. mês anterior', trend: '+12%', positive: true, icon: Users, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
    { title: 'Conversão comercial', value: '28,4%', sub: 'vs. mês anterior', trend: '+4,2 p.p.', positive: true, icon: TrendingUp, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
    { title: 'Operações financeiras', value: 'R$ 1,86 mi', sub: 'vs. mês anterior', trend: '+18%', positive: true, icon: DollarSign, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
    { title: 'Pendências para ação', value: '38', sub: 'vs. ontem', trend: '+6', positive: false, icon: AlertTriangle, bg: 'bg-[#FEF3C7]', color: 'text-[#F59E0B]' },
  ];

  const jornadaEtapas = [
    { step: 1, label: 'Aquisição', desc: 'Atrair e conquistar novos clientes', icon: Users, active: false },
    { step: 2, label: 'Cadastro & Consentimento', desc: 'Dados seguros e em conformidade (LGPD)', icon: FileText, active: false },
    { step: 3, label: 'Perfil 360°', desc: 'Visão completa do cliente', icon: Activity, active: false },
    { step: 4, label: 'Oferta Inteligente', desc: 'Produtos ideais com base no perfil', icon: Sparkles, active: true },
    { step: 5, label: 'Contratação', desc: 'Processo digital e ágil', icon: CheckCircle2, active: false },
    { step: 6, label: 'Relacionamento', desc: 'Pós-venda e mais oportunidades', icon: HeartHandshake, active: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight font-sans">
            Central de Operações
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Visão unificada da carteira, vendas, benefícios e operações financeiras.
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-xs font-semibold text-[#64748B]">Hoje é um grande dia</span>
          <p className="text-xs font-bold text-[#0066FF]">para gerar mais possibilidades.</p>
        </div>
      </div>

      {/* 4 CARDS DE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border border-[#E2E8F4] bg-white p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#64748B]">{k.title}</span>
              <p className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">{k.value}</p>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className={`font-bold inline-flex items-center ${k.positive ? 'text-[#00A854]' : 'text-[#EF4444]'}`}>
                  ↑ {k.trend}
                </span>
                <span className="text-[#94A3B8]">{k.sub}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${k.bg} flex items-center justify-center shrink-0`}>
              <k.icon className={`w-6 h-6 ${k.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* SEÇÃO 2: JORNADA DO CLIENTE */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-black text-[#0A192F]">Jornada do cliente e produtos</h2>
            <p className="text-xs text-[#64748B]">Da aquisição ao relacionamento, em uma jornada integrada.</p>
          </div>
          <Link to="/carteira-360" className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1">
            Ver detalhes <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {jornadaEtapas.map((etp) => (
            <div
              key={etp.step}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[140px] ${
                etp.active
                  ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md shadow-[#0066FF]/20'
                  : 'bg-[#F8FAFD] border-[#E2E8F4] text-[#0A192F] hover:bg-white hover:border-[#0066FF]/40'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mb-2 ${
                etp.active ? 'bg-white text-[#0066FF]' : 'bg-[#EBF3FF] text-[#0066FF]'
              }`}>
                {etp.step}
              </div>
              <p className={`text-xs font-bold leading-tight ${etp.active ? 'text-white' : 'text-[#0A192F]'}`}>
                {etp.label}
              </p>
              <p className={`text-[10px] mt-1 leading-snug line-clamp-2 ${etp.active ? 'text-white/80' : 'text-[#64748B]'}`}>
                {etp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 3: ESTEIRA DE PRODUTOS + DECISÕES E APROVAÇÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Esteira de produtos (7 Colunas) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F4]">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#0A192F]">Esteira de produtos</h3>
                <p className="text-xs text-[#64748B]">Acompanhe o status dos principais produtos.</p>
              </div>
              <Link to="/produtos-ofertas" className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1">
                Gerenciar <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              {[
                { title: 'Conta & PIX', sub: 'Conta digital, PIX e serviços', status: 'Ativo', badgeBg: 'bg-[#E6F7ED]', badgeColor: 'text-[#00A854]', icon: Wallet, to: '/financeiro-api' },
                { title: 'Cartão DYAMOND', sub: 'Cartão físico e virtual', status: 'Em análise', badgeBg: 'bg-[#FEF3C7]', badgeColor: 'text-[#D97706]', icon: CreditCard, to: '/cartao' },
                { title: 'Crédito Habitacional & Pessoal', sub: 'Financiamento habitacional e capital', status: '12 oportunidades', badgeBg: 'bg-[#EBF3FF]', badgeColor: 'text-[#0066FF]', icon: DollarSign, to: '/admin/simulador-santander' },
                { title: 'Benefícios & Clube', sub: 'Vale, saúde, educação e lazer', status: '1.436 ativos', badgeBg: 'bg-[#E6F7ED]', badgeColor: 'text-[#00A854]', icon: Sparkles, to: '/beneficios' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#E2E8F4] bg-[#F8FAFD] hover:bg-white hover:border-[#0066FF] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E2EBE4] flex items-center justify-center text-[#0066FF] group-hover:scale-105 transition-transform">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0A192F]">{item.title}</p>
                      <p className="text-[11px] text-[#64748B]">{item.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.badgeBg} ${item.badgeColor}`}>
                      {item.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0066FF] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Decisões e aprovações (5 Colunas) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#0A192F]">Decisões e aprovações</h3>
                <p className="text-xs text-[#64748B]">Análises, regras e aprovações em um só lugar.</p>
              </div>
              <Link to="/aprovacoes" className="text-xs font-bold text-[#0066FF] hover:underline">
                Ver fila →
              </Link>
            </div>

            {/* Card Proposta #DM-8421 */}
            <div className="mt-4 p-4 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0A192F] block">Proposta #DM-8421</span>
                  <p className="text-[11px] text-[#64748B]">Crédito Habitacional / Empresarial</p>
                  <p className="text-base font-black text-[#0A192F] mt-1">R$ 18.500,00</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">
                  Aguardando banco
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  to="/aprovacoes"
                  className="flex-1 py-2 text-center rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Analisar
                </Link>
                <button
                  onClick={() => alert('Pré-análise aprovada')}
                  className="flex-1 py-2 text-center rounded-xl border border-[#E2EBE4] bg-white hover:bg-[#F8FAFD] text-[#0A192F] text-xs font-bold transition-all"
                >
                  Aprovar pré-análise
                </button>
              </div>
            </div>

            {/* Donut de Etapas da Análise */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E2EBE4] mt-4">
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-[#64748B] uppercase block">Etapas da análise</span>
                <div className="flex items-center gap-2 text-[#00A854] font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Documentação
                </div>
                <div className="flex items-center gap-2 text-[#00A854] font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Análise de crédito
                </div>
                <div className="flex items-center gap-2 text-[#94A3B8] text-[11px]">
                  <span className="w-3.5 h-3.5 rounded-full border border-[#CBD5E1]" /> Validação bancária
                </div>
                <div className="flex items-center gap-2 text-[#94A3B8] text-[11px]">
                  <span className="w-3.5 h-3.5 rounded-full border border-[#CBD5E1]" /> Aprovação final
                </div>
              </div>

              <div className="relative w-24 h-24 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ value: 76, fill: '#00A854' }, { value: 24, fill: '#E2E8F4' }]} dataKey="value" innerRadius={30} outerRadius={42} startAngle={90} endAngle={-270}>
                      <Cell fill="#00A854" />
                      <Cell fill="#E2E8F4" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center leading-tight">
                  <span className="text-xs font-black text-[#0A192F]">76%</span>
                  <span className="block text-[8px] text-[#64748B]">concluído</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 4: MAPA DE INTEGRAÇÕES + OFERTAS RECOMENDADAS + ALERTAS OPERACIONAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mapa de Integrações (4 Colunas) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <h3 className="text-xs font-black uppercase text-[#0A192F]">Mapa de Integrações</h3>
              <Link to="/financeiro-api" className="text-xs font-bold text-[#0066FF] hover:underline">
                Ver integrações →
              </Link>
            </div>

            {/* Diagrama de Integração: DYAMOND -> API Gateway -> Banco Parceiro */}
            <div className="py-5 flex items-center justify-between">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0A192F] text-white flex items-center justify-center text-xs font-black">
                  DY
                </div>
                <span className="text-[10px] font-bold text-[#0A192F]">DYAMOND Platform</span>
              </div>
              <span className="text-[#94A3B8] font-bold">{"····>"}</span>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0066FF] text-white flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#0A192F]">API Gateway</span>
              </div>
              <span className="text-[#94A3B8] font-bold">{"····>"}</span>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#00A854] text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#0A192F]">Banco Parceiro</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-[#E2EBE4] text-center text-[10px] font-bold text-[#64748B]">
              <div className="p-1.5 rounded-lg bg-[#F8FAFD]">OAuth 2.0</div>
              <div className="p-1.5 rounded-lg bg-[#F8FAFD]">MFA</div>
              <div className="p-1.5 rounded-lg bg-[#F8FAFD]">LGPD</div>
              <div className="p-1.5 rounded-lg bg-[#F8FAFD]">Auditoria</div>
            </div>
          </div>
        </div>

        {/* Ofertas recomendadas (4 Colunas) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <h3 className="text-xs font-black uppercase text-[#0A192F]">Ofertas recomendadas</h3>
              <Link to="/produtos-ofertas" className="text-xs font-bold text-[#0066FF] hover:underline">
                Ver todas →
              </Link>
            </div>

            <div className="space-y-3 mt-3">
              {[
                { title: 'Clube de Benefícios', sub: 'Descontos exclusivos em grandes marcas', tags: ['Fidelização', 'Recorrência'] },
                { title: 'Seguro Proteção', sub: 'Mais segurança para o que importa', tags: ['Vida', 'Patrimônio'] },
                { title: 'Crédito Habitacional & Empresarial', sub: 'Capital para fazer o seu sonho crescer', tags: ['Expansão', 'Investimento'] },
              ].map((c, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-[#0A192F]">{c.title}</p>
                      <p className="text-[10px] text-[#64748B]">{c.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex gap-1">
                      {c.tags.map((t, ti) => (
                        <span key={ti} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-[#64748B] border border-[#E2EBE4]">
                          {t}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => alert(`Campanha iniciada para ${c.title}`)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-[#0066FF] border border-[#0066FF] hover:bg-[#EBF3FF] transition-colors"
                    >
                      Criar campanha
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas operacionais (4 Colunas) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <h3 className="text-xs font-black uppercase text-[#0A192F]">Alertas operacionais</h3>
              <Link to="/governanca" className="text-xs font-bold text-[#0066FF] hover:underline">
                Ver todos →
              </Link>
            </div>

            <div className="space-y-3 mt-3">
              {[
                { title: 'Documentações pendentes', desc: '12 propostas com documentos incompletos.', time: 'Hoje, 10:24', dot: 'bg-amber-500' },
                { title: 'Retorno da API em nível normal', desc: 'Integrações operando dentro do esperado.', time: 'Hoje, 09:17', dot: 'bg-[#00A854]' },
                { title: 'Campanha pronta para publicação', desc: 'Clube de Benefícios — Q2/2026.', time: 'Hoje, 08:41', dot: 'bg-[#0066FF]' },
              ].map((al, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] flex items-start gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${al.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#0A192F] truncate">{al.title}</p>
                      <span className="text-[10px] text-[#94A3B8] shrink-0">{al.time}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{al.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2EBE4] flex items-center justify-between">
            <span className="text-xs text-[#64748B]">IA Flutuante ativa</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0066FF] text-white flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Assistente DYAMOND
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeartHandshakeIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
