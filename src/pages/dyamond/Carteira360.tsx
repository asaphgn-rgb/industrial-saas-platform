import { useState } from 'react';
import {
  Users,
  DollarSign,
  Target,
  Database,
  Search,
  Filter,
  Download,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Phone,
  Mail,
  Edit2,
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Building2,
  Wallet
} from 'lucide-react';

export default function Carteira360() {
  const [busca, setBusca] = useState('');
  const [perfilFiltro, setPerfilFiltro] = useState('TODOS');
  const [clienteSelecionado, setClienteSelecionado] = useState<any>({
    nome: 'Mariana Costa',
    cpf: '123.456.789-00',
    email: 'mariana.costa@email.com',
    telefone: '(11) 98765-4321',
    clienteDesde: 'jan/2023',
    status: 'Ativo',
    risco: 'Risco baixo',
    engajamento: 'Alto engajamento',
    investidor: 'Moderado',
    produtos: [
      { nome: 'Conta Digital', data: 'Jan/2023', status: 'Ativo' },
      { nome: 'Cartão de Crédito', data: 'Fev/2023', status: 'Ativo' },
      { nome: 'Investimentos', data: 'Ago/2023', status: 'Ativo' },
      { nome: 'Seguro Vida', data: 'Mar/2024', status: 'Ativo' },
    ]
  });

  const kpis = [
    { title: 'Clientes ativos', value: '2.048', sub: 'vs. mês anterior', trend: '+12%', icon: Users, bg: 'bg-[#F8FAFD]', color: 'text-[#22396F]' },
    { title: 'Potencial estimado', value: 'R$ 3,2 mi', sub: 'vs. mês anterior', trend: '+18%', icon: DollarSign, bg: 'bg-[#F8FAFD]', color: 'text-[#22396F]' },
    { title: 'Novas oportunidades', value: '188', sub: 'vs. mês anterior', trend: '+25%', icon: Target, bg: 'bg-[#FEF3C7]', color: 'text-[#D97706]' },
    { title: 'Dados completos', value: '94%', sub: 'vs. mês anterior', trend: '+4 p.p.', icon: Database, bg: 'bg-[#ECFDF5]', color: 'text-[#047857]' },
  ];

  const clientes = [
    {
      id: 'c1',
      nome: 'Mariana Costa',
      cpf: '123.456.789-00',
      iniciais: 'MC',
      perfil: 'Pessoa Física',
      perfilCor: 'bg-[#F8FAFD] text-[#22396F]',
      produtos: 'Conta Digital, Cartão, Investimentos',
      status: 'Ativo',
      statusCor: 'bg-[#ECFDF5] text-[#047857]',
      proximaAcao: 'Revisão de portfólio',
      proximaData: '28/05/2026'
    },
    {
      id: 'c2',
      nome: 'Ricardo Silva',
      cpf: '987.654.321-00',
      iniciais: 'RS',
      perfil: 'Associado',
      perfilCor: 'bg-[#F3E8FF] text-[#9333EA]',
      produtos: 'Consórcio, Seguro de Vida',
      status: 'Ativo',
      statusCor: 'bg-[#ECFDF5] text-[#047857]',
      proximaAcao: 'Apresentar upgrade',
      proximaData: '27/05/2026'
    },
    {
      id: 'c3',
      nome: 'TechLog Transportes',
      cpf: '12.345.678/0001-90',
      iniciais: 'TL',
      perfil: 'Empresarial',
      perfilCor: 'bg-[#ECFDF5] text-[#047857]',
      produtos: 'Conta PJ, Antecipação, Gestão de Pagamentos',
      status: 'Em negociação',
      statusCor: 'bg-[#FEF3C7] text-[#D97706]',
      proximaAcao: 'Retorno da proposta',
      proximaData: '26/05/2026'
    },
    {
      id: 'c4',
      nome: 'Ana Ferreira',
      cpf: '321.654.987-00',
      iniciais: 'AF',
      perfil: 'Família',
      perfilCor: 'bg-[#FFE4E6] text-[#E11D48]',
      produtos: 'Cartão, Seguro, Previdência',
      status: 'Ativo',
      statusCor: 'bg-[#ECFDF5] text-[#047857]',
      proximaAcao: 'Oferecer previdência',
      proximaData: '30/05/2026'
    },
    {
      id: 'c5',
      nome: 'João Oliveira',
      cpf: '789.456.123-00',
      iniciais: 'JO',
      perfil: 'Pessoa Física',
      perfilCor: 'bg-[#F8FAFD] text-[#22396F]',
      produtos: 'Cartão, Investimentos',
      status: 'Em análise',
      statusCor: 'bg-[#F8FAFD] text-[#22396F]',
      proximaAcao: 'Aguardar documentação',
      proximaData: '29/05/2026'
    },
    {
      id: 'c6',
      nome: 'Santa Clara Alimentos',
      cpf: '98.765.432/0001-10',
      iniciais: 'SC',
      perfil: 'Empresarial',
      perfilCor: 'bg-[#ECFDF5] text-[#047857]',
      produtos: 'Crédito Empresarial, Folha de Pagamento',
      status: 'Ativo',
      statusCor: 'bg-[#ECFDF5] text-[#047857]',
      proximaAcao: 'Revisão de limite',
      proximaData: '29/05/2026'
    }
  ];

  const segmentacao = [
    { title: 'Empresarial', total: '412', pot: 'R$ 1,8 mi', trend: '↑ 14%', color: '#047857' },
    { title: 'Famílias', total: '856', pot: 'R$ 620 mil', trend: '↑ 11%', color: '#E11D48' },
    { title: 'Associados', total: '518', pot: 'R$ 450 mil', trend: '↑ 9%', color: '#9333EA' },
    { title: 'Alta oportunidade', total: '262', pot: 'R$ 1,1 mi', trend: '↑ 28%', color: '#D97706' },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#010736] tracking-tight font-sans">
            Carteira 360°
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Gestão unificada de clientes, associados e oportunidades.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#64748B] self-start sm:self-center">
          Seg, 26 de mai. de 2026
        </span>
      </div>

      {/* 4 CARDS DE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#64748B]">{k.title}</span>
              <p className="text-2xl sm:text-3xl font-black text-[#010736] tracking-tight">{k.value}</p>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-bold text-[#047857] inline-flex items-center">
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

      {/* SEÇÃO PRINCIPAL: TABELA DE CLIENTES (8 COLUNAS) + PERFIL 360° (4 COLUNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela Carteira de Clientes */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-base font-black text-[#010736]">Carteira de clientes</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Exportando carteira')}
                className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFD] text-xs font-bold text-[#010736] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Exportar
              </button>
              <select className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] outline-none">
                <option>Últimos 30 dias</option>
                <option>Últimos 90 dias</option>
                <option>Este ano</option>
              </select>
            </div>
          </div>

          {/* Filtros em linha */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, CPF/CNPJ, e-mail ou telefone"
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] outline-none text-[#010736]"
              />
            </div>
            <select
              value={perfilFiltro}
              onChange={(e) => setPerfilFiltro(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] text-[#64748B] outline-none w-full sm:w-auto"
            >
              <option value="TODOS">Todos os perfis</option>
              <option value="Pessoa Física">Pessoa Física</option>
              <option value="Empresarial">Empresarial</option>
              <option value="Associado">Associado</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold text-[11px]">
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Perfil</th>
                  <th className="pb-3">Produtos</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Próxima ação</th>
                  <th className="pb-3 w-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/60 font-medium">
                {clientes.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setClienteSelecionado({
                      nome: c.nome,
                      cpf: c.cpf,
                      email: `${c.nome.toLowerCase().replace(/ /g, '.')}@email.com`,
                      telefone: '(11) 98765-4321',
                      clienteDesde: 'jan/2023',
                      status: c.status,
                      risco: 'Risco baixo',
                      engajamento: 'Alto engajamento',
                      investidor: 'Moderado',
                      produtos: [
                        { nome: 'Conta Digital', data: 'Jan/2023', status: 'Ativo' },
                        { nome: 'Cartão de Crédito', data: 'Fev/2023', status: 'Ativo' },
                        { nome: 'Investimentos', data: 'Ago/2023', status: 'Ativo' },
                        { nome: 'Seguro Vida', data: 'Mar/2024', status: 'Ativo' },
                      ]
                    })}
                    className="hover:bg-[#F8FAFD] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#F8FAFD] text-[#22396F] font-bold text-xs flex items-center justify-center shrink-0">
                          {c.iniciais}
                        </div>
                        <div>
                          <p className="font-bold text-[#010736]">{c.nome}</p>
                          <span className="text-[10px] text-[#94A3B8] font-mono">{c.cpf}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${c.perfilCor}`}>
                        {c.perfil}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#64748B] text-[11px] max-w-xs truncate">
                      {c.produtos}
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#047857]">
                        <span className="w-2 h-2 rounded-full bg-[#047857]" /> {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#010736]">
                      <span className="block font-semibold">{c.proximaAcao}</span>
                      <span className="text-[10px] text-[#94A3B8]">{c.proximaData}</span>
                    </td>
                    <td className="py-3.5 text-right">
                      <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Lateral Perfil 360° do Cliente Selecionado */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F8FAFD] text-[#22396F] font-black text-sm flex items-center justify-center">
                MC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-[#010736]">{clienteSelecionado.nome}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#ECFDF5] text-[#047857]">
                    ● Ativo
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] font-mono">{clienteSelecionado.cpf}</p>
              </div>
            </div>
            <button className="text-xs font-bold text-[#22396F] hover:underline flex items-center gap-1">
              <Edit2 className="w-3.5 h-3.5" /> Editar
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <span className="px-2 py-1.5 rounded-xl bg-[#ECFDF5] text-[#047857] font-bold text-[10px]">
              {clienteSelecionado.risco}
            </span>
            <span className="px-2 py-1.5 rounded-xl bg-[#F8FAFD] text-[#22396F] font-bold text-[10px]">
              {clienteSelecionado.engajamento}
            </span>
            <span className="px-2 py-1.5 rounded-xl bg-[#F8FAFD] text-[#64748B] font-bold text-[10px] border border-[#E2E8F0]">
              {clienteSelecionado.investidor}
            </span>
          </div>

          {/* Produtos Contratados */}
          <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#010736]">Produtos contratados</span>
              <span className="text-[10px] font-bold text-[#22396F] cursor-pointer hover:underline">Ver todos</span>
            </div>

            <div className="space-y-2">
              {clienteSelecionado.produtos.map((p: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#22396F]">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#010736]">{p.nome}</p>
                      <p className="text-[10px] text-[#94A3B8]">{p.data}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#047857]">Ativo</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-2 gap-2">
            <button
              onClick={() => alert(`Criando oferta para ${clienteSelecionado.nome}`)}
              className="py-2.5 px-3 rounded-xl bg-[#22396F] hover:bg-[#0D1C42] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              Criar oferta
            </button>
            <button
              onClick={() => alert(`Registrando atendimento com ${clienteSelecionado.nome}`)}
              className="py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFD] text-[#010736] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              Registrar atendimento
            </button>
          </div>
        </div>
      </div>

      {/* SEÇÃO INFERIOR: SEGMENTAÇÃO DA CARTEIRA */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#010736]">Segmentação da carteira</h3>
          <span className="text-xs font-bold text-[#22396F] cursor-pointer hover:underline flex items-center gap-1">
            Ver análise completa →
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {segmentacao.map((seg, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#010736]">{seg.title}</span>
                <span className="font-bold text-[#047857] text-[11px]">{seg.trend}</span>
              </div>
              <p className="text-2xl font-black text-[#010736]">{seg.total} <span className="text-xs font-normal text-[#64748B]">clientes</span></p>
              <p className="text-[11px] text-[#64748B]"><strong>{seg.pot}</strong> de potencial</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
