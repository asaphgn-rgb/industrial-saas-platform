import fs from 'fs';

// -- 1. Atualizar SecureLogin.tsx (Textos e Título) --
let loginCode = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

// Replace the Logo and Titles
loginCode = loginCode.replace(
  /Vault B2B Intelligence/g,
  'FLECHA BSB'
);

loginCode = loginCode.replace(
  /Plataforma de alta seguranca \(Due Diligence e Smart Contracts\)\. Comunicacao blindada E2E para transacoes corporativas confidenciais\./,
  `Plataforma B2B para compartilhamento privado e análise inteligente de documentos entre usuários autorizados.\n\nFLECHA BSB — Privacidade para compartilhar. Inteligência para validar. Segurança para negociar.`
);

// We need an external image for the logo. The user provided an image. 
// I will use a high quality svg or the user's image representation (Shield with Arrow) directly in SVG, 
// OR I can build the logo out of Lucide icons to be blazing fast and perfectly matching the image.
// The image has a document with a shield and an arrow.
// Lucide icons: Shield, FileText, ArrowRight, MousePointerClick.
// I will compose the logo using Lucide Icons!

const customLogoHtml = `
              <div className="flex items-center space-x-3 mb-8">
                 <div className="relative w-16 h-16">
                    {/* Escudo + Documento (Lucide Composite) */}
                    <svg viewBox="0 0 24 24" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
                       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-[#041f4a]" />
                       <path d="M9 12h6m-6 4h6m-4-8h4" className="text-[#006eb8]" />
                       {/* Arrow overlay */}
                       <path d="M4 14l8-4 8 4" className="text-[#00b0c7]" strokeWidth="2.5" />
                    </svg>
                 </div>
                 <h1 className="text-4xl font-bold font-sans text-white tracking-tighter">
                   FLECHA <span className="text-[#00b0c7]">BSB</span>
                 </h1>
              </div>
`;

loginCode = loginCode.replace(
  /<div>\s*<div className="bg-elite-gold\/20 p-3 rounded-2xl inline-block mb-6 border border-elite-gold\/30">[\s\S]*?<\/h1>/,
  customLogoHtml
);


fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginCode);

// -- 2. Atualizar App.tsx (Header e Exclusão pelo Admin) --
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(/Vault <span className="font-light text-slate-500">\| B2B Intelligence<\/span>/, 'FLECHA <span className="font-bold text-[#00b0c7]">BSB</span>');

// Replace the header shield logo with the Flecha logo
appCode = appCode.replace(
  /<div className="bg-gradient-to-br from-elite-navy to-slate-800 p-2\.5 rounded-xl text-elite-gold shadow-premium">\s*<ShieldCheck className="w-6 h-6" \/>\s*<\/div>/,
  `<div className="flex items-center">
       <svg viewBox="0 0 24 24" className="w-8 h-8 mr-2" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-elite-navy" />
          <path d="M4 14l8-4 8 4" className="text-elite-gold" strokeWidth="3" />
       </svg>
   </div>`
);

fs.writeFileSync('src/App.tsx', appCode);

// -- 3. Atualizar Mensagens Temporárias e Exclusão no SecureDocumentValidation.tsx e SecureChat.tsx --
let chatCode = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// Forçar as mensagens a sumirem ao deslogar (não salvando em localStorage cross-login session permanentemente, 
// OR explicitly clearing it up on log out.
// As instructed: "As mensagens são totalmente temporárias: ao sair ou deslogar do aplicativo, elas são apagadas, não ficam armazenadas, não são retidas em logs e não podem ser recuperadas."
// I will implement a hook on Logout to wipe localStorage chat keys.
