// Schemas dos módulos suportados pela Integração de Dados.
// Compartilhado entre cliente (parser/template/PDF-IA) e server functions (validação/commit).

export type ModuloIntegracao =
  // Cadastros gerais
  | "clientes"
  | "fornecedores"
  | "produtos"
  | "materias_primas"
  | "unidades_medida"
  | "depositos"
  | "centros_custo"
  // Industrial
  | "maquinas"
  | "instrumentos_metrologia"
  // Pessoas
  | "colaboradores"
  | "cargos"
  // Financeiro / contábil
  | "contas_contabeis"
  | "contas_pagar"
  | "contas_receber"
  // Comercial
  | "metas_vendas"
  // ───── Histórico de lançamentos já realizados ─────
  | "hist_pedidos_venda"
  | "hist_notas_fiscais"
  | "hist_ordens_producao"
  | "hist_apontamentos"
  | "hist_lotes"
  | "hist_movimentacoes_estoque"
  | "hist_pedidos_compra"
  | "hist_recebimentos"
  | "hist_inspecoes"
  | "hist_nao_conformidades"
  | "hist_ordens_manutencao"
  | "hist_paradas_maquina"
  | "hist_baixas_pagar"
  | "hist_baixas_receber"
  | "hist_crm_leads";

export type CategoriaIntegracao =
  | "Cadastros gerais"
  | "Industrial"
  | "Pessoas"
  | "Financeiro"
  | "Comercial"
  | "Histórico de lançamentos";

export interface CampoSchema {
  nome: string; // nome interno = coluna do banco (ou coluna "de busca" quando há referencia)
  label: string; // cabeçalho na planilha (o parser aceita label OU nome)
  obrigatorio?: boolean;
  tipo: "text" | "number" | "boolean" | "enum" | "date" | "datetime" | "integer";
  enumValores?: string[];
  descricao?: string;
  exemplo?: string | number;
  /**
   * Campo de referência: o usuário informa um código legível (ex.: código do
   * cliente) e o sistema resolve automaticamente o UUID no momento do commit.
   */
  referencia?: {
    tabela: string;
    /** coluna consultada na tabela de destino da busca (ex.: "codigo") */
    buscaPor: string;
    /** coluna final gravada no registro (ex.: "cliente_id") */
    grava: string;
  };
}

export interface ModuloSchema {
  id: ModuloIntegracao;
  titulo: string;
  descricao: string;
  categoria: CategoriaIntegracao;
  /** Ordem recomendada de implantação (1 = primeiro). */
  ordem: number;
  tabelaDestino: string;
  chaveUnica: string;
  /** Tabelas que não possuem a coluna created_by. */
  semCreatedBy?: boolean;
  /** Dicas específicas exibidas no Ponto de Apoio e na aba Instruções. */
  dicas?: string[];
  campos: CampoSchema[];
}


const PESSOA_CAMPOS = (prefixo: string): CampoSchema[] => [
  { nome: "codigo", label: "Código", obrigatorio: true, tipo: "text", exemplo: `${prefixo}-0001` },
  {
    nome: "tipo_pessoa",
    label: "Tipo Pessoa",
    obrigatorio: true,
    tipo: "enum",
    enumValores: ["PF", "PJ"],
    exemplo: "PJ",
  },
  {
    nome: "razao_social",
    label: "Razão Social / Nome",
    obrigatorio: true,
    tipo: "text",
    exemplo: "Indústria Exemplo Ltda",
  },
  { nome: "nome_fantasia", label: "Nome Fantasia", tipo: "text", exemplo: "Exemplo" },
  { nome: "cnpj_cpf", label: "CNPJ/CPF", tipo: "text", exemplo: "12.345.678/0001-90" },
  { nome: "inscricao_estadual", label: "Inscrição Estadual", tipo: "text" },
  { nome: "email", label: "Email", tipo: "text", exemplo: "contato@exemplo.com" },
  { nome: "telefone", label: "Telefone", tipo: "text", exemplo: "(11) 99999-9999" },
  { nome: "endereco", label: "Endereço", tipo: "text" },
  { nome: "bairro", label: "Bairro", tipo: "text" },
  { nome: "cidade", label: "Cidade", tipo: "text", exemplo: "São Paulo" },
  { nome: "estado", label: "UF", tipo: "text", exemplo: "SP" },
  { nome: "cep", label: "CEP", tipo: "text", exemplo: "01310-000" },
  { nome: "observacoes", label: "Observações", tipo: "text" },
];

export const MODULOS: Record<ModuloIntegracao, ModuloSchema> = {
  // ───────────── Cadastros gerais ─────────────
  unidades_medida: {
    id: "unidades_medida",
    titulo: "Unidades de medida",
    descricao: "KG, MIL, UN, M, BOB — base para estoque, fichas técnicas e pedidos.",
    categoria: "Cadastros gerais",
    ordem: 1,
    tabelaDestino: "unidades_medida",
    chaveUnica: "sigla",
    dicas: ["Importe antes de produtos e matérias-primas — todos os itens referenciam a unidade."],
    campos: [
      { nome: "sigla", label: "Sigla", obrigatorio: true, tipo: "text", exemplo: "KG" },
      {
        nome: "descricao",
        label: "Descrição",
        obrigatorio: true,
        tipo: "text",
        exemplo: "Quilograma",
      },
      {
        nome: "tipo",
        label: "Tipo",
        tipo: "enum",
        enumValores: ["PESO", "QUANTIDADE", "COMPRIMENTO", "AREA", "VOLUME", "TEMPO"],
        exemplo: "PESO",
      },
    ],
  },
  centros_custo: {
    id: "centros_custo",
    titulo: "Centros de custo",
    descricao: "Estrutura de rateio: extrusão, impressão, corte-solda, administrativo.",
    categoria: "Cadastros gerais",
    ordem: 2,
    tabelaDestino: "centros_custo",
    chaveUnica: "codigo",
    campos: [
      { nome: "codigo", label: "Código", obrigatorio: true, tipo: "text", exemplo: "CC-EXT" },
      {
        nome: "descricao",
        label: "Descrição",
        obrigatorio: true,
        tipo: "text",
        exemplo: "Extrusão",
      },
      {
        nome: "tipo",
        label: "Tipo",
        tipo: "enum",
        enumValores: ["operacional", "administrativo", "comercial", "apoio"],
        exemplo: "operacional",
      },
      { nome: "responsavel", label: "Responsável", tipo: "text" },
    ],
  },
  depositos: {
    id: "depositos",
    titulo: "Depósitos / almoxarifados",
    descricao: "Locais físicos de estoque: resinas, produto acabado, expedição.",
    categoria: "Cadastros gerais",
    ordem: 3,
    tabelaDestino: "depositos",
    chaveUnica: "codigo",
    campos: [
      { nome: "codigo", label: "Código", obrigatorio: true, tipo: "text", exemplo: "DEP-01" },
      {
        nome: "descricao",
        label: "Descrição",
        obrigatorio: true,
        tipo: "text",
        exemplo: "Almoxarifado de resinas",
      },
      {
        nome: "tipo",
        label: "Tipo",
        tipo: "enum",
        enumValores: ["materia_prima", "produto_acabado", "misto", "expedicao", "quarentena"],
        exemplo: "materia_prima",
      },
      { nome: "endereco", label: "Endereço / Localização", tipo: "text" },
      { nome: "responsavel", label: "Responsável", tipo: "text" },
    ],
  },
  clientes: {
    id: "clientes",
    titulo: "Clientes",
    descricao: "Cadastro de clientes com dados fiscais e de contato.",
    categoria: "Cadastros gerais",
    ordem: 4,
    tabelaDestino: "clientes",
    chaveUnica: "codigo",
    campos: PESSOA_CAMPOS("CLI"),
  },
  fornecedores: {
    id: "fornecedores",
    titulo: "Fornecedores",
    descricao: "Fornecedores de resinas, masterbatch, tintas, insumos e serviços.",
    categoria: "Cadastros gerais",
    ordem: 5,
    tabelaDestino: "fornecedores",
    chaveUnica: "codigo",
    campos: PESSOA_CAMPOS("FOR"),
  },
  materias_primas: {
    id: "materias_primas",
    titulo: "Matérias-primas",
    descricao: "Resinas (PEBD, PEAD, PP), masterbatch, pigmentos, aditivos e tintas.",
    categoria: "Cadastros gerais",
    ordem: 6,
    tabelaDestino: "materias_primas",
    chaveUnica: "codigo",
    dicas: ["Densidade em g/cm³ (ex.: PEBD 0,923). Use ponto ou vírgula decimal — ambos aceitos."],
    campos: [
      { nome: "codigo", label: "Código", obrigatorio: true, tipo: "text", exemplo: "MP-0001" },
      {
        nome: "descricao",
        label: "Descrição",
        obrigatorio: true,
        tipo: "text",
        exemplo: "Resina PEBD EVA 0,923",
      },
      { nome: "categoria", label: "Categoria", obrigatorio: true, tipo: "text", exemplo: "Resina" },
      { nome: "ncm", label: "NCM", tipo: "text", exemplo: "3901.10.10" },
      { nome: "cor", label: "Cor", tipo: "text", exemplo: "Natural" },
      { nome: "densidade", label: "Densidade (g/cm³)", tipo: "number", exemplo: 0.923 },
      { nome: "indice_fluidez", label: "Índice de Fluidez (g/10min)", tipo: "number", exemplo: 2.5 },
      { nome: "estoque_minimo", label: "Estoque Mínimo", tipo: "number", exemplo: 500 },
      { nome: "custo_medio", label: "Custo Médio (R$)", tipo: "number", exemplo: 8.5 },
    ],
  },
  produtos: {
    id: "produtos",
    titulo: "Produtos",
    descricao: "Filmes, sacos, sacolas, bobinas — acabados, semi-acabados e serviços.",
    categoria: "Cadastros gerais",
    ordem: 7,
    tabelaDestino: "produtos",
    chaveUnica: "codigo",
    dicas: [
      "Medidas sempre em mm (largura/comprimento/sanfona) e espessura em micra (µm).",
      "Tipo aceito: acabado, semi_acabado ou servico.",
    ],
    campos: [
      { nome: "codigo", label: "Código", obrigatorio: true, tipo: "text", exemplo: "PROD-0001" },
      {
        nome: "descricao",
        label: "Descrição",
        obrigatorio: true,
        tipo: "text",
        exemplo: "Saco plástico transparente 30x40",
      },
      {
        nome: "tipo",
        label: "Tipo",
        obrigatorio: true,
        tipo: "enum",
        enumValores: ["ACABADO", "SEMI_ACABADO", "SERVICO"],
        exemplo: "ACABADO",
      },
      { nome: "ncm", label: "NCM", tipo: "text", exemplo: "3923.21.90" },
      { nome: "largura_mm", label: "Largura (mm)", tipo: "number", exemplo: 300 },
      { nome: "comprimento_mm", label: "Comprimento (mm)", tipo: "number", exemplo: 400 },
      { nome: "espessura_um", label: "Espessura (µm)", tipo: "number", exemplo: 25 },
      { nome: "sanfona_mm", label: "Sanfona (mm)", tipo: "number" },
      { nome: "cor", label: "Cor", tipo: "text", exemplo: "Transparente" },
      { nome: "peso_milheiro_kg", label: "Peso por milheiro (kg)", tipo: "number", exemplo: 6.2 },
      { nome: "preco_venda", label: "Preço Venda (R$)", tipo: "number", exemplo: 14.9 },
      { nome: "custo_padrao", label: "Custo Padrão (R$)", tipo: "number", exemplo: 9.4 },
    ],
  },

  // ───────────── Industrial ─────────────
  maquinas: {
    id: "maquinas",
    titulo: "Máquinas / recursos",
    descricao: "Extrusoras, impressoras flexo, corte-solda, recuperadoras.",
    categoria: "Industrial",
    ordem: 8,
    tabelaDestino: "maquinas",
    chaveUnica: "codigo",
    dicas: ["Capacidade em kg/h é usada nos cálculos de OEE e apontamento de produção."],
    campos: [
      { nome: "codigo", label: "Código", obrigatorio: true, tipo: "text", exemplo: "EXT-01" },
      { nome: "nome", label: "Nome", obrigatorio: true, tipo: "text", exemplo: "Extrusora 01" },
      {
        nome: "tipo",
        label: "Tipo",
        tipo: "enum",
        enumValores: ["EXTRUSAO", "IMPRESSAO", "CORTE_SOLDA", "RECICLAGEM", "REBOBINAMENTO"],
        exemplo: "EXTRUSAO",
      },
      { nome: "fabricante", label: "Fabricante", tipo: "text" },
      { nome: "modelo", label: "Modelo", tipo: "text" },
      { nome: "numero_serie", label: "Nº de série", tipo: "text" },
      { nome: "ano_fabricacao", label: "Ano de fabricação", tipo: "integer", exemplo: 2019 },
      { nome: "capacidade_kg_h", label: "Capacidade (kg/h)", tipo: "number", exemplo: 120 },
      { nome: "potencia_kw", label: "Potência (kW)", tipo: "number", exemplo: 75 },
      { nome: "custo_hora", label: "Custo hora (R$)", tipo: "number", exemplo: 180 },
    ],
  },
  instrumentos_metrologia: {
    id: "instrumentos_metrologia",
    titulo: "Instrumentos de medição",
    descricao: "Micrômetros, balanças, paquímetros — base do plano de calibração.",
    categoria: "Industrial",
    ordem: 9,
    tabelaDestino: "instrumentos_metrologia",
    chaveUnica: "tag",
    semCreatedBy: true,
    dicas: ["Datas no formato AAAA-MM-DD ou DD/MM/AAAA."],
    campos: [
      { nome: "tag", label: "TAG", obrigatorio: true, tipo: "text", exemplo: "MIC-001" },
      {
        nome: "descricao",
        label: "Descrição",
        obrigatorio: true,
        tipo: "text",
        exemplo: "Micrômetro digital 0-25mm",
      },
      { nome: "fabricante", label: "Fabricante", tipo: "text", exemplo: "Mitutoyo" },
      { nome: "modelo", label: "Modelo", tipo: "text" },
      { nome: "numero_serie", label: "Nº de série", tipo: "text" },
      { nome: "faixa_min", label: "Faixa mínima", tipo: "number", exemplo: 0 },
      { nome: "faixa_max", label: "Faixa máxima", tipo: "number", exemplo: 25 },
      { nome: "resolucao", label: "Resolução", tipo: "number", exemplo: 0.001 },
      { nome: "unidade", label: "Unidade", tipo: "text", exemplo: "mm" },
      { nome: "localizacao", label: "Localização", tipo: "text", exemplo: "Laboratório" },
      {
        nome: "criticidade",
        label: "Criticidade",
        tipo: "enum",
        enumValores: ["baixa", "media", "alta"],
        exemplo: "alta",
      },
      {
        nome: "periodicidade_meses",
        label: "Periodicidade (meses)",
        tipo: "integer",
        exemplo: 12,
      },
      { nome: "proxima_calibracao", label: "Próxima calibração", tipo: "date" },
    ],
  },

  // ───────────── Pessoas ─────────────
  cargos: {
    id: "cargos",
    titulo: "Cargos",
    descricao: "Estrutura de cargos e faixas salariais.",
    categoria: "Pessoas",
    ordem: 10,
    tabelaDestino: "cargos",
    chaveUnica: "codigo",
    campos: [
      { nome: "codigo", label: "Código", obrigatorio: true, tipo: "text", exemplo: "CAR-001" },
      {
        nome: "titulo",
        label: "Título",
        obrigatorio: true,
        tipo: "text",
        exemplo: "Operador de Extrusora",
      },
      { nome: "familia", label: "Família", tipo: "text", exemplo: "Produção" },
      { nome: "nivel", label: "Nível", tipo: "text", exemplo: "Pleno" },
      { nome: "descricao", label: "Descrição", tipo: "text" },
      { nome: "salario_minimo", label: "Salário mínimo (R$)", tipo: "number", exemplo: 2200 },
      { nome: "salario_medio", label: "Salário médio (R$)", tipo: "number", exemplo: 2800 },
      { nome: "salario_maximo", label: "Salário máximo (R$)", tipo: "number", exemplo: 3400 },
    ],
  },
  colaboradores: {
    id: "colaboradores",
    titulo: "Colaboradores",
    descricao: "Quadro de pessoal: matrícula, cargo, setor, turno e admissão.",
    categoria: "Pessoas",
    ordem: 11,
    tabelaDestino: "colaboradores",
    chaveUnica: "matricula",
    dicas: ["CPF é dado sensível — armazenado com acesso restrito por papel (RH/gestor)."],
    campos: [
      { nome: "matricula", label: "Matrícula", obrigatorio: true, tipo: "text", exemplo: "0001" },
      { nome: "nome", label: "Nome", obrigatorio: true, tipo: "text", exemplo: "João da Silva" },
      { nome: "cpf", label: "CPF", tipo: "text" },
      { nome: "email", label: "Email", tipo: "text" },
      { nome: "telefone", label: "Telefone", tipo: "text" },
      { nome: "cargo", label: "Cargo", tipo: "text", exemplo: "Operador de Extrusora" },
      { nome: "setor", label: "Setor", tipo: "text", exemplo: "Extrusão" },
      {
        nome: "turno",
        label: "Turno",
        tipo: "enum",
        enumValores: ["A", "B", "C", "ADM"],
        exemplo: "A",
      },
      { nome: "data_admissao", label: "Data de admissão", tipo: "date", exemplo: "2023-03-15" },
    ],
  },

  // ───────────── Financeiro ─────────────
  contas_contabeis: {
    id: "contas_contabeis",
    titulo: "Plano de contas",
    descricao: "Estrutura contábil para DRE, lançamentos e apurações.",
    categoria: "Financeiro",
    ordem: 12,
    tabelaDestino: "contas_contabeis",
    chaveUnica: "codigo",
    dicas: ["Importe do nível 1 ao nível N; a hierarquia por código (1.1.01) é preservada."],
    campos: [
      { nome: "codigo", label: "Código", obrigatorio: true, tipo: "text", exemplo: "3.1.01" },
      {
        nome: "nome",
        label: "Nome da conta",
        obrigatorio: true,
        tipo: "text",
        exemplo: "Receita de vendas",
      },
      {
        nome: "tipo",
        label: "Tipo",
        obrigatorio: true,
        tipo: "enum",
        enumValores: ["ativo", "passivo", "patrimonio", "receita", "despesa", "custo"],
        exemplo: "receita",
      },
      {
        nome: "natureza",
        label: "Natureza",
        obrigatorio: true,
        tipo: "enum",
        enumValores: ["devedora", "credora"],
        exemplo: "credora",
      },
      { nome: "nivel", label: "Nível", tipo: "integer", exemplo: 3 },
    ],
  },
  contas_pagar: {
    id: "contas_pagar",
    titulo: "Contas a pagar (saldo inicial)",
    descricao: "Títulos em aberto no momento da virada para o FLUX.",
    categoria: "Financeiro",
    ordem: 13,
    tabelaDestino: "contas_pagar",
    chaveUnica: "numero",
    dicas: [
      "Importe apenas títulos EM ABERTO na data de corte da implantação.",
      "Valores em reais, sem símbolo (ex.: 1250.90 ou 1.250,90).",
    ],
    campos: [
      { nome: "numero", label: "Número do título", obrigatorio: true, tipo: "text", exemplo: "NF-1234/1" },
      { nome: "descricao", label: "Descrição", tipo: "text", exemplo: "Compra de resina PEBD" },
      { nome: "categoria", label: "Categoria", tipo: "text", exemplo: "Matéria-prima" },
      { nome: "data_emissao", label: "Data de emissão", tipo: "date", exemplo: "2026-01-10" },
      {
        nome: "data_vencimento",
        label: "Data de vencimento",
        obrigatorio: true,
        tipo: "date",
        exemplo: "2026-02-10",
      },
      {
        nome: "valor_original",
        label: "Valor original (R$)",
        obrigatorio: true,
        tipo: "number",
        exemplo: 12500,
      },
      { nome: "valor_pago", label: "Valor já pago (R$)", tipo: "number", exemplo: 0 },
      { nome: "forma_pagamento", label: "Forma de pagamento", tipo: "text", exemplo: "Boleto" },
      { nome: "conta_bancaria", label: "Conta bancária", tipo: "text" },
    ],
  },
  contas_receber: {
    id: "contas_receber",
    titulo: "Contas a receber (saldo inicial)",
    descricao: "Duplicatas em aberto na virada para o FLUX.",
    categoria: "Financeiro",
    ordem: 14,
    tabelaDestino: "contas_receber",
    chaveUnica: "numero",
    dicas: ["Importe apenas duplicatas EM ABERTO na data de corte."],
    campos: [
      { nome: "numero", label: "Número do título", obrigatorio: true, tipo: "text", exemplo: "DUP-889/2" },
      { nome: "descricao", label: "Descrição", tipo: "text", exemplo: "Venda de sacos 30x40" },
      { nome: "categoria", label: "Categoria", tipo: "text", exemplo: "Vendas" },
      { nome: "data_emissao", label: "Data de emissão", tipo: "date", exemplo: "2026-01-05" },
      {
        nome: "data_vencimento",
        label: "Data de vencimento",
        obrigatorio: true,
        tipo: "date",
        exemplo: "2026-02-05",
      },
      {
        nome: "valor_original",
        label: "Valor original (R$)",
        obrigatorio: true,
        tipo: "number",
        exemplo: 8400,
      },
      { nome: "valor_pago", label: "Valor já recebido (R$)", tipo: "number", exemplo: 0 },
      { nome: "forma_recebimento", label: "Forma de recebimento", tipo: "text", exemplo: "Boleto" },
      { nome: "conta_bancaria", label: "Conta bancária", tipo: "text" },
    ],
  },

  // ───────────── Comercial ─────────────
  metas_vendas: {
    id: "metas_vendas",
    titulo: "Metas de vendas",
    descricao: "Meta mensal de faturamento por ano/mês — alimenta BI e painéis.",
    categoria: "Comercial",
    ordem: 15,
    tabelaDestino: "metas_vendas",
    chaveUnica: "ano",
    semCreatedBy: true,
    campos: [
      { nome: "ano", label: "Ano", obrigatorio: true, tipo: "integer", exemplo: 2026 },
      { nome: "mes", label: "Mês (1-12)", obrigatorio: true, tipo: "integer", exemplo: 1 },
      {
        nome: "valor_meta",
        label: "Meta (R$)",
        obrigatorio: true,
        tipo: "number",
        exemplo: 850000,
      },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },

  // ───────────── Histórico de lançamentos já realizados ─────────────
  hist_pedidos_venda: {
    id: "hist_pedidos_venda",
    titulo: "Histórico — Pedidos de venda",
    descricao: "Pedidos já faturados/entregues. Alimenta faturamento, BI comercial e curva ABC.",
    categoria: "Histórico de lançamentos",
    ordem: 20,
    tabelaDestino: "pedidos_venda",
    chaveUnica: "numero",
    dicas: ["Importe clientes antes. O campo 'Código do cliente' é resolvido automaticamente."],
    campos: [
      { nome: "numero", label: "Número do pedido", obrigatorio: true, tipo: "text", exemplo: "PV-2025-0001" },
      {
        nome: "cliente_codigo",
        label: "Código do cliente",
        tipo: "text",
        exemplo: "CLI-0001",
        referencia: { tabela: "clientes", buscaPor: "codigo", grava: "cliente_id" },
      },
      { nome: "data_pedido", label: "Data do pedido", obrigatorio: true, tipo: "date", exemplo: "2025-03-14" },
      { nome: "data_entrega_prevista", label: "Entrega prevista", tipo: "date" },
      {
        nome: "status",
        label: "Status",
        tipo: "enum",
        enumValores: ["aberto", "em_producao", "faturado", "entregue", "cancelado"],
        exemplo: "entregue",
      },
      { nome: "condicao_pagamento", label: "Condição de pagamento", tipo: "text", exemplo: "28/56 dias" },
      { nome: "frete_valor", label: "Frete (R$)", tipo: "number", exemplo: 350 },
      { nome: "subtotal", label: "Subtotal (R$)", tipo: "number", exemplo: 18400 },
      { nome: "desconto_pct", label: "Desconto (%)", tipo: "number", exemplo: 0 },
      { nome: "total", label: "Total (R$)", obrigatorio: true, tipo: "number", exemplo: 18750 },
      { nome: "vendedor_nome", label: "Vendedor", tipo: "text", exemplo: "Marcos Lima" },
      { nome: "nota_fiscal", label: "Nota fiscal", tipo: "text", exemplo: "12345" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_notas_fiscais: {
    id: "hist_notas_fiscais",
    titulo: "Histórico — Notas fiscais",
    descricao: "NF-e de entrada e saída já emitidas/recebidas. Alimenta fiscal, SPED e faturamento.",
    categoria: "Histórico de lançamentos",
    ordem: 21,
    tabelaDestino: "notas_fiscais",
    chaveUnica: "numero",
    campos: [
      { nome: "tipo", label: "Tipo", obrigatorio: true, tipo: "enum", enumValores: ["entrada", "saida"], exemplo: "saida" },
      { nome: "modelo", label: "Modelo", tipo: "text", exemplo: "55" },
      { nome: "serie", label: "Série", tipo: "text", exemplo: "1" },
      { nome: "numero", label: "Número", obrigatorio: true, tipo: "integer", exemplo: 12345 },
      { nome: "chave_acesso", label: "Chave de acesso", tipo: "text" },
      { nome: "natureza_operacao", label: "Natureza da operação", obrigatorio: true, tipo: "text", exemplo: "Venda de produção do estabelecimento" },
      { nome: "cfop", label: "CFOP", tipo: "text", exemplo: "5101" },
      { nome: "data_emissao", label: "Data de emissão", obrigatorio: true, tipo: "date", exemplo: "2025-03-15" },
      { nome: "data_movimento", label: "Data de movimento", tipo: "date" },
      {
        nome: "cliente_codigo",
        label: "Código do cliente (saída)",
        tipo: "text",
        referencia: { tabela: "clientes", buscaPor: "codigo", grava: "cliente_id" },
      },
      {
        nome: "fornecedor_codigo",
        label: "Código do fornecedor (entrada)",
        tipo: "text",
        referencia: { tabela: "fornecedores", buscaPor: "codigo", grava: "fornecedor_id" },
      },
      { nome: "valor_produtos", label: "Valor dos produtos (R$)", tipo: "number", exemplo: 18000 },
      { nome: "valor_frete", label: "Valor do frete (R$)", tipo: "number", exemplo: 350 },
      { nome: "valor_desconto", label: "Desconto (R$)", tipo: "number", exemplo: 0 },
      { nome: "valor_impostos", label: "Impostos (R$)", tipo: "number", exemplo: 2400 },
      { nome: "valor_total", label: "Valor total (R$)", obrigatorio: true, tipo: "number", exemplo: 18750 },
      {
        nome: "status_sefaz",
        label: "Status SEFAZ",
        tipo: "enum",
        enumValores: ["pendente", "autorizada", "rejeitada", "cancelada", "denegada"],
        exemplo: "autorizada",
      },
      { nome: "protocolo", label: "Protocolo", tipo: "text" },
    ],
  },
  hist_ordens_producao: {
    id: "hist_ordens_producao",
    titulo: "Histórico — Ordens de produção",
    descricao: "OPs já executadas. Base para OEE, refugo, produtividade e custo industrial.",
    categoria: "Histórico de lançamentos",
    ordem: 22,
    tabelaDestino: "ordens_producao",
    chaveUnica: "numero",
    dicas: ["Importe produtos e máquinas antes desta planilha."],
    campos: [
      { nome: "numero", label: "Número da OP", obrigatorio: true, tipo: "text", exemplo: "OP-2025-0100" },
      {
        nome: "produto_codigo",
        label: "Código do produto",
        obrigatorio: true,
        tipo: "text",
        exemplo: "PA-0001",
        referencia: { tabela: "produtos", buscaPor: "codigo", grava: "produto_id" },
      },
      {
        nome: "maquina_codigo",
        label: "Código da máquina",
        tipo: "text",
        exemplo: "EXT-01",
        referencia: { tabela: "maquinas", buscaPor: "codigo", grava: "maquina_id" },
      },
      {
        nome: "cliente_codigo",
        label: "Código do cliente",
        tipo: "text",
        referencia: { tabela: "clientes", buscaPor: "codigo", grava: "cliente_id" },
      },
      { nome: "quantidade_planejada", label: "Qtd planejada", obrigatorio: true, tipo: "number", exemplo: 1200 },
      { nome: "quantidade_produzida", label: "Qtd produzida", tipo: "number", exemplo: 1185 },
      { nome: "quantidade_refugo", label: "Qtd refugo", tipo: "number", exemplo: 15 },
      { nome: "data_abertura", label: "Data de abertura", obrigatorio: true, tipo: "date", exemplo: "2025-03-10" },
      { nome: "data_prazo", label: "Prazo", tipo: "date" },
      { nome: "data_inicio_producao", label: "Início da produção", tipo: "datetime", exemplo: "2025-03-11 07:00" },
      { nome: "data_conclusao", label: "Conclusão", tipo: "datetime", exemplo: "2025-03-12 15:30" },
      {
        nome: "status",
        label: "Status",
        tipo: "enum",
        enumValores: ["aberta", "liberada", "em_producao", "concluida", "cancelada"],
        exemplo: "concluida",
      },
      { nome: "prioridade", label: "Prioridade", tipo: "enum", enumValores: ["baixa", "normal", "alta", "urgente"], exemplo: "normal" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_apontamentos: {
    id: "hist_apontamentos",
    titulo: "Histórico — Apontamentos de produção",
    descricao: "Produção por etapa/turno já apontada. Alimenta OEE, refugo e eficiência por máquina.",
    categoria: "Histórico de lançamentos",
    ordem: 23,
    tabelaDestino: "op_apontamentos",
    chaveUnica: "op_numero",
    dicas: ["Importe as ordens de produção antes; o número da OP é resolvido automaticamente."],
    campos: [
      {
        nome: "op_numero",
        label: "Número da OP",
        obrigatorio: true,
        tipo: "text",
        exemplo: "OP-2025-0100",
        referencia: { tabela: "ordens_producao", buscaPor: "numero", grava: "op_id" },
      },
      {
        nome: "etapa",
        label: "Etapa",
        obrigatorio: true,
        tipo: "enum",
        enumValores: ["extrusao", "impressao", "laminacao", "corte_solda", "rebobinamento", "expedicao"],
        exemplo: "extrusao",
      },
      {
        nome: "maquina_codigo",
        label: "Código da máquina",
        tipo: "text",
        exemplo: "EXT-01",
        referencia: { tabela: "maquinas", buscaPor: "codigo", grava: "maquina_id" },
      },
      { nome: "operador_nome", label: "Operador", tipo: "text", exemplo: "João Souza" },
      { nome: "data_inicio", label: "Início", tipo: "datetime", exemplo: "2025-03-11 07:00" },
      { nome: "data_fim", label: "Fim", tipo: "datetime", exemplo: "2025-03-11 15:00" },
      { nome: "quantidade_produzida", label: "Qtd produzida", obrigatorio: true, tipo: "number", exemplo: 850 },
      { nome: "quantidade_refugo", label: "Qtd refugo", tipo: "number", exemplo: 12 },
      { nome: "motivo_refugo", label: "Motivo do refugo", tipo: "text", exemplo: "Furo de bolha" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_lotes: {
    id: "hist_lotes",
    titulo: "Histórico — Lotes / rastreabilidade",
    descricao: "Lotes de matéria-prima e produto acabado já gerados. Base da rastreabilidade ISO.",
    categoria: "Histórico de lançamentos",
    ordem: 24,
    tabelaDestino: "lotes",
    chaveUnica: "codigo_lote",
    campos: [
      { nome: "codigo_lote", label: "Código do lote", obrigatorio: true, tipo: "text", exemplo: "L-2025-0345" },
      { nome: "item_tipo", label: "Tipo de item", obrigatorio: true, tipo: "enum", enumValores: ["materia_prima", "produto"], exemplo: "produto" },
      {
        nome: "produto_codigo",
        label: "Código do produto",
        tipo: "text",
        referencia: { tabela: "produtos", buscaPor: "codigo", grava: "produto_id" },
      },
      {
        nome: "materia_prima_codigo",
        label: "Código da matéria-prima",
        tipo: "text",
        referencia: { tabela: "materias_primas", buscaPor: "codigo", grava: "materia_prima_id" },
      },
      { nome: "quantidade_inicial", label: "Quantidade inicial", obrigatorio: true, tipo: "number", exemplo: 1200 },
      { nome: "origem", label: "Origem", tipo: "enum", enumValores: ["compra", "producao", "ajuste"], exemplo: "producao" },
      {
        nome: "fornecedor_codigo",
        label: "Código do fornecedor",
        tipo: "text",
        referencia: { tabela: "fornecedores", buscaPor: "codigo", grava: "fornecedor_id" },
      },
      { nome: "data_producao", label: "Data de produção", tipo: "date", exemplo: "2025-03-12" },
      { nome: "data_validade", label: "Validade", tipo: "date" },
      { nome: "numero_nf", label: "Nota fiscal", tipo: "text" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_movimentacoes_estoque: {
    id: "hist_movimentacoes_estoque",
    titulo: "Histórico — Movimentações de estoque",
    descricao: "Entradas, saídas, transferências e ajustes já realizados. Reconstrói o saldo real.",
    categoria: "Histórico de lançamentos",
    ordem: 25,
    tabelaDestino: "estoque_movimentacoes",
    chaveUnica: "documento",
    dicas: ["Importe depósitos, produtos e matérias-primas antes."],
    campos: [
      { nome: "data", label: "Data/hora", obrigatorio: true, tipo: "datetime", exemplo: "2025-03-12 09:20" },
      {
        nome: "tipo",
        label: "Tipo",
        obrigatorio: true,
        tipo: "enum",
        enumValores: ["entrada", "saida", "transferencia", "ajuste", "consumo", "producao"],
        exemplo: "entrada",
      },
      { nome: "item_tipo", label: "Tipo de item", obrigatorio: true, tipo: "enum", enumValores: ["materia_prima", "produto"], exemplo: "materia_prima" },
      {
        nome: "materia_prima_codigo",
        label: "Código da matéria-prima",
        tipo: "text",
        referencia: { tabela: "materias_primas", buscaPor: "codigo", grava: "materia_prima_id" },
      },
      {
        nome: "produto_codigo",
        label: "Código do produto",
        tipo: "text",
        referencia: { tabela: "produtos", buscaPor: "codigo", grava: "produto_id" },
      },
      {
        nome: "deposito_origem_codigo",
        label: "Depósito de origem",
        tipo: "text",
        referencia: { tabela: "depositos", buscaPor: "codigo", grava: "deposito_origem_id" },
      },
      {
        nome: "deposito_destino_codigo",
        label: "Depósito de destino",
        tipo: "text",
        referencia: { tabela: "depositos", buscaPor: "codigo", grava: "deposito_destino_id" },
      },
      { nome: "quantidade", label: "Quantidade", obrigatorio: true, tipo: "number", exemplo: 500 },
      { nome: "documento", label: "Documento", tipo: "text", exemplo: "NF 12345" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_pedidos_compra: {
    id: "hist_pedidos_compra",
    titulo: "Histórico — Pedidos de compra",
    descricao: "Compras já realizadas. Base para últimos preços pagos, lead time e performance de fornecedor.",
    categoria: "Histórico de lançamentos",
    ordem: 26,
    tabelaDestino: "pedidos_compra",
    chaveUnica: "numero",
    campos: [
      { nome: "numero", label: "Número do pedido", obrigatorio: true, tipo: "text", exemplo: "PC-2025-0044" },
      {
        nome: "fornecedor_codigo",
        label: "Código do fornecedor",
        tipo: "text",
        exemplo: "FOR-0001",
        referencia: { tabela: "fornecedores", buscaPor: "codigo", grava: "fornecedor_id" },
      },
      { nome: "data_pedido", label: "Data do pedido", obrigatorio: true, tipo: "date", exemplo: "2025-02-20" },
      { nome: "data_entrega_prevista", label: "Entrega prevista", tipo: "date" },
      {
        nome: "status",
        label: "Status",
        tipo: "enum",
        enumValores: ["aberto", "enviado", "recebido_parcial", "recebido", "cancelado"],
        exemplo: "recebido",
      },
      { nome: "condicao_pagamento", label: "Condição de pagamento", tipo: "text", exemplo: "30 dias" },
      { nome: "frete_valor", label: "Frete (R$)", tipo: "number", exemplo: 420 },
      { nome: "subtotal", label: "Subtotal (R$)", tipo: "number", exemplo: 32000 },
      { nome: "total", label: "Total (R$)", obrigatorio: true, tipo: "number", exemplo: 32420 },
      { nome: "comprador_nome", label: "Comprador", tipo: "text" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_recebimentos: {
    id: "hist_recebimentos",
    titulo: "Histórico — Recebimentos de materiais",
    descricao: "Entradas físicas já ocorridas. Alimenta lead time real e inspeção de recebimento.",
    categoria: "Histórico de lançamentos",
    ordem: 27,
    tabelaDestino: "recebimentos",
    chaveUnica: "numero",
    campos: [
      { nome: "numero", label: "Número do recebimento", obrigatorio: true, tipo: "text", exemplo: "REC-2025-0031" },
      {
        nome: "fornecedor_codigo",
        label: "Código do fornecedor",
        tipo: "text",
        referencia: { tabela: "fornecedores", buscaPor: "codigo", grava: "fornecedor_id" },
      },
      {
        nome: "pedido_compra_numero",
        label: "Número do pedido de compra",
        tipo: "text",
        referencia: { tabela: "pedidos_compra", buscaPor: "numero", grava: "pedido_compra_id" },
      },
      { nome: "data_recebimento", label: "Data do recebimento", obrigatorio: true, tipo: "date", exemplo: "2025-02-27" },
      { nome: "nota_fiscal", label: "Nota fiscal", tipo: "text", exemplo: "88123" },
      { nome: "chave_nfe", label: "Chave NF-e", tipo: "text" },
      { nome: "status", label: "Status", tipo: "enum", enumValores: ["recebido", "em_inspecao", "aprovado", "rejeitado"], exemplo: "aprovado" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_inspecoes: {
    id: "hist_inspecoes",
    titulo: "Histórico — Inspeções de qualidade",
    descricao: "Inspeções de recebimento, processo e final já realizadas. Alimenta indicadores da qualidade.",
    categoria: "Histórico de lançamentos",
    ordem: 28,
    tabelaDestino: "inspecoes",
    chaveUnica: "numero",
    campos: [
      { nome: "numero", label: "Número da inspeção", obrigatorio: true, tipo: "text", exemplo: "INSP-2025-0210" },
      { nome: "tipo", label: "Tipo", tipo: "enum", enumValores: ["recebimento", "processo", "final"], exemplo: "processo" },
      { nome: "data_inspecao", label: "Data", obrigatorio: true, tipo: "date", exemplo: "2025-03-12" },
      {
        nome: "op_numero",
        label: "Número da OP",
        tipo: "text",
        referencia: { tabela: "ordens_producao", buscaPor: "numero", grava: "op_id" },
      },
      {
        nome: "produto_codigo",
        label: "Código do produto",
        tipo: "text",
        referencia: { tabela: "produtos", buscaPor: "codigo", grava: "produto_id" },
      },
      { nome: "inspetor_nome", label: "Inspetor", tipo: "text", exemplo: "Ana Prado" },
      { nome: "resultado", label: "Resultado", tipo: "enum", enumValores: ["pendente", "aprovado", "reprovado", "aprovado_condicional"], exemplo: "aprovado" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_nao_conformidades: {
    id: "hist_nao_conformidades",
    titulo: "Histórico — Não conformidades",
    descricao: "RNCs já registradas, com ação imediata e corretiva. Base ISO 9001 e custo da má qualidade.",
    categoria: "Histórico de lançamentos",
    ordem: 29,
    tabelaDestino: "nao_conformidades",
    chaveUnica: "numero",
    campos: [
      { nome: "numero", label: "Número da RNC", obrigatorio: true, tipo: "text", exemplo: "RNC-2025-0018" },
      { nome: "data_ocorrencia", label: "Data da ocorrência", obrigatorio: true, tipo: "date", exemplo: "2025-03-13" },
      { nome: "origem", label: "Origem", tipo: "enum", enumValores: ["interna", "cliente", "fornecedor", "auditoria"], exemplo: "interna" },
      { nome: "severidade", label: "Severidade", tipo: "enum", enumValores: ["baixa", "media", "alta", "critica"], exemplo: "media" },
      { nome: "descricao", label: "Descrição", obrigatorio: true, tipo: "text", exemplo: "Solda com falha em 3% das unidades" },
      {
        nome: "cliente_codigo",
        label: "Código do cliente",
        tipo: "text",
        referencia: { tabela: "clientes", buscaPor: "codigo", grava: "cliente_id" },
      },
      {
        nome: "fornecedor_codigo",
        label: "Código do fornecedor",
        tipo: "text",
        referencia: { tabela: "fornecedores", buscaPor: "codigo", grava: "fornecedor_id" },
      },
      { nome: "responsavel_nome", label: "Responsável", tipo: "text" },
      { nome: "acao_imediata", label: "Ação imediata", tipo: "text" },
      { nome: "acao_corretiva", label: "Ação corretiva", tipo: "text" },
      { nome: "status", label: "Status", tipo: "enum", enumValores: ["aberta", "em_analise", "em_acao", "encerrada"], exemplo: "encerrada" },
      { nome: "data_encerramento", label: "Encerramento", tipo: "date" },
    ],
  },
  hist_ordens_manutencao: {
    id: "hist_ordens_manutencao",
    titulo: "Histórico — Ordens de manutenção",
    descricao: "Manutenções corretivas e preventivas já executadas. Alimenta MTBF, MTTR e custo de manutenção.",
    categoria: "Histórico de lançamentos",
    ordem: 30,
    tabelaDestino: "ordens_manutencao",
    chaveUnica: "numero",
    campos: [
      { nome: "numero", label: "Número da OM", obrigatorio: true, tipo: "text", exemplo: "OM-2025-0077" },
      { nome: "tipo", label: "Tipo", tipo: "enum", enumValores: ["corretiva", "preventiva", "preditiva", "melhoria"], exemplo: "corretiva" },
      { nome: "recurso_nome", label: "Máquina/recurso", tipo: "text", exemplo: "EXT-01" },
      { nome: "descricao", label: "Descrição", tipo: "text", exemplo: "Troca de resistência da zona 3" },
      { nome: "data_abertura", label: "Abertura", obrigatorio: true, tipo: "date", exemplo: "2025-03-05" },
      { nome: "data_prevista", label: "Prevista", tipo: "date" },
      { nome: "data_conclusao", label: "Conclusão", tipo: "date" },
      { nome: "status", label: "Status", tipo: "enum", enumValores: ["aberta", "em_execucao", "concluida", "cancelada"], exemplo: "concluida" },
      { nome: "responsavel_nome", label: "Responsável", tipo: "text" },
      { nome: "custo_estimado", label: "Custo estimado (R$)", tipo: "number", exemplo: 800 },
      { nome: "custo_real", label: "Custo real (R$)", tipo: "number", exemplo: 940 },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_paradas_maquina: {
    id: "hist_paradas_maquina",
    titulo: "Histórico — Paradas de máquina",
    descricao: "Paradas planejadas e não planejadas. Componente de disponibilidade no OEE.",
    categoria: "Histórico de lançamentos",
    ordem: 31,
    tabelaDestino: "paradas_maquina",
    chaveUnica: "recurso_nome",
    campos: [
      { nome: "recurso_nome", label: "Máquina/recurso", obrigatorio: true, tipo: "text", exemplo: "EXT-01" },
      { nome: "motivo", label: "Motivo", obrigatorio: true, tipo: "text", exemplo: "Setup de troca de bobina" },
      { nome: "descricao", label: "Descrição", tipo: "text" },
      { nome: "inicio", label: "Início", obrigatorio: true, tipo: "datetime", exemplo: "2025-03-11 10:30" },
      { nome: "fim", label: "Fim", tipo: "datetime", exemplo: "2025-03-11 11:10" },
      { nome: "duracao_min", label: "Duração (min)", tipo: "integer", exemplo: 40 },
      {
        nome: "op_numero",
        label: "Número da OP",
        tipo: "text",
        referencia: { tabela: "ordens_producao", buscaPor: "numero", grava: "op_id" },
      },
      { nome: "responsavel_nome", label: "Responsável", tipo: "text" },
    ],
  },
  hist_baixas_pagar: {
    id: "hist_baixas_pagar",
    titulo: "Histórico — Baixas de contas a pagar",
    descricao: "Pagamentos já efetuados. Reconstrói fluxo de caixa realizado.",
    categoria: "Histórico de lançamentos",
    ordem: 32,
    tabelaDestino: "contas_pagar_baixas",
    chaveUnica: "conta_numero",
    dicas: ["Importe as contas a pagar antes; o número do título é resolvido automaticamente."],
    campos: [
      {
        nome: "conta_numero",
        label: "Número do título",
        obrigatorio: true,
        tipo: "text",
        exemplo: "DUP-1023/1",
        referencia: { tabela: "contas_pagar", buscaPor: "numero", grava: "conta_id" },
      },
      { nome: "data_baixa", label: "Data do pagamento", obrigatorio: true, tipo: "date", exemplo: "2025-03-05" },
      { nome: "valor", label: "Valor pago (R$)", obrigatorio: true, tipo: "number", exemplo: 4200 },
      { nome: "forma", label: "Forma", tipo: "text", exemplo: "PIX" },
      { nome: "conta_bancaria", label: "Conta bancária", tipo: "text" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_baixas_receber: {
    id: "hist_baixas_receber",
    titulo: "Histórico — Baixas de contas a receber",
    descricao: "Recebimentos já efetuados. Alimenta inadimplência, prazo médio e caixa realizado.",
    categoria: "Histórico de lançamentos",
    ordem: 33,
    tabelaDestino: "contas_receber_baixas",
    chaveUnica: "conta_numero",
    campos: [
      {
        nome: "conta_numero",
        label: "Número do título",
        obrigatorio: true,
        tipo: "text",
        exemplo: "DUP-889/2",
        referencia: { tabela: "contas_receber", buscaPor: "numero", grava: "conta_id" },
      },
      { nome: "data_baixa", label: "Data do recebimento", obrigatorio: true, tipo: "date", exemplo: "2025-03-08" },
      { nome: "valor", label: "Valor recebido (R$)", obrigatorio: true, tipo: "number", exemplo: 8400 },
      { nome: "forma", label: "Forma", tipo: "text", exemplo: "Boleto" },
      { nome: "conta_bancaria", label: "Conta bancária", tipo: "text" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
  hist_crm_leads: {
    id: "hist_crm_leads",
    titulo: "Histórico — Oportunidades / CRM",
    descricao: "Funil comercial já existente: leads, estágios e valores estimados.",
    categoria: "Histórico de lançamentos",
    ordem: 34,
    tabelaDestino: "crm_leads",
    chaveUnica: "nome",
    campos: [
      { nome: "nome", label: "Nome do contato", obrigatorio: true, tipo: "text", exemplo: "Carlos Menezes" },
      { nome: "empresa", label: "Empresa", tipo: "text", exemplo: "Alimentos Bom Sabor" },
      { nome: "email", label: "Email", tipo: "text" },
      { nome: "telefone", label: "Telefone", tipo: "text" },
      { nome: "origem", label: "Origem", tipo: "text", exemplo: "Indicação" },
      {
        nome: "estagio",
        label: "Estágio",
        tipo: "enum",
        enumValores: ["novo", "qualificado", "proposta", "negociacao", "ganho", "perdido"],
        exemplo: "proposta",
      },
      { nome: "valor_estimado", label: "Valor estimado (R$)", tipo: "number", exemplo: 45000 },
      { nome: "probabilidade", label: "Probabilidade (%)", tipo: "integer", exemplo: 60 },
      {
        nome: "cliente_codigo",
        label: "Código do cliente",
        tipo: "text",
        referencia: { tabela: "clientes", buscaPor: "codigo", grava: "cliente_id" },
      },
      { nome: "proxima_acao", label: "Próxima ação", tipo: "text" },
      { nome: "proxima_acao_data", label: "Data da próxima ação", tipo: "date" },
      { nome: "observacoes", label: "Observações", tipo: "text" },
    ],
  },
};

export const MODULOS_IDS = Object.keys(MODULOS) as ModuloIntegracao[];

export const CATEGORIAS: CategoriaIntegracao[] = [
  "Cadastros gerais",
  "Industrial",
  "Pessoas",
  "Financeiro",
  "Comercial",
  "Histórico de lançamentos",
];

/** Limite de linhas processadas por importação (lote). */
export const LIMITE_LINHAS = 5000;

/** Converte data/hora BR ou ISO (e serial Excel) em ISO 8601 completo. */
export function normalizarDataHora(raw: unknown): string | null {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw.toISOString();
  if (typeof raw === "number" && Number.isFinite(raw)) {
    const d = new Date(Math.round((raw - 25569) * 86400 * 1000));
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  const s = String(raw).trim();
  const br = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})[ T]?(\d{1,2})?:?(\d{2})?:?(\d{2})?$/);
  if (br) {
    const [, d, m, y, h = "0", mi = "0", se = "0"] = br;
    const ano = y.length === 2 ? `20${y}` : y;
    const dt = new Date(
      Number(ano),
      Number(m) - 1,
      Number(d),
      Number(h),
      Number(mi),
      Number(se),
    );
    return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
  }
  const parsed = new Date(s.includes("T") ? s : s.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}


export function modulosPorCategoria(cat: CategoriaIntegracao): ModuloSchema[] {
  return Object.values(MODULOS)
    .filter((m) => m.categoria === cat)
    .sort((a, b) => a.ordem - b.ordem);
}

export function isModuloValido(v: string): v is ModuloIntegracao {
  return Object.prototype.hasOwnProperty.call(MODULOS, v);
}

/** Converte datas em formatos BR/ISO/serial-Excel para AAAA-MM-DD. */
export function normalizarData(raw: unknown): string | null {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toISOString().slice(0, 10);
  }
  if (typeof raw === "number" && Number.isFinite(raw)) {
    // serial do Excel (base 1899-12-30)
    const ms = Math.round((raw - 25569) * 86400 * 1000);
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }
  const s = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const br = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (br) {
    const [, d, m, y] = br;
    const ano = y.length === 2 ? `20${y}` : y;
    return `${ano}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const parsed = new Date(s);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

/** Converte números em formato BR (1.250,90) ou US (1250.90). */
export function normalizarNumero(raw: unknown): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  let s = String(raw)
    .replace(/[R$\s%]/gi, "")
    .trim();
  if (!s) return null;
  const temVirgula = s.includes(",");
  const temPonto = s.includes(".");
  if (temVirgula && temPonto) s = s.replace(/\./g, "").replace(",", ".");
  else if (temVirgula) s = s.replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function validarLinha(
  modulo: ModuloIntegracao,
  linha: Record<string, unknown>,
): { valida: boolean; erros: string[]; normalizada: Record<string, unknown> } {
  const schema = MODULOS[modulo];
  const erros: string[] = [];
  const norm: Record<string, unknown> = {};

  for (const campo of schema.campos) {
    // aceita nome ou label
    const raw = linha[campo.nome] ?? linha[campo.label];
    if (raw === undefined || raw === null || raw === "") {
      if (campo.obrigatorio) erros.push(`Campo obrigatório ausente: ${campo.label}`);
      continue;
    }
    if (campo.tipo === "number" || campo.tipo === "integer") {
      const n = normalizarNumero(raw);
      if (n === null) {
        erros.push(`${campo.label} deve ser numérico (recebido: "${String(raw)}")`);
        continue;
      }
      norm[campo.nome] = campo.tipo === "integer" ? Math.round(n) : n;
    } else if (campo.tipo === "date") {
      const d = normalizarData(raw);
      if (!d) {
        erros.push(`${campo.label} deve ser uma data válida (recebido: "${String(raw)}")`);
        continue;
      }
      norm[campo.nome] = d;
    } else if (campo.tipo === "datetime") {
      const d = normalizarDataHora(raw);
      if (!d) {
        erros.push(`${campo.label} deve ser data/hora válida (recebido: "${String(raw)}")`);
        continue;
      }
      norm[campo.nome] = d;

    } else if (campo.tipo === "boolean") {
      const v = String(raw).trim().toLowerCase();
      norm[campo.nome] = ["sim", "true", "1", "s", "x", "ativo"].includes(v);
    } else if (campo.tipo === "enum") {
      const v = String(raw).trim();
      const aceitos = campo.enumValores ?? [];
      const match = aceitos.find((a) => a.toLowerCase() === v.toLowerCase());
      if (!match) {
        erros.push(`${campo.label} inválido. Aceitos: ${aceitos.join(", ")}`);
        continue;
      }
      norm[campo.nome] = match;
    } else {
      norm[campo.nome] = String(raw).trim();
    }
  }

  return { valida: erros.length === 0, erros, normalizada: norm };
}
