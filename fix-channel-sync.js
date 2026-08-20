import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// Corrigindo a assinatura do listener
const realtimeFix = `  useEffect(() => {
    // Escuta mutações no banco de dados para comunicação cross-device
    const channel = supabase.channel('realtime_chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'b2b_secure_chat', filter: \`room_id=eq.\${roomId}\` },
        async (payload) => {
          if (!cryptoKey) return;
          const newMsgCloud = payload.new;
          if (newMsgCloud.sender_id === currentUserId) return;
          
          try {
            const dec = await decryptE2E(newMsgCloud.content, cryptoKey);
            const msgObj = { ...newMsgCloud, content: dec };
            setMessages(prev => {
              const exists = prev.find(m => m.id === msgObj.id);
              if (exists) return prev;
              const up = [...prev, msgObj];
              localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up));
              return up;
            });
          } catch(e) {}
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log("Conectado ao canal E2E cross-device via Postgres");
        }
      });
      
    const wipeDataOnClose = () => {
       supabase.from('b2b_secure_chat').delete().eq('room_id', roomId).then(() => {});
    };
    window.addEventListener('beforeunload', wipeDataOnClose);
      
    return () => { 
      supabase.removeChannel(channel); 
      window.removeEventListener('beforeunload', wipeDataOnClose);
    };
  }, [roomId, cryptoKey]);`;

// Localizar onde está o bug antigo (o Broadcast que eu tentei limpar antes, mas falhou) e sobrescrever com o postgres_changes
content = content.replace(/  useEffect\(\(\) => \{\n    \/\/ Inscreve no canal de comunicação p2p global do supabase[\s\S]*?  \}, \[roomId\]\);\n/, realtimeFix + '\n');

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
