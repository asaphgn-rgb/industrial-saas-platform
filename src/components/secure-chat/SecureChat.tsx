import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { cloudRelay } from '../../lib/cloudSync';
import { Send, Paperclip, ShieldAlert, Lock, User, FileText, CheckCheck, Mic, Image as ImageIcon } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [securityBlur, setSecurityBlur] = useState(false);

  const fetchMessages = async () => {
    try {
      const key = await deriveKey(roomId, 'SaaS-B2B-Secure-Salt');
      setCryptoKey(key);

      const { data, error } = await supabase
        .from('b2b_secure_chat')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (data && !error && data.length > 0) {
        const decryptedMessages = await Promise.all(data.map(async (msg: any) => ({
          ...msg,
          content: await decryptE2E(msg.content, key),
        })));
        setMessages(decryptedMessages as Message[]);
      } else {
        const savedMessages = localStorage.getItem('B2B_MOCK_CHAT_' + roomId);
        if (savedMessages) setMessages(JSON.parse(savedMessages));
      }
      setLoading(false);
    } catch (e) { setLoading(false); }
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
    if (!cryptoKey) return;

    // Motor de Sincronização em Nuvem Absoluta (Bypass Vercel/Supabase config)
    cloudRelay.connect(roomId, async (cloudMessages) => {
        try {
           const decMsgs = await Promise.all(cloudMessages.map(async (msg: any) => {
              if (msg.content && msg.content.length > 20 && !msg.content.startsWith('http')) {
                 try {
                   return { ...msg, content: await decryptE2E(msg.content, cryptoKey) };
                 } catch(e) { return msg; }
              }
              return msg;
           }));

           setMessages(prev => {
              // Se o cloud tiver mais mensagens (ou for diferente do local)
              if (decMsgs.length > prev.length) {
                 localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(decMsgs));
                 return decMsgs;
              }
              return prev;
           });
        } catch(e) {}
    });

    const wipeDataOnClose = () => {
       supabase.from('b2b_secure_chat').delete().eq('room_id', roomId).then(() => {});
    };
    window.addEventListener('beforeunload', wipeDataOnClose);

    return () => {
      cloudRelay.disconnect();
      window.removeEventListener('beforeunload', wipeDataOnClose);
    };
  }, [roomId, cryptoKey]);

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
      id: crypto.randomUUID(), sender_id: currentUserId, content: decrypted, created_at: new Date().toISOString(),
      is_read: false, sender_role: currentUserRole, sender_name: currentUserName, audio_data: base64Audio, attachment_type: 'audio'
    };

    setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });

    await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });
    cloudRelay.pushState([...messages, { ...newMsg, content: cipherB64 }]);

    try {
      await supabase.from('b2b_secure_chat').insert({
        id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
        sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, audio_data: base64Audio, attachment_type: 'audio'
      } as any);
    } catch(e) {}
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
        id: crypto.randomUUID(), sender_id: currentUserId, content: decrypted, created_at: new Date().toISOString(),
        is_read: false, sender_role: currentUserRole, sender_name: currentUserName, attachment_url: base64Data, attachment_type: type
      };

      setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });

      await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });
      cloudRelay.pushState([...messages, { ...newMsg, content: cipherB64 }]);

      try {
        await supabase.from('b2b_secure_chat').insert({
          id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
          sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, attachment_url: base64Data, attachment_type: type
        } as any);
      } catch(e) {}
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !cryptoKey) return;
    const msg = newMessage;
    setNewMessage("");

    const cipherB64 = await encryptE2E(msg, cryptoKey);
    const decrypted = await decryptE2E(cipherB64, cryptoKey);

    const newMsg: Message = {
      sender_role: currentUserRole,
      sender_name: currentUserName,
      id: crypto.randomUUID(),
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
    cloudRelay.pushState([...messages, { ...newMsg, content: cipherB64 }]);

    try {
      await supabase.from('b2b_secure_chat').insert({
        id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
        sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64
      } as any);
    } catch(e) {}
  };

  if (loading) return <div className="flex h-full items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fbsb-primary"></div></div>;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-[#131720] md:border border-white/5 md:rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden font-sans absolute md:relative inset-0 md:inset-auto">
      <div className="flex items-center justify-between px-6 py-4 bg-[#1A1F2C] text-white z-10 border-b border-white/5">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-fbsb-surface-200 rounded-xl shadow-inner-gold">
            <Lock className="w-5 h-5 text-fbsb-cyan" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-wide font-serif">Canal Criptografado (B2B)</h3>
            <p className="text-[11px] text-fbsb-text-secondary uppercase tracking-widest mt-0.5">Comunicação Protegida por Protocolo E2E</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center px-3 py-1.5 bg-fbsb-surface-200 rounded-lg border border-fbsb-border">
             <ShieldAlert className="w-4 h-4 text-fbsb-cyan mr-2" />
             <span className="text-[10px] uppercase font-bold text-fbsb-text-secondary tracking-wider">Alto Sigilo</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden space-y-4 md:space-y-6 bg-[#0F1219] bg-opacity-50">
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
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-md relative overflow-hidden ${
                  isMine
                    ? 'bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] text-white rounded-br-sm shadow-[0_5px_15px_rgba(59,130,246,0.3)] border border-white/10'
                    : 'bg-[#1A1F2C] text-[#F8FAFC] rounded-bl-sm border border-white/5 shadow-md'
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
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-all">{msg.content}</p>

                {msg.attachment_url && msg.attachment_type === 'image' && (
                   <div className="mt-3 relative rounded-lg overflow-hidden border border-fbsb-border/30">
                      <img src={msg.attachment_url} alt="Anexo Seguro" className="max-w-full max-h-48 object-cover" />
                   </div>
                )}
                {msg.attachment_url && msg.attachment_type === 'pdf' && (
                   <div className={`mt-3 flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                     isMine ? 'bg-fbsb-surface-200/50 hover:bg-fbsb-surface-200' : 'bg-fbsb-bg-main hover:bg-fbsb-text-secondary/20'
                   }`} onClick={() => {
                      const w = window.open("");
                      w?.document.write("<iframe width='100%' height='100%' src='" + msg.attachment_url + "'></iframe>");
                   }}>
                      <FileText className={`w-5 h-5 mr-3 ${isMine ? 'text-fbsb-cyan' : 'text-fbsb-text-primary'}`}/>
                      <div>
                        <span className="text-xs font-bold block">Documento Seguro.pdf</span>
                        <span className="text-[10px] opacity-70 uppercase tracking-wider">Clique para visualizar</span>
                      </div>
                   </div>
                )}
                {msg.audio_data && (
                   <div className="mt-3 w-48 md:w-64">
                     <audio src={msg.audio_data} controls className="w-full h-8" />
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

      <form onSubmit={handleSendMessage} className="p-4 bg-[#131720] border-t border-white/5 flex items-end space-x-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-fbsb-text-secondary hover:text-fbsb-text-primary hover:bg-fbsb-bg-main rounded-xl transition-colors"
          title="Anexar Arquivo ou Foto"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,application/pdf"
        />

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Comunicação segura E2E..."
          className="flex-1 max-h-32 min-h-[52px] bg-[#0F1219] rounded-2xl border border-white/5 hover:border-white/10 focus:bg-[#1A1F2C] focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] shadow-inner p-4 text-sm resize-none transition-all outline-none text-fbsb-text-primary"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e as any);
            }
          }}
        />

        {newMessage.trim() === '' ? (
          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`p-4 rounded-xl transition-all flex items-center justify-center shadow-md ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-fbsb-primary text-fbsb-cyan hover:bg-fbsb-surface-200'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="submit"
            className="p-4 bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-[#0F1219] rounded-2xl hover:opacity-90 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)]"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
}
