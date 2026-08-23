/**
 * Traduz erros técnicos do Postgres/PostgREST/Supabase em mensagens
 * amigáveis para o usuário final do FLUX. Nunca expõe nomes de funções,
 * policies, SQL ou stack traces na UI.
 *
 * Uso:
 *   toast.error(friendlyError(err));
 */

const PATTERNS: Array<{ test: RegExp; message: (m: RegExpMatchArray) => string }> = [
  {
    test: /permission denied for function\s+(\w+)/i,
    message: (m) => {
      const fn = m[1];
      const map: Record<string, string> = {
        can_write_producao: "alterar registros de Produção",
        can_write_comercial: "alterar registros do Comercial",
        can_write_financeiro: "alterar registros do Financeiro",
        can_write_estoque: "alterar registros do Estoque",
        can_write_qualidade: "alterar registros da Qualidade",
        can_write_manutencao: "alterar registros da Manutenção",
        can_write_rh: "alterar registros de Recursos Humanos",
        can_write_engenharia: "alterar registros da Engenharia",
        can_write_suprimentos: "alterar registros de Suprimentos",
        can_write_expedicao: "alterar registros da Expedição",
        can_write_cadastro: "alterar cadastros",
        can_read_rh: "visualizar dados de Recursos Humanos",
      };
      const acao = map[fn] ?? "executar esta ação";
      return `Você não tem permissão para ${acao}. Solicite acesso ao administrador do seu tenant.`;
    },
  },
  {
    test: /permission denied for (table|relation)\s+(\w+)/i,
    message: () => "Você não tem permissão para acessar este recurso. Solicite acesso ao administrador.",
  },
  {
    test: /new row violates row-level security policy/i,
    message: () => "Este registro não pode ser criado com as permissões atuais. Verifique o tenant ativo ou solicite acesso.",
  },
  {
    test: /row-level security|RLS/i,
    message: () => "Você não tem permissão para acessar este registro.",
  },
  {
    test: /JWT expired|invalid JWT|not authenticated/i,
    message: () => "Sua sessão expirou. Faça login novamente para continuar.",
  },
  {
    test: /duplicate key value|already exists|unique constraint/i,
    message: () => "Já existe um registro com estes dados. Verifique os campos únicos (código, documento, e-mail).",
  },
  {
    test: /violates foreign key constraint/i,
    message: () => "Não é possível concluir: este registro está vinculado a outros que precisam ser tratados antes.",
  },
  {
    test: /violates not-null constraint.*column "([^"]+)"/i,
    message: (m) => `O campo obrigatório "${m[1]}" não foi preenchido.`,
  },
  {
    test: /violates check constraint/i,
    message: () => "Um dos valores informados não atende às regras de validação. Revise os campos e tente novamente.",
  },
  {
    test: /Failed to fetch|NetworkError|network request failed/i,
    message: () => "Sem conexão com o servidor. Verifique sua internet e tente novamente.",
  },
  {
    test: /timeout|timed out/i,
    message: () => "A operação demorou mais que o esperado. Tente novamente em alguns instantes.",
  },
  {
    test: /Tenant não identificado/i,
    message: () => "Nenhum tenant ativo. Selecione uma empresa no topo da tela para continuar.",
  },
];

/**
 * Traduz `err` em mensagem amigável. Aceita Error, string ou objeto
 * com `.message`. Mantém a mensagem original se ela já parecer amigável
 * (curta, em português, sem termos técnicos).
 */
export function friendlyError(err: unknown, fallback?: string): string {
  const raw = extract(err);
  if (!raw) return fallback ?? "Ocorreu um erro inesperado. Tente novamente.";


  for (const { test, message } of PATTERNS) {
    const match = raw.match(test);
    if (match) return message(match);
  }

  // Filtro final: se contém termos técnicos vazados, esconde.
  if (/\b(supabase|postgres|pgrst|sql|stack|trace|null value in column|relation ".+?" does not exist)\b/i.test(raw)) {
    return "Não foi possível concluir a operação. Tente novamente ou contate o suporte se persistir.";
  }

  // Mensagem já parece amigável — devolve como está.
  return raw;
}

function extract(err: unknown): string {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyErr = err as any;
    return anyErr.message ?? anyErr.error_description ?? anyErr.error ?? JSON.stringify(err);
  }
  return String(err);
}
