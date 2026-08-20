import React, { useState } from 'react';
import LogoUrl from '/logo-flecha.png';
import { ShieldCheck, Lock, Fingerprint, Eye, EyeOff, UserSquare2, CheckCircle2 } from 'lucide-react';
import { BiometricButton } from './BiometricButton';

interface SecureLoginProps {
  onLogin: (user: any) => void;
  mockUsers: any[];
}

export function SecureLogin({ onLogin, mockUsers }: SecureLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Mapeamento ficticio para credenciais de teste baseado nos mockUsers
  const validCredentials: Record<string, any> = {
    'admin@flechabsb.com': { password: 'mastervault', user: { id: '22222222-2222-2222-2222-222222222222', name: 'Administrador (CEO)', role: 'Acesso Global & Master', initials: 'CEO' } },
    'socio@flechabsb.com': { password: 'auditvault', user: { id: '33333333-3333-3333-3333-333333333333', name: 'Sócio / Auditor', role: 'Auditoria & Due Diligence', initials: 'AUD' } },
    'investidor@flechabsb.com': { password: 'investvault', user: { id: '44444444-4444-4444-4444-444444444444', name: 'Investidor (Comprador)', role: 'Avaliação de Ativos', initials: 'INV' } },
    'juridico@flechabsb.com': { password: 'legalvault', user: { id: '55555555-5555-5555-5555-555555555555', name: 'Jurídico (Advogado)', role: 'Compliance & Contratos', initials: 'JUR' } }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Credenciais obrigatorias para ingresso no cofre.');
      return;
    }

    setIsAuthenticating(true);

    // Simular handshake e verificacao E2E
    setTimeout(() => {
      const match = validCredentials[email.toLowerCase()];
      if (match && match.password === password) {
        onLogin(match.user);
      } else {
        setError('Credenciais invalidas ou acesso revogado.');
        setIsAuthenticating(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#06141B] flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-fbsb-cyan selection:text-[#CCD0CF]">

      {/* Background Decorativo e Efeitos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-fbsb-cyan rounded-full blur-[150px] opacity-10"></div>
         
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-fbsb-surface-100/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">

        {/* Painel Esquerdo: Marketing e Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-[#11212D] relative border-r border-white/5">
           
              <div className="flex items-center mb-8"><img src={LogoUrl} alt="FLECHA BSB Logo" className="h-28 w-auto object-contain filter invert hue-rotate-180 brightness-[1.5] contrast-[1.2]" /></div>

              <p className="text-[#9BA8AB] mt-4 text-sm leading-relaxed max-w-sm">
                Plataforma B2B para compartilhamento privado e análise inteligente de documentos entre usuários autorizados.

<br/><br/><strong className="text-[#CCD0CF]">FLECHA BSB</strong> — Privacidade para compartilhar. Inteligência para validar. Segurança para negociar.
              </p>

           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-[#9BA8AB] text-sm">
                 <CheckCircle2 className="w-4 h-4 text-[#9BA8AB]" />
                 <span>Criptografia de Padrao Militar (AES-GCM)</span>
              </div>
              <div className="flex items-center space-x-3 text-[#9BA8AB] text-sm">
                 <CheckCircle2 className="w-4 h-4 text-[#9BA8AB]" />
                 <span>Gestao Documental Sigilosa com Trilha de Auditoria</span>
              </div>
              <div className="flex items-center space-x-3 text-[#9BA8AB] text-sm">
                 <CheckCircle2 className="w-4 h-4 text-[#9BA8AB]" />
                 <span>Canais de Negociacao Anti-Espionagem Corporativa</span>
              </div>
           </div>
        </div>

        {/* Painel Direito: Formulario de Login */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#253745] relative">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-fbsb-text-primary font-serif">Autenticacao Restrita</h2>
            <p className="text-sm text-fbsb-text-secondary mt-2">Acesso monitorado. Identifique-se para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto w-full">

            {error && (
               <div className="p-3 bg-[#4A5C6A] border border-[#4A5C6A] rounded-lg text-[#9BA8AB] text-xs font-bold text-center animate-pulse">
                 {error}
               </div>
            )}

            <div className="space-y-1">
               <label className="text-[10px] font-bold uppercase tracking-widest text-fbsb-text-secondary pl-1">E-mail Corporativo</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <UserSquare2 className="h-5 w-5 text-fbsb-text-secondary" />
                 </div>
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="block w-full pl-10 pr-3 py-3 border border-fbsb-border rounded-xl bg-[#11212D] focus:bg-[#4A5C6A] text-fbsb-text-primary text-sm font-medium focus:ring-2 focus:ring-fbsb-cyan focus:border-fbsb-cyan transition-all outline-none"
                   placeholder="seu.nome@empresa.com"
                   required
                 />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-[10px] font-bold uppercase tracking-widest text-fbsb-text-secondary pl-1">Senha E2E</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-fbsb-text-secondary" />
                 </div>
                 <input
                   type={showPassword ? 'text' : 'password'}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="block w-full pl-10 pr-10 py-3 border border-fbsb-border rounded-xl bg-[#11212D] focus:bg-[#4A5C6A] text-fbsb-text-primary text-sm font-medium focus:ring-2 focus:ring-fbsb-cyan focus:border-fbsb-cyan transition-all outline-none"
                   placeholder="123"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-fbsb-text-secondary hover:text-fbsb-text-primary transition-colors"
                 >
                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </button>
               </div>
            </div>

            
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-sm font-bold rounded-xl text-[#06141B] bg-fbsb-cyan hover:bg-[#9BA8AB] shadow-glow-cyan uppercase tracking-widest transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <>
                   <Lock className="animate-pulse w-5 h-5 mr-2 text-[#06141B]" />
                   Verificando Chaves...
                </>
              ) : (
                <>
                   <Fingerprint className="w-5 h-5 mr-2 text-[#06141B]" />
                   Destravar Cofre
                </>
              )}
            </button>
            
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

          </form>

          {/* Dicas de Teste */}
          <div className="mt-10 pt-6 border-t border-fbsb-border max-w-sm mx-auto w-full">
             <p className="text-[10px] font-bold uppercase tracking-widest text-fbsb-text-secondary text-center mb-3">Atalhos de Simulação B2B</p>
             <div className="grid grid-cols-2 gap-3">
               <button
                 type="button"
                 onClick={() => { setEmail('admin@flechabsb.com'); setPassword('mastervault'); }}
                 className="p-2 border border-fbsb-border rounded-lg text-left hover:border-fbsb-cyan hover:bg-fbsb-bg-main transition-all group"
               >
                 <span className="text-xs font-bold text-fbsb-text-primary block">Administrador</span>
                 <span className="text-[10px] text-fbsb-text-secondary">admin@flechabsb.com</span>
               </button>
               <button
                 type="button"
                 onClick={() => { setEmail('socio@flechabsb.com'); setPassword('auditvault'); }}
                 className="p-2 border border-fbsb-border rounded-lg text-left hover:border-fbsb-cyan hover:bg-fbsb-bg-main transition-all group"
               >
                 <span className="text-xs font-bold text-fbsb-text-primary block">Auditor (Sócio)</span>
                 <span className="text-[10px] text-fbsb-text-secondary">socio@flechabsb.com</span>
               </button>
               <button
                 type="button"
                 onClick={() => { setEmail('investidor@flechabsb.com'); setPassword('investvault'); }}
                 className="p-2 border border-fbsb-border rounded-lg text-left hover:border-fbsb-cyan hover:bg-fbsb-bg-main transition-all group"
               >
                 <span className="text-xs font-bold text-fbsb-text-primary block">Investidor</span>
                 <span className="text-[10px] text-fbsb-text-secondary">investidor@flechabsb.com</span>
               </button>
               <button
                 type="button"
                 onClick={() => { setEmail('juridico@flechabsb.com'); setPassword('legalvault'); }}
                 className="p-2 border border-fbsb-border rounded-lg text-left hover:border-fbsb-cyan hover:bg-fbsb-bg-main transition-all group"
               >
                 <span className="text-xs font-bold text-fbsb-text-primary block">Jurídico</span>
                 <span className="text-[10px] text-fbsb-text-secondary">juridico@flechabsb.com</span>
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Footer / Info de compliance */}
      <div className="absolute bottom-6 left-0 w-full text-center z-0">
        <p className="text-[10px] text-fbsb-text-secondary/50 uppercase tracking-[0.2em] font-bold">
           Monitoramento Ativo E2E - ISO 27001 Compliance Protocol
        </p>
      </div>

    </div>
  );
}