import fs from 'fs';
let content = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

content = content.replace(
  `                 <div className="relative w-16 h-16">\n                    {/* Escudo + Documento (Lucide Composite) */}\n                    <svg viewBox="0 0 24 24" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">\n                       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-[#041f4a]" />\n                       <path d="M9 12h6m-6 4h6m-4-8h4" className="text-[#006eb8]" />\n                       {/* Arrow overlay */}\n                       <path d="M4 14l8-4 8 4" className="text-[#00b0c7]" strokeWidth="2.5" />\n                    </svg>\n                 </div>\n                 <h1 className="text-4xl font-bold font-sans text-white tracking-tighter">\n                   FLECHA <span className="text-[#00b0c7]">BSB</span>\n                 </h1>`,
  `                 <img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-16 w-auto object-contain" />`
);

fs.writeFileSync('src/components/auth/SecureLogin.tsx', content);
