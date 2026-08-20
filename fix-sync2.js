import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// Troca o MQTT que falhou por porta 8081 bloqueada no 4G pelo CloudSync HTTPS
content = content.replace(
  "import { mqttRelay } from '../../lib/mqttSync';",
  "import { cloudRelay } from '../../lib/cloudSync';"
);

const oldEffect = /  useEffect\(\(\) => \{\n    \/\/ Sincronização Serverless Multi-Dispositivo \(Garantia Tripla\)[\s\S]*?  \}, \[roomId, cryptoKey\]\);/g;

const newEffect = `  useEffect(() => {
    if (!cryptoKey) return;
    
    // Motor de Sincronização em Nuvem Absoluta (Bypass Vercel/Supabase config)
    cloudRelay.connect(roomId, async (cloudMessages) => {
        try {
           const decMsgs = await Promise.all(cloudMessages.map(async (msg: any) => {
              if (msg.content && msg.content.length > 50 && !msg.content.startsWith('http')) {
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
  }, [roomId, cryptoKey]);`;

content = content.replace(oldEffect, newEffect);

// Consertar as 3 funções de envio (sendAudio, handleFileUpload, handleSendMessage)
// Removendo as chamadas antigas do mqttRelay e colocando o cloudRelay.pushState
content = content.replace(
    /mqttRelay\.sendMessage\(\{ \.\.\.newMsg, content: cipherB64 \}\);/g,
    `cloudRelay.pushState([...messages, { ...newMsg, content: cipherB64 }]);`
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);

