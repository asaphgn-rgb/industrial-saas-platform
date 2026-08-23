import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Star } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const KEY = "flux:favorite-routes";

type Fav = { path: string; label: string };

function loadFavs(): Fav[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Tolerate legacy shape: string[] of paths (no labels)
    return parsed
      .map((entry: unknown) =>
        typeof entry === "string" ? { path: entry, label: labelForPath(entry) } : (entry as Fav),
      )
      .filter((f) => f && typeof f.path === "string");
  } catch {
    return [];
  }
}

function labelForPath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return "Início";
  return parts[parts.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function saveFavs(favs: Fav[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(favs));
    window.dispatchEvent(new Event("flux:favs-updated"));
  } catch {
    // ignore
  }
}

export function useFavorites() {
  const [favs, setFavs] = useState<Fav[]>([]);
  useEffect(() => {
    setFavs(loadFavs());
    const h = () => setFavs(loadFavs());
    window.addEventListener("flux:favs-updated", h);
    return () => window.removeEventListener("flux:favs-updated", h);
  }, []);
  return favs;
}

export function isFavorite(path: string): boolean {
  return loadFavs().some((f) => f.path === path);
}

export function toggleFavorite(path: string, label: string) {
  const favs = loadFavs();
  const idx = favs.findIndex((f) => f.path === path);
  if (idx >= 0) {
    favs.splice(idx, 1);
    saveFavs(favs);
    toast.success("Removido dos favoritos");
  } else {
    favs.unshift({ path, label });
    saveFavs(favs.slice(0, 15));
    toast.success("Adicionado aos favoritos");
  }
}

export function moveFavorite(path: string, delta: number) {
  const favs = loadFavs();
  const idx = favs.findIndex((f) => f.path === path);
  if (idx < 0) return;
  const next = idx + delta;
  if (next < 0 || next >= favs.length) return;
  const [item] = favs.splice(idx, 1);
  favs.splice(next, 0, item);
  saveFavs(favs);
}

export function FavoriteButton({ path, label }: { path: string; label: string }) {
  const favs = useFavorites();
  const idx = favs.findIndex((f) => f.path === path);
  const active = idx >= 0;
  const shortcutHint = active && idx < 9 ? ` · atalho ⌥${idx + 1}` : "";
  const title = active
    ? `Favorito${idx < 9 ? ` nº ${idx + 1}` : ""}${shortcutHint} — clique para remover`
    : "Adicionar aos favoritos";
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      title={title}
      onClick={() => toggleFavorite(path, label)}
      aria-label={title}
    >
      <Star
        className={`h-4 w-4 ${active ? "fill-warning text-warning" : "text-muted-foreground"}`}
      />
    </Button>
  );
}

export function FavoritesSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const favs = useFavorites();

  if (collapsed || favs.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Favoritos</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {favs.map((f, i) => (
            <SidebarMenuItem key={f.path}>
              <SidebarMenuButton asChild size="sm" isActive={f.path === pathname}>
                <Link
                  to={f.path as any}
                  className="gap-2"
                  title={i < 9 ? `Atalho ⌥${i + 1}` : undefined}
                >
                  <Star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />
                  <span className="flex-1 truncate text-xs">{f.label}</span>
                  {i < 9 && (
                    <kbd className="rounded border border-border/60 bg-muted/40 px-1 font-mono text-[9px] text-muted-foreground">
                      ⌥{i + 1}
                    </kbd>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
