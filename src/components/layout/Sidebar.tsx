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
  FolderLock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/authService';

export default function Sidebar() {
  const location = useLocation();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Logout erro:", error);
    } finally {
      setUser(null);
    }
  };

  const menuItems = {
    ADMIN_GLOBAL: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/crm', icon: TrendingUp, label: 'CRM e Comercial' },
      {
        label: 'Administração Global',
        icon: ShieldCheck,
        subItems: [
          { path: '/admin/federacoes', label: 'Gestão de Federações' },
          { path: '/admin/produtos', label: 'Gestão Global de Produtos' },
          { path: '/admin/monitoramento', label: 'Monitoramento Global' },
          { path: '/admin/auditoria', label: 'Auditoria e Logs' },
        ]
      }
    ],
    FEDERACAO: [
      { path: '/federacao/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/federacao/associacoes', icon: Building, label: 'Minhas Associações' },
      { path: '/federacao/relatorios', icon: FileText, label: 'Relatórios' },
      { path: '/federacao/configuracoes', icon: Settings, label: 'Configurações' },
    ],
    ASSOCIACAO: [
      { path: '/associacao/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/associacao/associados', icon: Users, label: 'Meus Associados' },
      { path: '/associacao/pre-analise', icon: Activity, label: 'Pré-análises' },
      { path: '/associacao/produtos', icon: Package, label: 'Produtos' },
    ],
    ASSOCIADO: [
      { path: '/associado/dashboard', icon: LayoutDashboard, label: 'Meu Painel' },
      { path: '/associado/documentos', icon: FolderLock, label: 'Pasta Digital' },
      { path: '/associado/produtos', icon: Package, label: 'Meu Imóvel' },
      { path: '/associado/contratos', icon: FileText, label: 'Meus Contratos' },
    ]
  };

  const currentRole = user?.role || 'ASSOCIADO';
  const items = menuItems[currentRole as keyof typeof menuItems] || [];

  return (
    <aside className="w-72 bg-diamond-950 border-r border-diamond-900/50 flex flex-col text-slate-300 transition-all duration-300 relative z-20">
      
      {/* Padrão de Fundo (Opcional - Igual ao Login) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

      {/* Header Logo */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-diamond-900/50 relative z-10">
        <ShieldCheck className="h-8 w-8 text-diamond-500" />
        <span className="text-xl font-bold text-white tracking-widest">DIAMOND</span>
      </div>

      {/* User Info (Minified) */}
      <div className="px-6 py-6 border-b border-diamond-900/50 relative z-10">
        <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
        <p className="text-xs text-diamond-400 font-medium tracking-wider mt-1">{user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10">
        {items.map((item, idx) => (
          item.subItems ? (
            <div key={idx} className="pt-4 pb-2">
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
                      className={`block px-4 py-2.5 rounded-r-xl text-sm font-medium transition-colors ${
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                location.pathname === item.path 
                  ? 'bg-diamond-500 text-white shadow-lg shadow-diamond-500/20' 
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
