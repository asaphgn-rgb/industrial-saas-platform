import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building,
  FileText,
  Settings,
  Package,
  Activity,
  ShieldCheck,
  TrendingUp,
  LogOut,
  FolderLock,
  CreditCard,
  Store,
  Wallet,
  Building2,
  Layers,
  Sparkles,
  Coins,
  PiggyBank,
  Receipt,
  ArrowRightLeft,
  SlidersHorizontal
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

  // Itens de Menu do Sistema MORAR BEM BRASIL (Habitacional)
  const menuHabitacional = {
    ADMIN_GLOBAL: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Geral' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Simulador Imobiliário' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Espelho de Vendas' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila Social & Scoring' },
      { path: '/admin/contratos', icon: FileText, label: 'Contratos Digitais' },
      { path: '/admin/crm', icon: TrendingUp, label: 'Pipeline Comercial' },
      {
        label: 'Administração Global',
        icon: ShieldCheck,
        subItems: [
          { path: '/admin/federacoes', label: 'Gestão de Federações' },
          { path: '/admin/produtos', label: 'Empreendimentos' },
          { path: '/admin/monitoramento', label: 'Monitoramento' },
          { path: '/admin/auditoria', label: 'Auditoria & Logs' },
        ]
      }
    ],
    FEDERACAO: [
      { path: '/federacao/dashboard', icon: LayoutDashboard, label: 'Dashboard Federação' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Esteira de Crédito' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Espelho de Vendas' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila Regional' },
      { path: '/federacao/associacoes', icon: Building, label: 'Associações Vinculadas' },
      { path: '/federacao/relatorios', icon: FileText, label: 'Relatórios' },
      { path: '/federacao/configuracoes', icon: Settings, label: 'Configurações' },
    ],
    ASSOCIACAO: [
      { path: '/associacao/dashboard', icon: LayoutDashboard, label: 'Dashboard Associação' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Simular Crédito' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Mapa de Unidades' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila de Convocação' },
      { path: '/associacao/associados', icon: Users, label: 'Meus Associados' },
      { path: '/associacao/pre-analise', icon: Activity, label: 'Pré-análises' },
      { path: '/associacao/produtos', icon: Package, label: 'Produtos Habitacionais' },
    ],
    ASSOCIADO: [
      { path: '/associado/dashboard', icon: LayoutDashboard, label: 'Meu Painel' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Simular Financiamento' },
      { path: '/associado/documentos', icon: FolderLock, label: 'Pasta Digital' },
      { path: '/admin/contratos', icon: FileText, label: 'Meus Contratos' },
      { path: '/associado/produtos', icon: Package, label: 'Meu Imóvel' },
    ]
  };

  // Itens de Menu do Sistema CARTÃO DIAMOND (Design Coinest Fintech)
  const menuCartao = {
    ADMIN_GLOBAL: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Dashboard Coinest' },
      { path: '/cartao/virtual', icon: Sparkles, label: 'Cartões & CVV' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Base de Cartões' },
      { path: '/cartao/parceiros', icon: Store, label: 'Rede de Parceiros' },
      { path: '/cartao/portal-lojista', icon: Receipt, label: 'Portal do Lojista' },
      { path: '/cartao/cashback-moradia', icon: PiggyBank, label: 'Cashback & Poupança' },
      {
        label: 'Governança & Risco',
        icon: ShieldCheck,
        subItems: [
          { path: '/cartao/faturas', label: 'Faturas & Liquidação' },
          { path: '/cartao/simulador-parcelamento', label: 'Simulador Bacen' },
          { path: '/cartao/politicas-risco', label: 'Políticas de Risco' },
          { path: '/cartao/auditoria-antifraude', label: 'Antifraude Bacen' },
        ]
      }
    ],
    FEDERACAO: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Painel Cartão' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Cartões Regionais' },
      { path: '/cartao/parceiros', icon: Store, label: 'Comércios Regionais' },
      { path: '/cartao/portal-lojista', icon: Receipt, label: 'Repasses Lojistas' },
    ],
    ASSOCIACAO: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Painel Cartão' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Cartões dos Associados' },
      { path: '/cartao/parceiros', icon: Store, label: 'Clube de Vantagens' },
      { path: '/cartao/cashback-moradia', icon: PiggyBank, label: 'Poupança Moradia' },
    ],
    ASSOCIADO: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Meu Painel' },
      { path: '/cartao/virtual', icon: Sparkles, label: 'Meu Cartão Digital' },
      { path: '/cartao/simulador-parcelamento', icon: Wallet, label: 'Parcelar Fatura' },
      { path: '/cartao/cashback-moradia', icon: PiggyBank, label: 'Abater Moradia' },
      { path: '/cartao/parceiros', icon: Store, label: 'Onde Usar' },
    ]
  };

  const currentRole = user?.role || 'ASSOCIADO';
  const activeMenuStructure = currentSegment === 'CARTAO' ? menuCartao : menuHabitacional;
  const items = activeMenuStructure[currentRole as keyof typeof activeMenuStructure] || [];

  return (
    <aside className="w-64 bg-[#FAFCFA] border-r border-emerald-100 flex flex-col justify-between min-h-screen text-slate-700 transition-all duration-300 relative z-20 select-none">

      <div>
        {/* Brand Header - Estilo Coinest Fintech */}
        <div className="h-20 flex items-center px-6 border-b border-emerald-100/60 bg-white">
          <div className="flex items-center gap-3">
            {/* Logo com 4 folhas/dots Coinest Style */}
            <div className="w-10 h-10 rounded-2xl bg-[#133E32] flex items-center justify-center text-white shadow-md shadow-emerald-950/10">
              <div className="grid grid-cols-2 gap-1 p-2">
                <span className="w-2 h-2 rounded-full bg-[#5FD288]" />
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="w-2 h-2 rounded-full bg-[#5FD288]" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-[#133E32] block leading-none">
                DIAMOND
              </span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase mt-0.5 block">
                Fintech Platform
              </span>
            </div>
          </div>
        </div>

        {/* Switcher de Ecossistemas com design de cápsula moderna */}
        <div className="p-4 border-b border-emerald-100/60 bg-[#F4F8F5]">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800/70 mb-2">
            Módulo em Operação:
          </p>
          <div className="grid grid-cols-2 gap-1 p-1 bg-white rounded-xl border border-emerald-200/60 shadow-sm">
            <button
              onClick={() => setSegment('HABITACIONAL')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                currentSegment === 'HABITACIONAL'
                  ? 'bg-[#133E32] text-white shadow-md'
                  : 'text-slate-500 hover:text-[#133E32] hover:bg-emerald-50'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Morar Bem</span>
            </button>
            <button
              onClick={() => setSegment('CARTAO')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                currentSegment === 'CARTAO'
                  ? 'bg-[#133E32] text-white shadow-md'
                  : 'text-slate-500 hover:text-[#133E32] hover:bg-emerald-50'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Cartão</span>
            </button>
          </div>
        </div>

        {/* Navegação Principal em Pills Estilo Coinest */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
          {items.map((item, idx) => (
            item.subItems ? (
              <div key={idx} className="pt-3 pb-1">
                <div className="px-3 mb-2 flex items-center gap-2 text-[11px] font-extrabold text-[#133E32]/70 uppercase tracking-wider">
                  <item.icon className="h-3.5 w-3.5 text-emerald-600" />
                  {item.label}
                </div>
                <div className="space-y-1 pl-3 border-l-2 border-emerald-200/60 ml-4">
                  {item.subItems.map((subItem) => {
                    const isActive = location.pathname === subItem.path;
                    return (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#133E32] text-white shadow-sm'
                            : 'text-slate-600 hover:text-[#133E32] hover:bg-emerald-100/50'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-xs ${
                  location.pathname === item.path
                    ? 'bg-[#133E32] text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-[#133E32] hover:bg-emerald-100/50'
                }`}
              >
                <item.icon className={`h-4 w-4 ${location.pathname === item.path ? 'text-[#5FD288]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* Footer com Card do Usuário e Logout */}
      <div className="p-4 border-t border-emerald-100/80 bg-white">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#F0F6F2] border border-emerald-100 mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#133E32] text-[#5FD288] font-bold text-xs flex items-center justify-center shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#133E32] truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-emerald-700 font-semibold">{user?.role}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
}

function CalculatorIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}
