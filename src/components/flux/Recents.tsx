import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { History } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const KEY = "flux:recent-routes";
const MAX = 6;

type Recent = { path: string; label: string; at: number };

function load(): Recent[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r: unknown): r is Recent =>
        !!r && typeof (r as Recent).path === "string" && typeof (r as Recent).label === "string",
    );
  } catch {
    return [];
  }
}

function save(list: Recent[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("flux:recents-updated"));
  } catch {
    // ignore
  }
}

function labelForPath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return "Início";
  return parts[parts.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function record(path: string) {
  if (!path || path === "/auth") return;
  // Use current H1 as label if available, otherwise derive from path
  const h1 = typeof document !== "undefined" ? document.querySelector("h1") : null;
  const label = h1?.textContent?.trim() || labelForPath(path);
  const list = load().filter((r) => r.path !== path);
  list.unshift({ path, label, at: Date.now() });
  save(list.slice(0, MAX));
}

export function useRecents() {
  const [recents, setRecents] = useState<Recent[]>([]);
  useEffect(() => {
    setRecents(load());
    const h = () => setRecents(load());
    window.addEventListener("flux:recents-updated", h);
    return () => window.removeEventListener("flux:recents-updated", h);
  }, []);
  return recents;
}

export function RecentsTracker() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  useEffect(() => {
    // Defer to let the new page's H1 mount before recording.
    const t = setTimeout(() => record(pathname), 150);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
}

export function RecentsSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const recents = useRecents();

  if (collapsed) return null;
  const items = recents.filter((r) => r.path !== pathname).slice(0, 5);
  if (items.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recentes</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((r) => (
            <SidebarMenuItem key={r.path}>
              <SidebarMenuButton asChild size="sm">
                <Link to={r.path as any} className="gap-2" title={r.path}>
                  <History className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-xs">{r.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
