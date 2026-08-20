import fs from "fs";
let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');
const oldSendAudio = `  const sendAudioMessage = async (base64Audio: string) => {
    if (!cryptoKey) return;
    const cipherB64 = await encryptE2E(\"Mensagem de Voz\", cryptoKey);
    const decrypted = await decryptE2E(cipherB64, cryptoKey);
    const newMsg: Message = {
      id: Math.random().toString(), sender_id: currentUserId, content: decrypted, created_at: new Date().toISOString(),
      is_read: false, sender_role: currentUserRole, sender_name: currentUserName, audio_data: base64Audio, attachment_type: 'audio'
    };
    setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
    await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });
  };`;
const newSendAudio = `  const sendAudioMessage = async (base64Audio: string) => {
    if (!cryptoKey) return;
    const cipherB64 = await encryptE2E(\"Mensagem de Voz\", cryptoKey);
    const decrypted = await decryptE2E(cipherB64, cryptoKey);
    const newMsg: Message = {
      id: crypto.randomUUID(), sender_id: currentUserId, content: decrypted, created_at: new Date().toISOString(),
      is_read: false, sender_role: currentUserRole, sender_name: currentUserName, audio_data: base64Audio, attachment_type: 'audio'
    };
    setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
    
    await supabase.from('b2b_secure_chat').insert({
      id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
      sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, audio_data: base64Audio, attachment_type: 'audio'
    }).catch(()=>{});
  };`;
content = content.replace(oldSendAudio, newSendAudio);
const oldHandleFile = `  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cryptoKey) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      const type = file.type.startsWith('image/') ? 'image' : 'pdf';
      const cipherB64 = await encryptE2E(\"Arquivo Anexado\", cryptoKey);
      const decrypted = await decryptE2E(cipherB64, cryptoKey);
      const newMsg: Message = {
        id: Math.random().toString(), sender_id: currentUserId, content: decrypted, created_at: new Date().toISOString(),
        is_read: false, sender_role: currentUserRole, sender_name: currentUserName, attachment_url: base64Data, attachment_type: type
      };
      setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
      await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });
    };
    reader.readAsDataURL(file);
  };`;
const newHandleFile = `  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cryptoKey) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      const type = file.type.startsWith('image/') ? 'image' : 'pdf';
      const cipherB64 = await encryptE2E(\"Arquivo Anexado\", cryptoKey);
      const decrypted = await decryptE2E(cipherB64, cryptoKey);
      const newMsg: Message = {
        id: crypto.randomUUID(), sender_id: currentUserId, content: decrypted, created_at: new Date().toISOString(),
        is_read: false, sender_role: currentUserRole, sender_name: currentUserName, attachment_url: base64Data, attachment_type: type
      };
      setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });
      
      await supabase.from('b2b_secure_chat').insert({
        id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
        sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64, attachment_url: base64Data, attachment_type: type
      }).catch(()=>{});
    };
    reader.readAsDataURL(file);
  };`;
content = content.replace(oldHandleFile, newHandleFile);
const oldHandleSend = `  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !cryptoKey) return;
    const msg = newMessage;
    setNewMessage(\"\");

    // Cifra a mensagem antes de \"mandar para o banco\"
    // No banco de dados real isso salva o cipherB64, e nem a administração lê.
    const cipherB64 = await encryptE2E(msg, cryptoKey);
    
    // Simulando que o recebedor vai decifrar a mensagem instantaneamente na UI:
    const decrypted = await decryptE2E(cipherB64, cryptoKey);

    const newMsg: Message = {
      sender_role: currentUserRole,
      sender_name: currentUserName,
      id: Math.random().toString(),
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
    await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });
  };`;
const newHandleSend = `  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !cryptoKey) return;
    const msg = newMessage;
    setNewMessage(\"\");

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
    
    await supabase.from('b2b_secure_chat').insert({
      id: newMsg.id, tenant_id: 'tenant-industrial-demo-uuid', room_id: roomId, sender_id: currentUserId,
      sender_name: currentUserName, sender_role: currentUserRole, content: cipherB64
    }).catch(()=>{});
  };`;
content = content.replace(oldHandleSend, newHandleSend);
fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
