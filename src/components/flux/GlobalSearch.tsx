import { useEffect, useMemo, useRef, useState } from "react";
import { NAV } from "@/components/flux/AppSidebar";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizePostgrestLike } from "@/lib/search-sanitize";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  Users,
  Building2,
  Package,
  Boxes,
  ShoppingCart,
  Factory,
  Loader2,
  FileText,
  Receipt,
  Truck,
  Wrench,
  ShieldAlert,
  Plus,
  CheckCheck,
  Sun,
  Home,
  CalendarDays,
  Star,
  RefreshCw,
  LogOut,
  User,
  Link2,
  ExternalLink,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import {
  useFavorites,
  toggleFavorite as toggleFavoriteShared,
  moveFavorite,
} from "@/components/flux/Favorites";

function buildPath(to: string, params?: Record<string, string>) {
  let path = to;
  for (const [k, v] of Object.entries(params ?? {})) {
    path = path.replace(`$${k}`, encodeURIComponent(String(v)));
  }
  return path;
}

function highlight(text: string, term: string): React.ReactNode {
  const t = term.trim();
  if (!t || t.length < 2) return text;
  try {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    const parts = text.split(re);
    const lower = t.toLowerCase();
    return parts.map((p, i) =>
      p.toLowerCase() === lower ? (
        <mark key={i} className="rounded bg-warning/30 px-0.5 text-inherit">
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  } catch {
    return text;
  }
}

type Hit = {
  id: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  primary: string;
  secondary?: string;
  to: string;
  params?: Record<string, string>;
};

export function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const setOpen = onOpenChange;
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const favObjects = useFavorites();
  const favs = useMemo(() => favObjects.map((f) => f.path), [favObjects]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toggleSidebar, state: sidebarState } = useSidebar();
  const reqRef = useRef(0);

  function toggleFav(url: string, label: string) {
    toggleFavoriteShared(url, label);
  }

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 200);
    return () => clearTimeout(t);
  }, [term]);

  // Persist last query to sessionStorage; restore on reopen within 60s.
  const LAST_KEY = "flux:ctrlk-last";
  const HIST_KEY = "flux:ctrlk-history";
  const [historyTick, setHistoryTick] = useState(0);
  useEffect(() => {
    if (!open) {
      try {
        const q = term.trim();
        if (q.length >= 2) {
          sessionStorage.setItem(LAST_KEY, JSON.stringify({ q: term, t: Date.now() }));
          // Persist to search history (dedup, most-recent-first, cap 8)
          try {
            const raw = localStorage.getItem(HIST_KEY);
            const arr = raw ? (JSON.parse(raw) as string[]) : [];
            const next = [q, ...arr.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 8);
            localStorage.setItem(HIST_KEY, JSON.stringify(next));
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore */
      }
      setTerm("");
      setDebounced("");
      setHits([]);
    } else {
      try {
        const raw = sessionStorage.getItem(LAST_KEY);
        if (raw) {
          const { q, t } = JSON.parse(raw) as { q: string; t: number };
          if (typeof q === "string" && Date.now() - t < 60_000) {
            setTerm(q);
          }
        }
      } catch {
        /* ignore */
      }
      setHistoryTick((v) => v + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (debounced.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    const my = ++reqRef.current;
    setLoading(true);
    const safe = sanitizePostgrestLike(debounced);
    if (safe.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    const like = `%${safe}%`;
    const sb = supabase as any;

    Promise.all([
      sb
        .from("clientes")
        .select("id, codigo, razao_social, nome_fantasia")
        .or(`razao_social.ilike.${like},nome_fantasia.ilike.${like},codigo.ilike.${like}`)
        .limit(5),
      sb
        .from("fornecedores")
        .select("id, codigo, razao_social, nome_fantasia")
        .or(`razao_social.ilike.${like},nome_fantasia.ilike.${like},codigo.ilike.${like}`)
        .limit(5),
      sb
        .from("produtos")
        .select("id, codigo, descricao")
        .or(`descricao.ilike.${like},codigo.ilike.${like}`)
        .limit(5),
      sb
        .from("materias_primas")
        .select("id, codigo, descricao")
        .or(`descricao.ilike.${like},codigo.ilike.${like}`)
        .limit(5),
      sb.from("pedidos_venda").select("id, numero, status").ilike("numero", like).limit(5),
      sb.from("ordens_producao").select("id, numero, status").ilike("numero", like).limit(5),
      sb.from("orcamentos").select("id, numero, status").ilike("numero", like).limit(5),
      sb.from("pedidos_compra").select("id, numero, status").ilike("numero", like).limit(5),
      sb.from("cotacoes").select("id, numero, status").ilike("numero", like).limit(5),
      sb.from("romaneios").select("id, numero, status").ilike("numero", like).limit(5),
      sb.from("ordens_manutencao").select("id, numero, status").ilike("numero", like).limit(5),
      sb
        .from("nao_conformidades")
        .select("id, numero, severidade, status")
        .or(`numero.ilike.${like},descricao.ilike.${like}`)
        .limit(5),
    ])
      .then(([cli, forn, prod, mp, pv, op, orc, pc, cot, rom, om, nc]) => {
        if (my !== reqRef.current) return;
        const out: Hit[] = [];
        for (const r of cli.data ?? []) {
          out.push({
            id: `cli-${r.id}`,
            group: "Clientes",
            icon: Users,
            primary: r.razao_social ?? r.nome_fantasia ?? r.codigo,
            secondary: [r.codigo, r.nome_fantasia].filter(Boolean).join(" · "),
            to: "/cadastros/clientes",
          });
        }
        for (const r of forn.data ?? []) {
          out.push({
            id: `forn-${r.id}`,
            group: "Fornecedores",
            icon: Building2,
            primary: r.razao_social ?? r.nome_fantasia ?? r.codigo,
            secondary: [r.codigo, r.nome_fantasia].filter(Boolean).join(" · "),
            to: "/cadastros/fornecedores",
          });
        }
        for (const r of prod.data ?? []) {
          out.push({
            id: `prod-${r.id}`,
            group: "Produtos",
            icon: Package,
            primary: r.descricao ?? r.codigo,
            secondary: r.codigo,
            to: "/cadastros/produtos",
          });
        }
        for (const r of mp.data ?? []) {
          out.push({
            id: `mp-${r.id}`,
            group: "Matérias-primas",
            icon: Boxes,
            primary: r.descricao ?? r.codigo,
            secondary: r.codigo,
            to: "/cadastros/materias-primas",
          });
        }
        for (const r of pv.data ?? []) {
          out.push({
            id: `pv-${r.id}`,
            group: "Pedidos de venda",
            icon: ShoppingCart,
            primary: `Pedido ${r.numero}`,
            secondary: r.status,
            to: "/comercial/pedidos-venda/$id",
            params: { id: String(r.id) },
          });
        }
        for (const r of op.data ?? []) {
          out.push({
            id: `op-${r.id}`,
            group: "Ordens de produção",
            icon: Factory,
            primary: `OP ${r.numero}`,
            secondary: r.status,
            to: "/producao/ordens-producao/$opId",
            params: { opId: String(r.id) },
          });
        }
        for (const r of orc.data ?? []) {
          out.push({
            id: `orc-${r.id}`,
            group: "Orçamentos",
            icon: FileText,
            primary: `Orçamento ${r.numero}`,
            secondary: r.status,
            to: "/comercial/orcamentos/$id",
            params: { id: String(r.id) },
          });
        }
        for (const r of pc.data ?? []) {
          out.push({
            id: `pc-${r.id}`,
            group: "Pedidos de compra",
            icon: Receipt,
            primary: `PC ${r.numero}`,
            secondary: r.status,
            to: "/suprimentos/pedidos-compra/$id",
            params: { id: String(r.id) },
          });
        }
        for (const r of cot.data ?? []) {
          out.push({
            id: `cot-${r.id}`,
            group: "Cotações",
            icon: FileText,
            primary: `Cotação ${r.numero}`,
            secondary: r.status,
            to: "/suprimentos/cotacoes/$id",
            params: { id: String(r.id) },
          });
        }
        for (const r of rom.data ?? []) {
          out.push({
            id: `rom-${r.id}`,
            group: "Romaneios",
            icon: Truck,
            primary: `Romaneio ${r.numero}`,
            secondary: r.status,
            to: "/expedicao/romaneios/$id",
            params: { id: String(r.id) },
          });
        }
        for (const r of om.data ?? []) {
          out.push({
            id: `om-${r.id}`,
            group: "Ordens de manutenção",
            icon: Wrench,
            primary: `OM ${r.numero}`,
            secondary: r.status,
            to: "/manutencao/ordens-manutencao",
          });
        }
        for (const r of nc.data ?? []) {
          out.push({
            id: `nc-${r.id}`,
            group: "Não conformidades",
            icon: ShieldAlert,
            primary: `NC ${r.numero}`,
            secondary: `${r.severidade} · ${r.status}`,
            to: "/qualidade/nao-conformidades",
          });
        }
        setHits(out);
      })
      .finally(() => {
        if (my === reqRef.current) setLoading(false);
      });
  }, [debounced, open]);

  const grouped = useMemo(() => {
    const map = new Map<string, Hit[]>();
    for (const h of hits) {
      const arr = map.get(h.group) ?? [];
      arr.push(h);
      map.set(h.group, arr);
    }
    return Array.from(map.entries());
  }, [hits]);

  function goto(h: Hit) {
    setOpen(false);
    navigate({ to: h.to as any, params: h.params as any });
  }

  // Flatten every enabled route in the sidebar NAV so any cadastro/painel is
  // reachable in one keystroke via Ctrl+K → digitar → Enter. Deduped by URL,
  // labels prefixed with the group name so "Comercial · Pedidos" is easy to
  // narrow down when the user knows the module.
  const quick = useMemo(() => {
    const seen = new Set<string>();
    const items: { label: string; to: string; group: string }[] = [];
    for (const g of NAV) {
      for (const it of g.items) {
        if (it.url && it.enabled !== false && !seen.has(it.url)) {
          seen.add(it.url);
          items.push({ label: it.title, to: it.url, group: g.label });
        }
        for (const ch of it.children ?? []) {
          if (ch.url && ch.enabled !== false && !seen.has(ch.url)) {
            seen.add(ch.url);
            items.push({ label: `${it.title} · ${ch.title}`, to: ch.url, group: g.label });
          }
        }
      }
    }
    return items;
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar clientes, fornecedores, produtos, pedidos, OPs…"
          value={term}
          onValueChange={setTerm}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              const sel = document.querySelector<HTMLElement>(
                '[cmdk-item][aria-selected="true"][data-flux-href]',
              );
              const href = sel?.getAttribute("data-flux-href");
              if (href) {
                e.preventDefault();
                window.open(href, "_blank", "noopener,noreferrer");
              }
              return;
            }
            // Esc: clear term first if any, then close on second Esc.
            if (e.key === "Escape" && term.length > 0) {
              e.preventDefault();
              e.stopPropagation();
              setTerm("");
              setDebounced("");
              setHits([]);
            }
          }}
        />
        {debounced.length >= 2 && !loading && hits.length > 0 && (
          <div className="border-b border-border/60 bg-muted/20 px-3 py-1 text-[10.5px] text-muted-foreground">
            {hits.length} resultado{hits.length === 1 ? "" : "s"} em {grouped.length} grupo
            {grouped.length === 1 ? "" : "s"}
          </div>
        )}
        <CommandList>
          {debounced.length < 2 ? (
            <>
              <CommandEmpty>Digite ao menos 2 caracteres…</CommandEmpty>
              {(() => {
                let history: string[] = [];
                try {
                  const raw = typeof window !== "undefined" ? localStorage.getItem(HIST_KEY) : null;
                  history = raw ? (JSON.parse(raw) as string[]) : [];
                } catch {
                  /* ignore */
                }
                // reference tick so React re-reads localStorage on open
                void historyTick;
                if (!history.length) return null;
                return (
                  <>
                    <CommandGroup heading="Buscas recentes">
                      {history.slice(0, 5).map((q) => (
                        <CommandItem
                          key={`hist-${q}`}
                          value={`busca recente ${q}`}
                          onSelect={() => setTerm(q)}
                        >
                          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 truncate">{q}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              try {
                                const raw = localStorage.getItem(HIST_KEY);
                                const arr = raw ? (JSON.parse(raw) as string[]) : [];
                                const next = arr.filter((x) => x !== q);
                                localStorage.setItem(HIST_KEY, JSON.stringify(next));
                                setHistoryTick((v) => v + 1);
                              } catch {
                                /* ignore */
                              }
                            }}
                            className="ml-2 rounded p-1 opacity-70 hover:bg-muted hover:opacity-100 focus-visible:opacity-100 text-xs"
                            title="Remover do histórico"
                            aria-label="Remover do histórico"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </CommandItem>
                      ))}
                      <CommandItem
                        key="hist-clear"
                        value="limpar histórico buscas"
                        onSelect={() => {
                          try {
                            localStorage.removeItem(HIST_KEY);
                            setHistoryTick((v) => v + 1);
                            toast.success("Histórico de buscas limpo");
                          } catch {
                            /* ignore */
                          }
                        }}
                      >
                        <span className="ml-6 text-xs text-muted-foreground italic">
                          Limpar histórico de buscas
                        </span>
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                  </>
                );
              })()}
              {(() => {
                const byUrl = new Map(quick.map((q) => [q.to, q] as const));
                const favItems = favs
                  .map((p) => byUrl.get(p))
                  .filter((x): x is (typeof quick)[number] => !!x);
                if (favItems.length === 0) return null;
                return (
                  <>
                    <CommandGroup heading="Favoritos">
                      {favItems.map((q, i) => (
                        <CommandItem
                          key={`fav-${q.to}`}
                          value={`favorito ${q.label} ${q.to}`}
                          data-flux-href={q.to}
                          onSelect={() => {
                            setOpen(false);
                            navigate({ to: q.to as any });
                          }}
                        >
                          <Star className="mr-2 h-4 w-4 fill-warning text-warning" />
                          <span className="flex-1">{q.label}</span>
                          {i < 9 && (
                            <kbd className="ml-2 rounded border border-border bg-muted/50 px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                              ⌥{i + 1}
                            </kbd>
                          )}
                          <span className="ml-2 text-xs text-muted-foreground">{q.group}</span>
                          <button
                            type="button"
                            disabled={i === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveFavorite(q.to, -1);
                            }}
                            className="ml-2 rounded p-1 opacity-70 hover:bg-muted hover:opacity-100 focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-30"
                            title="Mover para cima"
                            aria-label="Mover para cima"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={i === favItems.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveFavorite(q.to, 1);
                            }}
                            className="ml-1 rounded p-1 opacity-70 hover:bg-muted hover:opacity-100 focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-30"
                            title="Mover para baixo"
                            aria-label="Mover para baixo"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(q.to, "_blank", "noopener,noreferrer");
                            }}
                            className="ml-1 rounded p-1 opacity-70 hover:bg-muted hover:opacity-100 focus-visible:opacity-100"
                            title="Abrir em nova aba"
                            aria-label="Abrir em nova aba"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFav(q.to, q.label);
                            }}
                            className="ml-1 rounded p-1 hover:bg-muted"
                            title="Remover dos favoritos"
                          >
                            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          </button>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </>
                );
              })()}
              {(() => {
                let recents: string[] = [];
                try {
                  const raw =
                    typeof window !== "undefined"
                      ? localStorage.getItem("flux:recent-routes")
                      : null;
                  recents = raw ? (JSON.parse(raw) as string[]) : [];
                } catch {
                  /* ignore */
                }
                const byUrl = new Map(quick.map((q) => [q.to, q] as const));
                const items = recents
                  .map((p) => byUrl.get(p))
                  .filter((x): x is (typeof quick)[number] => !!x)
                  .filter((q) => !favs.includes(q.to))
                  .slice(0, 5);
                if (items.length === 0) return null;
                return (
                  <>
                    <CommandGroup heading="Recentes">
                      {items.map((q) => (
                        <CommandItem
                          key={q.to}
                          value={`recente ${q.label} ${q.to}`}
                          data-flux-href={q.to}
                          onSelect={() => {
                            setOpen(false);
                            navigate({ to: q.to as any });
                          }}
                        >
                          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="flex-1">{q.label}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{q.group}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(q.to, "_blank", "noopener,noreferrer");
                            }}
                            className="ml-2 rounded p-1 opacity-70 hover:bg-muted hover:opacity-100 focus-visible:opacity-100"
                            title="Abrir em nova aba"
                            aria-label="Abrir em nova aba"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFav(q.to, q.label);
                            }}
                            className="ml-1 rounded p-1 opacity-70 hover:bg-muted hover:opacity-100 focus-visible:opacity-100"
                            title="Adicionar aos favoritos"
                          >
                            <Star className="h-3.5 w-3.5" />
                          </button>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </>
                );
              })()}
              <CommandGroup heading="Ações rápidas">
                <CommandItem
                  value="Novo orçamento criar"
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/comercial/orcamentos" as any });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 text-primary" /> Novo orçamento
                </CommandItem>
                <CommandItem
                  value="Nova solicitação de compra SC criar"
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/suprimentos/solicitacoes-compra" as any });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 text-primary" /> Nova solicitação de compra
                </CommandItem>
                <CommandItem
                  value="Nova ordem de produção OP criar"
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/producao/ordens-producao" as any });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 text-primary" /> Nova ordem de produção
                </CommandItem>
                <CommandItem
                  value="Nova não conformidade NC criar"
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/qualidade/nao-conformidades" as any });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 text-primary" /> Nova não conformidade
                </CommandItem>
                <CommandItem
                  value="Novo cliente cadastrar cadastro"
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/cadastros/clientes" as any });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 text-primary" /> Novo cliente
                </CommandItem>
                <CommandItem
                  value="Novo fornecedor cadastrar cadastro"
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/cadastros/fornecedores" as any });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 text-primary" /> Novo fornecedor
                </CommandItem>
                <CommandItem
                  value="Novo produto cadastrar cadastro"
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/cadastros/produtos" as any });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 text-primary" /> Novo produto
                </CommandItem>
                <CommandItem
                  value="Nova tarefa pessoal"
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/tarefas" as any });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 text-primary" /> Nova tarefa
                </CommandItem>
                <CommandItem
                  value="Marcar todas notificações como lidas"
                  onSelect={async () => {
                    setOpen(false);
                    const { data: u } = await supabase.auth.getUser();
                    if (!u.user) return;
                    const { error } = await supabase
                      .from("notificacoes")
                      .update({ lida: true, lida_em: new Date().toISOString() })
                      .eq("user_id", u.user.id)
                      .eq("lida", false);
                    if (error) toast.error("Erro ao marcar como lidas");
                    else toast.success("Todas as notificações foram marcadas como lidas");
                  }}
                >
                  <CheckCheck className="mr-2 h-4 w-4 text-success" /> Marcar todas notificações
                  como lidas
                </CommandItem>
                <CommandItem
                  value="Copiar link atual URL desta página compartilhar"
                  onSelect={async () => {
                    setOpen(false);
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success("Link desta página copiado");
                    } catch {
                      toast.error("Não foi possível copiar o link");
                    }
                  }}
                >
                  <FileText className="mr-2 h-4 w-4 text-sky-500" /> Copiar link da página atual
                </CommandItem>
                <CommandItem
                  value="Voltar página anterior histórico back"
                  onSelect={() => {
                    setOpen(false);
                    window.history.back();
                  }}
                >
                  <Home className="mr-2 h-4 w-4 text-muted-foreground" /> Voltar à página anterior
                </CommandItem>
                <CommandItem
                  value="Recarregar dados invalidar cache queries refresh reload"
                  onSelect={async () => {
                    setOpen(false);
                    await queryClient.invalidateQueries();
                    toast.success("Dados recarregados", {
                      description: "Todas as listas e painéis foram atualizados.",
                    });
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4 text-success" /> Recarregar dados (invalidar
                  cache)
                </CommandItem>
                <CommandItem
                  value={`${sidebarState === "expanded" ? "Recolher" : "Expandir"} barra lateral menu sidebar`}
                  onSelect={() => {
                    setOpen(false);
                    toggleSidebar();
                  }}
                >
                  <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                  {sidebarState === "expanded"
                    ? "Recolher barra lateral"
                    : "Expandir barra lateral"}
                  <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    ⌘B
                  </kbd>
                </CommandItem>
                <CommandItem
                  value="Alternar tema claro escuro dark light"
                  onSelect={() => {
                    setOpen(false);
                    const root = document.documentElement;
                    const isDark = root.classList.contains("dark");
                    root.classList.toggle("dark", !isDark);
                    try {
                      localStorage.setItem("theme", !isDark ? "dark" : "light");
                    } catch {
                      /* ignore */
                    }
                    toast.success(`Tema alterado para ${!isDark ? "escuro" : "claro"}`);
                  }}
                >
                  <Sun className="mr-2 h-4 w-4 text-warning" /> Alternar tema (claro/escuro)
                </CommandItem>
                <CommandItem
                  value="Meu perfil conta usuário profile"
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/perfil" as any });
                  }}
                >
                  <User className="mr-2 h-4 w-4 text-muted-foreground" /> Meu perfil
                </CommandItem>
                <CommandItem
                  value="Sair logout desconectar encerrar sessão"
                  onSelect={async () => {
                    setOpen(false);
                    const { error } = await supabase.auth.signOut();
                    if (error) toast.error("Erro ao sair");
                    else {
                      toast.success("Sessão encerrada");
                      navigate({ to: "/auth" as any });
                    }
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4 text-rose-500" /> Sair da conta
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              {(() => {
                const byGroup = new Map<string, typeof quick>();
                for (const q of quick) {
                  const arr = byGroup.get(q.group) ?? [];
                  arr.push(q);
                  byGroup.set(q.group, arr);
                }
                return Array.from(byGroup.entries()).map(([groupName, items]) => (
                  <CommandGroup key={groupName} heading={`Ir para · ${groupName}`}>
                    {items.map((q) => (
                      <CommandItem
                        key={q.to}
                        value={`${groupName} ${q.label} ${q.to}`}
                        data-flux-href={q.to}
                        onSelect={() => {
                          setOpen(false);
                          navigate({ to: q.to as any });
                        }}
                      >
                        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{q.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{q.to}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(q.to, "_blank", "noopener,noreferrer");
                          }}
                          className="ml-2 rounded p-1 opacity-70 hover:bg-muted hover:opacity-100 focus-visible:opacity-100"
                          title="Abrir em nova aba"
                          aria-label="Abrir em nova aba"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFav(q.to, q.label);
                          }}
                          className={`ml-1 rounded p-1 hover:bg-muted ${favs.includes(q.to) ? "" : "opacity-70 hover:opacity-100 focus-visible:opacity-100"}`}
                          title={
                            favs.includes(q.to)
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${favs.includes(q.to) ? "fill-warning text-warning" : ""}`}
                          />
                        </button>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ));
              })()}
            </>
          ) : loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Buscando…
            </div>
          ) : hits.length === 0 ? (
            <CommandEmpty>Nenhum resultado para “{debounced}”.</CommandEmpty>
          ) : (
            grouped.map(([group, list], idx) => (
              <div key={group}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={group}>
                  {list.map((h) => (
                    <CommandItem
                      key={h.id}
                      value={`${h.group} ${h.primary} ${h.secondary ?? ""}`}
                      data-flux-href={buildPath(h.to, h.params)}
                      onSelect={() => goto(h)}
                    >
                      <h.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm">{highlight(h.primary, debounced)}</span>
                        {h.secondary && (
                          <span className="truncate text-[11px] text-muted-foreground">
                            {highlight(h.secondary, debounced)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const path = buildPath(h.to, h.params);
                          window.open(path, "_blank", "noopener,noreferrer");
                        }}
                        className="ml-2 rounded p-1 opacity-70 hover:bg-muted hover:opacity-100 focus-visible:opacity-100"
                        title="Abrir em nova aba"
                        aria-label="Abrir em nova aba"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                      {h.params && (
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const url = new URL(window.location.origin);
                              url.pathname = buildPath(h.to, h.params);
                              await navigator.clipboard.writeText(url.toString());
                              toast.success("Link do registro copiado");
                            } catch {
                              toast.error("Não foi possível copiar o link");
                            }
                          }}
                          className="ml-1 rounded p-1 opacity-70 hover:bg-muted hover:opacity-100 focus-visible:opacity-100"
                          title="Copiar link direto deste registro"
                          aria-label="Copiar link"
                        >
                          <Link2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ))
          )}
        </CommandList>
        <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-muted/30 px-3 py-1.5 text-[10.5px] text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 font-mono">↑</kbd>
              <kbd className="rounded border border-border bg-background px-1 font-mono">↓</kbd>
              navegar
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 font-mono">↵</kbd>
              abrir
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 font-mono">⌘</kbd>
              <kbd className="rounded border border-border bg-background px-1 font-mono">↵</kbd>
              nova aba
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 font-mono">Esc</kbd>
              fechar
            </span>
          </div>
          <span className="hidden sm:inline">
            <kbd className="rounded border border-border bg-background px-1 font-mono">?</kbd>{" "}
            atalhos
          </span>
        </div>
      </CommandDialog>
    </>
  );
}
