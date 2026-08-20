import fs from 'fs';

// Como não consigo rodar Photoshop ou ferramentas avançadas de remoção de fundo com transparência alfa real
// usando IA diretamente no terminal, o que podemos fazer é aplicar uma classe CSS que remove/mescla 
// o fundo branco através de "mix-blend-mode" ou filtros CSS na hora de renderizar a imagem, 
// o que resolve o problema de design imediatamente.

let contentLogin = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');
contentLogin = contentLogin.replace(
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(92,210,241,0.3)]" />',
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(92,210,241,0.3)] mix-blend-multiply filter contrast-125 brightness-110" style={{ mixBlendMode: "multiply" }} />'
);
fs.writeFileSync('src/components/auth/SecureLogin.tsx', contentLogin);

let contentApp = fs.readFileSync('src/App.tsx', 'utf8');
contentApp = contentApp.replace(
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-10 w-auto object-contain mr-4" />',
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-10 w-auto object-contain mr-4 mix-blend-multiply" style={{ mixBlendMode: "multiply" }} />'
);
fs.writeFileSync('src/App.tsx', contentApp);

let contentAbout = fs.readFileSync('src/components/documents/SecureAboutPage.tsx', 'utf8');
contentAbout = contentAbout.replace(
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="w-full h-full object-contain" />',
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="w-full h-full object-contain mix-blend-multiply" style={{ mixBlendMode: "multiply" }} />'
);
contentAbout = contentAbout.replace(
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-16 mx-auto mb-4 relative z-10 object-contain" />',
  '<img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-16 mx-auto mb-4 relative z-10 object-contain mix-blend-multiply" style={{ mixBlendMode: "multiply" }} />'
);
fs.writeFileSync('src/components/documents/SecureAboutPage.tsx', contentAbout);

