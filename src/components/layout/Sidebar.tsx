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
  ArrowRightLeft,
  Sparkles,
  Coins
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/authService';
import { useSystemContext } from '@/hooks/useSystemContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, setUser } = useAuth();
  const { currentSegment, setSegment, toggleSegment } = useSystemContext();

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
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Habitacional' },
      { path: '/admin/simulador-santander', icon: Calculator, label: 'Simulador Santander' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Espelho de Vendas' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila Social & Scoring' },
      { path: '/admin/contratos', icon: FileText, label: 'Contratos Digitais' },
      { path: '/admin/crm', icon: TrendingUp, label: 'CRM e Comercial' },
      {
        label: 'Administração Global',
        icon: ShieldCheck,
        subItems: [
          { path: '/admin/federacoes', label: 'Gestão de Federações' },
          { path: '/admin/produtos', label: 'Gestão de Empreendimentos' },
          { path: '/admin/monitoramento', label: 'Monitoramento Global' },
          { path: '/admin/auditoria', label: 'Auditoria e Logs' },
        ]
      }
    ],
    FEDERACAO: [
      { path: '/federacao/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/simulador-santander', icon: Calculator, label: 'Esteira de Crédito' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Espelho de Vendas' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila Regional' },
      { path: '/federacao/associacoes', icon: Building, label: 'Minhas Associações' },
      { path: '/federacao/relatorios', icon: FileText, label: 'Relatórios' },
      { path: '/federacao/configuracoes', icon: Settings, label: 'Configurações' },
    ],
    ASSOCIACAO: [
      { path: '/associacao/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/simulador-santander', icon: Calculator, label: 'Simular p/ Associado' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Mapa de Unidades' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila de Convocação' },
      { path: '/associacao/associados', icon: Users, label: 'Meus Associados' },
      { path: '/associacao/pre-analise', icon: Activity, label: 'Pré-análises' },
      { path: '/associacao/produtos', icon: Package, label: 'Produtos' },
    ],
    ASSOCIADO: [
      { path: '/associado/dashboard', icon: LayoutDashboard, label: 'Meu Painel' },
      { path: '/admin/simulador-santander', icon: Calculator, label: 'Simular Meu Financiamento' },
      { path: '/associado/documentos', icon: FolderLock, label: 'Pasta Digital' },
      { path: '/admin/contratos', icon: FileText, label: 'Meus Contratos' },
      { path: '/associado/produtos', icon: Package, label: 'Meu Imóvel' },
    ]
  };

  // Itens de Menu do Sistema CARTÃO DIAMOND (Fintech & Benefícios)
  const menuCartao = {
    ADMIN_GLOBAL: [
      { path: '/cartao', icon: CreditCard, label: 'Painel Geral Cartão' },
      { path: '/cartao/virtual', icon: Sparkles, label: 'Cartão Virtual & CVV' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Base de Cartões & Limites' },
      { path: '/cartao/parceiros', icon: Store, label: 'Rede de Parceiros' },
      { path: '/cartao/portal-lojista', icon: Building2, label: 'Portal do Lojista' },
      { path: '/cartao/cashback-moradia', icon: Coins, label: 'Cashback Habitacional' },
      {
        label: 'Governança & Crédito',
        icon: ShieldCheck,
        subItems: [
          { path: '/cartao/faturas', label: 'Faturas & Liquidação' },
          { path: '/cartao/simulador-parcelamento', label: 'Simulador Bacen' },
          { path: '/cartao/politicas-risco', label: 'Políticas de Risco' },
          { path: '/cartao/auditoria-antifraude', label: 'Antifraude & Bacen' },
        ]
      }
    ],
    FEDERACAO: [
      { path: '/cartao', icon: CreditCard, label: 'Cartões Regionais' },
      { path: '/cartao/parceiros', icon: Store, label: 'Comércios Regionais' },
      { path: '/cartao/portal-lojista', icon: Building2, label: 'Repasses Regionais' },
    ],
    ASSOCIACAO: [
      { path: '/cartao', icon: CreditCard, label: 'Cartões dos Associados' },
      { path: '/cartao/parceiros', icon: Store, label: 'Clube Local de Benefícios' },
      { path: '/cartao/cashback-moradia', icon: Coins, label: 'Cashback Habitacional' },
    ],
    ASSOCIADO: [
      { path: '/cartao/virtual', icon: Sparkles, label: 'Meu Cartão Virtual' },
      { path: '/cartao/simulador-parcelamento', icon: Wallet, label: 'Parcelar Fatura' },
      { path: '/cartao/cashback-moradia', icon: Coins, label: 'Abater Minha Moradia' },
      { path: '/cartao/parceiros', icon: Store, label: 'Onde Usar & Cashback' },
    ]
  };

  const currentRole = user?.role || 'ASSOCIADO';
  const activeMenuStructure = currentSegment === 'CARTAO' ? menuCartao : menuHabitacional;
  const items = activeMenuStructure[currentRole as keyof typeof activeMenuStructure] || [];

  return (
    <aside className="w-72 bg-diamond-950 border-r border-diamond-900/50 flex flex-col text-slate-300 transition-all duration-300 relative z-20">

      {/* Padrão de Fundo */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

      {/* Header Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-diamond-900/50 relative z-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-diamond-500" />
          <span className="text-xl font-bold text-white tracking-widest">DIAMOND</span>
        </div>
      </div>

      {/* Alternador de Sistemas (Segment Selector) */}
      <div className="p-4 border-b border-diamond-900/60 relative z-10 bg-slate-900/60">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
          Ambiente em Gestão:
        </p>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-diamond-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setSegment('HABITACIONAL')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
              currentSegment === 'HABITACIONAL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Habitacional</span>
          </button>
          <button
            onClick={() => setSegment('CARTAO')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
              currentSegment === 'CARTAO'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Cartão</span>
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className={`text-[10px] font-semibold tracking-wide ${
            currentSegment === 'HABITACIONAL' ? 'text-blue-400' : 'text-purple-400'
          }`}>
            {currentSegment === 'HABITACIONAL' ? '● MORAR BEM BRASIL' : '● CARTÃO DIAMOND BENEFÍCIOS'}
          </span>
        </div>
      </div>

      {/* User Info (Minified) */}
      <div className="px-6 py-4 border-b border-diamond-900/50 relative z-10">
        <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
        <p className="text-xs text-diamond-400 font-medium tracking-wider mt-0.5">{user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10">
        {items.map((item, idx) => (
          item.subItems ? (
            <div key={idx} className="pt-3 pb-2">
              <div className="px-4 mb-2 flex items-center gap-2 text-xs font-bold text-diamond-500 uppercase tracking-wider">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
              <div className="space-y-1 pl-4 border-l-2 border-diamond-900 ml-6">
                {item.subItems.map((subItem) => {
                  const isActive = location.pathname === subItem.path;
                  return (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`block px-4 py-2 rounded-r-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-diamond-500/10 text-diamond-400 border-l-2 border-diamond-500 -ml-[2px]'
                          : 'text-slate-400 hover:text-white hover:bg-diamond-900/50'
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                location.pathname === item.path
                  ? currentSegment === 'CARTAO'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'bg-diamond-500 text-white shadow-lg shadow-diamond-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-diamond-900/50'
              }`}
            >
              <item.icon className={`h-5 w-5 ${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          )
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-diamond-900/50 relative z-10 bg-diamond-950/50 backdrop-blur-sm">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-500/10 hover:text-red-300 group"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}

