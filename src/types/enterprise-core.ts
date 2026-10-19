// ============================================================================
// TIPOS ENTERPRISE: CORE CONTÁBIL (DOUBLE-ENTRY), MATRIZES E ALÇADAS (SAP/TOTVS)
// ============================================================================

export type TipoContaContabil = 'ATIVO' | 'PASSIVO' | 'PATRIMONIO_LIQUIDO' | 'RECEITA' | 'DESPESA';
export type NaturezaContaContabil = 'DEVEDORA' | 'CREDORA';
export type TipoMovimentoContabil = 'D' | 'C';

export interface ContaPlanoContabil {
  id: string;
  codigo_estruturado: string; // Ex: '1.1.01.001'
  nome: string;
  tipo: TipoContaContabil;
  natureza: NaturezaContaContabil;
  tenant_tipo: 'GLOBAL' | 'FEDERACAO' | 'ASSOCIACAO';
  tenant_id?: string | null;
  nivel_hierarquico: number;
  permite_lancamento: boolean;
  descricao?: string;
  created_at: string;
}

export interface LancamentoLivroRazao {
  id: string;
  transacao_id: string;
  origem_operacao: 'AMORTIZACAO_HABITACIONAL' | 'MDR_LOJISTA' | 'CASHBACK' | 'RATEIO_OBRA' | 'TAXA_ASSOCIATIVA';
  conta_id: string;
  conta_codigo?: string;
  conta_nome?: string;
  tipo_movimento: TipoMovimentoContabil;
  valor: number;
  moeda: string;
  historico: string;
  documento_referencia?: string;
  data_competencia: string;
  hash_anterior?: string;
  hash_atual: string;
  criado_por?: string;
  created_at: string;
}

export type StatusObra = 'PLANEJAMENTO' | 'LICENCIAMENTO' | 'INFRAESTRUTURA' | 'OBRAS_INICIADAS' | 'FASE_FINAL' | 'ENTREGUE';
export type TipoImovel = 'LOTEAMENTO' | 'VERTICAL_APARTAMENTOS' | 'CASAS_SOBRADOS' | 'MISTO';

export interface EmpreendimentoMatriz {
  id: string;
  federacao_id?: string | null;
  associacao_id?: string | null;
  nome_empreendimento: string;
  codigo_referencia: string;
  tipo_imovel: TipoImovel;
  registro_incorporacao?: string;
  cartorio_registro?: string;
  matricula_mae?: string;
  vgv_planejado: number;
  area_total_terreno_m2?: number;
  total_unidades: number;
  status_obra: StatusObra;
  percentual_evolucao_obra: number;
  endereco_completo?: {
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
  };
  created_at: string;
  updated_at: string;
}

export type StatusAlocacaoUnidade = 'DISPONIVEL' | 'RESERVADO' | 'EM_ANALISE_CREDITO' | 'CONTRATADO' | 'TERMO_POSSE_EMITIDO' | 'ENTREGUE';

export interface UnidadeHabitacional {
  id: string;
  empreendimento_id: string;
  quadra_bloco: string;
  unidade_numero: string;
  metragem_privativa_m2: number;
  metragem_total_m2?: number;
  valor_tabela: number;
  valor_avaliacao_bancaria?: number;
  status_alocacao: StatusAlocacaoUnidade;
  associado_titular_id?: string | null;
  associado_nome?: string;
  data_reserva?: string;
  data_contratacao?: string;
  data_entrega_chaves?: string;
  termo_posse_hash?: string;
  observacoes?: string;
}

export type StatusDecisaoAlcada = 'PENDENTE' | 'APROVADO' | 'REPROVADO' | 'CONDICIONADO';
export type PapelAlcadaObrigatorio = 'ASSOCIACAO' | 'FEDERACAO' | 'ADMIN_GLOBAL';

export interface AlcadaAprovacaoWorkflow {
  id: string;
  tipo_solicitacao: 'APROVACAO_CREDITO' | 'RESERVA_UNIDADE' | 'CESSAO_DIREITOS' | 'REAJUSTE_CONTRATUAL';
  entidade_referencia: string;
  registro_id: string;
  nivel_alcada: number;
  papel_obrigatorio: PapelAlcadaObrigatorio;
  status_decisao: StatusDecisaoAlcada;
  parecer_tecnico?: string;
  aprovado_por?: string;
  aprovador_nome?: string;
  data_decisao?: string;
  created_at: string;
}

export interface TrilhaAuditoriaMerkle {
  id: string;
  tabela_afetada: string;
  operacao: 'INSERT' | 'UPDATE' | 'DELETE' | 'ACCESS' | 'EXPORT';
  registro_id?: string;
  usuario_id?: string;
  ip_origem: string;
  user_agent?: string;
  payload_anterior?: Record<string, unknown>;
  payload_novo?: Record<string, unknown>;
  hash_anterior?: string;
  hash_atual: string;
  created_at: string;
}
