import { useState, useMemo } from 'react';
import {
  Calculator,
  Percent,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Info,
  Flame,
  ChevronRight
} from 'lucide-react';
import { OpcaoParcelamentoFatura } from '@/types/cartao';

export default function SimuladorParcelamento() {
  const valorFaturaOriginal = 3500.00;
  const [valorEntrada, setValorEntrada] = useState<number>(500.00);
  const [parcelasSelecionadas, setParcelasSelecionadas] = useState<number>(6);
  const [contratado, setContratado] = useState(false);

  // Parâmetros regulatórios Bacen Resolução CMN 4.549/17 - Tabela Santander Way
  const taxaMensal = 0.0249; // 2.49% a.m.
  const taxaIof = 0.0038; // 0.38% IOF fixo + diário

  const valorFinanciado = Math.max(0, valorFaturaOriginal - valorEntrada);

  // Cálculo das opções de parcelamento (Tabela Price Santander)
  const opcoesParcelamento: OpcaoParcelamentoFatura[] = useMemo(() => {
    const prazos = [2, 3, 6, 8, 10, 12, 18, 24];
    return prazos.map(n => {
      const i = taxaMensal;
      const fator = (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      const valorIof = valorFinanciado * taxaIof + (valorFinanciado * 0.000082 * 30 * n);
      const montanteComIof = valorFinanciado + valorIof;
      const valorParcela = montanteComIof * fator;
      const valorTotal = valorParcela * n;
      const cetMensal = 2.85;
      const cetAnual = 39.80;

      return {
        parcelas: n,
        valor_parcela: Number(valorParcela.toFixed(2)),
        valor_total: Number(valorTotal.toFixed(2)),
        taxa_mensal_pct: 2.49,
        cet_mensal_pct: cetMensal,
        cet_anual_pct: cetAnual,
        iof: Number(valorIof.toFixed(2))
      };
    });
  }, [valorFinanciado]);

  const planoEscolhido = opcoesParcelamento.find(o => o.parcelas === parcelasSelecionadas) || opcoesParcelamento[2];

  const handleContratar = () => {
    setContratado(true);
  };

  if (contratado) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft max-w-2xl mx-auto text-center space-y-5 animate-in fade-in select-none">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#EC0000] border border-red-100 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#EC0000] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
            Contrato Homologado Bacen Res. 4.549/17
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Parcelamento de Fatura Concluído</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Sua fatura de R$ {valorFaturaOriginal.toFixed(2).replace('.', ',')} foi refinanciada em <strong>{planoEscolhido.parcelas}x de R$ {planoEscolhido.valor_parcela.toFixed(2).replace('.', ',')}</strong> com entrada de R$ {valorEntrada.toFixed(2).replace('.', ',')}.
          </p>
        </div>

        <div className="p-4 bg-[#F4F6F9] rounded-2xl text-left text-xs space-y-2.5 max-w-md mx-auto border border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-500">Custo Efetivo Total (CET Anual):</span>
            <span className="font-black text-slate-900">{planoEscolhido.cet_anual_pct}% a.a.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Taxa de Juros Fixa:</span>
            <span className="font-bold text-slate-800">2.49% a.m.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Primeiro Vencimento:</span>
            <span className="font-bold text-slate-800">10/11/2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Restabelecimento de Limite:</span>
            <span className="font-bold text-emerald-600">Proporcional às parcelas pagas</span>
          </div>
        </div>

        <button
          onClick={() => setContratado(false)}
          className="px-6 py-2.5 rounded-xl bg-[#EC0000] hover:bg-[#CC0000] text-white font-bold text-xs transition-all shadow-md shadow-red-600/20"
        >
          Voltar ao Simulador
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Refinanciamento de Fatura Santander Way
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Simulador de Parcelamento de Fatura (Bacen Res. 4.549/17)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cálculo transparente com segregação de encargos, IOF financiado e Custo Efetivo Total (CET mensal e anual).
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Painel de Parâmetros de Entrada */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calculator className="h-4 w-4 text-[#EC0000]" />
            Parâmetros da Fatura
          </h3>

          <div className="p-4 bg-[#F4F6F9] rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Saldo Total da Fatura</span>
            <p className="text-2xl font-black text-slate-900">
              R$ {valorFaturaOriginal.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-[11px] text-slate-500 font-semibold">Vencimento em 10/11/2026</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Valor da Entrada:</span>
              <span className="font-black text-[#EC0000]">R$ {valorEntrada.toFixed(2).replace('.', ',')}</span>
            </div>
            <input
              type="range"
              min={350}
              max={2500}
              step={50}
              value={valorEntrada}
              onChange={e => setValorEntrada(Number(e.target.value))}
              className="w-full accent-[#EC0000] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Mínimo: R$ 350,00</span>
              <span>Máximo: R$ 2.500,00</span>
            </div>
          </div>

          <div className="p-4 bg-red-50/60 rounded-2xl border border-red-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-800">
              <span>Saldo Financiado:</span>
              <strong className="font-black text-slate-900">R$ {valorFinanciado.toFixed(2).replace('.', ',')}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxa Especial Santander:</span>
              <span className="font-bold text-[#EC0000]">2.49% a.m. (fixa)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IOF Obrigatório:</span>
              <span>R$ {planoEscolhido.iof.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5 leading-relaxed">
            <Info className="h-4 w-4 text-[#EC0000] shrink-0 mt-0.5" />
            <span>
              Ao contratar o parcelamento, o limite do seu cartão é liberado proporcionalmente ao pagamento de cada parcela.
            </span>
          </div>
        </div>

        {/* Grade de Prazos e Condições Disponíveis */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-sm">Opções de Prazos & Parcelas</h3>
              <p className="text-xs text-slate-400 mt-0.5">Selecione o plano ideal para seu orçamento mensal</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {opcoesParcelamento.map(opcao => {
              const selecionada = opcao.parcelas === parcelasSelecionadas;
              return (
                <div
                  key={opcao.parcelas}
                  onClick={() => setParcelasSelecionadas(opcao.parcelas)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selecionada
                      ? 'border-[#EC0000] bg-red-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-red-200 bg-white'
                  }`}
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase">{opcao.parcelas}x Parcelas</span>
                  <div className="my-2">
                    <p className="text-lg font-black text-slate-900">
                      R$ {opcao.valor_parcela.toFixed(2).replace('.', ',')}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold block">/mês</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                    Total: R$ {opcao.valor_total.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumo da Opção Escolhida e Botão de Contratação */}
          <div className="p-6 bg-[#F4F6F9] rounded-2xl border border-slate-200 space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black text-[#EC0000] uppercase tracking-wider block">Condição Selecionada</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  Entrada de R$ {valorEntrada.toFixed(2).replace('.', ',')} + {planoEscolhido.parcelas}x de R$ {planoEscolhido.valor_parcela.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Custo Efetivo Total (CET): <strong>{planoEscolhido.cet_mensal_pct}% a.m. / {planoEscolhido.cet_anual_pct}% a.a.</strong>
                </p>
              </div>

              <button
                onClick={handleContratar}
                className="px-6 py-3 rounded-xl bg-[#EC0000] hover:bg-[#CC0000] text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all shrink-0"
              >
                Contratar Parcelamento <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
