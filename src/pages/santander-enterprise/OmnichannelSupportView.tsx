import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  User,
  ShieldCheck,
  CreditCard,
  Building2,
  ChevronRight,
  ExternalLink,
  Bot,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { MOCK_CHATS, ChatConversation } from '@/data/enterpriseData';

export const OmnichannelSupportView: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CHATS);
  const [selectedChat, setSelectedChat] = useState<ChatConversation>(MOCK_CHATS[0]);
  const [inputText, setInputText] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'whatsapp' | 'email' | 'instagram' | 'phone'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const channelIcons = {
    whatsapp: <span className="text-emerald-600 font-bold">WhatsApp</span>,
    email: <span className="text-blue-600 font-bold">E-mail</span>,
    instagram: <span className="text-pink-600 font-bold">Instagram</span>,
    phone: <span className="text-amber-600 font-bold">Telefone</span>,
  };

  const filteredChats = conversations.filter((c) => {
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter;
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      sender: 'agent' as const,
      senderName: 'Fabiano Asaph',
      text: inputText,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...selectedChat.messages, newMessage];
    const updatedSelected = { ...selectedChat, messages: updatedMessages };

    setSelectedChat(updatedSelected);
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedChat.id ? updatedSelected : c))
    );
    setInputText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Atendimento</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Central omnichannel unificada: WhatsApp, E-mail, Instagram e Telefonia com contexto 360°.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Central Online (SLA 98,4%)
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Ativos agora
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Atendimentos em andamento
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">18</p>
            <p className="text-[10px] text-slate-500 mt-1">12 aguardando primeira resposta</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              -18s vs ontem
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Tempo médio de resposta
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">1m 42s</p>
            <p className="text-[10px] text-slate-500 mt-1">Meta corporativa: 2m 30s</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              IA Santander Desk
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Resolução em Nível 1
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">71,4%</p>
            <p className="text-[10px] text-slate-500 mt-1">Sem transbordo para operador</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              CSAT 4.9/5.0
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Satisfação dos clientes
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">96,8%</p>
            <p className="text-[10px] text-slate-500 mt-1">Avaliações positivas na semana</p>
          </div>
        </div>
      </div>

      {/* 3-Column Omnichannel Desk Layout:
          Col 1 (3 cols): Queue / Conversations list
          Col 2 (6 cols): Active Chat Transcript & Input Box
          Col 3 (3 cols): Client 360 Profile & Quick Actions
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[620px]">
        {/* Col 1: Queue (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate flex flex-col justify-between space-y-3">
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Filas de Atendimento</h2>
              <span className="text-[11px] font-mono text-slate-400">
                {filteredChats.length} chamados
              </span>
            </div>

            {/* Channels Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600 text-center">
              <button
                onClick={() => setChannelFilter('all')}
                className={`py-1 rounded-lg ${channelFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
              >
                Todos
              </button>
              <button
                onClick={() => setChannelFilter('whatsapp')}
                className={`py-1 rounded-lg ${channelFilter === 'whatsapp' ? 'bg-white text-emerald-600 shadow-sm' : ''}`}
              >
                Whats
              </button>
              <button
                onClick={() => setChannelFilter('email')}
                className={`py-1 rounded-lg ${channelFilter === 'email' ? 'bg-white text-blue-600 shadow-sm' : ''}`}
              >
                E-mail
              </button>
              <button
                onClick={() => setChannelFilter('phone')}
                className={`py-1 rounded-lg ${channelFilter === 'phone' ? 'bg-white text-amber-600 shadow-sm' : ''}`}
              >
                Voz
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar chamado ou cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Conversations List */}
            <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1 flex-1">
              {filteredChats.map((c) => {
                const isSelected = selectedChat.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedChat(c)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 shadow-sm'
                        : 'border-slate-200/80 bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {c.clientInitials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {c.clientName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">{c.protocol}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">{c.time}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium mt-2 line-clamp-1">
                      {c.subject}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{c.preview}</p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px]">
                      <span className="font-semibold">{channelIcons[c.channel]}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded font-bold ${
                          c.status === 'Em análise'
                            ? 'bg-amber-50 text-amber-700'
                            : c.status === 'Resolvido'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        ● {c.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 2: Chat Transcript & Reply (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between space-y-4">
          {/* Header of Active Chat */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-600/20">
                {selectedChat.clientInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{selectedChat.clientName}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono text-[10px] text-slate-600">
                    {selectedChat.protocol}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  Canal: {channelIcons[selectedChat.channel]} • Assunto:{' '}
                  <span className="font-semibold text-slate-800">{selectedChat.subject}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                ● Atendimento Ativo
              </span>
              <button
                onClick={() => alert(`Encerrando protocolo ${selectedChat.protocol}`)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600"
              >
                Encerrar
              </button>
            </div>
          </div>

          {/* Transcript Area */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[380px] p-2 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="text-center">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-mono text-slate-400 shadow-sm">
                Início do atendimento via {selectedChat.channel.toUpperCase()} • Protocolo {selectedChat.protocol}
              </span>
            </div>

            {selectedChat.messages.map((m, idx) => {
              const isMe = m.sender === 'agent';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-600/10'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] opacity-80 border-b border-white/20 pb-0.5 mb-1">
                      <span className="font-bold">{m.senderName}</span>
                      <span className="font-mono">{m.time}</span>
                    </div>
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Respostas Predefinidas Santander */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Respostas Rápidas:
            </span>
            <button
              onClick={() => setInputText('Olá! Já identifiquei seu cadastro e estou verificando sua solicitação.')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap"
            >
              Saudação Inicial
            </button>
            <button
              onClick={() => setInputText('Poderia por favor confirmar os 4 primeiros dígitos do CPF para validação de segurança?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap"
            >
              Validação de Segurança
            </button>
            <button
              onClick={() => setInputText('Solicitação concluída com sucesso! Protocolo arquivado e comprovante enviado por e-mail.')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap"
            >
              Conclusão e Envio
            </button>
          </div>

          {/* Input Chat Box */}
          <form onSubmit={handleSendMessage} className="space-y-2">
            <div className="relative border border-slate-200 rounded-xl bg-white focus-within:border-blue-500 shadow-sm">
              <textarea
                rows={2}
                placeholder="Digite a resposta oficial da instituição para o cliente..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                <div className="flex items-center gap-2 text-slate-400">
                  <button
                    type="button"
                    onClick={() => alert('Anexar comprovante ou formulário')}
                    className="p-1 hover:text-blue-600 rounded"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Inserir emoji')}
                    className="p-1 hover:text-blue-600 rounded"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Col 3: Customer 360° Profile & Products (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Contexto do Cliente</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                KYC Verificado
              </span>
            </div>

            {/* Profile Brief */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center mx-auto shadow-md shadow-blue-600/20">
                {selectedChat.clientInitials}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">{selectedChat.clientName}</h4>
              <p className="text-[10px] font-mono text-slate-400">CPF 123.456.789-00</p>
              <p className="text-[10px] text-slate-500">Segmento: Classic / Prime</p>
            </div>

            {/* Contracted Products */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Produtos Contratados (4)
              </span>
              <div className="space-y-1.5 text-xs">
                {[
                  { name: 'Conta Digital DYAMOND', status: 'Ativo' },
                  { name: 'Cartão Platinum Mais', status: 'Ativo' },
                  { name: 'Clube Benefícios SulAmérica', status: 'Ativo' },
                  { name: 'Seguro Proteção Familiar', status: 'Ativo' },
                ].map((prod, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]"
                  >
                    <span className="font-semibold text-slate-800">{prod.name}</span>
                    <span className="text-emerald-700 font-bold text-[9px] bg-emerald-100 px-1.5 py-0.2 rounded">
                      {prod.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Risk Alert */}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Score Santander: 845
              </div>
              <p className="text-[10px] text-blue-900/80 leading-tight">
                Cliente sem restrições. Elegível a aumento automático de limite de crédito consignado.
              </p>
            </div>
          </div>

          {/* Action to Full 360 */}
          <button
            onClick={() => alert(`Navegando para o perfil 360° completo de ${selectedChat.clientName}`)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Ver perfil 360° completo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
