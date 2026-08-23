import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Bypassing login para testes locais (DEV MODE)
    if (email === 'ceo@morarbembrasil.com' && password === 'diamond2026') {
      setTimeout(() => {
        setUser({
          id: '11111111-1111-1111-1111-111111111111',
          email: 'ceo@morarbembrasil.com',
          role: 'ADMIN_GLOBAL',
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        navigate(from, { replace: true });
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const { user } = await authService.getSession();
      if (!user) throw new Error("Perfil não encontrado após o login.");
      if (user.status === 'BLOCKED') throw new Error("Usuário bloqueado.");

      setUser(user);
      navigate(from, { replace: true });

    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas. Tente novamente.');
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado Esquerdo - Decorativo (Azul Noturno) */}
      <div className="hidden lg:flex lg:w-1/2 bg-diamond-950 flex-col justify-between p-12 relative overflow-hidden">
        {/* Padrão abstrato de fundo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-diamond-500 via-transparent to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Shield className="h-10 w-10 text-diamond-500" />
            <span className="text-2xl font-bold text-white tracking-widest">DIAMOND</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mt-20">
            A gestão habitacional inteligente.
          </h1>
          <p className="mt-6 text-lg text-diamond-400 max-w-md leading-relaxed">
            Conectamos federações, associações e associados em uma plataforma segura, ágil e focada em resultados.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-diamond-400 text-sm">
          <Lock className="h-4 w-4" />
          <span>Ambiente seguro e criptografado end-to-end.</span>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-diamond-50 p-8 sm:p-12 relative">
        <div className="absolute top-0 right-0 w-full bg-diamond-500 text-white text-xs text-center py-1.5 font-bold tracking-widest shadow-md z-50">
          AMBIENTE DE HOMOLOGAÇÃO
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <Shield className="h-10 w-10 text-diamond-500" />
            <span className="text-2xl font-bold text-diamond-950 tracking-widest">DIAMOND</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-diamond-950 tracking-tight">
              Acesso ao Sistema
            </h2>
            <p className="mt-2 text-sm text-diamond-400">
              Insira suas credenciais para acessar seu painel.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-diamond-900 mb-1.5" htmlFor="email">E-mail corporativo</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-diamond-100 bg-white px-4 py-3 text-diamond-950 placeholder-diamond-400 focus:border-diamond-500 focus:ring-2 focus:ring-diamond-500/20 focus:outline-none transition-all shadow-sm"
                  placeholder="ceo@morarbembrasil.com"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-diamond-900" htmlFor="password">Senha</label>
                  <a href="#" className="text-xs font-semibold text-diamond-500 hover:text-diamond-900 transition-colors">Esqueceu a senha?</a>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-diamond-100 bg-white px-4 py-3 text-diamond-950 placeholder-diamond-400 focus:border-diamond-500 focus:ring-2 focus:ring-diamond-500/20 focus:outline-none transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-diamond-500 py-3.5 px-4 text-sm font-semibold text-white shadow-hover hover:bg-blue-600 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-diamond-500 focus:ring-offset-2 disabled:bg-diamond-400 disabled:transform-none transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Autenticando...
                </span>
              ) : (
                <>
                  Entrar no Painel
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}