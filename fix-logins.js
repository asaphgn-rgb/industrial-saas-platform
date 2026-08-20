import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
let loginCode = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

// Update App.tsx users
appCode = appCode.replace(
  /const mockUsers = \[\s*\{ id: '22222222-2222-2222-2222-222222222222'[\s\S]*?\s*\];/,
  `const mockUsers = [
    { id: '22222222-2222-2222-2222-222222222222', name: 'Administrador (CEO)', role: 'Acesso Global & Master', initials: 'CEO' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Sócio / Auditor', role: 'Auditoria & Due Diligence', initials: 'AUD' }
  ];`
);

// Update SecureLogin.tsx credentials
loginCode = loginCode.replace(
  /const validCredentials: Record<string, any> = \{[\s\S]*?\};/,
  `const validCredentials: Record<string, any> = {
    'admin@flechabsb.com': { password: 'mastervault', user: mockUsers[0] }, // CEO / Master
    'socio@flechabsb.com': { password: 'auditvault', user: mockUsers[1] } // Sócio / Auditor
  };`
);

// Update SecureLogin.tsx shortcuts display
loginCode = loginCode.replace(
  /onClick=\{\(\) => \{ setEmail\('investidor@vault\.b2b'\); setPassword\('123'\); \}\}/,
  `onClick={() => { setEmail('admin@flechabsb.com'); setPassword('mastervault'); }}`
);
loginCode = loginCode.replace(
  /<span className="text-xs font-bold text-elite-navy block">Comprador<\/span>\s*<span className="text-\[10px\] text-slate-500">investidor@vault\.b2b<\/span>/,
  `<span className="text-xs font-bold text-elite-navy block">Administrador</span>
                 <span className="text-[10px] text-slate-500">admin@flechabsb.com</span>`
);

loginCode = loginCode.replace(
  /onClick=\{\(\) => \{ setEmail\('proprietario@vault\.b2b'\); setPassword\('123'\); \}\}/,
  `onClick={() => { setEmail('socio@flechabsb.com'); setPassword('auditvault'); }}`
);
loginCode = loginCode.replace(
  /<span className="text-xs font-bold text-elite-navy block">Vendedor<\/span>\s*<span className="text-\[10px\] text-slate-500">proprietario@vault\.b2b<\/span>/,
  `<span className="text-xs font-bold text-elite-navy block">Auditor (Sócio)</span>
                 <span className="text-[10px] text-slate-500">socio@flechabsb.com</span>`
);

fs.writeFileSync('src/App.tsx', appCode);
fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginCode);
