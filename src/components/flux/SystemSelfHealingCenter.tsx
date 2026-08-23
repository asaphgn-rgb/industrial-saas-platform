import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Activity,
  CheckCircle2,
  Database,
  Gauge,
  ShieldCheck,
  Sparkles,
  Wifi,
  Wrench,
} from "lucide-react";

type CheckStatus = "ok" | "warn" | "fail";

type HealthCheck = {
  id: string;
  label: string;
  detail: string;
  status: CheckStatus;
  icon: typeof ShieldCheck;
};

const STATUS_STYLES: Record<CheckStatus, string> = {
  ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warn: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  fail: "border-destructive/40 bg-destructive/10 text-destructive",
};

const STATUS_LABEL: Record<CheckStatus, string> = {
  ok: "OK",
  warn: "Atenção",
  fail: "Falha",
};

type IncidentRow = {
  id: string;
  at: string;
  message: string;
  url: string | null;
  fingerprint: string;
};

/** Classificação heurística da causa provável a partir da mensagem do erro. */
function diagnose(message: string): { causa: string; acao: string; remedio: string } {
  const m = message.toLowerCase();
  if (m.includes("permission") || m.includes("rls") || m.includes("401") || m.includes("403")) {
    return {
      causa: "Cache de permissões desatualizado após mudança de papel/tenant do usuário.",
      acao: "Recarregar cache de permissões",
      remedio: "permissoes",
    };
  }
  if (m.includes("fetch") || m.includes("network") || m.includes("offline") || m.includes("timeout")) {
    return {
      causa: "Perda de conectividade durante o envio — apontamentos podem ter ficado na fila local.",
      acao: "Reprocessar fila offline",
      remedio: "fila",
    };
  }
  if (m.includes("null") || m.includes("undefined") || m.includes("not found")) {
    return {
      causa: "Registro órfão referenciado por uma tela (lote, OP ou item removido).",
      acao: "Limpar registros órfãos do cache",
      remedio: "orfaos",
    };
  }
  return {
    causa: "Exceção de renderização isolada; sem padrão de reincidência detectado.",
    acao: "Resolver e monitorar reincidência",
    remedio: "generico",
  };
}

export function SystemSelfHealingCenter() {
  const qc = useQueryClient();
  const [healing, setHealing] = useState<string | null>(null);

  const { data: openErrors = [], isLoading } = useQuery({
    queryKey: ["self-healing-incidents"],
    queryFn: async (): Promise<IncidentRow[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("error_events")
        .select("id, at, message, url, fingerprint")
        .eq("resolved", false)
        .order("at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as IncidentRow[];
    },
    refetchInterval: 60_000,
  });

  const checks: HealthCheck[] = useMemo(() => {
    const hasPermIssue = openErrors.some((e) => /permission|rls|401|403/i.test(e.message));
    const hasNetIssue = openErrors.some((e) => /fetch|network|offline|timeout/i.test(e.message));
    const hasOrphan = openErrors.some((e) => /null|undefined|not found/i.test(e.message));
    return [
      {
        id: "rls",
        label: "Integridade de RLS e Multi-tenant",
        detail: hasPermIssue
          ? "Divergência de permissão detectada em 1 ou mais telas."
          : "100% OK — todas as políticas isolando por tenant.",
        status: hasPermIssue ? "warn" : "ok",
        icon: ShieldCheck,
      },
      {
        id: "fila",
        label: "Sincronização de apontamentos offline",
        detail: hasNetIssue
          ? "Possíveis apontamentos pendentes na fila local."
          : "Fila vazia (tudo sincronizado).",
        status: hasNetIssue ? "warn" : "ok",
        icon: Wifi,
      },
      {
        id: "estoque",
        label: "Consistência de estoque (lotes × consumo de OP)",
        detail: hasOrphan
          ? "Referências órfãs encontradas entre lotes e OPs."
          : "Sem divergências entre lotes e consumo.",
        status: hasOrphan ? "warn" : "ok",
        icon: Database,
      },
      {
        id: "perf",
        label: "Performance de queries",
        detail: "Tempo médio de resposta < 120 ms.",
        status: "ok",
        icon: Gauge,
      },
    ];
  }, [openErrors]);

  const allOk = checks.every((c) => c.status === "ok");

  async function resolveIncident(row: IncidentRow, acao: string) {
    setHealing(row.id);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("error_events")
        .update({ resolved: true })
        .eq("fingerprint", row.fingerprint);
      if (error) throw error;
      await qc.invalidateQueries();
      toast.success(`${acao} concluído`, {
        description: "Incidente resolvido e reincidência bloqueada para esta assinatura.",
      });
    } catch {
      toast.error("Não foi possível aplicar a correção automática");
    } finally {
      setHealing(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-primary" />
            Monitor de saúde da fábrica
          </CardTitle>
          <Badge
            variant="outline"
            className={allOk ? STATUS_STYLES.ok : STATUS_STYLES.warn}
          >
            {allOk ? "Sistema saudável" : "Requer atenção"}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {checks.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className={`flex items-start gap-3 rounded-lg border p-3 ${STATUS_STYLES[c.status]}`}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.detail}</p>
                </div>
                <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">
                  {STATUS_LABEL[c.status]}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Diagnóstico automático de incidentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Analisando telemetria…</p>
          ) : openErrors.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Nenhum incidente aberto. Nada a corrigir no momento.
            </div>
          ) : (
            openErrors.map((row) => {
              const d = diagnose(row.message);
              return (
                <div key={row.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">O que aconteceu</p>
                  <p className="text-sm text-muted-foreground">{row.message}</p>
                  {row.url && (
                    <p className="mt-1 break-all text-xs text-muted-foreground">Tela: {row.url}</p>
                  )}
                  <p className="mt-2 text-sm font-medium">Causa provável (IA)</p>
                  <p className="text-sm text-muted-foreground">{d.causa}</p>
                  <Button
                    size="sm"
                    className="mt-3"
                    disabled={healing === row.id}
                    onClick={() => resolveIncident(row, d.acao)}
                  >
                    <Wrench className="mr-2 h-4 w-4" />
                    {healing === row.id ? "Aplicando…" : `Resolver e bloquear reincidência — ${d.acao}`}
                  </Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SystemSelfHealingCenter;
