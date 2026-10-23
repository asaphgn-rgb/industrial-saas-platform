import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Paperclip,
  User,
  ShieldCheck,
  CreditCard,
  Building2,
  Heart,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Award,
  MoreVertical,
  Sliders,
  Check
} from 'lucide-react';

export default function AtendimentoOmnichannel() {
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [abaConversas, setAbaConversas] = useState<'todas' | 'prioridade' | 'aguardando'>('todas');

  const [conversaAtiva, setConversaAtiva] = useState<any>({
    id: 'conv-1',
    cliente: 'Mariana Costa',
    canal: 'WhatsApp',
    assunto: 'Atendimento de benefício',
    protocolo: '#ATD-458721',
    cpf: '***.321.654-**',
    email: 'mariana.costa@email.com',
    telefone: '(11) 98765-4321',
    clienteDesde: '2023',
    score: '9,2',
    status: 'Em análise',
    previsao: '24/04 às 18h',
    slaRestante: '18h 29min',
    slaMeta: '24h',
    slaPct: 75,
    produtosContratados: [
      { nome: 'Plano de Saúde', desc: 'DYAMOND Saúde Plus', status: 'Ativo', icon: Heart, color: 'text-emerald-600 bg-emerald-50' },
      { nome: 'Cartão de Benefícios', desc: 'DYAMOND Múltiplo', status: 'Ativo', icon: CreditCard, color: 'text-[#22396F] bg-[#F8FAFD]' },
      { nome: 'Programa de Pontos', desc: 'DYAMOND Rewards', status: 'Ativo', icon: Award, color: 'text-amber-600 bg-amber-50' },
    ],
    mensagens: [
      { id: 'm1', remetente: 'Mariana Costa', hora: '10:24', texto: 'Olá! Gostaria de saber sobre o reembolso do meu exame. Enviei a nota fiscal na semana passada e ainda não tive retorno. Consegue me ajudar?', isUser: false },
      { id: 'm2', remetente: 'Você (Fabiano Asaph)', hora: '10:26', texto: 'Olá, Mariana! Claro, vou verificar para você. Só um momento, por favor.', isUser: true },
      { id: 'm3', remetente: 'Mariana Costa', hora: '10:28', texto: 'Perfeito, obrigada!', isUser: false },
      { id: 'm4', remetente: 'Você (Fabiano Asaph)', hora: '10:31', texto: 'Já localizei aqui, Mariana! Seu reembolso está em análise pela área de benefícios e a previsão de conclusão é até 24/04. Assim que tiver uma atualização, aviso por aqui, ok?', isUser: true },
      { id: 'm5', remetente: 'Mariana Costa', hora: '10:32', texto: 'Ótimo! Agradeço pelo retorno. 😊', isUser: false }
    ]
  });

  const listaConversas = [
    {
      id: 'conv-1',
      nome: 'Mariana Costa',
      iniciais: 'MC',
      canal: 'WhatsApp',
      canalColor: 'bg-[#25D366] text-white',
      assunto: 'Atendimento de benefício',
      preview: 'Olá! Gostaria de saber sobre o reem...',
      hora: '10:24',
      status: 'Em análise',
      statusColor: 'bg-[#FEF3C7] text-[#D97706]'
    },
    {
      id: 'conv-2',
      nome: 'Ricardo Oliveira',
      iniciais: 'RO',
      canal: 'E-mail',
      canalColor: 'bg-[#22396F] text-white',
      assunto: 'Cartão DYAMOND',
      preview: 'Vocês conseguem antecipar o limite?',
      hora: '09:41',
      status: 'Respondido',
      statusColor: 'bg-[#ECFDF5] text-[#047857]'
    },
    {
      id: 'conv-3',
      nome: 'Juliana Mendes',
      iniciais: 'JM',
      canal: 'Instagram',
      canalColor: 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white',
      assunto: 'Programa de pontos',
      preview: 'Obrigada pelo retorno!',
      hora: '08:17',
      status: 'Resolvido',
      statusColor: 'bg-[#ECFDF5] text-[#047857]'
    },
    {
      id: 'conv-4',
      nome: 'Carlos Eduardo',
      iniciais: 'CE',
      canal: 'Telefone',
      canalColor: 'bg-[#22396F] text-white',
      assunto: 'Empréstimo pessoal',
      preview: 'Gostaria de simular um novo valor.',
      hora: 'Ontem',
      status: 'Aguardando',
      statusColor: 'bg-[#F8FAFD] text-[#22396F]'
    },
    {
      id: 'conv-5',
      nome: 'Fernanda Lima',
      iniciais: 'FL',
      canal: 'WhatsApp',
      canalColor: 'bg-[#25D366] text-white',
      assunto: 'Benefício saúde',
      preview: 'Vocês atendem odontológico também?',
      hora: 'Ontem',
      status: 'Em análise',
      statusColor: 'bg-[#FEF3C7] text-[#D97706]'
    },
    {
      id: 'conv-6',
      nome: 'Paulo Henrique',
      iniciais: 'PH',
      canal: 'E-mail',
      canalColor: 'bg-[#22396F] text-white',
      assunto: 'Portabilidade de salário',
      preview: 'Anexei os documentos solicitados.',
      hora: '12/04',
      status: 'Respondido',
      statusColor: 'bg-[#ECFDF5] text-[#047857]'
    }
  ];

  const enviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;

    setConversaAtiva((prev: any) => ({
      ...prev,
      mensagens: [
        ...prev.mensagens,
        {
          id: `m-${Date.now()}`,
          remetente: 'Você (Fabiano Asaph)',
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          texto: mensagem,
          isUser: true
        }
      ]
    }));
    setMensagem('');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#010736] tracking-tight font-sans">
            Atendimento
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Relacionamento omnichannel, solicitações e acompanhamento da carteira.
          </p>
        </div>
      </div>

      {/* GRID PRINCIPAL: CONVERSAS (3 COLUNAS) + CHAT CENTRAL (5 COLUNAS) + PERFIL 360° (4 COLUNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA 1: LISTA DE CONVERSAS (3 COLUNAS) */}
        <div className="lg:col-span-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xs space-y-3 flex flex-col justify-between h-[660px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#010736]">Conversas</h3>
              <button
                onClick={() => alert('Iniciando nova conversa omnichannel')}
                className="px-2.5 py-1 rounded-xl bg-[#22396F] hover:bg-[#0D1C42] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Nova conversa
              </button>
            </div>

            {/* Busca de Conversas */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A398]" />
              <input
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar por nome, assunto ou protocolo"
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] outline-none text-[#010736]"
              />
            </div>

            {/* Filtros em Pílulas */}
            <div className="flex items-center gap-1 text-[10px] font-bold">
              <button
                onClick={() => setAbaConversas('todas')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  abaConversas === 'todas' ? 'bg-[#22396F] text-white' : 'bg-[#F8FAFD] text-[#64748B]'
                }`}
              >
                Todas 12
              </button>
              <button
                onClick={() => setAbaConversas('prioridade')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  abaConversas === 'prioridade' ? 'bg-[#22396F] text-white' : 'bg-[#F8FAFD] text-[#64748B]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Prioridade 3
              </button>
              <button
                onClick={() => setAbaConversas('aguardando')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  abaConversas === 'aguardando' ? 'bg-[#22396F] text-white' : 'bg-[#F8FAFD] text-[#64748B]'
                }`}
              >
                Aguardando 4
              </button>
            </div>

            {/* Lista com Scroll */}
            <div className="space-y-1.5 overflow-y-auto max-h-[460px] pr-1">
              {listaConversas.map((c) => {
                const isSelected = conversaAtiva.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setConversaAtiva((prev: any) => ({
                        ...prev,
                        id: c.id,
                        cliente: c.nome,
                        canal: c.canal,
                        assunto: c.assunto,
                      }));
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#F8FAFD] border-[#22396F]/40 shadow-xs'
                        : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFD]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${c.canalColor}`}>
                          {c.canal.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#010736] leading-tight">{c.nome}</p>
                          <span className="text-[10px] text-[#64748B]">{c.assunto}</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-[#94A3B8]">{c.hora}</span>
                    </div>

                    <p className="text-[11px] text-[#64748B] mt-1.5 truncate">{c.preview}</p>

                    <div className="flex justify-end mt-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${c.statusColor}`}>
                        ● {c.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUNA 2: THREAD DO CHAT (5 COLUNAS) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs flex flex-col justify-between h-[660px]">
          {/* Header da Conversa Ativa */}
          <div className="pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#010736] text-white flex items-center justify-center font-bold text-xs">
                  MC
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#010736] flex items-center gap-1.5">
                    {conversaAtiva.cliente} · <span className="text-[#64748B] font-normal">{conversaAtiva.assunto}</span>
                  </h3>
                  <p className="text-[10px] text-[#94A3B8]">
                    Cliente desde {conversaAtiva.clienteDesde} · CPF {conversaAtiva.cpf}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Visualizando detalhes do protocolo ${conversaAtiva.protocolo}`)}
                  className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFD] text-[11px] font-bold text-[#010736]"
                >
                  Ver detalhes
                </button>
                <MoreVertical className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
              </div>
            </div>

            {/* Banner de Aviso de Solicitação */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#FEF3C7]/60 border border-amber-200 text-xs text-[#92400E] flex items-start gap-2">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div className="text-[11px]">
                <strong>Solicitação em análise:</strong> Seu protocolo {conversaAtiva.protocolo} está em análise pela nossa equipe. Previsão de retorno até {conversaAtiva.previsao}.
              </div>
            </div>
          </div>

          {/* Mensagens da Thread */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
            {conversaAtiva.mensagens.map((msg: any) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] mb-1">
                  <span>{msg.remetente}</span>
                  <span>{msg.hora}</span>
                </div>
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.isUser
                      ? 'bg-[#22396F] text-white rounded-tr-xs shadow-xs'
                      : 'bg-[#F8FAFD] border border-[#E2E8F0] text-[#010736] rounded-tl-xs'
                  }`}
                >
                  {msg.texto}
                </div>
              </div>
            ))}
          </div>

          {/* Caixa de Entrada de Texto */}
          <form onSubmit={enviarMensagem} className="pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Anexar arquivo / comprovante')}
              className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFD] text-[#64748B] flex items-center gap-1 text-xs font-bold"
            >
              <Paperclip className="w-4 h-4" /> Anexar
            </button>
            <input
              type="text"
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              placeholder="Escreva uma mensagem..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] text-xs text-[#010736] outline-none focus:border-[#22396F] focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#22396F] hover:bg-[#0D1C42] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Enviar
            </button>
          </form>
        </div>

        {/* COLUNA 3: PERFIL 360° DO CLIENTE & SLA (4 COLUNAS) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between h-[660px] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-black text-[#010736]">Perfil 360°</h3>
              <button className="text-xs font-bold text-[#22396F] hover:underline">
                Editar
              </button>
            </div>

            {/* Dados do Cliente */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F8FAFD] text-[#22396F] font-black text-sm flex items-center justify-center shrink-0">
                MC
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[#010736] truncate">{conversaAtiva.cliente}</p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#ECFDF5] text-[#047857]">
                    ● Cliente Ativo
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8] font-mono">CPF {conversaAtiva.cpf}</p>
                <p className="text-[10px] text-[#64748B] truncate">{conversaAtiva.email}</p>
                <p className="text-[10px] text-[#64748B]">{conversaAtiva.telefone}</p>
              </div>
            </div>

            {/* Metadados: Cliente Desde, Segmento, Score */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0] text-center text-xs">
              <div>
                <span className="text-[9px] text-[#94A3B8] uppercase block">Cliente desde</span>
                <strong className="text-[#010736] text-[11px]">Mar/2023</strong>
              </div>
              <div>
                <span className="text-[9px] text-[#94A3B8] uppercase block">Segmento</span>
                <strong className="text-[#010736] text-[11px]">Pessoa Física</strong>
              </div>
              <div>
                <span className="text-[9px] text-[#94A3B8] uppercase block">Score Relacionamento</span>
                <strong className="text-[#047857] text-[11px]">{conversaAtiva.score}</strong>
              </div>
            </div>

            {/* Produtos Contratados */}
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#010736]">Produtos contratados</span>
                <span className="text-[10px] font-bold text-[#22396F] cursor-pointer hover:underline">Ver todos</span>
              </div>

              <div className="space-y-1.5">
                {conversaAtiva.produtosContratados.map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${p.color}`}>
                        <p.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-[#010736] leading-tight text-[11px]">{p.nome}</p>
                        <span className="text-[10px] text-[#64748B]">{p.desc}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#047857]">Ativo</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Caso Atual & SLA */}
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#010736]">Caso atual</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FEF3C7] text-[#D97706]">
                  ● Em análise
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] space-y-1 text-xs">
                <p className="font-bold text-[#010736]">{conversaAtiva.protocolo}</p>
                <p className="text-[11px] text-[#64748B]">Reembolso de exame médico</p>
                <p className="text-[10px] text-[#94A3B8]">Aberto em 17/04/2026 · Previsão: 24/04/2026</p>
              </div>

              {/* SLA de Atendimento */}
              <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#64748B]">SLA de atendimento</span>
                  <span className="font-mono text-[10px] text-[#64748B]">Meta: 24h</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-[#010736]">
                  <span className="flex items-center gap-1.5 text-[#047857]">
                    <Clock className="w-3.5 h-3.5" /> {conversaAtiva.slaRestante}
                  </span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#047857] h-full rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Botões Inferiores */}
          <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-2">
            <button
              onClick={() => alert('Criando tarefa interna no CRM')}
              className="py-2 px-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFD] text-xs font-bold text-[#010736] transition-all"
            >
              Criar tarefa
            </button>
            <button
              onClick={() => alert('Escalando caso para a Ouvidoria / Supervisão')}
              className="py-2 px-2.5 rounded-xl bg-[#22396F] hover:bg-[#0D1C42] text-white text-xs font-bold transition-all shadow-xs"
            >
              Escalonar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
