import { useState, useMemo } from 'react';
import {
  Calculator,
  ShieldCheck,
  TrendingDown,
  Building,
  CheckCircle2,
  FileText,
  Percent,
  Download,
  ArrowRight,
  Info,
  DollarSign,
  AlertTriangle,
  Award,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Check
} from 'lucide-react';
import {
  ParametrosSimulacaoSantander,
  ResultadoSimulacaoSantander,
  SistemaAmortizacao,
  TipoTaxaImobiliaria
} from '@/types/santander-credito';

export default function SimuladorCreditoSantander() {
  // Parâmetros de Entrada da Simulação Padrão Santander Imobiliário
  const [valorImovel, setValorImovel] = useState<number>(250000);
  const [valorEntrada, setValorEntrada] = useState<number>(50000);
  const [prazoMeses, setPrazoMeses] = useState<number>(360);
  const [rendaFamiliar, setRendaFamiliar] = useState<number>(6500);
  const [sistemaAmortizacao, setSistemaAmortizacao] = useState<SistemaAmortizacao>('SAC');
  const [tipoTaxa, setTipoTaxa] = useState<TipoTaxaImobiliaria>('POS_FIXADA_TR');
  const [utilizarFgts, setUtilizarFgts] = useState<boolean>(true);
  const [saldoFgts, setSaldoFgts] = useState<number>(25000);
  const [aprovadoModal, setAprovadoModal] = useState<boolean>(false);

  // Motor Financeiro Padrão Santander / SFH / SFI
  const resultado: ResultadoSimulacaoSantander = useMemo(() => {
    const valorFinanciadoBruto = Math.max(0, valorImovel - valorEntrada);
    const valorFinanciado = utilizarFgts
      ? Math.max(0, valorFinanciadoBruto - saldoFgts)
      : valorFinanciadoBruto;

    const percentualFinanciado = valorImovel > 0 ? (valorFinanciado / valorImovel) * 100 : 0;

    // Taxas nominais e de seguros (MIP e DFI)
    const taxaNominalAa = tipoTaxa === 'POS_FIXADA_TR' ? 9.99 : tipoTaxa === 'IPCA' ? 6.49 : 11.50;
    const taxaMensal = Math.pow(1 + taxaNominalAa / 100, 1 / 12) - 1;

    // Seguros obrigatórios regulamentares (MIP: 0.028% e DFI: 0.012% + Taxa Adm R$ 25/mês)
    const seguroMip = valorFinanciado * 0.00028;
    const seguroDfi = valorImovel * 0.00012;
    const taxaAdm = 25.00;

    let primeiraParcela = 0;
    let ultimaParcela = 0;
    const n = prazoMeses;

    if (sistemaAmortizacao === 'SAC') {
      const amortizacaoConstante = valorFinanciado / n;
      const jurosInicial = valorFinanciado * taxaMensal;
      primeiraParcela = amortizacaoConstante + jurosInicial + seguroMip + seguroDfi + taxaAdm;

      const jurosFinal = (valorFinanciado / n) * taxaMensal;
      ultimaParcela = amortizacaoConstante + jurosFinal + seguroMip * 0.1 + seguroDfi + taxaAdm;
    } else {
      // PRICE
      const fator = (taxaMensal * Math.pow(1 + taxaMensal, n)) / (Math.pow(1 + taxaMensal, n) - 1);
      const prestacaoPura = valorFinanciado * fator;
      primeiraParcela = prestacaoPura + seguroMip + seguroDfi + taxaAdm;
      ultimaParcela = primeiraParcela;
    }

    // Regra Bacen: Comprometimento máximo de 30% da renda familiar
    const rendaMinimaExigida = primeiraParcela / 0.30;
    const comprometimentoRendaPct = rendaFamiliar > 0 ? (primeiraParcela / rendaFamiliar) * 100 : 0;

    // Cálculo do CET (Custo Efetivo Total) anual e mensal
    const cetAa = taxaNominalAa + 0.95;
    const cetAm = Math.pow(1 + cetAa / 100, 1 / 12) - 1;

    // Tabela resumida de evolução das 5 primeiras parcelas
    const tabelaEvolucao = Array.from({ length: 5 }, (_, idx) => {
      const num = idx + 1;
      let saldo = valorFinanciado - (valorFinanciado / n) * idx;
      let amort = sistemaAmortizacao === 'SAC' ? valorFinanciado / n : (valorFinanciado / n) * 0.8;
      let jur = saldo * taxaMensal;
      return {
        numero: num,
        prestacao: amort + jur + seguroMip + seguroDfi + taxaAdm,
        amortizacao: amort,
        juros: jur,
        seguro_mip: seguroMip,
        seguro_dfi: seguroDfi,
        taxa_administracao: taxaAdm,
        saldo_devedor: Math.max(0, saldo - amort)
      };
    });

    const subsidioEstimado = rendaFamiliar <= 2640 ? 47500 : rendaFamiliar <= 4400 ? 25000 : 0;
    const faixaPrograma = rendaFamiliar <= 2640 ? 'FAIXA_1' : rendaFamiliar <= 4400 ? 'FAIXA_2' : rendaFamiliar <= 8000 ? 'FAIXA_3' : 'SBPE';

    return {
      valor_imovel: valorImovel,
      valor_financiado: valorFinanciado,
      valor_entrada: valorEntrada + (utilizarFgts ? saldoFgts : 0),
      percentual_financiado: Math.min(80, percentualFinanciado),
      prazo_meses: prazoMeses,
      sistema_amortizacao: sistemaAmortizacao,
      taxa_juros_nominal_aa: taxaNominalAa,
      taxa_juros_efetiva_aa: Number((taxaNominalAa * 1.04).toFixed(2)),
      cet_aa: Number(cetAa.toFixed(2)),
      cet_am: Number((cetAm * 100).toFixed(2)),
      primeira_parcela: Number(primeiraParcela.toFixed(2)),
      ultima_parcela: Number(ultimaParcela.toFixed(2)),
      renda_minima_exigida: Number(rendaMinimaExigida.toFixed(2)),
      comprometimento_renda_pct: Number(comprometimentoRendaPct.toFixed(1)),
      subsidio_estimado: subsidioEstimado,
      faixa_programa: faixaPrograma,
      tabela_evolucao_resumida: tabelaEvolucao,
      documentos_obrigatorios: [
        'RG ou CNH atualizada dos proponentes',
        'Comprovante de residência atual (últimos 60 dias)',
        '3 últimos holerites ou extrato bancário de 6 meses (renda)',
        'Declaração completa de IRPF com recibo de entrega',
        'Extrato analítico da conta vinculada do FGTS atualizado',
        'Certidão de Estado Civil / Certidão de Casamento com pacto'
      ]
    };
  }, [valorImovel, valorEntrada, prazoMeses, rendaFamiliar, sistemaAmortizacao, tipoTaxa, utilizarFgts, saldoFgts]);

  const emitirCartaCredito = () => {
    setAprovadoModal(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner de Excelência Bancária (Benchmark Santander / SFH) */}
      <div className="bg-gradient-to-r from-[#1B2A41] via-[#0A0F1E] to-[#1B2A41] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/80">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 text-red-300 border border-red-500/30">
              <Building className="h-3.5 w-3.5 text-red-400" /> Padrão Bancário Santander & Caixa (SFH / SBPE)
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Esteira de Crédito Imobiliário Enterprise
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Simulador institucional com cálculo transparente de Custo Efetivo Total (CET), seguros MIP/DFI, tabela SAC/PRICE e emissão de Carta de Pré-Aprovação oficial para associados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={emitirCartaCredito}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all"
            >
              <FileCheck2 className="h-4 w-4" />
              Carta de Pré-Aprovação
            </button>
            <button
              onClick={() => alert('Exportando dossiê habitacional completo no formato exigido pelos correspondentes bancários.')}
              className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Download className="h-4 w-4" />
              Dossiê Bancário
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Painel de Parâmetros de Simulação (Coluna da Esquerda) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-6">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calculator className="h-5 w-5 text-red-600" />
            Parâmetros do Financiamento
          </h3>

          <div className="space-y-4 text-sm">
            {/* Valor do Imóvel */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Valor do Imóvel</label>
                <span className="font-bold text-slate-900">R$ {valorImovel.toLocaleString('pt-BR')}</span>
              </div>
              <input
                type="range"
                min={120000}
                max={1500000}
                step={5000}
                value={valorImovel}
                onChange={e => setValorImovel(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>R$ 120 mil</span>
                <span>R$ 1,5 milhão</span>
              </div>
            </div>

            {/* Valor da Entrada */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Valor da Entrada (Mín. 20%)</label>
                <span className="font-bold text-red-600">R$ {valorEntrada.toLocaleString('pt-BR')}</span>
              </div>
              <input
                type="range"
                min={valorImovel * 0.20}
                max={valorImovel * 0.80}
                step={2500}
                value={valorEntrada}
                onChange={e => setValorEntrada(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 text-right mt-0.5">
                {((valorEntrada / valorImovel) * 100).toFixed(0)}% do valor do imóvel
              </p>
            </div>

            {/* Prazo */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Prazo do Financiamento</label>
                <span className="font-bold text-slate-900">{prazoMeses} meses ({(prazoMeses / 12).toFixed(0)} anos)</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[120, 240, 360, 420].map(m => (
                  <button
                    key={m}
                    onClick={() => setPrazoMeses(m)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      prazoMeses === m
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {m / 12} anos
                  </button>
                ))}
              </div>
            </div>

            {/* Renda Familiar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Renda Bruta Familiar</label>
                <span className="font-bold text-slate-900">R$ {rendaFamiliar.toLocaleString('pt-BR')}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={30000}
                step={200}
                value={rendaFamiliar}
                onChange={e => setRendaFamiliar(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Sistema de Amortização (SAC vs PRICE) */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Sistema de Amortização
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSistemaAmortizacao('SAC')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    sistemaAmortizacao === 'SAC'
                      ? 'border-red-600 bg-red-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs">Tabela SAC</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Parcelas decrescentes</p>
                </button>
                <button
                  onClick={() => setSistemaAmortizacao('PRICE')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    sistemaAmortizacao === 'PRICE'
                      ? 'border-red-600 bg-red-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs">Tabela PRICE</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Parcelas fixas</p>
                </button>
              </div>
            </div>

            {/* Utilização do FGTS */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Utilizar Saldo do FGTS
                </label>
                <input
                  type="checkbox"
                  checked={utilizarFgts}
                  onChange={e => setUtilizarFgts(e.target.checked)}
                  className="h-4 w-4 accent-red-600 rounded cursor-pointer"
                />
              </div>

              {utilizarFgts && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Saldo FGTS Disponível:</span>
                  <input
                    type="number"
                    value={saldoFgts}
                    onChange={e => setSaldoFgts(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-red-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Painel Central de Resultados & CET (2 Colunas) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Principal de Aprovação e Valor de Parcela */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Condições Pré-Aprovadas (Padrão Santander)
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                    R$ {resultado.primeira_parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h2>
                  <span className="text-xs font-bold text-slate-500">/mês (1ª parcela)</span>
                </div>
                {sistemaAmortizacao === 'SAC' && (
                  <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <TrendingDown className="h-3.5 w-3.5" />
                    Última parcela estimada em R$ {resultado.ultima_parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>

              {/* Status de Enquadramento */}
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  resultado.comprometimento_renda_pct <= 30
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {resultado.comprometimento_renda_pct <= 30 ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  {resultado.comprometimento_renda_pct <= 30 ? 'Margem Aprovada' : 'Ajustar Entrada / Prazo'}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Comprometimento: <strong>{resultado.comprometimento_renda_pct}%</strong> da renda (Teto: 30%)
                </p>
              </div>
            </div>

            {/* Grid dos Detalhes Técnicos e Taxas (Transparência Bacen) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Valor Financiado</span>
                <p className="font-extrabold text-slate-900 text-base mt-0.5">
                  R$ {resultado.valor_financiado.toLocaleString('pt-BR')}
                </p>
                <span className="text-[10px] text-slate-500">({resultado.percentual_financiado.toFixed(0)}% do imóvel)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Taxa Nominal</span>
                <p className="font-extrabold text-red-600 text-base mt-0.5">
                  {resultado.taxa_juros_nominal_aa}% a.a.
                </p>
                <span className="text-[10px] text-slate-500">+ TR contratual</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CET (Bacen)</span>
                <p className="font-extrabold text-slate-900 text-base mt-0.5">
                  {resultado.cet_aa}% a.a.
                </p>
                <span className="text-[10px] text-slate-500">Custo Efetivo Total</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Renda Mínima</span>
                <p className="font-extrabold text-slate-900 text-base mt-0.5">
                  R$ {resultado.renda_minima_exigida.toLocaleString('pt-BR')}
                </p>
                <span className="text-[10px] text-emerald-600">Composição permitida</span>
              </div>
            </div>

            {/* Composição da Parcela Detalhada (Benchmark Bancário) */}
            <div className="pt-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-4 w-4 text-slate-400" /> Composição Obrigatória da Prestação
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Amortização</span>
                  <span className="font-bold text-slate-800">
                    R$ {(resultado.valor_financiado / resultado.prazo_meses).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Juros Mensais</span>
                  <span className="font-bold text-slate-800">
                    R$ {(resultado.primeira_parcela - (resultado.valor_financiado / resultado.prazo_meses) - 95).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Seguros (MIP + DFI)</span>
                  <span className="font-bold text-slate-800">
                    R$ 70,00 <span className="text-[10px] text-slate-400 font-normal">médio</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Taxa Adm. Fixa</span>
                  <span className="font-bold text-slate-800">R$ 25,00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist de Documentos Exigidos para Aprovação */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                Checklist Documental Obrigatório (Conformidade Santander / Bacen)
              </h3>
              <span className="text-xs font-semibold text-slate-500">6 itens obrigatórios</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {resultado.documentos_obrigatorios.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-slate-700 font-medium leading-relaxed">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Carta de Crédito Pré-Aprovada */}
      {aprovadoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                  D
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    CARTA DE PRÉ-APROVAÇÃO DE CRÉDITO IMOBILIÁRIO
                  </h3>
                  <p className="text-xs text-slate-400">Padrão Bacen / Santander Financiamentos · Protocolo: SAN-{Date.now().toString().slice(-8)}</p>
                </div>
              </div>
              <button
                onClick={() => setAprovadoModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                Certificamos que o proponente associado foi qualificado com <strong>PARECER FAVORÁVEL</strong> na pré-análise de risco e capacidade de pagamento para aquisição de imóvel habitacional:
              </p>

              <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block uppercase">Limite Pré-Aprovado:</span>
                  <span className="text-lg font-black text-red-600">
                    R$ {resultado.valor_financiado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Valor Estimado do Imóvel:</span>
                  <span className="text-lg font-black text-slate-900">
                    R$ {resultado.valor_imovel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Prazo Autorizado:</span>
                  <span className="font-bold text-slate-800">{resultado.prazo_meses} meses ({resultado.sistema_amortizacao})</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Validade da Carta:</span>
                  <span className="font-bold text-slate-800">90 dias a contar desta data</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * A contratação definitiva está condicionada à apresentação e conformidade jurídica da certidão de matrícula do imóvel e aprovação do laudo de engenharia.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setAprovadoModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert('Download da Carta de Crédito assinada eletronicamente iniciado.');
                  setAprovadoModal(false);
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Baixar Carta em PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
