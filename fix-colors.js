import fs from 'fs';

// Vamos varrer alguns arquivos chaves para remover classes utilitárias que forçam branco quando no dark mode,
// mas que agora no light mode não precisam (ou precisam ser ajustadas para não ficar branco no branco de forma ilegível).
// O Tailwind vai mapear fbsb-bg-main para quase branco, fbsb-text-primary para quase preto. 
// Onde tivermos texto fixo 'text-white' em fundos que agora são claros, vai sumir.
// O 'fbsb-primary' virou azul escuro (Blue 800), então texto 'text-white' em cima dele fica ótimo.

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
// O header tinha text-fbsb-bg-deep (que agora é quase branco) e bg-white (branco puro).
// Precisamos arrumar a logo no Header
// Substituir a tag img estática pela tag importada (resolve problema de deploy da Vercel)
appContent = appContent.replace(
  'import { QmsDocumentModule } from \'./components/QmsDocumentModule\';',
  "import { QmsDocumentModule } from './components/QmsDocumentModule';\nimport LogoUrl from '/logo-flecha.png';"
);

appContent = appContent.replace(
  '<img src="/logo-flecha.png"',
  '<img src={LogoUrl}'
);

// Remover o fundo branco forçado do header, deixar usar surface-100 que já é branco
appContent = appContent.replace(
  'header className="sticky top-0 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between z-30 border-b border-fbsb-border bg-white text-fbsb-bg-deep shadow-sm"',
  'header className="sticky top-0 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between z-30 border-b border-fbsb-border bg-fbsb-surface-100 shadow-sm"'
);

// Na sidebar, os botões ativos usavam bg-fbsb-primary (azul escuro) text-white (fica perfeito).
// No chat_secure, havia um fundo:
appContent = appContent.replace(
  'bg-[#f4f2ef]',
  'bg-fbsb-bg-main'
);

fs.writeFileSync('src/App.tsx', appContent);


// No Login
let loginContent = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');
loginContent = loginContent.replace(
  'import React, { useState } from \'react\';',
  "import React, { useState } from 'react';\nimport LogoUrl from '/logo-flecha.png';"
);
loginContent = loginContent.replace(
  '<img src="/logo-flecha.png"',
  '<img src={LogoUrl}'
);
fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginContent);


// No Chat
let chatContent = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');
chatContent = chatContent.replace(
  /bg-\[\#f4f2ef\] bg-\[url\('https:\/\/www\.transparenttextures\.com\/patterns\/cubes\.png'\)\]/g,
  "bg-fbsb-bg-main bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
);
chatContent = chatContent.replace(
  'text-white', // No header do chat, bg-fbsb-primary text-white -> perfeito, Blue 800 com branco.
  'text-white'
);
fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', chatContent);

