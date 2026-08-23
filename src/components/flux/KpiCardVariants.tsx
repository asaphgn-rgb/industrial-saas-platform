import type { LucideIcon } from "lucide-react";
import { KpiCard, type KpiCardProps, type KpiTone } from "./KpiCard";
import { MoneyValue } from "./MoneyValue";

/**
 * Variantes oficiais do KPI card (§2/§3 do padrão visual FLUX).
 *
 * Todas reutilizam o mesmo `KpiCard` — mesma altura mínima, mesmo grid
 * interno de 3 linhas, mesmo padding e mesma tipografia. A variante muda
 * apenas a semântica de cor e a formatação do valor.
 *
 * Proibido criar card de indicador fora destes componentes.
 */

export type KpiVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "financial"
  | "production"
  | "stock"
  | "quality";

const VARIANT_TONE: Record<KpiVariant, KpiTone> = {
  neutral: "default",
  success: "positive",
  warning: "warning",
  danger: "danger",
  info: "info",
  financial: "default",
  production: "info",
  stock: "info",
  quality: "positive",
};

export function toneFromVariant(variant: KpiVariant = "neutral"): KpiTone {
  return VARIANT_TONE[variant] ?? "default";
}

/**
 * KPI financeiro — valor monetário formatado em pt-BR, sem quebra de linha,
 * negativo em `-R$ 903.829,20` com contraste refinado (borda discreta, sem
 * fundo vermelho saturado).
 */
export function FinancialKpiCard({
  label,
  value,
  compact = true,
  icon,
  delta,
  deltaLabel,
  deltaInverse,
  hint,
  onClick,
  className,
  /** força tom mesmo com valor positivo (ex.: meta não atingida) */
  tone,
}: {
  label: string;
  value: number | null | undefined;
  compact?: boolean;
  icon?: LucideIcon;
  delta?: number;
  deltaLabel?: string;
  deltaInverse?: boolean;
  hint?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: KpiTone;
}) {
  const negative = typeof value === "number" && value < 0;
  return (
    <KpiCard
      label={label}
      value={<MoneyValue value={value} compact={compact} size="kpi" />}
      icon={icon}
      delta={delta}
      deltaLabel={deltaLabel}
      deltaInverse={deltaInverse}
      hint={hint}
      tone={tone ?? (negative ? "danger" : "default")}
      onClick={onClick}
      className={className}
    />
  );
}

/** KPI operacional (produção, OEE, PCP, expedição). */
export function OperationalKpiCard(props: Omit<KpiCardProps, "tone"> & { variant?: KpiVariant }) {
  const { variant = "production", ...rest } = props;
  return <KpiCard {...rest} tone={toneFromVariant(variant)} />;
}

/**
 * KPI de alerta — vermelho reservado para criticidade real; severidades
 * intermediárias usam `warning`.
 */
export function AlertKpiCard({
  severity = "medio",
  ...rest
}: Omit<KpiCardProps, "tone"> & { severity?: "critico" | "alto" | "medio" | "baixo" | "ok" }) {
  const tone: KpiTone =
    severity === "critico"
      ? "danger"
      : severity === "alto" || severity === "medio"
        ? "warning"
        : severity === "ok"
          ? "positive"
          : "info";
  return <KpiCard {...rest} tone={tone} />;
}

/** KPI genérico com variante semântica (estoque, qualidade, comercial…). */
export function MetricCard(props: Omit<KpiCardProps, "tone"> & { variant?: KpiVariant }) {
  const { variant = "neutral", ...rest } = props;
  return <KpiCard {...rest} tone={toneFromVariant(variant)} />;
}

export { MetricCard as StatCard };
