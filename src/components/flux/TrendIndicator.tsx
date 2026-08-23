import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Indicador de tendência padronizado (§3/§13).
 * Não depende só de cor: sempre acompanha ícone de direção + sinal numérico.
 */
export function TrendIndicator({
  value,
  label,
  /** Quando subir for ruim (custo, refugo, atraso). */
  inverse = false,
  decimals = 1,
  className,
}: {
  value: number | null | undefined;
  label?: string;
  inverse?: boolean;
  decimals?: number;
  className?: string;
}) {
  if (value == null || !Number.isFinite(value)) {
    return (
      <span
        className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}
        title="Sem base de comparação"
      >
        <Minus className="h-3 w-3 shrink-0" aria-hidden />
        <span>—</span>
      </span>
    );
  }

  const good = inverse ? value < 0 : value > 0;
  const bad = inverse ? value > 0 : value < 0;
  const Icon = value === 0 ? Minus : value > 0 ? TrendingUp : TrendingDown;
  const tone =
    value === 0
      ? "text-muted-foreground"
      : good
        ? "text-success"
        : bad
          ? "text-destructive"
          : "text-muted-foreground";
  const text = `${value > 0 ? "+" : ""}${value.toFixed(decimals).replace(".", ",")}%`;

  return (
    <span
      className={cn("inline-flex min-w-0 items-center gap-1 text-xs font-semibold", tone, className)}
      aria-label={`${text}${label ? ` ${label}` : ""} — ${good ? "melhora" : bad ? "piora" : "estável"}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      <span className="numeric">{text}</span>
      {label && <span className="truncate font-normal text-muted-foreground">{label}</span>}
    </span>
  );
}

export default TrendIndicator;
