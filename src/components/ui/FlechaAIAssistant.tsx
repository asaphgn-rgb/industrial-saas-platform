import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, ChevronRight, Activity, Zap, Info, Rocket, Navigation } from 'lucide-react';

interface FlechaAIAssistantProps {
  currentUser?: { name: string; initials: string; role: string };
}

export function FlechaAIAssistant({ currentUser }: FlechaAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; sender: 'ai' | 'user'; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Saudações Iniciais
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: `Olá, ${currentUser?.name ? currentUser.name.split(' ')[0] : 'Executivo(a)'}! Sou a **Flecha IA** 🚀.\n\nFui projetada para ser seu co-piloto na plataforma B2B. Sou treinada em normas ISO 9001 e operações de Due Diligence. Como posso te auxiliar hoje?`,
        }
      ]);
    }
  }, [isOpen, messages.length, currentUser]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'user', text: userText }]);
    setInputText('');
    setIsTyping(true);

    // Lógica Fake de NLP por Palavra-Chave (Atuando como Guia Interativo)
    setTimeout(() => {
      let aiResponse = "";
      const lower = userText.toLowerCase();

      if (lower.includes('criar') && lower.includes('usuário')) {
         aiResponse = "Para criar um usuário, acesse o painel **Visão Executiva (CEO)** na barra lateral e vá na aba **Gestão de Usuários**. Lembre-se: Primeiro crie a empresa do cliente na aba **Gestão de Empresas**.";
      } else if (lower.includes('reunião') || lower.includes('vídeo') || lower.includes('video')) {
         aiResponse = "Nosso sistema de Videoconferência é P2P (WebRTC). Abra os **Canais Criptografados**, escolha com quem quer falar e clique no botão **Vídeo** no canto superior direito da conversa.";
      } else if (lower.includes('ata') || lower.includes('iso')) {
         aiResponse = "Você pode gravar atas automáticas! Dentro da sala de Vídeo, basta clicar em **Gravar Reunião & Ata**. Eu mesmo cuidarei da transcrição e formatação Padrão ISO 9000 e enviarei no chat pra você.";
      } else if (lower.includes('chat') || lower.includes('grupo')) {
         aiResponse = "O Chat opera em protocolo AES-GCM (Zero-Trace). Você pode clicar no **(+)** no painel esquerdo do chat para criar novos grupos misturando diretores e clientes.";
      } else if (lower.includes('aprovar') || lower.includes('dossiê') || lower.includes('upload')) {
         aiResponse = "Acesse o módulo **Validação & Aceite** para auditar documentos recebidos no Dossiê. Lá você tem as opções de Visualizar Criptografado, Aprovar ou Solicitar Exclusão Rígida (LGPD).";
      } else {
         aiResponse = "Entendi sua requisição. Como sou um Assistente Guiado, sugiro explorar o menu **Canais Criptografados** ou me perguntar sobre: \n- *Como criar um usuário?*\n- *Como gerar uma Ata ISO?*\n- *Como funciona a aprovação de documentos?*";
      }

      setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  const suggestAction = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">

      {/* PAINEL DE CHAT (Abre de baixo pra cima) */}
      <div
        className={`absolute bottom-20 right-0 w-[calc(100vw-3rem)] md:w-[400px] h-[550px] max-h-[75vh] flex flex-col bg-fbsb-bg-deep/95 backdrop-blur-3xl border border-fbsb-cyan/30 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,212,255,0.4)] overflow-hidden transition-all duration-500 ease-out origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'
        }`}
      >
        {/* Cabeçalho do Chat */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-fbsb-surface-100 to-fbsb-bg-main border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
             <div className="relative">
                {/* Imagem personalizada pelo Usuário para a IA */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#a78bfa] p-0.5 shadow-glow-cyan overflow-hidden">
                   <img src="/ai-bot.png" alt="Flecha IA" className="w-full h-full object-cover rounded-[10px]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                   {/* Fallback svg se não carregar a imagem externa */}
                   <Navigation className="absolute inset-0 m-auto w-6 h-6 text-white" style={{ zIndex: -1 }} />
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-[2.5px] border-fbsb-bg-deep rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
             </div>
             <div>
                <h3 className="text-[15px] font-bold text-white font-serif tracking-wide flex items-center gap-2">
                   FLECHA IA
                   <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                </h3>
                <p className="text-[10px] text-fbsb-cyan uppercase tracking-widest font-bold">Assistente Executivo</p>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl hover:bg-white/10 text-fbsb-text-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 modern-scroll">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed relative ${
                msg.sender === 'user'
                  ? 'bg-fbsb-cyan text-fbsb-bg-deep rounded-br-sm shadow-md'
                  : 'bg-fbsb-surface-100 text-fbsb-text-primary rounded-bl-sm border border-white/5 shadow-md'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {/* Renderiza pseudo-markdown básico */}
                    {line.includes('**') ? (
                       <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ) : (
                       <span>{line}</span>
                    )}
                    {i !== msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}

          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-fbsb-surface-100 rounded-2xl rounded-bl-sm border border-white/5 px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-fbsb-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-fbsb-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-fbsb-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões de Ação */}
        {!isTyping && messages.length < 4 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto modern-scroll hide-scrollbar">
            {["Como crio empresas?", "Gerar Ata ISO", "Novo Chat P2P"].map(s => (
               <button
                 key={s} onClick={() => suggestAction(s)}
                 className="whitespace-nowrap px-3 py-1.5 rounded-full border border-fbsb-cyan/30 text-fbsb-cyan text-[11px] hover:bg-fbsb-cyan/10 transition-colors font-medium flex items-center gap-1"
               >
                  {s} <ChevronRight className="w-3 h-3" />
               </button>
            ))}
          </div>
        )}

        {/* Campo de Input */}
        <form onSubmit={handleSend} className="p-3 bg-fbsb-surface-100/50 border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Pergunte-me algo..."
            className="flex-1 bg-fbsb-bg-deep border border-fbsb-border rounded-xl px-4 text-[13px] text-white focus:outline-none focus:border-fbsb-cyan/50 transition-colors placeholder:text-fbsb-text-secondary/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-11 h-11 bg-gradient-to-r from-fbsb-cyan to-blue-500 rounded-xl flex items-center justify-center text-fbsb-bg-deep disabled:opacity-50 transition-all hover:opacity-90 hover:scale-105 shadow-[0_0_15px_rgba(0,212,255,0.4)] flex-shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

      {/* BOTÃO FLUTUANTE (BUBBLE) */}
      <div className="relative group">
         {/* Anel Pulsante Externo */}
         <div className="absolute inset-0 bg-fbsb-cyan rounded-full animate-ping opacity-20 duration-1000" />

         <button
           onClick={() => setIsOpen(!isOpen)}
           className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.4)] border-2 ${
             isOpen ? 'bg-fbsb-surface-200 border-fbsb-border rotate-90 scale-90' : 'bg-gradient-to-br from-fbsb-bg-main to-fbsb-surface-100 border-fbsb-cyan hover:scale-105'
           }`}
         >
           {isOpen ? (
             <X className="w-7 h-7 text-fbsb-text-secondary" />
           ) : (
             <div className="w-full h-full relative overflow-hidden rounded-full p-1 bg-fbsb-bg-deep flex items-center justify-center group-hover:bg-fbsb-surface-100 transition-colors">
               <img src="/ai-bot.png" alt="Flecha IA" className="w-full h-full object-cover scale-110 drop-shadow-lg z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
               <Navigation className="absolute m-auto w-7 h-7 text-fbsb-cyan" />
               <div className="absolute -bottom-1 -right-1 z-20">
                  <Activity className="w-5 h-5 text-emerald-400 fill-emerald-400/20 drop-shadow-md" />
               </div>
             </div>
           )}
         </button>

         {/* Tooltip Hover (Apenas se estiver fechado) */}
         {!isOpen && (
            <div className="absolute right-[80px] top-1/2 -translate-y-1/2 bg-fbsb-surface-100 text-white text-[11px] font-bold px-3 py-2 rounded-xl whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
              Flecha IA Online
              {/* Seta do tooltip */}
              <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-6 border-transparent border-l-fbsb-surface-100 w-0 h-0" />
            </div>
         )}
      </div>

    </div>
  );
}
