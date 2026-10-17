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
  Flame,
  Wifi,
  ChevronRight
} from 'lucide-react';
import { CartaoVirtualItem } from '@/types/cartao';

export default function CartaoVirtual() {
  const [segundosRestantes, setSegundosRestantes] = useState(52);
  const [mostrarNumero, setMostrarNumero] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  const [cartaoVirtual, setCartaoVirtual] = useState<CartaoVirtualItem>({
    id: 'vcard-01',
    apelido: 'Santander Diamond Virtual · E-commerce & Recorrência',
    numero_mascarado: '5582 •••• •••• 8472',
    cvv_dinamico: '821',
    segundos_restantes_cvv: 52,
    validade: '11/31',
    limite_temporario: 15000.00,
    uso_unico: false,
    bloqueado: false
  });

  // Contador dinâmico do CVV rotativo (padrão Santander Way / BaaS Tokenization)
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
      apelido: 'Santander Diamond Virtual · Uso Único Temporário',
      numero_mascarado: `5582 •••• •••• ${novoFinal}`,
      cvv_dinamico: novoCvv,
      segundos_restantes_cvv: 60,
      validade: '12/31',
      limite_temporario: 3500.00,
      uso_unico: true,
      bloqueado: false
    });
    setSegundosRestantes(60);
    alert('Novo cartão virtual tokenizado Santander gerado com sucesso!');
  };

  const alternarBloqueio = () => {
    setCartaoVirtual(prev => ({ ...prev, bloqueado: !prev.bloqueado }));
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Segurança Digital Santander Way
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Cartão Virtual & CVV Dinâmico Rotativo
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tokenização PCI-DSS com código de segurança temporário renovado automaticamente a cada 60 segundos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={gerarNovoCartao}
            className="px-4 py-2.5 rounded-xl bg-[#EC0000] hover:bg-[#CC0000] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-600/20 transition-all"
          >
            <PlusCircle className="h-4 w-4" /> Gerar Cartão Uso Único
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Renderização do Cartão Santander Unique Black Virtual */}
        <div className="space-y-6">
          <div className="relative aspect-[1.586/1] w-full rounded-3xl p-7 sm:p-8 bg-gradient-to-br from-[#1A1A1A] via-[#111111] to-[#0A0A0A] text-white shadow-2xl overflow-hidden border border-neutral-800 flex flex-col justify-between group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EC0000] flex items-center justify-center shadow-md">
                  <Flame className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <span className="font-black tracking-tight text-white block text-sm leading-none">
                    Santander
                  </span>
                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest block mt-0.5">
                    DIAMOND VIRTUAL
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-white/80 rotate-90" />
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  cartaoVirtual.bloqueado ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {cartaoVirtual.bloqueado ? 'BLOQUEADO' : 'ATIVO'}
                </span>
              </div>
            </div>

            {/* Número e Dados Centrais */}
            <div className="relative z-10 space-y-2 my-auto">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xl sm:text-2xl tracking-widest text-white drop-shadow font-bold">
                  {mostrarNumero ? '5582 9920 1845 8472' : cartaoVirtual.numero_mascarado}
                </p>
                <button
                  onClick={() => setMostrarNumero(!mostrarNumero)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={mostrarNumero ? 'Ocultar' : 'Exibir número completo'}
                >
                  {mostrarNumero ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Validade</span>
                  <span className="font-mono font-bold text-white text-sm">{cartaoVirtual.validade}</span>
                </div>

                {/* CVV Rotativo com Timer */}
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-red-300 block flex items-center gap-1 justify-end font-bold">
                    <Clock className="h-3 w-3 text-[#EC0000]" /> CVV Dinâmico ({segundosRestantes}s)
                  </span>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-mono font-black text-amber-300 text-lg tracking-widest">
                      {cartaoVirtual.bloqueado ? '•••' : cartaoVirtual.cvv_dinamico}
                    </span>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé do Cartão */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wide">
                FABIANO ASAPH C SILVA
              </span>
              <span className="font-mono text-[10px] text-red-400 font-bold uppercase">
                {cartaoVirtual.uso_unico ? 'USO ÚNICO' : 'RECORRENTE REPUTADO'}
              </span>
            </div>
          </div>

          {/* Barra de Progresso do CVV Rotativo */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold">Renovação do Código de Segurança (CVV):</span>
              <span className="font-mono font-black text-[#EC0000]">{segundosRestantes} segundos</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#EC0000] h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(segundosRestantes / 60) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Detalhes, Controles e Botões Rápidos de Cópia */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Copiar Dados para Compras Online</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Pronto para Uso
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-[#F4F6F9] rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Número do Cartão Virtual</span>
                  <span className="font-mono text-sm font-black text-slate-900">5582 9920 1845 8472</span>
                </div>
                <button
                  onClick={() => copiarTexto('5582992018458472', 'numero')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiado === 'numero' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiado === 'numero' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 bg-[#F4F6F9] rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Validade</span>
                    <span className="font-mono text-sm font-black text-slate-900">{cartaoVirtual.validade}</span>
                  </div>
                  <button
                    onClick={() => copiarTexto(cartaoVirtual.validade, 'validade')}
                    className="p-2 rounded-xl text-xs bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                  >
                    {copiado === 'validade' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-red-50/60 rounded-2xl border border-red-200">
                  <div>
                    <span className="text-[10px] font-bold text-[#EC0000] uppercase tracking-wider block">CVV Atual</span>
                    <span className="font-mono text-sm font-black text-slate-900">{cartaoVirtual.cvv_dinamico}</span>
                  </div>
                  <button
                    onClick={() => copiarTexto(cartaoVirtual.cvv_dinamico, 'cvv')}
                    className="p-2 rounded-xl text-xs bg-white border border-red-200 hover:bg-red-50 text-[#EC0000] transition-colors shadow-sm"
                  >
                    {copiado === 'cvv' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Bloqueio Temporário Santander</p>
                  <p className="text-xs text-slate-400">Pause compras online instantaneamente sem cancelar seu cartão físico</p>
                </div>
                <button
                  onClick={alternarBloqueio}
                  className={`p-3 rounded-2xl border transition-all ${
                    cartaoVirtual.bloqueado
                      ? 'bg-red-50 text-[#EC0000] border-red-200 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {cartaoVirtual.bloqueado ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                </button>
              </div>

              <div className="p-4 bg-[#F4F6F9] rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
                <ShieldCheck className="h-5 w-5 text-[#EC0000] shrink-0 mt-0.5" />
                <span>
                  Proteção com tecnologia <strong>Mastercard Identity Check</strong> e algoritmo antifraude com autorização inteligente pelo App Santander Way.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
