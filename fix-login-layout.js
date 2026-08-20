import fs from 'fs';

let content = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

// Fundo principal da página
content = content.replace(
  'bg-fbsb-surface-200 flex',
  'bg-[#000000] flex'
);

// Remover os blobs coloridos, deixar sutil se quiser ou remover
content = content.replace(
  '<div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-fbsb-primary rounded-full blur-[120px] opacity-40"></div>',
  '<div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-fbsb-cyan rounded-full blur-[150px] opacity-10"></div>'
);
content = content.replace(
  '<div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-fbsb-cyan rounded-full blur-[150px] opacity-10"></div>',
  ''
);

// Painel Esquerdo (Marketing)
content = content.replace(
  'bg-white relative border-r border-white/10',
  'bg-[#0A0A0A] relative border-r border-white/5'
);

// Ajustar cores do texto no Painel Esquerdo
content = content.replace(/text-slate-600/g, 'text-[#A3A3A3]');
content = content.replace(/text-slate-900/g, 'text-white');

// Logo no painel esquerdo
content = content.replace(
  'className="flex items-center mb-8"',
  'className="flex items-center mb-8 bg-white/95 px-6 py-4 rounded-2xl w-fit shadow-md"'
);

// Cor do fundo do Form (Painel Direito)
content = content.replace(
  'p-8 md:p-12 flex flex-col justify-center bg-fbsb-surface-100 relative',
  'p-8 md:p-12 flex flex-col justify-center bg-[#141414] relative'
);

// Botão Primário (Gold com texto preto)
content = content.replace(
  'text-white bg-fbsb-primary hover:bg-fbsb-surface-200 shadow-premium',
  'text-[#000000] bg-fbsb-cyan hover:bg-[#D4AF37] shadow-glow-cyan'
);
// Ajuste no ícone do botão quando não carregando
content = content.replace(
  '<Fingerprint className="w-5 h-5 mr-2 text-fbsb-cyan" />',
  '<Fingerprint className="w-5 h-5 mr-2 text-black" />'
);
content = content.replace(
  '<Lock className="animate-pulse w-5 h-5 mr-2 text-fbsb-cyan" />',
  '<Lock className="animate-pulse w-5 h-5 mr-2 text-black" />'
);

// Fundo dos inputs
content = content.replace(
  /bg-fbsb-surface-200 focus:bg-fbsb-surface-100/g,
  'bg-[#0A0A0A] focus:bg-[#1C1C1E]'
);

fs.writeFileSync('src/components/auth/SecureLogin.tsx', content);
