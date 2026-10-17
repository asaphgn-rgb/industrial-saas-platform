export type StatusUnidade = 'DISPONIVEL' | 'RESERVADA' | 'EM_ANALISE_CREDITO' | 'CONTRATADA' | 'ENTREGUE';

export interface UnidadeHabitacional {
  id: string;
  produto_id: string;
  empreendimento_nome: string;
  bloco_quadra: string;
  numero_unidade: string;
  andar: number;
  metragem_m2: number;
  quartos: number;
  vagas: number;
  valor_unidade: number;
  status: StatusUnidade;
  associado_vinculado_nome?: string;
  associado_vinculado_cpf?: string;
  reservado_em?: string;
}

export type StatusFilaSocial = 'HABILITADO' | 'CONVOCADO' | 'EM_DOCUMENTACAO' | 'DESISTENTE' | 'CONTEMPLADO';

export interface ItemFilaSocial {
  id: string;
  associado_id: string;
  nome_associado: string;
  cpf_mascarado: string;
  associacao_nome: string;
  pontuacao_total: number;
  posicao_geral: number;
  renda_per_capita: number;
  tempo_associacao_meses: number;
  numero_dependentes: number;
  possui_pcd: boolean;
  mulher_chefe_familia: boolean;
  idoso_na_familia: boolean;
  status: StatusFilaSocial;
  data_inscricao: string;
  data_ultima_convocacao?: string;
}

export type StatusContratoDigital = 'RASCUNHO' | 'AGUARDANDO_ASSINATURAS' | 'ASSINADO' | 'REGISTRADO_CARTORIO' | 'CANCELADO';

export interface ContratoDigital {
  id: string;
  titulo: string;
  tipo_contrato: 'ADESAO_ASSOCIATIVA' | 'PROMESSA_COMPRA_VENDA' | 'COTA_PARTE' | 'TERMO_HABITACIONAL';
  associado_nome: string;
  associado_cpf_mascarado: string;
  unidade_identificacao?: string;
  valor_contrato: number;
  status: StatusContratoDigital;
  hash_sha256?: string;
  assinado_associado_em?: string;
  ip_assinatura?: string;
  assinado_diretoria_em?: string;
  criado_em: string;
}
