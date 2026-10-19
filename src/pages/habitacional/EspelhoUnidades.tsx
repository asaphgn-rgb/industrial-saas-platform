import { useState } from 'react';
import {
  Building2,
  Home,
  CheckCircle2,
  Clock,
  Lock,
  UserCheck,
  Search,
  Filter,
  Download,
  PlusCircle,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  FileCheck2,
  Sparkles,
  Sliders,
  AlertCircle,
  Hash
} from 'lucide-react';
import { UnidadeHabitacional, StatusAlocacaoUnidade, EmpreendimentoMatriz } from '@/types/enterprise-core';

export default function EspelhoUnidades() {
  const [blocoFiltro, setBlocoFiltro] = useState('TODOS');
  const [statusFiltro, setStatusFiltro] = useState<string>('TODOS');
  const [busca, setBusca] = useState('');
  const [unidadeModal, setUnidadeModal] = useState<UnidadeHabitacional | null>(null);

  // Empreendimento Ativo (SAP RE-FX Model)
  const empreendimentoAtivo: EmpreendimentoMatriz = {
    id: 'emp-001',
    nome_empreendimento: 'Residencial Diamante Sul — Loteamento & Edificações',
    codigo_referencia: 'MBB-DF-001',
    tipo_imovel: 'MISTO',
    registro_incorporacao: 'R.3/142.890 - 3º Ofício de Registro de Imóveis DF',
    cartorio_registro: '3º Ofício de Registro de Imóveis do DF',
    matricula_mae: '142.890',
    vgv_planejado: 48500000.00,
    area_total_terreno_m2: 125000.00,
    total_unidades: 180,
    status_obra: 'INFRAESTRUTURA',
    percentual_evolucao_obra: 38.5,
    endereco_completo: {
      logradouro: 'Setor Habitacional Tororó, Quadra 04',
      bairro: 'Tororó',
      cidade: 'Brasília',
      uf: 'DF',
      cep: '71699-000'
    },
    created_at: '2026-01-10',
    updated_at: '2026-10-19'
  };

  // Unidades Habitacionais Cadastradas na Matriz
  const [unidades, setUnidades] = useState<UnidadeHabitacional[]>([
    {
      id: 'und-101',
      empreendimento_id: 'emp-001',
      quadra_bloco: 'Quadra 01',
      unidade_numero: 'Lote 01',
      metragem_privativa_m2: 250.00,
      metragem_total_m2: 300.00,
      valor_tabela: 185000.00,
      valor_avaliacao_bancaria: 210000.00,
      status_alocacao: 'DISPONIVEL',
      observacoes: 'Lote plano de esquina, próximo à área verde de preservação.'
    },
    {
      id: 'und-102',
      empreendimento_id: 'emp-001',
      quadra_bloco: 'Quadra 01',
      unidade_numero: 'Lote 02',
      metragem_privativa_m2: 200.00,
      metragem_total_m2: 250.00,
      valor_tabela: 165000.00,
      valor_avaliacao_bancaria: 190000.00,
      status_alocacao: 'RESERVADO',
      associado_titular_id: 'ass-01',
      associado_nome: 'Marcos Vinícius Almeida Ramos',
      data_reserva: '14/10/2026',
      observacoes: 'Reserva validada por Alçada de Gestão Nível 1.'
    },
    {
      id: 'und-103',
      empreendimento_id: 'emp-001',
      quadra_bloco: 'Quadra 01',
      unidade_numero: 'Lote 03',
      metragem_privativa_m2: 200.00,
      metragem_total_m2: 250.00,
      valor_tabela: 165000.00,
      valor_avaliacao_bancaria: 190000.00,
      status_alocacao: 'EM_ANALISE_CREDITO',
      associado_titular_id: 'ass-02',
      associado_nome: 'Ana Cláudia Fontes Silveira',
      data_reserva: '15/10/2026',
      observacoes: 'Esteira de Underwriting SFH em análise de capacidade de pagamento.'
    },
    {
      id: 'und-104',
      empreendimento_id: 'emp-001',
      quadra_bloco: 'Quadra 01',
      unidade_numero: 'Lote 04',
      metragem_privativa_m2: 220.00,
      metragem_total_m2: 270.00,
      valor_tabela: 175000.00,
      valor_avaliacao_bancaria: 205000.00,
      status_alocacao: 'CONTRATADO',
      associado_titular_id: 'ass-03',
      associado_nome: 'Roberto Carlos Silveira Prado',
      data_contratacao: '10/10/2026',
      observacoes: 'Contrato com hash SHA-256 assinado eletronicamente via MP 2.200-2.'
    },
    {
      id: 'und-201',
      empreendimento_id: 'emp-001',
      quadra_bloco: 'Quadra 02',
      unidade_numero: 'Lote 01',
      metragem_privativa_m2: 200.00,
      metragem_total_m2: 250.00,
      valor_tabela: 168000.00,
      valor_avaliacao_bancaria: 195000.00,
      status_alocacao: 'TERMO_POSSE_EMITIDO',
      associado_titular_id: 'ass-04',
      associado_nome: 'Patrícia Mendes Castro',
      data_contratacao: '05/09/2026',
      termo_posse_hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      observacoes: 'Termo de Posse Provisória lavrado para início de edificação.'
    },
    {
      id: 'und-202',
      empreendimento_id: 'emp-001',
      quadra_bloco: 'Quadra 02',
      unidade_numero: 'Lote 02',
      metragem_privativa_m2: 200.00,
      metragem_total_m2: 250.00,
      valor_tabela: 168000.00,
      valor_avaliacao_bancaria: 195000.00,
      status_alocacao: 'ENTREGUE',
      associado_titular_id: 'ass-05',
      associado_nome: 'João Marcelo da Silva Pereira',
      data_entrega_chaves: '01/10/2026',
      observacoes: 'Habite-se emitido e matrícula individualizada registrada.'
    },
    {
      id: 'und-203',
      empreendimento_id: 'emp-001',
      quadra_bloco: 'Quadra 02',
      unidade_numero: 'Lote 03',
      metragem_privativa_m2: 200.00,
      metragem_total_m2: 250.00,
      valor_tabela: 168000.00,
      valor_avaliacao_bancaria: 195000.00,
      status_alocacao: 'DISPONIVEL',
      observacoes: 'Liberado para alocação via fila de pontuação social.'
    },
    {
      id: 'und-204',
      empreendimento_id: 'emp-001',
      quadra_bloco: 'Quadra 02',
      unidade_numero: 'Lote 04',
      metragem_privativa_m2: 210.00,
      metragem_total_m2: 260.00,
      valor_tabela: 172000.00,
      valor_avaliacao_bancaria: 200000.00,
      status_alocacao: 'DISPONIVEL',
      observacoes: 'Topografia favorável para construção imediata.'
    }
  ]);

  const statusCores: Record<StatusAlocacaoUnidade, { bg: string; text: string; borda: string; label: string; badge: string }> = {
    DISPONIVEL: { bg: 'bg-white', text: 'text-[#16382C]', borda: 'border-[#E2EBE5]', label: 'Disponível', badge: 'bg-[#E8F8EE] text-[#16382C]' },
    RESERVADO: { bg: 'bg-[#F4F7F5]', text: 'text-[#F59E0B]', borda: 'border-amber-200', label: 'Reservado', badge: 'bg-amber-50 text-amber-700' },
    EM_ANALISE_CREDITO: { bg: 'bg-[#F4F7F5]', text: 'text-blue-700', borda: 'border-blue-200', label: 'Em Análise de Crédito', badge: 'bg-blue-50 text-blue-700' },
    CONTRATADO: { bg: 'bg-[#F4F7F5]', text: 'text-[#16382C]', borda: 'border-[#16382C]', label: 'Contratado', badge: 'bg-[#16382C] text-white' },
    TERMO_POSSE_EMITIDO: { bg: 'bg-[#F4F7F5]', text: 'text-purple-700', borda: 'border-purple-200', label: 'Termo de Posse', badge: 'bg-purple-50 text-purple-700' },
    ENTREGUE: { bg: 'bg-[#EBF2EE]', text: 'text-[#526E62]', borda: 'border-[#CBD5E1]', label: 'Chaves Entregues', badge: 'bg-slate-200 text-slate-800' }
  };

  const unidadesFiltradas = unidades.filter(u => {
    const matchBloco = blocoFiltro === 'TODOS' || u.quadra_bloco === blocoFiltro;
    const matchStatus = statusFiltro === 'TODOS' || u.status_alocacao === statusFiltro;
    const matchBusca =
      u.unidade_numero.toLowerCase().includes(busca.toLowerCase()) ||
      u.quadra_bloco.toLowerCase().includes(busca.toLowerCase()) ||
      (u.associado_nome && u.associado_nome.toLowerCase().includes(busca.toLowerCase()));
    return matchBloco && matchStatus && matchBusca;
  });

  const totalDisponiveis = unidades.filter(u => u.status_alocacao === 'DISPONIVEL').length;
  const totalReservadas = unidades.filter(u => u.status_alocacao === 'RESERVADO' || u.status_alocacao === 'EM_ANALISE_CREDITO').length;
  const totalContratadas = unidades.filter(u => u.status_alocacao === 'CONTRATADO' || u.status_alocacao === 'TERMO_POSSE_EMITIDO' || u.status_alocacao === 'ENTREGUE').length;

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner de Governança Imobiliária SAP RE-FX */}
      <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
              Matriz Imobiliária · Padrão SAP RE-FX & TOTVS Obras
            </span>
            <span className="text-xs text-[#88A395] font-semibold font-mono">Reg. {empreendimentoAtivo.codigo_referencia}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#15241E] tracking-tight">
            Espelho de Lotes & Alocação de Unidades
          </h2>
          <p className="text-xs sm:text-sm text-[#526E62] mt-0.5">
            Gestão visual e rastreável de lotes urbanizados, reservas por alçada e termos de posse eletrônicos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Exportando Relatório de Matrículas e Ocupação em PDF/Excel')}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2EBE5] hover:bg-[#F4F7F5] text-[#16382C] text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#16382C]" /> Exportar Matriz
          </button>
          <button
            onClick={() => alert('Abrindo formulário de cadastro de novo Lote/Quadra na Matriz')}
            className="px-4 py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#C8F2D6]" /> Cadastrar Lote
          </button>
        </div>
      </div>

      {/* Grid de 4 Métricas de Estoque e VGV */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-3xl border border-[#E2EBE5] shadow-sm">
          <span className="text-[10px] font-bold text-[#88A395] uppercase tracking-wider block">VGV Planejado</span>
          <p className="text-3xl font-black text-[#15241E] mt-1">
            {empreendimentoAtivo.vgv_planejado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-[11px] text-[#526E62] font-semibold mt-0.5">180 Lotes Urbanizados</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E2EBE5] shadow-sm">
          <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider block">Disponíveis</span>
          <p className="text-3xl font-black text-[#10B981] mt-1">{totalDisponiveis}</p>
          <p className="text-[11px] text-[#526E62] font-semibold mt-0.5">Aptos para convocação da fila</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E2EBE5] shadow-sm">
          <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider block">Em Análise / Reserva</span>
          <p className="text-3xl font-black text-[#F59E0B] mt-1">{totalReservadas}</p>
          <p className="text-[11px] text-[#526E62] font-semibold mt-0.5">Alçada de risco pendente</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E2EBE5] shadow-sm">
          <span className="text-[10px] font-bold text-[#16382C] uppercase tracking-wider block">Contratados / Posse</span>
          <p className="text-3xl font-black text-[#16382C] mt-1">{totalContratadas}</p>
          <p className="text-[11px] text-[#526E62] font-semibold mt-0.5">Contratos formalizados MP 2200-2</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca Coinest Style */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2EBE5] shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#88A395]" />
          <input
            type="text"
            placeholder="Buscar por lote, quadra ou cooperado vinculado..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] focus:bg-white focus:border-[#16382C] outline-none transition-all text-[#15241E]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={blocoFiltro}
            onChange={e => setBlocoFiltro(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-[#15241E] outline-none"
          >
            <option value="TODOS">Todas as Quadras</option>
            <option value="Quadra 01">Quadra 01</option>
            <option value="Quadra 02">Quadra 02</option>
          </select>

          <select
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-[#15241E] outline-none"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="DISPONIVEL">Disponível</option>
            <option value="RESERVADO">Reservado</option>
            <option value="EM_ANALISE_CREDITO">Em Análise</option>
            <option value="CONTRATADO">Contratado</option>
            <option value="TERMO_POSSE_EMITIDO">Termo de Posse</option>
            <option value="ENTREGUE">Entregue</option>
          </select>
        </div>
      </div>

      {/* Grid Interativo de Lotes / Espelho de Vendas */}
      <div className="bg-white rounded-3xl border border-[#E2EBE5] p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2EBE5]/60 gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#16382C]" />
            <h3 className="font-black text-[#15241E] text-base">
              Mapeamento Físico de Ocupação da Gleba
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {Object.entries(statusCores).map(([st, c]) => (
              <span key={st} className="flex items-center gap-1.5 font-bold text-[#526E62]">
                <span className={`w-2.5 h-2.5 rounded-full border ${c.badge}`} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {unidadesFiltradas.map(unidade => {
            const estilo = statusCores[unidade.status_alocacao];
            return (
              <div
                key={unidade.id}
                onClick={() => setUnidadeModal(unidade)}
                className={`p-4 rounded-3xl border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between ${estilo.bg} ${estilo.borda}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#88A395] uppercase tracking-wider">{unidade.quadra_bloco}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${estilo.badge}`}>
                      {estilo.label}
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-[#15241E] mt-2">
                    {unidade.unidade_numero}
                  </h4>

                  <p className="text-xs text-[#526E62] mt-0.5">
                    {unidade.metragem_privativa_m2}m² privativos
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2EBE5]/70">
                  <p className="text-xs font-black text-[#15241E]">
                    {unidade.valor_tabela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  {unidade.associado_nome ? (
                    <p className="text-[11px] text-[#16382C] truncate mt-1 flex items-center gap-1 font-bold">
                      <UserCheck className="h-3 w-3 text-[#16382C] shrink-0" />
                      {unidade.associado_nome}
                    </p>
                  ) : (
                    <p className="text-[11px] text-[#10B981] font-bold mt-1">
                      ✓ Liberado para Alocação
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalhes da Unidade & Alçadas SAP */}
      {unidadeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-[#E2EBE5] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] flex items-center justify-center font-black">
                  L
                </div>
                <div>
                  <h3 className="text-base font-black text-[#15241E]">
                    {unidadeModal.unidade_numero} — {unidadeModal.quadra_bloco}
                  </h3>
                  <p className="text-xs text-[#88A395]">{empreendimentoAtivo.nome_empreendimento}</p>
                </div>
              </div>
              <button
                onClick={() => setUnidadeModal(null)}
                className="text-[#88A395] hover:text-[#15241E] text-sm font-bold p-1 rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#F4F7F5] rounded-2xl border border-[#E2EBE5]">
                <div>
                  <span className="text-[10px] text-[#88A395] block uppercase font-bold">Metragem Privativa</span>
                  <span className="font-black text-[#15241E] text-sm">{unidadeModal.metragem_privativa_m2} m²</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#88A395] block uppercase font-bold">Avaliação Bancária</span>
                  <span className="font-bold text-[#16382C] text-xs">
                    {(unidadeModal.valor_avaliacao_bancaria ?? unidadeModal.valor_tabela).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#88A395] block uppercase font-bold">Valor de Tabela</span>
                  <span className="font-black text-[#15241E] text-sm">
                    {unidadeModal.valor_tabela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#88A395] block uppercase font-bold">Status Atual</span>
                  <span className="font-bold text-xs text-[#16382C]">{statusCores[unidadeModal.status_alocacao].label}</span>
                </div>
              </div>

              {unidadeModal.associado_nome && (
                <div className="p-4 bg-[#E8F8EE] border border-[#C8F2D6] rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-[#16382C] tracking-wider block">Mutuário Vinculado:</span>
                  <p className="font-bold text-[#16382C] text-sm">{unidadeModal.associado_nome}</p>
                  {unidadeModal.termo_posse_hash && (
                    <div className="mt-2 pt-2 border-t border-[#C8F2D6]">
                      <span className="text-[10px] text-[#526E62] block font-mono">Hash SHA-256 do Termo de Posse:</span>
                      <span className="font-mono text-[10px] text-[#16382C] break-all">{unidadeModal.termo_posse_hash}</span>
                    </div>
                  )}
                </div>
              )}

              {unidadeModal.observacoes && (
                <p className="text-xs text-[#526E62] italic p-2 bg-[#F4F7F5] rounded-xl">
                  "{unidadeModal.observacoes}"
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2EBE5]/70">
              <button
                onClick={() => setUnidadeModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#526E62] hover:bg-[#F4F7F5]"
              >
                Fechar
              </button>
              {unidadeModal.status_alocacao === 'DISPONIVEL' && (
                <button
                  onClick={() => {
                    alert(`Unidade ${unidadeModal.unidade_numero} reservada e encaminhada para Alçada de Aprovação de Crédito!`);
                    setUnidadeModal(null);
                  }}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#16382C] hover:bg-[#112B22] text-white shadow-md"
                >
                  Reservar c/ Alçada de Risco
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
