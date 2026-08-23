import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Info, Pause } from "lucide-react";

export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "pending"
  | "paused";

interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
  /** Ícone opcional; um padrão coerente é escolhido por tom quando omitido. */
  icon?: LucideIcon | false;
  className?: string;
  size?: "sm" | "md";
}

const toneCls: Record<StatusTone, string> = {
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-destructive/40 bg-destructive/10 text-destructive",
  info: "border-info/40 bg-info/10 text-info",
  neutral: "border-border bg-muted text-muted-foreground",
  pending: "border-info/40 bg-info/10 text-info",
  paused: "border-warning/40 bg-warning/10 text-warning",
};

const toneIcon: Record<StatusTone, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
  neutral: Info,
  pending: Clock,
  paused: Pause,
};

/**
 * Badge de status semântico — sempre traz cor, ícone e texto (acessível
 * mesmo para usuários com daltonismo). Elimina o padrão duplicado
 * `border-success/40 bg-success/10 text-success` copiado em ~140 pontos.
 */
export function StatusBadge({ tone, children, icon, className, size = "sm" }: StatusBadgeProps) {
  const Icon = icon === false ? null : (icon ?? toneIcon[tone]);
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        toneCls[tone],
        size === "md" ? "text-xs px-2.5 py-1" : "text-[10px] px-2 py-0.5",
        className,
      )}
    >
      {Icon && <Icon className={size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} aria-hidden />}
      {children}
    </Badge>
  );
}
