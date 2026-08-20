import fs from 'fs';

let chatCode = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

chatCode = chatCode.replace(
  /attachment_url\?: string;/,
  "attachment_url?: string;\n  attachment_type?: 'image' | 'pdf' | 'audio';\n  audio_data?: string;"
);

chatCode = chatCode.replace(
  /import \{ Send, Paperclip, ShieldAlert, Lock, User, FileText, CheckCheck \} from 'lucide-react';/,
  "import { Send, Paperclip, ShieldAlert, Lock, User, FileText, CheckCheck, Mic, Video, Camera, Image as ImageIcon } from 'lucide-react';"
);

chatCode = chatCode.replace(
  /const \[cryptoKey, setCryptoKey\] = useState<CryptoKey \| null>\(null\);/,
  "const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);\n  const [isRecording, setIsRecording] = useState(false);\n  const mediaRecorderRef = useRef<any>(null);\n  const audioChunksRef = useRef<any[]>([]);\n  const [isVideoActive, setIsVideoActive] = useState(false);\n  const fileInputRef = useRef<HTMLInputElement>(null);\n  const [securityBlur, setSecurityBlur] = useState(false);"
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', chatCode);
