import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { gerarBriefingDia, obterBriefingDia } from "@/lib/briefing-dia.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Loader2,
  Target,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/friendly-error";

type Recomendacao = { acao: string; prioridade: "alta" | "media" | "baixa"; motivo: string };

/**
 * Widget "Briefing inteligente do dia" — chama a server function que agrega
 * pendências reais e gera resumo executivo via Lovable AI. Um clique gera/
 * atualiza o briefing do dia; o estado é persistido em `meu_dia_insights`.
 */
export function BriefingDia() {
  const qc = useQueryClient();
  const obter = useServerFn(obterBriefingDia);
  const gerar = useServerFn(gerarBriefingDia);

  const briefingQ = useQuery({
    queryKey: ["meu-dia", "briefing"],
    queryFn: () => obter(),
    staleTime: 5 * 60_000,
  });

  const gerarMut = useMutation({
    mutationFn: () => gerar(),
    onSuccess: () => {
      toast.success("Briefing atualizado.");
      qc.invalidateQueries({ queryKey: ["meu-dia", "briefing"] });
    },
    onError: (e: Error) => toast.error(friendlyError(e, "Falha ao gerar briefing.")),
  });

  const b = briefingQ.data;
  const recs = (b?.ai_recommendations as unknown as Recomendacao[] | null) ?? [];

  return (
    <Card className="relative overflow-hidden border-primary/30">
      <div className="gradient-briefing pointer-events-none absolute inset-0 opacity-70" />
      <CardHeader className="relative flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="gradient-ai-badge grid h-7 w-7 place-items-center rounded-lg text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          Briefing inteligente do dia
        </CardTitle>
        <Button
          size="sm"
          variant={b ? "outline" : "default"}
          onClick={() => gerarMut.mutate()}
          disabled={gerarMut.isPending}
        >
          {gerarMut.isPending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Gerando…
            </>
          ) : (
            <>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              {b ? "Atualizar" : "Gerar agora"}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {briefingQ.isLoading ? (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </>
        ) : !b ? (
          <p className="text-sm text-muted-foreground">
            Ainda não há briefing hoje. Clique em <strong>Gerar agora</strong> para consolidar
            pendências operacionais e receber recomendações da IA.
          </p>
        ) : (
          <>
            {b.ai_summary && (
              <p className="text-sm leading-relaxed text-foreground">{b.ai_summary}</p>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <Stat
                label="Produtividade"
                value={
                  b.productivity_score != null
                    ? `${Math.round(Number(b.productivity_score))}%`
                    : "—"
                }
                icon={TrendingUp}
                tone={
                  b.productivity_score != null && Number(b.productivity_score) < 60 ? "warn" : "ok"
                }
              />
              <Stat
                label="Reuniões"
                value={b.meeting_minutes ? `${Math.round(b.meeting_minutes / 60)}h` : "0h"}
                icon={Clock}
              />
              <Stat
                label="Foco disp."
                value={b.focus_time_minutes ? `${Math.round(b.focus_time_minutes / 60)}h` : "0h"}
                icon={Target}
              />
              <Stat
                label="Atrasadas"
                value={String(b.overdue_tasks ?? 0)}
                icon={AlertTriangle}
                tone={b.overdue_tasks > 0 ? "danger" : "ok"}
              />
            </div>

            {(b.main_risk || b.main_opportunity) && (
              <div className="grid gap-2 sm:grid-cols-2">
                {b.main_risk && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs">
                    <div className="mb-1 flex items-center gap-1 font-bold uppercase tracking-wider text-destructive">
                      <AlertTriangle className="h-3 w-3" /> Risco principal
                    </div>
                    <p>{b.main_risk}</p>
                  </div>
                )}
                {b.main_opportunity && (
                  <div className="rounded-md border border-success/30 bg-success/5 p-2.5 text-xs">
                    <div className="mb-1 flex items-center gap-1 font-bold uppercase tracking-wider text-success">
                      <TrendingUp className="h-3 w-3" /> Oportunidade
                    </div>
                    <p>{b.main_opportunity}</p>
                  </div>
                )}
              </div>
            )}

            {recs.length > 0 && (
              <div>
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Recomendações
                </div>
                <ol className="space-y-1.5">
                  {recs.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 rounded-md border border-border p-2 text-xs"
                    >
                      <Badge
                        variant={
                          r.prioridade === "alta"
                            ? "destructive"
                            : r.prioridade === "media"
                              ? "default"
                              : "secondary"
                        }
                        className="mt-0.5 shrink-0 text-[9px] uppercase"
                      >
                        {r.prioridade}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{r.acao}</p>
                        {r.motivo && (
                          <p className="text-[11px] text-muted-foreground">{r.motivo}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Sparkles;
  tone?: "warn" | "danger" | "ok";
}) {
  const toneCls =
    tone === "danger" ? "text-destructive" : tone === "warn" ? "text-warning" : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-card/60 p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`mt-0.5 text-lg font-black tracking-tight ${toneCls}`}>{value}</div>
    </div>
  );
}
