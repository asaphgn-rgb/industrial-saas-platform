import fs from 'fs';

let code = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// Adding cross-tab / cross-login listener for live demo
const crossTabCode = `
  useEffect(() => {
    // Listener para pegar mensagens de outras abas ou usuários que acabaram de logar
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'B2B_MOCK_CHAT_' + roomId && e.newValue) {
        setMessages(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [roomId]);
`;

code = code.replace(
  /useEffect\(\(\) => \{\n    fetchMessages\(\);\n\n    \/\/ Removemos a subscription do Realtime para o mock não travar caso o DB falhe offline\n  \}, \[roomId\]\);/,
  `useEffect(() => {
    fetchMessages();
  }, [roomId]);
${crossTabCode}`
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', code);
