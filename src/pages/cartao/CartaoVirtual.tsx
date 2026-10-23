import { useState, useEffect } from 'react';
import {
  CreditCard,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Unlock,
  ShieldCheck,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
  AlertCircle,
  PlusCircle,
  ExternalLink,
  Wifi,
  ChevronRight,
  Barcode,
  QrCode
} from 'lucide-react';
import { CartaoVirtualItem } from '@/types/cartao';

export default function CartaoVirtual() {
  const [segundosRestantes, setSegundosRestantes] = useState(52);
  const [mostrarNumero, setMostrarNumero] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  const [cartaoVirtual, setCartaoVirtual] = useState<CartaoVirtualItem>({
    id: 'vcard-01',
    apelido: 'DYAMOND CARD Virtual · E-commerce & Recorrência',
    numero_mascarado: '5582 •••• •••• 3019',
    cvv_dinamico: '945',
    segundos_restantes_cvv: 52,
    validade: '11/31',
    limite_temporario: 15000.00,
    uso_unico: false,
    bloqueado: false
  });

  // Contador dinâmico do CVV rotativo (padrão BaaS Tokenization)
  useEffect(() => {
    const timer = setInterval(() => {
      setSegundosRestantes(prev => {
        if (prev <= 1) {
          const novoCvv = Math.floor(100 + Math.random() * 900).toString();
          setCartaoVirtual(c => ({ ...c, cvv_dinamico: novoCvv }));
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copiarTexto = (texto: string, campo: string) => {
    navigator.clipboard?.writeText(texto);
    setCopiado(campo);
    setTimeout(() => setCopiado(null), 2000);
  };

  const gerarNovoCartao = () => {
    const novoFinal = Math.floor(1000 + Math.random() * 9000).toString();
    const novoCvv = Math.floor(100 + Math.random() * 900).toString();
    setCartaoVirtual({
      id: `vcard-${Date.now()}`,
      apelido: 'DYAMOND CARD Virtual · Uso Único Temporário',
      numero_mascarado: `5582 •••• •••• ${novoFinal}`,
      cvv_dinamico: novoCvv,
      segundos_restantes_cvv: 60,
      validade: '12/31',
      limite_temporario: 3500.00,
      uso_unico: true,
      bloqueado: false
    });
    setSegundosRestantes(60);
  };

  const alternarBloqueio = () => {
    setCartaoVirtual(prev => ({ ...prev, bloqueado: !prev.bloqueado }));
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo DY INVEST */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#010736] text-[#FCF1D0] border border-[#22396F]">
              BaaS Oficial DY INVEST
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#010736] mt-1">
            Cartão Virtual & CVV Dinâmico Rotativo
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Tokenização PCI-DSS com código de segurança temporário renovado automaticamente a cada 60 segundos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={gerarNovoCartao}
            className="px-4 py-2.5 rounded-xl bg-[#010736] hover:bg-[#0D1C42] text-[#FCF1D0] font-bold text-xs flex items-center gap-2 shadow-md border border-[#22396F] transition-all"
          >
            <PlusCircle className="h-4 w-4 text-[#FCF1D0]" /> Gerar Cartão Uso Único
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Renderização do Cartão DYAMOND CARD Virtual */}
        <div className="space-y-6">
          <div className="relative aspect-[1.586/1] w-full rounded-3xl p-7 sm:p-8 bg-gradient-to-br from-[#010736] via-[#0D1C42] to-[#010736] text-white shadow-2xl overflow-hidden border border-[#22396F] flex flex-col justify-between group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#22396F]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-[#FCF1D0]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(125deg,transparent_0_46%,#FCF1D0_46%_48%,transparent_48%_100%)] pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 max-w-[170px] flex items-center">
                  <img
                    src="/assets/dyamond-card-logo.png"
                    alt="DYAMOND CARD"
                    className="h-9 w-auto object-contain rounded"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="border-l border-white/20 pl-2.5 hidden sm:block">
                  <span className="block text-[8.5px] font-black uppercase tracking-[0.22em] text-[#FCF1D0]">
                    DY INVEST
                  </span>
                  <p className="text-[9.5px] font-semibold text-white/70">Bandeira Oficial</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-[#FCF1D0] text-[#010736] shadow-sm">
                  DIGITAL ONLY
                </span>
                <Wifi className="size-5 rotate-90 text-[#FCF1D0]" />
              </div>
            </div>

            {/* Número e Dados Centrais */}
            <div className="relative z-10 space-y-2 my-auto">
              <div className="flex items-center justify-between">
                <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-[#FCF1D0] via-[#E2D4A8] to-[#D4AF37] border border-[#FCF1D0] shadow-inner flex items-center justify-center opacity-95">
                  <div className="w-8 h-5 border border-[#8C6D23]/50 rounded grid grid-cols-2 gap-0.5 p-0.5" />
                </div>
                <button
                  onClick={() => setMostrarNumero(!mostrarNumero)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#FCF1D0] hover:text-white transition-colors"
                >
                  {mostrarNumero ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  <span>{mostrarNumero ? "Ocultar" : "Exibir dados"}</span>
                </button>
              </div>

              <p className="font-mono text-xl sm:text-2xl tracking-[0.18em] text-[#FCF1D0] drop-shadow font-bold">
                {mostrarNumero ? '5582 8841 9412 3019' : cartaoVirtual.numero_mascarado}
              </p>
            </div>

            {/* Rodapé do Cartão */}
            <div className="relative z-10 pt-3 border-t border-white/15 flex items-end justify-between text-xs">
              <div className="min-w-0 pr-2">
                <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Titular</p>
                <p className="truncate font-bold uppercase tracking-wide text-white text-xs">FABIANO ASAPH C SILVA</p>
              </div>

              <div className="px-2">
                <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Validade</p>
                <p className="font-mono font-bold text-white text-xs">{cartaoVirtual.validade}</p>
              </div>

              <div className="text-right">
                <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold">CVV Dinâmico</p>
                <p className="font-mono font-black text-[#FCF1D0] text-xs">
                  {cartaoVirtual.bloqueado ? '•••' : cartaoVirtual.cvv_dinamico} <span className="text-[9px] text-white/60 font-sans font-normal">({segundosRestantes}s)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Barra de Progresso do CVV Rotativo */}
          <div className="bg-white p-4 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569] font-bold">Renovação do Código de Segurança (CVV):</span>
              <span className="font-mono font-black text-[#010736]">{segundosRestantes} segundos</span>
            </div>
            <div className="w-full bg-[#EEF2F6] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#22396F] h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(segundosRestantes / 60) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Detalhes, Controles e Botões Rápidos de Cópia */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-black text-[#010736] text-base">Copiar Dados para Compras Online</h3>
              <span className="text-[10px] font-bold text-[#047857] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                Pronto para Uso
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Número do Cartão Virtual</span>
                  <span className="font-mono text-sm font-black text-[#010736]">5582 8841 9412 3019</span>
                </div>
                <button
                  onClick={() => copiarTexto('5582884194123019', 'numero')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-[#CBD5E1] text-[#010736] hover:bg-[#F8FAFD] flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiado === 'numero' ? <Check className="h-3.5 w-3.5 text-[#047857]" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiado === 'numero' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Validade</span>
                    <span className="font-mono text-sm font-black text-[#010736]">{cartaoVirtual.validade}</span>
                  </div>
                  <button
                    onClick={() => copiarTexto(cartaoVirtual.validade, 'validade')}
                    className="p-2 rounded-xl text-xs bg-white border border-[#CBD5E1] hover:bg-[#F8FAFD] text-[#010736] transition-colors shadow-sm"
                  >
                    {copiado === 'validade' ? <Check className="h-3.5 w-3.5 text-[#047857]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#FCF1D0]/40 rounded-2xl border border-[#E2D4A8]">
                  <div>
                    <span className="text-[10px] font-bold text-[#010736] uppercase tracking-wider block">CVV Atual</span>
                    <span className="font-mono text-sm font-black text-[#010736]">{cartaoVirtual.cvv_dinamico}</span>
                  </div>
                  <button
                    onClick={() => copiarTexto(cartaoVirtual.cvv_dinamico, 'cvv')}
                    className="p-2 rounded-xl text-xs bg-white border border-[#CBD5E1] hover:bg-[#F8FAFD] text-[#010736] transition-colors shadow-sm"
                  >
                    {copiado === 'cvv' ? <Check className="h-3.5 w-3.5 text-[#047857]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Ações de Segurança */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={alternarBloqueio}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                  cartaoVirtual.bloqueado
                    ? 'bg-[#047857] text-white hover:bg-[#065F46]'
                    : 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                }`}
              >
                {cartaoVirtual.bloqueado ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {cartaoVirtual.bloqueado ? 'Desbloquear Cartão' : 'Bloquear Temporariamente'}
              </button>

              <span className="text-[10px] text-[#64748B] flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-[#047857]" />
                Protegido por PCI-DSS BaaS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
