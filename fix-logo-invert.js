import fs from 'fs';

const logoStyle = 'className="h-9 w-auto object-contain filter invert hue-rotate-180 brightness-[1.5] contrast-[1.2]"';
const loginLogoStyle = 'className="h-28 w-auto object-contain filter invert hue-rotate-180 brightness-[1.5] contrast-[1.2]"';
const aboutLogoStyle = 'className="h-20 w-auto object-contain filter invert hue-rotate-180 brightness-[1.5] contrast-[1.2]"';

// 1. App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
// Remover o badge branco (div com bg-white px-4 py-2...) e manter apenas a img
appContent = appContent.replace(
  /<div className="bg-white px-4 py-2 rounded-xl flex items-center justify-center mr-4 shadow-sm"><img src={LogoUrl} alt="FLECHA BSB Logo" className="h-7 w-auto object-contain mix-blend-multiply" \/><\/div>/g,
  `<div className="flex items-center justify-center mr-4"><img src={LogoUrl} alt="FLECHA BSB Logo" ${logoStyle} /></div>`
);
fs.writeFileSync('src/App.tsx', appContent);

// 2. SecureLogin.tsx
let loginContent = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');
// Remover o badge branco
loginContent = loginContent.replace(
  /<div className="flex items-center mb-8 bg-white px-6 py-4 rounded-3xl w-fit shadow-lg">\s*<img src={LogoUrl} alt="FLECHA BSB Logo" className="h-28 w-auto object-contain mix-blend-multiply" \/>\s*<\/div>/g,
  `<div className="flex items-center mb-8"><img src={LogoUrl} alt="FLECHA BSB Logo" ${loginLogoStyle} /></div>`
);
fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginContent);

// 3. SecureAboutPage.tsx
let aboutContent = fs.readFileSync('src/components/documents/SecureAboutPage.tsx', 'utf8');
// Este arquivo usava fundos brancos inteiros na seção, vamos transformar essas seções em Carbon e inverter a logo
aboutContent = aboutContent.replace(
  /bg-white p-6 rounded-2xl shadow-sm/g,
  'bg-[#141414] p-6 rounded-2xl shadow-premium border border-white/5'
);
aboutContent = aboutContent.replace(
  /<img src="\/logo-flecha\.png" alt="FLECHA BSB Logo" className="h-full w-auto object-contain" \/>/g,
  `<img src="/logo-flecha.png" alt="FLECHA BSB Logo" ${aboutLogoStyle} />`
);
aboutContent = aboutContent.replace(
  /text-slate-900/g,
  'text-white'
);
// A seção de baixo
aboutContent = aboutContent.replace(
  /bg-white p-10 rounded-2xl shadow-lg border border-slate-200/g,
  'bg-[#141414] p-10 rounded-2xl shadow-premium border border-white/5'
);
aboutContent = aboutContent.replace(
  /<img src="\/logo-flecha\.png" alt="FLECHA BSB Logo" className="h-20 mx-auto mb-4 relative z-10 object-contain" \/>/g,
  `<img src="/logo-flecha.png" alt="FLECHA BSB Logo" ${aboutLogoStyle} className="mx-auto mb-4 relative z-10" />`
);
// Consertar os cards na seção inferior que estavam brancos (bg-slate-50)
aboutContent = aboutContent.replace(
  /bg-slate-50 backdrop-blur-sm px-6 py-4 rounded-xl border border-fbsb-border/g,
  'bg-[#0A0A0A] px-6 py-4 rounded-xl border border-white/5'
);
aboutContent = aboutContent.replace(
  /text-slate-800/g,
  'text-white'
);

fs.writeFileSync('src/components/documents/SecureAboutPage.tsx', aboutContent);
