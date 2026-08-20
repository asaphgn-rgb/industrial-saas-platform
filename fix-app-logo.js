import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `          <div className="flex items-center">\n       <svg viewBox="0 0 24 24" className="w-8 h-8 mr-2" fill="none" stroke="currentColor" strokeWidth="2">\n          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-fbsb-text-primary" />\n          <path d="M4 14l8-4 8 4" className="text-fbsb-cyan" strokeWidth="3" />\n       </svg>\n   </div>\n          <div>\n            <h1 className="text-xl font-bold tracking-tight text-fbsb-text-primary">FLECHA <span className="font-bold text-[#00b0c7]">BSB</span></h1>`,
  `          <div className="flex items-center">\n             <img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-10 w-auto object-contain mr-4" />\n          </div>\n          <div className="hidden sm:block">`
);

fs.writeFileSync('src/App.tsx', content);
