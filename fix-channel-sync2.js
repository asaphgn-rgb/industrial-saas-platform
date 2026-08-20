import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

const replacement = `  useEffect(() => {
    // FALLBACK DE ENGENHARIA DE COMUNICAÇÃO:
    // Polling contínuo independente do Supabase Realtime funcionar ou não.
    // Lemos não só o banco, mas a chave localStorage GLOBAL se precisarmos.
    const pollTimer = setInterval(async () => {
       if (!cryptoKey) return;
       try {
         // Tentativa 1: Nuvem (Postgres)
         const { data, error } = await supabase
           .from('b2b_secure_chat')
           .select('*')
           .eq('room_id', roomId)
           .order('created_at', { ascending: true });
           
         if (data && !error && data.length > 0) {
            const decMsgs = await Promise.all(data.map(async (msg: any) => ({
              ...msg,
              content: await decryptE2E(msg.content, cryptoKey)
            })));
            
            setMessages(prev => {
               if (prev.length === decMsgs.length) return prev;
               localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(decMsgs));
               return decMsgs as Message[];
            });
         }
       } catch (e) {}
       
       // Tentativa 2: LocalStorage Polling (Para guias na mesma máquina caso nuvem falhe)
       const saved = localStorage.getItem('B2B_MOCK_CHAT_' + roomId);
       if (saved) {
           const parsed = JSON.parse(saved);
           setMessages(prev => {
               if (parsed.length > prev.length) return parsed;
               return prev;
           });
       }
    }, 1500);
    
    // Broadcast Rápido P2P
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
      supabase.removeChannel(channel); 
      window.removeEventListener('beforeunload', wipeDataOnClose);
    };
  }, [roomId, cryptoKey]);`;

content = content.replace(/  useEffect\(\(\) => \{\n    \/\/ FALLBACK DE ENGENHARIA DE COMUNICAÇÃO:[\s\S]*?  \}, \[roomId, cryptoKey\]\);\n/, replacement);
fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);

