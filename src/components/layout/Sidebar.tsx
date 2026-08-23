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

  const allowedRoutes = routes.filter(route => route.rolesAllowed.includes(user.role));

  const handleLogout = async () => {
    await authService.signOut();
    logout();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-diamond-900/50 bg-diamond-950 text-slate-100 transition-transform sm:translate-x-0">
      <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
        
        {/* Logo Area */}
        <div className="mb-8 flex items-center gap-3">
          <Shield className="h-8 w-8 text-diamond-500" />
          <span className="text-xl font-bold uppercase tracking-widest text-white">Diamond</span>
        </div>

        {/* User Info */}
        <div className="mb-8 rounded-xl bg-diamond-900/50 p-4 border border-white/5">
          <p className="truncate text-sm font-semibold text-white">{user.email}</p>
          <p className="text-xs text-diamond-400 mt-1 font-medium tracking-wide">{user.role}</p>
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
                    "group flex items-center rounded-xl p-3 transition-all duration-200",
                    isActive ? "bg-diamond-500 text-white shadow-soft" : "text-diamond-400 hover:bg-diamond-900/50 hover:text-white"
                  )}
                >
                  <LayoutDashboard className="h-5 w-5 transition duration-75" />
                  <span className="ml-3 font-semibold tracking-wide">{route.title}</span>
                </Link>
                
                {route.children && (
                  <ul className="mt-2 space-y-1 pl-10 border-l border-diamond-900/50 ml-5">
                    {route.children.filter(child => child.rolesAllowed.includes(user.role)).map(child => (
                       <li key={child.path} className="relative">
                         <div className="absolute -left-[21px] top-1/2 w-4 h-px bg-diamond-900/50"></div>
                         <Link
                           to={child.path}
                           className={cn(
                             "flex items-center rounded-lg p-2 text-sm transition-all",
                             location.pathname === child.path ? "text-diamond-500 font-semibold" : "text-diamond-400 hover:text-white hover:bg-diamond-900/30"
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
        <div className="mt-auto pt-6 border-t border-diamond-900/50">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-xl p-3 text-diamond-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3 font-semibold">Sair do Sistema</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
