import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  CreditCard,
  Building2,
  Users,
  FileText,
  Sliders,
  Wallet,
  ShieldCheck,
  TrendingUp,
  Store,
  DollarSign,
  FileSpreadsheet,
  X,
  ArrowRight,
  Sparkles,
  Command,
  BookOpen
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: any;
  path: string;
  keywords: string;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    // Painéis Executivos
    { id: '1', title: 'Visão Geral Executiva (Presidência)', category: 'Painéis', icon: LayoutDashboard, path: '/dashboard', keywords: 'dashboard home painel inicio metricas kpis' },
    { id: '2', title: 'Central do Cartão Diamond BaaS', category: 'Fintech & BaaS', icon: CreditCard, path: '/cartao', keywords: 'cartao faturas limites saldo mdr lojistas' },
    { id: '3', title: 'Painel Regional da Federação', category: 'Painéis', icon: Building2, path: '/federacao/dashboard', keywords: 'federacao estadual associacoes' },
    { id: '4', title: 'Painel da Associação Local', category: 'Painéis', icon: Users, path: '/associacao/dashboard', keywords: 'associacao cooperativa associados' },

    // Core Habitacional
    { id: '5', title: 'Simulador Habitacional (SAC & PRICE)', category: 'Habitacional', icon: Sliders, path: '/admin/simulador-santander', keywords: 'simulador credito imovel financiamento cet fgts' },
    { id: '6', title: 'Espelho de Lotes & Mapeamento de Gleba', category: 'Habitacional', icon: Building2, path: '/admin/espelho-vendas', keywords: 'lotes quadras espelho vendas unidades estoque' },
    { id: '7', title: 'Fila Social & Motor de Scoring', category: 'Habitacional', icon: Users, path: '/admin/fila-social', keywords: 'fila social scoring pontuacao convocacao' },
    { id: '8', title: 'Contratos Digitais (MP 2.200-2)', category: 'Habitacional', icon: FileText, path: '/admin/contratos', keywords: 'contratos termos assinatura hash sha256' },
    { id: '9', title: 'Pipeline Comercial & CRM', category: 'Habitacional', icon: TrendingUp, path: '/admin/crm', keywords: 'crm pipeline propostas funil vendas' },

    // Core Financeiro & Contábil
    { id: '10', title: 'Livro-Razão Contábil (Partidas Dobradas)', category: 'Controladoria', icon: BookOpen, path: '/admin/livro-razao', keywords: 'livro razao contabil double entry cosif ifrs debito credito merkle' },
    { id: '11', title: 'Fechamento Contábil & DRE Mensal', category: 'Controladoria', icon: FileSpreadsheet, path: '/admin/fechamento-contabil', keywords: 'fechamento dre resultado exercicio balancete superavit' },
    { id: '12', title: 'Participação & Repasses (Split de Receitas)', category: 'Controladoria', icon: TrendingUp, path: '/federacao/participacao-resultados', keywords: 'repasses bonificacao split receitas federacao associacao' },
    { id: '13', title: 'Empresas Co-Branded White Label', category: 'Fintech & BaaS', icon: Store, path: '/admin/parcerias-cobranded', keywords: 'whitelabel co-branded empresas parceiros bandeira' },

    // Jornada do Associado
    { id: '14', title: 'Adesão Cadastral & Cashback R$ 50', category: 'Associado', icon: Sparkles, path: '/associado/adesao-cashback', keywords: 'adesao 50 taxa pix cashback laudo cadastro' },
    { id: '15', title: 'Radar de Imóveis Desejados', category: 'Associado', icon: Building2, path: '/associado/radar-imoveis', keywords: 'radar imoveis desejados matching busca oportunidades' },
    { id: '16', title: 'Meu Cartão Digital Diamond Pass', category: 'Associado', icon: Wallet, path: '/associado/cartao-digital', keywords: 'cartao digital pass qrcode barcode conveniados descontos' },
    { id: '17', title: 'Auditoria de Acessos & Conformidade LGPD', category: 'Governança', icon: ShieldCheck, path: '/admin/auditoria', keywords: 'auditoria logs seguranca rls lgpd rastreabilidade' },
  ];

  const filtered = commands.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase()) ||
    c.keywords.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          navigate(filtered[selectedIndex].path);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E2EBE5] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Barra de Pesquisa Superior */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2EBE5] bg-[#F4F7F5]">
          <Search className="w-5 h-5 text-[#16382C]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Digite para buscar qualquer recurso, lote, contrato ou tela (ou use as setas)..."
            className="flex-1 bg-transparent text-sm font-semibold text-[#15241E] placeholder-[#88A395] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#88A395] hover:text-[#15241E] font-bold p-1 rounded-lg"
            >
              Limpar
            </button>
          )}
          <span className="px-2 py-0.5 rounded-lg bg-white border border-[#E2EBE5] text-[10px] font-bold text-[#526E62]">
            ESC para fechar
          </span>
        </div>

        {/* Lista de Resultados Agrupados */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#88A395] space-y-1">
              <Command className="w-8 h-8 text-[#88A395] mx-auto opacity-50 mb-2" />
              <p className="font-bold text-[#15241E]">Nenhum recurso encontrado para "{query}"</p>
              <p>Tente termos como "simulador", "lotes", "cashback", "razao" ou "dre".</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#16382C] text-white shadow-sm'
                      : 'text-[#15241E] hover:bg-[#F4F7F5]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/10 text-[#C8F2D6]' : 'bg-[#E8F8EE] text-[#16382C]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-white' : 'text-[#15241E]'}`}>
                        {item.title}
                      </p>
                      <span className={`text-[10px] ${isSelected ? 'text-[#C8F2D6]' : 'text-[#88A395]'}`}>
                        {item.category} · {item.path}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-[#C8F2D6] translate-x-1' : 'text-transparent'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé com Dicas de Atalhos */}
        <div className="px-5 py-3 border-t border-[#E2EBE5] bg-[#F4F7F5] flex items-center justify-between text-[11px] text-[#526E62]">
          <div className="flex items-center gap-3">
            <span><strong className="text-[#16382C]">↑↓</strong> Navegar</span>
            <span><strong className="text-[#16382C]">ENTER</strong> Acessar</span>
            <span><strong className="text-[#16382C]">ESC</strong> Sair</span>
          </div>
          <span className="font-bold text-[#16382C]">DIAMOND COMMAND PALETTE</span>
        </div>
      </div>
    </div>
  );
}
