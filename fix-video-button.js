import fs from 'fs';

let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

const importIcons = "import { ShieldCheck, Lock, Send, ShieldAlert, Paperclip, Video, VideoOff, Mic, MicOff, Camera } from 'lucide-react';";

content = content.replace(
  "import { ShieldCheck, Lock, Send, ShieldAlert, Paperclip } from 'lucide-react';",
  importIcons
);

const videoChatRender = `
      {isVideoActive && (
        <div className="absolute top-16 left-0 right-0 h-64 bg-fbsb-surface-200 border-b border-fbsb-border z-20 flex flex-col">
          <div className="flex-1 p-4 grid grid-cols-2 gap-4">
             <div className="bg-slate-800 rounded-xl overflow-hidden relative border border-fbsb-border shadow-glow-cyan flex items-center justify-center">
                {/* Simulação de feed da câmera protegida */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                <Camera className="w-10 h-10 text-fbsb-cyan/50 absolute" />
                <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-fbsb-surface-100/80 px-2 py-1 rounded text-white">{currentUserName} (Você)</span>
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-2 py-0.5 rounded flex items-center"><Lock className="w-3 h-3 mr-1"/> E2E</span>
             </div>
             <div className="bg-slate-800 rounded-xl overflow-hidden relative border border-fbsb-border flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-fbsb-surface-100 flex items-center justify-center text-xl text-fbsb-text-secondary border-2 border-fbsb-border font-bold">...</div>
                <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-fbsb-surface-100/80 px-2 py-1 rounded text-white tracking-widest">Aguardando...</span>
             </div>
          </div>
          <div className="h-12 bg-fbsb-bg-main flex items-center justify-center space-x-4">
             <button className="p-2 bg-fbsb-surface-100 rounded-full text-white hover:bg-fbsb-surface-200"><Mic className="w-4 h-4" /></button>
             <button className="p-2 bg-fbsb-surface-100 rounded-full text-white hover:bg-fbsb-surface-200"><Video className="w-4 h-4" /></button>
             <button onClick={() => setIsVideoActive(false)} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/30 border border-red-500/50"><VideoOff className="w-4 h-4" /></button>
          </div>
        </div>
      )}
`;

content = content.replace(
  `        <div className="hidden md:flex items-center px-3 py-1.5 bg-fbsb-surface-200 rounded-lg border border-fbsb-border">\n           <ShieldAlert className="w-4 h-4 text-fbsb-cyan mr-2" />\n           <span className="text-[10px] uppercase font-bold text-fbsb-bg-deep tracking-wider">Nível Máximo de Sigilo</span>\n        </div>\n      </div>`,
  `        <div className="flex items-center space-x-3">\n          <button onClick={() => setIsVideoActive(!isVideoActive)} className="flex items-center px-3 py-1.5 bg-fbsb-surface-200 hover:bg-fbsb-surface-300 rounded-lg border border-fbsb-cyan transition-colors text-fbsb-cyan">\n            <Video className="w-4 h-4 mr-2" />\n            <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline">Iniciar Reunião</span>\n          </button>\n          <div className="hidden md:flex items-center px-3 py-1.5 bg-fbsb-surface-200 rounded-lg border border-fbsb-border">\n             <ShieldAlert className="w-4 h-4 text-fbsb-cyan mr-2" />\n             <span className="text-[10px] uppercase font-bold text-fbsb-text-secondary tracking-wider">Alto Sigilo</span>\n          </div>\n        </div>\n      </div>\n${videoChatRender}`
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);

