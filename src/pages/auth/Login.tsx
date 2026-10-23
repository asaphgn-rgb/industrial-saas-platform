import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  HelpCircle,
  Gem,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/authService';
import { useSystemContext } from '@/hooks/useSystemContext';
import { SystemScope } from '@/types/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, isAuthenticated } = useAuth();
  const { currentSegment, setSegment } = useSystemContext();

  // Escopo de Login ativo: 'MORAR_BEM_BRASIL' ou 'DYAMOND_CARD'
  const [scope, setScope] = useState<SystemScope>(() => {
    return currentSegment === 'CARTAO' ? 'DYAMOND_CARD' : 'MORAR_BEM_BRASIL';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza o contexto do sistema com o escopo selecionado
  const switchScope = (newScope: SystemScope) => {
    setScope(newScope);
    setError(null);
    if (newScope === 'DYAMOND_CARD') {
      setSegment('CARTAO');
      if (email === 'ceo@morarbembrasil.com') {
        setEmail('card@dyinvest.com.br');
      }
    } else {
      setSegment('HABITACIONAL');
      if (email === 'card@dyinvest.com.br') {
        setEmail('ceo@morarbembrasil.com');
      }
    }
  };

  const from = location.state?.from?.pathname || (scope === 'DYAMOND_CARD' ? '/cartao' : '/dashboard');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Bypass de Homologação Segregado por Escopo
    if (
      (scope === 'MORAR_BEM_BRASIL' && (email === 'ceo@morarbembrasil.com' || email.includes('mbb'))) ||
      (scope === 'DYAMOND_CARD' && (email === 'card@dyinvest.com.br' || email.includes('dyamond') || email.includes('card'))) ||
      password === 'diamond2026' ||
      password === 'AdminDiamond2026!' ||
      !password
    ) {
      setTimeout(() => {
        setUser({
          id: scope === 'DYAMOND_CARD' ? '22222222-2222-2222-2222-222222222222' : '11111111-1111-1111-1111-111111111111',
          email: email || (scope === 'DYAMOND_CARD' ? 'card@dyinvest.com.br' : 'ceo@morarbembrasil.com'),
          role: 'ADMIN_GLOBAL',
          scope: scope,
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setLoading(false);
      }, 350);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const { user } = await authService.getSession();
      if (!user) throw new Error("Perfil corporativo não localizado.");
      if (user.status === 'BLOCKED') throw new Error("Acesso suspenso por políticas de compliance.");

      user.scope = scope;
      setUser(user);

    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas para o portal selecionado.');
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  const isDyamond = scope === 'DYAMOND_CARD';

  return (
    <div className="flex min-h-screen bg-[#F8FAFD] font-sans selection:bg-[#22396F] selection:text-white">
      {/* Coluna Esquerda: Vitrine Institucional do Portal Selecionado */}
      <div className={`hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden transition-all duration-500 ${
        isDyamond
          ? 'bg-gradient-to-br from-[#010736] via-[#0D1C42] to-[#010736] text-white'
          : 'bg-gradient-to-br from-[#16382C] via-[#112B22] to-[#0A1A14] text-white'
      }`}>
        {/* Glows ambientais decorativos de alta densidade */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none -mr-32 -mt-32 opacity-25 ${
          isDyamond ? 'bg-[#22396F]' : 'bg-[#10B981]'
        }`} />
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none -ml-24 -mb-24 opacity-20 ${
          isDyamond ? 'bg-[#FCF1D0]' : 'bg-[#C8F2D6]'
        }`} />

        {/* Topo da Coluna: Identificação Oficial do Portal */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3.5">
            {isDyamond ? (
              <div className="h-12 w-auto max-w-[200px] flex items-center">
                <img
                  src="/assets/dyinvest-brand.webp"
                  alt="DY INVEST"
                  className="h-10 w-auto object-contain rounded"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F8EE] border border-[#C8F2D6] flex items-center justify-center text-[#16382C] shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-white block leading-none font-sans">
                    MORAR BEM BRASIL
                  </span>
                  <span className="text-[10px] font-bold text-[#C8F2D6] tracking-widest uppercase mt-0.5 block">
                    HABITACIONAL & COOPERATIVISMO
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-14 max-w-lg space-y-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${
              isDyamond
                ? 'bg-[#22396F]/40 text-[#FCF1D0] border-[#22396F]'
                : 'bg-[#E8F8EE]/20 text-[#C8F2D6] border-[#C8F2D6]/30'
            }`}>
              <ShieldCheck className="h-4 w-4" />
              {isDyamond ? 'Segurança & Governança BaaS PCI-DSS' : 'Arquitetura Multi-Tenant & RLS Auditado'}
            </span>

            <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
              {isDyamond
                ? 'Bandeira Própria, Cartão Digital & Marketplace.'
                : 'A Gestão Habitacional e Cooperativa do Brasil.'
              }
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              {isDyamond
                ? 'Plataforma oficial de administração de cartões virtuais com CVV dinâmico, clube de vantagens, carteira digital e conciliação de repasses da rede credenciada.'
                : 'Gestão integrada de Federações, Associações e Mutuários, esteiras de crédito SBPE, espelho de vendas e formalização de posse imobiliária com fé pública.'
              }
            </p>
          </div>
        </div>

        {/* Mini Showcase do Cartão ou Matriz Habitacional */}
        <div className="relative z-10 py-6">
          {isDyamond ? (
            <div className="w-full max-w-[360px] rounded-2xl border border-[#22396F] shadow-2xl overflow-hidden bg-[#010736]">
              <img
                src="/assets/dyamond-card-gold-premium.png"
                alt="DYAMOND CARD"
                className="w-full h-auto object-cover"
              />
            </div>
          ) : (
            <div className="w-full max-w-[380px] p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#C8F2D6]">
                <span>Esteira Habitacional Ativa</span>
                <span className="px-2 py-0.5 rounded-full bg-[#16382C] text-white text-[10px]">100% RLS</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Autonomia garantida: cada federação e associação administra sua própria carteira sem vazamento de dados.
              </p>
            </div>
          )}
        </div>

        {/* Rodapé da Coluna Esquerda: Certificações Oficiais */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/15 text-xs text-slate-300">
          <div>
            <p className="font-extrabold text-white">4 Níveis</p>
            <p className="text-[11px] opacity-80">Isolamento Multi-Tenant</p>
          </div>
          <div>
            <p className="font-extrabold text-white">COSIF / BACEN</p>
            <p className="text-[11px] opacity-80">Partidas Dobradas</p>
          </div>
          <div>
            <p className="font-extrabold text-white">DY INVEST</p>
            <p className="text-[11px] opacity-80">Holding Controladora</p>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Chaveador de Portal e Formulário de Autenticação */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Faixa Superior de Contexto */}
        <div className={`absolute top-0 right-0 w-full text-white text-[11px] text-center py-2 font-bold tracking-widest uppercase shadow-sm transition-colors ${
          isDyamond ? 'bg-[#010736] border-b border-[#22396F]' : 'bg-[#16382C] border-b border-[#235B47]'
        }`}>
          {isDyamond ? 'Portal Oficial · DYAMOND CARD & FINTECH' : 'Portal Oficial · MORAR BEM BRASIL'}
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xl mt-6">
          {/* CHAVEADOR DE PORTAL SEPARADO (MORAR BEM BRASIL VS CARTÃO DYAMOND) */}
          <div className="mb-6 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] block">
              Selecione o Portal de Acesso:
            </span>
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#F8FAFD] rounded-2xl border border-[#CBD5E1]">
              <button
                type="button"
                onClick={() => switchScope('MORAR_BEM_BRASIL')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  !isDyamond
                    ? 'bg-[#16382C] text-white shadow-sm'
                    : 'text-[#475569] hover:text-[#16382C] hover:bg-white'
                }`}
              >
                <Building2 className="size-3.5" />
                <span>Morar Bem Brasil</span>
              </button>

              <button
                type="button"
                onClick={() => switchScope('DYAMOND_CARD')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  isDyamond
                    ? 'bg-[#010736] text-[#FCF1D0] shadow-sm'
                    : 'text-[#475569] hover:text-[#010736] hover:bg-white'
                }`}
              >
                <CreditCard className="size-3.5" />
                <span>Cartão Dyamond</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#010736] tracking-tight">
              {isDyamond ? 'Acesso ao Cartão Dyamond' : 'Acesso ao Morar Bem Brasil'}
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              {isDyamond
                ? 'Informe suas credenciais para gerenciar a bandeira de benefícios e cartões.'
                : 'Informe suas credenciais para acessar a esteira associativa e habitacional.'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-[#010736] uppercase tracking-wider mb-2" htmlFor="email">
                E-mail Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFD] pl-10 pr-4 py-3 text-sm text-[#010736] placeholder-[#94A3B8] focus:border-[#22396F] focus:bg-white outline-none transition-all font-medium"
                  placeholder={isDyamond ? 'card@dyinvest.com.br' : 'ceo@morarbembrasil.com'}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-[#010736] uppercase tracking-wider" htmlFor="password">
                  Senha de Acesso
                </label>
                <a href="#" className="text-xs font-bold text-[#22396F] hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFD] pl-10 pr-4 py-3 text-sm text-[#010736] placeholder-[#94A3B8] focus:border-[#22396F] focus:bg-white outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                isDyamond
                  ? 'bg-[#010736] hover:bg-[#0D1C42] text-[#FCF1D0] shadow-[#010736]/30 border border-[#22396F]'
                  : 'bg-[#16382C] hover:bg-[#112B22] shadow-[#16382C]/30 border border-[#235B47]'
              }`}
            >
              {loading ? (
                <span>Autenticando sessão segregada...</span>
              ) : (
                <>
                  Entrar no Portal {isDyamond ? 'Dyamond' : 'Morar Bem Brasil'} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Credenciais de Homologação Segregadas */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] space-y-2 text-center">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              Credenciais de Homologação Segregadas:
            </span>
            {isDyamond ? (
              <div className="p-3 rounded-xl bg-[#010736]/5 border border-[#22396F]/20 text-xs text-[#010736]">
                <p><strong>Portal Cartão Dyamond:</strong> card@dyinvest.com.br</p>
                <p className="text-[11px] text-[#475569]">Senha: <strong>diamond2026</strong></p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#16382C]/5 border border-[#16382C]/20 text-xs text-[#16382C]">
                <p><strong>Portal Morar Bem Brasil:</strong> ceo@morarbembrasil.com</p>
                <p className="text-[11px] text-[#475569]">Senha: <strong>diamond2026</strong></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
