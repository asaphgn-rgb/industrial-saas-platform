import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
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

const getSessionInfo = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return { supabase, userId: session?.user?.id };
};

export const stagearImportacao = createServerFn({ method: "POST" })
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
  .handler(async ({ data }) => {
    const { supabase, userId } = await getSessionInfo();

    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", userId)
      .maybeSingle();

    const tenantId = profile?.tenant_id || "00000000-0000-0000-0000-000000000000";

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

export const confirmarImportacao = createServerFn({ method: "POST" })
  .validator((input) => z.object({ importacaoId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabase, userId } = await getSessionInfo();

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
        status: falhas > 0 ? "com_erro" : "importada",
        linhas_validas: importadas,
        linhas_com_erro: falhas,
      })
      .eq("id", imp.id);

    return { importadas, falhas };
  });

export const getLinhasErro = createServerFn({ method: "GET" })
  .validator((input) => z.object({ importacaoId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabase } = await getSessionInfo();
    const { data: rows } = await supabase
      .from("importacao_linhas")
      .select("id, numero_linha, dados_originais, erros_validacao")
      .eq("importacao_id", data.importacaoId)
      .eq("status", "com_erro")
      .order("numero_linha", { ascending: true })
      .limit(100);
    return rows ?? [];
  });

export const descartarImportacao = createServerFn({ method: "POST" })
  .validator((input) => z.object({ importacaoId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabase } = await getSessionInfo();
    await supabase.from("importacao_linhas").delete().eq("importacao_id", data.importacaoId);
    await supabase.from("importacoes").delete().eq("id", data.importacaoId);
  });
