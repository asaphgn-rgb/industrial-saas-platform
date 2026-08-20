import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Atualizar header colors e logo container
content = content.replace(
  'className="bg-white/90 p-1.5 rounded-lg shadow-[0_0_15px_rgba(45,212,191,0.2)] mr-4 flex items-center justify-center"',
  'className="bg-white px-4 py-2 rounded flex items-center justify-center mr-4"'
);

// Atualizar height da logo
content = content.replace(
  'className="h-8 w-auto object-contain mix-blend-multiply"',
  'className="h-7 w-auto object-contain mix-blend-multiply opacity-90"'
);

// Atualizar header background
content = content.replace(
  'bg-[#0F1219]/90 backdrop-blur-xl',
  'bg-[#000000]/95 backdrop-blur-2xl'
);

// Atualizar sidebar background
content = content.replace(
  'w-72 bg-[#131720] border-r border-white/5',
  'w-72 bg-[#0A0A0A] border-r border-white/5'
);

// Atualizar botões da sidebar
content = content.replace(
  /bg-\[\#1A1F2C\] text-white shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.05\),0_0_15px_rgba\(45,212,191,0\.15\)\] border border-\[\#2DD4BF\]\/20/g,
  'bg-[#141414] text-white shadow-premium border border-white/5'
);

// Atualizar Main background gradient
content = content.replace(
  'bg-gradient-to-br from-[#0F1219] to-[#131720]',
  'bg-[#000000]'
);

fs.writeFileSync('src/App.tsx', content);
