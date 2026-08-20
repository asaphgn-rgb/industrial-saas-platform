import fs from 'fs';

// 1. Corrigir App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Remover opacity-90 da imagem para não escurecer o fundo branco dela
appContent = appContent.replace(
  'className="h-7 w-auto object-contain mix-blend-multiply opacity-90"',
  'className="h-7 w-auto object-contain mix-blend-multiply"'
);

// O container já é bg-white em App.tsx, mas vamos garantir que fique perfeito
// "bg-white px-4 py-2 rounded flex items-center justify-center mr-4" - vamos deixar os cantos mais suaves
appContent = appContent.replace(
  'className="bg-white px-4 py-2 rounded flex items-center justify-center mr-4"',
  'className="bg-white px-4 py-2 rounded-xl flex items-center justify-center mr-4 shadow-sm"'
);

fs.writeFileSync('src/App.tsx', appContent);

// 2. Corrigir SecureLogin.tsx
let loginContent = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

// O container da logo estava bg-white/95, vamos mudar para pure bg-white para igualar ao fundo da logo
loginContent = loginContent.replace(
  'className="flex items-center mb-8 bg-white/95 px-6 py-4 rounded-2xl w-fit shadow-md"',
  'className="flex items-center mb-8 bg-white px-6 py-4 rounded-3xl w-fit shadow-lg"'
);

// A imagem em SecureLogin.tsx não tinha mix-blend-multiply, então o quadrado branco dela cobria os cantos arredondados do container se ela fosse maior!
// Vamos adicionar mix-blend-multiply na imagem do login
loginContent = loginContent.replace(
  'className="h-28 w-auto object-contain"',
  'className="h-28 w-auto object-contain mix-blend-multiply"'
);

fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginContent);
