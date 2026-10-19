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
  Shield,
  FileSpreadsheet,
  Globe,
  Sliders,
  DollarSign,
  Landmark,
  Layers3
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

  // =========================================================================
  // SISTEMA 1: GESTÃO INDEPENDENTE MORAR BEM BRASIL (HABITACIONAL COOPERATIVO)
  // =========================================================================
  const menuHabitacional = {
    ADMIN_GLOBAL: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Executivo MBB' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Simulador Habitacional' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Espelho de Lotes & Gleba' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila Social & Scoring' },
      { path: '/associado/radar-imoveis', icon: Compass, label: 'Radar de Imóveis Desejados' },
      { path: '/associado/adesao-cashback', icon: Sparkles, label: 'Adesão Cadastral (R$ 50)' },
      { path: '/admin/contratos', icon: FileText, label: 'Contratos Digitais (MP 2200)' },
      { path: '/admin/crm', icon: TrendingUp, label: 'Pipeline Comercial MBB' },
      {
        label: 'Governança & Rede Federada',
        icon: ShieldCheck,
        subItems: [
          { path: '/admin/federacoes', label: 'Federações Estaduais' },
          { path: '/admin/produtos', label: 'Matrizes & Empreendimentos' },
          { path: '/admin/livro-razao', label: 'Livro-Razão Contábil' },
          { path: '/admin/fechamento-contabil', label: 'Fechamento & DRE Oficial' },
          { path: '/admin/monitoramento', label: 'Monitoramento da Rede' },
          { path: '/admin/auditoria', label: 'Auditoria & Logs RLS' },
        ]
      }
    ],
    FEDERACAO: [
      { path: '/federacao/dashboard', icon: LayoutDashboard, label: 'Painel da Federação' },
      { path: '/federacao/participacao-resultados', icon: TrendingUp, label: 'Participação & Repasses' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Esteira de Crédito' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Espelho de Lotes' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila Social Regional' },
      { path: '/federacao/associacoes', icon: Building, label: 'Minhas Associações' },
      { path: '/federacao/relatorios', icon: FileText, label: 'Relatórios Executivos' },
      { path: '/federacao/configuracoes', icon: Settings, label: 'Configurações' },
    ],
    ASSOCIACAO: [
      { path: '/associacao/dashboard', icon: LayoutDashboard, label: 'Painel da Associação' },
      { path: '/federacao/participacao-resultados', icon: TrendingUp, label: 'Repasses da Base' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Simular Financiamento' },
      { path: '/admin/espelho-vendas', icon: Building2, label: 'Mapa de Unidades' },
      { path: '/admin/fila-social', icon: Users, label: 'Fila de Convocação' },
      { path: '/associacao/associados', icon: Users, label: 'Meus Associados' },
      { path: '/associacao/pre-analise', icon: Activity, label: 'Pré-Análises de Crédito' },
      { path: '/associacao/produtos', icon: Package, label: 'Catálogo de Imóveis' },
    ],
    ASSOCIADO: [
      { path: '/associado/dashboard', icon: LayoutDashboard, label: 'Meu Painel Habitacional' },
      { path: '/associado/adesao-cashback', icon: Sparkles, label: 'Adesão & Cashback R$ 50' },
      { path: '/associado/radar-imoveis', icon: Building2, label: 'Radar de Imóveis dos Sonhos' },
      { path: '/admin/simulador-santander', icon: CalculatorIcon, label: 'Simular Financiamento' },
      { path: '/associado/documentos', icon: FolderLock, label: 'Minha Pasta Digital' },
      { path: '/admin/contratos', icon: FileText, label: 'Meus Contratos' },
      { path: '/associado/produtos', icon: Package, label: 'Meu Imóvel / Lote' },
    ]
  };

  // =========================================================================
  // SISTEMA 2: GESTÃO INDEPENDENTE CARTÃO DIAMOND (FINTECH & BAAS WHITE LABEL)
  // =========================================================================
  const menuCartao = {
    ADMIN_GLOBAL: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Central Fintech Diamond' },
      { path: '/associado/cartao-digital', icon: Wallet, label: 'Cartão Digital Pass' },
      { path: '/cartao/virtual', icon: Sparkles, label: 'Cartões Virtuais & CVV' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Base de Cartões & Limites' },
      { path: '/admin/parcerias-cobranded', icon: Store, label: 'Empresas Co-Branded' },
      { path: '/cartao/parceiros', icon: Store, label: 'Rede Credenciada' },
      { path: '/cartao/portal-lojista', icon: Receipt, label: 'Repasses Lojistas D+1' },
      { path: '/cartao/cashback-moradia', icon: PiggyBank, label: 'Cashback Moradia' },
      {
        label: 'Crédito, Split & Bacen',
        icon: ShieldCheck,
        subItems: [
          { path: '/federacao/participacao-resultados', label: 'Split de Bonificação' },
          { path: '/cartao/faturas', label: 'Faturas & Liquidação' },
          { path: '/cartao/simulador-parcelamento', label: 'Simulador Bacen CET' },
          { path: '/cartao/politicas-risco', label: 'Políticas de Risco' },
          { path: '/cartao/auditoria-antifraude', label: 'Antifraude & COAF' },
        ]
      }
    ],
    FEDERACAO: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Painel Regional BaaS' },
      { path: '/federacao/participacao-resultados', icon: TrendingUp, label: 'Bonificação & Split' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Cartões Regionais' },
      { path: '/cartao/parceiros', icon: Store, label: 'Comércios Regionais' },
      { path: '/cartao/portal-lojista', icon: Receipt, label: 'Repasses Lojistas' },
    ],
    ASSOCIACAO: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Painel BaaS Associação' },
      { path: '/federacao/participacao-resultados', icon: TrendingUp, label: 'Comissões da Base' },
      { path: '/cartao/gestao', icon: Wallet, label: 'Cartões dos Associados' },
      { path: '/cartao/parceiros', icon: Store, label: 'Clube de Vantagens' },
      { path: '/cartao/cashback-moradia', icon: PiggyBank, label: 'Poupança Moradia' },
    ],
    ASSOCIADO: [
      { path: '/cartao', icon: LayoutDashboard, label: 'Meu Painel Fintech' },
      { path: '/associado/cartao-digital', icon: Wallet, label: 'Meu Cartão Digital Pass' },
      { path: '/associado/adesao-cashback', icon: Sparkles, label: 'Saldo de Cashback R$ 50' },
      { path: '/cartao/simulador-parcelamento', icon: Wallet, label: 'Parcelar Fatura' },
      { path: '/cartao/cashback-moradia', icon: PiggyBank, label: 'Abater na Moradia' },
      { path: '/cartao/parceiros', icon: Store, label: 'Onde Usar (Descontos)' },
    ]
  };

  const currentRole = user?.role || 'ASSOCIADO';
  const activeMenuStructure = currentSegment === 'CARTAO' ? menuCartao : menuHabitacional;
  const items = activeMenuStructure[currentRole as keyof typeof activeMenuStructure] || [];

  return (
    <aside className="w-64 bg-white border-r border-[#E2EBE5] flex flex-col justify-between min-h-screen text-[#15241E] transition-all duration-300 relative z-20 select-none shadow-[2px_0_12px_rgba(22,56,44,0.03)]">
      <div>
        {/* BRAND MASTER HEADER: DY INVESTI (GESTORA GLOBAL) */}
        <div className="h-20 flex items-center px-5 border-b border-[#E2EBE5]/70 bg-white">
          <div className="flex items-center gap-3">
            {/* Ícone Geométrico Institucional da Gestora Global DY INVESTI */}
            <div className="w-10 h-10 rounded-2xl bg-[#16382C] flex items-center justify-center text-[#C8F2D6] shadow-sm">
              <span className="font-display font-black text-sm tracking-wider">DY</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-[#16382C] block leading-none font-sans">
                  DY INVESTI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6]">
                  GLOBAL
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#526E62] tracking-wider uppercase mt-1 block">
                GESTORA DO ECOSSISTEMA
              </span>
            </div>
          </div>
        </div>

        {/* CHAVEADOR DE GESTÃO INDEPENDENTE: MORAR BEM BRASIL VS. CARTÃO DIAMOND */}
        <div className="p-3.5 bg-[#F4F7F5] border-b border-[#E2EBE5]/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#88A395]">
              Gestão Ativa Segregada
            </span>
            <span className="text-[10px] font-bold text-[#16382C] bg-white px-2 py-0.5 rounded-full border border-[#E2EBE5]">
              Independente
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-2xl border border-[#E2EBE5] shadow-sm">
            <button
              onClick={() => setSegment('HABITACIONAL')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                currentSegment === 'HABITACIONAL'
                  ? 'bg-[#16382C] text-white shadow-sm'
                  : 'text-[#526E62] hover:text-[#16382C] hover:bg-[#F4F7F5]'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Morar Bem</span>
            </button>
            <button
              onClick={() => setSegment('CARTAO')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                currentSegment === 'CARTAO'
                  ? 'bg-[#16382C] text-white shadow-sm'
                  : 'text-[#526E62] hover:text-[#16382C] hover:bg-[#F4F7F5]'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Cartão Diamond</span>
            </button>
          </div>

          <div className="px-1 flex items-center justify-between text-[10px] text-[#526E62]">
            <span>Vertical: {currentSegment === 'HABITACIONAL' ? 'Habitação & Lotes' : 'Fintech & BaaS'}</span>
            <span className="font-bold text-[#16382C]">Operação 100% Autônoma</span>
          </div>
        </div>

        {/* LISTA DE NAVEGAÇÃO DA VERTICAL ATIVA */}
        <nav className="p-3.5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-360px)]">
          {items.map((item, idx) => (
            item.subItems ? (
              <div key={idx} className="pt-2.5 pb-1">
                <div className="px-3 mb-1.5 flex items-center gap-2 text-[10px] font-bold text-[#88A395] uppercase tracking-wider">
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
                        className={`block px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
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
                className={`flex items-center gap-3 px-3 py-2 rounded-2xl transition-all duration-200 text-xs font-semibold ${
                  location.pathname === item.path
                    ? 'bg-[#C8F2D6] text-[#16382C] font-bold shadow-sm'
                    : 'text-[#526E62] hover:text-[#16382C] hover:bg-[#F4F7F5]'
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${location.pathname === item.path ? 'text-[#16382C]' : 'text-[#88A395]'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* FOOTER: DY INVESTI HOLDING GOVERNANCE + USER PROFILE */}
      <div className="p-3.5 space-y-2.5 bg-white border-t border-[#E2EBE5]/70">
        {/* Card Institucional DY INVESTI */}
        <div className="relative overflow-hidden rounded-2xl bg-[#16382C] p-3 text-white shadow-md">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-[#1F4E3D] opacity-40 pointer-events-none" />
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#C8F2D6] uppercase tracking-wider">
                DY INVESTI GESTORA
              </span>
              <Shield className="h-3.5 w-3.5 text-[#C8F2D6]" />
            </div>
            <p className="text-[11px] leading-tight text-[#E8F8EE]">
              Auditoria contábil integrada com segregação jurídica e operacional.
            </p>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#16382C] text-[#C8F2D6] font-bold text-xs flex items-center justify-center shrink-0">
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
