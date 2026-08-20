import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
let loginCode = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

// Adicionando os novos mockUsers no App.tsx
appCode = appCode.replace(
  /const mockUsers = \[\s*\{ id: '22222222-2222-2222-2222-222222222222'[\s\S]*?\s*\];/,
  `const mockUsers = [
    { id: '22222222-2222-2222-2222-222222222222', name: 'Administrador (CEO)', role: 'Acesso Global & Master', initials: 'CEO' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Sócio / Auditor', role: 'Auditoria & Due Diligence', initials: 'AUD' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Investidor (Comprador)', role: 'Avaliação de Ativos', initials: 'INV' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Jurídico (Advogado)', role: 'Compliance & Contratos', initials: 'JUR' }
  ];`
);

// Adicionando as credenciais no SecureLogin.tsx
loginCode = loginCode.replace(
  /const validCredentials: Record<string, any> = \{[\s\S]*?\};/,
  `const validCredentials: Record<string, any> = {
    'admin@flechabsb.com': { password: 'mastervault', user: mockUsers[0] }, // CEO / Master
    'socio@flechabsb.com': { password: 'auditvault', user: mockUsers[1] }, // Sócio / Auditor
    'investidor@flechabsb.com': { password: 'investvault', user: mockUsers[2] }, // Investidor
    'juridico@flechabsb.com': { password: 'legalvault', user: mockUsers[3] } // Jurídico
  };`
);

// Vamos também colocar atalhos de clique-rápido para todas as 4 contas na UI
loginCode = loginCode.replace(
  /<div className="grid grid-cols-2 gap-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<div className="grid grid-cols-2 gap-3">
               <button
                 type="button"
                 onClick={() => { setEmail('admin@flechabsb.com'); setPassword('mastervault'); }}
                 className="p-2 border border-slate-200 rounded-lg text-left hover:border-elite-gold hover:bg-elite-paper transition-all group"
               >
                 <span className="text-xs font-bold text-elite-navy block">Administrador</span>
                 <span className="text-[10px] text-slate-500">admin@flechabsb.com</span>
               </button>
               <button
                 type="button"
                 onClick={() => { setEmail('socio@flechabsb.com'); setPassword('auditvault'); }}
                 className="p-2 border border-slate-200 rounded-lg text-left hover:border-elite-gold hover:bg-elite-paper transition-all group"
               >
                 <span className="text-xs font-bold text-elite-navy block">Auditor (Sócio)</span>
                 <span className="text-[10px] text-slate-500">socio@flechabsb.com</span>
               </button>
               <button
                 type="button"
                 onClick={() => { setEmail('investidor@flechabsb.com'); setPassword('investvault'); }}
                 className="p-2 border border-slate-200 rounded-lg text-left hover:border-elite-gold hover:bg-elite-paper transition-all group"
               >
                 <span className="text-xs font-bold text-elite-navy block">Investidor</span>
                 <span className="text-[10px] text-slate-500">investidor@flechabsb.com</span>
               </button>
               <button
                 type="button"
                 onClick={() => { setEmail('juridico@flechabsb.com'); setPassword('legalvault'); }}
                 className="p-2 border border-slate-200 rounded-lg text-left hover:border-elite-gold hover:bg-elite-paper transition-all group"
               >
                 <span className="text-xs font-bold text-elite-navy block">Jurídico</span>
                 <span className="text-[10px] text-slate-500">juridico@flechabsb.com</span>
               </button>
             </div>
          </div>
        </div>`
);

fs.writeFileSync('src/App.tsx', appCode);
fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginCode);
