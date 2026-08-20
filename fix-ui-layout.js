import fs from 'fs';

// Ajustando a UI geral do App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Header mais refinado (Glassmorphism de alto nível real)
appContent = appContent.replace(
  'header className="sticky top-0 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between z-30 border-b border-fbsb-border/50 bg-fbsb-surface-100/80 backdrop-blur-md shadow-premium"',
  'header className="sticky top-0 px-4 md:px-8 py-4 flex items-center justify-between z-30 border-b border-white/5 bg-[#0F1219]/90 backdrop-blur-xl shadow-premium"'
);

// Sidebar de fundo navy
appContent = appContent.replace(
  'w-72 bg-fbsb-surface-100 border-r border-fbsb-border p-6',
  'w-72 bg-[#131720] border-r border-white/5 p-6'
);

// Ajustando Botões da Sidebar para parecerem as pílulas da referência
appContent = appContent.replace(
  /'bg-fbsb-primary text-white shadow-premium'/g,
  "'bg-[#1A1F2C] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_15px_rgba(45,212,191,0.15)] border border-[#2DD4BF]/20'"
);

// Ajustar Main container background
appContent = appContent.replace(
  'main className="flex-1 overflow-y-auto bg-fbsb-bg-main relative"',
  'main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0F1219] to-[#131720] relative"'
);

fs.writeFileSync('src/App.tsx', appContent);

