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
  Sparkles,
  Flame,
  Award,
  ChevronRight
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
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Economia Circular & Fidelidade Esfera
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Cashback Habitacional & Fidelidade Social
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Converta automaticamente o cashback gerado nas compras cotidianas em desconto nas parcelas e cotas habitacionais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-50 text-[#EC0000] border border-red-200 shadow-sm">
            <Flame className="h-4 w-4 text-[#EC0000] fill-[#EC0000]" /> Pontos Esfera Ativos
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Painel Central Santander Unique Red Style */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1C1C1C] via-[#141414] to-[#0A0A0A] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-neutral-800 flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 pointer-events-none">
            <PiggyBank className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-red-300 border border-white/10">
              <Coins className="h-3.5 w-3.5 text-amber-400" /> Saldo Acumulado para Amortização Habitacional
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Líquido Disponível:</p>
              <h3 className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">
                R$ {saldoDisponivel.toFixed(2).replace('.', ',')}
              </h3>
              <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +R$ 64,80 acumulados este mês na rede credenciada
              </p>
            </div>
          </div>

          {/* Card de Ação de Desconto */}
          <div className="relative z-10 mt-8 pt-6 border-t border-neutral-800 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase font-bold text-red-400 tracking-wider">Unidade Habitacional Beneficiada:</p>
                <p className="font-black text-white text-base">Residencial Diamante Sul · Apto 102</p>
                <p className="text-xs text-slate-400">Contrato Ativo: CTR-5001 · Vencimento da Cota: 10/11/2026</p>
              </div>

              <div className="w-full sm:w-auto">
                <label className="text-xs text-slate-300 block mb-1 font-bold">Valor a Abater (R$):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    max={saldoDisponivel}
                    min={10}
                    step={10}
                    value={valorAmortizacao}
                    onChange={e => setValorAmortizacao(Number(e.target.value))}
                    className="w-32 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white font-bold outline-none focus:border-[#EC0000]"
                  />
                  <button
                    onClick={handleAmortizar}
                    className="px-5 py-2.5 rounded-xl bg-[#EC0000] hover:bg-[#CC0000] text-white font-bold text-xs shadow-md shadow-red-600/30 flex items-center gap-2 transition-all shrink-0"
                  >
                    Abater na Parcela <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {amortizadoSucesso && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  Desconto de R$ {valorAmortizacao.toFixed(2).replace('.', ',')} aplicado com sucesso no próximo boleto da sua cota habitacional!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Como Funciona o Cashback Habitacional */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="h-5 w-5 text-[#EC0000]" />
              Ecossistema de Economia Circular
            </h3>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed mt-4">
              <div className="p-3.5 bg-[#F4F6F9] rounded-2xl border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-100 text-[#EC0000] font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 block font-bold">Compre na Rede Credenciada</strong>
                  Supermercados, postos e farmácias conveniados devolvem de 2% a 6.5% de cashback direto para sua conta.
                </div>
              </div>

              <div className="p-3.5 bg-[#F4F6F9] rounded-2xl border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-100 text-[#EC0000] font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 block font-bold">Custódia Remunerada</strong>
                  O saldo acumulado é mantido em conta de custódia Bacen e não expira enquanto o associado for filiado ativo.
                </div>
              </div>

              <div className="p-3.5 bg-[#F4F6F9] rounded-2xl border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-100 text-[#EC0000] font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 block font-bold">Moradia Mais Acessível</strong>
                  Converta seu saldo direto em abatimento da entrada, parcelas de amortização ou quitação antecipada.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium">
            Benefício auditado pelo Conselho Fiscal e garantido por contrato associativo
          </div>
        </div>
      </div>

      {/* Histórico de Resgates Realizados */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <History className="h-5 w-5 text-[#EC0000]" />
              Extrato de Amortizações Habitacionais
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Histórico de créditos aplicados no rateio da sua unidade</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8FAFC] text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/80">
              <tr>
                <th className="py-4 px-6">Data da Operação</th>
                <th className="py-4 px-6">Contrato & Unidade</th>
                <th className="py-4 px-6">Valor Abatido</th>
                <th className="py-4 px-6">Saldo Anterior / Remanescente</th>
                <th className="py-4 px-6">Status da Liquidação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {historicoResgates.map(resg => (
                <tr key={resg.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {resg.data_operacao}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{resg.unidade_moradia}</p>
                    <p className="text-xs text-slate-400 font-mono">Contrato {resg.contrato_numero}</p>
                  </td>
                  <td className="py-4 px-6 font-black text-emerald-600 text-sm">
                    - R$ {resg.valor_resgatado.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    <p>Anterior: R$ {resg.saldo_anterior.toFixed(2).replace('.', ',')}</p>
                    <p className="text-slate-400">Atual: R$ {resg.novo_saldo.toFixed(2).replace('.', ',')}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
