import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "flux:page-marks";

type Mark = { url: string; scroll: number; savedAt: number };
type Marks = Record<string, Mark>;

/**
 * Complements PageMarks (Fase 355). Press Shift+M to open a dialog
 * listing every saved marker (letter → URL, saved at). Click to jump,
 * click the trash icon to delete. Makes the vim-style marks
 * self-documenting: no need to remember which letter goes where.
 */
export function PageMarksList() {
  const [open, setOpen] = useState(false);
  const [marks, setMarks] = useState<Marks>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Shift+M — capital M with no modifiers except Shift.
      if (e.shiftKey && e.key === "M") {
        e.preventDefault();
        setMarks(readMarks());
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const entries = useMemo(
    () =>
      Object.entries(marks)
        .filter(([k]) => /^[a-z]$/.test(k))
        .sort(([a], [b]) => a.localeCompare(b)),
    [marks],
  );

  function jump(url: string, scroll: number) {
    setOpen(false);
    sessionStorage.setItem("flux:page-marks:pending-scroll", String(scroll));
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setTimeout(() => window.scrollTo({ top: scroll }), 400);
  }

  function remove(letter: string) {
    const next = { ...marks };
    delete next[letter];
    setMarks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    toast.message(`Marcador "${letter}" apagado`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            Marcadores salvos
          </DialogTitle>
          <DialogDescription>
            Aperte "m" + letra para salvar, "'" + letra para voltar. Shift+M reabre esta lista.
          </DialogDescription>
        </DialogHeader>
        {entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhum marcador salvo ainda. Pressione{" "}
            <kbd className="rounded border px-1 font-mono text-xs">m</kbd> +{" "}
            <kbd className="rounded border px-1 font-mono text-xs">a</kbd> para começar.
          </p>
        ) : (
          <ul className="max-h-[60dvh] space-y-1 overflow-y-auto pr-1 -mr-1">
            {entries.map(([letter, mark]) => (
              <li
                key={letter}
                className="flex items-center gap-2 rounded border border-border/60 bg-card/40 p-2 hover:bg-accent/40"
              >
                <kbd className="h-7 w-7 shrink-0 rounded bg-primary/10 text-center font-mono text-sm font-semibold text-primary leading-7">
                  {letter}
                </kbd>
                <button
                  onClick={() => jump(mark.url, mark.scroll)}
                  className="min-w-0 flex-1 text-left"
                  title={mark.url}
                >
                  <div className="truncate text-sm font-medium">{mark.url}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(mark.savedAt).toLocaleString("pt-BR")} · rolagem{" "}
                    {Math.round(mark.scroll)}px
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(letter)}
                  aria-label={`Apagar marcador ${letter}`}
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

function readMarks(): Marks {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Marks) : {};
  } catch {
    return {};
  }
}
