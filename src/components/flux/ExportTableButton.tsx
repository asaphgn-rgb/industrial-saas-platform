import { useEffect, useState } from "react";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/**
 * Floating action button (bottom-right, above the "back to top" button)
 * that appears whenever the current page renders at least one HTML
 * <table> with visible rows. On click, exports the LARGEST visible table
 * to CSV — no per-page wiring needed, works on any listing / grid /
 * report the operator is already looking at. Also bound to Ctrl+Shift+E.
 */
export function ExportTableButton() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => setReady(pickBiggestTable() != null);
    check();

    // Re-evaluate whenever the DOM changes (route swap, tab switch, filter, etc.).
    const mo = new MutationObserver(() => {
      // Throttle: schedule at animation-frame granularity to avoid thrash.
      window.requestAnimationFrame(check);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing) return;
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        exportBiggestTable();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        copyBiggestTableAsMarkdown();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      mo.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!ready) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Exportar tabela desta tela"
          className="fixed right-4 z-40 h-10 w-10 rounded-full bg-background/95 shadow-md backdrop-blur print:hidden md:right-6"
          style={{ bottom: "calc(8.75rem + env(safe-area-inset-bottom))" }}
        >
          <FileDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="left">
        <DropdownMenuLabel>Exportar tabela</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportBiggestTable}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          CSV (Excel / LibreOffice)
          <kbd className="ml-auto text-[10px] text-muted-foreground">⌃⇧E</kbd>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyBiggestTableAsMarkdown}>
          <FileText className="mr-2 h-4 w-4" />
          Copiar como Markdown
          <kbd className="ml-auto text-[10px] text-muted-foreground">⌃⇧M</kbd>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function isVisible(el: HTMLElement): boolean {
  if (!el.isConnected) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  const style = window.getComputedStyle(el);
  return style.visibility !== "hidden" && style.display !== "none";
}

function pickBiggestTable(): HTMLTableElement | null {
  const tables = Array.from(document.querySelectorAll("table")) as HTMLTableElement[];
  let best: HTMLTableElement | null = null;
  let bestRows = 0;
  for (const t of tables) {
    if (!isVisible(t)) continue;
    const rows = t.querySelectorAll("tbody tr").length || t.querySelectorAll("tr").length;
    if (rows > bestRows) {
      best = t;
      bestRows = rows;
    }
  }
  return bestRows > 0 ? best : null;
}

function exportBiggestTable() {
  const table = pickBiggestTable();
  if (!table) {
    toast.error("Nenhuma tabela visível nesta tela");
    return;
  }
  const rows = Array.from(table.querySelectorAll("tr"));
  if (rows.length === 0) {
    toast.error("Tabela vazia");
    return;
  }
  const csv = rows
    .map((row) =>
      Array.from(row.querySelectorAll("th, td"))
        .map((cell) => csvEscape((cell.textContent ?? "").replace(/\s+/g, " ").trim()))
        .join(","),
    )
    .join("\r\n");

  const now = new Date();
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  const slug = (document.title || "flux")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()
    .slice(0, 40);
  const filename = `flux-${slug}-${stamp}.csv`;

  // UTF-8 BOM so Excel/LibreOffice open Portuguese accents correctly.
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);

  toast.success("Tabela exportada", {
    description: `${rows.length} linhas · ${filename}`,
  });
}

function csvEscape(value: string): string {
  let s = value;
  // Neutraliza fórmulas (CSV injection — OWASP): prefixa com aspa simples
  // se iniciar com =, +, -, @, TAB ou CR para evitar execução no Excel.
  if (s.length > 0 && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

async function copyBiggestTableAsMarkdown() {
  const table = pickBiggestTable();
  if (!table) {
    toast.error("Nenhuma tabela visível nesta tela");
    return;
  }
  const rows = Array.from(table.querySelectorAll("tr"));
  if (rows.length === 0) {
    toast.error("Tabela vazia");
    return;
  }

  // Build the grid, escaping pipes so cells never break the columns.
  const grid: string[][] = rows.map((row) =>
    Array.from(row.querySelectorAll("th, td")).map((cell) =>
      (cell.textContent ?? "").replace(/\s+/g, " ").trim().replace(/\|/g, "\\|"),
    ),
  );
  if (grid[0]?.length === 0) {
    toast.error("Tabela sem colunas");
    return;
  }

  const header = grid[0];
  const body = grid.slice(1);
  const separator = header.map(() => "---");
  const md = [header, separator, ...body].map((r) => `| ${r.join(" | ")} |`).join("\n");

  try {
    await navigator.clipboard.writeText(md);
    toast.success("Tabela copiada como Markdown", {
      description: `${rows.length} linhas · pronto para colar em Notion, GitHub, Jira`,
    });
  } catch {
    toast.error("Não foi possível copiar");
  }
}
