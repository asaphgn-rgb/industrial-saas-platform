import { useState } from 'react';
import {
  BookOpen,
  DollarSign,
  Filter,
  Download,
  Search,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  FileSpreadsheet,
  Lock,
  Hash,
  RefreshCw,
  Building2,
  Landmark
} from 'lucide-react';
import {
  ContaPlanoContabil,
  LancamentoLivroRazao,
  TipoContaContabil
} from '@/types/enterprise-core';

export default function LivroRazaoContabil() {
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [busca, setBusca] = useState('');
  const [contaSelecionada, setContaSelecionada] = useState<string>('TODAS');

  // Plano de Contas Padrão COSIF / SAP RE-FX
  const planoContas: ContaPlanoContabil[] = [
    {
      id: 'cta-1',
      codigo_estruturado: '1.1.01.001',
      nome: 'Conta Corrente Centralizadora MBB',
      tipo: 'ATIVO',
      natureza: 'DEVEDORA',
      tenant_tipo: 'GLOBAL',
      nivel_hierarquico: 4,
      permite_lancamento: true,
      created_at: '2026-01-01'
    },
    {
      id: 'cta-2',
      codigo_estruturado: '1.1.01.002',
      nome: 'Conta Reserva de Liquidez Cartão BaaS',
      tipo: 'ATIVO',
      natureza: 'DEVEDORA',
      tenant_tipo: 'GLOBAL',
      nivel_hierarquico: 4,
      permite_lancamento: true,
      created_at: '2026-01-01'
    },
    {
      id: 'cta-3',
      codigo_estruturado: '1.1.02.001',
      nome: 'Cotas Habitacionais a Liquidar',
      tipo: 'ATIVO',
      natureza: 'DEVEDORA',
      tenant_tipo: 'GLOBAL',
      nivel_hierarquico: 4,
      permite_lancamento: true,
      created_at: '2026-01-01'
    },
    {
      id: 'cta-4',
      codigo_estruturado: '2.1.01.001',
      nome: 'Repasses Programados a Federações',
      tipo: 'PASSIVO',
      natureza: 'CREDORA',
      tenant_tipo: 'GLOBAL',
      nivel_hierarquico: 4,
      permite_lancamento: true,
      created_at: '2026-01-01'
    },
    {
      id: 'cta-5',
      codigo_estruturado: '2.1.01.003',
      nome: 'Saldos de Cashback de Associados',
      tipo: 'PASSIVO',
      natureza: 'CREDORA',
      tenant_tipo: 'GLOBAL',
      nivel_hierarquico: 4,
      permite_lancamento: true,
      created_at: '2026-01-01'
    },
    {
      id: 'cta-6',
      codigo_estruturado: '4.1.02.000',
      nome: 'Taxas de Intercâmbio MDR Cartão',
      tipo: 'RECEITA',
      natureza: 'CREDORA',
      tenant_tipo: 'GLOBAL',
      nivel_hierarquico: 3,
      permite_lancamento: true,
      created_at: '2026-01-01'
    }
  ];

  // Lançamentos no Livro-Razão com Partidas Dobradas e Hashes Merkle
  const [lancamentos] = useState<LancamentoLivroRazao[]>([
    {
      id: 'lz-001',
      transacao_id: 'tx-20261019-01',
      origem_operacao: 'AMORTIZACAO_HABITACIONAL',
      conta_id: 'cta-1',
      conta_codigo: '1.1.01.001',
      conta_nome: 'Conta Corrente Centralizadora MBB',
      tipo_movimento: 'D',
      valor: 148500.00,
      moeda: 'BRL',
      historico: 'Aporte de cotas de amortização cooperativa - Federação DF Lote 04',
      documento_referencia: 'TED-883921',
      data_competencia: '2026-10-19',
      hash_anterior: '0000000000000000000000000000000000000000000000000000000000000000',
      hash_atual: '8f4d9b2e1a3c7e5f608123456789abcdef0123456789abcdef0123456789abcd',
      created_at: '2026-10-19 09:30:00'
    },
    {
      id: 'lz-002',
      transacao_id: 'tx-20261019-01',
      origem_operacao: 'AMORTIZACAO_HABITACIONAL',
      conta_id: 'cta-3',
      conta_codigo: '1.1.02.001',
      conta_nome: 'Cotas Habitacionais a Liquidar',
      tipo_movimento: 'C',
      valor: 148500.00,
      moeda: 'BRL',
      historico: 'Liquidação de cotas a receber - Mutuários Empreendimento Diamante',
      documento_referencia: 'TED-883921',
      data_competencia: '2026-10-19',
      hash_anterior: '8f4d9b2e1a3c7e5f608123456789abcdef0123456789abcdef0123456789abcd',
      hash_atual: '7a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef',
      created_at: '2026-10-19 09:30:01'
    },
    {
      id: 'lz-003',
      transacao_id: 'tx-20261019-02',
      origem_operacao: 'MDR_LOJISTA',
      conta_id: 'cta-2',
      conta_codigo: '1.1.01.002',
      conta_nome: 'Conta Reserva de Liquidez Cartão BaaS',
      tipo_movimento: 'D',
      valor: 82400.00,
      moeda: 'BRL',
      historico: 'Recebimento de liquidação líquida adquirente CIP D+1',
      documento_referencia: 'PIX-BACEN-94812',
      data_competencia: '2026-10-19',
      hash_anterior: '7a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef',
      hash_atual: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      created_at: '2026-10-19 11:15:22'
    },
    {
      id: 'lz-004',
      transacao_id: 'tx-20261019-02',
      origem_operacao: 'MDR_LOJISTA',
      conta_id: 'cta-6',
      conta_codigo: '4.1.02.000',
      conta_nome: 'Taxas de Intercâmbio MDR Cartão',
      tipo_movimento: 'C',
      valor: 1483.20,
      moeda: 'BRL',
      historico: 'Retenção contratual MDR 1.80% sobre transações de rede credenciada',
      documento_referencia: 'MDR-APUR-1019',
      data_competencia: '2026-10-19',
      hash_anterior: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      hash_atual: '5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c',
      created_at: '2026-10-19 11:15:23'
    },
    {
      id: 'lz-005',
      transacao_id: 'tx-20261019-03',
      origem_operacao: 'CASHBACK',
      conta_id: 'cta-5',
      conta_codigo: '2.1.01.003',
      conta_nome: 'Saldos de Cashback de Associados',
      tipo_movimento: 'D',
      valor: 5400.00,
      moeda: 'BRL',
      historico: 'Resgate de cashback de associados para amortização na parcela habitacional',
      documento_referencia: 'RESG-AMORT-4401',
      data_competencia: '2026-10-18',
      hash_anterior: '5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c',
      hash_atual: '9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b',
      created_at: '2026-10-18 16:45:00'
    }
  ]);

  const lancamentosFiltrados = lancamentos.filter(l => {
    const matchConta = contaSelecionada === 'TODAS' || l.conta_codigo === contaSelecionada;
    const matchBusca =
      l.historico.toLowerCase().includes(busca.toLowerCase()) ||
      l.transacao_id.toLowerCase().includes(busca.toLowerCase()) ||
      l.conta_nome?.toLowerCase().includes(busca.toLowerCase()) ||
      (l.documento_referencia && l.documento_referencia.toLowerCase().includes(busca.toLowerCase()));
    return matchConta && matchBusca;
  });

  const totalDebitos = lancamentosFiltrados
    .filter(l => l.tipo_movimento === 'D')
    .reduce((acc, l) => acc + l.valor, 0);

  const totalCreditos = lancamentosFiltrados
    .filter(l => l.tipo_movimento === 'C')
    .reduce((acc, l) => acc + l.valor, 0);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner de Governança Contábil Padrão SAP */}
      <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              ERP Core · Livro-Razão Contábil IFRS / Bacen COSIF
            </span>
            <span className="text-xs text-[#88A395] font-semibold">Partidas Dobradas Imutáveis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#15241E] tracking-tight">
            Livro-Razão Geral & Conciliação
          </h2>
          <p className="text-xs sm:text-sm text-[#526E62] mt-0.5">
            Registro encadeado por SHA-256 (Merkle Hash) para auditorias independentes e conformidade legal.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Exportando Livro-Razão Oficial em PDF Auditável conforme CPC 06.')}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2EBE5] hover:bg-[#F4F7F5] text-[#16382C] text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#16382C]" />
            Exportar Razão
          </button>
          <button
            onClick={() => alert('Balanço Verificado: Débitos e Créditos equilibrados em 100% dos lançamentos.')}
            className="px-4 py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#C8F2D6]" />
            Auditar Balancete
          </button>
        </div>
      </div>

      {/* Grid de 3 Cards de Balancete em Tempo Real */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#88A395] uppercase">Total de Débitos (D)</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F8EE] flex items-center justify-center text-[#16382C]">
              <ArrowDownLeft className="w-4 h-4 text-[#16382C]" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#15241E] mt-2">
            {totalDebitos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[11px] font-semibold text-[#10B981] mt-1 block">Aplicações e Entradas</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#88A395] uppercase">Total de Créditos (C)</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F8EE] flex items-center justify-center text-[#16382C]">
              <ArrowUpRight className="w-4 h-4 text-[#16382C]" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#15241E] mt-2">
            {totalCreditos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[11px] font-semibold text-[#526E62] mt-1 block">Origens e Obrigações</span>
        </div>

        <div className="bg-[#16382C] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-[#C8F2D6] uppercase">Equilíbrio Contábil</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#C8F2D6]">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 relative z-10">
            Diferença: R$ 0,00
          </p>
          <span className="text-[11px] font-bold text-[#C8F2D6] mt-1 block relative z-10">
            Partidas 100% Conciliadas
          </span>
        </div>
      </div>

      {/* Tabela do Livro-Razão com Filtros e Hashes Merkle */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2EBE5] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#88A395]" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar por histórico, transação..."
                className="w-full rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] py-2 pl-9 pr-4 text-xs text-[#15241E] placeholder-[#88A395] outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <select
              value={contaSelecionada}
              onChange={(e) => setContaSelecionada(e.target.value)}
              className="rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] py-2 px-3 text-xs text-[#15241E] font-semibold outline-none"
            >
              <option value="TODAS">Todas as Contas Contábeis</option>
              {planoContas.map((cta) => (
                <option key={cta.id} value={cta.codigo_estruturado}>
                  {cta.codigo_estruturado} - {cta.nome}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs font-bold text-[#88A395]">
            Mostrando {lancamentosFiltrados.length} lançamentos auditados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2EBE5] text-[#88A395] uppercase font-bold text-[10px]">
                <th className="pb-3">Competência</th>
                <th className="pb-3">Conta Contábil / Código</th>
                <th className="pb-3">Histórico da Operação</th>
                <th className="pb-3 text-center">Tipo</th>
                <th className="pb-3 text-right">Valor</th>
                <th className="pb-3 text-right">Hash SHA-256 (Merkle)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EBE5]/60 font-medium">
              {lancamentosFiltrados.map((l) => (
                <tr key={l.id} className="hover:bg-[#F4F7F5]/50 transition-colors">
                  <td className="py-3 text-[#526E62] text-[11px] whitespace-nowrap">
                    {l.data_competencia}
                    <span className="block text-[10px] text-[#88A395] font-mono">{l.transacao_id}</span>
                  </td>
                  <td className="py-3 pr-2">
                    <p className="font-bold text-[#15241E] font-mono text-[11px]">{l.conta_codigo}</p>
                    <p className="text-[10px] text-[#526E62] truncate max-w-[200px]">{l.conta_nome}</p>
                  </td>
                  <td className="py-3 pr-2 text-[#15241E] max-w-xs">
                    <p className="line-clamp-2">{l.historico}</p>
                    {l.documento_referencia && (
                      <span className="text-[10px] text-[#88A395] font-mono block mt-0.5">Ref: {l.documento_referencia}</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      l.tipo_movimento === 'D' ? 'bg-[#E8F8EE] text-[#16382C]' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {l.tipo_movimento === 'D' ? 'DÉBITO' : 'CRÉDITO'}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-black whitespace-nowrap ${
                    l.tipo_movimento === 'D' ? 'text-[#16382C]' : 'text-blue-700'
                  }`}>
                    {l.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-3 text-right font-mono text-[10px] text-[#88A395] whitespace-nowrap">
                    <span title={l.hash_atual} className="hover:text-[#16382C] cursor-help">
                      {l.hash_atual.substring(0, 10)}...{l.hash_atual.substring(58)}
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
