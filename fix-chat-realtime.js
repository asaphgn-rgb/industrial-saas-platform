import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

const supabaseImport = `import { supabase } from '../../lib/supabase';`;
if(!content.includes('import { supabase }')) {
    content = content.replace(`import React`, `${supabaseImport}\nimport React`);
}

const realtimeUseEffect = `
  useEffect(() => {
    // Inscreve no canal de comunicação p2p global do supabase (Broadcast Realtime sem persistir no banco)
    // Essa é a abordagem 100% cloud mas efêmera exigida pela FLECHA BSB. NADA FICA NO BANCO.
    const channel = supabase.channel('room_' + roomId)
      .on('broadcast', { event: 'new_message' }, payload => {
        setMessages(prev => {
          const exists = prev.find(m => m.id === payload.payload.id);
          if (exists) return prev;
          
          const updated = [...prev, payload.payload];
          localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));
          return updated;
        });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log("Conectado ao canal E2E cross-device");
        }
      });
      
    return () => { supabase.removeChannel(channel); };
  }, [roomId]);
`;

// Substituir o storage event antigo
content = content.replace(
  /  useEffect\(\(\) => \{\n    \/\/ Listener para pegar mensagens[\s\S]*?\}, \[roomId\]\);\n/,
  realtimeUseEffect
);

// Atualizar sendAudioMessage para dar broadcast
content = content.replace(
  /setMessages\(prev => \{ const up = \[\.\.\.prev, newMsg\]; localStorage\.setItem\('B2B_MOCK_CHAT_' \+ roomId, JSON\.stringify\(up\)\); return up; \}\);/,
  `setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });\n    await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });`
);

// Atualizar handleFileUpload para dar broadcast
content = content.replace(
  /setMessages\(prev => \{ const up = \[\.\.\.prev, newMsg\]; localStorage\.setItem\('B2B_MOCK_CHAT_' \+ roomId, JSON\.stringify\(up\)\); return up; \}\);\n    \};\n    reader\.readAsDataURL\(file\);/,
  `setMessages(prev => { const up = [...prev, newMsg]; localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(up)); return up; });\n      await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });\n    };\n    reader.readAsDataURL(file);`
);

// Atualizar handleSendMessage para dar broadcast
content = content.replace(
  /    setMessages\(prev => \{\n      const updated = \[\.\.\.prev, newMsg\];\n      localStorage\.setItem\('B2B_MOCK_CHAT_' \+ roomId, JSON\.stringify\(updated\)\);\n      return updated;\n    \}\);\n  \};\n/,
  `    setMessages(prev => {\n      const updated = [...prev, newMsg];\n      localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));\n      return updated;\n    });\n    await supabase.channel('room_' + roomId).send({ type: 'broadcast', event: 'new_message', payload: newMsg });\n  };\n`
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);

