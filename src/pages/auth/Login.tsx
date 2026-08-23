import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl relative overflow-hidden">
        
        {/* Aviso de Homologação/Bypass */}
        <div className="absolute top-0 left-0 w-full bg-amber-500 text-white text-xs text-center py-1 font-bold">
          AMBIENTE DE HOMOLOGAÇÃO
        </div>

        <div className="text-center pt-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Shield className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            PLATAFORMA DIAMOND
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Morar Bem Brasil - Acesso Restrito
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full appearance-none rounded-t-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                placeholder="Endereço de e-mail (Tente: ceo@morarbembrasil.com)"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-b-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                placeholder="Senha (Tente: diamond2026)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-amber-600 py-2 px-4 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-400"
            >
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
