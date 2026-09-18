import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Alteracao = { path: string; content: string };
type ComandoGithub = {
  repository: string;
  title: string;
  body: string;
  changes: Alteracao[];
};

const origemPermitida = (origem: string | null) => {
  const permitidas = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((valor) => valor.trim()).filter(Boolean);
  return origem && permitidas.includes(origem) ? origem : null;
};

const cabecalhosCors = (origem: string | null) => {
  const permitida = origemPermitida(origem);
  return {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    ...(permitida ? { "Access-Control-Allow-Origin": permitida, Vary: "Origin" } : {}),
  };
};

const respostaJson = (status: number, corpo: unknown, origem: string | null) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { ...cabecalhosCors(origem), "Content-Type": "application/json" },
  });

const validarComando = (valor: unknown, repositorioPermitido: string): ComandoGithub => {
  if (!valor || typeof valor !== "object") throw new Error("Payload inválido");
  const comando = valor as Partial<ComandoGithub>;
  if (comando.repository !== repositorioPermitido) throw new Error("Repositório não autorizado");
  if (typeof comando.title !== "string" || comando.title.length < 3 || comando.title.length > 120) throw new Error("Título inválido");
  if (typeof comando.body !== "string" || comando.body.length > 12000) throw new Error("Descrição inválida");
  if (!Array.isArray(comando.changes) || comando.changes.length < 1 || comando.changes.length > 25) throw new Error("Alterações inválidas");

  for (const alteracao of comando.changes) {
    if (!alteracao || typeof alteracao.path !== "string" || typeof alteracao.content !== "string") throw new Error("Arquivo inválido");
    if (!/^(src|docs|tests|supabase\/migrations)\//.test(alteracao.path) && alteracao.path !== "index.html") {
      throw new Error("Caminho fora da lista permitida");
    }
    if (alteracao.path.includes("..") || alteracao.content.length > 262144) throw new Error("Conteúdo inválido");
  }

  return comando as ComandoGithub;
};

const github = async (token: string, path: string, init: RequestInit = {}) => {
  const resposta = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers ?? {}),
    },
  });
  if (!resposta.ok) throw new Error(`GitHub respondeu ${resposta.status}`);
  return await resposta.json();
};

serve(async (requisicao) => {
  const origem = requisicao.headers.get("Origin");
  if (requisicao.method === "OPTIONS") return new Response("ok", { headers: cabecalhosCors(origem) });
  if (requisicao.method !== "POST") return respostaJson(405, { erro: "Método não permitido" }, origem);
  if (origem && !origemPermitida(origem)) return respostaJson(403, { erro: "Origem não autorizada" }, origem);

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const githubToken = Deno.env.get("GITHUB_TOKEN") ?? "";
  const repositorioPermitido = Deno.env.get("GITHUB_ALLOWED_REPOSITORY") ?? "";

  if (!url || !anon || !serviceRole || !githubToken || !repositorioPermitido) {
    return respostaJson(500, { erro: "Executor não configurado" }, origem);
  }

  const clienteUsuario = createClient(url, anon, {
    global: { headers: { Authorization: requisicao.headers.get("Authorization") ?? "" } },
  });
  const { data: autenticacao, error: erroAutenticacao } = await clienteUsuario.auth.getUser();
  if (erroAutenticacao || !autenticacao.user) return respostaJson(401, { erro: "Não autorizado" }, origem);

  const corpo = await requisicao.json().catch(() => null) as { approval_request_id?: string } | null;
  if (!corpo?.approval_request_id) return respostaJson(400, { erro: "approval_request_id é obrigatório" }, origem);

  const { data: solicitacao, error: erroClaim } = await clienteUsuario.rpc("claim_approved_command", {
    p_approval_id: corpo.approval_request_id,
  });
  if (erroClaim || !solicitacao) return respostaJson(409, { erro: erroClaim?.message ?? "Solicitação indisponível" }, origem);

  const administrador = createClient(url, serviceRole);
  try {
    if (solicitacao.command_type !== "github_change") throw new Error("Tipo de comando não suportado");
    const comando = validarComando(solicitacao.payload, repositorioPermitido);
    const branch = `agent/${solicitacao.id}`;

    const referencia = await github(githubToken, `/repos/${comando.repository}/git/ref/heads/main`);
    const commitBase = await github(githubToken, `/repos/${comando.repository}/git/commits/${referencia.object.sha}`);
    const blobs = await Promise.all(comando.changes.map(async (alteracao) => {
      const blob = await github(githubToken, `/repos/${comando.repository}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: alteracao.content, encoding: "utf-8" }),
      });
      return { path: alteracao.path, mode: "100644", type: "blob", sha: blob.sha };
    }));
    const arvore = await github(githubToken, `/repos/${comando.repository}/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: commitBase.tree.sha, tree: blobs }),
    });
    const commit = await github(githubToken, `/repos/${comando.repository}/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message: `feat(executor): ${comando.title}`, tree: arvore.sha, parents: [referencia.object.sha] }),
    });
    await github(githubToken, `/repos/${comando.repository}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }),
    });
    const pr = await github(githubToken, `/repos/${comando.repository}/pulls`, {
      method: "POST",
      body: JSON.stringify({ title: comando.title, head: branch, base: "main", body: comando.body, draft: true }),
    });

    await administrador.from("approval_requests").update({
      status: "EXECUTED",
      executed_at: new Date().toISOString(),
      execution_result: { branch, commit_sha: commit.sha, pull_request_url: pr.html_url },
    }).eq("id", solicitacao.id);
    await administrador.from("audit_events").insert({
      organization_id: solicitacao.organization_id,
      actor_id: autenticacao.user.id,
      approval_request_id: solicitacao.id,
      event_type: "executor.github_change.executed",
      outcome: "SUCCESS",
      metadata: { branch, commit_sha: commit.sha, pull_request_url: pr.html_url },
    });

    return respostaJson(201, { branch, pull_request_url: pr.html_url, commit_sha: commit.sha }, origem);
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "Falha desconhecida";
    await administrador.from("approval_requests").update({
      status: "FAILED",
      executed_at: new Date().toISOString(),
      execution_result: { error: mensagem },
    }).eq("id", solicitacao.id);
    await administrador.from("audit_events").insert({
      organization_id: solicitacao.organization_id,
      actor_id: autenticacao.user.id,
      approval_request_id: solicitacao.id,
      event_type: "executor.github_change.failed",
      outcome: "FAILURE",
      metadata: { error: mensagem },
    });
    return respostaJson(500, { erro: "Execução falhou; evento registrado" }, origem);
  }
});
