import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/flux/LoadingState";
import { EmptyState } from "@/components/flux/EmptyState";
import { CheckCircle2, Lock, Send, Undo2, GitCompare } from "lucide-react";
import {
  statusRegrasGrau,
  transicionarRegrasGrau,
  listarRevisoesGrau,
  auditarPrecificacoes,
  type StatusRegrasInfo,
} from "@/lib/precificacao-governanca.functions";
import { listarPrecificacoes } from "@/lib/precificacao.functions";

const num = (v: unknown, d = 2) =>
  typeof v === "number" && Number.isFinite(v)
    ? v.toLocaleString("pt-BR", { maximumFractionDigits: d })
    : String(v ?? "—");
const dataBr = (iso: string) => new Date(iso).toLocaleString("pt-BR");

const ROTULO_STATUS: Record<string, string> = {
  rascunho: "Rascunho",
  em_revisao: "Em revisão",
  aprovado: "Aprovado",
};

/** Faixa superior com o status das regras — usada também na aba Calcular. */
export function StatusRegrasBanner({ status }: { status?: StatusRegrasInfo }) {
  if (!status) return null;
  if (status.podeRecalcular) {
    return (
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>
          Regras de Grau aprovadas {status.configurado ? `· versão ${status.versao}` : "(padrão de mercado)"}
        </AlertTitle>
        <AlertDescription className="text-sm">
          Recálculos e gravações liberados
          {status.aprovadoEm ? ` — aprovado em ${dataBr(status.aprovadoEm)}.` : "."}
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="destructive">
      <Lock className="h-4 w-4" />
      <AlertTitle>Recálculo travado · {ROTULO_STATUS[status.status]}</AlertTitle>
      <AlertDescription className="text-sm">{status.motivoTrava}</AlertDescription>
    </Alert>
  );
}

export function useStatusRegras() {
  const fn = useServerFn(statusRegrasGrau);
  return useQuery({ queryKey: ["graus-status"], queryFn: () => fn({}), staleTime: 15_000 });
}

/** Fluxo rascunho → em revisão → aprovado, com histórico de versões. */
export function AbaAprovacao() {
  const qc = useQueryClient();
  const transicionar = useServerFn(transicionarRegrasGrau);
  const listarRev = useServerFn(listarRevisoesGrau);
  const status = useStatusRegras();
  const [obs, setObs] = useState("");

  const revisoes = useQuery({
    queryKey: ["graus-revisoes"],
    queryFn: () => listarRev({}),
    staleTime: 15_000,
  });

  const m = useMutation({
    mutationFn: (destino: "rascunho" | "em_revisao" | "aprovado") =>
      transicionar({ data: { destino, observacao: obs || null } }),
    onSuccess: (s) => {
      setObs("");
      toast.success(`Regras agora em: ${ROTULO_STATUS[s.status]}.`);
      qc.invalidateQueries({ queryKey: ["graus-status"] });
      qc.invalidateQueries({ queryKey: ["graus-revisoes"] });
      qc.invalidateQueries({ queryKey: ["graus-config"] });
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível alterar o status."),
  });

  const s = status.data;

  return (
    <div className="space-y-4">
      <StatusRegrasBanner status={s} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Fluxo de aprovação das regras (Grau 01–04)</CardTitle>
          <CardDescription>
            Toda edição das regras volta para rascunho e trava os recálculos até nova aprovação.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {(["rascunho", "em_revisao", "aprovado"] as const).map((etapa) => (
              <Badge
                key={etapa}
                variant={s?.status === etapa ? "default" : "outline"}
                className="px-3 py-1"
              >
                {ROTULO_STATUS[etapa]}
              </Badge>
            ))}
          </div>
          <Textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Observação da revisão (opcional) — ex.: percentuais validados com o comercial."
            className="min-h-[80px] text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => m.mutate("em_revisao")}
              disabled={m.isPending || !s?.configurado || s?.status === "em_revisao"}
            >
              <Send className="mr-2 h-4 w-4" /> Enviar para revisão
            </Button>
            <Button
              size="sm"
              onClick={() => m.mutate("aprovado")}
              disabled={m.isPending || !s?.configurado || s?.status === "aprovado"}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Aprovar versão
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => m.mutate("rascunho")}
              disabled={m.isPending || !s?.configurado || s?.status === "rascunho"}
            >
              <Undo2 className="mr-2 h-4 w-4" /> Reabrir para ajustes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Histórico por empresa</CardTitle>
          <CardDescription>Cada movimento guarda a versão, o autor e o conteúdo das faixas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {revisoes.isLoading ? (
            <LoadingState variant="card" />
          ) : !(revisoes.data ?? []).length ? (
            <EmptyState
              title="Sem revisões registradas"
              description="Salve as regras de grau para iniciar o histórico."
            />
          ) : (
            (revisoes.data ?? []).map((r) => (
              <div key={r.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">v{r.versao}</Badge>
                  <Badge variant="secondary">{ROTULO_STATUS[r.status] ?? r.status}</Badge>
                  <span className="text-xs uppercase text-muted-foreground">{r.acao}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.autor} · {dataBr(r.criadoEm)}
                  </span>
                </div>
                {r.observacao && <p className="mt-2 text-sm">{r.observacao}</p>}
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {r.snapshot.map((g) => (
                    <Badge key={g.grau} variant="outline" className="font-mono">
                      Grau 0{g.grau}: +{num(g.acrescimoPct)}% ({num(g.faixaMinPct)}–{num(g.faixaMaxPct)}%)
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/** Auditoria detalhada dos parâmetros usados em cada precificação, com diff. */
export function AbaAuditoria() {
  const listar = useServerFn(listarPrecificacoes);
  const auditar = useServerFn(auditarPrecificacoes);
  const [sel, setSel] = useState<string[]>([]);

  const hist = useQuery({
    queryKey: ["precificacoes"],
    queryFn: () => listar({}),
    staleTime: 30_000,
  });

  const detalhe = useQuery({
    queryKey: ["precificacoes-auditoria", sel],
    queryFn: () => auditar({ data: { ids: sel } }),
    enabled: sel.length > 0,
  });

  const linhas = useMemo(() => {
    const itens = detalhe.data ?? [];
    if (!itens.length) return [];
    const chaves = Array.from(
      new Set(itens.flatMap((i) => [...Object.keys(i.parametros), ...Object.keys(i.resultado)])),
    ).filter((k) => k !== "avisos");
    return chaves.map((k) => {
      const valores = itens.map((i) => {
        const v = (i.parametros as Record<string, unknown>)[k] ?? (i.resultado as Record<string, unknown>)[k];
        return v === undefined || v === null ? "—" : typeof v === "number" ? num(v, 4) : String(v);
      });
      return { chave: k, valores, mudou: valores.length === 2 && valores[0] !== valores[1] };
    });
  }, [detalhe.data]);

  function alternar(id: string) {
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id].slice(-2)));
  }

  if (hist.isLoading) return <LoadingState variant="page" />;
  const rows = hist.data ?? [];
  if (!rows.length)
    return (
      <EmptyState
        title="Sem precificações para auditar"
        description="Calcule e salve um preço para registrar os parâmetros usados."
      />
    );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Precificações</CardTitle>
          <CardDescription>Selecione uma para auditar ou duas para comparar versões.</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[520px] space-y-2 overflow-auto">
          {rows.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => alternar(p.id)}
              className={`w-full rounded-md border p-3 text-left text-sm transition ${
                sel.includes(p.id) ? "border-primary bg-primary/5" : "hover:bg-muted/40"
              }`}
            >
              <div className="font-medium">{p.descricao}</div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Grau 0{p.grau} · +{num(p.acrescimoPct)}%</span>
                <span>R$ {num(p.precoKg, 4)}/kg</span>
                <span>{dataBr(p.criadoEm)}</span>
                <span>{p.autor}</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompare className="h-4 w-4" />
            {sel.length === 2 ? "Diff entre versões" : "Parâmetros usados"}
          </CardTitle>
          <CardDescription>
            Grau aplicado, faixas, conversões Kg ↔ Milheiro e custos — exatamente como foram gravados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sel.length ? (
            <EmptyState
              title="Nenhuma precificação selecionada"
              description="Escolha um item à esquerda para ver a rastreabilidade completa."
            />
          ) : detalhe.isLoading ? (
            <LoadingState variant="card" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-muted-foreground">
                    <th className="py-2 text-left">Parâmetro</th>
                    {(detalhe.data ?? []).map((d) => (
                      <th key={d.id} className="py-2 text-right">
                        {d.descricao} · {dataBr(d.criadoEm)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((l) => (
                    <tr
                      key={l.chave}
                      className={`border-b last:border-0 ${l.mudou ? "bg-warning/10" : ""}`}
                    >
                      <td className="py-2 font-mono text-xs">{l.chave}</td>
                      {l.valores.map((v, i) => (
                        <td key={i} className="py-2 text-right font-mono tabular-nums">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
