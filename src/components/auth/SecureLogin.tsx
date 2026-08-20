import React, { useState } from 'react';
import LogoUrl from '/logo-flecha.png';
import { ShieldCheck, Lock, Fingerprint, Eye, EyeOff, UserSquare2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

  // Lista oficial de usuários (E-mail e Senha exclusivos para Sala REGULARIZAÇÃO)
  const validCredentials: Record<string, any> = {
    'ceo@flechabsb.com': { password: 'ceovault', user: { id: '11111111-1111-1111-1111-111111111111', name: 'Direção Executiva', role: 'Diretor (CEO)', initials: 'CEO', email: 'ceo@flechabsb.com' } },
    'adm@flechabsb.com': { password: 'adminvault', user: { id: '22222222-2222-2222-2222-222222222222', name: 'Administrativo', role: 'Gestão & Backoffice', initials: 'ADM', email: 'adm@flechabsb.com' } },
    'juridico@flechabsb.com': { password: 'legalvault', user: { id: '55555555-5555-5555-5555-555555555555', name: 'Jurídico', role: 'Compliance & Contratos', initials: 'JUR', email: 'juridico@flechabsb.com' } },
    'socio@flechabsb.com': { password: 'auditvault', user: { id: '33333333-3333-3333-3333-333333333333', name: 'Sócio', role: 'Auditoria & Investimentos', initials: 'SOC', email: 'socio@flechabsb.com' } },
    'operacional@flechabsb.com': { password: 'opsvault', user: { id: '77777777-7777-7777-7777-777777777777', name: 'Operações', role: 'Campo & Técnico', initials: 'OPS', email: 'operacional@flechabsb.com' } }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Credenciais obrigatórias para ingresso no cofre.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(async () => {
      const match = validCredentials[email.toLowerCase()];
      if (match && match.password === password) {
         // Verifica Governança de RBAC via CEO diretamente no banco de dados
         try {
           const { data, error } = await supabase
             .from('vdr_access_control')
             .select('is_revoked')
             .eq('tenant_id', 'tenant-industrial-demo-uuid')
             .eq('data_room_name', 'REGULARIZAÇÃO')
             .eq('user_email', email.toLowerCase())
             .maybeSingle();

           if (data && data.is_revoked === true) {
              setError('Seu acesso a esta sala foi explicitamente revogado pela Direção.');
              setIsAuthenticating(false);
              return;
           }
         } catch (e) {
           console.error("Erro ao validar RBAC Cloud (Tabela pode não existir na demo). Acesso liberado por padrão.", e);
         }

         // O usuário logou com as credenciais oficiais e não está bloqueado. Colocando na pasta "REGULARIZAÇÃO"
         onLogin({ ...match.user, currentFolder: 'REGULARIZAÇÃO' });
      } else {
        setError('Credenciais inválidas ou acesso revogado.');
        setIsAuthenticating(false);
      }
    }, 500); // Timeout reduzido já que o banco vai levar alguns ms
  };

  return (
    <div className="min-h-screen bg-fbsb-bg-deep flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-fbsb-cyan selection:text-fbsb-text-primary">

      {/* Background Decorativo e Efeitos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-fbsb-cyan rounded-full blur-[150px] opacity-10"></div>
         
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-fbsb-surface-100/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">

        {/* Painel Esquerdo: Marketing e Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-fbsb-bg-main relative border-r border-white/5">

              <div className="flex items-center mb-8"><img src={LogoUrl} alt="FLECHA BSB Logo" className="h-40 md:h-56 w-auto object-contain drop-shadow-[0_0_25px_rgba(0,212,255,0.2)]" /></div>

              <p className="text-fbsb-text-secondary mt-4 text-sm leading-relaxed max-w-sm">
                Plataforma B2B para compartilhamento privado e análise inteligente de documentos entre usuários autorizados.

<br/><br/><strong className="text-fbsb-text-primary">FLECHA BSB</strong> — Privacidade para compartilhar. Inteligência para validar. Segurança para negociar.
              </p>

           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-fbsb-text-secondary text-sm">
                 <CheckCircle2 className="w-4 h-4 text-fbsb-text-secondary" />
                 <span>Criptografia de Padrao Militar (AES-GCM)</span>
              </div>
              <div className="flex items-center space-x-3 text-fbsb-text-secondary text-sm">
                 <CheckCircle2 className="w-4 h-4 text-fbsb-text-secondary" />
                 <span>Gestao Documental Sigilosa com Trilha de Auditoria</span>
              </div>
              <div className="flex items-center space-x-3 text-fbsb-text-secondary text-sm">
                 <CheckCircle2 className="w-4 h-4 text-fbsb-text-secondary" />
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
               <div className="p-3 bg-fbsb-surface-200 border border-fbsb-border rounded-lg text-fbsb-text-secondary text-xs font-bold text-center animate-pulse">
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
                   className="block w-full pl-10 pr-3 py-3 border border-fbsb-border rounded-xl bg-fbsb-bg-main focus:bg-fbsb-surface-200 text-fbsb-text-primary text-sm font-medium focus:ring-2 focus:ring-fbsb-cyan focus:border-fbsb-cyan transition-all outline-none"
                   placeholder="seu.nome@empresa.com"
                   required
                 />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-[10px] font-bold uppercase tracking-widest text-fbsb-text-secondary pl-1">Senha de Acesso</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-fbsb-text-secondary" />
                 </div>
                 <input
                   type={showPassword ? 'text' : 'password'}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="block w-full pl-10 pr-10 py-3 border border-fbsb-border rounded-xl bg-fbsb-bg-main focus:bg-fbsb-surface-200 text-fbsb-text-primary text-sm font-medium focus:ring-2 focus:ring-fbsb-cyan focus:border-fbsb-cyan transition-all outline-none"
                   placeholder="Sua senha corporativa"
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
              className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-sm font-bold rounded-xl text-fbsb-bg-deep bg-fbsb-cyan hover:bg-fbsb-surface-300 shadow-glow-cyan uppercase tracking-widest transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <>
                   <Lock className="animate-pulse w-5 h-5 mr-2 text-fbsb-bg-deep" />
                   Verificando Chaves...
                </>
              ) : (
                <>
                   <Fingerprint className="w-5 h-5 mr-2 text-fbsb-bg-deep" />
                   Destravar Cofre
                </>
              )}
            </button>

          </form>

          {/* Informações Importantes & Credenciais */}
          <div className="mt-8 p-5 bg-fbsb-bg-main border border-fbsb-border rounded-2xl flex flex-col items-center text-center max-w-sm mx-auto w-full">
             <img src={LogoUrl} alt="Brasão FLECHA BSB" className="h-24 w-auto object-contain mb-4 opacity-100 drop-shadow-[0_0_15px_rgba(0,212,255,0.15)]" />
             <h3 className="text-xs font-bold text-fbsb-cyan uppercase tracking-widest mb-2 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" /> Protocolo E2E Ativo
             </h3>
             <p className="text-[11px] text-fbsb-text-primary font-medium leading-relaxed mb-1">
               Sistema de Compartilhamento Seguro
             </p>
             <p className="text-[10px] text-fbsb-text-secondary leading-relaxed">
               A FLECHA BSB utiliza criptografia ponta-a-ponta. Todas as conversas e documentos são protegidos e destruídos após o término da sessão (Zero-Trace).
             </p>
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