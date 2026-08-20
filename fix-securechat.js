import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');
content = content.replace(
  "if (decMsgs.length > prev.length) {",
  "if (JSON.stringify(decMsgs) !== JSON.stringify(prev)) {"
);
fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
