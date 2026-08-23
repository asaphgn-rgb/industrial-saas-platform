import { useEffect, useState, startTransition } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Clock, X } from "lucide-react";
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

// Match /a/b/$c to build a title from the last meaningful segment
function labelFor(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return "Início";
  const last = parts[parts.length - 1];
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Ignore detail routes with UUIDs to keep the list stable
function shouldTrack(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path === "/" || path === "/auth") return false;
  if (path.startsWith("/_")) return false;
  // Skip URLs with UUID-like segments
  if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(path)) return false;
  return true;
}

export function RecentRoutes() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [recents, setRecents] = useState<string[]>([]);

  // Load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((p): p is string => typeof p === "string" && p.startsWith("/"));
        setRecents(valid.slice(0, MAX));
      }
    } catch {
      // ignore corrupt payloads
    }
  }, []);

  // Track pathname changes
  useEffect(() => {
    if (!shouldTrack(pathname)) return;
    startTransition(() => {
      setRecents((prev) => {
        const next = [pathname, ...prev.filter((p) => p !== pathname)].slice(0, MAX);
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    });
  }, [pathname]);

  function removeOne(path: string) {
    setRecents((prev) => {
      const next = prev.filter((p) => p !== path);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function clearAll() {
    setRecents([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }

  if (collapsed || recents.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Recentes</span>
        <button
          type="button"
          onClick={clearAll}
          className="text-[10px] uppercase tracking-wider text-sidebar-foreground/90 hover:text-sidebar-foreground"
          title="Limpar todas as rotas recentes"
        >
          limpar
        </button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {recents.map((path) => (
            <SidebarMenuItem key={path} className="group/recent">
              <SidebarMenuButton asChild size="sm" isActive={path === pathname}>
                <Link to={path as any} className="gap-2">
                  <Clock className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <span className="truncate text-xs">{labelFor(path)}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeOne(path);
                    }}
                    className="ml-auto shrink-0 rounded p-0.5 opacity-0 hover:bg-muted group-hover/recent:opacity-100"
                    title="Remover dos recentes"
                    aria-label="Remover"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
