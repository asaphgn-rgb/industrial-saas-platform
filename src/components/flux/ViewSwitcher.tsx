import { useNavigate } from "@tanstack/react-router";
import { LayoutList, KanbanSquare } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Segmented control "Lista ⇄ Kanban" para páginas que suportam ambas as
 * visões. Usa `useNavigate` com search-param `view`, preservando os demais
 * filtros. Deep-linkável via `?view=kanban`.
 */
export function ViewSwitcher({
  current,
  className,
}: {
  current: "lista" | "kanban";
  className?: string;
}) {
  const navigate = useNavigate();

  const go = (view: "lista" | "kanban") => {
    navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => {
        const { view: _drop, ...rest } = prev ?? {};
        void _drop;
        return view === "kanban" ? { ...rest, view: "kanban" } : rest;
      },
      replace: true,
    });
  };

  const base =
    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors";
  const active = "bg-background text-foreground shadow-sm";
  const idle = "text-muted-foreground hover:text-foreground";

  return (
    <div
      role="tablist"
      aria-label="Alternar visualização"
      className={cn("inline-flex items-center gap-1 rounded-lg border bg-muted/50 p-1", className)}
    >
      <button
        type="button"
        role="tab"
        aria-selected={current === "lista"}
        onClick={() => go("lista")}
        className={cn(base, current === "lista" ? active : idle)}
      >
        <LayoutList className="h-3.5 w-3.5" />
        Lista
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={current === "kanban"}
        onClick={() => go("kanban")}
        className={cn(base, current === "kanban" ? active : idle)}
      >
        <KanbanSquare className="h-3.5 w-3.5" />
        Kanban
      </button>
    </div>
  );
}
