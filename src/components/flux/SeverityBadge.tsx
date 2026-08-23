import type { LucideIcon } from "lucide-react";
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type Severity = "critico" | "alto" | "medio" | "baixo" | "ok" | "neutro";

const MAP: Record<Severity, { label: string; icon: LucideIcon; cls: string }> = {
  critico: {
    label: "Crítico",
    icon: AlertOctagon,
    cls: "border-destructive/40 bg-flux-danger-soft text-destructive",
  },
  alto: {
    label: "Alto",
    icon: AlertTriangle,
    cls: "border-destructive/30 bg-flux-danger-soft text-destructive",
  },
  medio: {
    label: "Médio",
    icon: AlertTriangle,
    cls: "border-warning/40 bg-flux-warning-soft text-warning",
  },
  baixo: { label: "Baixo", icon: Info, cls: "border-info/40 bg-flux-info-soft text-info" },
  ok: {
    label: "OK",
    icon: CheckCircle2,
    cls: "border-success/40 bg-flux-success-soft text-success",
  },
  neutro: { label: "Neutro", icon: MinusCircle, cls: "border-border bg-muted text-muted-foreground" },
};

/**
 * Badge de severidade padronizado (§3/§15).
 * Sempre com texto + ícone — nunca comunica apenas por cor.
 */
export function SeverityBadge({
  severity,
  label,
  className,
}: {
  severity: Severity;
  label?: string;
  className?: string;
}) {
  const cfg = MAP[severity] ?? MAP.neutro;
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-tight",
        cfg.cls,
        className,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      <span className="truncate">{label ?? cfg.label}</span>
    </span>
  );
}

/**
 * Ícone em contêiner fixo — implementação única em IconBadge.tsx.
 * Re-exportado aqui apenas para compatibilidade com imports existentes.
 */
export { IconBadge } from "@/components/flux/IconBadge";


export default SeverityBadge;
