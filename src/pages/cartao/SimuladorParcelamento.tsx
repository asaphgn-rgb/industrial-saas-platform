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
  Info
} from 'lucide-react';
import { OpcaoParcelamentoFatura } from '@/types/cartao';

export default function SimuladorParcelamento() {
  const valorFaturaOriginal = 3500.00;
  const [valorEntrada, setValorEntrada] = useState<number>(500.00);
  const [parcelasSelecionadas, setParcelasSelecionadas] = useState<number>(6);
  const [contratado, setContratado] = useState(false);

  // Parâmetros regulatórios Bacen Resolução CMN 4.549/17
  const taxaMensal = 0.0249; // 2.49% a.m.
  const taxaIof = 0.0038; // 0.38% IOF fixo + diário

  const valorFinanciado = Math.max(0, valorFaturaOriginal - valorEntrada);

  // Cálculo das opções de parcelamento (Tabela Price simplificada)
  const opcoesParcelamento: OpcaoParcelamentoFatura[] = useMemo(() => {
    const prazos = [2, 3, 6, 8, 10, 12, 18, 24];
    return prazos.map(n => {
      // Fórmula Price: Pmt = PV * [i * (1+i)^n] / [(1+i)^n - 1]
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
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft max-w-2xl mx-auto text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Parcelamento Contratado com Sucesso!</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Sua fatura de R$ {valorFaturaOriginal.toFixed(2).replace('.', ',')} foi refinanciada em <strong>{planoEscolhido.parcelas}x de R$ {planoEscolhido.valor_parcela.toFixed(2).replace('.', ',')}</strong> com entrada de R$ {valorEntrada.toFixed(2).replace('.', ',')}.
        </p>

        <div className="p-4 bg-slate-50 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto border border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-400">CET Anual:</span>
            <span className="font-bold text-slate-800">{planoEscolhido.cet_anual_pct}% a.a.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Primeiro Vencimento:</span>
            <span className="font-bold text-slate-800">10/11/2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Canal de Envio do Boleto:</span>
            <span className="font-bold text-slate-800">E-mail e WhatsApp do Titular</span>
          </div>
        </div>

        <button
          onClick={() => setContratado(false)}
          className="mt-4 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-sm"
        >
          Voltar ao Simulador
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Simulador de Parcelamento de Fatura (Bacen Res. 4.549/17)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Transparência Regulatória
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Simulação oficial com cálculo automático de CET (Custo Efetivo Total), IOF e parcelamento com taxas reduzidas.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Painel de Configuração da Entrada */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-600" />
            Parâmetros da Fatura
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs text-slate-400 block font-semibold uppercase">Fatura Atual (Competência 10/2026)</span>
            <p className="text-2xl font-black text-slate-900">
              R$ {valorFaturaOriginal.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-[11px] text-slate-500">Vencimento em 10/11/2026</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-700">Valor da Entrada:</span>
              <span className="font-bold text-purple-600">R$ {valorEntrada.toFixed(2).replace('.', ',')}</span>
            </div>
            <input
              type="range"
              min={350} // Mínimo 10%
              max={2500}
              step={50}
              value={valorEntrada}
              onChange={e => setValorEntrada(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Mínimo: R$ 350,00</span>
              <span>Máximo: R$ 2.500,00</span>
            </div>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-purple-900">
              <span>Saldo a Parcelar:</span>
              <strong className="font-bold">R$ {valorFinanciado.toFixed(2).replace('.', ',')}</strong>
            </div>
            <div className="flex justify-between text-purple-700">
              <span>Taxa de Juros Especial:</span>
              <span>2.49% a.m. (fixa)</span>
            </div>
            <div className="flex justify-between text-purple-700">
              <span>IOF Financiado:</span>
              <span>R$ {planoEscolhido.iof.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Ao contratar o parcelamento, o limite do seu cartão é restabelecido proporcionalmente à medida que cada cota for quitada.
            </span>
          </div>
        </div>

        {/* Grade de Prazos e Condições Disponíveis */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Selecione o Plano de Parcelamento</h3>
              <p className="text-xs text-slate-400 mt-0.5">Clique em uma opção para ver o detalhamento do CET</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {opcoesParcelamento.map(opcao => {
              const selecionada = opcao.parcelas === parcelasSelecionadas;
              return (
                <div
                  key={opcao.parcelas}
                  onClick={() => setParcelasSelecionadas(opcao.parcelas)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selecionada
                      ? 'border-purple-600 bg-purple-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-500 uppercase">{opcao.parcelas}x Parcelas</span>
                  <div className="my-2">
                    <p className="text-lg font-black text-slate-900">
                      R$ {opcao.valor_parcela.toFixed(2).replace('.', ',')}
                    </p>
                    <span className="text-[10px] text-slate-400 block">/mês</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    Total: R$ {opcao.valor_total.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumo da Opção Escolhida e Botão de Contratação */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">Opção Selecionada</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  Entrada de R$ {valorEntrada.toFixed(2).replace('.', ',')} + {planoEscolhido.parcelas}x de R$ {planoEscolhido.valor_parcela.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Custo Efetivo Total (CET): <strong>{planoEscolhido.cet_mensal_pct}% a.m. / {planoEscolhido.cet_anual_pct}% a.a.</strong>
                </p>
              </div>

              <button
                onClick={handleContratar}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
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
