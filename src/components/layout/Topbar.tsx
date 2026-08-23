import { Bell, Menu, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 z-30 flex h-20 w-full items-center justify-between border-b bg-white/80 backdrop-blur-md px-6 shadow-sm sm:pl-72 transition-all">
      
      <div className="flex items-center">
        {/* Botão Mobile */}
        <button className="mr-4 rounded-lg p-2 text-diamond-500 hover:bg-diamond-50 sm:hidden transition-colors">
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Search Bar - Estilo Nubank/Bancário */}
        <div className="hidden md:block w-96">
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-diamond-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full rounded-full border border-slate-200 bg-slate-50/50 p-2.5 pl-11 text-sm text-slate-900 placeholder-slate-400 focus:border-diamond-500 focus:bg-white focus:ring-4 focus:ring-diamond-500/10 transition-all outline-none"
              placeholder="Pesquisar associados, produtos, contratos..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative rounded-full p-2.5 text-slate-500 hover:bg-slate-100 hover:text-diamond-950 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
        </button>

        {/* User Badge - Estilo Premium */}
        <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-diamond-950">{user?.email?.split('@')[0]}</span>
            <span className="text-xs font-medium text-diamond-500">{user?.role}</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-diamond-900 to-diamond-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-all">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-diamond-500 transition-colors" />
        </div>
      </div>
    </header>
  );
}
