import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef } from "react";
import { friendlyError } from "@/lib/friendly-error";
// XLSX é carregado sob demanda (lazy) para reduzir o bundle inicial (~400KB gzip)
const loadXLSX = () => import("xlsx");
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/flux/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileUploadDropzone } from "@/components/flux/FileUploadDropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Sparkles,
  Pencil,
  Trash2,
  Layers,
} from "lucide-react";

import {
  stagearImportacao,
  confirmarImportacao,
  listarImportacoes,
  listarLinhasImportacao,
  atualizarLinhaImportacao,
  excluirLinhaImportacao,
  descartarLinhasComErro,
} from "@/lib/integracao-dados.functions";
import { sugerirMapeamentoIA } from "@/lib/mapeamento-ia.functions";
import { converterConteudoIA } from "@/lib/conversao-ia.functions";
import {
  MODULOS,
  CATEGORIAS,
  LIMITE_LINHAS,
  modulosPorCategoria,
  type ModuloIntegracao,
} from "@/lib/integracao-dados.schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/flux/EmptyState";
import { PontoApoioIntegracao } from "@/components/flux/PontoApoioIntegracao";


export const Route = createFileRoute("/_authenticated/implantacao/integracao-dados")({
  head: () => ({
    meta: [
      { title: "Integração de Dados · FLUX" },
      {
        name: "description",
        content:
          "Migre cadastros, estrutura industrial, pessoas e saldos financeiros para o FLUX via Excel, CSV ou PDF, com conversão automática para a planilha padrão.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: IntegracaoDados,
});

async function extrairTextoPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const partes: string[] = [];
  const max = Math.min(doc.numPages, 60);
  for (let p = 1; p <= max; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const linhas = new Map<number, string[]>();
    for (const item of content.items as Array<{ str?: string; transform?: number[] }>) {
      if (!item.str?.trim()) continue;
      const y = Math.round((item.transform?.[5] ?? 0) / 3);
      const arr = linhas.get(y) ?? [];
      arr.push(item.str);
      linhas.set(y, arr);
    }
    const ordenadas = Array.from(linhas.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([, cols]) => cols.join(" | "));
    partes.push(ordenadas.join("\n"));
  }
  return partes.join("\n");
}

function IntegracaoDados() {
  const qc = useQueryClient();
  const [moduloSelecionado, setModuloSelecionado] = useState<ModuloIntegracao | null>(null);
  const [importacaoAberta, setImportacaoAberta] = useState<string | null>(null);
  const [somenteErros, setSomenteErros] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [etapa, setEtapa] = useState<string>("");

  const stagearFn = useServerFn(stagearImportacao);
  const confirmarFn = useServerFn(confirmarImportacao);
  const listarFn = useServerFn(listarImportacoes);
  const listarLinhasFn = useServerFn(listarLinhasImportacao);
  const sugerirIAFn = useServerFn(sugerirMapeamentoIA);
  const converterIAFn = useServerFn(converterConteudoIA);
  const atualizarLinhaFn = useServerFn(atualizarLinhaImportacao);
  const excluirLinhaFn = useServerFn(excluirLinhaImportacao);
  const descartarErrosFn = useServerFn(descartarLinhasComErro);

  // Excedente de linhas: aguarda autorização do usuário para dividir em lotes
  const [excedente, setExcedente] = useState<{
    modulo: ModuloIntegracao;
    rows: Record<string, unknown>[];
    arquivoNome: string;
    arquivoPath?: string;
  } | null>(null);

  // Edição de linha do staging
  const [linhaEditando, setLinhaEditando] = useState<{
    id: string;
    modulo: ModuloIntegracao;
    dados: Record<string, string>;
  } | null>(null);

  const { data: importacoes = [] } = useQuery({
    queryKey: ["importacoes"],
    queryFn: () => listarFn(),
  });

  const { data: linhas = [] } = useQuery({
    queryKey: ["importacao-linhas", importacaoAberta, somenteErros],
    queryFn: () =>
      importacaoAberta
        ? listarLinhasFn({ data: { importacaoId: importacaoAberta, somenteErros } })
        : Promise.resolve([]),
    enabled: !!importacaoAberta,
  });

  function recarregarStaging() {
    qc.invalidateQueries({ queryKey: ["importacoes"] });
    qc.invalidateQueries({ queryKey: ["importacao-linhas"] });
  }

  const confirmar = useMutation({
    mutationFn: (importacaoId: string) => confirmarFn({ data: { importacaoId } }),
    onSuccess: (r) => {
      toast.success(
        `${r.importadas} registros importados${r.falhas ? `, ${r.falhas} falhas` : ""}.`,
      );
      recarregarStaging();
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const salvarLinha = useMutation({
    mutationFn: (p: { linhaId: string; dados: Record<string, unknown> }) =>
      atualizarLinhaFn({ data: p }),
    onSuccess: (r) => {
      if (r.valida) toast.success("Linha corrigida e validada.");
      else toast.warning(`Ainda com erro: ${r.erros.join("; ")}`);
      setLinhaEditando(null);
      recarregarStaging();
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const excluirLinha = useMutation({
    mutationFn: (linhaId: string) => excluirLinhaFn({ data: { linhaId } }),
    onSuccess: () => {
      toast.success("Linha removida da importação.");
      recarregarStaging();
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const descartarErros = useMutation({
    mutationFn: (importacaoId: string) => descartarErrosFn({ data: { importacaoId } }),
    onSuccess: () => {
      toast.success("Linhas com erro descartadas.");
      recarregarStaging();
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });


  function abasDoModulo(modulo: ModuloIntegracao) {
    const schema = MODULOS[modulo];
    const header = schema.campos.map((c) => c.label);
    const exemplo = schema.campos.map((c) => c.exemplo ?? "");
    const instr: (string | number)[][] = [
      [`FLUX — Planilha oficial: ${schema.titulo}`],
      [schema.descricao],
      [""],
      ["Campo", "Obrigatório", "Tipo", "Descrição / Valores aceitos", "Exemplo"],
      ...schema.campos.map((c) => [
        c.label,
        c.obrigatorio ? "Sim" : "Não",
        c.tipo === "enum" ? `enum (${c.enumValores?.join(" | ")})` : c.tipo,
        c.descricao ?? "",
        c.exemplo ?? "",
      ]),
      [""],
      ["Regras gerais:"],
      ["- Preencha apenas a aba 'Dados'. A linha 1 é o cabeçalho, comece a partir da linha 2."],
      ["- Não altere os cabeçalhos."],
      ["- Datas: AAAA-MM-DD ou DD/MM/AAAA. Números: 1250.90 ou 1.250,90."],
      [`- Chave única deste módulo: ${schema.chaveUnica} (duplicidades são rejeitadas).`],
      ["- Nada é gravado nos módulos operacionais até você aprovar o staging."],
      ...(schema.dicas ?? []).map((d) => [`- ${d}`]),
    ];
    return { header, exemplo, instr, schema };
  }

  async function baixarTemplate(modulo: ModuloIntegracao) {
    const XLSX = await loadXLSX();
    const { header, exemplo, instr, schema } = abasDoModulo(modulo);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([header, exemplo]), "Dados");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(instr), "Instruções");
    XLSX.writeFile(wb, `flux_${schema.id}_modelo.xlsx`);
  }

  async function baixarTodosTemplates() {
    const XLSX = await loadXLSX();
    const wb = XLSX.utils.book_new();
    const indice: (string | number)[][] = [
      ["FLUX — Pacote de implantação (planilhas oficiais)"],
      [""],
      ["Ordem", "Módulo", "Categoria", "Aba", "Campos obrigatórios"],
    ];
    const ordenados = Object.values(MODULOS).sort((a, b) => a.ordem - b.ordem);
    for (const m of ordenados) {
      const { header, exemplo } = abasDoModulo(m.id);
      const aba = m.id.slice(0, 28);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([header, exemplo]), aba);
      indice.push([
        m.ordem,
        m.titulo,
        m.categoria,
        aba,
        m.campos
          .filter((c) => c.obrigatorio)
          .map((c) => c.label)
          .join(", "),
      ]);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(indice), "Índice");
    XLSX.writeFile(wb, "flux_pacote_implantacao.xlsx");
    toast.success("Pacote completo gerado. Preencha uma aba por módulo e envie separadamente.");
  }

  async function processarArquivo(modulo: ModuloIntegracao, file: File) {
    setEnviando(true);
    try {
      // 1) upload para bucket (auditoria) — não bloqueante se falhar
      setEtapa("Enviando arquivo…");
      let arquivoPath: string | undefined;
      try {
        const { data: userData } = await supabase.auth.getUser();
        const { data: prof } = await supabase
          .from("profiles")
          .select("tenant_id")
          .eq("id", userData.user!.id)
          .maybeSingle();
        if (prof?.tenant_id) {
          const path = `${prof.tenant_id}/${crypto.randomUUID()}/${file.name}`;
          const { error } = await supabase.storage.from("importacoes").upload(path, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });
          if (!error) arquivoPath = path;
        }
      } catch {
        /* ignora falha de upload; parsing prossegue */
      }

      const ehPdf = /\.pdf$/i.test(file.name) || file.type === "application/pdf";
      let rows: Record<string, unknown>[] = [];

      if (ehPdf) {
        // 2a) PDF → texto → conversão IA para o layout padrão
        setEtapa("Lendo o PDF…");
        const texto = await extrairTextoPdf(file);
        if (texto.trim().length < 20) {
          throw new Error(
            "Não foi possível extrair texto deste PDF (provavelmente é digitalizado). Envie em Excel/CSV ou gere um PDF pesquisável.",
          );
        }
        setEtapa("Convertendo com IA para a planilha padrão…");
        const conv = await converterIAFn({
          data: { modulo, conteudo: texto, origem: "pdf" },
        });
        rows = conv.linhas as Record<string, unknown>[];
        if (rows.length === 0) throw new Error("A IA não encontrou linhas de dados neste PDF.");
        toast.success(`IA extraiu ${rows.length} linha(s) do PDF.`);
      } else {
        // 2b) Excel/CSV — parse client-side (XLSX lazy-loaded)
        setEtapa("Lendo a planilha…");
        const XLSX = await loadXLSX();
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array", cellDates: true });
        const sheet = wb.Sheets["Dados"] ?? wb.Sheets[wb.SheetNames[0]];
        if (!sheet) throw new Error("Planilha vazia ou aba 'Dados' ausente.");
        rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null });
        if (rows.length === 0) throw new Error("Nenhuma linha encontrada na planilha.");
        // limite de linhas é tratado adiante (aviso + divisão em lotes autorizada)

        // 2.1) IA: se houver cabeçalhos que não batem com o modelo, sugerir mapeamento
        const schema = MODULOS[modulo];
        const validos = new Set<string>();
        schema.campos.forEach((c) => {
          validos.add(c.nome);
          validos.add(c.label);
        });
        const cabecalhos = Object.keys(rows[0] ?? {});
        const desconhecidos = cabecalhos.filter((h) => !validos.has(h));
        if (desconhecidos.length > 0) {
          setEtapa("Adequando colunas com IA…");
          try {
            const { mapeamentos } = await sugerirIAFn({
              data: { modulo, cabecalhos: desconhecidos },
            });
            const renomear = new Map<string, string>();
            for (const m of mapeamentos) {
              if (m.destino && m.confianca >= 0.6) renomear.set(m.origem, m.destino);
            }
            if (renomear.size > 0) {
              for (let i = 0; i < rows.length; i++) {
                const orig = rows[i];
                const novo: Record<string, unknown> = {};
                for (const k of Object.keys(orig)) novo[renomear.get(k) ?? k] = orig[k];
                rows[i] = novo;
              }
              toast.success(`IA mapeou ${renomear.size} coluna(s) automaticamente.`);
            }
          } catch (e) {
            console.warn("[integracao-dados] mapeamento IA falhou, seguindo sem:", e);
          }
        }
      }

      // 3) limite por importação → pede autorização para dividir em lotes
      if (rows.length > LIMITE_LINHAS) {
        setExcedente({ modulo, rows, arquivoNome: file.name, arquivoPath });
        return;
      }

      // 4) stagear no servidor
      setEtapa("Validando linhas…");
      const r = await stagearFn({
        data: { modulo, arquivoNome: file.name, arquivoPath, linhas: rows },
      });
      toast.success(
        `Importação criada: ${r.total} linhas (${r.validas} válidas, ${r.comErro} com erro).`,
      );
      setImportacaoAberta(r.importacaoId);
      setModuloSelecionado(null);
      qc.invalidateQueries({ queryKey: ["importacoes"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : friendlyError(e, "Falha ao processar arquivo."));
    } finally {
      setEnviando(false);
      setEtapa("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  /** Envia um volume acima do limite dividido em lotes sequenciais. */
  async function enviarEmLotes() {
    if (!excedente) return;
    const { modulo, rows, arquivoNome, arquivoPath } = excedente;
    setExcedente(null);
    setEnviando(true);
    const total = Math.ceil(rows.length / LIMITE_LINHAS);
    let primeira: string | null = null;
    try {
      for (let i = 0; i < total; i++) {
        const fatia = rows.slice(i * LIMITE_LINHAS, (i + 1) * LIMITE_LINHAS);
        setEtapa(`Validando lote ${i + 1} de ${total} (${fatia.length} linhas)…`);
        const r = await stagearFn({
          data: {
            modulo,
            arquivoNome: `${arquivoNome} — lote ${i + 1}/${total}`,
            arquivoPath,
            linhas: fatia,
          },
        });
        if (!primeira) primeira = r.importacaoId;
      }
      toast.success(`${rows.length} linhas enviadas em ${total} lote(s). Revise e aprove cada um.`);
      if (primeira) setImportacaoAberta(primeira);
      setModuloSelecionado(null);
      qc.invalidateQueries({ queryKey: ["importacoes"] });
    } catch (e) {
      toast.error(friendlyError(e, "Falha ao enviar os lotes."));
    } finally {
      setEnviando(false);
      setEtapa("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function abrirEdicao(l: { id: string; dados: unknown }, modulo: ModuloIntegracao) {
    const dados = (l.dados ?? {}) as Record<string, unknown>;
    const iniciais: Record<string, string> = {};
    for (const c of MODULOS[modulo].campos) {
      const v = dados[c.nome];
      iniciais[c.nome] = v === undefined || v === null ? "" : String(v);
    }
    setLinhaEditando({ id: l.id, modulo, dados: iniciais });
  }


  const impAberta = importacoes.find((i) => i.id === importacaoAberta);

  return (
    <div>
      <PageHeader
        title="Integração de Dados"
        description="Baixe as planilhas oficiais do FLUX, preencha com seus dados reais e envie em Excel, CSV ou PDF. A IA adequa o conteúdo ao padrão do sistema antes da validação."
        crumbs={[
          { label: "Central de Implantação", to: "/central-implantacao" },
          { label: "Integração de Dados" },
        ]}
        help="Fluxo: 1) baixar modelo · 2) preencher · 3) enviar (xlsx, csv ou pdf) · 4) validar · 5) aprovar. Nada é gravado até a aprovação final."
      />

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Ambiente seguro</AlertTitle>
          <AlertDescription>
            Arquivos são armazenados em bucket privado isolado por empresa, com criptografia em
            repouso, políticas RLS e logs. Nenhum dado é gravado nos módulos operacionais sem
            aprovação explícita.
          </AlertDescription>
        </Alert>

        {!importacaoAberta && (
          <>
            <PontoApoioIntegracao
              onBaixarModelo={baixarTemplate}
              onBaixarTodos={baixarTodosTemplates}
            />

            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Aceita qualquer formato de origem</AlertTitle>
              <AlertDescription>
                Excel (.xlsx/.xls), CSV e PDF pesquisável. Colunas com nomes diferentes são
                reconhecidas automaticamente; PDFs são extraídos e convertidos para a planilha
                padrão do módulo antes da validação.
              </AlertDescription>
            </Alert>

            {enviando && (
              <div className="flex items-center gap-2 rounded-md border bg-muted/40 p-3 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {etapa || "Processando…"}
              </div>
            )}

            {CATEGORIAS.map((cat) => {
              const mods = modulosPorCategoria(cat);
              if (mods.length === 0) return null;
              return (
                <div key={cat}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mods.map((m) => (
                      <Card key={m.id} className="flex flex-col border-border hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-start gap-2 text-base">
                            <FileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span className="flex-1">{m.titulo}</span>
                            <Badge variant="outline" className="shrink-0 text-[10px]">
                              #{m.ordem}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="line-clamp-2 min-h-[40px]">{m.descricao}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                          <FileUploadDropzone
                            compact
                            loading={enviando && moduloSelecionado === m.id}
                            title="Enviar dados"
                            description="Excel, CSV ou PDF"
                            onFileSelect={(f) => {
                              setModuloSelecionado(m.id);
                              processarArquivo(m.id, f);
                            }}
                          />
                        </CardContent>
                        <CardFooter className="pt-0 border-t bg-muted/30 px-4 py-2 flex justify-between">
                           <Button size="sm" variant="ghost" className="h-8 text-xs px-2" onClick={() => baixarTemplate(m.id)}>
                            <Download className="mr-1 h-3 w-3" /> Modelo
                          </Button>
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                            ISO 9001
                          </Badge>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}

            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && moduloSelecionado) processarArquivo(moduloSelecionado, f);
              }}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Histórico de importações</CardTitle>
                <CardDescription>Últimas 50 importações desta empresa.</CardDescription>
              </CardHeader>
              <CardContent>
                {importacoes.length === 0 ? (
                  <EmptyState title="Nenhuma importação ainda" compact />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                          <th className="py-2">Data</th>
                          <th>Módulo</th>
                          <th>Arquivo</th>
                          <th className="text-right">Total</th>
                          <th className="text-right">Válidas</th>
                          <th className="text-right">Erros</th>
                          <th className="text-right">Importadas</th>
                          <th>Status</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {importacoes.map((i) => (
                          <tr key={i.id} className="border-b last:border-0">
                            <td className="py-2 text-xs">
                              {new Date(i.created_at).toLocaleString("pt-BR")}
                            </td>
                            <td>{MODULOS[i.modulo as ModuloIntegracao]?.titulo ?? i.modulo}</td>
                            <td
                              className="max-w-[200px] truncate text-xs"
                              title={i.arquivo_nome ?? ""}
                            >
                              {i.arquivo_nome ?? "—"}
                            </td>
                            <td className="text-right tabular-nums">{i.total_linhas}</td>
                            <td className="text-right tabular-nums text-success">
                              {i.linhas_validas}
                            </td>
                            <td className="text-right tabular-nums text-destructive">
                              {i.linhas_com_erro}
                            </td>
                            <td className="text-right tabular-nums">{i.linhas_importadas}</td>
                            <td>
                              <StatusBadge status={i.status} />
                            </td>
                            <td className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setImportacaoAberta(i.id)}
                              >
                                Abrir
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {importacaoAberta && impAberta && (
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">
                    Importação — {MODULOS[impAberta.modulo as ModuloIntegracao]?.titulo}
                  </CardTitle>
                  <CardDescription>
                    {impAberta.total_linhas} linhas · {impAberta.linhas_validas} válidas ·{" "}
                    {impAberta.linhas_com_erro} com erro · {impAberta.linhas_importadas} importadas
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setImportacaoAberta(null)}>
                    <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Voltar
                  </Button>
                  <Button
                    variant={somenteErros ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSomenteErros((v) => !v)}
                  >
                    {somenteErros ? "Ver todas" : "Ver só erros"}
                  </Button>
                  <Button
                    size="sm"
                    disabled={
                      confirmar.isPending ||
                      impAberta.status === "importada" ||
                      impAberta.linhas_validas === 0
                    }
                    onClick={() => confirmar.mutate(importacaoAberta)}
                  >
                    {confirmar.isPending ? (
                      <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    )}
                    Confirmar importação
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {impAberta.linhas_com_erro > 0 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{impAberta.linhas_com_erro} linha(s) com erro</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>
                      Corrija cada linha aqui mesmo (botão <strong>Editar</strong>), ou descarte as
                      que não devem entrar. Só linhas válidas são gravadas ao confirmar.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={descartarErros.isPending}
                      onClick={() => descartarErros.mutate(impAberta.id)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Descartar todas com erro
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              <div className="max-h-[500px] overflow-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left text-xs uppercase">
                    <tr>
                      <th className="p-2">Linha</th>
                      <th>Status</th>
                      <th>Erro</th>
                      <th>Dados</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((l) => (
                      <tr key={l.id} className="border-t align-top">
                        <td className="p-2 tabular-nums">{l.linha_numero}</td>
                        <td>
                          <StatusBadge status={l.status} />
                        </td>
                        <td className="max-w-[280px] text-xs text-destructive">{l.erro ?? ""}</td>
                        <td className="max-w-[420px] text-xs">
                          <code className="whitespace-pre-wrap break-all text-[11px] text-muted-foreground">
                            {JSON.stringify(l.dados)}
                          </code>
                        </td>
                        <td className="whitespace-nowrap p-2 text-right">
                          {l.status !== "importada" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  abrirEdicao(l, impAberta.modulo as ModuloIntegracao)
                                }
                              >
                                <Pencil className="mr-1 h-3.5 w-3.5" /> Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                                disabled={excluirLinha.isPending}
                                onClick={() => excluirLinha.mutate(l.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {linhas.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-sm text-muted-foreground">
                          Nenhuma linha para exibir.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}


        <Card>
          <CardHeader>
            <CardTitle className="text-base">Como funciona</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
            <Passo n={1} titulo="Baixe o modelo" texto="Planilha oficial com instruções e exemplos." />
            <Passo n={2} titulo="Preencha" texto="Seus dados reais — ou envie o arquivo que já tem." />
            <Passo
              n={3}
              titulo="Envie"
              texto="Excel, CSV ou PDF. A IA adequa colunas e formatos ao padrão."
            />
            <Passo n={4} titulo="Valide" texto="Staging isolado mostra erro linha a linha." />
            <Passo n={5} titulo="Aprove" texto="Só após aprovar os dados vão aos módulos." />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button asChild variant="ghost" size="sm">
            <Link to="/central-implantacao">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Voltar à Central de Implantação
            </Link>
          </Button>
        </div>

        {/* Aviso de limite de linhas — pede autorização para dividir em lotes */}
        <Dialog open={!!excedente} onOpenChange={(o) => !o && setExcedente(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" /> Arquivo acima do limite por importação
              </DialogTitle>
              <DialogDescription>
                O arquivo tem {excedente?.rows.length.toLocaleString("pt-BR")} linhas e o limite é de{" "}
                {LIMITE_LINHAS.toLocaleString("pt-BR")} por importação. Podemos dividir
                automaticamente em{" "}
                {excedente ? Math.ceil(excedente.rows.length / LIMITE_LINHAS) : 0} lote(s)
                sequenciais, preservando a ordem e a integridade — cada lote é revisado e aprovado
                por você. Deseja permitir?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExcedente(null)}>
                Não permitir
              </Button>
              <Button onClick={enviarEmLotes}>Permitir e dividir em lotes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Correção de linha diretamente no staging */}
        <Dialog open={!!linhaEditando} onOpenChange={(o) => !o && setLinhaEditando(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Corrigir linha</DialogTitle>
              <DialogDescription>
                Ajuste apenas os campos com problema e salve — a linha é revalidada na hora, sem
                precisar reenviar a planilha inteira.
              </DialogDescription>
            </DialogHeader>
            {linhaEditando && (
              <div className="grid gap-3 sm:grid-cols-2">
                {MODULOS[linhaEditando.modulo].campos.map((c) => (
                  <div key={c.nome} className="space-y-1">
                    <Label htmlFor={`campo-${c.nome}`} className="text-xs">
                      {c.label}
                      {c.obrigatorio && <span className="text-destructive"> *</span>}
                    </Label>
                    <Input
                      id={`campo-${c.nome}`}
                      value={linhaEditando.dados[c.nome] ?? ""}
                      placeholder={
                        c.tipo === "enum"
                          ? (c.enumValores ?? []).join(" | ")
                          : c.exemplo !== undefined
                            ? String(c.exemplo)
                            : ""
                      }
                      onChange={(e) =>
                        setLinhaEditando((prev) =>
                          prev
                            ? { ...prev, dados: { ...prev.dados, [c.nome]: e.target.value } }
                            : prev,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setLinhaEditando(null)}>
                Cancelar
              </Button>
              <Button
                disabled={salvarLinha.isPending}
                onClick={() =>
                  linhaEditando &&
                  salvarLinha.mutate({ linhaId: linhaEditando.id, dados: linhaEditando.dados })
                }
              >
                {salvarLinha.isPending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                Salvar e revalidar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    enviada: { label: "Enviada", className: "border-info/40 bg-info/10 text-info" },
    em_validacao: { label: "Validando", className: "border-info/40 bg-info/10 text-info" },
    validada: { label: "Validada", className: "border-success/40 bg-success/10 text-success" },
    com_erro: {
      label: "Com erro",
      className: "border-destructive/40 bg-destructive/10 text-destructive",
    },
    importada: { label: "Importada", className: "border-success/40 bg-success/10 text-success" },
    cancelada: {
      label: "Cancelada",
      className: "border-muted-foreground/30 bg-muted text-muted-foreground",
    },
    valida: { label: "Válida", className: "border-success/40 bg-success/10 text-success" },
    pendente: {
      label: "Pendente",
      className: "border-muted-foreground/30 bg-muted text-muted-foreground",
    },
    ignorada: {
      label: "Ignorada",
      className: "border-muted-foreground/30 bg-muted text-muted-foreground",
    },
  };
  const cfg = map[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

function Passo({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {n}
      </div>
      <p className="font-semibold">{titulo}</p>
      <p className="text-xs text-muted-foreground">{texto}</p>
    </div>
  );
}
