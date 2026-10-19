import { useState } from 'react';
import {
  FileCheck2,
  Calendar,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Download,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  FileSpreadsheet,
  ShieldCheck,
  RefreshCw,
  Sliders,
  PieChart as PieChartIcon
} from 'lucide-react';

interface PeriodoContabil {
  mesAno: string;
  status: 'ABERTO' | 'EM_CONCILIACAO' | 'ENCERRADO_BLOQUEADO';
  totalReceitas: number;
  totalDespesas: number;
  resultadoLiquido: number;
  conciliacaoBancariaPct: number;
  fechadoPor?: string;
  fechadoEm?: string;
}

export default function FechamentoContabil() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('10/2026');

  // Histórico de Fechamento Contábil Mensal (Padrão SAP Financial Closing Cockpit)
  const [periodos, setPeriodos] = useState<PeriodoContabil[]>([
    {
      mesAno: '10/2026',
      status: 'EM_CONCILIACAO',
      totalReceitas: 1248000.00,
      totalDespesas: 894500.00,
      resultadoLiquido: 353500.00,
      conciliacaoBancariaPct: 94.2
    },
    {
      mesAno: '09/2026',
      status: 'ENCERRADO_BLOQUEADO',
      totalReceitas: 1180000.00,
      totalDespesas: 840000.00,
      resultadoLiquido: 340000.00,
      conciliacaoBancariaPct: 100.0,
      fechadoPor: 'Auditoria Externa / CEO',
      fechadoEm: '05/10/2026'
    },
    {
      mesAno: '08/2026',
      status: 'ENCERRADO_BLOQUEADO',
      totalReceitas: 1050000.00,
      totalDespesas: 790000.00,
      resultadoLiquido: 260000.00,
      conciliacaoBancariaPct: 100.0,
      fechadoPor: 'Controladoria Geral MBB',
      fechadoEm: '04/09/2026'
    }
  ]);

  // Demonstração do Resultado do Exercício (DRE Sintética e Analítica)
  const dreEstrutura = [
    { nivel: 1, codigo: '1', conta: 'RECEITA BRUTA OPERACIONAL', valor: 1248000.00, destaque: true },
    { nivel: 2, codigo: '1.1', conta: 'Receitas de Cotas Habitacionais (Amortização)', valor: 890000.00 },
    { nivel: 2, codigo: '1.2', conta: 'Taxas de Intercâmbio & MDR Cartão BaaS', valor: 238000.00 },
    { nivel: 2, codigo: '1.3', conta: 'Taxas de Administração e Serviços da Rede', valor: 120000.00 },
    { nivel: 1, codigo: '2', conta: 'DEDUÇÕES DA RECEITA BRUTA & TRIBUTOS', valor: -62400.00, destaque: false },
    { nivel: 2, codigo: '2.1', conta: 'Impostos e Retenções Diretas (PIS/COFINS/ISS)', valor: -62400.00 },
    { nivel: 1, codigo: '3', conta: 'RECEITA LÍQUIDA OPERACIONAL', valor: 1185600.00, destaque: true },
    { nivel: 1, codigo: '4', conta: 'CUSTOS OPERACIONAIS & REPASSES HABITACIONAIS', valor: -582100.00, destaque: false },
    { nivel: 2, codigo: '4.1', conta: 'Repasses a Construtoras e Fundo de Obra (FGO)', valor: -462100.00 },
    { nivel: 2, codigo: '4.2', conta: 'Liquidação D+1 Lojistas Rede Credenciada', valor: -120000.00 },
    { nivel: 1, codigo: '5', conta: 'RESULTADO BRUTO (LUCRO BRUTO)', valor: 603500.00, destaque: true },
    { nivel: 1, codigo: '6', conta: 'DESPESAS ADMINISTRATIVAS & OPERACIONAIS', valor: -250000.00, destaque: false },
    { nivel: 2, codigo: '6.1', conta: 'Repasses Institucionais a Federações (10%)', valor: -118000.00 },
    { nivel: 2, codigo: '6.2', conta: 'Repasses a Associações Locais (8%)', valor: -94000.00 },
    { nivel: 2, codigo: '6.3', conta: 'Despesas com Infraestrutura de TI & Cloud', valor: -38000.00 },
    { nivel: 1, codigo: '7', conta: 'RESULTADO LÍQUIDO DO EXERCÍCIO (SUPERÁVIT/LUCRO)', valor: 353500.00, destaque: true, final: true }
  ];

  const periodoAtual = periodos.find(p => p.mesAno === periodoSelecionado) || periodos[0];

  const alternarTravaPeriodo = () => {
    setPeriodos(prev =>
      prev.map(p => {
        if (p.mesAno === periodoSelecionado) {
          const novoStatus = p.status === 'ENCERRADO_BLOQUEADO' ? 'ABERTO' : 'ENCERRADO_BLOQUEADO';
          return {
            ...p,
            status: novoStatus,
            fechadoPor: novoStatus === 'ENCERRADO_BLOQUEADO' ? 'Administrador Global (CEO)' : undefined,
            fechadoEm: novoStatus === 'ENCERRADO_BLOQUEADO' ? new Date().toLocaleDateString('pt-BR') : undefined
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner Cockpit SAP / TOTVS */}
      <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              SAP Closing Cockpit · Encerramento Contábil & DRE Oficial
            </span>
            <span className="text-xs text-[#88A395] font-semibold">Competência {periodoSelecionado}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#15241E] tracking-tight">
            Fechamento Contábil & DRE Mensal
          </h2>
          <p className="text-xs sm:text-sm text-[#526E62] mt-0.5">
            Apuração de resultados, conciliação de extratos bancários e bloqueio formal de competência contábil.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={periodoSelecionado}
            onChange={(e) => setPeriodoSelecionado(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs font-bold text-[#15241E] outline-none"
          >
            {periodos.map(p => (
              <option key={p.mesAno} value={p.mesAno}>
                Competência {p.mesAno} ({p.status === 'ENCERRADO_BLOQUEADO' ? 'Bloqueado' : 'Em Aberto'})
              </option>
            ))}
          </select>

          <button
            onClick={alternarTravaPeriodo}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
              periodoAtual.status === 'ENCERRADO_BLOQUEADO'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                : 'bg-[#16382C] text-white hover:bg-[#112B22]'
            }`}
          >
            {periodoAtual.status === 'ENCERRADO_BLOQUEADO' ? (
              <>
                <Unlock className="w-4 h-4 text-amber-700" /> Reabrir Competência
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#C8F2D6]" /> Travar & Encerrar Período
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid de 4 Indicadores de Fechamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-[10px] font-bold text-[#88A395] uppercase">Receitas Brutas</span>
          <p className="text-2xl font-black text-[#15241E] mt-1">
            {periodoAtual.totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[11px] font-semibold text-[#10B981] mt-1 block">Cotas + Intercâmbio BaaS</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-[10px] font-bold text-[#88A395] uppercase">Custos & Repasses</span>
          <p className="text-2xl font-black text-[#15241E] mt-1">
            {periodoAtual.totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[11px] font-semibold text-[#526E62] mt-1 block">Obras, Lojistas e Federações</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-[10px] font-bold text-[#88A395] uppercase">Resultado do Período</span>
          <p className="text-2xl font-black text-[#10B981] mt-1">
            {periodoAtual.resultadoLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[11px] font-semibold text-[#16382C] mt-1 block">Superávit Cooperativo</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-[10px] font-bold text-[#88A395] uppercase">Conciliação Bancária</span>
          <p className="text-2xl font-black text-[#16382C] mt-1">
            {periodoAtual.conciliacaoBancariaPct}%
          </p>
          <div className="w-full bg-[#E2EBE5] h-2 rounded-full overflow-hidden mt-1.5">
            <div className="bg-[#10B981] h-full rounded-full" style={{ width: `${periodoAtual.conciliacaoBancariaPct}%` }} />
          </div>
        </div>
      </div>

      {/* Demonstração do Resultado do Exercício (DRE) - Layout Contábil SAP / TOTVS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2EBE5] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2EBE5]/60 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6]">
              <FileSpreadsheet className="w-5 h-5 text-[#16382C]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#15241E]">
                DRE Estruturada — Lei 6.404/76 & NBC TG / IFRS
              </h3>
              <p className="text-xs text-[#88A395]">
                Consolidação operacional por contas de resultado com dedução de repasses obrigatórios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Exportando DRE em formato oficial PDF e Excel para a Auditoria.')}
              className="px-3.5 py-2 rounded-xl border border-[#E2EBE5] bg-[#F4F7F5] hover:bg-white text-xs font-bold text-[#16382C] flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" /> Exportar DRE
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2EBE5] text-[#88A395] uppercase font-bold text-[10px]">
                <th className="pb-3 w-20">Classificação</th>
                <th className="pb-3">Conta de Resultado / Descrição</th>
                <th className="pb-3 text-right">Valor do Período ({periodoSelecionado})</th>
                <th className="pb-3 text-right w-24">Part. %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EBE5]/50 font-medium">
              {dreEstrutura.map((item, idx) => {
                const isTotalizador = item.destaque;
                const isFinal = item.final;
                const percentual = ((Math.abs(item.valor) / 1248000) * 100).toFixed(1);

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isFinal
                        ? 'bg-[#E8F8EE] font-black'
                        : isTotalizador
                        ? 'bg-[#F4F7F5] font-bold'
                        : 'hover:bg-[#F4F7F5]/50'
                    }`}
                  >
                    <td className={`py-2.5 font-mono text-[11px] ${isTotalizador ? 'text-[#16382C] font-bold' : 'text-[#88A395]'}`}>
                      {item.codigo}
                    </td>
                    <td className={`py-2.5 ${item.nivel === 2 ? 'pl-6 text-[#526E62]' : 'text-[#15241E]'}`}>
                      {item.conta}
                    </td>
                    <td className={`py-2.5 text-right font-mono text-[11px] ${
                      item.valor < 0
                        ? 'text-red-600'
                        : isFinal || isTotalizador
                        ? 'text-[#16382C] font-black'
                        : 'text-[#15241E]'
                    }`}>
                      {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-2.5 text-right font-mono text-[10px] text-[#88A395]">
                      {percentual}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
