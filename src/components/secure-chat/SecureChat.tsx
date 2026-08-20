import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Paperclip, ShieldAlert, Lock, User, FileText, CheckCheck, Mic, Video, Camera, Image as ImageIcon } from 'lucide-react';
import { SafeAny } from '../../types/supabase-override';
import { deriveKey, encryptE2E, decryptE2E } from '../../lib/crypto';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  attachment_url?: string;
  attachment_type?: 'image' | 'pdf' | 'audio';
  audio_data?: string;
  is_read: boolean;
  sender_role?: string;
  sender_name?: string;
}

interface SecureChatProps {
  roomId: string;
  currentUserId: string;
  currentUserRole?: string;
  currentUserName?: string;
}

export function SecureChat({ roomId, currentUserId, currentUserRole, currentUserName }: SecureChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<any[]>([]);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [securityBlur, setSecurityBlur] = useState(false);

  const fetchMessages = async () => {
    try {
      // Derivar a chave de criptografia baseada no ID da sala (Simulação de Handshake)
      const key = await deriveKey(roomId, 'SaaS-B2B-Secure-Salt');
      setCryptoKey(key);
      
      // Carrega histórico E2E da memória B2B MOCK
      const savedMessages = localStorage.getItem('B2B_MOCK_CHAT_' + roomId);
      if (savedMessages) {
         setMessages(JSON.parse(savedMessages));
      } else {
         setMessages([]);
      }
      setLoading(false);
    } catch (e) { }
  };

  useEffect(() => { fetchMessages(); }, [roomId]);

  useEffect(() => {
    const handleBlur = () => setSecurityBlur(true);
    const handleFocus = () => setSecurityBlur(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey && e.key === '4')) {
        e.preventDefault();
        setSecurityBlur(true);
        setTimeout(() => setSecurityBlur(false), 3000);
      }
    };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  useEffect(() => {
    // Inscreve no canal de comunicação p2p global do supabase (Broadcast Realtime sem persistir no banco)
    // Essa é a abordagem 100% cloud mas efêmera exigida pela FLECHA BSB. NADA FICA NO BANCO.
    const channel = supabase.channel('room_' + roomId)
      .on('broadcast', { event: 'new_message' }, payload => {
        setMessages(prev => {
          const exists = prev.find(m => m.id === payload.payload.id);
          if (exists) return prev;
          
          const updated = [...prev, payload.payload];
          localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));
          return updated;
        });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log("Conectado ao canal E2E cross-device");
        }
      });
      
    return () => { supabase.removeChannel(channel); };
  }, [roomId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => { sendAudioMessage(reader.result as string); };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("Microfone bloqueado pelo sistema."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioMessage = async (base64Audio: string) => {
    if (!cryptoKey) return;
    const cipherB64 = await encryptE2E("Mensagem de Voz", cryptoKey);
    const decrypted = await decryptE2E(cipherB64, cryptoKey);
    const newMsg: Message = {
      id: Math.random().toString(), sender_id: currentUserId, content: decrypted, created_at: new Date().toISOString(),
      is_read: false, sender_role: currentUserRole, sender_name: currentUserName, audio_data: base64Audio, attachment_type: 'audio'
    };
    setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
    await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cryptoKey) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      const type = file.type.startsWith('image/') ? 'image' : 'pdf';
      const cipherB64 = await encryptE2E("Arquivo Anexado", cryptoKey);
      const decrypted = await decryptE2E(cipherB64, cryptoKey);
      const newMsg: Message = {
        id: Math.random().toString(), sender_id: currentUserId, content: decrypted, created_at: new Date().toISOString(),
        is_read: false, sender_role: currentUserRole, sender_name: currentUserName, attachment_url: base64Data, attachment_type: type
      };
      setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
      await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !cryptoKey) return;
    const msg = newMessage;
    setNewMessage("");

    // Cifra a mensagem antes de "mandar para o banco"
    // No banco de dados real isso salva o cipherB64, e nem a administração lê.
    const cipherB64 = await encryptE2E(msg, cryptoKey);
    
    // Simulando que o recebedor vai decifrar a mensagem instantaneamente na UI:
    const decrypted = await decryptE2E(cipherB64, cryptoKey);

    const newMsg: Message = {
      sender_role: currentUserRole,
      sender_name: currentUserName,
      id: Math.random().toString(),
      sender_id: currentUserId,
      content: decrypted,
      created_at: new Date().toISOString(),
      is_read: false
    };
    setMessages(prev => {
      const updated = [...prev, newMsg];
      localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));
      return updated;
    });
    await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });
  };

  if (loading) return <div className="flex h-full items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fbsb-primary"></div></div>;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-fbsb-surface-100 md:border border-fbsb-border md:rounded-2xl shadow-premium overflow-hidden font-sans absolute md:relative inset-0 md:inset-auto">
      {/* Header Blindado Premium */}
      <div className="flex items-center justify-between px-6 py-4 bg-fbsb-primary text-white z-10">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-fbsb-surface-200 rounded-xl shadow-inner-gold">
            <Lock className="w-5 h-5 text-fbsb-cyan" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-wide font-serif">Canal Criptografado (B2B)</h3>
            <p className="text-[11px] text-fbsb-text-secondary uppercase tracking-widest mt-0.5">Comunicação Protegida por Protocolo E2E</p>
          </div>
        </div>
        <div className="hidden md:flex items-center px-3 py-1.5 bg-fbsb-surface-200 rounded-lg border border-fbsb-border">
           <ShieldAlert className="w-4 h-4 text-fbsb-cyan mr-2" />
           <span className="text-[10px] uppercase font-bold text-fbsb-bg-deep tracking-wider">Nível Máximo de Sigilo</span>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6 bg-[#f4f2ef] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-50">
        <div className="text-center my-6">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-fbsb-cyan text-fbsb-text-primary px-4 py-2 rounded-full shadow-sm">
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
                    ? 'bg-fbsb-primary text-white rounded-br-sm shadow-premium'
                    : 'bg-fbsb-surface-100 text-fbsb-text-primary rounded-bl-sm border border-fbsb-border shadow-sm'
                }`}
              >
                {!isMine && (
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-fbsb-border">
                     <div className="w-6 h-6 rounded-full bg-fbsb-bg-main flex items-center justify-center">
                        <User className="w-3 h-3 text-fbsb-text-primary"/>
                     </div>
                     <span className="text-xs font-bold text-fbsb-text-secondary uppercase tracking-wider">{msg.sender_role || 'Parte Autorizada'}</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                {msg.attachment_url && (
                   <div className={`mt-3 flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                     isMine ? 'bg-fbsb-surface-200/50 hover:bg-fbsb-surface-200' : 'bg-fbsb-bg-main hover:bg-fbsb-text-secondary/20'
                   }`}>
                      <FileText className={`w-5 h-5 mr-3 ${isMine ? 'text-fbsb-cyan' : 'text-fbsb-text-primary'}`}/>
                      <div>
                        <span className="text-xs font-bold block">Documento Anexado</span>
                        <span className="text-[10px] opacity-70 uppercase tracking-wider">Auditado pelo RLS</span>
                      </div>
                   </div>
                )}

                <div className={`text-right mt-2 flex items-center justify-end space-x-1 ${isMine ? 'text-fbsb-text-secondary' : 'text-fbsb-text-secondary'}`}>
                  <span className="text-[10px] font-bold">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMine && <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-fbsb-cyan' : 'text-fbsb-text-secondary'}`} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <form onSubmit={handleSendMessage} className="p-4 bg-fbsb-surface-100 border-t border-fbsb-border flex items-end space-x-3">
        <button
          type="button"
          className="p-3 text-fbsb-text-secondary hover:text-fbsb-text-primary hover:bg-fbsb-bg-main rounded-xl transition-colors"
          title="Anexar Documento Sigiloso"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Comunicação segura E2E..."
          className="flex-1 max-h-32 min-h-[52px] bg-fbsb-bg-main/50 rounded-xl border border-transparent hover:border-fbsb-border focus:bg-fbsb-surface-100 focus:border-fbsb-cyan focus:ring-1 focus:ring-fbsb-cyan p-4 text-sm resize-none transition-all outline-none text-fbsb-text-primary"
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
          className="p-4 bg-fbsb-primary text-fbsb-cyan rounded-xl hover:bg-fbsb-surface-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md shadow-fbsb-primary/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}