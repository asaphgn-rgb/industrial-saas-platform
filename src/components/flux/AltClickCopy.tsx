import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Global "Alt+click to copy value" helper. Holding Alt while clicking
 * anything on screen copies the element's visible text to the
 * clipboard — perfect for grabbing a KPI number, a document code, an
 * OP identifier or a client name straight out of a dashboard without
 * fighting selection handles.
 *
 * Ignores clicks on inputs/textareas (Alt is used by native shortcuts
 * there) and elements marked with `data-no-copy`. Falls back to a
 * legacy execCommand path if the async clipboard is blocked.
 */
export function AltClickCopy() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    async function onClick(e: MouseEvent) {
      if (!e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable ||
        target.closest("[data-no-copy]")
      ) {
        return;
      }
      const raw = (target.textContent ?? "").trim();
      if (!raw) return;
      // Keep the payload tidy: collapse whitespace, cap at 500 chars.
      const value = raw.replace(/\s+/g, " ").slice(0, 500);

      e.preventDefault();
      e.stopPropagation();

      try {
        await navigator.clipboard.writeText(value);
        toast.success("Copiado", { description: preview(value) });
      } catch {
        if (fallbackCopy(value)) {
          toast.success("Copiado", { description: preview(value) });
        } else {
          toast.error("Não foi possível copiar");
        }
      }
    }

    // Capture phase so we run before app-level onClick handlers stop propagation.
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

function preview(value: string): string {
  return value.length > 80 ? `${value.slice(0, 77)}…` : value;
}

function fallbackCopy(value: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
