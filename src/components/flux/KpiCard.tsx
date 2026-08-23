import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Skeleton do KpiCard — mantém o mesmo grid de 3 linhas para não gerar
 * layout shift quando o dado real entra.
 */
export function KpiCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid h-full grid-rows-[auto_minmax(44px,auto)_minmax(28px,auto)] gap-2 rounded-xl border bg-card px-5 py-4 min-h-[122px] shadow-[var(--shadow-card)]",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export type KpiTone = "default" | "positive" | "warning" | "danger" | "info" | "muted";

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  /** Variação percentual entre 0-100 (aceita negativos). */
  delta?: number;
  /** Rótulo do delta (ex: "vs. mês anterior"). */
  deltaLabel?: string;
  /** Quando `delta > 0` for algo ruim (custo, refugo), inverte a leitura da seta. */
  deltaInverse?: boolean;
  hint?: React.ReactNode;
  tone?: KpiTone;
  className?: string;
  onClick?: () => void;
  /** Rótulo curto de status (ex: "OK", "Crítico"). */
  status?: string;
  /** Tooltip para o valor completo quando abreviado. */
  valueTitle?: string;
}

const toneRing: Record<KpiTone, string> = {
  default: "border-border",
  positive: "border-l-4 border-l-success border-border",
  warning: "border-l-4 border-l-warning border-border",
  danger: "border-l-4 border-l-destructive border-border",
  info: "border-l-4 border-l-info border-border",
  muted: "border-border",
};
const toneIcon: Record<KpiTone, string> = {
  default: "text-primary",
  positive: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground",
};

/**
 * KPI card padrão FLUX — grid interno de 3 linhas para alinhar cabeçalho,
 * valor e rodapé entre cards vizinhos, mesmo quando o conteúdo tem tamanhos
 * diferentes. NUNCA use posicionamento absoluto para conteúdo informacional.
 *
 * Estrutura:
 *   grid-rows: [header auto] [value minmax(44px,auto)] [meta minmax(32px,auto)]
 */
export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  deltaInverse,
  hint,
  tone = "default",
  className,
  onClick,
  status,
  valueTitle,
}: KpiCardProps) {
  const clickable = !!onClick;
  const positive = delta === undefined ? null : deltaInverse ? delta < 0 : delta > 0;
  const negative = delta === undefined ? null : deltaInverse ? delta > 0 : delta < 0;
  const DeltaIcon =
    delta === undefined || delta === 0 ? Minus : positive ? TrendingUp : TrendingDown;
  const deltaCls =
    delta === undefined || delta === 0
      ? "text-muted-foreground"
      : positive
        ? "text-success"
        : negative
          ? "text-destructive"
          : "text-muted-foreground";
  const formattedDelta =
    delta === undefined ? null : Number.isInteger(delta) ? delta.toFixed(0) : delta.toFixed(1);

  const hasMeta = delta !== undefined || hint !== undefined;

  return (
    <div
      data-kpi="true"
      data-tone={tone}
      role={clickable ? "button" : undefined}
      aria-label={clickable ? `Ver detalhes de ${label}` : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        // Grid interno com 3 linhas de altura mínima previsível —
        // isto é o que alinha título/valor/rodapé entre cards vizinhos.
        "group relative grid h-full min-w-0 rounded-xl border bg-card shadow-[var(--shadow-card)] transition-shadow",
        "grid-rows-[auto_minmax(44px,auto)_minmax(28px,auto)] gap-2",
        "px-5 py-4 min-h-[122px]",
        toneRing[tone],
        clickable &&
          "cursor-pointer hover:shadow-[var(--shadow-elevated)] focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      )}
    >
      {/* Row 1 — Header: título à esquerda, ícone à direita, centrados verticalmente */}
      <div className="flex min-w-0 items-center justify-between gap-3 min-h-[20px]">
        <span
          className="min-w-0 flex-1 text-[12px] font-semibold leading-tight tracking-wide text-muted-foreground line-clamp-2"
          title={label}
        >
          {label}
        </span>
        {Icon && (
          <Icon
            className={cn("h-[18px] w-[18px] shrink-0", toneIcon[tone])}
            aria-hidden
          />
        )}
      </div>

      {/* Row 2 — Valor principal com linha-base consistente */}
      <div className="flex min-w-0 items-end gap-2">
        <span
          data-kpi-value=""
          title={typeof valueTitle === "string" ? valueTitle : undefined}
          className={cn(
            "min-w-0 max-w-full truncate font-mono font-bold leading-[1.05] tracking-tight text-foreground tabular-nums",
            "text-[clamp(1.35rem,1.6vw,1.9rem)]",
          )}
        >
          {value}
        </span>
        {status && (
          <span
            className={cn(
              "shrink-0 pb-1 text-[10px] font-semibold uppercase tracking-wider",
              toneIcon[tone],
            )}
          >
            {status}
          </span>
        )}
      </div>

      {/* Row 3 — Meta (delta + hint) — altura reservada mesmo quando vazio */}
      {hasMeta ? (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[12px] leading-snug">
          {delta !== undefined ? (
            <span className={cn("inline-flex min-w-0 items-center gap-1 font-semibold", deltaCls)}>
              <DeltaIcon className="h-3 w-3 shrink-0" aria-hidden />
              <span className="tabular-nums">
                {delta > 0 ? "+" : ""}
                {formattedDelta}%
              </span>
              {deltaLabel && (
                <span className="font-normal text-muted-foreground">{deltaLabel}</span>
              )}
            </span>
          ) : (
            <span />
          )}
          {hint && (
            <span
              className="min-w-0 text-muted-foreground line-clamp-2"
              title={typeof hint === "string" ? hint : undefined}
            >
              {hint}
            </span>
          )}
        </div>
      ) : (
        <span aria-hidden />
      )}
    </div>
  );
}
