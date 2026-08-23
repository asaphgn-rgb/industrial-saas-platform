import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minimize2 } from "lucide-react";
import { toast } from "sonner";

const CLASS = "flux-zen";

function apply(on: boolean) {
  const html = document.documentElement;
  if (on) html.classList.add(CLASS);
  else html.classList.remove(CLASS);
}

export function ZenMode() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ctrl/Cmd + . toggles Zen mode
      if ((e.ctrlKey || e.metaKey) && e.key === ".") {
        e.preventDefault();
        setOn((prev) => {
          const next = !prev;
          apply(next);
          toast(next ? "Modo foco ativado" : "Modo foco desativado", {
            description: next
              ? "Sidebar, topo e breadcrumbs ocultos. Ctrl+. para sair."
              : undefined,
            duration: 1400,
          });
          return next;
        });
      }
      // Escape exits zen mode too
      if (on && e.key === "Escape") {
        setOn(false);
        apply(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on]);

  function toggle() {
    setOn((prev) => {
      const next = !prev;
      apply(next);
      return next;
    });
  }

  if (!on) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      title="Sair do modo foco (Esc ou Ctrl+.)"
      className="fixed right-3 top-3 z-[60] bg-card shadow-md border border-border"
      aria-label="Sair do modo foco (Esc ou Ctrl+.)"
    >
      <Minimize2 className="h-4 w-4" />
    </Button>
  );
}
