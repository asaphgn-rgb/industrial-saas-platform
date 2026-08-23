import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  MODULOS,
  isModuloValido,
  validarLinha,
  type ModuloIntegracao,
} from "./integracao-dados.schemas";

const moduloEnum = z
  .string()
  .refine(isModuloValido, "Módulo de importação desconhecido")
  .transform((v) => v as ModuloIntegracao);


/**
 * Cria uma importação e insere as linhas no staging.
 * O parsing do XLSX acontece no cliente para reduzir carga do servidor;
 * aqui apenas validamos, persistimos e reportamos erros.
 */
export const stagearImportacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) =>
    z
      .object({
        modulo: moduloEnum,
        arquivoNome: z.string().max(255).optional(),
        arquivoPath: z.string().max(500).optional(),
        linhas: z
          .array(z.record(z.string(), z.unknown()))
          .min(1, "Planilha sem linhas")
          .max(5000, "Máximo de 5.000 linhas por importação"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", userId)
      .maybeSingle();

    // Fallback: se não achar o tenant (banco cru)
    const tenantId = profile?.tenant_id || "00000000-0000-0000-0000-000000000000";

    // Cria cabeçalho
    const { data: imp, error: impErr } = await supabase
      .from("importacoes")
      .insert({
        tenant_id: tenantId,
        modulo: data.modulo,
        arquivo_nome: data.arquivoNome ?? null,
        arquivo_path: data.arquivoPath ?? null,
        status: "em_validacao",
        total_linhas: data.linhas.length,
        created_by: userId,
      })
      .select("id")
      .single();
    if (impErr || !imp) throw new Error(impErr?.message ?? "Falha ao criar importação");

    let validas = 0;
    let comErro = 0;
    const rows = data.linhas.map((linha, idx) => {
      const { valida, erros, normalizada } = validarLinha(data.modulo, linha);
      if (valida) validas++;
      else comErro++;
      return {
        importacao_id: imp.id,
        tenant_id: tenantId,
        numero_linha: idx + 2,
        dados_originais: normalizada as never,
        status: valida ? "valida" : "com_erro",
        erros_validacao: erros.length ? erros.join("; ") : null,
      };
    });

    // Insere em lotes de 500
    for (let i = 0; i < rows.length; i += 500) {
      const chunk = rows.slice(i, i + 500);
      const { error } = await supabase.from("importacao_linhas").insert(chunk);
      if (error) throw new Error(`Falha ao gravar linhas: ${error.message}`);
    }

    await supabase
      .from("importacoes")
      .update({
        status: comErro === 0 ? "validada" : "com_erro",
        linhas_validas: validas,
        linhas_com_erro: comErro,
      })
      .eq("id", imp.id);

    return { importacaoId: imp.id, total: rows.length, validas, comErro };
  });

/**
 * Confirma a importação: transfere linhas 'valida' para a tabela final.
 * Só linhas válidas são gravadas; duplicidades (código já existente no tenant) viram erro.
 */
export const confirmarImportacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) => z.object({ importacaoId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", userId)
      .maybeSingle();
    const tenantId = profile?.tenant_id;
    if (!tenantId) throw new Error("Tenant não encontrado.");

    const { data: imp, error: impErr } = await supabase
      .from("importacoes")
      .select("id, modulo, status, tenant_id")
      .eq("id", data.importacaoId)
      .eq("tenant_id", tenantId)
      .maybeSingle();
    if (impErr || !imp) throw new Error("Importação não encontrada.");
    if (imp.status === "importada") throw new Error("Esta importação já foi finalizada.");

    const modulo = imp.modulo as ModuloIntegracao;
    const schema = MODULOS[modulo];

    const { data: linhas, error: linhErr } = await supabase
      .from("importacao_linhas")
      .select("id, dados_originais, numero_linha")
      .eq("importacao_id", imp.id)
      .eq("status", "valida");
    if (linhErr) throw new Error(linhErr.message);

    if (!linhas || linhas.length === 0) {
      return { importadas: 0, falhas: 0, mensagem: "Nenhuma linha válida para importar." };
    }

    let importadas = 0;
    let falhas = 0;

    // Resolve campos de referência (código legível → UUID) em uma consulta por tabela.
    const refCampos = schema.campos.filter((c) => c.referencia);
    const mapas = new Map<string, Map<string, string>>();
    for (const campo of refCampos) {
      const ref = campo.referencia!;
      const chave = `${ref.tabela}.${ref.buscaPor}`;
      if (mapas.has(chave)) continue;
      const valores = Array.from(
        new Set(
          linhas
            .map((l) => (l.dados_originais as Record<string, unknown>)[campo.nome])
            .filter((v): v is string => typeof v === "string" && v.length > 0),
        ),
      );
      const mapa = new Map<string, string>();
      for (let i = 0; i < valores.length; i += 200) {
        const fatia = valores.slice(i, i + 200);
        const { data: encontrados } = await supabase
          .from(ref.tabela as never)
          .select(`id, ${ref.buscaPor}`)
          .in(ref.buscaPor, fatia);
        for (const r of (encontrados ?? []) as unknown as Record<string, string>[]) {
          mapa.set(String(r[ref.buscaPor]), r.id);
        }
      }
      mapas.set(chave, mapa);
    }

    for (const linha of linhas) {
      const dados = { ...(linha.dados_originais as Record<string, unknown>) };
      let erroRef: string | null = null;

      for (const campo of refCampos) {
        const ref = campo.referencia!;
        const valor = dados[campo.nome];
        delete dados[campo.nome];
        if (typeof valor !== "string" || !valor) continue;
        const id = mapas.get(`${ref.tabela}.${ref.buscaPor}`)?.get(valor);
        if (!id) {
          erroRef = `${campo.label}: "${valor}" não encontrado em ${ref.tabela}. Importe esse cadastro antes.`;
          break;
        }
        dados[ref.grava] = id;
      }

      if (erroRef) {
        falhas++;
        await supabase
          .from("importacao_linhas")
          .update({ status: "com_erro", erros_validacao: erroRef.slice(0, 500) })
          .eq("id", linha.id);
        continue;
      }

      const payload: Record<string, unknown> = { ...dados, tenant_id: tenantId };
      if (!schema.semCreatedBy) payload.created_by = userId;
      const { data: inserted, error } = await supabase
        .from(schema.tabelaDestino as never)
        .insert(payload as never)
        .select("id")
        .maybeSingle();
      if (error) {
        falhas++;
        await supabase
          .from("importacao_linhas")
          .update({ status: "com_erro", erros_validacao: error.message.slice(0, 500) })
          .eq("id", linha.id);
      } else {
        importadas++;
        await supabase
          .from("importacao_linhas")
          .update({
            status: "importada",
            registro_criado_id: (inserted as { id?: string } | null)?.id ?? null,
          })
          .eq("id", linha.id);
      }
    }


    await supabase
      .from("importacoes")
      .update({
        status: falhas === 0 ? "importada" : "com_erro",
        linhas_importadas: importadas,
        mensagem: `Importadas: ${importadas}. Falhas: ${falhas}.`,
      })
      .eq("id", imp.id);

    return { importadas, falhas };
  });

/** Atualiza os dados de uma linha em staging e revalida somente ela. */
export const atualizarLinhaImportacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) =>
    z
      .object({
        linhaId: z.string().uuid(),
        dados: z.record(z.string(), z.unknown()),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: linha, error } = await supabase
      .from("importacao_linhas")
      .select("id, importacao_id")
      .eq("id", data.linhaId)
      .maybeSingle();
    if (error || !linha) throw new Error("Linha não encontrada.");

    const { data: imp } = await supabase
      .from("importacoes")
      .select("modulo")
      .eq("id", linha.importacao_id)
      .maybeSingle();
    if (!imp) throw new Error("Importação não encontrada.");

    const modulo = imp.modulo as ModuloIntegracao;
    const { valida, erros, normalizada } = validarLinha(modulo, data.dados);

    const { error: upErr } = await supabase
      .from("importacao_linhas")
      .update({
        dados_originais: normalizada as never,
        status: valida ? "valida" : "com_erro",
        erros_validacao: erros.length ? erros.join("; ").slice(0, 500) : null,
      })
      .eq("id", data.linhaId);
    if (upErr) throw new Error(upErr.message);

    await recontarImportacao(supabase, linha.importacao_id);
    return { valida, erros };
  });

/** Exclui (descarta) uma linha do staging. */
export const excluirLinhaImportacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) => z.object({ linhaId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: linha } = await supabase
      .from("importacao_linhas")
      .select("importacao_id")
      .eq("id", data.linhaId)
      .maybeSingle();
    const { error } = await supabase.from("importacao_linhas").delete().eq("id", data.linhaId);
    if (error) throw new Error(error.message);
    if (linha?.importacao_id) await recontarImportacao(supabase, linha.importacao_id);
    return { ok: true };
  });

/** Descarta de uma vez todas as linhas com erro de uma importação. */
export const descartarLinhasComErro = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) => z.object({ importacaoId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("importacao_linhas")
      .delete()
      .eq("importacao_id", data.importacaoId)
      .eq("status", "com_erro");
    if (error) throw new Error(error.message);
    await recontarImportacao(supabase, data.importacaoId);
    return { ok: true };
  });

type LooseClient = {
  from: (t: string) => {
    select: (c: string) => {
      eq: (col: string, v: string) => PromiseLike<{ data: { status: string }[] | null }>;
    };
    update: (v: Record<string, unknown>) => {
      eq: (c: string, v: string) => PromiseLike<unknown>;
    };
  };
};

async function recontarImportacao(client: unknown, importacaoId: string) {
  const supabase = client as LooseClient;
  const { data: rows } = await supabase
    .from("importacao_linhas")
    .select("status")
    .eq("importacao_id", importacaoId);

  const lista = rows ?? [];
  const validas = lista.filter((r) => r.status === "valida").length;
  const comErro = lista.filter((r) => r.status === "com_erro").length;
  const importadas = lista.filter((r) => r.status === "importada").length;
  await supabase
    .from("importacoes")
    .update({
      total_linhas: lista.length,
      linhas_validas: validas,
      linhas_com_erro: comErro,
      linhas_importadas: importadas,
      status:
        importadas > 0 && comErro === 0
          ? "importada"
          : comErro > 0
            ? "com_erro"
            : "validada",
    })
    .eq("id", importacaoId);
}


export const listarImportacoes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("importacoes")
      .select(
        "id, modulo, status, arquivo_nome, total_linhas, linhas_validas, linhas_com_erro, linhas_importadas, created_at, mensagem",
      )
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listarLinhasImportacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) =>
    z
      .object({ importacaoId: z.string().uuid(), somenteErros: z.boolean().optional() })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("importacao_linhas")
      .select("id, numero_linha, status, erros_validacao, dados_originais")
      .eq("importacao_id", data.importacaoId)
      .order("numero_linha", { ascending: true })
      .limit(500);
    if (data.somenteErros) q = q.eq("status", "com_erro");
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
