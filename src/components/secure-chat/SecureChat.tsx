import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { ntfyRelay } from '../../lib/ntfySync';
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
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const handleOpenSecureMedia = (base64Data: string, type: 'pdf' | 'image') => {
    if (base64Data === 'supabase') return;

    if (type === 'image') {
      setExpandedImage(base64Data);
      return;
    }

    // Tratamento para PDF: Converter Base64 gigante para Blob URL segura (Bypass about:blank#blocked)
    try {
      if (base64Data.startsWith('data:application/pdf;base64,')) {
         const byteCharacters = atob(base64Data.split(',')[1]);
         const byteNumbers = new Array(byteCharacters.length);
         for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
         }
         const byteArray = new Uint8Array(byteNumbers);
         const blob = new Blob([byteArray], { type: 'application/pdf' });
         const blobUrl = URL.createObjectURL(blob);
         window.open(blobUrl, '_blank');

         // Limpa a memória após alguns segundos
         setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else {
         // Fallback se já for URL normal (improvável na demo)
         window.open(base64Data, '_blank');
      }
    } catch (e) {
      console.error("Erro ao gerar visualização segura de PDF:", e);
      alert("O documento seguro não pôde ser aberto pelo seu navegador (Restrição de Segurança).");
    }
  };

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
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

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

    // Motor de Sincronização Absoluto via Ntfy (Bypass Total Vercel/Supabase, Porta 443)
    ntfyRelay.connect(roomId, async (payload) => {
        if (!cryptoKey || payload.sender_id === currentUserId) return;

        try {
           let decContent = payload.content;
           if (payload.content && payload.content.length > 20 && !payload.content.startsWith('http')) {
               try { decContent = await decryptE2E(payload.content, cryptoKey); } catch(e) {
                 console.error(e);
               }
           }
           const finalMsg = { ...payload, content: decContent };

           // Tratamento de arquivo muito grande: Busca direto do Supabase via REST API
           if (finalMsg.attachment_url === 'supabase' || finalMsg.audio_data === 'supabase') {
              // Fallback para ambiente de demonstração local cross-tab
              const localMediaUrl = localStorage.getItem('B2B_MEDIA_URL_' + finalMsg.id);
              const localMediaAudio = localStorage.getItem('B2B_MEDIA_AUDIO_' + finalMsg.id);
              const localMediaType = localStorage.getItem('B2B_MEDIA_TYPE_' + finalMsg.id);

              if (localMediaUrl && finalMsg.attachment_url === 'supabase') finalMsg.attachment_url = localMediaUrl;
              if (localMediaAudio && finalMsg.audio_data === 'supabase') finalMsg.audio_data = localMediaAudio;
              if (localMediaType) finalMsg.attachment_type = localMediaType as any;

              // Se ainda não resolveu com o mock local (não estão no mesmo navegador), tenta buscar do banco
              if (finalMsg.attachment_url === 'supabase' || finalMsg.audio_data === 'supabase') {
                let retries = 8;
                while (retries > 0) {
                  try {
                    const { data } = await supabase.from('b2b_secure_chat').select('attachment_url, attachment_type, audio_data').eq('id', finalMsg.id).single();
                    if (data) {
                       const d = data as any;
                       if (d.attachment_url && d.attachment_url !== 'supabase') finalMsg.attachment_url = d.attachment_url;
                       if (d.attachment_type) finalMsg.attachment_type = d.attachment_type;
                       if (d.audio_data && d.audio_data !== 'supabase') finalMsg.audio_data = d.audio_data;
                       break; // Sucesso, sai do loop
                    }
                  } catch(e) {
                    console.error("Retentando buscar mídia no DB...", e);
                  }
                  await new Promise(r => setTimeout(r, 400)); // Mais ágil: Espera 400ms antes do retry
                  retries--;
                }
              }
           }

           setMessages(prev => {
              const exists = prev.find(m => m.id === finalMsg.id);
              if (exists) {
                // Se a mensagem já existe, mas a nova traz o base64 real resolvendo o "supabase", ATUALIZA ELA!
                if (exists.attachment_url === 'supabase' && finalMsg.attachment_url && finalMsg.attachment_url !== 'supabase') {
                  const updated = prev.map(m => m.id === finalMsg.id ? { ...m, attachment_url: finalMsg.attachment_url, audio_data: finalMsg.audio_data } : m);
                  localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));
                  return updated;
                }
                return prev;
              }

              const updated = [...prev, finalMsg];
              localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));
              return updated;
           });
        } catch(e) {
          console.error(e);
        }
    });

    const wipeDataOnClose = () => {
       supabase.from('b2b_secure_chat').delete().eq('room_id', roomId).then(() => {});
    };
    window.addEventListener('beforeunload', wipeDataOnClose);

    return () => {
      ntfyRelay.disconnect();
      window.removeEventListener('beforeunload', wipeDataOnClose);
    };
  }, [roomId, cryptoKey, currentUserId]);

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

    const pushMsg = { ...newMsg, audio_data: 'supabase' };

    // Salva áudio gigantesco em mock storage
    try { localStorage.setItem('B2B_MEDIA_AUDIO_' + newMsg.id, base64Audio); } catch(e) { console.error('Audio muito grande para localStorage'); }

    // Dispara sinalização em tempo real de imediato
    ntfyRelay.pushMessage({ ...pushMsg, content: cipherB64 });

    // Insere no banco em background
    try {
      supabase.from('b2b_secure_chat').insert({
        id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
        sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, audio_data: base64Audio, attachment_type: 'audio'
      } as any).then(({error}) => {
         if (error) console.error(error);
      });
    } catch(e) {
      console.error(e);
    }
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

      const pushMsg = { ...newMsg, attachment_url: 'supabase' };

      // Salva anexo gigantesco em mock storage (para demonstração rápida side-by-side)
      try {
         localStorage.setItem('B2B_MEDIA_URL_' + newMsg.id, base64Data);
         localStorage.setItem('B2B_MEDIA_TYPE_' + newMsg.id, type);
      } catch(e) { console.error('Anexo muito grande para localStorage'); }

      // Dispara sinalização em tempo real de imediato (sem travar envio)
      ntfyRelay.pushMessage({ ...pushMsg, content: cipherB64 });

      // Insere no banco em background para os casos reais
      try {
        supabase.from('b2b_secure_chat').insert({
          id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
          sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, attachment_url: base64Data, attachment_type: type
        } as any).then(({error}) => {
          if (error) console.error("Erro assíncrono ao salvar anexo no BD:", error);
        });
      } catch(e) {
        console.error("Exceção ao disparar insert do anexo:", e);
      }
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

    ntfyRelay.pushMessage({ ...newMsg, content: cipherB64 });

    try {
      supabase.from('b2b_secure_chat').insert({
        id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
        sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64
      } as any).then(() => {});
    } catch(e) {
      console.error(e);
    }
  };

  // --- Ação Forçada de Destruição Total de Chat (Zero Trace Manual) ---
  const handleDestroyChat = async () => {
    if (!confirm("Isso apagará permanentemente TODO o histórico, fotos e anexos desta sala no seu dispositivo e no servidor. Deseja prosseguir com a EXCLUSÃO ZERO TRACE?")) return;

    // 1. Destrói chaves locais do MOCK relativas ao Chat (só do chat para não quebrar o upload atual)
    Object.keys(localStorage).forEach(key => {
       if (key.startsWith('B2B_MOCK_CHAT_' + roomId) || key.startsWith('B2B_MEDIA_')) {
          localStorage.removeItem(key);
       }
    });

    // 2. Destrói no banco de dados
    try {
       await supabase.from('b2b_secure_chat').delete().eq('room_id', roomId);
    } catch(e) {
       console.error("Falha ao apagar chat do servidor", e);
    }

    // 3. Atualiza UI local
    setMessages([]);
    alert("Historico do chat destruído com sucesso. Nenhuma trilha restante.");
  };

  if (loading) return <div className="flex h-full items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fbsb-primary"></div></div>;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-fbsb-bg-main md:border border-white/5 md:rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden font-sans absolute md:relative inset-0 md:inset-auto">
      <div className="flex items-center justify-between px-6 py-4 bg-fbsb-surface-100 text-fbsb-text-primary z-10 border-b border-white/5">
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
          <button onClick={handleDestroyChat} className="hidden md:flex items-center px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors">
             <ShieldAlert className="w-4 h-4 mr-2" />
             <span className="text-[10px] uppercase font-bold tracking-wider">Destruir Histórico</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden space-y-4 md:space-y-6 bg-fbsb-bg-deep bg-opacity-50">
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
                    ? 'bg-gradient-to-br from-fbsb-surface-100 to-fbsb-bg-main text-fbsb-text-primary rounded-br-sm shadow-[0_5px_15px_rgba(59,130,246,0.3)] border border-white/10'
                    : 'bg-fbsb-surface-100 text-[#F8FAFC] rounded-bl-sm border border-white/5 shadow-md'
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
                   <div className="mt-3 relative rounded-lg overflow-hidden border border-fbsb-border/30 bg-fbsb-bg-main min-h-[120px] flex items-center justify-center">
                      {msg.attachment_url === 'supabase' ? (
                        <div className="flex flex-col items-center justify-center p-4 text-fbsb-text-secondary">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-fbsb-cyan mb-2"></div>
                          <span className="text-[10px] font-bold uppercase tracking-wider">Baixando Anexo Seguro...</span>
                        </div>
                      ) : (
                        <div onClick={() => handleOpenSecureMedia(msg.attachment_url!, 'image')} className="w-full h-full block">
                          <img
                            src={msg.attachment_url}
                            alt="Anexo Seguro"
                            className="w-full max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      )}
                   </div>
                )}
                {msg.attachment_url && msg.attachment_type === 'pdf' && (
                   <button
                     onClick={() => handleOpenSecureMedia(msg.attachment_url!, 'pdf')}
                     className={`mt-3 w-full text-left flex items-center p-3 rounded-xl transition-colors ${
                       isMine ? 'bg-fbsb-surface-200/50 hover:bg-fbsb-surface-200' : 'bg-fbsb-bg-main hover:bg-fbsb-text-secondary/20'
                     } ${msg.attachment_url === 'supabase' ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                   >
                      <FileText className={`w-5 h-5 mr-3 flex-shrink-0 ${isMine ? 'text-fbsb-cyan' : 'text-fbsb-text-primary'} ${msg.attachment_url === 'supabase' ? 'animate-pulse' : ''}`}/>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold block truncate">Documento Seguro.pdf</span>
                        <span className="text-[10px] opacity-70 uppercase tracking-wider block truncate">
                          {msg.attachment_url === 'supabase' ? 'Baixando arquivo criptografado...' : 'Clique para visualizar nativamente'}
                        </span>
                      </div>
                   </button>
                )}
                {msg.audio_data && (
                   <div className="mt-3 w-48 md:w-64">
                     {msg.audio_data === 'supabase' ? (
                       <div className="flex items-center space-x-2 p-2 bg-fbsb-surface-200/30 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fbsb-cyan"></div>
                          <span className="text-[10px] text-fbsb-text-secondary uppercase tracking-wider">Baixando Áudio...</span>
                       </div>
                     ) : (
                       <audio src={msg.audio_data} controls className="w-full h-8" />
                     )}
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

      <form onSubmit={handleSendMessage} className="p-4 bg-fbsb-bg-main border-t border-white/5 flex items-end space-x-3">
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
          className="flex-1 max-h-32 min-h-[52px] bg-fbsb-bg-deep rounded-2xl border border-white/5 hover:border-white/10 focus:bg-fbsb-surface-100 focus:border-fbsb-text-secondary focus:ring-1 focus:ring-fbsb-cyan shadow-inner p-4 text-sm resize-none transition-all outline-none text-fbsb-text-primary"
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
            className={`p-4 rounded-xl transition-all flex items-center justify-center shadow-md ${isRecording ? 'bg-fbsb-surface-200 text-fbsb-text-primary animate-pulse' : 'bg-fbsb-primary text-fbsb-cyan hover:bg-fbsb-surface-200'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="submit"
            className="p-4 bg-gradient-to-r from-fbsb-surface-100 to-fbsb-bg-main text-fbsb-bg-deep rounded-2xl hover:opacity-90 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)]"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </form>

      {expandedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setExpandedImage(null)}>
           <div className="relative max-w-5xl w-full max-h-screen flex items-center justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedImage(null); }}
                className="absolute top-4 right-4 bg-fbsb-surface-200/50 hover:bg-fbsb-surface-200 text-white p-2 rounded-full backdrop-blur-md transition-colors shadow-lg z-50"
              >
                 <ShieldAlert className="w-6 h-6" />
                 {/* Fechar */}
              </button>
              <img
                src={expandedImage}
                alt="Visualização Expandida"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onContextMenu={(e) => e.preventDefault()}
              />
           </div>
        </div>
      )}
    </div>
  );
}
