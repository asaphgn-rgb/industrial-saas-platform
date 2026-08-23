import { formatBRL } from "@/components/flux/MoneyValue";
import { friendlyError } from "@/lib/friendly-error";
import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as typed } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/flux/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Calendar, User, GripVertical } from "lucide-react";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typed as any;

type Ped = {
  id: string;
  numero: string;
  status: string;
  total: number | null;
  data_pedido: string;
  data_entrega_prevista: string | null;
  cliente_id: string | null;
  vendedor_nome: string | null;
};

const COLUNAS: { key: string; label: string; cls: string; bar: string }[] = [
  { key: "aberto", label: "Aberto", cls: "bg-muted/40", bar: "bg-muted-foreground/40" },
  { key: "em_producao", label: "Em produção", cls: "bg-warning/10", bar: "bg-warning" },
  { key: "faturado", label: "Faturado", cls: "bg-info/10", bar: "bg-info" },
  { key: "entregue", label: "Entregue", cls: "bg-success/10", bar: "bg-success" },
];

const ORDEM = COLUNAS.map((c) => c.key);

const BRL = (v: unknown) =>
  formatBRL(Number(v ?? 0));

export function PedidosKanban() {
  const qc = useQueryClient();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["pedidos-kanban"],
    queryFn: async () => {
      const [pedsRes, clis] = await Promise.all([
        supabase
          .from("pedidos_venda")
          .select(
            "id, numero, status, total, data_pedido, data_entrega_prevista, cliente_id, vendedor_nome",
          )
          .in("status", [...ORDEM, "produzindo"])
          .order("data_entrega_prevista", { ascending: true, nullsFirst: false })
          .limit(400),
        supabase.from("clientes").select("id, codigo, razao_social"),
      ]);
      const cliMap = new Map(
        ((clis.data ?? []) as { id: string; codigo: string; razao_social: string }[]).map((c) => [
          c.id,
          c,
        ]),
      );
      // Normaliza "produzindo" → "em_producao" para caber nas 4 colunas.
      const peds = ((pedsRes.data ?? []) as Ped[]).map((p) =>
        p.status === "produzindo" ? { ...p, status: "em_producao" } : p,
      );
      return { peds, cliMap };
    },
  });

  const mutate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("pedidos_venda").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["pedidos-kanban"] });
      const prev = qc.getQueryData<{ peds: Ped[]; cliMap: Map<string, unknown> }>([
        "pedidos-kanban",
      ]);
      if (prev) {
        qc.setQueryData(["pedidos-kanban"], {
          ...prev,
          peds: prev.peds.map((p) => (p.id === id ? { ...p, status } : p)),
        });
      }
      return { prev };
    },
    onSuccess: () => {
      toast.success("Status do pedido atualizado");
    },
    onError: (e: Error, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["pedidos-kanban"], ctx.prev);
      toast.error(friendlyError(e));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["pedidos-kanban"] }),
  });

  const move = (id: string, current: string, dir: -1 | 1) => {
    const i = ORDEM.indexOf(current);
    const next = ORDEM[i + dir];
    if (next) mutate.mutate({ id, status: next });
  };

  const handleDrop = (colKey: string) => {
    setOverCol(null);
    if (!dragId) return;
    const ped = data?.peds.find((p) => p.id === dragId);
    setDragId(null);
    if (!ped || ped.status === colKey) return;
    mutate.mutate({ id: dragId, status: colKey });
  };

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Kanban de Pedidos de Venda"
        description="Arraste cartões entre colunas ou use as setas. Alterações são sincronizadas em tempo real."
        crumbs={[{ label: "Comercial" }, { label: "Kanban de Pedidos" }]}
      />

      {isLoading ? (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {COLUNAS.map((c) => (
            <Skeleton key={c.key} className="h-96" />
          ))}
        </div>
      ) : (
        <div className="-mx-4 overflow-x-auto pb-6 sm:mx-0 sm:overflow-visible">
          <div className="flex min-w-max gap-3 px-4 sm:px-0 md:grid md:min-w-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {COLUNAS.map((col) => {
              const peds = (data?.peds ?? []).filter((p) => p.status === col.key);
              const totalCol = peds.reduce((s, p) => s + Number(p.total ?? 0), 0);
              const isOver = overCol === col.key;
              return (
                <div
                  key={col.key}
                  className={`flex w-72 shrink-0 flex-col overflow-hidden rounded-lg border transition-colors md:w-auto ${col.cls} ${isOver ? "ring-2 ring-primary border-primary" : ""}`}
                  onDragOver={(e) => {
                    if (dragId) {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (overCol !== col.key) setOverCol(col.key);
                    }
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverCol(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(col.key);
                  }}
                >
                  <div className={`h-1 w-full ${col.bar}`} />
                  <div className="flex items-start justify-between gap-2 px-3 pb-2 pt-3">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold uppercase tracking-wider">
                        {col.label}
                      </div>
                      <div className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        {BRL(totalCol)}
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px] tabular-nums">
                      {peds.length}
                    </Badge>
                  </div>
                  <div className="min-h-[80px] space-y-2 p-2">
                    {peds.map((p) => {
                      const cli = p.cliente_id
                        ? (data?.cliMap.get(p.cliente_id) as
                            | { codigo: string; razao_social: string }
                            | undefined)
                        : null;
                      const atrasado =
                        p.data_entrega_prevista &&
                        p.data_entrega_prevista < hoje &&
                        p.status !== "entregue";
                      const diasAtraso =
                        atrasado && p.data_entrega_prevista
                          ? Math.floor(
                              (Date.parse(hoje) - Date.parse(p.data_entrega_prevista)) / 86400000,
                            )
                          : 0;
                      const idx = ORDEM.indexOf(p.status);
                      const isDragging = dragId === p.id;
                      return (
                        <Card
                          key={p.id}
                          draggable
                          onDragStart={(e) => {
                            setDragId(p.id);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", p.id);
                          }}
                          onDragEnd={() => {
                            setDragId(null);
                            setOverCol(null);
                          }}
                          className={`cursor-grab transition-opacity active:cursor-grabbing ${atrasado ? "border-destructive/40" : ""} ${isDragging ? "opacity-40" : ""}`}
                        >
                          <CardContent className="space-y-2 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-1">
                                <GripVertical className="h-3 w-3 shrink-0 text-muted-foreground" />
                                <Link
                                  to="/comercial/pedidos-venda/$id"
                                  params={{ id: p.id }}
                                  className="truncate font-mono text-xs font-semibold text-primary hover:underline"
                                >
                                  {p.numero}
                                </Link>
                              </div>
                              <span className="shrink-0 whitespace-nowrap font-mono text-xs font-medium tabular-nums">
                                {BRL(p.total)}
                              </span>
                            </div>
                            {cli && (
                              <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                                <User className="mt-0.5 h-3 w-3 shrink-0" />
                                <span className="line-clamp-2">
                                  <span className="font-mono tabular-nums">{cli.codigo}</span> —{" "}
                                  {cli.razao_social}
                                </span>
                              </div>
                            )}
                            {p.vendedor_nome && (
                              <div className="truncate text-[10px] text-muted-foreground">
                                Vendedor: {p.vendedor_nome}
                              </div>
                            )}
                            {p.data_entrega_prevista && (
                              <div
                                className={`flex items-center gap-1 text-[11px] ${atrasado ? "font-semibold text-destructive" : "text-muted-foreground"}`}
                              >
                                <Calendar className="h-3 w-3 shrink-0" />
                                <span className="tabular-nums">
                                  {new Date(p.data_entrega_prevista).toLocaleDateString("pt-BR")}
                                </span>
                                {atrasado && (
                                  <span className="tabular-nums"> · {diasAtraso}d atraso</span>
                                )}
                              </div>
                            )}
                            <div className="flex gap-1 pt-1 md:hidden">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 flex-1 px-2"
                                disabled={idx <= 0 || mutate.isPending}
                                onClick={() => move(p.id, p.status, -1)}
                                aria-label="Mover uma coluna à esquerda"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 flex-1 px-2"
                                disabled={idx >= ORDEM.length - 1 || mutate.isPending}
                                onClick={() => move(p.id, p.status, 1)}
                                aria-label="Mover uma coluna à direita"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {peds.length === 0 && (
                      <div className="rounded border border-dashed p-4 text-center text-[11px] text-muted-foreground">
                        {isOver ? "Solte aqui" : "Sem pedidos"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
