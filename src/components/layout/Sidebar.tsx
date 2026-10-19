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
  Sparkles,
  Coins,
  PiggyBank,
  Receipt,
  ArrowRightLeft,
  ChevronRight,
  ChevronDown,
  Award,
  Layers,
  SlidersHorizontal,
  Compass,
  ArrowUpRight,
  Shield
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

  // Itens de Menu Habitacional (Morar Bem Brasil)
  const menuHabitacional = {
    ADMIN_GLOBAL: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Simulador Habitacional' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Espelho de Vendas' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila Social & Scoring' },
      { path: '/admin/contratos', icon: FileText, label: 'Contratos Digitais' },
      { path: '/admin/crm', icon: TrendingUp, label: 'Pipeline Comercial' },
      {
        label: 'Governança & Rede',
        icon: ShieldCheck,
        subItems: [
          { path: '/admin/federacoes', label: 'Federações' },
          { path: '/admin/produtos', label: 'Empreendimentos' },
          { path: '/admin/livro-razao', label: 'Livro-Razão Contábil' },
          { path: '/admin/fechamento-contabil', label: 'Fechamento & DRE' },
          { path: '/admin/parcerias-cobranded', label: 'Parcerias Co-Branded' },
          { path: '/admin/monitoramento', label: 'Monitoramento' },
          { path: '/admin/auditoria', label: 'Auditoria & Logs' },
        ]
      }
    ],
    FEDERACAO: [
      { path: '/federacao/dashboard', icon: LayoutDashboard, label: 'Painel da Federação' },
      { path: '/federacao/participacao-resultados', icon: TrendingUp, label: 'Participação & Repasses' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Esteira de Crédito' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Espelho de Vendas' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila Regional' },
      { path: '/federacao/associacoes', icon: Building, label: 'Minhas Associações' },
      { path: '/federacao/relatorios', icon: FileText, label: 'Relatórios' },
      { path: '/federacao/configuracoes', icon: Settings, label: 'Configurações' },
    ],
    ASSOCIACAO: [
      { path: '/associacao/dashboard', icon: LayoutDashboard, label: 'Painel da Associação' },
      { path: '/federacao/participacao-resultados', icon: TrendingUp, label: 'Nossos Repasses' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Simular p/ Associado' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Mapa de Unidades' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila de Convocação' },
      { path: '/associacao/associados', icon: Users, label: 'Meus Associados' },
      { path: '/associacao/pre-analise', icon: Activity, label: 'Pré-análises' },
      { path: '/associacao/produtos', icon: Package, label: 'Produtos' },
    ],
    ASSOCIADO: [
      { path: '/associado/dashboard', icon: LayoutDashboard, label: 'Meu Painel' },
      { path: '/associado/cartao-digital', icon: Wallet, label: 'Meu Cartão Digital' },
      { path: '/associado/adesao-cashback', icon: Sparkles, label: 'Adesão & Cashback R$50' },
      { path: '/associado/radar-imoveis', icon: Building2, label: 'Radar de Imóveis' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Simular Financiamento' },
      { path: '/associado/documentos', icon: FolderLock, label: 'Pasta Digital' },
      { path: '/admin/contratos', icon: FileText, label: 'Meus Contratos' },
      { path: '/associado/produtos', icon: Package, label: 'Meu Imóvel' },
    ]
  };

  // Itens de Menu Cartão Diamond (Fintech White Label)
  const menuCartao = {
    ADMIN_GLOBAL: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Dashboard Fintech' },
      { path: '/cartao/virtual', icon: Sparkles, label: 'Cartões & CVV' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Gestão de Limites' },
      { path: '/admin/parcerias-cobranded', icon: Store, label: 'Empresas Co-Branded' },
      { path: '/cartao/parceiros', icon: Store, label: 'Rede Credenciada' },
      { path: '/cartao/portal-lojista', icon: Receipt, label: 'Repasses Lojistas' },
      { path: '/cartao/cashback-moradia', icon: PiggyBank, label: 'Cashback Moradia' },
      {
        label: 'Crédito & Compliance',
        icon: ShieldCheck,
        subItems: [
          { path: '/cartao/faturas', label: 'Faturas & Liquidação' },
          { path: '/cartao/simulador-parcelamento', label: 'Simulador Bacen CET' },
          { path: '/cartao/politicas-risco', label: 'Políticas de Risco' },
          { path: '/cartao/auditoria-antifraude', label: 'Antifraude & COAF' },
        ]
      }
    ],
    FEDERACAO: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Painel Regional' },
      { path: '/federacao/participacao-resultados', icon: TrendingUp, label: 'Bonificação & Split' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Cartões Regionais' },
      { path: '/cartao/parceiros', icon: Store, label: 'Comércios Regionais' },
      { path: '/cartao/portal-lojista', icon: Receipt, label: 'Repasses Lojistas' },
    ],
    ASSOCIACAO: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Painel da Associação' },
      { path: '/federacao/participacao-resultados', icon: TrendingUp, label: 'Comissões Cartão' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Cartões dos Associados' },
      { path: '/cartao/parceiros', icon: Store, label: 'Clube de Benefícios' },
      { path: '/cartao/cashback-moradia', icon: PiggyBank, label: 'Poupança Moradia' },
    ],
    ASSOCIADO: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Meu Painel' },
      { path: '/associado/cartao-digital', icon: Wallet, label: 'Cartão Digital Pass' },
      { path: '/associado/adesao-cashback', icon: Sparkles, label: 'Saldo Cashback R$ 50' },
      { path: '/cartao/simulador-parcelamento', icon: Wallet, label: 'Parcelar Fatura' },
      { path: '/cartao/cashback-moradia', icon: PiggyBank, label: 'Abater Moradia' },
      { path: '/cartao/parceiros', icon: Store, label: 'Onde Usar' },
    ]
  };

  const currentRole = user?.role || 'ASSOCIADO';
  const activeMenuStructure = currentSegment === 'CARTAO' ? menuCartao : menuHabitacional;
  const items = activeMenuStructure[currentRole as keyof typeof activeMenuStructure] || [];

  return (
    <aside className="w-64 bg-white border-r border-[#E2EBE5] flex flex-col justify-between min-h-screen text-[#15241E] transition-all duration-300 relative z-20 select-none shadow-[2px_0_12px_rgba(22,56,44,0.03)]">
      <div>
        {/* Brand Header - Padrão Coinest Fintech Oficial */}
        <div className="h-20 flex items-center px-6 border-b border-[#E2EBE5]/60 bg-white">
          <div className="flex items-center gap-3">
            {/* Ícone Geométrico 4-Dots Trevo Coinest em Verde Floresta */}
            <div className="w-9 h-9 rounded-2xl bg-[#E8F8EE] flex items-center justify-center text-[#16382C]">
              <div className="grid grid-cols-2 gap-1 p-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16382C]" />
                <span className="w-2 h-2 rounded-full bg-[#16382C] opacity-75" />
                <span className="w-2 h-2 rounded-full bg-[#16382C] opacity-75" />
                <span className="w-2 h-2 rounded-full bg-[#16382C]" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-[#16382C] block leading-none font-sans">
                COINEST
              </span>
              <span className="text-[10px] font-bold text-[#526E62] tracking-wider uppercase mt-1 block">
                DIAMOND SUITE
              </span>
            </div>
          </div>
        </div>

        {/* Chaveador de Ecossistema em Pílula Pastel Coinest */}
        <div className="p-4 bg-[#F4F7F5] border-b border-[#E2EBE5]/70">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#526E62]">
              Módulo Ativo
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C8F2D6] text-[#16382C]">
              PRO
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-2xl border border-[#E2EBE5] shadow-sm">
            <button
              onClick={() => setSegment('HABITACIONAL')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                currentSegment === 'HABITACIONAL'
                  ? 'bg-[#16382C] text-white shadow-sm'
                  : 'text-[#526E62] hover:text-[#16382C] hover:bg-[#F4F7F5]'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Morar Bem</span>
            </button>
            <button
              onClick={() => setSegment('CARTAO')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                currentSegment === 'CARTAO'
                  ? 'bg-[#16382C] text-white shadow-sm'
                  : 'text-[#526E62] hover:text-[#16382C] hover:bg-[#F4F7F5]'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Cartão</span>
            </button>
          </div>
        </div>

        {/* Lista de Navegação no Estilo Coinest Pill */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-340px)]">
          {items.map((item, idx) => (
            item.subItems ? (
              <div key={idx} className="pt-3 pb-1">
                <div className="px-3 mb-2 flex items-center gap-2 text-[11px] font-bold text-[#88A395] uppercase tracking-wider">
                  <item.icon className="h-3.5 w-3.5 text-[#16382C]" />
                  {item.label}
                </div>
                <div className="space-y-1 pl-3 border-l-2 border-[#E2EBE5] ml-4">
                  {item.subItems.map((subItem) => {
                    const isActive = location.pathname === subItem.path;
                    return (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#C8F2D6] text-[#16382C] font-bold shadow-sm'
                            : 'text-[#526E62] hover:text-[#16382C] hover:bg-[#F4F7F5]'
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-200 text-xs font-semibold ${
                  location.pathname === item.path
                    ? 'bg-[#C8F2D6] text-[#16382C] font-bold shadow-sm'
                    : 'text-[#526E62] hover:text-[#16382C] hover:bg-[#F4F7F5]'
                }`}
              >
                <item.icon className={`h-4 w-4 ${location.pathname === item.path ? 'text-[#16382C]' : 'text-[#88A395]'}`} />
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* Seção Inferior: Promo Card "Get Pro" Coinest + User Profile */}
      <div className="p-4 space-y-3 bg-white border-t border-[#E2EBE5]/60">
        {/* Card "Get Pro" com fundo Forest Green Oficial Coinest */}
        <div className="relative overflow-hidden rounded-2xl bg-[#16382C] p-3.5 text-white shadow-md">
          {/* Círculo decorativo geométrico */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-[#1F4E3D] opacity-40 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-[#C8F2D6] mb-2">
              <Shield className="h-4 w-4 text-[#C8F2D6]" />
            </div>
            <p className="text-[11px] leading-tight font-medium text-[#C8F2D6] mb-2.5">
              Gestão financeira completa com governança e auditoria RLS.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C8F2D6] text-[#16382C] text-[11px] font-bold shadow-sm cursor-pointer hover:bg-[#b5e8c4] transition-colors">
              <span>Painel Executivo</span>
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#16382C] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#16382C] truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-[#526E62] font-semibold">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Encerrar Sessão"
            className="p-1.5 rounded-xl text-[#88A395] hover:text-[#EF4444] hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
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
