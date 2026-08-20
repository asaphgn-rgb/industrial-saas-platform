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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-elite-gold selection:text-white">

      {/* Background Decorativo e Efeitos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-elite-navy rounded-full blur-[120px] opacity-40"></div>
         <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-elite-gold rounded-full blur-[150px] opacity-10"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">

        {/* Painel Esquerdo: Marketing e Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-elite-navy to-slate-900 relative border-r border-white/10">
           <div>
              <div className="bg-elite-gold/20 p-3 rounded-2xl inline-block mb-6 border border-elite-gold/30">
                <ShieldCheck className="w-10 h-10 text-elite-gold" />
              </div>
              <h1 className="text-3xl font-bold font-serif text-white leading-tight">
                Vault B2B Intelligence
              </h1>
              <p className="text-elite-sand mt-4 text-sm leading-relaxed max-w-sm">
                Plataforma de alta seguranca (Due Diligence e Smart Contracts). Comunicacao blindada E2E para transacoes corporativas confidenciais.
              </p>
           </div>

           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-300 text-sm">
                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                 <span>Criptografia de Padrao Militar (AES-GCM)</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300 text-sm">
                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                 <span>Gestao Documental Sigilosa com Trilha de Auditoria</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300 text-sm">
                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                 <span>Canais de Negociacao Anti-Espionagem Corporativa</span>
              </div>
           </div>
        </div>

        {/* Painel Direito: Formulario de Login */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white relative">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-elite-navy font-serif">Autenticacao Restrita</h2>
            <p className="text-sm text-slate-500 mt-2">Acesso monitorado. Identifique-se para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto w-full">

            {error && (
               <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-bold text-center animate-pulse">
                 {error}
               </div>
            )}

            <div className="space-y-1">
               <label className="text-[10px] font-bold uppercase tracking-widest text-elite-sand pl-1">E-mail Corporativo</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <UserSquare2 className="h-5 w-5 text-slate-400" />
                 </div>
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-elite-navy text-sm font-medium focus:ring-2 focus:ring-elite-gold focus:border-elite-gold transition-all outline-none"
                   placeholder="seu.nome@empresa.com"
                   required
                 />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-[10px] font-bold uppercase tracking-widest text-elite-sand pl-1">Senha E2E</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-slate-400" />
                 </div>
                 <input
                   type={showPassword ? 'text' : 'password'}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-elite-navy text-sm font-medium focus:ring-2 focus:ring-elite-gold focus:border-elite-gold transition-all outline-none"
                   placeholder="123"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-elite-navy transition-colors"
                 >
                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </button>
               </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-elite-navy hover:bg-slate-800 shadow-premium uppercase tracking-widest transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <>
                   <Lock className="animate-pulse w-5 h-5 mr-2 text-elite-gold" />
                   Verificando Chaves...
                </>
              ) : (
                <>
                   <Fingerprint className="w-5 h-5 mr-2 text-elite-gold" />
                   Destravar Cofre
                </>
              )}
            </button>
          </form>

          {/* Dicas de Teste */}
          <div className="mt-10 pt-6 border-t border-slate-100 max-w-sm mx-auto w-full">
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mb-3">Atalhos de Simulação B2B</p>
             <div className="grid grid-cols-2 gap-3">
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
        </div>
      </div>

      {/* Footer / Info de compliance */}
      <div className="absolute bottom-6 left-0 w-full text-center z-0">
        <p className="text-[10px] text-slate-500/50 uppercase tracking-[0.2em] font-bold">
           Monitoramento Ativo E2E - ISO 27001 Compliance Protocol
        </p>
      </div>

    </div>
  );
}