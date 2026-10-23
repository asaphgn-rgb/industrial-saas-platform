import { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  AlertTriangle,
  Lock,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';

export default function GovernancaControle() {
  const [busca, setBusca] = useState('');

  const kpis = [
    { title: 'Conformidade', value: '98,6%', sub: 'vs. mês anterior', trend: '+0,4 p.p.', icon: ShieldCheck, bg: 'bg-[#F8FAFD]', color: 'text-[#22396F]' },
    { title: 'Acessos revisados', value: '124', sub: 'vs. mês anterior', trend: '+18%', icon: Users, bg: 'bg-[#F8FAFD]', color: 'text-[#22396F]' },
    { title: 'Eventos auditados', value: '18.402', sub: 'vs. mês anterior', trend: '+12%', icon: FileText, bg: 'bg-[#F8FAFD]', color: 'text-[#22396F]' },
    { title: 'Riscos críticos', value: '0', sub: 'Nenhum risco em aberto', trend: 'Seguro', icon: AlertTriangle, bg: 'bg-[#ECFDF5]', color: 'text-[#047857]' },
  ];

  const pilaresGovernanca = [
    {
      titulo: 'Pessoas e acessos',
      desc: 'Identidades, perfis e responsabilidades',
      icon: Users,
      bg: 'bg-[#F8FAFD]',
      color: 'text-[#22396F]'
    },
    {
      titulo: 'Processos',
      desc: 'Políticas, controles e segregação de funções',
      icon: Sliders,
      bg: 'bg-[#F8FAFD]',
      color: 'text-[#22396F]'
    },
    {
      titulo: 'Dados e LGPD',
      desc: 'Tratamento seguro, privacidade e ciclo de vida',
      icon: Database,
      bg: 'bg-[#ECFDF5]',
      color: 'text-[#047857]'
    },
    {
      titulo: 'Segurança',
      desc: 'Monitoramento, proteção e resiliência',
      icon: ShieldCheck,
      bg: 'bg-[#FEF3C7]',
      color: 'text-[#D97706]'
    },
    {
      titulo: 'Auditoria',
      desc: 'Rastreabilidade, evidências e melhoria contínua',
      icon: FileText,
      bg: 'bg-[#FEF3C7]',
      color: 'text-[#D97706]'
    }
  ];

  const statusConformidade = [
    { area: 'LGPD', status: 'Em conformidade' },
    { area: 'KYC/PLD', status: 'Em conformidade' },
    { area: 'Política de acesso', status: 'Em conformidade' },
    { area: 'Retenção de dados', status: 'Em conformidade' },
    { area: 'Continuidade', status: 'Em conformidade' },
  ];

  const eventosAuditoria = [
    { data: '26/04/2026 10:24', usuario: 'juliana.souza', evento: 'Login no sistema', modulo: 'Autenticação', resultado: 'Sucesso', cor: 'text-[#047857]' },
    { data: '26/04/2026 09:17', usuario: 'carlos.lima', evento: 'Alteração de perfil', modulo: 'Acessos', resultado: 'Sucesso', cor: 'text-[#047857]' },
    { data: '26/04/2026 08:53', usuario: 'sistema', evento: 'Exportação de relatório', modulo: 'Relatórios', resultado: 'Sucesso', cor: 'text-[#047857]' },
    { data: '25/04/2026 18:32', usuario: 'marcos.rocha', evento: 'Criação de usuário', modulo: 'Acessos', resultado: 'Sucesso', cor: 'text-[#047857]' },
    { data: '25/04/2026 16:11', usuario: 'ana.pereira', evento: 'Tentativa de acesso inválido', modulo: 'Autenticação', resultado: 'Bloqueado', cor: 'text-[#EF4444]' },
    { data: '25/04/2026 14:27', usuario: 'sistema', evento: 'Backup de dados', modulo: 'Infraestrutura', resultado: 'Sucesso', cor: 'text-[#047857]' },
  ];

  const gestaoPerfis = [
    { perfil: 'Admin', desc: 'Acesso total à plataforma', permissoes: 'Todos os módulos' },
    { perfil: 'Comercial', desc: 'Gestão de clientes e propostas', permissoes: 'Clientes, Propostas, Ofertas' },
    { perfil: 'Atendimento', desc: 'Atendimento e suporte', permissoes: 'Clientes, Atendimentos' },
    { perfil: 'Operações', desc: 'Processamento e conciliação', permissoes: 'Operações, Financeiro' },
    { perfil: 'Auditoria', desc: 'Acesso de auditoria e consulta', permissoes: 'Relatórios, Logs' },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER DA PÁGINA */}
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#010736] tracking-tight font-sans">
          Governança
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Controles, segurança, acessos, auditoria e conformidade da operação.
        </p>
      </div>

      {/* 4 CARDS DE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#64748B]">{k.title}</span>
              <p className="text-2xl sm:text-3xl font-black text-[#010736] tracking-tight">{k.value}</p>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className={`font-bold inline-flex items-center ${k.color}`}>
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

      {/* SEÇÃO 2: GOVERNANÇA OPERACIONAL (PROCESS FLOW) + STATUS DE CONFORMIDADE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Governança operacional (8 Colunas) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-[#010736]">Governança operacional</h3>
            <p className="text-xs text-[#64748B]">Pilares integrados para uma operação segura, transparente e em conformidade.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
            {pilaresGovernanca.map((p, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] flex flex-col justify-between min-h-[130px] space-y-2">
                <div className={`w-8 h-8 rounded-lg ${p.bg} ${p.color} flex items-center justify-center`}>
                  <p.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#010736] leading-tight">{p.titulo}</p>
                  <p className="text-[10px] text-[#64748B] mt-1 leading-snug">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status de conformidade (4 Colunas) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-3">
          <div>
            <h3 className="text-base font-black text-[#010736]">Status de conformidade</h3>
            <p className="text-xs text-[#64748B]">Principais frentes regulatórias e de controle da operação.</p>
          </div>

          <div className="space-y-2 pt-1">
            {statusConformidade.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] text-xs">
                <div className="flex items-center gap-2 text-[#010736] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                  <span>{item.area}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#047857] flex items-center gap-1">
                  {item.status} <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: EVENTOS DE AUDITORIA (7 COLUNAS) + GESTÃO DE PERFIS (5 COLUNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Eventos de Auditoria */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-black text-[#010736]">Eventos de auditoria</h3>
              <p className="text-xs text-[#64748B]">Últimos registros de atividades relevantes na plataforma.</p>
            </div>
            <span className="text-xs font-bold text-[#22396F] cursor-pointer hover:underline">
              Ver todos os eventos →
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold text-[11px]">
                  <th className="pb-3">Data e hora</th>
                  <th className="pb-3">Usuário</th>
                  <th className="pb-3">Evento</th>
                  <th className="pb-3">Módulo</th>
                  <th className="pb-3 text-right">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/60 font-medium">
                {eventosAuditoria.map((ev, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFD] transition-colors">
                    <td className="py-3 text-[#64748B] font-mono text-[11px] whitespace-nowrap">{ev.data}</td>
                    <td className="py-3 font-semibold text-[#010736]">{ev.usuario}</td>
                    <td className="py-3 text-[#010736]">{ev.evento}</td>
                    <td className="py-3 text-[#64748B]">{ev.modulo}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1.5 font-bold ${ev.cor}`}>
                        ● {ev.resultado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gestão de Perfis */}
        <div className="lg:col-span-5 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-black text-[#010736]">Gestão de perfis</h3>
              <p className="text-xs text-[#64748B]">Papéis, permissões e acessos da operação.</p>
            </div>
            <span className="text-xs font-bold text-[#22396F] cursor-pointer hover:underline">
              Gerenciar perfis →
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold text-[11px]">
                  <th className="pb-3">Perfil</th>
                  <th className="pb-3">Descrição</th>
                  <th className="pb-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/60 font-medium">
                {gestaoPerfis.map((g, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFD] transition-colors">
                    <td className="py-3 font-bold text-[#010736] whitespace-nowrap">
                      {g.perfil}
                    </td>
                    <td className="py-3 text-[#64748B]">
                      <span className="block">{g.desc}</span>
                      <span className="text-[10px] text-[#94A3B8]">{g.permissoes}</span>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => alert(`Revisando acessos do perfil ${g.perfil}`)}
                        className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFD] hover:border-[#22396F] text-[#22396F] text-[11px] font-bold transition-colors"
                      >
                        Revisar acessos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
