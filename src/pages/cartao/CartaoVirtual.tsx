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
  ExternalLink
} from 'lucide-react';
import { CartaoVirtualItem } from '@/types/cartao';

export default function CartaoVirtual() {
  const [segundosRestantes, setSegundosRestantes] = useState(48);
  const [mostrarNumero, setMostrarNumero] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  const [cartaoVirtual, setCartaoVirtual] = useState<CartaoVirtualItem>({
    id: 'vcard-01',
    apelido: 'Cartão Virtual · Compras Online & Recorrência',
    numero_mascarado: '4532 •••• •••• 8819',
    cvv_dinamico: '742',
    segundos_restantes_cvv: 48,
    validade: '10/31',
    limite_temporario: 1500.00,
    uso_unico: false,
    bloqueado: false
  });

  // Contador dinâmico do CVV rotativo (padrão BaaS / Fintech)
  useEffect(() => {
    const timer = setInterval(() => {
      setSegundosRestantes(prev => {
        if (prev <= 1) {
          // Gera novo CVV dinâmico
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
      apelido: 'Cartão Temporário de Uso Único',
      numero_mascarado: `4532 •••• •••• ${novoFinal}`,
      cvv_dinamico: novoCvv,
      segundos_restantes_cvv: 60,
      validade: '11/31',
      limite_temporario: 800.00,
      uso_unico: true,
      bloqueado: false
    });
    setSegundosRestantes(60);
    alert('Novo cartão virtual tokenizado gerado com sucesso!');
  };

  const alternarBloqueio = () => {
    setCartaoVirtual(prev => ({ ...prev, bloqueado: !prev.bloqueado }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Cartão Virtual & CVV Dinâmico Rotativo
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Tokenização PCI-DSS
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gere cartões virtuais temporários para compras seguras na internet com código de segurança que se renova a cada 60 segundos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={gerarNovoCartao}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Criar Cartão Temporário
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Renderização do Cartão Virtual com Efeito Holográfico */}
        <div className="space-y-6">
          <div className="relative aspect-[1.586/1] w-full rounded-3xl p-8 bg-gradient-to-tr from-[#1E0B36] via-[#3B1569] to-[#120422] text-white shadow-2xl overflow-hidden border border-purple-500/30 flex flex-col justify-between group">
            {/* Efeitos de Luz */}
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-black text-white text-sm shadow-md">
                  D
                </div>
                <div>
                  <span className="font-extrabold tracking-widest text-sm text-purple-100 block">DIAMOND VIRTUAL</span>
                  <span className="text-[10px] text-purple-300 font-mono">BaaS Instant Token</span>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                cartaoVirtual.bloqueado ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {cartaoVirtual.bloqueado ? 'BLOQUEADO' : 'ATIVO'}
              </span>
            </div>

            {/* Número e Dados Centrais */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xl sm:text-2xl tracking-widest text-white drop-shadow">
                  {mostrarNumero ? '4532 9920 1845 8819' : cartaoVirtual.numero_mascarado}
                </p>
                <button
                  onClick={() => setMostrarNumero(!mostrarNumero)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 transition-colors"
                  title={mostrarNumero ? 'Ocultar' : 'Exibir número completo'}
                >
                  {mostrarNumero ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-purple-300 block">Validade</span>
                  <span className="font-mono font-bold text-white text-sm">{cartaoVirtual.validade}</span>
                </div>

                {/* CVV Rotativo com Timer */}
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-purple-300 block flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3" /> CVV Dinâmico ({segundosRestantes}s)
                  </span>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-mono font-black text-amber-300 text-lg tracking-widest">
                      {cartaoVirtual.bloqueado ? '•••' : cartaoVirtual.cvv_dinamico}
                    </span>
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé do Cartão */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-purple-500/20 text-xs">
              <span className="font-semibold text-purple-200 uppercase tracking-wide">
                MARCOS V ALMEIDA
              </span>
              <span className="font-mono text-[10px] text-purple-300">
                {cartaoVirtual.uso_unico ? 'USO ÚNICO' : 'RECORRENTE'}
              </span>
            </div>
          </div>

          {/* Barra de Progresso do CVV Rotativo */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Renovação do Código de Segurança (CVV):</span>
              <span className="font-mono font-bold text-purple-700">{segundosRestantes} segundos</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(segundosRestantes / 60) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Detalhes, Controles e Botões Rápidos de Cópia */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-5">
            <h3 className="font-bold text-slate-900 text-base">Copiar Dados para Compras</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Número do Cartão</span>
                  <span className="font-mono text-sm font-bold text-slate-900">4532 9920 1845 8819</span>
                </div>
                <button
                  onClick={() => copiarTexto('4532992018458819', 'numero')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  {copiado === 'numero' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiado === 'numero' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Validade</span>
                    <span className="font-mono text-sm font-bold text-slate-900">{cartaoVirtual.validade}</span>
                  </div>
                  <button
                    onClick={() => copiarTexto(cartaoVirtual.validade, 'validade')}
                    className="p-2 rounded-lg text-xs bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    {copiado === 'validade' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-purple-50/60 rounded-xl border border-purple-200">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">CVV Atual</span>
                    <span className="font-mono text-sm font-black text-purple-900">{cartaoVirtual.cvv_dinamico}</span>
                  </div>
                  <button
                    onClick={() => copiarTexto(cartaoVirtual.cvv_dinamico, 'cvv')}
                    className="p-2 rounded-lg text-xs bg-white border border-purple-200 hover:bg-purple-100 text-purple-700 transition-colors"
                  >
                    {copiado === 'cvv' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Bloqueio Temporário</p>
                  <p className="text-xs text-slate-400">Pause compras online instantaneamente sem cancelar o cartão físico</p>
                </div>
                <button
                  onClick={alternarBloqueio}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    cartaoVirtual.bloqueado
                      ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {cartaoVirtual.bloqueado ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  O CVV rotativo impede cobranças indevidas caso seus dados sejam vazados em e-commerces não seguros.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
