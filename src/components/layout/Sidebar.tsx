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

  // Menu Principal DYAMOND 100% idêntico às telas de referência
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
    <aside className="w-64 bg-[#06152B] flex flex-col justify-between min-h-screen text-[#8E9CAB] transition-all duration-300 relative z-30 select-none border-r border-[#132742]">
      <div>
        {/* LOGO MASTER: DYAMOND COM O DIAMANTE DOURADO */}
        <div className="h-24 flex items-center px-6 border-b border-[#132742]/80 bg-[#06152B]">
          <Link to="/dashboard" className="flex items-center gap-3">
            {/* Ícone Diamante Dourado Geométrico */}
            <div className="w-10 h-10 shrink-0 text-[#D4AF37] flex items-center justify-center">
              <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
                {/* Linhas externas do diamante */}
                <path d="M20 2L36 14L20 38L4 14L20 2Z" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" fill="none" />
                {/* Facetas internas */}
                <path d="M4 14H36" stroke="#D4AF37" strokeWidth="1.5" />
                <path d="M12 14L20 38L28 14" stroke="#D4AF37" strokeWidth="1.5" />
                <path d="M12 14L20 2L28 14" stroke="#D4AF37" strokeWidth="1.5" />
                <path d="M4 14L20 18L36 14" stroke="#D4AF37" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white block leading-none font-sans">
                DYAMOND
              </span>
              <span className="text-[9px] font-bold text-[#8E9CAB] tracking-widest uppercase mt-1 block leading-tight">
                ECOSSISTEMA FINANCEIRO<br />E DE BENEFÍCIOS
              </span>
            </div>
          </Link>
        </div>

        {/* Chaveador de Gestão Integrada: Morar Bem Brasil vs. Cartão Diamond */}
        <div className="px-4 py-3 bg-[#0A1D36] border-b border-[#132742] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#8E9CAB]">
            <span>Operação Ativa</span>
            <span className="text-[#0066FF] bg-[#0066FF]/10 px-2 py-0.5 rounded-full border border-[#0066FF]/30 font-bold">
              DY INVESTI
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 p-1 bg-[#06152B] rounded-xl border border-[#132742]">
            <button
              onClick={() => setSegment('HABITACIONAL')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                currentSegment === 'HABITACIONAL'
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-[#8E9CAB] hover:text-white hover:bg-[#0E223D]'
              }`}
            >
              <Building2 className="h-3 w-3" />
              <span className="truncate">Habitacional</span>
            </button>
            <button
              onClick={() => setSegment('CARTAO')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                currentSegment === 'CARTAO'
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-[#8E9CAB] hover:text-white hover:bg-[#0E223D]'
              }`}
            >
              <CreditCard className="h-3 w-3" />
              <span className="truncate">Cartão</span>
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO PRINCIPAL DYAMOND (10 ITENS OFICIAIS) */}
        <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-340px)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 text-xs font-semibold ${
                  isActive
                    ? 'bg-[#0066FF] text-white font-bold shadow-md shadow-[#0066FF]/25'
                    : 'text-[#8E9CAB] hover:text-white hover:bg-[#0E223D]'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[#8E9CAB]'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER: SLOGAN OFICIAL + USER PROFILE */}
      <div className="p-4 space-y-3 bg-[#06152B] border-t border-[#132742]">
        {/* Slogan Oficial dos Mockups */}
        <div className="px-1 text-[11px] text-[#8E9CAB] leading-relaxed">
          <p className="font-semibold text-slate-300">Mais pessoas</p>
          <p className="text-slate-400">mais possibilidades.</p>
        </div>

        {/* Perfil & Logout */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[#0A1D36] border border-[#132742]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#0066FF] text-white font-black text-xs flex items-center justify-center shrink-0">
              FA
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">Fabiano Asaph</p>
              <p className="text-[10px] text-[#8E9CAB] font-semibold">{user?.role || 'Administrador'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Encerrar Sessão"
            className="p-1.5 rounded-xl text-[#8E9CAB] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
