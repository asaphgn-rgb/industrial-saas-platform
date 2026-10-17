import { useState } from 'react';
import {
  Coins,
  Home,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Percent,
  History,
  Building,
  ShieldCheck,
  AlertCircle,
  PiggyBank,
  Sparkles
} from 'lucide-react';
import { ResgateCashbackMoradia } from '@/types/cartao';

export default function CashbackMoradia() {
  const [saldoDisponivel, setSaldoDisponivel] = useState(482.50);
  const [valorAmortizacao, setValorAmortizacao] = useState(250.00);
  const [amortizadoSucesso, setAmortizadoSucesso] = useState(false);

  const [historicoResgates, setHistoricoResgates] = useState<ResgateCashbackMoradia[]>([
    {
      id: 'resg-101',
      associado_nome: 'Marcos Vinicius Almeida',
      contrato_numero: 'CTR-5001',
      unidade_moradia: 'Residencial Diamante Sul · Apto 102',
      valor_resgatado: 150.00,
      saldo_anterior: 632.50,
      novo_saldo: 482.50,
      data_operacao: '10/10/2026',
      status: 'CONCLUIDO'
    },
    {
      id: 'resg-102',
      associado_nome: 'Marcos Vinicius Almeida',
      contrato_numero: 'CTR-5001',
      unidade_moradia: 'Residencial Diamante Sul · Apto 102',
      valor_resgatado: 210.00,
      saldo_anterior: 842.50,
      novo_saldo: 632.50,
      data_operacao: '10/09/2026',
      status: 'CONCLUIDO'
    }
  ]);

  const handleAmortizar = () => {
    if (valorAmortizacao > saldoDisponivel || valorAmortizacao <= 0) {
      alert('Valor de amortização inválido ou superior ao saldo disponível.');
      return;
    }

    const novoSaldo = saldoDisponivel - valorAmortizacao;
    const novoResgate: ResgateCashbackMoradia = {
      id: `resg-${Date.now()}`,
      associado_nome: 'Marcos Vinicius Almeida',
      contrato_numero: 'CTR-5001',
      unidade_moradia: 'Residencial Diamante Sul · Apto 102',
      valor_resgatado: valorAmortizacao,
      saldo_anterior: saldoDisponivel,
      novo_saldo: novoSaldo,
      data_operacao: new Date().toLocaleDateString('pt-BR'),
      status: 'CONCLUIDO'
    };

    setHistoricoResgates([novoResgate, ...historicoResgates]);
    setSaldoDisponivel(novoSaldo);
    setAmortizadoSucesso(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Cashback Habitacional & Fidelidade Social
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Integração Fintech + Moradia
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Utilize o cashback acumulado das suas compras diárias na rede credenciada do Cartão Diamond para abater suas parcelas e cotas habitacionais.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Painel Central de Saldo e Ação de Resgate */}
        <div className="lg:col-span-2 bg-gradient-to-br from-purple-950 via-slate-900 to-diamond-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/40 flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
            <PiggyBank className="w-80 h-80 text-purple-300" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Coins className="h-3.5 w-3.5 text-amber-400" /> Saldo Acumulado para Habitação
            </div>

            <div>
              <p className="text-sm text-slate-300">Saldo Disponível para Amortização:</p>
              <h3 className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">
                R$ {saldoDisponivel.toFixed(2).replace('.', ',')}
              </h3>
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +R$ 64,80 acumulados este mês na rede parceira
              </p>
            </div>
          </div>

          {/* Card de Ação de Desconto */}
          <div className="relative z-10 mt-8 pt-6 border-t border-purple-800/60 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase font-bold text-purple-300 tracking-wider">Unidade Beneficiada:</p>
                <p className="font-bold text-white text-base">Residencial Diamante Sul · Apto 102</p>
                <p className="text-xs text-slate-400">Contrato Ativo: CTR-5001 · Vencimento da Cota: 10/11/2026</p>
              </div>

              <div className="w-full sm:w-auto">
                <label className="text-xs text-slate-300 block mb-1">Valor a Abater (R$):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    max={saldoDisponivel}
                    min={10}
                    step={10}
                    value={valorAmortizacao}
                    onChange={e => setValorAmortizacao(Number(e.target.value))}
                    className="w-32 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleAmortizar}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all flex-shrink-0"
                  >
                    Amortizar Agora <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {amortizadoSucesso && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Desconto de R$ {valorAmortizacao.toFixed(2).replace('.', ',')} aplicado com sucesso no boleto da sua cota habitacional!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Como Funciona o Cashback Habitacional */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            Ecossistema de Economia Circular
          </h3>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                1
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold">Compre na Rede Credenciada</strong>
                Supermercados, postos e farmácias conveniados devolvem de 2% a 6.5% de cashback direto para sua conta.
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                2
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold">Saldo Protegido</strong>
                O saldo acumulado é mantido em custódia remunerada e não expira enquanto o associado mantiver o plano ativo.
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                3
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold">Moradia Mais Barata</strong>
                Converta seus pontos e cashback direto em desconto na entrada, nas parcelas mensais ou na quitação da sua moradia.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Resgates Realizados */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <History className="h-5 w-5 text-purple-600" />
              Extrato de Amortizações Habitacionais
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Histórico de resgates creditados no rateio da sua unidade</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Data da Operação</th>
                <th className="py-4 px-6">Contrato & Unidade</th>
                <th className="py-4 px-6">Valor Abatido</th>
                <th className="py-4 px-6">Saldo Anterior / Remanescente</th>
                <th className="py-4 px-6">Status da Liquidação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historicoResgates.map(resg => (
                <tr key={resg.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {resg.data_operacao}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{resg.unidade_moradia}</p>
                    <p className="text-xs text-slate-400 font-mono">Contrato {resg.contrato_numero}</p>
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-600 text-base">
                    - R$ {resg.valor_resgatado.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    <p>Anterior: R$ {resg.saldo_anterior.toFixed(2).replace('.', ',')}</p>
                    <p className="text-slate-400">Atual: R$ {resg.novo_saldo.toFixed(2).replace('.', ',')}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Abatido na Cota Habitacional
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
