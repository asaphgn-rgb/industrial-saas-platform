import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";

const HIDE_ATTR = "data-flux-filter-hidden";

function applyFilter(term: string): { total: number; visible: number } {
  const q = term.trim().toLowerCase();
  const tables = Array.from(
    document.querySelectorAll("main table") as NodeListOf<HTMLTableElement>,
  );
  let total = 0;
  let visible = 0;

  tables.forEach((table) => {
    const rows = Array.from(table.querySelectorAll("tbody tr") as NodeListOf<HTMLTableRowElement>);
    rows.forEach((tr) => {
      total++;
      if (!q) {
        tr.removeAttribute(HIDE_ATTR);
        tr.style.display = "";
        visible++;
        return;
      }
      const text = (tr.textContent ?? "").toLowerCase();
      if (text.includes(q)) {
        tr.removeAttribute(HIDE_ATTR);
        tr.style.display = "";
        visible++;
      } else {
        tr.setAttribute(HIDE_ATTR, "true");
        tr.style.display = "none";
      }
    });
  });

  return { total, visible };
}

function clearFilter() {
  document.querySelectorAll(`[${HIDE_ATTR}]`).forEach((el) => {
    (el as HTMLElement).style.display = "";
    el.removeAttribute(HIDE_ATTR);
  });
}

export function TableFilter() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [stats, setStats] = useState<{ total: number; visible: number }>({
    total: 0,
    visible: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Open with Alt+/  ·  close with Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const editing =
        (t?.tagName === "INPUT" && t !== inputRef.current) ||
        t?.tagName === "TEXTAREA" ||
        (t && t.isContentEditable);
      if (e.altKey && (e.key === "/" || e.key === "?")) {
        if (editing) return;
        e.preventDefault();
        setOpen((v) => !v);
      } else if (open && e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      setStats(applyFilter(term));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Re-apply on term change
  useEffect(() => {
    if (!open) return;
    setStats(applyFilter(term));
  }, [term, open]);

  // Clear on unmount / route change
  useEffect(() => {
    return () => clearFilter();
  }, []);

  function close() {
    clearFilter();
    setTerm("");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed left-4 right-4 top-16 z-50 ml-auto flex max-w-md items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5 shadow-lg"
      role="search"
      aria-label="Filtro de tabelas"
    >
      <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
      <Input
        ref={inputRef}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Filtrar linhas das tabelas visíveis…"
        className="h-8 min-w-0 flex-1 border-0 px-1 shadow-none focus-visible:ring-0"
      />
      <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap px-1">
        {stats.visible}/{stats.total}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={close}
        title="Fechar (Esc)"
        aria-label="Fechar (Esc)"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
