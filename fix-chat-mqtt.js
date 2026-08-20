import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// Adicionando importação do relay MQTT
content = content.replace("import { supabase } from '../../lib/supabase';", 
`import { supabase } from '../../lib/supabase';
import { mqttRelay } from '../../lib/mqttSync';`);

// Trocando a lógica do useEffect para plugar o MQTT Relay
const oldUseEffect = /  useEffect\(\(\) => \{\n    \/\/ FALLBACK DE ENGENHARIA DE COMUNICAÇÃO:[\s\S]*?  \}, \[roomId, cryptoKey\]\);/g;

const newUseEffect = `  useEffect(() => {
    // FALLBACK DE ENGENHARIA DE COMUNICAÇÃO (MQTT P2P Relay):
    // Resolve o problema de Celular vs Computador ignorando falhas do Supabase/Vercel
    if (!cryptoKey) return;

    // Conecta no MQTT
    mqttRelay.connect(roomId, async (payload) => {
      // Ignora mensagens enviadas por mim mesmo (já renderizadas localmente)
      if (payload.sender_id === currentUserId) return;
      
      try {
        const decMsg = { ...payload };
        if (payload.content && !payload.content.startsWith('http') && !payload.content.startsWith('data:')) {
           decMsg.content = await decryptE2E(payload.content, cryptoKey);
        }
        
        setMessages(prev => {
          const exists = prev.find(m => m.id === decMsg.id);
          if (exists) return prev;
          const up = [...prev, decMsg];
          localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up));
          return up;
        });
      } catch(e) {}
    });
       
    // Tentativa 2: LocalStorage Polling (Para guias na mesma máquina caso nuvem falhe)
    const pollTimer = setInterval(async () => {
       const saved = localStorage.getItem('B2B_MOCK_CHAT_' + roomId);
       if (saved) {
           const parsed = JSON.parse(saved);
           setMessages(prev => {
               if (parsed.length > prev.length) return parsed;
               return prev;
           });
       }
    }, 1500);
    
    // Broadcast Rápido Supabase (Mantido como backup do backup)
    const channel = supabase.channel('room_' + roomId)
      .on('broadcast', { event: 'new_message' }, async (payload) => {
          if (!cryptoKey) return;
          const msgCloud = payload.payload;
          if (msgCloud.sender_id === currentUserId) return;
          
          try {
            setMessages(prev => {
              const exists = prev.find(m => m.id === msgCloud.id);
              if (exists) return prev;
              const up = [...prev, msgCloud];
              localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up));
              return up;
            });
          } catch(e) {}
      })
      .subscribe();
      
    const wipeDataOnClose = () => {
       supabase.from('b2b_secure_chat').delete().eq('room_id', roomId).then(() => {});
    };
    window.addEventListener('beforeunload', wipeDataOnClose);
      
    return () => { 
      clearInterval(pollTimer);
      mqttRelay.disconnect();
      supabase.removeChannel(channel); 
      window.removeEventListener('beforeunload', wipeDataOnClose);
    };
  }, [roomId, cryptoKey]);`;

content = content.replace(oldUseEffect, newUseEffect);


// Atualizando sendAudioMessage
const oldSendAudio = /    \/\/ Atualização otimista local\n    setMessages\([\s\S]*?\n    \/\/ Grava na nuvem para os outros aparelhos \(E2E\)\n    await supabase.from\('b2b_secure_chat'\).insert\(\{[\s\S]*?\}\);/g;

const newSendAudio = `    // Atualização otimista local
    setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
    
    // Envia via MQTT (P2P Nuvem - Celular vs Computador)
    const payloadMqtt = { ...newMsg, content: cipherB64 };
    mqttRelay.sendMessage(payloadMqtt);
    
    // Tenta Supabase (Backup)
    supabase.from('b2b_secure_chat').insert({
      id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
      sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, audio_data: base64Audio, attachment_type: 'audio'
    }).then(()=>{}).catch(()=>{});`;

content = content.replace(oldSendAudio, newSendAudio);

// Atualizando handleSendMessage
const oldSendMessage = /    setMessages\(prev => \{\n      const updated = \[\.\.\.prev, newMsg\];\n      localStorage\.setItem\('B2B_MOCK_CHAT_' \+ roomId, JSON\.stringify\(updated\)\);\n      return updated;\n    \}\);\n\n    await supabase\.from\('b2b_secure_chat'\)\.insert\(\{[\s\S]*?\}\);/g;

const newSendMessage = `    setMessages(prev => {
      const updated = [...prev, newMsg];
      localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));
      return updated;
    });

    // Envia via MQTT (P2P Nuvem - Celular vs Computador)
    const payloadMqtt = { ...newMsg, content: cipherB64 };
    mqttRelay.sendMessage(payloadMqtt);

    // Tenta Supabase (Backup)
    supabase.from('b2b_secure_chat').insert({
      id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
      sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64
    }).then(()=>{}).catch(()=>{});`;

content = content.replace(oldSendMessage, newSendMessage);

// Atualizando handleFileUpload
const oldUpload = /      setMessages\(prev => \{ const up = \[\.\.\.prev, newMsg\]; localStorage\.setItem\('B2B_MOCK_CHAT_' \+ roomId, JSON\.stringify\(up\)\); return up; \}\);\n      \n      await supabase\.from\('b2b_secure_chat'\)\.insert\(\{[\s\S]*?\}\);/g;

const newUpload = `      setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
      
      // Envia via MQTT (P2P Nuvem - Celular vs Computador)
      const payloadMqtt = { ...newMsg, content: cipherB64 };
      mqttRelay.sendMessage(payloadMqtt);

      // Tenta Supabase (Backup)
      supabase.from('b2b_secure_chat').insert({
        id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
        sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, attachment_url: base64Data, attachment_type: type
      }).then(()=>{}).catch(()=>{});`;

content = content.replace(oldUpload, newUpload);


fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);

