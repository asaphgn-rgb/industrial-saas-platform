import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Package,
  ShoppingCart,
  Gift,
  ArrowLeftRight,
  CheckCircle2,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  LogOut,
  Building2,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/authService';
import { useSystemContext } from '@/hooks/useSystemContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, setUser } = useAuth();
  const { currentSegment, setSegment } = useSystemContext();

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Logout erro:", error);
    } finally {
      setUser(null);
    }
  };

  // Menu Principal Oficial Dyinvest / Dyamond
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
    { path: '/carteira-360', icon: Compass, label: 'Carteira 360°' },
    { path: '/produtos-ofertas', icon: Package, label: 'Produtos e Ofertas' },
    { path: '/marketplace', icon: ShoppingCart, label: 'Marketplace' },
    { path: '/beneficios', icon: Gift, label: 'Benefícios' },
    { path: '/financeiro-api', icon: ArrowLeftRight, label: 'Financeiro & API' },
    { path: '/aprovacoes', icon: CheckCircle2, label: 'Aprovações' },
    { path: '/atendimento', icon: MessageSquare, label: 'Atendimento' },
    { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
    { path: '/governanca', icon: ShieldCheck, label: 'Governança' },
  ];

  return (
    <aside className="w-64 bg-[#010736] flex flex-col justify-between min-h-screen text-[#94A3B8] transition-all duration-300 relative z-30 select-none border-r border-[#0D1C42]">
      <div>
        {/* LOGO MASTER OFICIAL DYINVEST — PALETA #010736 / #0D1C42 / #22396F / #FCF1D0 */}
        <div className="h-24 flex items-center px-5 border-b border-[#0D1C42] bg-[#010736]">
          <Link to="/dashboard" className="flex items-center gap-3 w-full">
            <div className="h-12 w-auto shrink-0 flex items-center justify-center">
              <img
                src="/assets/dyinvest-brand.webp"
                alt="Dyinvest"
                className="h-10 w-auto max-w-[190px] object-contain rounded"
                onError={(e) => {
                  // Fallback vetorial com a geometria e tipografia exata da marca
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </Link>
        </div>

        {/* Chaveador de Gestão Integrada: Morar Bem Brasil vs. Cartão Diamond */}
        <div className="px-4 py-3 bg-[#0D1C42]/50 border-b border-[#0D1C42] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            <span>Operação Ativa</span>
            <span className="text-[#FCF1D0] bg-[#22396F] px-2 py-0.5 rounded-full border border-[#22396F] font-bold text-[9px]">
              DY INVEST
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 p-1 bg-[#010736] rounded-xl border border-[#0D1C42]">
            <button
              onClick={() => setSegment('HABITACIONAL')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                currentSegment === 'HABITACIONAL'
                  ? 'bg-[#22396F] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#0D1C42]'
              }`}
            >
              <Building2 className="h-3 w-3" />
              <span className="truncate">Habitacional</span>
            </button>
            <button
              onClick={() => setSegment('CARTAO')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                currentSegment === 'CARTAO'
                  ? 'bg-[#22396F] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#0D1C42]'
              }`}
            >
              <CreditCard className="h-3 w-3" />
              <span className="truncate">Cartão</span>
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO PRINCIPAL DYINVEST (10 ITENS OFICIAIS) */}
        <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-340px)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl transition-all duration-200 text-xs font-semibold ${
                  isActive
                    ? 'bg-[#22396F] text-white font-bold shadow-md shadow-[#010736]/50 border border-[#22396F]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#0D1C42]'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#FCF1D0]' : 'text-[#94A3B8]'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER: SLOGAN OFICIAL + USER PROFILE */}
      <div className="p-4 space-y-3 bg-[#010736] border-t border-[#0D1C42]">
        {/* Identificação Dyinvest */}
        <div className="px-1 text-[10px] text-[#94A3B8] leading-tight">
          <p className="font-bold text-[#FCF1D0]">DY INVEST</p>
          <p className="text-[9px] text-[#64748B]">Dy Card Serv. Cons. Invest. Fin. Ltda</p>
        </div>

        {/* Perfil & Logout */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[#0D1C42] border border-[#22396F]/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#22396F] text-[#FCF1D0] font-black text-xs flex items-center justify-center shrink-0 border border-[#22396F]">
              FA
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">Fabiano Asaph</p>
              <p className="text-[10px] text-[#94A3B8] font-semibold">{user?.role || 'Administrador'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Encerrar Sessão"
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
