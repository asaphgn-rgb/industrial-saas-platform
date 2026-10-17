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
