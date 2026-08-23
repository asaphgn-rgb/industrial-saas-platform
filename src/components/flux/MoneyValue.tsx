import { cn } from "@/lib/utils";

/**
 * Formatação monetária centralizada (§7 do padrão visual FLUX).
 *
 * Garantias:
 *  - locale pt-BR, "R$" sempre colado ao valor;
 *  - nunca quebra em duas linhas (`.flux-money`);
 *  - `tabular-nums` para alinhamento vertical entre linhas/cards;
 *  - negativo no padrão `-R$ 903.829,20`;
 *  - fallback explícito ("—" + explicação) quando não há dado;
 *  - tooltip com o valor completo quando o texto é abreviado.
 */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const COMPACT = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

const BRL0 = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formatador monetário global. `decimals = 0` para painéis executivos,
 * `2` (padrão) para telas transacionais.
 */
export function formatBRL(value: number, decimals: 0 | 2 = 2) {
  // Intl gera "-R$ 1.234,56" com espaço não separável; normalizamos o sinal.
  const fmt = decimals === 0 ? BRL0 : BRL;
  return fmt.format(Number.isFinite(value) ? value : 0).replace("\u00a0", " ");
}


export function formatBRLCompact(value: number) {
  return COMPACT.format(value).replace("\u00a0", " ");
}

export type MoneyStatus = "auto" | "neutral" | "positive" | "negative";
export type MoneySize = "sm" | "md" | "lg" | "kpi";

const sizeClass: Record<MoneySize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base font-semibold",
  kpi: "text-kpi-value",
};

export interface MoneyValueProps {
  value: number | null | undefined;
  /** Abrevia valores grandes (1,2 mi) mantendo o valor completo no tooltip. */
  compact?: boolean;
  /** "auto" pinta negativo com danger e positivo neutro (padrão executivo). */
  status?: MoneyStatus;
  size?: MoneySize;
  /** Texto exibido quando não há valor. */
  emptyLabel?: string;
  /** Explicação do vazio (vira tooltip). */
  emptyHint?: string;
  /** Mostra "+" em valores positivos (útil em variações). */
  signed?: boolean;
  className?: string;
}

export function MoneyValue({
  value,
  compact = false,
  status = "auto",
  size = "md",
  emptyLabel = "—",
  emptyHint = "Sem dados no período selecionado",
  signed = false,
  className,
}: MoneyValueProps) {
  if (value == null || !Number.isFinite(value)) {
    return (
      <span
        className={cn("flux-money text-muted-foreground", sizeClass[size], className)}
        title={emptyHint}
        aria-label={`${emptyLabel} — ${emptyHint}`}
      >
        {emptyLabel}
      </span>
    );
  }

  const full = formatBRL(value);
  const text = compact ? formatBRLCompact(value) : full;
  const withSign = signed && value > 0 ? `+${text}` : text;

  const tone =
    status === "neutral"
      ? "text-foreground"
      : status === "positive"
        ? "text-success"
        : status === "negative"
          ? "text-destructive"
          : value < 0
            ? "text-destructive"
            : "text-foreground";

  return (
    <span
      className={cn("flux-money", sizeClass[size], tone, className)}
      title={full}
      data-money={value}
    >
      {withSign}
    </span>
  );
}

/** Percentual padronizado — 1 casa decimal, tabular, com fallback. */
export function PercentValue({
  value,
  decimals = 1,
  signed = false,
  className,
  emptyLabel = "—",
}: {
  value: number | null | undefined;
  decimals?: number;
  signed?: boolean;
  className?: string;
  emptyLabel?: string;
}) {
  if (value == null || !Number.isFinite(value)) {
    return (
      <span className={cn("numeric text-muted-foreground", className)} title="Sem dados">
        {emptyLabel}
      </span>
    );
  }
  const text = `${value.toFixed(decimals).replace(".", ",")}%`;
  return (
    <span className={cn("numeric whitespace-nowrap", className)}>
      {signed && value > 0 ? `+${text}` : text}
    </span>
  );
}

export default MoneyValue;
