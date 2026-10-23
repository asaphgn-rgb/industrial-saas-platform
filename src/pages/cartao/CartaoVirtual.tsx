import { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  PlusCircle,
  Barcode,
  QrCode,
  ShieldCheck,
  Lock,
  Unlock
} from 'lucide-react';
import { CartaoVirtualItem } from '@/types/cartao';

export default function CartaoVirtual() {
  const [segundosRestantes, setSegundosRestantes] = useState(52);
  const [copiado, setCopiado] = useState<string | null>(null);

  const [cartaoVirtual, setCartaoVirtual] = useState<CartaoVirtualItem>({
    id: 'vcard-01',
    apelido: 'DYAMOND CARD Gold Premium · E-commerce & Recorrência',
    numero_mascarado: '5284 7312 3456 7890',
    cvv_dinamico: '945',
    segundos_restantes_cvv: 52,
    validade: '12/30',
    limite_temporario: 15000.00,
    uso_unico: false,
    bloqueado: false
  });

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
    setCartaoVirtual({
      id: `vcard-${Date.now()}`,
      apelido: 'DYAMOND CARD Gold Premium · Uso Único Temporário',
      numero_mascarado: '5284 7312 3456 7890',
      cvv_dinamico: '945',
      segundos_restantes_cvv: 60,
      validade: '12/30',
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
        {/* Renderização do Cartão DYAMOND CARD Gold Premium Oficial — LIMPO, SEM SOBREPOSIÇÕES */}
        <div className="space-y-6">
          <div className="relative aspect-[1.586/1] w-full rounded-3xl text-white shadow-2xl overflow-hidden border border-[#22396F] bg-[#010736] group">
            {/* Arte Oficial Exata do Cartão (Já contém nativamente o logotipo, chip, nfc, número, validade, CVV e titular) */}
            <img
              src="/assets/dyamond-card-gold-premium.png"
              alt="DYAMOND CARD GOLD"
              className="w-full h-full object-cover object-center pointer-events-none select-none"
            />
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
                  <span className="font-mono text-sm font-black text-[#010736]">5284 7312 3456 7890</span>
                </div>
                <button
                  onClick={() => copiarTexto('5284731234567890', 'numero')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-[#CBD5E1] text-[#010736] hover:bg-[#F8FAFD] flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiado === 'numero' ? <Check className="h-3.5 w-3.5 text-[#047857]" /> : <Copy className="h-3.5 w-3.5 text-[#010736]" />}
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
                    {copiado === 'validade' ? <Check className="h-3.5 w-3.5 text-[#047857]" /> : <Copy className="h-3.5 w-3.5 text-[#010736]" />}
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
                    {copiado === 'cvv' ? <Check className="h-3.5 w-3.5 text-[#047857]" /> : <Copy className="h-3.5 w-3.5 text-[#010736]" />}
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
