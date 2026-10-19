// ============================================================================
// TIPOS DO ECOSSISTEMA: ADESÃO R$ 50, CASHBACK, RADAR DE MATCHING,
// CONTA DIGITAL, CO-BRANDED WHITE LABEL & SPLIT DE BONIFICAÇÃO
// ============================================================================

export interface AdesaoOnboardingCashback {
  id: string;
  associado_id: string;
  associado_nome?: string;
  associacao_id?: string;
  federacao_id?: string;
  valor_taxa: number; // R$ 50,00
  status_pagamento: 'PENDENTE' | 'PAGO' | 'ESTORNADO';
  forma_pagamento: 'PIX' | 'CARTAO_CREDITO' | 'BOLETO';
  txid_pix?: string;
  data_pagamento?: string;
  cashback_gerado_valor: number; // R$ 50,00
  cashback_creditado: boolean;
  pre_analise_status: 'EM_ANALISE' | 'APROVADO_CONSULTIVO' | 'PENDENCIA_DOCUMENTAL';
  capacidade_financiamento_estimada?: number;
  created_at: string;
}

export type TipoImovelDesejado = 'LOTE' | 'APARTAMENTO' | 'CASA' | 'INDIFERENTE';
export type StatusMatchingImovel = 'BUSCANDO' | 'OPORTUNIDADE_ENCONTRADA' | 'EM_CONTRATACAO' | 'CONCLUIDO';

export interface ImovelDesejadoAssociado {
  id: string;
  associado_id: string;
  tipo_imovel: TipoImovelDesejado;
  regioes_bairros_interesse: string[];
  cidade_uf: string;
  valor_maximo_pretendido: number;
  valor_entrada_disponivel: number;
  possui_fgts: boolean;
  valor_fgts_estimado: number;
  quartos_minimos: number;
  vagas_garagem_minimas: number;
  status_matching: StatusMatchingImovel;
  unidade_matriz_combinada_id?: string;
  created_at: string;
}

export interface ContaDigitalDiamond {
  id: string;
  associado_id: string;
  numero_conta: string;
  agencia: string;
  banco_parceiro_codigo: string;
  banco_parceiro_nome: string;
  saldo_cashback: number;
  saldo_disponivel: number;
  status_conta: 'ATIVA' | 'BLOQUEADA' | 'SUSPENSA';
  chave_pix_padrao?: string;
  limite_diario_compras: number;
  created_at: string;
}

export interface CartaoDigitalBeneficios {
  id: string;
  conta_id: string;
  associado_id: string;
  nome_titular_impresso: string;
  mascara_cartao: string;
  token_pci: string;
  cvv_dinamico: string;
  cvv_expira_em: string;
  validade_mes_ano: string;
  status_cartao: 'ATIVO' | 'PAUSADO' | 'CANCELADO';
  tipo_emissao: 'DIGITAL_APP_ONLY';
  desconto_conveniados_ativo: boolean;
  created_at: string;
}

export interface EmpresaParceiraWhitelabel {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  slug_personalizado: string;
  segmento_atuacao: string;
  logo_marca_url?: string;
  cor_primaria_hex: string;
  cor_secundaria_hex: string;
  tipo_convenio: string;
  desconto_oferecido_pct: number;
  taxa_cashback_associado_pct: number;
  taxa_mdr_repasse_pct: number;
  status_parceria: 'ATIVO' | 'HOMOLOGACAO' | 'SUSPENSO';
  cartoes_emitidos_count: number;
  created_at: string;
}

export interface RegraSplitBonificacao {
  id: string;
  origem_evento: 'TAXA_ADESAO_50' | 'CONSUMO_REDE_LOJISTA' | 'PARCELA_HABITACIONAL';
  percentual_associacao: number;
  percentual_federacao: number;
  percentual_plataforma: number;
  ativo: boolean;
}

export interface ExtratoRepasseRede {
  id: string;
  origem_evento: string;
  referencia_id?: string;
  entidade_tipo: 'FEDERACAO' | 'ASSOCIACAO';
  entidade_id: string;
  entidade_nome: string;
  associado_origem_nome?: string;
  valor_base: number;
  percentual_aplicado: number;
  valor_bonificacao: number;
  status_repasse: 'PROGRAMADO' | 'DISPONIVEL' | 'LIQUIDADO_PIX';
  data_liquidacao?: string;
  comprovante_pix?: string;
  created_at: string;
}
