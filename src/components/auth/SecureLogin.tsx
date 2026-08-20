import React, { useState } from 'react';
import { ShieldCheck, Lock, Fingerprint, Eye, EyeOff, UserSquare2, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-fbsb-surface-200 flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-fbsb-cyan selection:text-white">

      {/* Background Decorativo e Efeitos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-fbsb-primary rounded-full blur-[120px] opacity-40"></div>
         <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-fbsb-cyan rounded-full blur-[150px] opacity-10"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-fbsb-surface-100/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">

        {/* Painel Esquerdo: Marketing e Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-fbsb-primary to-slate-900 relative border-r border-white/10">
           
              <div className="flex items-center space-x-3 mb-8">
                 <div className="relative w-16 h-16">
                    {/* Escudo + Documento (Lucide Composite) */}
                    <svg viewBox="0 0 24 24" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
                       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-[#041f4a]" />
                       <path d="M9 12h6m-6 4h6m-4-8h4" className="text-[#006eb8]" />
                       {/* Arrow overlay */}
                       <path d="M4 14l8-4 8 4" className="text-[#00b0c7]" strokeWidth="2.5" />
                    </svg>
                 </div>
                 <h1 className="text-4xl font-bold font-sans text-white tracking-tighter">
                   FLECHA <span className="text-[#00b0c7]">BSB</span>
                 </h1>
              </div>

              <p className="text-fbsb-text-secondary mt-4 text-sm leading-relaxed max-w-sm">
                Plataforma B2B para compartilhamento privado e análise inteligente de documentos entre usuários autorizados.

<br/><br/><strong className="text-white">FLECHA BSB</strong> — Privacidade para compartilhar. Inteligência para validar. Segurança para negociar.
              </p>

           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-fbsb-text-secondary text-sm">
                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                 <span>Criptografia de Padrao Militar (AES-GCM)</span>
              </div>
              <div className="flex items-center space-x-3 text-fbsb-text-secondary text-sm">
                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                 <span>Gestao Documental Sigilosa com Trilha de Auditoria</span>
              </div>
              <div className="flex items-center space-x-3 text-fbsb-text-secondary text-sm">
                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                 <span>Canais de Negociacao Anti-Espionagem Corporativa</span>
              </div>
           </div>
        </div>

        {/* Painel Direito: Formulario de Login */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-fbsb-surface-100 relative">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-fbsb-text-primary font-serif">Autenticacao Restrita</h2>
            <p className="text-sm text-fbsb-text-secondary mt-2">Acesso monitorado. Identifique-se para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto w-full">

            {error && (
               <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-bold text-center animate-pulse">
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
                   className="block w-full pl-10 pr-3 py-3 border border-fbsb-border rounded-xl bg-fbsb-surface-200 focus:bg-fbsb-surface-100 text-fbsb-text-primary text-sm font-medium focus:ring-2 focus:ring-fbsb-cyan focus:border-fbsb-cyan transition-all outline-none"
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
                   className="block w-full pl-10 pr-10 py-3 border border-fbsb-border rounded-xl bg-fbsb-surface-200 focus:bg-fbsb-surface-100 text-fbsb-text-primary text-sm font-medium focus:ring-2 focus:ring-fbsb-cyan focus:border-fbsb-cyan transition-all outline-none"
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
              className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-fbsb-primary hover:bg-fbsb-surface-200 shadow-premium uppercase tracking-widest transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <>
                   <Lock className="animate-pulse w-5 h-5 mr-2 text-fbsb-cyan" />
                   Verificando Chaves...
                </>
              ) : (
                <>
                   <Fingerprint className="w-5 h-5 mr-2 text-fbsb-cyan" />
                   Destravar Cofre
                </>
              )}
            </button>
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