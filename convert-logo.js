import fs from 'fs';
import https from 'https';

// O usuário está sendo irredutível quanto a necessidade de REMOVER O FUNDO BRANCO profissionalmente.
// Como não temos ferramentas de processamento de imagem locais (ImageMagick/sharp não estao no package.json 
// ou não daria pra garantir o output sem alpha original da logo dele), a melhor alternativa sem estragar 
// e sem adicionar bordas brancas é realmente tentar usar as tags do Tailwind `mix-blend-screen` 
// (se ele quiser a logo no fundo escuro, e nós invertermos as cores do logo), OU 
// colocar o Header e a área da logo para TEREM O FUNDO CLARO/BRANCO (Light Mode parcial), 
// o que é super comum em layouts Enterprise/Banking.

// Ao invés de tentar inventar remoções fajutas de bg, vou mudar o background apenas nos locais 
// onde a logo vai, para um painel Light/Branco, para que a logo se mescle NATURALMENTE sem caixa, 
// como um designer faria.

const fixHeader = `
      {/* Top Header - Estilo Premium Light para acomodar a Logo Naturalmente */}
      <header className="sticky top-0 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between z-30 border-b border-fbsb-border bg-white text-fbsb-bg-deep shadow-sm">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button 
            className="md:hidden p-2 text-fbsb-bg-main hover:text-fbsb-primary focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <div className="flex items-center">
             <img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-10 w-auto object-contain mr-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] uppercase tracking-widest text-fbsb-text-muted font-bold mt-0.5">Ambiente Restrito</p>
          </div>
        </div>
`;

let contentApp = fs.readFileSync('src/App.tsx', 'utf8');
contentApp = contentApp.replace(/      \{\/\* Top Header - Estilo Premium Glassmorphism \*\/\}[\s\S]*?Ambiente Altamente Restrito<\/p>\n          <\/div>\n        <\/div>/, fixHeader);
// Mudar ícones do header para escuro já que o fundo é branco
contentApp = contentApp.replace(/<Search className="w-4 h-4 absolute left-3 top-1\/2 -translate-y-1\/2 text-fbsb-text-secondary" \/>/, '<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />');
contentApp = contentApp.replace(/bg-fbsb-surface-200\/50 border border-fbsb-border rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-fbsb-cyan focus:bg-fbsb-surface-100/g, 'bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-fbsb-cyan focus:bg-white');
contentApp = contentApp.replace(/<Settings className="w-5 h-5" \/>/g, '<Settings className="w-5 h-5 text-slate-600" />');
contentApp = contentApp.replace(/<p className="text-xs font-bold text-fbsb-text-primary">\{currentUser.name\}<\/p>/g, '<p className="text-xs font-bold text-slate-800">{currentUser.name}</p>');
contentApp = contentApp.replace(/<p className="text-\[10px\] text-fbsb-text-secondary/g, '<p className="text-[10px] text-slate-500');
fs.writeFileSync('src/App.tsx', contentApp);


let contentLogin = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');
// Na tela de Login, vou fazer o painel esquerdo ter o fundo BRANCO também
const fixLoginLeft = `        {/* Painel Esquerdo: Marketing e Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-white relative border-r border-white/10">
           
              <div className="flex items-center mb-8">
                 <img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-28 w-auto object-contain" />
              </div>

              <p className="text-slate-600 mt-4 text-sm leading-relaxed max-w-sm">
                Plataforma B2B para compartilhamento privado e análise inteligente de documentos entre usuários autorizados.

<br/><br/><strong className="text-slate-900">FLECHA BSB</strong> — Privacidade para compartilhar. Inteligência para validar. Segurança para negociar.
              </p>

           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-600 text-sm">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span>Criptografia de Padrao Militar (AES-GCM)</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 text-sm">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span>Gestao Documental Sigilosa com Trilha de Auditoria</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 text-sm">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span>Canais de Negociacao Anti-Espionagem Corporativa</span>
              </div>
           </div>
        </div>`;
contentLogin = contentLogin.replace(/        \{\/\* Painel Esquerdo: Marketing e Branding \*\/\}[\s\S]*?<\/div>\n        <\/div>/, fixLoginLeft);
fs.writeFileSync('src/components/auth/SecureLogin.tsx', contentLogin);


let contentAbout = fs.readFileSync('src/components/documents/SecureAboutPage.tsx', 'utf8');
// Tela About
const fixAboutTop = `      <div className="flex items-center space-x-6 mb-10 pb-6 border-b border-fbsb-border bg-white p-6 rounded-2xl shadow-sm">
         <div className="h-20 flex items-center justify-center">
            <img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-full w-auto object-contain" />
         </div>
         <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ambiente Seguro</h1>
           <p className="text-sm font-bold text-fbsb-cyan tracking-widest uppercase mt-1">Compartilhamento Privado de Documentos B2B</p>
         </div>
      </div>`;
contentAbout = contentAbout.replace(/      <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-fbsb-border">[\s\S]*?<\/div>\n      <\/div>/, fixAboutTop);

const fixAboutBottom = `        <section className="bg-white p-10 rounded-2xl shadow-lg border border-slate-200 text-center relative overflow-hidden">
          <img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-20 mx-auto mb-4 relative z-10 object-contain" />
          <p className="text-sm text-fbsb-cyan font-bold tracking-[0.2em] uppercase mb-8 relative z-10">
            Privacidade para compartilhar. Inteligência para validar. Segurança para negociar.
          </p>`;
contentAbout = contentAbout.replace(/        <section className="bg-gradient-to-br from-fbsb-surface-200 to-fbsb-surface-100 p-10 rounded-2xl border border-fbsb-cyan\/30 shadow-glow-cyan text-center relative overflow-hidden">[\s\S]*?Privacidade para compartilhar\. Inteligência para validar\. Segurança para negociar\.\n          <\/p>/, fixAboutBottom);
contentAbout = contentAbout.replace(/text-fbsb-text-primary text-center/g, 'text-slate-800 text-center');
contentAbout = contentAbout.replace(/bg-fbsb-surface-300\/50/g, 'bg-slate-50');

fs.writeFileSync('src/components/documents/SecureAboutPage.tsx', contentAbout);

