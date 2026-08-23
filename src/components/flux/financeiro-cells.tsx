/**
 * Células/utilitários compartilhados por Contas a Pagar e a Receber.
 * Consolida o padrão duplicado nas duas listagens e adota os helpers
 * oficiais (`fmtBRL`, `fmtDate`, `StatusBadge`, `numCellCls`).
 */
import { fmtBRL, fmtDate, numCellCls } from "@/components/flux/formatters";
import { StatusBadge, type StatusTone } from "@/components/flux/StatusBadge";
import { parseLocalDate, todayLocal } from "@/lib/date-br";

export const FIN_STATUS: Record<string, { label: string; tone: StatusTone }> = {
  aberto: { label: "Aberto", tone: "info" },
  parcial: { label: "Parcial", tone: "warning" },
  pago: { label: "Pago", tone: "success" },
  vencido: { label: "Vencido", tone: "danger" },
  cancelado: { label: "Cancelado", tone: "neutral" },
};

export function FinStatus({ value }: { value: unknown }) {
  const meta = FIN_STATUS[String(value ?? "aberto")] ?? FIN_STATUS.aberto;
  return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
}

export function DueDateCell({ date, status }: { date: unknown; status: unknown }) {
  if (!date) return <span className="text-muted-foreground">—</span>;
  const d = parseLocalDate(String(date));
  if (!d) return <span className="text-muted-foreground">—</span>;
  const isSettled = status === "pago" || status === "cancelado";
  const formatted = fmtDate(d);
  if (isSettled) return <span className="tabular-nums">{formatted}</span>;
  const today = todayLocal();
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  let hint: string;
  let cls = "text-muted-foreground";
  if (diffDays < 0) {
    hint = `há ${Math.abs(diffDays)}d`;
    cls = "text-destructive font-medium";
  } else if (diffDays === 0) {
    hint = "hoje";
    cls = "text-warning font-medium";
  } else if (diffDays <= 7) {
    hint = `em ${diffDays}d`;
    cls = "text-warning";
  } else {
    hint = `em ${diffDays}d`;
  }
  return (
    <span className="flex flex-col leading-tight whitespace-nowrap tabular-nums">
      <span>{formatted}</span>
      <span className={`text-[10px] ${cls}`}>{hint}</span>
    </span>
  );
}

export function MoneyCell({
  value,
  tone,
}: {
  value: unknown;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const cls =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning font-medium"
        : tone === "danger"
          ? "text-destructive font-medium"
          : "";
  return <span className={`${numCellCls} whitespace-nowrap ${cls}`}>{fmtBRL(value as never)}</span>;
}
