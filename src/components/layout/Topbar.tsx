import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm sm:pl-64">
      
      <div className="flex items-center">
        {/* Botão Mobile */}
        <button className="mr-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 sm:hidden">
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Search */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2 pl-10 text-sm focus:border-amber-500 focus:ring-amber-500"
              placeholder="Busca global..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
          </span>
        </button>

        {/* User Badge Simples */}
        <div className="hidden sm:flex items-center gap-2 border-l pl-4">
          <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-slate-700">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
