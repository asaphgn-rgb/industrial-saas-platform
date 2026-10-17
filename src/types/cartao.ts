export interface CartaoItem {
  id: string;
  numero_mascarado: string;
  titular: string;
  cpf_mascarado: string;
  tipo: 'BENEFICIO' | 'CREDITO' | 'CONSIGNADO' | 'CORPORATIVO';
  status: 'ATIVO' | 'BLOQUEADO' | 'EM_ANALISE' | 'CANCELADO';
  limite_total: number;
  limite_disponivel: number;
  fatura_atual: number;
  vencimento: string;
  data_emissao: string;
  cashback_acumulado: number;
}

export interface TransacaoCartao {
  id: string;
  cartao_id: string;
  estabelecimento: string;
  categoria: 'ALIMENTACAO' | 'FARMACIA' | 'COMBUSTIVEL' | 'SERVICOS' | 'HABITACAO';
  valor: number;
  tipo: 'DEBITO' | 'CREDITO' | 'CASHBACK';
  data_hora: string;
  status: 'APROVADA' | 'RECUSADA' | 'ESTORNADA';
}

export interface EstabelecimentoParceiro {
  id: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj_mascarado: string;
  categoria: string;
  cidade: string;
  estado: string;
  desconto_cashback_pct: number;
  status: 'CONVENIADO' | 'PENDENTE' | 'SUSPENSO';
  volume_transacionado_mes: number;
}

export interface CartaoVirtualItem {
  id: string;
  apelido: string;
  numero_mascarado: string;
  cvv_dinamico: string;
  segundos_restantes_cvv: number;
  validade: string;
  limite_temporario: number;
  uso_unico: boolean;
  bloqueado: boolean;
}

export interface OpcaoParcelamentoFatura {
  parcelas: number;
  valor_parcela: number;
  valor_total: number;
  taxa_mensal_pct: number;
  cet_mensal_pct: number;
  cet_anual_pct: number;
  iof: number;
}

export interface ConciliacaoLojistaItem {
  id: string;
  periodo_referencia: string;
  vendas_brutas: number;
  mdr_descontado: number;
  cashback_retido: number;
  valor_liquido_repasse: number;
  data_repasse: string;
  status: 'LIQUIDADO' | 'PENDENTE_LIQUIDACAO' | 'PROCESSANDO';
  chave_pix_comprovante?: string;
}

export interface ResgateCashbackMoradia {
  id: string;
  associado_nome: string;
  contrato_numero: string;
  unidade_moradia: string;
  valor_resgatado: number;
  saldo_anterior: number;
  novo_saldo: number;
  data_operacao: string;
  status: 'CONCLUIDO' | 'PROCESSANDO';
}

