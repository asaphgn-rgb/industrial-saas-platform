import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, FileText, Settings, Shield, LogOut } from 'lucide-react';
import { authService } from '@/services/auth/authService';

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Filtra as rotas que o usuário logado tem permissão para ver
  const allowedRoutes = routes.filter(route => route.rolesAllowed.includes(user.role));

  const handleLogout = async () => {
    await authService.signOut();
    logout();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-slate-950 text-slate-100 transition-transform sm:translate-x-0">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        
        {/* Logo Area */}
        <div className="mb-6 flex items-center justify-center border-b border-slate-800 pb-4">
          <Shield className="mr-2 h-8 w-8 text-amber-500" />
          <span className="text-xl font-bold uppercase tracking-wider text-amber-500">Diamond</span>
        </div>

        {/* User Info */}
        <div className="mb-6 rounded-lg bg-slate-900 p-4">
          <p className="truncate text-sm font-semibold">{user.email}</p>
          <p className="text-xs text-slate-400">{user.role}</p>
        </div>

        {/* Navigation */}
        <ul className="space-y-2 font-medium flex-1">
          {allowedRoutes.map((route) => {
            const isActive = location.pathname.startsWith(route.path);
            
            return (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className={cn(
                    "group flex items-center rounded-lg p-2 hover:bg-slate-800",
                    isActive ? "bg-slate-800 text-amber-400" : "text-slate-300"
                  )}
                >
                  <LayoutDashboard className="h-5 w-5 transition duration-75" />
                  <span className="ml-3">{route.title}</span>
                </Link>
                
                {/* Submenus se existirem e for a rota ativa ou se quisermos expandir */}
                {route.children && (
                  <ul className="mt-2 space-y-1 pl-8">
                    {route.children.filter(child => child.rolesAllowed.includes(user.role)).map(child => (
                       <li key={child.path}>
                         <Link
                           to={child.path}
                           className={cn(
                             "flex items-center rounded-lg p-2 text-sm hover:bg-slate-800",
                             location.pathname === child.path ? "text-amber-400 font-semibold" : "text-slate-400"
                           )}
                         >
                           {child.title}
                         </Link>
                       </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg p-2 text-slate-300 hover:bg-red-900/50 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sair</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
