import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useFavorites } from "@/components/flux/Favorites";

// Lazy-load the heavy palette (supabase queries, icon set, favorites reorder).
// Trigger stays small in the initial post-login chunk.
const GlobalSearchDialog = lazy(() =>
  import("@/components/flux/GlobalSearch").then((m) => ({ default: m.GlobalSearchDialog })),
);

export function GlobalSearchTrigger() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const favObjects = useFavorites();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMounted(true);
        setOpen((v) => !v);
        return;
      }
      if (e.altKey && !e.metaKey && !e.ctrlKey && /^[1-9]$/.test(e.key)) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
        const n = parseInt(e.key, 10) - 1;
        const fav = favObjects[n];
        if (fav) {
          e.preventDefault();
          navigate({ to: fav.path as any });
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [favObjects, navigate]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        className="h-9 w-full max-w-md justify-start gap-2 bg-background text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Buscar em todo o FLUX…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-block">
          ⌘K
        </kbd>
      </Button>
      {mounted && (
        <Suspense fallback={null}>
          <GlobalSearchDialog open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  );
}
