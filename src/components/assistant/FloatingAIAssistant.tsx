import { useState } from 'react';
import { Bot, X, Send, ChevronUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function FloatingAIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Olá! Sou seu assistente virtual integrado. Como posso ajudar com os processos do Morar Bem Brasil hoje?' }
  ]);
  const [input, setInput] = useState('');

  if (!user) return null;

  const getContextByRole = () => {
    switch(user.role) {
      case 'ADMIN_GLOBAL': return 'Modo Executivo: Análise de Indicadores, CRM e Monitoramento Global.';
      case 'FEDERACAO': return 'Modo Jurisdição: Visão das suas Associações, Conversão e Comissões.';
      case 'ASSOCIACAO': return 'Modo Operacional: Status dos seus associados e pendências de documentos.';
      case 'ASSOCIADO': return 'Modo Consultivo: Explicação de produtos, score e auxílio no upload de documentos.';
      default: return '';
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');

    // Mock response to simulate AI processing based on role
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `Entendi sua dúvida. Operando em perfil ${user.role}, vou analisar os dados e gerar uma recomendação de próximo passo...` 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {isOpen && (
        <div className="mb-4 w-[350px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-in-out sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-amber-500 p-1.5">
                <Bot className="h-5 w-5 text-slate-900" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Plataforma Diamond AI</h3>
                <p className="text-[10px] text-slate-400">Contexto: {user.role}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Context Alert */}
          <div className="bg-amber-50 px-4 py-2 flex items-start gap-2 border-b border-amber-100">
             <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
             <p className="text-xs text-amber-800">{getContextByRole()}</p>
          </div>

          {/* Chat Body */}
          <div className="h-[350px] overflow-y-auto bg-slate-50 p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl p-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-amber-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-3">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte algo à inteligência artificial..." 
                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 hover:scale-105 transition-all duration-200"
        >
          <Bot className="h-7 w-7 text-amber-400 group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold ring-2 ring-white">1</span>
        </button>
      )}
    </div>
  );
}
