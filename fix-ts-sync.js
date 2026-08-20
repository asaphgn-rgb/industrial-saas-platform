import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

content = content.replace(
  /const msgObj = \{ \.\.\.newMsgCloud, content: dec \};/g,
  `const msgObj = { ...newMsgCloud, content: dec } as Message;`
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
