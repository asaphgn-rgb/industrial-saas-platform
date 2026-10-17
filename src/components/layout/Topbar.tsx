import { Bell, Menu, Search, ChevronDown, MessageSquareLock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export function Topbar({ onToggleChat, isChatOpen }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 shadow-sm sm:pl-72 transition-all">

      <div className="flex items-center">
        {/* Botão Mobile */}
        <button className="mr-4 rounded-xl p-2 text-slate-700 hover:bg-slate-100 sm:hidden transition-colors">
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar - Estilo Santander Banking */}
        <div className="hidden md:block w-96">
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#EC0000] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-[#F4F6F9] p-2.5 pl-11 text-xs text-slate-900 placeholder-slate-400 focus:border-[#EC0000] focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
              placeholder="Pesquisar contas, cartões, contratos, propostas..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Botão de Acesso ao Canal Seguro B2B */}
        {onToggleChat && (
          <button
            onClick={onToggleChat}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              isChatOpen
                ? 'bg-[#EC0000] text-white border-[#EC0000] shadow-sm'
                : 'bg-red-50 text-[#EC0000] border-red-200 hover:bg-red-100'
            }`}
            title="Abrir Canal B2B Criptografado"
          >
            <MessageSquareLock className="h-4 w-4 text-[#EC0000]" />
            <span className="hidden md:inline">Canal Seguro</span>
          </button>
        )}

        {/* Notifications */}
        <button className="relative rounded-full p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EC0000]"></span>
          </span>
        </button>

        {/* User Badge - Estilo Santander Corporate */}
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-[#1C1C1C]">{user?.email?.split('@')[0]}</span>
            <span className="text-[10px] font-semibold text-[#EC0000]">{user?.role}</span>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-[#EC0000] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-all">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-[#EC0000] transition-colors" />
        </div>
      </div>
    </header>
  );
}
