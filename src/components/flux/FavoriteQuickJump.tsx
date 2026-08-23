import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type Fav = { path: string; label: string };

function loadFavs(): Fav[] {
  try {
    const raw = localStorage.getItem("flux:favorite-routes");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry: unknown) =>
        typeof entry === "string" ? { path: entry, label: entry } : (entry as Fav),
      )
      .filter((f) => f && typeof f.path === "string");
  } catch {
    return [];
  }
}

export function FavoriteQuickJump() {
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const editing =
        t?.tagName === "INPUT" || t?.tagName === "TEXTAREA" || (t && t.isContentEditable);
      if (editing) return;
      if (!e.altKey) return;
      // Alt+1..Alt+9 => favorite index
      const digit = /^[1-9]$/.test(e.key) ? Number(e.key) : null;
      if (digit == null) return;
      e.preventDefault();
      const favs = loadFavs();
      const fav = favs[digit - 1];
      if (!fav) {
        toast(`Favorito ${digit} vazio`, {
          description: "Marque com a estrela na barra lateral",
          duration: 2000,
        });
        return;
      }
      toast(`↗ ${fav.label}`, { duration: 1200 });
      navigate({ to: fav.path });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return null;
}
