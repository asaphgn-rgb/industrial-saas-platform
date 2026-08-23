import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Notebook, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "flux:scratchpad";

/**
 * A single always-available scratchpad the operator can use anywhere
 * in FLUX: quick math, half-drafted messages, copied codes, TODO for
 * the day. Different from PageNotes (per-URL post-its) — this is one
 * global notebook that follows the user across every screen. Opens
 * with Alt+N. Persists locally, no backend traffic.
 */
export function Scratchpad() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string>("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Hydrate from storage on first open.
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw != null) setText(raw);
    } catch {
      /* ignore */
    }
  }, [open]);

  // Debounced auto-save while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, text);
        setSavedAt(new Date());
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(id);
  }, [text, open]);

  // Keyboard shortcut: Alt+N opens the pad.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing) return;
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function copyAll() {
    if (!text.trim()) {
      toast.message("Bloco vazio");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado para a área de transferência");
    } catch {
      toast.error("Não foi possível copiar");
    }
  }

  function requestClear() {
    if (!text) return;
    setConfirmClear(true);
  }

  function performClear() {
    setText("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSavedAt(new Date());
    setConfirmClear(false);
    toast.message("Bloco limpo");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Notebook className="h-4 w-4 text-primary" />
            Bloco de notas
          </SheetTitle>
          <SheetDescription>
            Um rascunho global que segue você por todo o FLUX — cálculos rápidos, códigos copiados,
            TODOs do dia. Salva sozinho neste navegador. Atalho: Alt+N.
          </SheetDescription>
        </SheetHeader>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite aqui — salva automaticamente…"
          className="mt-4 flex-1 resize-none font-mono text-sm"
          autoFocus
        />

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">
            {savedAt
              ? `Salvo ${savedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
              : "Sem alterações"}
            {" · "}
            {text.length} caractere{text.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={copyAll} className="gap-1">
              <Copy className="h-3.5 w-3.5" />
              Copiar tudo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={requestClear}
              className="gap-1 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Limpar
            </Button>
          </div>
        </div>
      </SheetContent>
      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar todo o conteúdo do bloco?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O rascunho será removido apenas deste navegador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={performClear}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
