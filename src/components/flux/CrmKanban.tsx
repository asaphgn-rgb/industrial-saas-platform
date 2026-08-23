import { formatBRL } from "@/components/flux/MoneyValue";
import { friendlyError } from "@/lib/friendly-error";
import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as typed } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/flux/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutList, KanbanSquare } from "lucide-react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typed as any;

const ESTAGIOS = [
  { key: "novo", label: "Novo", tone: "bg-muted/40", bar: "bg-muted-foreground/40" },
  { key: "qualificado", label: "Qualificado", tone: "bg-info/10", bar: "bg-info" },
  { key: "proposta", label: "Proposta", tone: "bg-warning/10", bar: "bg-warning" },
  { key: "negociacao", label: "Negociação", tone: "bg-warning/10", bar: "bg-warning" },
  { key: "ganho", label: "Ganho", tone: "bg-success/10", bar: "bg-success" },
  { key: "perdido", label: "Perdido", tone: "bg-destructive/10", bar: "bg-destructive" },
] as const;

type Lead = {
  id: string;
  nome: string;
  empresa: string | null;
  estagio: string;
  valor_estimado: number | null;
  probabilidade: number | null;
  proxima_acao_data: string | null;
};

const BRL = (v: unknown) =>
  formatBRL(Number(v ?? 0));

// Interpreta "YYYY-MM-DD" como data LOCAL (evita bug de timezone em BR:
// new Date("2026-07-09") vira UTC-midnight, o que fica "ontem" às 21h local)
function parseLocalDate(iso: string | null): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function CrmKanban() {
  const qc = useQueryClient();

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["crm-kanban"],
    queryFn: async () => {
      const { data } = await supabase
        .from("crm_leads")
        .select("id, nome, empresa, estagio, valor_estimado, probabilidade, proxima_acao_data")
        .eq("ativo", true)
        .order("updated_at", { ascending: false })
        .limit(500);
      return (data ?? []) as Lead[];
    },
  });

  const mover = useMutation({
    mutationFn: async ({ id, estagio }: { id: string; estagio: string }) => {
      const { error } = await supabase.from("crm_leads").update({ estagio }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-kanban"] });
      toast.success("Estágio atualizado");
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const porEstagio = new Map<string, Lead[]>();
  for (const e of ESTAGIOS) porEstagio.set(e.key, []);
  for (const l of leads) {
    const bucket = porEstagio.get(l.estagio) ?? porEstagio.get("novo")!;
    bucket.push(l);
  }

  return (
    <div>
      <PageHeader
        title="CRM — Kanban"
        description="Funil visual. Use o seletor em cada card para mover o lead entre estágios."
        crumbs={[{ label: "Comercial" }, { label: "CRM" }, { label: "Kanban" }]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/comercial/crm">
              <LayoutList className="mr-1 h-4 w-4" />
              Ver lista
            </Link>
          </Button>
        }
      />

      <div className="p-4 sm:p-6">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex min-w-max gap-3 sm:grid sm:min-w-0 sm:grid-cols-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {ESTAGIOS.map((e) => {
              const items = porEstagio.get(e.key) ?? [];
              const total = items.reduce((s, l) => s + Number(l.valor_estimado ?? 0), 0);
              const ponderado = items.reduce(
                (s, l) => s + Number(l.valor_estimado ?? 0) * (Number(l.probabilidade ?? 0) / 100),
                0,
              );
              const hoje = new Date();
              hoje.setHours(0, 0, 0, 0);
              return (
                <div
                  key={e.key}
                  className={`flex w-72 shrink-0 flex-col overflow-hidden rounded-lg border ${e.tone} sm:w-auto`}
                >
                  <div className={`h-1 w-full ${e.bar}`} />
                  <div className="flex items-center justify-between gap-2 px-3 pb-1 pt-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <KanbanSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-xs font-semibold uppercase tracking-wider">
                        {e.label}
                      </span>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px] tabular-nums">
                      {items.length}
                    </Badge>
                  </div>
                  {total > 0 && (
                    <div className="px-3 pb-2 text-[10px] text-muted-foreground space-y-0.5">
                      <div>
                        Pipeline:{" "}
                        <span className="font-mono tabular-nums text-foreground">{BRL(total)}</span>
                      </div>
                      {ponderado > 0 && ponderado !== total && (
                        <div>
                          Ponderado:{" "}
                          <span className="font-mono tabular-nums text-foreground">
                            {BRL(ponderado)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-2 p-2">
                    {items.length === 0 ? (
                      <p className="rounded border border-dashed p-3 text-center text-[11px] text-muted-foreground">
                        Sem leads
                      </p>
                    ) : (
                      items.map((l) => {
                        const acao = parseLocalDate(l.proxima_acao_data);
                        const atrasado = acao ? acao.getTime() < hoje.getTime() : false;
                        const hoje2 = acao ? acao.getTime() === hoje.getTime() : false;
                        return (
                          <Card key={l.id} className="border-border/60">
                            <CardContent className="space-y-2 p-3">
                              <Link
                                to="/comercial/crm/$leadId"
                                params={{ leadId: l.id }}
                                className="block truncate text-sm font-medium text-primary hover:underline"
                              >
                                {l.nome}
                              </Link>
                              {l.empresa && (
                                <p className="truncate text-[11px] text-muted-foreground">
                                  {l.empresa}
                                </p>
                              )}
                              <div className="flex items-center justify-between gap-2 text-[11px]">
                                <span className="font-mono tabular-nums">
                                  {l.valor_estimado ? BRL(l.valor_estimado) : "—"}
                                </span>
                                {l.probabilidade != null && (
                                  <span className="text-muted-foreground tabular-nums">
                                    {l.probabilidade}%
                                  </span>
                                )}
                              </div>
                              {acao && (
                                <p
                                  className={`text-[10px] ${atrasado ? "font-semibold text-destructive" : hoje2 ? "font-semibold text-warning" : "text-muted-foreground"}`}
                                >
                                  {atrasado ? "Atrasado: " : hoje2 ? "Hoje: " : "Próx.: "}
                                  <span className="tabular-nums">
                                    {acao.toLocaleDateString("pt-BR")}
                                  </span>
                                </p>
                              )}
                              <Select
                                value={l.estagio}
                                onValueChange={(v) => mover.mutate({ id: l.id, estagio: v })}
                                disabled={mover.isPending}
                              >
                                <SelectTrigger className="h-7 text-[11px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ESTAGIOS.map((s) => (
                                    <SelectItem key={s.key} value={s.key} className="text-xs">
                                      {s.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
