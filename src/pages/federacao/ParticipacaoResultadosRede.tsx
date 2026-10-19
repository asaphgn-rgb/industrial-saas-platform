import { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  CheckCircle2,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Percent,
  Receipt,
  Landmark,
  PiggyBank
} from 'lucide-react';
import { ExtratoRepasseRede, RegraSplitBonificacao } from '@/types/ecosystem';

export default function ParticipacaoResultadosRede() {
  const [filtroPeriodo, setFiltroPeriodo] = useState('10/2026');

  // Regras de Split Contratuais Vigentes
  const regrasSplit: RegraSplitBonificacao[] = [
    {
      id: 'spl-01',
      origem_evento: 'TAXA_ADESAO_50',
      percentual_associacao: 25.00,
      percentual_federacao: 15.00,
      percentual_plataforma: 60.00,
      ativo: true
    },
    {
      id: 'spl-02',
      origem_evento: 'CONSUMO_REDE_LOJISTA',
      percentual_associacao: 30.00,
      percentual_federacao: 20.00,
      percentual_plataforma: 50.00,
      ativo: true
    },
    {
      id: 'spl-03',
      origem_evento: 'PARCELA_HABITACIONAL',
      percentual_associacao: 10.00,
      percentual_federacao: 5.00,
      percentual_plataforma: 85.00,
      ativo: true
    }
  ];

  // Extrato de Bonificações Geradas pela Base Vinculada à Federação / Associação
  const [extratoRepasses] = useState<ExtratoRepasseRede[]>([
    {
      id: 'rep-01',
      origem_evento: 'Adesão Cadastral R$ 50 (Cashback)',
      referencia_id: 'tx-50-8841',
      entidade_tipo: 'ASSOCIACAO',
      entidade_id: 'asc-01',
      entidade_nome: 'Associação Habitacional Aliança DF',
      associado_origem_nome: 'Marcos Vinicius Almeida',
      valor_base: 50.00,
      percentual_aplicado: 25.00,
      valor_bonificacao: 12.50,
      status_repasse: 'LIQUIDADO_PIX',
      data_liquidacao: '19/10/2026',
      comprovante_pix: 'PIX-E2E-883921004',
      created_at: '19/10/2026 10:15'
    },
    {
      id: 'rep-02',
      origem_evento: 'Adesão Cadastral R$ 50 (Cashback)',
      referencia_id: 'tx-50-8841',
      entidade_tipo: 'FEDERACAO',
      entidade_id: 'fed-01',
      entidade_nome: 'Federação das Entidades Habitacionais do DF',
      associado_origem_nome: 'Marcos Vinicius Almeida',
      valor_base: 50.00,
      percentual_aplicado: 15.00,
      valor_bonificacao: 7.50,
      status_repasse: 'LIQUIDADO_PIX',
      data_liquidacao: '19/10/2026',
      comprovante_pix: 'PIX-E2E-883921005',
      created_at: '19/10/2026 10:15'
    },
    {
      id: 'rep-03',
      origem_evento: 'Consumo Rede Lojista (Construforte)',
      referencia_id: 'mdr-94812',
      entidade_tipo: 'ASSOCIACAO',
      entidade_id: 'asc-01',
      entidade_nome: 'Associação Habitacional Aliança DF',
      associado_origem_nome: 'Roberto Carlos Silveira',
      valor_base: 2480.00,
      percentual_aplicado: 1.80, // Taxa MDR dividida
      valor_bonificacao: 13.39,
      status_repasse: 'DISPONIVEL',
      data_liquidacao: '20/10/2026',
      created_at: '19/10/2026 14:30'
    },
    {
      id: 'rep-04',
      origem_evento: 'Consumo Rede Lojista (Construforte)',
      referencia_id: 'mdr-94812',
      entidade_tipo: 'FEDERACAO',
      entidade_id: 'fed-01',
      entidade_nome: 'Federação das Entidades Habitacionais do DF',
      associado_origem_nome: 'Roberto Carlos Silveira',
      valor_base: 2480.00,
      percentual_aplicado: 1.80,
      valor_bonificacao: 8.92,
      status_repasse: 'DISPONIVEL',
      data_liquidacao: '20/10/2026',
      created_at: '19/10/2026 14:30'
    },
    {
      id: 'rep-05',
      origem_evento: 'Amortização Cota Habitacional Lote 04',
      referencia_id: 'hab-1428',
      entidade_tipo: 'ASSOCIACAO',
      entidade_id: 'asc-01',
      entidade_nome: 'Associação Habitacional Aliança DF',
      associado_origem_nome: 'Patrícia Mendes Castro',
      valor_base: 1480.00,
      percentual_aplicado: 10.00,
      valor_bonificacao: 148.00,
      status_repasse: 'DISPONIVEL',
      data_liquidacao: '20/10/2026',
      created_at: '18/10/2026 11:20'
    }
  ]);

  const totalBonificacoes = extratoRepasses.reduce((acc, r) => acc + r.valor_bonificacao, 0);
  const totalLiquidadoPix = extratoRepasses.filter(r => r.status_repasse === 'LIQUIDADO_PIX').reduce((acc, r) => acc + r.valor_bonificacao, 0);
  const totalDisponivel = extratoRepasses.filter(r => r.status_repasse === 'DISPONIVEL').reduce((acc, r) => acc + r.valor_bonificacao, 0);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner de Participação de Resultados */}
      <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
              Revenue Share Recorrente · Federações & Associações
            </span>
            <span className="text-xs text-[#88A395] font-semibold">Competência {filtroPeriodo}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#15241E] tracking-tight">
            Participação nos Resultados da Rede
          </h2>
          <p className="text-xs sm:text-sm text-[#526E62] mt-0.5">
            Apuração automática e split de receitas sobre adesões (R$ 50), transações no comércio conveniado e cotas habitacionais.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Exportando extrato oficial de repasses via PIX em PDF/Excel.')}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2EBE5] hover:bg-[#F4F7F5] text-[#16382C] text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#16382C]" /> Exportar Repasses
          </button>
          <button
            onClick={() => alert('Solicitação de transferência em lote dos valores disponíveis via PIX enviada.')}
            className="px-4 py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4 text-[#C8F2D6]" /> Solicitar Resgate PIX
          </button>
        </div>
      </div>

      {/* Grid de 3 Cards de Indicadores de Bonificação */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-xs font-bold uppercase text-[#88A395]">Total de Bonificações Geradas</span>
          <p className="text-3xl font-black text-[#15241E] mt-1">
            {totalBonificacoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[11px] font-semibold text-[#10B981] mt-0.5 block">
            Base vinculada: 148 associações / 15.430 membros
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-xs font-bold uppercase text-[#88A395]">Disponível para Resgate</span>
          <p className="text-3xl font-black text-[#10B981] mt-1">
            {totalDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[11px] font-semibold text-[#16382C] mt-0.5 block">
            Pronto para liquidação via PIX Bacen D+0
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-xs font-bold uppercase text-[#88A395]">Liquidado via PIX neste Mês</span>
          <p className="text-3xl font-black text-[#16382C] mt-1">
            {totalLiquidadoPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[11px] font-semibold text-[#526E62] mt-0.5 block">
            Comprovantes bancários com chave E2E
          </span>
        </div>
      </div>

      {/* Tabela de Regras de Split Contratual */}
      <div className="bg-white rounded-3xl border border-[#E2EBE5] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]/60">
          <div>
            <h3 className="text-base font-black text-[#15241E]">
              Regras Parametrizadas de Split de Resultados
            </h3>
            <p className="text-xs text-[#88A395]">
              Distribuição automática dos eventos de receita entre as entidades vinculadas
            </p>
          </div>
          <span className="text-xs font-bold text-[#16382C] bg-[#E8F8EE] px-3 py-1 rounded-full">
            Contrato Padrão Homologado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {regrasSplit.map(reg => (
            <div key={reg.id} className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5] space-y-2">
              <span className="text-xs font-black text-[#15241E] block">
                {reg.origem_evento.replace(/_/g, ' ')}
              </span>
              <div className="space-y-1 text-xs text-[#526E62]">
                <div className="flex justify-between">
                  <span>Associação Vinculada:</span>
                  <strong className="text-[#16382C] font-black">{reg.percentual_associacao}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Federação Regional:</span>
                  <strong className="text-[#16382C] font-black">{reg.percentual_federacao}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Plataforma & Fundo Obras:</span>
                  <strong className="text-[#88A395]">{reg.percentual_plataforma}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela Detalhada de Lançamentos de Repasse */}
      <div className="bg-white rounded-3xl border border-[#E2EBE5] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]/60">
          <div>
            <h3 className="text-base font-black text-[#15241E]">
              Extrato Detalhado de Repasses & Bonificações
            </h3>
            <p className="text-xs text-[#88A395]">
              Rastreamento associado a associado por evento gerador de receita
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2EBE5] text-[#88A395] uppercase font-bold text-[10px]">
                <th className="pb-3">Data / Hora</th>
                <th className="pb-3">Entidade Beneficiada</th>
                <th className="pb-3">Evento Gerador / Membro</th>
                <th className="pb-3 text-right">Valor Base</th>
                <th className="pb-3 text-right">Part. %</th>
                <th className="pb-3 text-right">Bonificação (R$)</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EBE5]/60 font-medium">
              {extratoRepasses.map(rep => (
                <tr key={rep.id} className="hover:bg-[#F4F7F5]/50 transition-colors">
                  <td className="py-3 text-[#526E62] text-[11px] whitespace-nowrap">
                    {rep.created_at}
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-[#15241E] block">{rep.entidade_nome}</span>
                    <span className="text-[10px] text-[#88A395] font-bold uppercase">{rep.entidade_tipo}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-[#15241E] font-semibold block">{rep.origem_evento}</span>
                    <span className="text-[10px] text-[#526E62]">Membro: {rep.associado_origem_nome}</span>
                  </td>
                  <td className="py-3 text-right font-mono">
                    {rep.valor_base.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-3 text-right font-bold text-[#16382C]">
                    {rep.percentual_aplicado}%
                  </td>
                  <td className="py-3 text-right font-mono font-black text-[#10B981]">
                    +{rep.valor_bonificacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      rep.status_repasse === 'LIQUIDADO_PIX'
                        ? 'bg-[#E8F8EE] text-[#16382C]'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {rep.status_repasse}
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
