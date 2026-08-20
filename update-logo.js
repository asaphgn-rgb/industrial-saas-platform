import fs from 'fs';

const logoSVG = `
<svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="W_FULL_REPLACE">
  <g transform="translate(10, 10) scale(0.9)">
    <path d="M50 10 L85 25 V60 C85 85 65 105 50 115 C35 105 15 85 15 60 V25 L50 10 Z" fill="#0c2c5c" stroke="#061c40" strokeWidth="2"/>
    <path d="M35 25 H65 V85 H35 V25 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
    <path d="M40 35 H60 M40 45 H60 M40 55 H50" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"/>
    <rect x="45" y="70" width="10" height="10" rx="2" fill="#0c2c5c"/>
    <path d="M47 70 V67 C47 65 53 65 53 67 V70" stroke="#0c2c5c" strokeWidth="2" fill="none"/>
    <path d="M0 60 H10 M-5 70 H15 M5 80 H10" stroke="#00b4b4" strokeWidth="4" strokeLinecap="round"/>
    <path d="M5 65 Q 45 45 80 50 L 70 40 L 95 55 L 75 75 L 80 60 Q 45 65 5 65 Z" fill="#00b4b4" />
  </g>
  <text x="110" y="75" fontFamily="sans-serif" fontWeight="900" fontSize="48" fill="#0c2c5c" letterSpacing="-1">FLECHA</text>
  <text x="295" y="75" fontFamily="sans-serif" fontWeight="900" fontSize="48" fill="#00b4b4" letterSpacing="-1">BSB</text>
  <text x="110" y="100" fontFamily="sans-serif" fontWeight="500" fontSize="14" fill="#475569">Compartilhamento Seguro de Documentos</text>
</svg>
`;

function injectLogoSVG(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const regex = /<img\s+src="\/logo-flecha\.png"\s+alt="FLECHA BSB Logo"\s+className="([^"]+)"\s*\/>/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, (match, classNames) => {
      return logoSVG.replace('W_FULL_REPLACE', classNames);
    });
    fs.writeFileSync(filePath, content);
    console.log("Logo injetada em " + filePath);
  } else {
    console.log("Tag <img> de logo não encontrada em " + filePath);
  }
}

injectLogoSVG('src/App.tsx');
injectLogoSVG('src/components/auth/SecureLogin.tsx');
injectLogoSVG('src/components/documents/SecureAboutPage.tsx');

