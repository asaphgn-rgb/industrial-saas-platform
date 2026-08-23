import { useCallback, useEffect, useState } from "react";
import { Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Modo de inspeção visual de tabelas (FLUX).
 *
 * Liga guias de alinhamento em todas as tabelas `[data-flux-table]` e destaca
 * em vermelho qualquer par cabeçalho/célula (`th`/`td` da mesma coluna) cujo
 * `text-align` computado divirja — o desvio clássico de "cabeçalho à esquerda,
 * dado centralizado".
 *
 * Ativação: botão `TableInspectToggle` ou `?inspect=tabelas` na URL.
 */
export type MisalignedColumn = { table: number; column: string; head: string; cell: string };

export function auditTableAlignment(root: ParentNode = document): MisalignedColumn[] {
  const issues: MisalignedColumn[] = [];
  const tables = Array.from(root.querySelectorAll<HTMLTableElement>("table"));
  tables.forEach((table, tableIndex) => {
    table
      .querySelectorAll<HTMLElement>("[data-misaligned]")
      .forEach((el) => el.removeAttribute("data-misaligned"));

    const heads = Array.from(table.querySelectorAll<HTMLElement>("thead th"));
    const firstRow = table.querySelector("tbody tr");
    if (!firstRow) return;
    const cells = Array.from(firstRow.querySelectorAll<HTMLElement>("td"));
    heads.forEach((head, i) => {
      const key = head.dataset.col;
      const cell = key
        ? table.querySelector<HTMLElement>(`tbody td[data-col="${CSS.escape(key)}"]`)
        : cells[i];
      if (!cell) return;
      const headAlign = getComputedStyle(head).textAlign;
      const cellAlign = getComputedStyle(cell).textAlign;
      if (headAlign !== cellAlign) {
        head.dataset.misaligned = "true";
        cell.dataset.misaligned = "true";
        issues.push({
          table: tableIndex,
          column: key ?? head.textContent?.trim() ?? `col-${i}`,
          head: headAlign,
          cell: cellAlign,
        });
      }
    });
  });
  return issues;
}

export function useTableInspect() {
  const [enabled, setEnabled] = useState(false);
  const [issues, setIssues] = useState<MisalignedColumn[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = new URLSearchParams(window.location.search).get("inspect") === "tabelas";
    if (fromUrl) setEnabled(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (!enabled) {
      delete root.dataset.tableInspect;
      document
        .querySelectorAll<HTMLElement>("[data-misaligned]")
        .forEach((el) => el.removeAttribute("data-misaligned"));
      setIssues([]);
      return;
    }
    root.dataset.tableInspect = "on";
    const run = () => setIssues(auditTableAlignment());
    run();
    const id = window.setInterval(run, 1200);
    return () => {
      window.clearInterval(id);
      delete root.dataset.tableInspect;
    };
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((v) => !v), []);
  return { enabled, toggle, issues };
}

export function TableInspectToggle({ className }: { className?: string }) {
  const { enabled, toggle, issues } = useTableInspect();
  return (
    <Button
      type="button"
      variant={enabled ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      className={className}
      aria-pressed={enabled}
      title="Exibe guias de alinhamento e destaca divergências entre cabeçalho e célula"
    >
      <Ruler className="h-4 w-4" />
      <span className="ml-1.5">
        {enabled ? `Inspeção: ${issues.length} desvio(s)` : "Inspecionar alinhamento"}
      </span>
    </Button>
  );
}
