import fs from 'fs';

// mix-blend-mode: multiply numa imagem com fundo branco em um CONTAINER ESCURO (como o login ou app) 
// vai fazer a imagem SUMIR ou ficar muito apagada. 
// A cor de fundo principal é escura (bg-fbsb-surface-100 / bg-fbsb-bg-main).
// Para "remover" o branco num fundo escuro sem sumir as cores originais, a abordagem CSS simples (multiply) não funciona perfeitamente,
// e se usar algo como invert/luminance altera as cores ciano e azul.
// 
// Para contornar e ficar impecável no padrão de design: 
// 1. Envolver a logo numa tag <div> com fundo BRANCO, arredondada sutilmente (borderRadius), padding leve.
// 2. Isso transforma o fundo branco da logo num detalhe estético da interface, contrastando lindamente com o fundo escuro da plataforma.
// 3. Modifica a escala e padding para que as margens pareçam intencionais.

let contentLogin = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');
contentLogin = contentLogin.replace(
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(92,210,241,0.3)] mix-blend-multiply filter contrast-125 brightness-110" style={{ mixBlendMode: "multiply" }} />',
  '<div className="bg-white/95 p-3 rounded-2xl shadow-[0_0_20px_rgba(0,180,180,0.2)] border border-white/20"><img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-20 w-auto object-contain" /></div>'
);
fs.writeFileSync('src/components/auth/SecureLogin.tsx', contentLogin);


let contentApp = fs.readFileSync('src/App.tsx', 'utf8');
contentApp = contentApp.replace(
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-10 w-auto object-contain mr-4 mix-blend-multiply" style={{ mixBlendMode: "multiply" }} />',
  '<div className="bg-white/95 px-2.5 py-1 rounded-xl shadow-[0_0_10px_rgba(0,180,180,0.1)] border border-white/10 mr-4"><img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-8 w-auto object-contain" /></div>'
);
fs.writeFileSync('src/App.tsx', contentApp);


let contentAbout = fs.readFileSync('src/components/documents/SecureAboutPage.tsx', 'utf8');
contentAbout = contentAbout.replace(
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="w-full h-full object-contain mix-blend-multiply" style={{ mixBlendMode: "multiply" }} />',
  '<div className="w-full h-full bg-white/95 rounded-xl flex items-center justify-center p-2 shadow-sm border border-white/10"><img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="w-full h-full object-contain" /></div>'
);
contentAbout = contentAbout.replace(
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-16 mx-auto mb-4 relative z-10 object-contain mix-blend-multiply" style={{ mixBlendMode: "multiply" }} />',
  '<div className="h-20 w-max mx-auto mb-4 relative z-10 bg-white/95 rounded-2xl flex items-center justify-center p-3 shadow-glow-cyan border border-white/10"><img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-full w-auto object-contain" /></div>'
);
fs.writeFileSync('src/components/documents/SecureAboutPage.tsx', contentAbout);

