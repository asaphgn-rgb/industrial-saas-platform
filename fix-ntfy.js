import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

content = content.replace("import { cloudRelay } from '../../lib/cloudSync';", "import { ntfyRelay } from '../../lib/ntfySync';");

const oldCloudSyncEffect = /\/\/ Motor de Sincronização em Nuvem Absoluta[\s\S]*?cloudRelay\.disconnect\(\);\n      window\.removeEventListener\('beforeunload', wipeDataOnClose\);\n    };\n  \}, \[roomId, cryptoKey\]\);/g;

const newNtfyEffect = `// Motor de Sincronização Absoluto via Ntfy (Bypass Total Vercel/Supabase, Porta 443)
    ntfyRelay.connect(roomId, async (payload) => {
        if (!cryptoKey || payload.sender_id === currentUserId) return;
        
        try {
           let decContent = payload.content;
           if (payload.content && payload.content.length > 20 && !payload.content.startsWith('http')) {
               try { decContent = await decryptE2E(payload.content, cryptoKey); } catch(e) {}
           }
           const finalMsg = { ...payload, content: decContent };
           
           setMessages(prev => {
              const exists = prev.find(m => m.id === finalMsg.id);
              if (exists) return prev;
              
              const updated = [...prev, finalMsg];
              localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));
              return updated;
           });
        } catch(e) {}
    });

    const wipeDataOnClose = () => {
       supabase.from('b2b_secure_chat').delete().eq('room_id', roomId).then(() => {});
    };
    window.addEventListener('beforeunload', wipeDataOnClose);

    return () => {
      ntfyRelay.disconnect();
      window.removeEventListener('beforeunload', wipeDataOnClose);
    };
  }, [roomId, cryptoKey, currentUserId]);`;

content = content.replace(oldCloudSyncEffect, newNtfyEffect);

// Substituir pushState por pushMessage
content = content.replace(/cloudRelay\.pushState\(\[\.\.\.messages, \{ \.\.\.newMsg, content: cipherB64 \}\]\);/g, "ntfyRelay.pushMessage({ ...newMsg, content: cipherB64 });");

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
