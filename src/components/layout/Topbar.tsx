import { useState, useEffect } from 'react';
import { Bell, Menu, Search, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CommandPalette } from './CommandPalette';

interface TopbarProps {
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export function Topbar({ onToggleChat, isChatOpen }: TopbarProps) {
  const { user } = useAuth();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 z-20 flex h-20 w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-6 sm:pl-72 transition-all">
        {/* BUSCA UNIVERSAL DYINVEST */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <button className="rounded-xl p-2 text-[#475569] hover:bg-[#F8FAFD] sm:hidden transition-colors">
            <Menu className="h-6 w-6" />
          </button>

          <div
            onClick={() => setIsCommandOpen(true)}
            className="relative w-full cursor-pointer group"
          >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] group-hover:text-[#22396F] transition-colors" />
            <div className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] py-2.5 pl-10 pr-12 text-xs text-[#94A3B8] group-hover:border-[#22396F] group-hover:bg-white transition-all flex items-center justify-between">
              <span>Buscar cooperado, proposta, contrato ou lote</span>
              <kbd className="hidden sm:inline-flex items-center rounded-md border border-[#E2E8F0] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#22396F]">
                Ctrl K
              </kbd>
            </div>
          </div>
        </div>

        {/* CONTROLES DA DIREITA: NOTIFICAÇÃO, PERFIL E STATUS ONLINE */}
        <div className="flex items-center gap-3 sm:gap-4 ml-4">
          {/* Sino com badge */}
          <button className="relative rounded-full p-2.5 text-[#475569] hover:bg-[#F8FAFD] hover:text-[#010736] transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {/* User Avatar + Dropdown */}
          <div className="flex items-center gap-2.5 cursor-pointer pl-1">
            <div className="w-8 h-8 rounded-full bg-[#010736] text-[#FCF1D0] flex items-center justify-center font-bold text-xs shadow-sm border border-[#22396F]">
              FA
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-[#010736]">Fabiano Asaph</span>
              <span className="text-[10px] text-[#475569]">Administrador Geral</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8] hidden sm:block" />
          </div>

          {/* Badge: Operação online */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
            <span>Operação online</span>
          </div>
        </div>
      </header>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
