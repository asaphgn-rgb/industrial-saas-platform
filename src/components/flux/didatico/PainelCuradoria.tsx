import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, GitCompare, History, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/flux/EmptyState";
import { LoadingState } from "@/components/flux/LoadingState";
import { DiffVersoes } from "@/components/flux/didatico/DiffVersoes";
import { AjustesConteudo } from "@/components/flux/didatico/AjustesConteudo";

import {
  alterarStatusConteudo,
  listarConteudosDidaticos,
  listarRevisoesConteudo,
  usoPorVersaoGuia,
  STATUS_CONTEUDO_LABEL,
  type ConteudoDidatico,
  type StatusConteudo,
} from "@/lib/didatico-curadoria.functions";

const TONE: Record<StatusConteudo, string> = {
  rascunho: "bg-muted text-muted-foreground",
  em_revisao: "bg-flux-warning-soft text-warning",
  aprovado: "bg-flux-success-soft text-success",
  arquivado: "bg-destructive/10 text-destructive",
};

/** Curadoria: aprovação por especialista, histórico e comparação de versões. */
export function PainelCuradoria() {
  const qc = useQueryClient();
  const listar = useServerFn(listarConteudosDidaticos);
  const revisar = useServerFn(alterarStatusConteudo);
  const historico = useServerFn(listarRevisoesConteudo);
  const uso = useServerFn(usoPorVersaoGuia);

  const [filtro, setFiltro] = useState<"todos" | StatusConteudo>("em_revisao");
  const [sel, setSel] = useState<ConteudoDidatico | null>(null);
  const [revisorNome, setRevisorNome] = useState("");
  const [comentario, setComentario] = useState("");
  const [comparar, setComparar] = useState<string>("");

  const conteudos = useQuery({
    queryKey: ["didatico-conteudos", filtro],
    queryFn: () => listar({ data: filtro === "todos" ? {} : { status: filtro } }),
  });

  const revisoes = useQuery({
    queryKey: ["didatico-revisoes", sel?.id ?? "todas"],
    queryFn: () => historico({ data: sel ? { conteudo_id: sel.id } : { limite: 60 } }),
  });

  const versoesDoItem = useQuery({
    queryKey: ["didatico-versoes", sel?.tipo, sel?.chave],
    enabled: !!sel,
    queryFn: () => listar({ data: { tipo: sel!.tipo, chave: sel!.chave } }),
  });

  const usoVersoes = useQuery({
    queryKey: ["didatico-uso-versao", sel?.chave ?? ""],
    enabled: !!sel,
    queryFn: () => {
      const [etapa, codigo] = (sel?.chave ?? "").split("::");
      return uso({ data: { etapa, problema_codigo: codigo } });
    },
  });

  const mudar = useMutation({
    mutationFn: (status: StatusConteudo) =>
      revisar({ data: { id: sel!.id, status, comentario, revisor_nome: revisorNome } }),
    onSuccess: () => {
      toast.success("Status atualizado e registrado no histórico.");
      setComentario("");
      qc.invalidateQueries({ queryKey: ["didatico-conteudos"] });
      qc.invalidateQueries({ queryKey: ["didatico-revisoes"] });
      setSel(null);
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível alterar o status."),
  });

  const outra = versoesDoItem.data?.find((v) => v.id === comparar);

  // Campos do rascunho — alimentam o seletor "campo alvo" dos ajustes.
  const camposDoConteudo = useMemo(() => {
    const c = sel?.conteudo as Record<string, unknown> | undefined;
    return c && typeof c === "object" ? Object.keys(c) : [];
  }, [sel]);


  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            Fila de curadoria
          </CardTitle>
          <CardDescription>
            Conteúdo só chega ao operador depois de aprovado por um especialista.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="em_revisao">Em revisão</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>

          {conteudos.isLoading && <LoadingState variant="list" />}
          {conteudos.data?.length === 0 && (
            <EmptyState title="Nada nesta fila" description="Importe ou crie uma versão." compact />
          )}
          <div className="space-y-2">
            {conteudos.data?.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSel(c);
                  setComparar("");
                }}
                className={`w-full rounded-lg border p-3 text-left text-sm transition ${
                  sel?.id === c.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="min-w-0 font-medium">{c.titulo}</span>
                  <Badge variant="secondary" className={TONE[c.status]}>
                    {STATUS_CONTEUDO_LABEL[c.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.chave} · v{c.versao} · {c.fontes?.length ?? 0} fonte(s) · origem {c.origem}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              Revisão do especialista
            </CardTitle>
            <CardDescription>
              {sel ? `${sel.titulo} · versão ${sel.versao}` : "Selecione um conteúdo na fila."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!sel && <EmptyState title="Nenhum conteúdo selecionado" compact />}
            {sel && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="rev" className="text-xs">
                      Especialista responsável
                    </Label>
                    <Input
                      id="rev"
                      value={revisorNome}
                      onChange={(e) => setRevisorNome(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="com" className="text-xs">
                      Comentário da revisão
                    </Label>
                    <Input
                      id="com"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="h-11"
                    disabled={mudar.isPending}
                    onClick={() => mudar.mutate("aprovado")}
                  >
                    Aprovar
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11"
                    disabled={mudar.isPending}
                    onClick={() => mudar.mutate("em_revisao")}
                  >
                    Enviar para revisão
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-11"
                    disabled={mudar.isPending}
                    onClick={() => mudar.mutate("arquivado")}
                  >
                    Arquivar
                  </Button>
                </div>

                <div className="space-y-2 rounded-lg border border-border p-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <GitCompare className="h-3.5 w-3.5" aria-hidden /> Comparar com outra versão
                  </p>
                  <Select value={comparar} onValueChange={setComparar}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Escolha a versão base" />
                    </SelectTrigger>
                    <SelectContent>
                      {versoesDoItem.data
                        ?.filter((v) => v.id !== sel.id)
                        .map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            v{v.versao} · {STATUS_CONTEUDO_LABEL[v.status]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {outra && (
                    <DiffVersoes
                      base={outra.conteudo}
                      novo={sel.conteudo}
                      rotuloBase={`v${outra.versao} (base)`}
                      rotuloNovo={`v${sel.versao} (selecionada)`}
                    />
                  )}
                </div>

                <AjustesConteudo conteudoId={sel.id} campos={camposDoConteudo} />


                {!!usoVersoes.data?.length && (
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Uso por versão do guia
                    </p>
                    <ul className="mt-2 space-y-1 text-xs">
                      {usoVersoes.data.map((u) => (
                        <li key={u.versao}>
                          <strong>v{u.versao || "—"}</strong>: {u.tentativas} tentativa(s),{" "}
                          {u.resolvidas} resolvida(s)
                          {u.operadores.length ? ` · ${u.operadores.join(", ")}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <History className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              Histórico de mudanças
            </CardTitle>
            <CardDescription>Trilha completa de status, autor e comentário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {revisoes.data?.length === 0 && <EmptyState title="Sem movimentações." compact />}
            {revisoes.data?.map((r) => (
              <div key={r.id} className="rounded-lg border border-border p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("pt-BR")}
                    {r.autor_nome ? ` · ${r.autor_nome}` : ""}
                  </span>
                  <span>
                    {r.status_anterior ? `${r.status_anterior} → ` : ""}
                    <strong>{r.status_novo}</strong>
                  </span>
                </div>
                {r.comentario && <p className="mt-1">{r.comentario}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
