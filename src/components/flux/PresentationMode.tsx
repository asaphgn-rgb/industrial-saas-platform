import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, Plus, Play, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";

const LIST_KEY = "flux:presentation:urls";
const INTERVAL_KEY = "flux:presentation:interval-ms";
const RUNNING_KEY = "flux:presentation:running";
const CURSOR_KEY = "flux:presentation:cursor";

const INTERVALS = [
  { label: "10 segundos", ms: 10_000 },
  { label: "30 segundos", ms: 30_000 },
  { label: "1 minuto", ms: 60_000 },
  { label: "2 minutos", ms: 2 * 60_000 },
  { label: "5 minutos", ms: 5 * 60_000 },
];

/**
 * TV / mural rotator. The operator adds URLs (typically the current
 * page, one click), picks an interval, hits "Iniciar" and the app
 * cycles through those routes in the foreground — great for a shop
 * floor screen showing PCP → estoque → recebíveis → DRE on loop
 * without needing a dedicated dashboard tool. Rotation state persists,
 * so a page reload continues where it stopped.
 *
 * Opens with Alt+P; a small stop bar shows at the bottom while active.
 */
export function PresentationMode() {
  const [open, setOpen] = useState(false);
  const [urls, setUrls] = useState<string[]>(() => loadList());
  const [intervalMs, setIntervalMs] = useState<number>(() => loadInterval());
  const [running, setRunning] = useState<boolean>(() => loadRunning());
  const [cursor, setCursor] = useState<number>(() => loadCursor());
  const [newUrl, setNewUrl] = useState<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist everything so a reload continues seamlessly.
  useEffect(() => {
    try {
      localStorage.setItem(LIST_KEY, JSON.stringify(urls));
    } catch {
      /* ignore */
    }
  }, [urls]);
  useEffect(() => {
    try {
      localStorage.setItem(INTERVAL_KEY, String(intervalMs));
    } catch {
      /* ignore */
    }
  }, [intervalMs]);
  useEffect(() => {
    try {
      localStorage.setItem(RUNNING_KEY, running ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [running]);
  useEffect(() => {
    try {
      localStorage.setItem(CURSOR_KEY, String(cursor));
    } catch {
      /* ignore */
    }
  }, [cursor]);

  // Keyboard shortcut: Alt+P opens the dialog.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing) return;
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The rotation itself: schedule the next hop.
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!running || urls.length < 2) return;

    timerRef.current = setTimeout(() => {
      const next = (cursor + 1) % urls.length;
      setCursor(next);
      const target = urls[next];
      if (target && target !== window.location.pathname + window.location.search) {
        window.location.href = target; // Full nav — the simplest way to keep any route type happy.
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [running, urls, cursor, intervalMs]);

  const currentPath = useMemo(
    () => (typeof window !== "undefined" ? window.location.pathname + window.location.search : ""),
    [open],
  );

  function addCurrent() {
    if (!currentPath) return;
    if (urls.includes(currentPath)) {
      toast.message("Esta tela já está na rotação");
      return;
    }
    setUrls([...urls, currentPath]);
    toast.success("Adicionada à rotação", { description: currentPath });
  }

  function addManual() {
    const value = newUrl.trim();
    if (!value.startsWith("/")) {
      toast.error("Use um caminho começando com /", { description: "ex: /painel-executivo" });
      return;
    }
    if (urls.includes(value)) {
      toast.message("Este caminho já está na rotação");
      return;
    }
    setUrls([...urls, value]);
    setNewUrl("");
  }

  function remove(idx: number) {
    setUrls(urls.filter((_, i) => i !== idx));
    if (cursor >= urls.length - 1) setCursor(0);
  }

  function start() {
    if (urls.length < 2) {
      toast.error("Adicione pelo menos 2 telas antes de iniciar");
      return;
    }
    setCursor(0);
    setRunning(true);
    setOpen(false);
    toast.success("Modo apresentação iniciado", {
      description: `Trocando de tela a cada ${(intervalMs / 1000).toFixed(0)}s`,
    });
  }

  function stop() {
    setRunning(false);
    toast.message("Modo apresentação parado");
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              Modo apresentação
            </DialogTitle>
            <DialogDescription>
              Rotaciona as telas escolhidas no intervalo definido — ideal para TV de mural, chão de
              fábrica ou sala de controle. Atalho: Alt+P.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                {urls.length} tela{urls.length === 1 ? "" : "s"} na rotação
              </div>
              <Button variant="secondary" size="sm" onClick={addCurrent} className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                Adicionar tela atual
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                value={newUrl}
                placeholder="/caminho-manual (ex: /painel-executivo)"
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addManual()}
              />
              <Button variant="outline" size="sm" onClick={addManual}>
                Adicionar
              </Button>
            </div>

            {urls.length > 0 ? (
              <ul className="max-h-64 space-y-1 overflow-y-auto pr-1 -mr-1">
                {urls.map((u, i) => (
                  <li
                    key={u}
                    className="flex items-center gap-2 rounded border border-border/60 bg-card/40 p-2"
                  >
                    <span className="w-5 text-center font-mono text-xs text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm" title={u}>
                      {u}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(i)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      aria-label={`Remover ${u}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
                Nenhuma tela ainda. Use "Adicionar tela atual" enquanto navega.
              </p>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Intervalo:</span>
              <Select value={String(intervalMs)} onValueChange={(v) => setIntervalMs(Number(v))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTERVALS.map((i) => (
                    <SelectItem key={i.ms} value={String(i.ms)}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            {running ? (
              <Button variant="destructive" onClick={stop} className="gap-1">
                <Square className="h-3.5 w-3.5" />
                Parar
              </Button>
            ) : (
              <Button onClick={start} className="gap-1" disabled={urls.length < 2}>
                <Play className="h-3.5 w-3.5" />
                Iniciar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {running && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-medium text-primary shadow-lg backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Apresentação · {cursor + 1}/{urls.length} · {(intervalMs / 1000).toFixed(0)}s
          <Button
            variant="ghost"
            size="sm"
            onClick={stop}
            className="h-6 gap-1 px-2 text-primary hover:text-primary"
          >
            <Square className="h-3 w-3" />
            Parar
          </Button>
        </div>
      )}
    </>
  );
}

function loadList(): string[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function loadInterval(): number {
  try {
    const raw = localStorage.getItem(INTERVAL_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 30_000;
    return Number.isFinite(n) && n >= 5_000 ? n : 30_000;
  } catch {
    return 30_000;
  }
}

function loadRunning(): boolean {
  try {
    return localStorage.getItem(RUNNING_KEY) === "1";
  } catch {
    return false;
  }
}

function loadCursor(): number {
  try {
    const raw = localStorage.getItem(CURSOR_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}
