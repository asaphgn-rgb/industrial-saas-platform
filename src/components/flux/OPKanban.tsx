import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as typed } from "@/lib/supabase";
import { PageHeader } from "@/components/flux/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Calendar, Package, GripVertical } from "lucide-react";
import { useState, type DragEvent } from "react";
import { haptic } from "@/lib/haptic";

import { friendlyError } from "@/lib/friendly-error";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typed as any;

type OP = {
  id: string;
  numero: string;
  status: string;
  prioridade: string | null;
  quantidade_planejada: number | null;
  quantidade_produzida: number | null;
  data_prazo: string | null;
  produto_id: string | null;
};

const COLUNAS: { key: string; label: string; cls: string }[] = [
  { key: "aberta", label: "Aberta", cls: "bg-muted/40" },
  { key: "em_producao", label: "Em produção", cls: "bg-warning/10" },
  { key: "pausada", label: "Pausada", cls: "bg-warning/5" },
  { key: "concluida", label: "Concluída", cls: "bg-success/10" },
];

const ORDEM = COLUNAS.map((c) => c.key);

const PRIO_CLS: Record<string, string> = {
  baixa: "border-muted-foreground/30 text-muted-foreground",
  normal: "border-border",
  alta: "border-warning/40 bg-warning/10 text-warning",
  urgente: "border-destructive/40 bg-destructive/10 text-destructive",
};

const DRAG_MIME = "application/x-flux-op";

export function OPKanban() {
  const qc = useQueryClient();
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["op-kanban"],
    queryFn: async () => {
      const [ops, prods] = await Promise.all([
        supabase
          .from("ordens_producao")
          .select(
            "id, numero, status, prioridade, quantidade_planejada, quantidade_produzida, data_prazo, produto_id",
          )
          .in("status", ORDEM)
          .order("data_prazo", { ascending: true, nullsFirst: false })
          .limit(400),
        supabase.from("produtos").select("id, codigo, descricao"),
      ]);
      const prodMap = new Map(
        ((prods.data ?? []) as { id: string; codigo: string; descricao: string }[]).map((p) => [
          p.id,
          p,
        ]),
      );
      return { ops: (ops.data ?? []) as OP[], prodMap };
    },
  });

  const mutate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("ordens_producao").update({ status }).eq("id", id);
      if (error) throw error;
    },
    // Optimistic update — a arrastar sente-se instantâneo.
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["op-kanban"] });
      const prev = qc.getQueryData<{ ops: OP[]; prodMap: Map<string, unknown> }>(["op-kanban"]);
      if (prev) {
        qc.setQueryData(["op-kanban"], {
          ...prev,
          ops: prev.ops.map((o) => (o.id === id ? { ...o, status } : o)),
        });
      }
      return { prev };
    },
    onError: (e: Error, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["op-kanban"], ctx.prev);
      toast.error(friendlyError(e));
      haptic.error();
    },
    onSuccess: () => {
      toast.success("Status atualizado");
      haptic.success();
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["op-kanban"] }),
  });

  const move = (id: string, current: string, dir: -1 | 1) => {
    const i = ORDEM.indexOf(current);
    const next = ORDEM[i + dir];
    if (next) {
      haptic.light();
      mutate.mutate({ id, status: next });
    }
  };

  const onDragStart = (e: DragEvent<HTMLDivElement>, op: OP) => {
    e.dataTransfer.setData(DRAG_MIME, JSON.stringify({ id: op.id, from: op.status }));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverCol = (e: DragEvent<HTMLDivElement>, colKey: string) => {
    if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colKey) setDragOverCol(colKey);
  };

  const onDropCol = (e: DragEvent<HTMLDivElement>, colKey: string) => {
    e.preventDefault();
    setDragOverCol(null);
    const raw = e.dataTransfer.getData(DRAG_MIME);
    if (!raw) return;
    try {
      const { id, from } = JSON.parse(raw) as { id: string; from: string };
      if (from === colKey) return;
      mutate.mutate({ id, status: colKey });
    } catch {
      // ignore
    }
  };

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Kanban de Ordens de Produção"
        description="Arraste cartões entre colunas para reprogramar. Também dá para usar os botões ‹ › ou o teclado."
        crumbs={[{ label: "Produção" }, { label: "Kanban" }]}
      />

      {isLoading ? (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {COLUNAS.map((c) => (
            <Skeleton key={c.key} className="h-96" />
          ))}
        </div>
      ) : (
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:grid grid-cols-2 md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-5">
          {COLUNAS.map((col) => {
            const ops = (data?.ops ?? []).filter((o) => o.status === col.key);
            const totPlan = ops.reduce((a, o) => a + Number(o.quantidade_planejada ?? 0), 0);
            const totProd = ops.reduce((a, o) => a + Number(o.quantidade_produzida ?? 0), 0);
            const atrasadasCount = ops.filter(
              (o) => o.data_prazo && o.data_prazo < hoje && o.status !== "concluida",
            ).length;
            const isOver = dragOverCol === col.key;
            return (
              <div
                key={col.key}
                className={`w-[85vw] shrink-0 snap-start rounded-lg border p-3 transition-colors md:w-auto md:shrink ${col.cls} ${
                  isOver ? "border-primary ring-2 ring-primary/40" : ""
                }`}
                onDragOver={(e) => onDragOverCol(e, col.key)}
                onDragLeave={() => dragOverCol === col.key && setDragOverCol(null)}
                onDrop={(e) => onDropCol(e, col.key)}
              >
                <div className="mb-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wider">
                      {col.label}
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {ops.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-mono tabular-nums">
                      {totProd.toLocaleString("pt-BR")} / {totPlan.toLocaleString("pt-BR")}
                    </span>
                    {atrasadasCount > 0 && (
                      <span className="font-semibold text-destructive tabular-nums">
                        {atrasadasCount} atrasada{atrasadasCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {ops.map((op) => {
                    const prod = op.produto_id ? data?.prodMap.get(op.produto_id) : null;
                    const atrasada =
                      op.data_prazo && op.data_prazo < hoje && op.status !== "concluida";
                    const idx = ORDEM.indexOf(op.status);
                    const pct =
                      op.quantidade_planejada && Number(op.quantidade_planejada) > 0
                        ? Math.min(
                            100,
                            (Number(op.quantidade_produzida ?? 0) /
                              Number(op.quantidade_planejada)) *
                              100,
                          )
                        : 0;
                    return (
                      <div
                        key={op.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, op)}
                        className="group cursor-grab active:cursor-grabbing"
                      >
                        <Card className={atrasada ? "border-destructive/40" : ""}>
                          <CardContent className="space-y-2 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1">
                                <GripVertical
                                  className="h-3.5 w-3.5 text-muted-foreground opacity-40 group-hover:opacity-100"
                                  aria-hidden
                                />
                                <Link
                                  to="/producao/ordens-producao/$opId"
                                  params={{ opId: op.id }}
                                  className="font-mono text-xs font-semibold text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {op.numero}
                                </Link>
                              </div>
                              {op.prioridade && (
                                <Badge
                                  variant="outline"
                                  className={`text-[9px] uppercase tracking-wider ${PRIO_CLS[op.prioridade] ?? ""}`}
                                >
                                  {op.prioridade}
                                </Badge>
                              )}
                            </div>
                            {prod && (
                              <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                                <Package className="mt-0.5 h-3 w-3 shrink-0" />
                                <span className="line-clamp-2">
                                  <span className="font-mono tabular-nums">
                                    {(prod as { codigo: string }).codigo}
                                  </span>{" "}
                                  — {(prod as { descricao: string }).descricao}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground">Prod./Plan.</span>
                              <span className="font-mono tabular-nums">
                                {Number(op.quantidade_produzida ?? 0).toLocaleString("pt-BR")} /{" "}
                                {Number(op.quantidade_planejada ?? 0).toLocaleString("pt-BR")}
                                <span className="ml-1 text-muted-foreground">
                                  ({pct.toFixed(0)}%)
                                </span>
                              </span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded bg-muted">
                              <div
                                className={`h-full ${pct >= 100 ? "bg-success" : "bg-primary"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>

                            {op.data_prazo && (
                              <div
                                className={`flex items-center gap-1 text-[11px] tabular-nums ${atrasada ? "text-destructive font-semibold" : "text-muted-foreground"}`}
                              >
                                <Calendar className="h-3 w-3" />
                                {new Date(op.data_prazo).toLocaleDateString("pt-BR")}
                                {atrasada && " · atrasada"}
                              </div>
                            )}

                            <div className="flex gap-1 pt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 flex-1 px-2 md:h-7"
                                disabled={idx <= 0 || mutate.isPending}
                                onClick={() => move(op.id, op.status, -1)}
                                aria-label="Mover uma coluna à esquerda"
                                title="Mover uma coluna à esquerda"
                              >
                                <ChevronLeft className="h-4 w-4 md:h-3 md:w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 flex-1 px-2 md:h-7"
                                disabled={idx >= ORDEM.length - 1 || mutate.isPending}
                                onClick={() => move(op.id, op.status, 1)}
                                aria-label="Mover uma coluna à direita"
                                title="Mover uma coluna à direita"
                              >
                                <ChevronRight className="h-4 w-4 md:h-3 md:w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                  {ops.length === 0 && (
                    <div
                      className={`rounded border border-dashed p-4 text-center text-[11px] transition-colors ${
                        isOver
                          ? "border-primary/70 bg-primary/5 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isOver ? "Solte para mover" : "Sem OPs"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
