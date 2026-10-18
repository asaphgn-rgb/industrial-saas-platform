import { Bell, Menu, Search, MessageSquareLock, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export function Topbar({ onToggleChat, isChatOpen }: TopbarProps) {
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'Gestor Executivo';

  return (
    <header className="fixed top-0 z-30 flex h-20 w-full items-center justify-between border-b border-[#E2EBE5]/70 bg-white/95 backdrop-blur-md px-6 shadow-sm sm:pl-72 transition-all">

      <div className="flex items-center gap-4">
        {/* Botão Mobile */}
        <button className="rounded-xl p-2 text-[#526E62] hover:bg-[#F4F7F5] sm:hidden transition-colors">
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar no Estilo Pílula Arredondada Coinest */}
        <div className="hidden md:block w-96">
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-[#88A395] group-focus-within:text-[#16382C] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full rounded-full border border-[#E2EBE5] bg-[#F4F7F5] py-2.5 pl-11 pr-4 text-xs text-[#15241E] placeholder-[#88A395] focus:border-[#16382C] focus:bg-white focus:ring-4 focus:ring-[#16382C]/5 transition-all outline-none"
              placeholder="Pesquisar contas, cartões, contratos, propostas..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Botão Canal Seguro Criptografado B2B */}
        {onToggleChat && (
          <button
            onClick={onToggleChat}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
              isChatOpen
                ? 'bg-[#16382C] text-white border-[#16382C] shadow-sm'
                : 'bg-[#E8F8EE] text-[#16382C] border-[#C8F2D6] hover:bg-[#C8F2D6]'
            }`}
            title="Abrir Canal B2B Criptografado"
          >
            <MessageSquareLock className="h-4 w-4 text-[#16382C]" />
            <span className="hidden md:inline font-sans">Canal Seguro</span>
          </button>
        )}

        {/* Notificações no Estilo Coinest Icon Pill */}
        <button className="relative rounded-full p-2.5 text-[#526E62] hover:bg-[#F4F7F5] border border-[#E2EBE5] hover:text-[#16382C] transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EF4444] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EF4444]"></span>
          </span>
        </button>

        {/* User Profile Badge no Padrão Coinest Executivo */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#E2EBE5] cursor-pointer group">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-[#16382C] text-[#C8F2D6] flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white group-hover:scale-105 transition-transform">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#15241E] leading-tight capitalize">{userName}</span>
            <span className="text-[10px] font-semibold text-[#526E62] leading-tight uppercase">{user?.role || 'ASSOCIADO'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
