import fs from 'fs';

let loginCode = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

// There is a line break inside JSX without proper quotes or br tags.
loginCode = loginCode.replace(
  /FLECHA BSB — Privacidade para compartilhar\. Inteligência para validar\. Segurança para negociar\./,
  `<br/><br/><strong className="text-white">FLECHA BSB</strong> — Privacidade para compartilhar. Inteligência para validar. Segurança para negociar.`
);

fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginCode);
