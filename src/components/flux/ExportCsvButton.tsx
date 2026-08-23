import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { registrarAuditoria } from "@/lib/auditoria";

export type ExportColumn<T> = {
  label: string;
  key?: keyof T;
  get?: (row: T) => string | number | null | undefined;
};

function toCsvValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  let s = typeof v === "string" ? v : String(v);
  // Neutraliza fórmulas (CSV injection — OWASP): prefixa com aspa simples
  // se iniciar com =, +, -, @, TAB ou CR para evitar execução no Excel.
  if (s.length > 0 && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportToCsv<T>(filename: string, columns: ExportColumn<T>[], rows: T[]) {
  const header = columns.map((c) => toCsvValue(c.label)).join(";");
  const body = rows
    .map((r) =>
      columns
        .map((c) => {
          const v = c.get ? c.get(r) : c.key ? (r as Record<string, unknown>)[c.key as string] : "";
          return toCsvValue(v);
        })
        .join(";"),
    )
    .join("\n");
  const csv = "\ufeff" + header + "\n" + body; // BOM for Excel UTF-8
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const stamp = new Date().toISOString().split("T")[0];
  a.download = filename.endsWith(".csv") ? filename : `${filename}_${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportCsvButton<T>({
  filename,
  columns,
  rows,
  label = "Exportar CSV",
  size = "sm",
  variant = "outline",
  disabled,
  modulo,
  entidade,
}: {
  filename: string;
  columns: ExportColumn<T>[];
  rows: T[] | undefined;
  label?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
  disabled?: boolean;
  /** Módulo funcional para registro de auditoria (ex.: "estoque", "financeiro"). */
  modulo?: string;
  /** Entidade exportada (ex.: "produtos", "contas_receber"). Default: filename. */
  entidade?: string;
}) {
  const isEmpty = !rows || rows.length === 0;
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || isEmpty}
      onClick={() => {
        if (!rows || rows.length === 0) {
          toast.warning("Nada para exportar");
          return;
        }
        exportToCsv(filename, columns, rows);
        toast.success(`${rows.length} linha(s) exportada(s)`);
        void registrarAuditoria({
          acao: "exportacao_csv",
          modulo: modulo ?? "geral",
          entidade: entidade ?? filename,
          descricao: `Exportação de ${rows.length} linha(s) — ${filename}`,
          dados_depois: { linhas: rows.length, colunas: columns.map((c) => c.label) },
        });
      }}
      className="gap-1"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
