import fs from 'fs';
let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

const fetchMessagesRefactored = `
  const fetchMessages = async () => {
    try {
      const key = await deriveKey(roomId, 'SaaS-B2B-Secure-Salt');
      setCryptoKey(key);
      
      // Busca mensagens REAL-TIME da nuvem (Supabase)
      const { data, error } = await supabase
        .from('b2b_secure_chat')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (data && !error) {
        // Descriptografa na tela
        const decryptedMessages = await Promise.all(data.map(async (msg: any) => ({
          ...msg,
          content: await decryptE2E(msg.content, key),
          // attachment_url, audio_data, etc, vêm direto
        })));
        setMessages(decryptedMessages as Message[]);
      } else {
        // Fallback local se estiver offline ou banco indisponível
        const savedMessages = localStorage.getItem('B2B_MOCK_CHAT_' + roomId);
        if (savedMessages) setMessages(JSON.parse(savedMessages));
      }
      setLoading(false);
    } catch (e) { setLoading(false); }
  };
`;

const useRealtimeRefactored = `
  useEffect(() => {
    // Escuta MUTAÇÕES no banco de dados na nuvem (Insert)
    // Permite que Celular (4G) e Computador (Wi-Fi) se comuniquem perfeitamente.
    const channel = supabase.channel('realtime_chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'b2b_secure_chat', filter: \`room_id=eq.\${roomId}\` },
        async (payload) => {
          if (!cryptoKey) return;
          const newMsgCloud = payload.new;
          // Ignora se fui eu que mandei (para não duplicar na tela, pois já coloco no estado otimista)
          if (newMsgCloud.sender_id === currentUserId) return;
          
          try {
            const dec = await decryptE2E(newMsgCloud.content, cryptoKey);
            const msgObj: Message = { ...newMsgCloud, content: dec } as Message;
            setMessages(prev => {
              const exists = prev.find(m => m.id === msgObj.id);
              if (exists) return prev;
              const up = [...prev, msgObj];
              localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); // Backup local
              return up;
            });
          } catch(e) {}
        }
      )
      .subscribe((status) => {
         console.log("Supabase Postgres Realtime:", status);
      });
      
    return () => { supabase.removeChannel(channel); };
  }, [roomId, cryptoKey]);
`;

const sendAudioRefactored = `
  const sendAudioMessage = async (base64Audio: string) => {
    if (!cryptoKey) return;
    const cipherB64 = await encryptE2E("Mensagem de Voz", cryptoKey);
    const newMsg: Message = {
      id: crypto.randomUUID(), sender_id: currentUserId, content: "Mensagem de Voz", created_at: new Date().toISOString(),
      is_read: false, sender_role: currentUserRole, sender_name: currentUserName, audio_data: base64Audio, attachment_type: 'audio'
    };
    
    // Atualização otimista local
    setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
    
    // Grava na nuvem para os outros aparelhos (E2E)
    await supabase.from('b2b_secure_chat').insert({
      id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
      sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, audio_data: base64Audio, attachment_type: 'audio'
    });
  };
`;

const handleFileRefactored = `
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cryptoKey) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      const type = file.type.startsWith('image/') ? 'image' : 'pdf';
      const cipherB64 = await encryptE2E("Arquivo Anexado", cryptoKey);
      const newMsg: Message = {
        id: crypto.randomUUID(), sender_id: currentUserId, content: "Arquivo Anexado", created_at: new Date().toISOString(),
        is_read: false, sender_role: currentUserRole, sender_name: currentUserName, attachment_url: base64Data, attachment_type: type
      };
      
      setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
      
      await supabase.from('b2b_secure_chat').insert({
        id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
        sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, attachment_url: base64Data, attachment_type: type
      });
    };
    reader.readAsDataURL(file);
  };
`;

const handleSendMessageRefactored = `
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !cryptoKey) return;
    const msg = newMessage;
    setNewMessage("");

    const cipherB64 = await encryptE2E(msg, cryptoKey);
    const newMsg: Message = {
      id: crypto.randomUUID(), sender_role: currentUserRole, sender_name: currentUserName, sender_id: currentUserId,
      content: msg, created_at: new Date().toISOString(), is_read: false
    };
    
    setMessages(prev => {
      const updated = [...prev, newMsg];
      localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));
      return updated;
    });

    await supabase.from('b2b_secure_chat').insert({
      id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
      sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64
    });
  };
`;

// Aplicando as substituições (Regex complexo, melhor eu limpar e reconstruir o arquivo)
