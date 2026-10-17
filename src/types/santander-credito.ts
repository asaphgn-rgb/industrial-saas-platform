export type SistemaAmortizacao = 'SAC' | 'PRICE';
export type TipoTaxaImobiliaria = 'POS_FIXADA_TR' | 'IPCA' | 'PREFIXADA';
export type FaixaMCMV = 'FAIXA_1' | 'FAIXA_2' | 'FAIXA_3' | 'SBPE';

export interface ParametrosSimulacaoSantander {
  valor_imovel: number;
  valor_entrada: number;
  prazo_meses: number; // Ex: 360 ou 420
  renda_bruta_familiar: number;
  data_nascimento_proponente: string;
  possui_dependentes: boolean;
  tempo_fgts_anos: number;
  utilizar_fgts: boolean;
  saldo_fgts_disponivel: number;
  sistema_amortizacao: SistemaAmortizacao;
  tipo_taxa: TipoTaxaImobiliaria;
}

export interface DetalheParcela {
  numero: number;
  prestacao: number;
  amortizacao: number;
  juros: number;
  seguro_mip: number; // Morte e Invalidez Permanente
  seguro_dfi: number; // Danos Físicos ao Imóvel
  taxa_administracao: number;
  saldo_devedor: number;
}

export interface ResultadoSimulacaoSantander {
  valor_imovel: number;
  valor_financiado: number;
  valor_entrada: number;
  percentual_financiado: number;
  prazo_meses: number;
  sistema_amortizacao: SistemaAmortizacao;
  taxa_juros_nominal_aa: number;
  taxa_juros_efetiva_aa: number;
  cet_aa: number; // Custo Efetivo Total anual (Bacen)
  cet_am: number;
  primeira_parcela: number;
  ultima_parcela: number;
  renda_minima_exigida: number;
  comprometimento_renda_pct: number;
  subsidio_estimado: number;
  faixa_programa: FaixaMCMV;
  tabela_evolucao_resumida: DetalheParcela[];
  documentos_obrigatorios: string[];
}
