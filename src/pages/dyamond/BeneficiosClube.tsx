import { useState } from 'react';
import {
  Gift,
  Building2,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  Heart,
  Pill,
  GraduationCap,
  Sparkles,
  Plane,
  Shield,
  User,
  Users,
  ChevronRight,
  ExternalLink,
  Plus,
  Compass,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function BeneficiosClube() {
  const [busca, setBusca] = useState('');

  const kpis = [
    { title: 'Rede credenciada', value: '318', sub: 'parceiros ativos', icon: Building2, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
    { title: 'Economia gerada', value: 'R$ 214 mil', sub: 'em 12 meses', icon: DollarSign, bg: 'bg-[#E6F7ED]', color: 'text-[#00A854]' },
    { title: 'Utilização mensal', value: '64%', sub: 'dos beneficiários', icon: TrendingUp, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
  ];

  const categorias = [
    { nome: 'Saúde', parceiros: '112 parceiros ativos', desc: 'Consultas, exames e bem-estar', icon: Heart, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
    { nome: 'Farmácia', parceiros: '76 parceiros ativos', desc: 'Medicamentos e descontos', icon: Pill, bg: 'bg-[#E6F7ED]', color: 'text-[#00A854]' },
    { nome: 'Educação', parceiros: '54 parceiros ativos', desc: 'Cursos, idiomas e capacitação', icon: GraduationCap, bg: 'bg-[#FEF3C7]', color: 'text-[#D97706]' },
    { nome: 'Lazer', parceiros: '48 parceiros ativos', desc: 'Cinema, parques e entretenimento', icon: Sparkles, bg: 'bg-[#F3E8FF]', color: 'text-[#9333EA]' },
    { nome: 'Assistência', parceiros: '62 parceiros ativos', desc: 'Residencial, automotiva e pessoal', icon: Shield, bg: 'bg-[#FFE4E6]', color: 'text-[#E11D48]' },
    { nome: 'Viagens', parceiros: '36 parceiros ativos', desc: 'Hotéis, passagens e experiências', icon: Plane, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
  ];

  const solicitacoesRecentes = [
    { data: '14/04/2026', cliente: 'Ricardo Costa', beneficio: 'Farmácia', status: 'Aprovada', canal: 'Portal' },
    { data: '12/04/2026', cliente: 'Juliana Mendes', beneficio: 'Saúde', status: 'Em análise', canal: 'Atendimento' },
    { data: '10/04/2026', cliente: 'Carlos Silva', beneficio: 'Lazer', status: 'Aprovada', canal: 'App' },
    { data: '09/04/2026', cliente: 'Fernanda Alves', beneficio: 'Educação', status: 'Aprovada', canal: 'Portal' },
  ];

  const dadosUso = [
    { mes: 'Jan', uso: 20 },
    { mes: 'Fev', uso: 32 },
    { mes: 'Mar', uso: 30 },
    { mes: 'Abr', uso: 42 },
    { mes: 'Mai', uso: 48 },
    { mes: 'Jun', uso: 45 },
    { mes: 'Jul', uso: 52 },
    { mes: 'Ago', uso: 55 },
    { mes: 'Set', uso: 60 },
    { mes: 'Out', uso: 62 },
    { mes: 'Nov', uso: 58 },
    { mes: 'Dez', uso: 64 },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight font-sans">
            Benefícios
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Gestão de planos, elegibilidade, utilização e rede credenciada.
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-xs text-[#64748B] block">Cuidar de pessoas</span>
          <span className="text-xs font-bold text-[#0A192F]">também é um grande negócio.</span>
        </div>
      </div>

      {/* HERO BANNER CLUBE DE BENEFÍCIOS DYAMOND */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003B99] via-[#0052CC] to-[#0066FF] p-6 sm:p-7 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              PROGRAMA INSTITUCIONAL DE VANTAGENS
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Clube de Benefícios DYAMOND
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Mais saúde, bem-estar e oportunidades para o que realmente importa na vida do cooperado e sua família.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black block">1.436</span>
              <span className="text-[10px] text-white/80 uppercase font-semibold">beneficiários ativos</span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black block">87%</span>
              <span className="text-[10px] text-white/80 uppercase font-semibold">taxa de renovação</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 CARDS DE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border border-[#E2E8F4] bg-white p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#64748B]">{k.title}</span>
              <p className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">{k.value}</p>
              <p className="text-[11px] text-[#64748B]">{k.sub}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${k.bg} flex items-center justify-center shrink-0`}>
              <k.icon className={`w-6 h-6 ${k.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* GRID PRINCIPAL: CATEGORIAS + SOLICITAÇÕES + ELEGIBILIDADE LATERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA (8 COLUNAS): CATEGORIAS + TABELA + GRÁFICO */}
        <div className="lg:col-span-8 space-y-6">
          {/* Categorias de Benefícios */}
          <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
              <h3 className="text-base font-black text-[#0A192F]">Categorias de benefícios</h3>
              <span className="text-xs font-bold text-[#0066FF] cursor-pointer hover:underline">
                Ver todos os parceiros →
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categorias.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] hover:bg-white hover:border-[#0066FF] hover:shadow-xs transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center`}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0066FF] transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0A192F]">{cat.nome}</h4>
                    <p className="text-[11px] font-bold text-[#0066FF] mt-0.5">{cat.parceiros}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solicitações Recentes + Gráfico de Uso por Mês */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Solicitações Recentes (7 Colunas) */}
            <div className="md:col-span-7 rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2EBE4]">
                <h4 className="text-xs font-black uppercase text-[#0A192F]">Solicitações recentes</h4>
                <span className="text-[11px] font-bold text-[#0066FF] cursor-pointer hover:underline">Ver todas →</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2EBE4] text-[#64748B] font-semibold text-[10px]">
                      <th className="pb-2">Data</th>
                      <th className="pb-2">Cliente</th>
                      <th className="pb-2">Benefício</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2EBE4]/60 font-medium">
                    {solicitacoesRecentes.map((s, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFD]">
                        <td className="py-2.5 text-[#64748B] text-[11px] whitespace-nowrap">{s.data}</td>
                        <td className="py-2.5 font-bold text-[#0A192F]">{s.cliente}</td>
                        <td className="py-2.5 text-[#0A192F]">{s.beneficio}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            s.status === 'Aprovada' ? 'bg-[#E6F7ED] text-[#00A854]' : 'bg-[#FEF3C7] text-[#D97706]'
                          }`}>
                            ● {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráfico de Uso por Mês (5 Colunas) */}
            <div className="md:col-span-5 rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2EBE4]">
                  <h4 className="text-xs font-black uppercase text-[#0A192F]">Uso por mês</h4>
                  <span className="text-[10px] text-[#64748B]">Últimos 12 meses</span>
                </div>

                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosUso} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F9" />
                      <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#06152B', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '10px' }} />
                      <Line type="monotone" dataKey="uso" stroke="#0066FF" strokeWidth={2.5} dot={{ fill: '#0066FF', r: 2.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="pt-2 border-t border-[#E2EBE4] text-right">
                <span className="text-xs font-black text-[#0066FF]">Pico: 64% de utilização</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (4 COLUNAS): ELEGIBILIDADE DO CLIENTE */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
            <h3 className="text-base font-black text-[#0A192F]">Elegibilidade do cliente</h3>
            <span className="text-xs font-bold text-[#0066FF] cursor-pointer hover:underline">
              Alterar cliente
            </span>
          </div>

          {/* Dados do Cliente */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF3FF] text-[#0066FF] font-black text-sm flex items-center justify-center shrink-0">
              RC
            </div>
            <div>
              <p className="text-sm font-black text-[#0A192F]">Ricardo Costa</p>
              <p className="text-[10px] text-[#94A3B8] font-mono">CPF 123.456.789-00</p>
              <p className="text-[10px] text-[#64748B]">Cliente desde 03/2022</p>
            </div>
          </div>

          {/* Plano Atual */}
          <div className="p-3.5 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#94A3B8] uppercase font-bold">Plano atual</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E6F7ED] text-[#00A854]">
                ● Ativo
              </span>
            </div>
            <p className="text-xs font-bold text-[#0A192F]">DYAMOND Mais</p>
            <p className="text-[11px] text-[#64748B]">Cobertura completa com clube de benefícios</p>
            <span className="text-[10px] text-[#0066FF] font-bold cursor-pointer hover:underline block pt-1">
              Ver detalhes do plano →
            </span>
          </div>

          {/* Dependentes */}
          <div className="space-y-2 pt-2 border-t border-[#E2EBE4]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0A192F]">Dependentes (3)</span>
              <span className="text-[10px] font-bold text-[#0066FF] cursor-pointer hover:underline">Gerenciar</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { nome: 'Ana Costa', parentesco: 'Cônjuge', iniciais: 'AM' },
                { nome: 'Lucas Costa', parentesco: 'Filho', iniciais: 'LC' },
                { nome: 'Mariana Costa', parentesco: 'Filha', iniciais: 'MC' },
              ].map((dep, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#EBF3FF] text-[#0066FF] font-bold text-[10px] flex items-center justify-center">
                      {dep.iniciais}
                    </div>
                    <div>
                      <p className="font-bold text-[#0A192F] text-[11px] leading-tight">{dep.nome}</p>
                      <span className="text-[10px] text-[#64748B]">{dep.parentesco}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-[#00A854]">Ativo</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-2 pt-3 border-t border-[#E2EBE4]">
            <button
              onClick={() => alert('Liberando benefício sob demanda para o associado')}
              className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-all shadow-md shadow-[#0066FF]/20 flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" /> Liberar benefício
            </button>
            <button
              onClick={() => alert('Consultando elegibilidade completa do cliente nos birôs')}
              className="w-full py-2.5 rounded-xl border border-[#E2EBE4] bg-white hover:bg-[#F8FAFD] text-[#0A192F] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#64748B]" /> Consultar elegibilidade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
