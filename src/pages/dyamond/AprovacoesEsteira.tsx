import { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Download,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Building2,
  DollarSign,
  Calendar,
  Eye,
  FileCheck2,
  User,
  ExternalLink
} from 'lucide-react';

export default function AprovacoesEsteira() {
  const [busca, setBusca] = useState('');
  const [produtoFiltro, setProdutoFiltro] = useState('TODOS');
  const [etapaFiltro, setEtapaFiltro] = useState('TODAS');

  const kpis = [
    { title: 'em análise', value: '48', icon: FileText, bg: 'bg-[#EBF3FF]', color: 'text-[#0066FF]' },
    { title: 'aprovadas hoje', value: '31', icon: CheckCircle2, bg: 'bg-[#E6F7ED]', color: 'text-[#00A854]' },
    { title: 'pendências', value: '9', icon: Clock, bg: 'bg-[#FEF3C7]', color: 'text-[#D97706]' },
    { title: 'Tempo médio', value: '2h18', icon: TrendingUp, bg: 'bg-[#F3E8FF]', color: 'text-[#9333EA]' },
  ];

  // Proposta selecionada no Drawer Lateral direito
  const [propostaAtiva, setPropostaAtiva] = useState<any>({
    id: '#DM-8421',
    tipo: 'Crédito Empresarial',
    subtipo: 'Capital de Giro',
    dataEnvio: '14/05/2026 às 10:24',
    clienteNome: 'Metalúrgica Horizonte LTDA',
    cnpj: '12.345.678/0001-90',
    valor: 500000.00,
    prazo: '36 meses',
    status: 'Em análise',
    etapas: [
      { nome: 'Dados cadastrais', data: 'Conferidos em 14/05/2026 às 10:28', status: 'Concluído' },
      { nome: 'Elegibilidade DYAMOND', data: 'Análise concluída', status: 'Concluído' },
      { nome: 'Documentação', data: 'Em análise pelo time de crédito', status: 'Em andamento' },
      { nome: 'Retorno bancário', data: 'Aguardando envio ao banco parceiro', status: 'Pendente' },
      { nome: 'Aprovação final', data: 'Aguardando conclusão das etapas anteriores', status: 'Pendente' },
    ],
    observacaoEtapa: 'Documentação recebida. Conferindo demonstrativos financeiros e certidões.'
  });

  const filaAprovacao = [
    {
      id: '#DM-8421',
      data: '14/05/2026 10:24',
      cliente: 'Metalúrgica Horizonte LTDA',
      doc: 'CNPJ 12.345.678/0001-90',
      produto: 'Crédito Empresarial',
      produtoSub: 'Capital de Giro',
      valor: 500000.00,
      etapa: 'Documentação',
      etapaCor: 'bg-[#EBF3FF] text-[#0066FF]',
      sla: '4h',
      status: 'Em análise',
      statusCor: 'bg-[#EBF3FF] text-[#0066FF]'
    },
    {
      id: '#DM-8419',
      data: '14/05/2026 09:10',
      cliente: 'Clínica Viva Mais LTDA',
      doc: 'CNPJ 23.456.789/0001-12',
      produto: 'Antecipação de Recebíveis',
      produtoSub: 'Recebíveis',
      valor: 120000.00,
      etapa: 'Retorno bancário',
      etapaCor: 'bg-[#FEF3C7] text-[#D97706]',
      sla: '2h',
      status: 'Pendente',
      statusCor: 'bg-[#FEF3C7] text-[#D97706]'
    },
    {
      id: '#DM-8418',
      data: '14/05/2026 08:52',
      cliente: 'Júlio César Almeida',
      doc: 'CPF 321.654.987-00',
      produto: 'Crédito Pessoal / Habitacional',
      produtoSub: 'Empréstimo',
      valor: 35000.00,
      etapa: 'Elegibilidade',
      etapaCor: 'bg-[#EBF3FF] text-[#0066FF]',
      sla: '6h',
      status: 'Em análise',
      statusCor: 'bg-[#EBF3FF] text-[#0066FF]'
    },
    {
      id: '#DM-8417',
      data: '13/05/2026 17:41',
      cliente: 'Rede Saúde Brasil LTDA',
      doc: 'CNPJ 45.678.901/0001-33',
      produto: 'Financiamento de Equipamentos',
      produtoSub: 'Bens e Equipamentos',
      valor: 1200000.00,
      etapa: 'Aprovação final',
      etapaCor: 'bg-[#FEF3C7] text-[#D97706]',
      sla: '1h',
      status: 'Em análise',
      statusCor: 'bg-[#EBF3FF] text-[#0066FF]'
    },
    {
      id: '#DM-8416',
      data: '13/05/2026 16:20',
      cliente: 'Padaria Pão da Terra LTDA',
      doc: 'CNPJ 34.567.890/0001-11',
      produto: 'Cartão Empresarial',
      produtoSub: 'Meios de Pagamento',
      valor: 80000.00,
      etapa: 'Documentação',
      etapaCor: 'bg-[#EBF3FF] text-[#0066FF]',
      sla: '8h',
      status: 'Pendente',
      statusCor: 'bg-[#FEF3C7] text-[#D97706]'
    },
    {
      id: '#DM-8415',
      data: '13/05/2026 14:03',
      cliente: 'Construtora Oliveira LTDA',
      doc: 'CNPJ 56.789.012/0001-44',
      produto: 'Crédito Empresarial / Obras',
      produtoSub: 'Obras e Engenharia',
      valor: 750000.00,
      etapa: 'Retorno bancário',
      etapaCor: 'bg-[#F3E8FF] text-[#9333EA]',
      sla: '3h',
      status: 'Em análise',
      statusCor: 'bg-[#EBF3FF] text-[#0066FF]'
    }
  ];

  const historicoDecisoes = [
    { data: '14/05/2026 10:18', proposta: '#DM-8420', acao: 'Aprovação', operador: 'Mariana Costa', resultado: 'Aprovada', resCor: 'bg-[#E6F7ED] text-[#00A854]', obs: 'Documentação conferida.' },
    { data: '14/05/2026 09:41', proposta: '#DM-8413', acao: 'Solicitou complemento', operador: 'Rafael Mendes', resultado: 'Pendente', resCor: 'bg-[#FEF3C7] text-[#D97706]', obs: 'Falta comprovante de faturamento.' },
    { data: '13/05/2026 16:27', proposta: '#DM-8409', acao: 'Reprovação', operador: 'Camila Rocha', resultado: 'Reprovada', resCor: 'bg-[#FEE2E2] text-[#EF4444]', obs: 'Risco fora da política de crédito.' },
    { data: '13/05/2026 11:03', proposta: '#DM-8401', acao: 'Aprovação', operador: 'Felipe Nogueira', resultado: 'Aprovada', resCor: 'bg-[#E6F7ED] text-[#00A854]', obs: 'Tudo conforme.' },
    { data: '12/05/2026 18:44', proposta: '#DM-8398', acao: 'Solicitou complemento', operador: 'Larissa Almeida', resultado: 'Pendente', resCor: 'bg-[#FEF3C7] text-[#D97706]', obs: 'Enviar balanço patrimonial atualizado.' },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER DA PÁGINA */}
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight font-sans">
          Aprovações
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Esteira de decisões, análise e rastreabilidade de operações.
        </p>
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
              <span className="text-xs font-semibold text-[#64748B]">{k.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* GRID PRINCIPAL: FILA DE APROVAÇÃO (8 COLUNAS) + ANÁLISE DA PROPOSTA (4 COLUNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FILA DE APROVAÇÃO (8 COLUNAS) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2EBE4] gap-3">
            <h3 className="text-base font-black text-[#0A192F]">Fila de aprovação</h3>
            <button
              onClick={() => alert('Exportando fila de aprovação')}
              className="px-3 py-1.5 rounded-xl border border-[#E2EBE4] bg-white hover:bg-[#F8FAFD] text-xs font-bold text-[#0A192F] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" /> Exportar
            </button>
          </div>

          {/* Filtros em Linha */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div className="relative sm:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar por proposta, cliente..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] outline-none text-[#0A192F]"
              />
            </div>
            <select className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] text-[#64748B] outline-none">
              <option>Todos os produtos</option>
              <option>Crédito Empresarial</option>
              <option>Antecipação de Recebíveis</option>
            </select>
            <select className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] text-[#64748B] outline-none">
              <option>Todas as etapas</option>
              <option>Documentação</option>
              <option>Retorno bancário</option>
            </select>
            <select className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] text-[#64748B] outline-none">
              <option>Todos os status</option>
              <option>Em análise</option>
              <option>Pendente</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2EBE4] text-[#64748B] font-semibold text-[11px]">
                  <th className="pb-3">Proposta</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Produto</th>
                  <th className="pb-3 text-right">Valor</th>
                  <th className="pb-3">Etapa</th>
                  <th className="pb-3">SLA</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 w-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE4]/60 font-medium">
                {filaAprovacao.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setPropostaAtiva({
                      id: item.id,
                      tipo: item.produto,
                      subtipo: item.produtoSub,
                      dataEnvio: item.data,
                      clienteNome: item.cliente,
                      cnpj: item.doc,
                      valor: item.valor,
                      prazo: '36 meses',
                      status: item.status,
                      etapas: [
                        { nome: 'Dados cadastrais', data: 'Conferidos em 14/05/2026 às 10:28', status: 'Concluído' },
                        { nome: 'Elegibilidade DYAMOND', data: 'Análise concluída', status: 'Concluído' },
                        { nome: item.etapa, data: 'Em análise pelo time de crédito', status: 'Em andamento' },
                        { nome: 'Retorno bancário', data: 'Aguardando envio ao banco parceiro', status: 'Pendente' },
                        { nome: 'Aprovação final', data: 'Aguardando conclusão das etapas anteriores', status: 'Pendente' },
                      ],
                      observacaoEtapa: 'Documentação recebida. Conferindo demonstrativos financeiros e certidões.'
                    })}
                    className="hover:bg-[#F8FAFD] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 text-[#0066FF] font-bold whitespace-nowrap">
                      {item.id}
                      <span className="block text-[10px] text-[#94A3B8] font-normal font-sans">{item.data}</span>
                    </td>
                    <td className="py-3.5 pr-2">
                      <p className="font-bold text-[#0A192F]">{item.cliente}</p>
                      <span className="text-[10px] text-[#94A3B8] font-mono">{item.doc}</span>
                    </td>
                    <td className="py-3.5 text-[#0A192F]">
                      <p className="font-semibold">{item.produto}</p>
                      <span className="text-[10px] text-[#64748B]">{item.produtoSub}</span>
                    </td>
                    <td className="py-3.5 text-right font-black text-[#0A192F] whitespace-nowrap">
                      R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.etapaCor}`}>
                        {item.etapa}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#64748B] font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" /> {item.sla}
                    </td>
                    <td className="py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.statusCor}`}>
                        {item.status}
                      </span>
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

        {/* ANÁLISE DA PROPOSTA SELECIONADA (4 COLUNAS) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between pb-3 border-b border-[#E2EBE4]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#0A192F]">{propostaAtiva.id} · {propostaAtiva.tipo}</h3>
              </div>
              <p className="text-[11px] text-[#94A3B8]">Enviada em {propostaAtiva.dataEnvio}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3FF] text-[#0066FF]">
              {propostaAtiva.status}
            </span>
          </div>

          {/* Dados do Cliente */}
          <div className="p-3.5 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] space-y-1 text-xs">
            <span className="text-[10px] text-[#94A3B8] uppercase font-bold block">Cliente Solicitante</span>
            <p className="font-bold text-[#0A192F]">{propostaAtiva.clienteNome}</p>
            <p className="text-[11px] text-[#64748B] font-mono">{propostaAtiva.cnpj}</p>
            <span className="text-[10px] text-[#0066FF] font-bold cursor-pointer hover:underline block pt-1">
              Ver dados completos →
            </span>
          </div>

          {/* Valores Solicitados */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] text-xs">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase font-bold block">Valor solicitado</span>
              <p className="text-base font-black text-[#0A192F]">
                R$ {propostaAtiva.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase font-bold block">Prazo</span>
              <p className="text-base font-black text-[#0A192F]">{propostaAtiva.prazo}</p>
            </div>
          </div>

          {/* Timeline de Etapas */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-black uppercase text-[#0A192F] block">Etapas da Esteira</span>

            <div className="space-y-3 pl-2">
              {propostaAtiva.etapas.map((etp: any, idx: number) => {
                const isDone = etp.status === 'Concluído';
                const isCurrent = etp.status === 'Em andamento';

                return (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-[#00A854] text-white'
                        : isCurrent
                        ? 'bg-[#0066FF] text-white ring-4 ring-[#0066FF]/20'
                        : 'border-2 border-[#CBD5E1] bg-white text-transparent'
                    }`}>
                      {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-[#0066FF]' : 'text-[#0A192F]'}`}>
                          {etp.nome}
                        </p>
                        <span className={`text-[9px] font-bold ${isDone ? 'text-[#00A854]' : isCurrent ? 'text-[#0066FF]' : 'text-[#94A3B8]'}`}>
                          {etp.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{etp.data}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Observações da Etapa Atual */}
          <div className="p-3 rounded-xl border border-[#E2EBE4] bg-[#F8FAFD] space-y-1 text-xs">
            <span className="text-[10px] text-[#94A3B8] uppercase font-bold block">Observações da etapa atual</span>
            <p className="text-[11px] text-[#64748B] leading-relaxed">{propostaAtiva.observacaoEtapa}</p>
          </div>

          {/* Botões de Ação da Esteira */}
          <div className="space-y-2 pt-2 border-t border-[#E2EBE4]">
            <button
              onClick={() => alert(`Solicitando complemento de documentos para ${propostaAtiva.id}`)}
              className="w-full py-2.5 rounded-xl border border-[#E2EBE4] hover:bg-[#F8FAFD] text-xs font-bold text-[#0A192F] transition-all flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-[#64748B]" /> Solicitar complemento
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => alert(`Proposta ${propostaAtiva.id} reprovada`)}
                className="py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" /> Reprovar
              </button>
              <button
                onClick={() => alert(`Pré-análise da proposta ${propostaAtiva.id} aprovada com sucesso!`)}
                className="py-2.5 rounded-xl bg-[#00A854] hover:bg-[#008f47] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Aprovar pré-análise
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HISTÓRICO DE DECISÕES */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE4]">
          <h3 className="text-base font-black text-[#0A192F]">Histórico de decisões</h3>
          <span className="text-xs font-bold text-[#0066FF] cursor-pointer hover:underline">
            Ver todos →
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2EBE4] text-[#64748B] font-semibold text-[11px]">
                <th className="pb-3">Data e hora</th>
                <th className="pb-3">Proposta</th>
                <th className="pb-3">Ação</th>
                <th className="pb-3">Operador</th>
                <th className="pb-3">Resultado</th>
                <th className="pb-3">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EBE4]/60 font-medium">
              {historicoDecisoes.map((h, i) => (
                <tr key={i} className="hover:bg-[#F8FAFD] transition-colors">
                  <td className="py-3 text-[#64748B] font-mono text-[11px] whitespace-nowrap">{h.data}</td>
                  <td className="py-3 text-[#0066FF] font-bold font-mono">{h.proposta}</td>
                  <td className="py-3 font-semibold text-[#0A192F]">{h.acao}</td>
                  <td className="py-3 text-[#64748B]">{h.operador}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${h.resCor}`}>
                      ● {h.resultado}
                    </span>
                  </td>
                  <td className="py-3 text-[#64748B] text-[11px] max-w-md truncate">{h.obs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
