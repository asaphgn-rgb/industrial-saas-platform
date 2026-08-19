import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Paperclip, ShieldAlert, Lock, User, FileText } from 'lucide-react';
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

  if (loading) return <div className="flex h-full items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header Blindado */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-800 rounded-full">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Canal Seguro & Restrito</h3>
            <p className="text-xs text-slate-400">Comunicação e Documentos em Ambiente Isolado</p>
          </div>
        </div>
        <ShieldAlert className="w-5 h-5 text-slate-500" />
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#e5ddd5] dark:bg-slate-800">
        <div className="text-center my-4">
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shadow-sm">
            As mensagens e anexos neste canal são restritos aos participantes autorizados. (Auditado: ISO 9001)
          </span>
        </div>
        
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm relative ${
                  isMine ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none'
                }`}
              >
                {!isMine && (
                  <div className="flex items-center space-x-1 mb-1">
                     <User className="w-3 h-3 text-slate-400"/>
                     <span className="text-xs font-semibold text-slate-500">Parceiro (Membro Restrito)</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.attachment_url && (
                   <div className="mt-2 flex items-center p-2 bg-black/5 rounded cursor-pointer hover:bg-black/10 transition">
                      <FileText className="w-4 h-4 mr-2 text-slate-600"/>
                      <span className="text-xs font-medium truncate">Anexo Protegido por RLS</span>
                   </div>
                )}
                <div className="text-right mt-1">
                  <span className="text-[10px] text-slate-500">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <form onSubmit={handleSendMessage} className="p-3 bg-gray-100 flex items-end space-x-2">
        <button
          type="button"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-gray-200 rounded-full transition"
          title="Anexar Documento (CAR, Matrícula, Laudos)"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite uma mensagem ou arraste um documento..."
          className="flex-1 max-h-32 min-h-[44px] rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 p-3 text-sm resize-none"
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
          className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
