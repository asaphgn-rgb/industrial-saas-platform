import { formatBRL } from "@/components/flux/MoneyValue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PeriodKey = "7d" | "30d" | "90d" | "12m";

export const PERIOD_OPTIONS: { key: PeriodKey; label: string; days: number }[] = [
  { key: "7d", label: "7 dias", days: 7 },
  { key: "30d", label: "30 dias", days: 30 },
  { key: "90d", label: "90 dias", days: 90 },
  { key: "12m", label: "12 meses", days: 365 },
];

export function periodDays(key: PeriodKey): number {
  return PERIOD_OPTIONS.find((p) => p.key === key)?.days ?? 30;
}

/**
 * Returns [start, end] of the current window and [prevStart, prevEnd] of the
 * previous window of equal length, all inclusive at day granularity.
 */
export function periodRange(key: PeriodKey): {
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
  days: number;
} {
  const days = periodDays(key);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  const prevEnd = new Date(start);
  prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - (days - 1));
  prevStart.setHours(0, 0, 0, 0);
  return { start, end, prevStart, prevEnd, days };
}

export function PeriodFilter({
  value,
  onChange,
  className,
}: {
  value: PeriodKey;
  onChange: (k: PeriodKey) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex rounded-md border bg-background p-0.5", className)}>
      {PERIOD_OPTIONS.map((p) => (
        <Button
          key={p.key}
          type="button"
          size="sm"
          variant={value === p.key ? "default" : "ghost"}
          className="h-7 px-2.5 text-xs"
          onClick={() => onChange(p.key)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}

export function DeltaBadge({
  curr,
  prev,
  currency = false,
}: {
  curr: number;
  prev: number;
  currency?: boolean;
}) {
  const diff = curr - prev;
  const pct = prev === 0 ? (curr === 0 ? 0 : 100) : (diff / Math.abs(prev)) * 100;
  const positive = diff >= 0;
  const sign = positive ? "+" : "";
  const fmt = currency
    ? formatBRL(diff, 0)
    : diff.toLocaleString("pt-BR");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium",
        positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
      )}
      title={`Anterior: ${currency ? formatBRL(prev) : prev}`}
    >
      {sign}
      {pct.toFixed(1)}%{" "}
      <span className="opacity-70">
        ({sign}
        {fmt})
      </span>
    </span>
  );
}
