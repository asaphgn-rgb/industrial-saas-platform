import fs from 'fs';

let loginCode = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

// The issue might be that `mockUsers` passed from App.tsx wasn't fully understood or updated correctly if there's a caching issue in Vercel.
// Wait, the error could be "Credenciais inválidas"? Or is it breaking the page layout?
// If it says "Credenciais invalidas", it means the email wasn't found in `validCredentials`.
// `const match = validCredentials[email.toLowerCase()];`
// Let's check `email.toLowerCase()`. The button sets exactly `investidor@flechabsb.com` which is lowercase.
// Could `mockUsers[2]` be undefined? If `App.tsx` wasn't perfectly synced or the browser cached an older `App.js` chunk while loading a newer `SecureLogin.js` chunk?
// In Vite, usually chunk invalidation handles this.
// Let's force the credentials to be hardcoded inside SecureLogin instead of relying on the array index to avoid ANY possible desync between App and SecureLogin!

loginCode = loginCode.replace(
  /const validCredentials: Record<string, any> = \{[\s\S]*?\};\n/,
  `const validCredentials: Record<string, any> = {
    'admin@flechabsb.com': { password: 'mastervault', user: { id: '22222222-2222-2222-2222-222222222222', name: 'Administrador (CEO)', role: 'Acesso Global & Master', initials: 'CEO' } },
    'socio@flechabsb.com': { password: 'auditvault', user: { id: '33333333-3333-3333-3333-333333333333', name: 'Sócio / Auditor', role: 'Auditoria & Due Diligence', initials: 'AUD' } },
    'investidor@flechabsb.com': { password: 'investvault', user: { id: '44444444-4444-4444-4444-444444444444', name: 'Investidor (Comprador)', role: 'Avaliação de Ativos', initials: 'INV' } },
    'juridico@flechabsb.com': { password: 'legalvault', user: { id: '55555555-5555-5555-5555-555555555555', name: 'Jurídico (Advogado)', role: 'Compliance & Contratos', initials: 'JUR' } }
  };\n`
);

fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginCode);
