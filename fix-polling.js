import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// The polling interval is highly reliable for cross-device sync even when WebSockets are blocked by proxies or mobile carriers.
const pollingEffect = `
  useEffect(() => {
    // FALLBACK DE ENGENHARIA DE COMUNICAÇÃO:
    // Se o Supabase Realtime falhar por bloqueios de rede 4G ou falta de WebSockets na Vercel,
    // garantimos a sincronização Celular <-> Computador via Short-Polling de alta performance.
    const pollTimer = setInterval(async () => {
       if (!cryptoKey) return;
       try {
         const { data, error } = await supabase
           .from('b2b_secure_chat')
           .select('*')
           .eq('room_id', roomId)
           .order('created_at', { ascending: true });
           
         if (data && !error) {
            const decMsgs = await Promise.all(data.map(async (msg: any) => ({
              ...msg,
              content: await decryptE2E(msg.content, cryptoKey)
            })));
            
            // Só atualiza a tela se tiver novas mensagens para não piscar
            setMessages(prev => {
               if (prev.length === decMsgs.length) return prev;
               localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(decMsgs));
               return decMsgs as Message[];
            });
         }
       } catch (e) {}
    }, 2000); // 2 segundos (Long Polling Simulator)
    
    // Mantemos o listener Realtime como via principal rápida (Postgres Changes)
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
            const msgObj = { ...newMsgCloud, content: dec } as Message;
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
      .subscribe();
      
    const wipeDataOnClose = () => {
       supabase.from('b2b_secure_chat').delete().eq('room_id', roomId).then(() => {});
    };
    window.addEventListener('beforeunload', wipeDataOnClose);
      
    return () => { 
      clearInterval(pollTimer);
      supabase.removeChannel(channel); 
      window.removeEventListener('beforeunload', wipeDataOnClose);
    };
  }, [roomId, cryptoKey]);
`;

content = content.replace(/  useEffect\(\(\) => \{\n    \/\/ Escuta mutações no banco de dados para comunicação cross-device[\s\S]*?  \}, \[roomId, cryptoKey\]\);\n/, pollingEffect);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
