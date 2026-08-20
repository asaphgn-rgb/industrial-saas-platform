import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

const newEffect = `
  useEffect(() => {
    // Sincronização Serverless Multi-Dispositivo (Garantia Tripla)
    
    // 1. Polling de Alta Performance (Banco de Dados Opcional)
    const pollTimer = setInterval(async () => {
       if (!cryptoKey) return;
       try {
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
    }, 1500);
    
    // 2. Broadcast Channel (P2P Nuvem Livre para Mobile vs Desktop)
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
      
    // 3. Destruir Rastros
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

// Substituir hook principal
content = content.replace(/  useEffect\(\(\) => \{\n    \/\/ FALLBACK DE ENGENHARIA DE COMUNICAÇÃO:[\s\S]*?  \}, \[roomId, cryptoKey\]\);\n/, newEffect);

const sendMsgFix = `
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
    
    // TRUQUE: Disparar pelo Broadcast (Instantaneo PC <-> Celular)
    await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });
    
    // Em paralelo, tentar gravar no banco (caso o usuario tenha DB)
    try {
      await supabase.from('b2b_secure_chat').insert({
        id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
        sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64
      } as any);
    } catch(e) {}
  };
`;

content = content.replace(/  const handleSendMessage = async \(e: React\.FormEvent\) => \{[\s\S]*?  \};\n/, sendMsgFix);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
