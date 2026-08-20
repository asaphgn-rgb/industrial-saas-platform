import fs from 'fs';

let code = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// Replace the empty messages array with localStorage persistence so messages survive cross-tab or cross-user swaps
code = code.replace(
  /setMessages\(\[\]\);\s*setLoading\(false\);/,
  `// Carrega histórico E2E da memória B2B MOCK
      const savedMessages = localStorage.getItem('B2B_MOCK_CHAT_' + roomId);
      if (savedMessages) {
         setMessages(JSON.parse(savedMessages));
      } else {
         setMessages([]);
      }
      setLoading(false);`
);

// Update handleSendMessage to save to localStorage
code = code.replace(
  /setMessages\(prev => \[\.\.\.prev, newMsg\]\);/,
  `setMessages(prev => {
      const updated = [...prev, newMsg];
      localStorage.setItem('B2B_MOCK_CHAT_' + roomId, JSON.stringify(updated));
      return updated;
    });`
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', code);
