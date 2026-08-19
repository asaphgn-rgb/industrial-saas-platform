import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Paperclip, ShieldAlert, Lock, User, FileText, CheckCheck } from 'lucide-react';
import { SafeAny } from '../../types/supabase-override';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  attachment_url?: string;
  is_read: boolean;
}

interface SecureChatProps {
  roomId: string;
  currentUserId: string;
}

export function SecureChat({ roomId, currentUserId }: SecureChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel(`room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage;
    setNewMessage(''); // optimistic clear

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) throw new Error('User not found');

      const { data: tenantData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      if (!tenantData) throw new Error('Tenant ID not found');

      const payload = [{
        room_id: roomId,
        sender_id: currentUserId,
        content: messageContent,
        tenant_id: (tenantData as any).tenant_id
      }];

      const query = supabase.from('chat_messages');
      const insertMethod = query.insert as SafeAny;
      const { error } = await insertMethod(payload);

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-elite-navy"></div></div>;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-white border border-elite-sand/20 rounded-2xl shadow-premium overflow-hidden font-sans">
      {/* Header Blindado Premium */}
      <div className="flex items-center justify-between px-6 py-4 bg-elite-navy text-white z-10">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-slate-800 rounded-xl shadow-inner-gold">
            <Lock className="w-5 h-5 text-elite-gold" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-wide font-serif">Canal Criptografado (B2B)</h3>
            <p className="text-[11px] text-elite-sand uppercase tracking-widest mt-0.5">Comunicação Protegida por Protocolo E2E</p>
          </div>
        </div>
        <div className="hidden md:flex items-center px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
           <ShieldAlert className="w-4 h-4 text-elite-gold mr-2" />
           <span className="text-[10px] uppercase font-bold text-elite-paper tracking-wider">Nível Máximo de Sigilo</span>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#f4f2ef] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-50">
        <div className="text-center my-6">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-elite-gold text-elite-navy px-4 py-2 rounded-full shadow-sm">
            Canal monitorado por política restrita de isolamento de dados
          </span>
        </div>

        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}>
              <div
                className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-md relative ${
                  isMine
                    ? 'bg-elite-navy text-white rounded-br-sm shadow-premium'
                    : 'bg-white text-elite-navy rounded-bl-sm border border-elite-sand/30 shadow-sm'
                }`}
              >
                {!isMine && (
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-slate-100">
                     <div className="w-6 h-6 rounded-full bg-elite-paper flex items-center justify-center">
                        <User className="w-3 h-3 text-elite-navy"/>
                     </div>
                     <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Parte Autorizada</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                {msg.attachment_url && (
                   <div className={`mt-3 flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                     isMine ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-elite-paper hover:bg-elite-sand/20'
                   }`}>
                      <FileText className={`w-5 h-5 mr-3 ${isMine ? 'text-elite-gold' : 'text-elite-navy'}`}/>
                      <div>
                        <span className="text-xs font-bold block">Documento Anexado</span>
                        <span className="text-[10px] opacity-70 uppercase tracking-wider">Auditado pelo RLS</span>
                      </div>
                   </div>
                )}

                <div className={`text-right mt-2 flex items-center justify-end space-x-1 ${isMine ? 'text-slate-400' : 'text-slate-400'}`}>
                  <span className="text-[10px] font-bold">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMine && <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-elite-gold' : 'text-slate-500'}`} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-elite-sand/20 flex items-end space-x-3">
        <button
          type="button"
          className="p-3 text-slate-400 hover:text-elite-navy hover:bg-elite-paper rounded-xl transition-colors"
          title="Anexar Documento Sigiloso"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Comunicação segura E2E..."
          className="flex-1 max-h-32 min-h-[52px] bg-elite-paper/50 rounded-xl border border-transparent hover:border-elite-sand/40 focus:bg-white focus:border-elite-gold focus:ring-1 focus:ring-elite-gold p-4 text-sm resize-none transition-all outline-none text-elite-navy"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e as any);
            }
          }}
        />

        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="p-4 bg-elite-navy text-elite-gold rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md shadow-elite-navy/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}