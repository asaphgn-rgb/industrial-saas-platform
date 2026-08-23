import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { NAV } from "@/components/flux/AppSidebar";
import { Search } from "lucide-react";

type FlatItem = { title: string; url: string; group: string; sub?: string };

function flatten(): FlatItem[] {
  const out: FlatItem[] = [];
  for (const g of NAV) {
    for (const it of g.items) {
      if (it.enabled === false) continue;
      if (it.url) {
        out.push({ title: it.title, url: it.url, group: g.label });
      } else if (it.children) {
        for (const c of it.children) {
          if (c.enabled === false || !c.url) continue;
          out.push({ title: c.title, url: c.url, group: g.label, sub: it.title });
        }
      }
    }
  }
  return out;
}

/**
 * Palette secundária de navegação por teclado.
 * O trigger principal é o GlobalSearchTrigger no TopBar; este componente é
 * carregado sob demanda (DeferredGlobals) e escuta o mesmo ⌘K quando o
 * trigger principal ainda não montou.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const items = useMemo(() => flatten(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        // Se outro handler (GlobalSearchTrigger) já tratou, ignora.
        if (e.defaultPrevented) return;
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, FlatItem[]>();
    for (const it of items) {
      const arr = map.get(it.group) ?? [];
      arr.push(it);
      map.set(it.group, arr);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar página, módulo ou ação…  (⌘K)" />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>
        {grouped.map(([grp, arr]) => (
          <CommandGroup key={grp} heading={grp}>
            {arr.map((it) => (
              <CommandItem
                key={it.url}
                value={`${it.title} ${it.sub ?? ""} ${it.group}`}
                onSelect={() => {
                  setOpen(false);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  navigate({ to: it.url as any });
                }}
              >
                <Search className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span>{it.title}</span>
                {it.sub && <span className="ml-2 text-xs text-muted-foreground">· {it.sub}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
