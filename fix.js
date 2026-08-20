import fs from "fs";
let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');
const oldFetch = `  const fetchMessages = async () => {
    try {
      // Derivar a chave de criptografia baseada no ID da sala (Simulação de Handshake)
      const key = await deriveKey(roomId, 'SaaS-B2B-Secure-Salt');
      setCryptoKey(key);
      
      // Carrega histórico E2E da memória B2B MOCK
      const savedMessages = localStorage.getItem('B2B_MOCK_CHAT_' + roomId);
      if (savedMessages) {
         setMessages(JSON.parse(savedMessages));
      } else {
         setMessages([]);
      }
      setLoading(false);
    } catch (e) { }
  };`;
const newFetch = `  const fetchMessages = async () => {
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
    } catch (e) { setLoading(false); }
  };`;
content = content.replace(oldFetch, newFetch);
const newRealtime = `  useEffect(() => {
    const channel = supabase.channel('realtime_chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'b2b_secure_chat', filter: \ },
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
      .subscribe();
      
    const wipeDataOnClose = () => {
       supabase.from('b2b_secure_chat').delete().eq('room_id', roomId).then(() => {});
    };
    window.addEventListener('beforeunload', wipeDataOnClose);
      
    return () => { 
      supabase.removeChannel(channel); 
      window.removeEventListener('beforeunload', wipeDataOnClose);
    };
  }, [roomId, cryptoKey]);`;
content = content.replace(/  \/\* Realtime effect replaced \*\/\n/, newRealtime + '\n');
fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
