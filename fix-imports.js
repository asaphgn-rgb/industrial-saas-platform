import fs from 'fs';
let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

content = content.replace(
  "import { Send, Paperclip, ShieldAlert, Lock, User, FileText, CheckCheck, Mic, Video, Camera, Image as ImageIcon } from 'lucide-react';",
  "import { Send, Paperclip, ShieldAlert, Lock, User, FileText, CheckCheck, Mic, Video, VideoOff, Camera, Image as ImageIcon } from 'lucide-react';"
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
