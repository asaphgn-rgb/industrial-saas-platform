import fs from 'fs';
let content = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

content = content.replace(
  `              <div className="flex items-center space-x-3 mb-8">\n                 <img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-16 w-auto object-contain" />\n              </div>`,
  `              <div className="flex items-center mb-8">\n                 <img src="/logo-flecha.png" alt="FLECHA BSB Logo" className="h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(92,210,241,0.3)]" />\n              </div>`
);

fs.writeFileSync('src/components/auth/SecureLogin.tsx', content);
