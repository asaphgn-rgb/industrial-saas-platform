import React, { useState, useEffect, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { ShieldAlert, FileText, CheckCheck, Loader2 } from 'lucide-react';

interface VideoConferenceRoomProps {
  roomId: string;
  roomName: string;
  currentUserName: string;
  onClose: () => void;
  onAtaGenerated: (ataContent: string) => void;
}

export function VideoConferenceRoom({ roomId, roomName, currentUserName, onClose, onAtaGenerated }: VideoConferenceRoomProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [recognition, setRecognition] = useState<any>(null);

  // Configuração da Web Speech API para capturar a fala local e gerar a Ata da reunião
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognitionAPI();

      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'pt-BR';

      rec.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim()) {
           const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
           setTranscription(prev => [...prev, `[${timestamp}] ${currentUserName}: ${finalTranscript.trim()}`]);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Erro na transcrição:", event.error);
      };

      setRecognition(rec);
    } else {
      console.warn("Speech Recognition API não suportada neste navegador.");
    }
  }, [currentUserName]);

  const toggleRecording = () => {
    if (!recognition) return alert("Seu navegador não suporta geração de Ata automatizada via voz (Requer Google Chrome ou Edge).");

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);

      // Gera a Ata ISO 9000 Baseada nas Transcrições
      if (transcription.length > 0) {
         const dataHoje = new Date().toLocaleDateString('pt-BR');
         const ataLayout = `ATA DE REUNIÃO - PADRÃO ISO 9001:2015\n=======================================\nSala: ${roomName}\nData: ${dataHoje}\n\n=== TRANSCRIÇÃO DOS TÓPICOS ===\n${transcription.join('\n')}\n\n=== DELIBERAÇÕES & STATUS ===\n- Documento gerado automaticamente pelo motor cognitivo FLECHA BSB.\n- Aprovado por assinatura digital inerente à sessão de ${currentUserName}.`;
         onAtaGenerated(ataLayout);
      } else {
         alert("Nenhuma fala detectada para compor a Ata.");
      }
    } else {
      setTranscription([]);
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleJitsiReadyToClose = () => {
     if (isRecording && recognition) {
        recognition.stop();
     }
     onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-fbsb-bg-deep">

      {/* Header Topo da Sala */}
      <div className="h-16 bg-fbsb-surface-100 border-b border-fbsb-border flex items-center justify-between px-6 z-10 shadow-md">
        <div className="flex items-center space-x-4">
           <div className="flex items-center justify-center p-2 rounded-lg bg-fbsb-bg-main border border-white/5">
              <ShieldAlert className="w-5 h-5 text-fbsb-cyan" />
           </div>
           <div>
              <h2 className="text-white font-bold font-serif">{roomName} (WebRTC)</h2>
              <p className="text-[10px] text-fbsb-cyan uppercase tracking-widest">Protocolo P2P - Criptografia em Trânsito</p>
           </div>
        </div>

        <div className="flex items-center space-x-4">
           {isRecording && (
             <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] uppercase font-bold tracking-widest">Gravando Ata...</span>
             </div>
           )}
           <button
             onClick={toggleRecording}
             className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
               isRecording ? 'bg-fbsb-surface-200 text-fbsb-text-primary' : 'bg-fbsb-cyan text-fbsb-bg-deep hover:bg-fbsb-surface-300 shadow-glow-cyan'
             }`}
           >
              {isRecording ? (
                 <>
                   <CheckCheck className="w-4 h-4 mr-2" />
                   Gerar Ata ISO 9000
                 </>
              ) : (
                 <>
                   <FileText className="w-4 h-4 mr-2" />
                   Gravar Reunião & Ata
                 </>
              )}
           </button>
           <button
             onClick={handleJitsiReadyToClose}
             className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-red-500/30"
           >
              Sair da Sala
           </button>
        </div>
      </div>

      {/* Conteúdo Jitsi (IFrame) */}
      <div className="flex-1 relative bg-black">
         <JitsiMeeting
            domain="meet.jit.si"
            roomName={`FLECHA_BSB_${roomId.replace(/[^a-zA-Z0-9]/g, '')}`}
            configOverwrite={{
               startWithAudioMuted: false,
               startWithVideoMuted: false,
               disableModeratorIndicator: true,
               startScreenSharing: true,
               enableEmailInStats: false
            }}
            interfaceConfigOverwrite={{
               DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
               SHOW_PROMOTIONAL_CLOSE_PAGE: false,
               SHOW_JITSI_WATERMARK: false,
               SHOW_BRAND_WATERMARK: false,
            }}
            userInfo={{
               displayName: currentUserName,
               email: 'user@flechabsb.com'
            }}
            onApiReady={(externalApi) => {
               // Capturar evento quando usuário clica em Desligar no Jitsi
               externalApi.addListener('readyToClose', handleJitsiReadyToClose);
            }}
            getIFrameRef={(iframeRef) => {
               iframeRef.style.height = '100%';
               iframeRef.style.width = '100%';
               iframeRef.style.border = 'none';
            }}
            spinner={() => (
               <div className="flex flex-col h-full w-full items-center justify-center text-fbsb-cyan">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <p className="font-serif tracking-widest">ESTABELECENDO CONEXÃO P2P...</p>
               </div>
            )}
         />
      </div>

    </div>
  );
}
