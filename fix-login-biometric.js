import fs from 'fs';

let content = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

const biometricImport = `import { BiometricButton } from './BiometricButton';`;

if(!content.includes('BiometricButton')) {
  content = content.replace(`import { ShieldCheck, Lock, Fingerprint, Eye, EyeOff, UserSquare2, CheckCircle2 } from 'lucide-react';`, `import { ShieldCheck, Lock, Fingerprint, Eye, EyeOff, UserSquare2, CheckCircle2 } from 'lucide-react';\n${biometricImport}`);
  
  const originalButton = `<button\n              type="submit"\n              disabled={isAuthenticating}\n              className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-fbsb-primary hover:bg-fbsb-surface-200 shadow-premium uppercase tracking-widest transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"\n            >\n              {isAuthenticating ? (\n                <>\n                   <Lock className="animate-pulse w-5 h-5 mr-2 text-fbsb-cyan" />\n                   Verificando Chaves...\n                </>\n              ) : (\n                <>\n                   <Fingerprint className="w-5 h-5 mr-2 text-fbsb-cyan" />\n                   Destravar Cofre\n                </>\n              )}\n            </button>`;
  
  const biometricLogic = `
            ${originalButton}
            
            <div className="relative mt-6 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-fbsb-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-fbsb-surface-100 px-2 text-fbsb-text-secondary uppercase tracking-widest font-bold">Ou Acesso Rápido</span>
              </div>
            </div>
            
            <BiometricButton 
              email={email} 
              onSuccess={() => {
                if(!email) return;
                const match = validCredentials[email.toLowerCase()];
                if(match) onLogin(match.user);
                else setError('E-mail não cadastrado para biometria.');
              }} 
            />
`;

  content = content.replace(originalButton, biometricLogic);
  
  fs.writeFileSync('src/components/auth/SecureLogin.tsx', content);
}
