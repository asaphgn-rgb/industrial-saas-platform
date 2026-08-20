import fs from 'fs';

// Ajustando a UI do SecureChat para o Neumorphism escuro
let chatContent = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// Container do Chat
chatContent = chatContent.replace(
  'max-w-5xl mx-auto bg-fbsb-surface-100 md:border border-fbsb-border md:rounded-2xl shadow-premium overflow-hidden',
  'max-w-5xl mx-auto bg-[#131720] md:border border-white/5 md:rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden'
);

// Header do Chat
chatContent = chatContent.replace(
  'bg-fbsb-primary text-white z-10',
  'bg-[#1A1F2C] text-white z-10 border-b border-white/5'
);

// Fundo da área de mensagens
chatContent = chatContent.replace(
  'bg-fbsb-bg-main bg-[url(\'https://www.transparenttextures.com/patterns/cubes.png\')]',
  'bg-[#0F1219]' // Removendo a textura que deixava feio no modo escuro profundo, deixando clean
);

// Balões de Mensagem E2E (Minhas mensagens e as dos outros)
// Minha mensagem (Azul profundo neon)
chatContent = chatContent.replace(
  'bg-fbsb-primary text-white rounded-br-sm shadow-premium',
  'bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] text-white rounded-br-sm shadow-[0_5px_15px_rgba(59,130,246,0.3)] border border-white/10'
);

// Mensagem dos outros (Cinza azulado escuro)
chatContent = chatContent.replace(
  'bg-fbsb-surface-100 text-fbsb-text-primary rounded-bl-sm border border-fbsb-border shadow-sm',
  'bg-[#1A1F2C] text-[#F8FAFC] rounded-bl-sm border border-white/5 shadow-md'
);

// Área de Input
chatContent = chatContent.replace(
  'p-4 bg-fbsb-surface-100 border-t border-fbsb-border flex items-end space-x-3',
  'p-4 bg-[#131720] border-t border-white/5 flex items-end space-x-3'
);
chatContent = chatContent.replace(
  'bg-fbsb-bg-main/50 rounded-xl border border-transparent hover:border-fbsb-border focus:bg-fbsb-surface-100 focus:border-fbsb-cyan focus:ring-1 focus:ring-fbsb-cyan',
  'bg-[#0F1219] rounded-2xl border border-white/5 hover:border-white/10 focus:bg-[#1A1F2C] focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] shadow-inner'
);

// Botão Enviar
chatContent = chatContent.replace(
  'bg-fbsb-primary text-fbsb-cyan rounded-xl hover:bg-fbsb-surface-200 transition-all flex items-center justify-center shadow-md shadow-fbsb-primary/20',
  'bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-[#0F1219] rounded-2xl hover:opacity-90 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)]'
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', chatContent);
