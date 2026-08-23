import { formatBRL } from "@/components/flux/MoneyValue";
import { friendlyError } from "@/lib/friendly-error";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRealtimeInvalidate } from "@/hooks/useRealtimeInvalidate";
import { supabase as typedSupabase } from "@/integrations/supabase/client";
// Cast to bypass typegen lag — new tables in this fase aren't yet in types.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;
import { PageHeader } from "@/components/flux/PageHeader";
import { haptic } from "@/lib/haptic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Inbox,
  Download,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Copy,
  CopyPlus,
  Columns3,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Printer,
  Link2,
  Pin,
  PinOff,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { confirmDialog } from "@/components/flux/ConfirmDialog";
import { promptDialog } from "@/components/flux/PromptDialog";
import { exportToCsv } from "@/lib/csv";

export type FieldOption = { value: string; label: string };
export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "boolean" | "date" | "datetime";
  required?: boolean;
  options?: FieldOption[];
  colSpan?: 1 | 2;
  placeholder?: string;
  step?: string;
  loadOptions?: (tenantId: string) => Promise<FieldOption[]>;
};

export type ColumnDef = {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
};

export type CadastroCrudProps = {
  title: string;
  description: string;
  crumbs: { label: string }[];
  help?: string;
  table: string;
  /** Optional view/table used only for the list SELECT (e.g. masked PII view). Writes still go to `table`. */
  readTable?: string;
  singular: string;
  plural: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  searchFields: string[];
  defaultValues?: Record<string, unknown>;
};

export function CadastroCrud(props: CadastroCrudProps) {
  const qc = useQueryClient();
  // Persist per-table UI preferences in localStorage so users resume where they left off
  const prefsKey = `flux-crud-prefs:${props.table}`;
  type Density = "compact" | "normal" | "spacious";
  type CrudPrefs = {
    sortKey: string | null;
    sortDir: "asc" | "desc";
    ativoFilter: "ativos" | "inativos" | "todos";
    pageSize: number;
    density: Density;
  };
  const initialPrefs = ((): CrudPrefs => {
    const fallback: CrudPrefs = {
      sortKey: null,
      sortDir: "asc",
      ativoFilter: props.fields.some((f) => f.name === "ativo") ? "ativos" : "todos",
      pageSize: 50,
      density: "normal",
    };
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(prefsKey);
      if (!raw) return fallback;
      return { ...fallback, ...(JSON.parse(raw) as Partial<CrudPrefs>) };
    } catch {
      return fallback;
    }
  })();

  // Read initial q/f/p from the URL so a refresh / bookmark / shared link
  // (without the fuller ?flux= blob) restores what the user was looking at.
  // Client-only: this component always mounts under _authenticated (ssr:false).
  const urlInitial = (() => {
    const empty = { q: "", f: null as null | "ativos" | "inativos" | "todos", p: 0 };
    if (typeof window === "undefined") return empty;
    try {
      const sp = new URLSearchParams(window.location.search);
      const fRaw = sp.get("f");
      const f: null | "ativos" | "inativos" | "todos" =
        fRaw === "ativos" || fRaw === "inativos" || fRaw === "todos" ? fRaw : null;
      const pRaw = Number(sp.get("p") ?? "");
      return {
        q: sp.get("q") ?? "",
        f,
        p: Number.isFinite(pRaw) && pRaw > 0 ? Math.floor(pRaw) : 0,
      };
    } catch {
      return empty;
    }
  })();
  const [search, setSearch] = useState(urlInitial.q);
  const tableHasAtivo = props.fields.some((f) => f.name === "ativo");
  const [ativoFilter, setAtivoFilter] = useState<"ativos" | "inativos" | "todos">(
    urlInitial.f ?? initialPrefs.ativoFilter,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [discardConfirm, setDiscardConfirm] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [sortKey, setSortKey] = useState<string | null>(initialPrefs.sortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initialPrefs.sortDir);
  const [page, setPage] = useState(urlInitial.p);
  const [pageSize, setPageSize] = useState<number>(initialPrefs.pageSize);
  const [density, setDensity] = useState<Density>(initialPrefs.density);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [missingFields, setMissingFields] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);
  const keepOpenAfterSaveRef = useRef(false);
  const [recentIds, setRecentIds] = useState<Set<string>>(new Set());
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkEditField, setBulkEditField] = useState<string>("");
  const [bulkEditValue, setBulkEditValue] = useState<unknown>("");
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const recentSearchKey = `flux-recent-search:${props.table}`;
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(recentSearchKey);
      return raw ? (JSON.parse(raw) as string[]).slice(0, 8) : [];
    } catch {
      return [];
    }
  });
  const [searchFocused, setSearchFocused] = useState(false);
  const rememberSearch = (q: string) => {
    const v = q.trim();
    if (!v) return;
    setRecentSearches((prev) => {
      const next = [v, ...prev.filter((x) => x !== v)].slice(0, 8);
      try {
        window.localStorage.setItem(recentSearchKey, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  };
  const forgetSearch = (q: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((x) => x !== q);
      try {
        window.localStorage.setItem(recentSearchKey, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  };
  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      window.localStorage.removeItem(recentSearchKey);
    } catch {
      // ignore quota errors
    }
  };

  // Named saved views per table: complete snapshot of search + filters +
  // sort + hidden columns. Persisted in localStorage.
  type SavedView = {
    name: string;
    s: string;
    hidden: string[];
    k: string | null;
    o: "asc" | "desc";
    stack: { key: string; dir: "asc" | "desc" }[];
    ativo: "todos" | "ativos" | "inativos";
    mine: boolean;
    today: boolean;
    cf?: Record<string, string>;
  };
  const viewsKey = `flux-views:${props.table}`;
  const [savedViews, setSavedViews] = useState<SavedView[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(viewsKey);
      return raw ? (JSON.parse(raw) as SavedView[]) : [];
    } catch {
      return [];
    }
  });
  const persistViews = (next: SavedView[]) => {
    setSavedViews(next);
    try {
      window.localStorage.setItem(viewsKey, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  };
  const defaultViewKey = `flux-default-view:${props.table}`;
  const [defaultViewName, setDefaultViewName] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(defaultViewKey);
    } catch {
      return null;
    }
  });
  const toggleDefaultView = (name: string) => {
    const next = defaultViewName === name ? null : name;
    setDefaultViewName(next);
    try {
      if (next) window.localStorage.setItem(defaultViewKey, next);
      else window.localStorage.removeItem(defaultViewKey);
    } catch {
      // ignore quota errors
    }
  };

  // Row keyboard navigation: j/k or ↓/↑ move focus, Enter/e edit, d duplicate,
  // p toggle pin, Space/x toggle selection, Delete opens delete dialog.
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const pageRowsRef = useRef<Record<string, unknown>[]>([]);

  // Fullscreen (focus) mode: expands the table Card to fill the viewport,
  // hiding page chrome. Toggled via toolbar or Ctrl+Shift+F. Exits on Esc.
  const [fullscreen, setFullscreen] = useState(false);

  // Auto-refresh: 0 = off, otherwise seconds between silent refetches. Persisted
  // per-table so a dashboard-style view stays live across reloads.
  const autoRefreshKey = `flux-auto-refresh:${props.table}`;
  const [autoRefreshSec, setAutoRefreshSec] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = window.localStorage.getItem(autoRefreshKey);
      const n = raw ? Number(raw) : 0;
      return [0, 15, 30, 60, 300].includes(n) ? n : 0;
    } catch {
      return 0;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(autoRefreshKey, String(autoRefreshSec));
    } catch {
      // ignore quota errors
    }
  }, [autoRefreshSec, autoRefreshKey]);

  // Ticker so the "há Xs" label next to Auto refreshes every second.
  const [nowTick, setNowTick] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Freeze first data column (+ checkbox) to the left while scrolling
  // horizontally. Persisted per-table so wide cadastros keep the identifier
  // column visible after page reload.
  const freezeKey = `flux-freeze-first:${props.table}`;
  const [freezeFirst, setFreezeFirst] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(freezeKey) === "1";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(freezeKey, freezeFirst ? "1" : "0");
    } catch {
      // ignore quota errors
    }
  }, [freezeFirst, freezeKey]);

  const lastCheckedIdRef = useRef<string | null>(null);

  // Global keyboard shortcuts: "/" focus search, "n" open Novo, "Esc" clear selection.
  // Skips when a dialog is open or an input/textarea/contenteditable is focused.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ctrl/Cmd + Shift + F toggles fullscreen focus mode — allowed even
      // when a dialog is open would be confusing, so gate it too.
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "f" || e.key === "F")) {
        if (dialogOpen || deleteId || bulkConfirm || bulkEditOpen) return;
        e.preventDefault();
        setFullscreen((v) => !v);
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (dialogOpen || deleteId || bulkConfirm || bulkEditOpen) return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      const isEditable =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable;
      if (isEditable) return;
      if (e.key === "Escape" && fullscreen) {
        e.preventDefault();
        setFullscreen(false);
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        openCreate();
      } else if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      } else if (e.key === "Escape") {
        if (shortcutsOpen) setShortcutsOpen(false);
        else if (focusedRowId) setFocusedRowId(null);
        else if (selectedIds.size > 0) setSelectedIds(new Set());
      } else if (e.key === "j" || e.key === "k" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        const rows = pageRowsRef.current;
        if (!rows.length) return;
        e.preventDefault();
        const delta = e.key === "j" || e.key === "ArrowDown" ? 1 : -1;
        const cur = focusedRowId ? rows.findIndex((r) => String(r.id) === focusedRowId) : -1;
        const next =
          cur < 0
            ? delta > 0
              ? 0
              : rows.length - 1
            : Math.max(0, Math.min(rows.length - 1, cur + delta));
        const id = String(rows[next].id);
        setFocusedRowId(id);
        // Scroll the focused row into view within the scrollable table container.
        window.setTimeout(() => {
          document.querySelector(`[data-row-id="${id}"]`)?.scrollIntoView({ block: "nearest" });
        }, 0);
      } else if (focusedRowId) {
        const rows = pageRowsRef.current;
        const row = rows.find((r) => String(r.id) === focusedRowId);
        if (!row) return;
        if (e.key === "Enter" || e.key === "e" || e.key === "E") {
          e.preventDefault();
          openEdit(row);
        } else if (e.key === "d" || e.key === "D") {
          e.preventDefault();
          openDuplicate(row);
        } else if (e.key === "p" || e.key === "P") {
          e.preventDefault();
          togglePin(focusedRowId);
        } else if (e.key === " " || e.key === "x" || e.key === "X") {
          e.preventDefault();
          setSelectedIds((prev) => {
            const nx = new Set(prev);
            if (nx.has(focusedRowId)) nx.delete(focusedRowId);
            else nx.add(focusedRowId);
            return nx;
          });
        } else if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          setDeleteId(focusedRowId);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dialogOpen,
    deleteId,
    bulkConfirm,
    bulkEditOpen,
    shortcutsOpen,
    selectedIds.size,
    focusedRowId,
    fullscreen,
  ]);

  useEffect(() => {
    try {
      const prefs: CrudPrefs = { sortKey, sortDir, ativoFilter, pageSize, density };
      window.localStorage.setItem(prefsKey, JSON.stringify(prefs));
    } catch {
      // ignore quota errors
    }
  }, [sortKey, sortDir, ativoFilter, pageSize, density, prefsKey]);

  // Persist hidden columns per table in localStorage
  const hiddenKey = `flux-hidden-cols:${props.table}`;
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = window.localStorage.getItem(hiddenKey);
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(hiddenKey, JSON.stringify(Array.from(hiddenCols)));
    } catch {
      // ignore quota errors
    }
  }, [hiddenCols, hiddenKey]);

  // Column display order (drag-free reorder via ↑/↓ in the Colunas dropdown).
  // Persisted per-table; missing keys are appended in props.columns order so
  // newly added columns show up automatically.
  const colOrderKey = `flux-col-order:${props.table}`;
  const [colOrder, setColOrder] = useState<string[]>(() => {
    if (typeof window === "undefined") return props.columns.map((c) => c.key);
    try {
      const raw = window.localStorage.getItem(colOrderKey);
      const saved = raw ? (JSON.parse(raw) as string[]) : [];
      const allKeys = props.columns.map((c) => c.key);
      const kept = saved.filter((k) => allKeys.includes(k));
      const missing = allKeys.filter((k) => !kept.includes(k));
      return [...kept, ...missing];
    } catch {
      return props.columns.map((c) => c.key);
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(colOrderKey, JSON.stringify(colOrder));
    } catch {
      // ignore quota errors
    }
  }, [colOrder, colOrderKey]);
  const orderedColumns = useMemo(() => {
    const byKey = new Map(props.columns.map((c) => [c.key, c] as const));
    const out: ColumnDef[] = [];
    for (const k of colOrder) {
      const c = byKey.get(k);
      if (c) out.push(c);
    }
    // Append any column not yet in colOrder (defensive against stale state).
    for (const c of props.columns) {
      if (!colOrder.includes(c.key)) out.push(c);
    }
    return out;
  }, [props.columns, colOrder]);
  const moveColumn = (key: string, dir: -1 | 1) => {
    setColOrder((prev) => {
      const keys = orderedColumns.map((c) => c.key);
      const merged = prev.length ? prev.slice() : keys;
      // Ensure array reflects current ordered set
      const set = new Set(merged);
      for (const k of keys) if (!set.has(k)) merged.push(k);
      const idx = merged.indexOf(key);
      if (idx < 0) return merged;
      const target = idx + dir;
      if (target < 0 || target >= merged.length) return merged;
      const next = merged.slice();
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  // Column widths (px) — user resizes by dragging the right edge of a header.
  // Persisted per-table; unset keys fall back to natural width (no style set).
  const colWidthKey = `flux-col-widths:${props.table}`;
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(colWidthKey);
      return raw ? (JSON.parse(raw) as Record<string, number>) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(colWidthKey, JSON.stringify(colWidths));
    } catch {
      // ignore quota errors
    }
  }, [colWidths, colWidthKey]);
  const startResize = (key: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const th = e.currentTarget.closest("th") as HTMLTableCellElement | null;
    const startX = e.clientX;
    const startW = th?.getBoundingClientRect().width ?? colWidths[key] ?? 120;
    const onMove = (ev: MouseEvent) => {
      const next = Math.max(60, Math.round(startW + (ev.clientX - startX)));
      setColWidths((prev) => ({ ...prev, [key]: next }));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };
  const resetColWidth = (key: string) => {
    setColWidths((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Pinned rows: user-starred rows always float to the top of the filtered
  // list, above sorting. Stored per-table per-browser.
  const pinnedKey = `flux-pinned:${props.table}`;
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = window.localStorage.getItem(pinnedKey);
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(pinnedKey, JSON.stringify(Array.from(pinnedIds)));
    } catch {
      // ignore quota errors
    }
  }, [pinnedIds, pinnedKey]);
  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Per-column quick filters shown as a second header row when toggled on.
  // Complements the global search bar for spreadsheet-style narrowing.
  const [colFiltersOpen, setColFiltersOpen] = useState(false);
  const [colFilters, setColFilters] = useState<Record<string, string>>({});
  const activeColFilters = useMemo(
    () => Object.entries(colFilters).filter(([, v]) => v.trim() !== ""),
    [colFilters],
  );

  // Hydrate search/filters/sort from a shared link (?flux=<base64>). Runs
  // once on mount; if there is no param the URL is left alone. Lets a user
  // paste "the view I'm looking at" into chat and have colleagues open the
  // same filtered/sorted state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = new URLSearchParams(window.location.search).get("flux");
    if (raw) {
      try {
        const decoded = decodeURIComponent(escape(atob(raw)));
        const s = JSON.parse(decoded) as {
          t?: string;
          s?: string;
          f?: "ativos" | "inativos" | "todos";
          m?: boolean;
          d?: boolean;
          k?: string | null;
          o?: "asc" | "desc";
          cf?: Record<string, string>;
        };
        // Only apply when the link was built for THIS table (avoids leaking
        // filters between different CRUDs mounted on the same route later).
        if (s.t && s.t !== props.table) return;
        if (typeof s.s === "string") setSearch(s.s);
        if (s.f === "ativos" || s.f === "inativos" || s.f === "todos") setAtivoFilter(s.f);
        if (typeof s.m === "boolean") setOnlyMine(s.m);
        if (typeof s.d === "boolean") setOnlyToday(s.d);
        if (s.k) setSortKey(s.k);
        if (s.o === "asc" || s.o === "desc") setSortDir(s.o);
        if (s.cf && typeof s.cf === "object") {
          setColFilters(s.cf);
          if (Object.values(s.cf).some((x) => x && x.trim() !== "")) setColFiltersOpen(true);
        }
      } catch {
        // Ignore malformed links — behave as if no param was passed.
      }
      return;
    }
    // No share link → auto-apply the starred default view for this table, if any.
    try {
      const defName = window.localStorage.getItem(`flux-default-view:${props.table}`);
      if (!defName) return;
      const v = savedViews.find((x) => x.name === defName);
      if (!v) return;
      setSearch(v.s);
      setHiddenCols(new Set(v.hidden));
      setSortKey(v.k);
      setSortDir(v.o);
      setSortStack(v.stack ?? []);
      setAtivoFilter(v.ativo);
      setOnlyMine(v.mine);
      setOnlyToday(v.today);
      if (v.cf) {
        setColFilters(v.cf);
        if (Object.values(v.cf).some((x) => x.trim() !== "")) setColFiltersOpen(true);
      }
    } catch {
      // ignore malformed default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync current search / ativoFilter / page back to the URL as ?q, ?f, ?p
  // (debounced, replaceState — no router navigation, no history spam). Skipped
  // when a ?flux= share link is present so the share-link flow keeps owning
  // the URL. Lets users refresh / bookmark / share the current view.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has("flux")) return;
        const set = (k: string, v: string, def: string) => {
          if (v === def || v === "") url.searchParams.delete(k);
          else url.searchParams.set(k, v);
        };
        set("q", search.trim(), "");
        set("f", ativoFilter, initialPrefs.ativoFilter);
        set("p", String(page), "0");
        const next = url.pathname + (url.search ? url.search : "") + url.hash;
        const curr = window.location.pathname + window.location.search + window.location.hash;
        if (next !== curr) window.history.replaceState(window.history.state, "", next);
      } catch {
        // ignore
      }
    }, 250);
    return () => clearTimeout(t);
  }, [search, ativoFilter, page, initialPrefs.ativoFilter]);

  // can start typing immediately without reaching for the mouse.
  useEffect(() => {
    if (!dialogOpen) return;
    const target =
      props.fields.find((f) => f.type !== "boolean" && f.type !== "select") ?? props.fields[0];
    if (!target || typeof document === "undefined") return;
    const t = setTimeout(() => {
      const el = document.getElementById(target.name) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (!el) return;
      el.focus();
      if ("select" in el && typeof el.select === "function" && editing) {
        el.select();
      }
    }, 80);
    return () => clearTimeout(t);
  }, [dialogOpen, editing, props.fields]);

  // Auto-save "Novo" form drafts to localStorage (debounced) so an accidental
  // close doesn't discard user typing. Only when creating (not editing).
  useEffect(() => {
    if (!dialogOpen || editing) return;
    const t = setTimeout(() => {
      try {
        const hasContent = Object.values(form).some(
          (v) => v !== "" && v !== null && v !== undefined && v !== false,
        );
        if (hasContent) {
          window.localStorage.setItem(`flux-crud-draft:${props.table}`, JSON.stringify(form));
        }
      } catch {
        // ignore
      }
    }, 800);
    return () => clearTimeout(t);
  }, [form, dialogOpen, editing, props.table]);
  const visibleColumns = useMemo(
    () => orderedColumns.filter((c) => !hiddenCols.has(c.key)),
    [orderedColumns, hiddenCols],
  );

  const tenantQuery = useQuery({
    queryKey: ["tenant-id"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", user.id)
        .maybeSingle();
      return data?.tenant_id ?? null;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
  const tenantId = tenantQuery.data;

  const currentUserQuery = useQuery({
    queryKey: ["auth-user-id"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user?.id ?? null;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
  const currentUserId = currentUserQuery.data;
  const [onlyMine, setOnlyMine] = useState(false);
  const [onlyToday, setOnlyToday] = useState(false);

  // Safety cap: prevents CadastroCrud from downloading unbounded tables
  // (contas_pagar, ordens_producao, etc.), which used to produce multi-MB
  // JSON payloads and long client-side sort/filter loops. When the cap is
  // hit we surface a banner asking the user to narrow the view.
  const LIST_FETCH_CAP = 2000;

  // Debounced search text used as the server-side pre-filter. The immediate
  // `search` value still drives the rich client-side DSL (campo:valor, quoted
  // tokens, accent-insensitive) over whatever the server returns.
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(t);
  }, [search]);

  // Only push simple, single-token searches to the server. Multi-token or
  // scoped searches (`campo:valor`, quoted phrases) still run fully client-side
  // over the fetched page so the DSL semantics stay identical.
  const serverSearchToken = useMemo(() => {
    const raw = debouncedSearch.trim();
    if (!raw) return "";
    if (raw.includes(":") || raw.includes('"') || /\s/.test(raw)) return "";
    // Strip PostgREST/or() metacharacters to avoid syntax errors.
    return raw.replace(/[%,()*]/g, "").slice(0, 80);
  }, [debouncedSearch]);

  const listQuery = useQuery({
    queryKey: [
      props.table,
      tenantId,
      { s: serverSearchToken, a: tableHasAtivo ? ativoFilter : "todos" },
    ],
    enabled: !!tenantId,
    queryFn: async () => {
      let q = supabase
        .from(props.readTable ?? props.table)
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(LIST_FETCH_CAP);
      if (tableHasAtivo && ativoFilter !== "todos") {
        q = q.eq("ativo", ativoFilter === "ativos");
      }
      if (serverSearchToken && props.searchFields.length > 0) {
        const pattern = `*${serverSearchToken}*`;
        const orExpr = props.searchFields.map((f) => `${f}.ilike.${pattern}`).join(",");
        q = q.or(orExpr);
      }
      const { data, error, count } = await q;
      if (error) throw error;
      return {
        rows: (data ?? []) as Record<string, unknown>[],
        total: typeof count === "number" ? count : (data?.length ?? 0),
      };
    },
  });
  const listRowsRaw = listQuery.data?.rows ?? [];
  const listTotal = listQuery.data?.total ?? listRowsRaw.length;
  const listCapped = listRowsRaw.length >= LIST_FETCH_CAP;

  useRealtimeInvalidate(props.table, [[props.table, tenantId]], `rt-crud-${props.table}`);

  // Silent periodic refetch when auto-refresh is enabled. Pauses when the tab
  // is hidden to avoid wasted queries.
  useEffect(() => {
    if (autoRefreshSec <= 0) return;
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      listQuery.refetch();
    };
    const id = window.setInterval(tick, autoRefreshSec * 1000);
    return () => {
      stopped = true;
      window.clearInterval(id);
    };
    // Intentionally exclude listQuery from deps: it changes on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefreshSec]);

  // Load dynamic options for select fields
  const dynamicOptionsQueries = useQuery({
    queryKey: [props.table, "dynamic-options", tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const result: Record<string, FieldOption[]> = {};
      for (const f of props.fields) {
        if (f.loadOptions && tenantId) {
          result[f.name] = await f.loadOptions(tenantId);
        }
      }
      return result;
    },
  });

  const rows = listRowsRaw;
  // Secondary sort layers applied AFTER the primary (sortKey/sortDir).
  // Shift+click on a column header adds/toggles it in this stack.
  const [sortStack, setSortStack] = useState<{ key: string; dir: "asc" | "desc" }[]>([]);

  const filtered = useMemo(() => {
    let base = rows;
    if (tableHasAtivo && ativoFilter !== "todos") {
      const wantAtivo = ativoFilter === "ativos";
      base = base.filter((r) => Boolean(r.ativo) === wantAtivo);
    }
    if (onlyMine && currentUserId) {
      base = base.filter((r) => r.created_by === currentUserId);
    }
    if (onlyToday) {
      // Rows touched today (updated_at, fallback created_at) — quick daily audit.
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const t0 = startOfDay.getTime();
      base = base.filter((r) => {
        const raw = (r.updated_at ?? r.created_at) as string | null | undefined;
        if (!raw) return false;
        const t = new Date(raw).getTime();
        return Number.isFinite(t) && t >= t0;
      });
    }

    if (search.trim()) {
      // Column-scoped tokens: `campo:valor` restricts match to that column.
      // Bare tokens search across searchFields. Multiple tokens = AND.
      const stripAccents = (x: string) =>
        x
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      const resolveKey = (raw: string): string | null => {
        const n = stripAccents(raw);
        const hit = props.columns.find(
          (c) => c.key.toLowerCase() === n || stripAccents(c.label) === n,
        );
        if (hit) return hit.key;
        const f = props.fields.find(
          (f) => f.name.toLowerCase() === n || stripAccents(f.label) === n,
        );
        return f ? f.name : null;
      };
      const tokens = (search.match(/"[^"]+"|\S+/g) ?? []).map((t) => t.replace(/^"|"$/g, ""));
      const parsed = tokens.map((tok) => {
        const m = tok.match(/^([^:]+):(.*)$/);
        if (m) {
          const key = resolveKey(m[1]);
          if (key) return { key, val: stripAccents(m[2]) };
        }
        return { key: null as string | null, val: stripAccents(tok) };
      });
      base = base.filter((r) =>
        parsed.every(({ key, val }) => {
          if (!val) return true;
          if (key) return stripAccents(String(r[key] ?? "")).includes(val);
          return props.searchFields.some((k) => stripAccents(String(r[k] ?? "")).includes(val));
        }),
      );
    }
    if (activeColFilters.length > 0) {
      const strip = (x: string) =>
        x
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      const normFilters = activeColFilters.map(([k, v]) => [k, strip(v.trim())] as const);
      base = base.filter((r) =>
        normFilters.every(([k, v]) => strip(String(r[k] ?? "")).includes(v)),
      );
    }
    const layers: { key: string; dir: "asc" | "desc" }[] = [];
    if (sortKey) layers.push({ key: sortKey, dir: sortDir });
    for (const l of sortStack) {
      if (l.key !== sortKey) layers.push(l);
    }
    if (layers.length === 0) {
      if (pinnedIds.size === 0) return base;
      const pin: Record<string, unknown>[] = [];
      const rest: Record<string, unknown>[] = [];
      for (const r of base) (pinnedIds.has(String(r.id)) ? pin : rest).push(r);
      return [...pin, ...rest];
    }
    const cmpOne = (av: unknown, bv: unknown) => {
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const na = Number(av);
      const nb = Number(bv);
      if (!Number.isNaN(na) && !Number.isNaN(nb) && av !== "" && bv !== "") {
        return na - nb;
      }
      return String(av).localeCompare(String(bv), "pt-BR", { numeric: true });
    };
    const sorted = [...base].sort((a, b) => {
      for (const l of layers) {
        const c = cmpOne(a[l.key], b[l.key]);
        if (c !== 0) return l.dir === "asc" ? c : -c;
      }
      return 0;
    });
    if (pinnedIds.size === 0) return sorted;
    const pin: Record<string, unknown>[] = [];
    const rest: Record<string, unknown>[] = [];
    for (const r of sorted) (pinnedIds.has(String(r.id)) ? pin : rest).push(r);
    return [...pin, ...rest];
  }, [
    rows,
    search,
    sortKey,
    sortDir,
    sortStack,
    ativoFilter,
    tableHasAtivo,
    onlyMine,
    onlyToday,
    currentUserId,
    props.searchFields,
    pinnedIds,
    activeColFilters,
  ]);

  function toggleSort(key: string, shiftKey = false) {
    if (shiftKey && sortKey && key !== sortKey) {
      // Add or cycle a secondary sort layer.
      setSortStack((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (!existing) return [...prev, { key, dir: "asc" }];
        if (existing.dir === "asc") {
          return prev.map((l) => (l.key === key ? { key, dir: "desc" } : l));
        }
        return prev.filter((l) => l.key !== key);
      });
      return;
    }
    // Primary sort: clicking a new column resets the secondary stack.
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      setSortStack([]);
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortStack([]);
    }
  }

  // Split pinned vs unpinned so pinned rows appear on EVERY page, not just
  // page 0. Pagination is computed over unpinned only; pinned float on top.
  const pinnedRows = useMemo(
    () => filtered.filter((r) => pinnedIds.has(String(r.id))),
    [filtered, pinnedIds],
  );
  const unpinnedRows = useMemo(
    () => filtered.filter((r) => !pinnedIds.has(String(r.id))),
    [filtered, pinnedIds],
  );
  const totalPages = Math.max(1, Math.ceil(unpinnedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = useMemo(
    () => [
      ...pinnedRows,
      ...unpinnedRows.slice(currentPage * pageSize, currentPage * pageSize + pageSize),
    ],
    [pinnedRows, unpinnedRows, currentPage, pageSize],
  );
  useEffect(() => {
    pageRowsRef.current = pageRows;
    // Clear focus if the focused row is no longer on the current page.
    if (focusedRowId && !pageRows.some((r) => String(r.id) === focusedRowId)) {
      setFocusedRowId(null);
    }
  }, [pageRows, focusedRowId]);

  // Reset to first page when filter/sort changes result set size
  useEffect(() => {
    setPage(0);
  }, [search, sortKey, sortDir]);

  // Deep-link: if URL hash is #row-<id>, highlight that row on mount so
  // shared links land the reader directly on the referenced record.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    const m = /^#row-(.+)$/.exec(hash);
    if (!m) return;
    const id = decodeURIComponent(m[1]);
    setRecentIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      setRecentIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 5000);
  }, []);

  // When a record is just saved, jump to the page containing it and scroll
  // the row into view so the pulse highlight is actually visible.
  useEffect(() => {
    if (recentIds.size === 0) return;
    const targetId = Array.from(recentIds)[recentIds.size - 1];
    const idx = filtered.findIndex((r) => String(r.id) === targetId);
    if (idx < 0) return;
    const targetPage = Math.floor(idx / pageSize);
    if (targetPage !== currentPage) {
      setPage(targetPage);
    }
    // Defer scroll until after the target page has rendered.
    const t = setTimeout(() => {
      if (typeof document === "undefined") return;
      const el = document.querySelector(`[data-row-id="${CSS.escape(targetId)}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => clearTimeout(t);
  }, [recentIds, filtered, pageSize, currentPage]);

  // Detect numeric columns from filtered rows and compute their sum.
  // A column counts as numeric if at least one filtered row has a finite number
  // (and no row has a non-numeric, non-empty value in that column).
  const columnTotals = useMemo(() => {
    const source =
      selectedIds.size > 0 ? filtered.filter((r) => selectedIds.has(String(r.id))) : filtered;
    type Stat = {
      key: string;
      label: string;
      sum: number;
      count: number;
      min: number;
      max: number;
      avg: number;
    };
    if (source.length === 0) return [] as Stat[];
    const results: Stat[] = [];
    for (const c of visibleColumns) {
      let sum = 0;
      let count = 0;
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      let disqualified = false;
      for (const r of source) {
        const v = r[c.key];
        if (v === null || v === undefined || v === "") continue;
        const n = typeof v === "number" ? v : Number(v);
        if (Number.isFinite(n)) {
          sum += n;
          count += 1;
          if (n < min) min = n;
          if (n > max) max = n;
        } else {
          disqualified = true;
          break;
        }
      }
      if (!disqualified && count > 0) {
        results.push({
          key: c.key,
          label: c.label,
          sum,
          count,
          min,
          max,
          avg: sum / count,
        });
      }
    }
    return results;
  }, [filtered, selectedIds, visibleColumns]);

  const totalsFormatter = useMemo(
    () => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }),
    [],
  );

  const draftKey = `flux-crud-draft:${props.table}`;

  function readDraft(): Record<string, unknown> | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(draftKey);
      return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  function clearDraft() {
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
  }

  async function openCreate() {
    setEditing(null);
    setMissingFields(new Set());
    const hasAtivo = props.fields.some((f) => f.name === "ativo");
    const base = { ...(hasAtivo ? { ativo: true } : {}), ...(props.defaultValues ?? {}) };
    const draft = readDraft();
    if (draft && Object.keys(draft).length > 0) {
      const restore = await confirmDialog({
        title: `Encontramos um rascunho não salvo de ${props.singular}.`,
        description: "Deseja restaurar?",
      });
      if (restore) {
        setForm({ ...base, ...draft });
        setDialogOpen(true);
        toast.info("Rascunho restaurado — revise e salve.");
        return;
      }
      clearDraft();
    }
    setForm(base);
    setDialogOpen(true);
  }
  function openEdit(row: Record<string, unknown>) {
    setEditing(row);
    setMissingFields(new Set());
    setForm({ ...row });
    setDialogOpen(true);
  }
  // Where "editing" sits in the current filtered/sorted list — powers the
  // "anterior/próximo" navigation inside the edit dialog.
  const adjacentInfo = useMemo(() => {
    if (!editing?.id) return { index: -1, total: filtered.length };
    const idx = filtered.findIndex((r) => String(r.id) === String(editing.id));
    return { index: idx, total: filtered.length };
  }, [editing, filtered]);
  function openAdjacent(delta: number) {
    if (filtered.length === 0) return;
    const currentIdx = adjacentInfo.index;
    // If the current row was filtered out, start from the top/bottom.
    const base = currentIdx >= 0 ? currentIdx : delta > 0 ? -1 : filtered.length;
    const next = (base + delta + filtered.length) % filtered.length;
    const row = filtered[next];
    if (row) openEdit(row);
  }
  function openDuplicate(row: Record<string, unknown>) {
    setEditing(null);
    setMissingFields(new Set());
    const clone = { ...row };
    // strip identifiers/timestamps so save creates a new row
    delete clone.id;
    delete clone.created_at;
    delete clone.updated_at;
    delete clone.created_by;
    // clear unique "numero" so user picks a new one
    if ("numero" in clone) clone.numero = "";
    setForm({ ...(props.defaultValues ?? {}), ...clone });
    setDialogOpen(true);
    toast.info("Duplicando registro — ajuste e salve.");
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!tenantId) throw new Error("Empresa não identificada");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Trim string inputs before validating so " " is treated as empty
      const trimmed: Record<string, unknown> = { ...form };
      for (const f of props.fields) {
        const v = trimmed[f.name];
        if (typeof v === "string" && f.type !== "textarea") {
          // collapse internal whitespace on single-line inputs, keep textareas intact
          trimmed[f.name] = v.trim().replace(/\s+/g, " ");
        } else if (typeof v === "string") {
          trimmed[f.name] = v.trim();
        }
      }

      // Validate ALL required fields at once so the user sees every miss
      const missing = new Set<string>();
      for (const f of props.fields) {
        if (f.required) {
          const v = trimmed[f.name];
          if (v === undefined || v === null || v === "") missing.add(f.name);
        }
      }
      if (missing.size > 0) {
        setMissingFields(missing);
        const first = props.fields.find((f) => missing.has(f.name));
        if (first && typeof document !== "undefined") {
          const el = document.getElementById(first.name);
          el?.focus();
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        const labels = props.fields
          .filter((f) => missing.has(f.name))
          .map((f) => f.label)
          .join(", ");
        throw new Error(`Preencha os campos obrigatórios: ${labels}`);
      }
      setMissingFields(new Set());

      // Enforce a defensive length cap so a runaway paste can't produce
      // multi-MB rows or bypass DB column limits.
      const MAX_LEN = 5000;
      for (const f of props.fields) {
        const v = trimmed[f.name];
        if (typeof v === "string" && v.length > MAX_LEN) {
          throw new Error(
            `Campo "${f.label}" excede ${MAX_LEN} caracteres (${v.length}). Reduza o texto.`,
          );
        }
      }

      const payload: Record<string, unknown> = { ...trimmed };
      // Normalize empty strings to null for optional fields; coerce number types
      for (const f of props.fields) {
        if (payload[f.name] === "") payload[f.name] = null;
        if (f.type === "number" && payload[f.name] !== null && payload[f.name] !== undefined) {
          const n = Number(payload[f.name]);
          if (Number.isNaN(n)) {
            throw new Error(`Campo "${f.label}" deve ser um número válido.`);
          }
          payload[f.name] = n;
        }
      }

      if (editing) {
        // Snapshot the ORIGINAL values of every editable field so the "Desfazer"
        // toast can revert a single-row edit to what it was before this save.
        const prevSnapshot: Record<string, unknown> = {};
        for (const f of props.fields) {
          prevSnapshot[f.name] = (editing as Record<string, unknown>)[f.name] ?? null;
        }
        const { error } = await supabase
          .from(props.table)
          .update({ ...payload, updated_by: user.id })
          .eq("id", editing.id as string);
        if (error) throw error;
        return { id: String(editing.id), prev: prevSnapshot };
      } else {
        // Duplicate detection: warn when a new record shares "nome" or "numero"
        // (case-insensitive, trimmed) with an existing row in the same tenant.
        const dupKeys = ["nome", "numero", "codigo"].filter((k) =>
          props.fields.some((f) => f.name === k),
        );
        const dupHits: { key: string; label: string; value: string }[] = [];
        for (const k of dupKeys) {
          const v = payload[k];
          if (typeof v !== "string" || !v) continue;
          const needle = v.toLowerCase();
          const hit = rows.find((r) => String(r[k] ?? "").toLowerCase() === needle);
          if (hit) {
            const field = props.fields.find((f) => f.name === k);
            dupHits.push({ key: k, label: field?.label ?? k, value: v });
          }
        }
        if (dupHits.length > 0) {
          const summary = dupHits.map((d) => `${d.label} = "${d.value}"`).join("\n");
          const proceed = await confirmDialog({
            title: `Já existe um ${props.singular.toLowerCase()} com dados similares.`,
            description: `${summary}\n\nDeseja cadastrar mesmo assim?`,
          });
          if (!proceed) throw new Error("Cadastro cancelado — possível duplicidade.");
        }
        const { data, error } = await supabase
          .from(props.table)
          .insert({ ...payload, tenant_id: tenantId, created_by: user.id })
          .select("id")
          .single();
        if (error) throw error;
        return { id: String((data as { id: string } | null)?.id ?? "") };
      }
    },
    onSuccess: (result) => {
      const wasEditing = !!editing;
      const keepOpen = keepOpenAfterSaveRef.current && !wasEditing;
      keepOpenAfterSaveRef.current = false;
      const changedId = result?.id;
      const prev =
        "prev" in (result ?? {}) ? (result as { prev?: Record<string, unknown> }).prev : undefined;
      if (wasEditing && prev && changedId) {
        toast.success(`${props.singular} atualizado`, {
          duration: 10000,
          action: {
            label: "Desfazer",
            onClick: async () => {
              const {
                data: { user },
              } = await supabase.auth.getUser();
              const patch: Record<string, unknown> = { ...prev };
              if (user) patch.updated_by = user.id;
              const { error } = await supabase.from(props.table).update(patch).eq("id", changedId);
              if (error) {
                toast.error(`Não foi possível reverter: ${friendlyError(error)}`);
                return;
              }
              qc.invalidateQueries({ queryKey: [props.table] });
              toast.success("Edição revertida");
            },
          },
        });
      } else {
        toast.success(wasEditing ? `${props.singular} atualizado` : `${props.singular} criado`);
      }
      haptic.success();
      qc.invalidateQueries({ queryKey: [props.table] });
      if (changedId) {
        setRecentIds((p) => {
          const next = new Set(p);
          next.add(changedId);
          return next;
        });
        setTimeout(() => {
          setRecentIds((p) => {
            const next = new Set(p);
            next.delete(changedId);
            return next;
          });
        }, 4000);
      }
      if (keepOpen) {
        // Reset form for the next entry, keep dialog open, refocus first field.
        clearDraft();
        setForm({ ...(props.defaultValues ?? {}) });
        setMissingFields(new Set());
        setTimeout(() => {
          const first = props.fields.find((f) => f.type !== "boolean" && f.type !== "select");
          if (first && typeof document !== "undefined") {
            document.getElementById(first.name)?.focus();
          }
        }, 60);
      } else {
        setDialogOpen(false);
        clearDraft();
      }
    },
    onError: (err: Error) => {
      keepOpenAfterSaveRef.current = false;
      toast.error(friendlyError(err));
      haptic.error();
    },
  });

  // Restore previously deleted rows (undo). Re-inserts with original ids/timestamps.
  async function restoreRows(snapshot: Record<string, unknown>[]) {
    if (snapshot.length === 0) return;
    const { error } = await supabase.from(props.table).insert(snapshot);
    if (error) {
      toast.error(`Não foi possível desfazer: ${friendlyError(error)}`);
      return;
    }
    toast.success(
      snapshot.length === 1
        ? `${props.singular} restaurado`
        : `${snapshot.length} registros restaurados`,
    );
    qc.invalidateQueries({ queryKey: [props.table] });
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const snapshot = rows.find((r) => String(r.id) === id) ?? null;
      const { error } = await supabase.from(props.table).delete().eq("id", id);
      if (error) throw error;
      return snapshot;
    },
    onSuccess: (snapshot) => {
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: [props.table] });
      if (snapshot) {
        toast.success(`${props.singular} removido`, {
          action: { label: "Desfazer", onClick: () => restoreRows([snapshot]) },
          duration: 8000,
        });
      } else {
        toast.success(`${props.singular} removido`);
      }
      haptic.medium();
    },
    onError: (err: Error) => {
      toast.error(friendlyError(err));
      haptic.error();
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const idSet = new Set(ids);
      const snapshot = rows.filter((r) => idSet.has(String(r.id)));
      const { error } = await supabase.from(props.table).delete().in("id", ids);
      if (error) throw error;
      return snapshot;
    },
    onSuccess: (snapshot) => {
      const count = snapshot.length;
      setSelectedIds(new Set());
      setBulkConfirm(false);
      qc.invalidateQueries({ queryKey: [props.table] });
      toast.success(`${count} ${count === 1 ? "registro removido" : "registros removidos"}`, {
        action: { label: "Desfazer", onClick: () => restoreRows(snapshot) },
        duration: 10000,
      });
      haptic.medium();
    },
    onError: (err: Error) => {
      toast.error(friendlyError(err));
      haptic.error();
    },
  });

  const bulkToggleAtivoMutation = useMutation({
    mutationFn: async ({ ids, ativo }: { ids: string[]; ativo: boolean }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const patch: Record<string, unknown> = { ativo };
      if (user) patch.updated_by = user.id;
      const { error } = await supabase.from(props.table).update(patch).in("id", ids);
      if (error) throw error;
      return { count: ids.length, ativo };
    },
    onSuccess: ({ count, ativo }) => {
      toast.success(
        `${count} ${count === 1 ? "registro" : "registros"} ${ativo ? "ativado" : "desativado"}${count === 1 ? "" : "s"}`,
      );
      setSelectedIds(new Set());
      qc.invalidateQueries({ queryKey: [props.table] });
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  // Bulk duplicate: clones selected rows as new inserts (strips id/timestamps,
  // clears unique "numero"), then selects the new rows so the user can act on them.
  const bulkDuplicateMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      if (!tenantId) throw new Error("Empresa não identificada");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const idSet = new Set(ids);
      const source = rows.filter((r) => idSet.has(String(r.id)));
      if (source.length === 0) throw new Error("Nada selecionado");
      const payload = source.map((r) => {
        const clone: Record<string, unknown> = { ...r };
        delete clone.id;
        delete clone.created_at;
        delete clone.updated_at;
        delete clone.created_by;
        delete clone.updated_by;
        if ("numero" in clone) clone.numero = null;
        clone.tenant_id = tenantId;
        clone.created_by = user.id;
        return clone;
      });
      const { data, error } = await supabase.from(props.table).insert(payload).select("id");
      if (error) throw error;
      return {
        count: payload.length,
        newIds: (data ?? []).map((d: { id: unknown }) => String(d.id)),
      };
    },
    onSuccess: ({ count, newIds }) => {
      qc.invalidateQueries({ queryKey: [props.table] });
      setSelectedIds(new Set(newIds));
      toast.success(
        `${count} ${count === 1 ? "registro duplicado" : "registros duplicados"} — cópias já selecionadas`,
      );
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  // Import CSV/TSV: paste text, auto-detect delimiter, auto-map headers to
  // field.name / field.label, preview rows, then bulk insert.
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importOverrides, setImportOverrides] = useState<Record<number, string | null>>({});

  function parseDelimited(text: string, delim: string): string[][] {
    const rows: string[][] = [];
    let cur: string[] = [];
    let field = "";
    let inQuotes = false;
    let i = 0;
    while (i < text.length) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i += 2;
            continue;
          }
          inQuotes = false;
          i++;
          continue;
        }
        field += c;
        i++;
        continue;
      }
      if (c === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (c === delim) {
        cur.push(field);
        field = "";
        i++;
        continue;
      }
      if (c === "\n" || c === "\r") {
        cur.push(field);
        field = "";
        if (!(cur.length === 1 && cur[0] === "")) rows.push(cur);
        cur = [];
        if (c === "\r" && text[i + 1] === "\n") i += 2;
        else i++;
        continue;
      }
      field += c;
      i++;
    }
    if (field !== "" || cur.length > 0) {
      cur.push(field);
      rows.push(cur);
    }
    return rows;
  }

  const importParsed = useMemo(() => {
    const text = importText.trim();
    if (!text) return null;
    const firstLine = text.split(/\r?\n/, 1)[0];
    const tabs = (firstLine.match(/\t/g) || []).length;
    const semis = (firstLine.match(/;/g) || []).length;
    const commas = (firstLine.match(/,/g) || []).length;
    const delim = tabs >= semis && tabs >= commas ? "\t" : semis > commas ? ";" : ",";
    const rows = parseDelimited(text, delim);
    if (rows.length === 0) return null;
    const headers = rows[0].map((h) => h.trim());
    const data = rows.slice(1).filter((r) => r.some((c) => c.trim() !== ""));
    const strip = (x: string) =>
      x
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    const auto = headers.map((h) => {
      const n = strip(h);
      if (!n) return null;
      const match = props.fields.find((f) => strip(f.name) === n || strip(f.label) === n);
      return match?.name ?? null;
    });
    const mappings = headers.map((_, i) =>
      importOverrides[i] === undefined ? auto[i] : importOverrides[i],
    );
    return { headers, data, delim, mappings };
  }, [importText, props.fields, importOverrides]);

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!importParsed) throw new Error("Nada para importar");
      if (!tenantId) throw new Error("Empresa não identificada");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const { data: dataRows, mappings } = importParsed;
      const mappedIdx = mappings
        .map((m, i) => ({ m, i }))
        .filter((x): x is { m: string; i: number } => !!x.m);
      if (mappedIdx.length === 0) throw new Error("Nenhuma coluna mapeada");
      const payload = dataRows.map((row) => {
        const obj: Record<string, unknown> = {};
        for (const { m, i } of mappedIdx) {
          const raw = (row[i] ?? "").trim();
          const fdef = props.fields.find((f) => f.name === m);
          if (raw === "") {
            obj[m] = null;
            continue;
          }
          if (fdef?.type === "number") {
            const n = Number(raw.replace(",", "."));
            obj[m] = Number.isFinite(n) ? n : null;
          } else if (fdef?.type === "boolean") {
            obj[m] = /^(1|true|sim|yes|s|y)$/i.test(raw);
          } else {
            obj[m] = raw;
          }
        }
        obj.tenant_id = tenantId;
        obj.created_by = user.id;
        return obj;
      });
      const { data, error } = await supabase.from(props.table).insert(payload).select("id");
      if (error) throw error;
      return {
        count: payload.length,
        newIds: (data ?? []).map((d: { id: unknown }) => String(d.id)),
      };
    },
    onSuccess: ({ count, newIds }) => {
      qc.invalidateQueries({ queryKey: [props.table] });
      setSelectedIds(new Set(newIds));
      setImportOpen(false);
      setImportText("");
      setImportOverrides({});
      toast.success(
        `${count} ${count === 1 ? "registro importado" : "registros importados"} — cópias já selecionadas`,
      );
    },
    onError: (err: Error) => toast.error(`Erro ao importar: ${friendlyError(err)}`),
  });

  // Restore per-row previous values of a single field (bulk-edit undo).
  async function restoreFieldValues(field: string, prev: { id: string; value: unknown }[]) {
    if (prev.length === 0) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const results = await Promise.all(
      prev.map(({ id, value }) => {
        const patch: Record<string, unknown> = { [field]: value };
        if (user) patch.updated_by = user.id;
        return supabase.from(props.table).update(patch).eq("id", id);
      }),
    );
    const failed = results.filter((r) => r.error).length;
    if (failed > 0) {
      toast.error(`Não foi possível reverter ${failed} registro(s).`);
    } else {
      toast.success(`Alteração revertida em ${prev.length} registro(s)`);
    }
    qc.invalidateQueries({ queryKey: [props.table] });
  }

  const bulkEditMutation = useMutation({
    mutationFn: async ({ ids, field, value }: { ids: string[]; field: string; value: unknown }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const fdef = props.fields.find((f) => f.name === field);
      let coerced: unknown = value;
      if (fdef?.type === "number") {
        if (value === "" || value === null || value === undefined) coerced = null;
        else {
          const n = Number(value);
          if (!Number.isFinite(n)) throw new Error(`Valor inválido para "${fdef.label}".`);
          coerced = n;
        }
      } else if (fdef?.type === "boolean") {
        coerced = Boolean(value);
      } else if (typeof value === "string") {
        const trimmed = value.trim();
        coerced = trimmed === "" ? null : trimmed;
      }
      // Snapshot previous values BEFORE the update so we can offer undo.
      const idSet = new Set(ids);
      const snapshot = rows
        .filter((r) => idSet.has(String(r.id)))
        .map((r) => ({ id: String(r.id), value: r[field] }));
      const patch: Record<string, unknown> = { [field]: coerced };
      if (user) patch.updated_by = user.id;
      const { error } = await supabase.from(props.table).update(patch).in("id", ids);
      if (error) throw error;
      return {
        count: ids.length,
        field,
        label: fdef?.label ?? field,
        snapshot,
      };
    },
    onSuccess: ({ count, label, field, snapshot }) => {
      toast.success(
        `Campo "${label}" atualizado em ${count} ${count === 1 ? "registro" : "registros"}`,
        {
          action: {
            label: "Desfazer",
            onClick: () => restoreFieldValues(field, snapshot),
          },
          duration: 10000,
        },
      );
      setBulkEditOpen(false);
      setBulkEditField("");
      setBulkEditValue("");
      setSelectedIds(new Set());
      qc.invalidateQueries({ queryKey: [props.table] });
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  const toggleRowAtivoMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const patch: Record<string, unknown> = { ativo };
      if (user) patch.updated_by = user.id;
      const { error } = await supabase.from(props.table).update(patch).eq("id", id);
      if (error) throw error;
      return { ativo };
    },
    onSuccess: ({ ativo }) => {
      toast.success(ativo ? `${props.singular} ativado` : `${props.singular} desativado`);
      qc.invalidateQueries({ queryKey: [props.table] });
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  function renderField(f: FieldDef) {
    const value = form[f.name] ?? "";
    const setValue = (v: unknown) => {
      setForm((prev) => ({ ...prev, [f.name]: v }));
      if (missingFields.has(f.name) && v !== "" && v !== null && v !== undefined) {
        setMissingFields((prev) => {
          const next = new Set(prev);
          next.delete(f.name);
          return next;
        });
      }
    };
    const spanCls = f.colSpan === 2 ? "sm:col-span-2" : "";
    const isMissing = missingFields.has(f.name);
    const invalidCls = isMissing ? "border-destructive ring-2 ring-destructive/30" : "";
    // Visual "modificado" dot in edit mode when the field differs from the row
    // originally opened — lets the user see at a glance what will change.
    const norm = (v: unknown) => (v === undefined || v === null || v === "" ? "" : String(v));
    const isChanged =
      !!editing && norm(form[f.name]) !== norm((editing as Record<string, unknown>)[f.name]);
    const changedDot = isChanged ? (
      <span
        className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-warning align-middle"
        title="Campo alterado — ainda não salvo"
        aria-label="alterado"
      />
    ) : null;

    if (f.type === "textarea") {
      return (
        <div key={f.name} className={`space-y-1.5 ${spanCls}`}>
          <Label htmlFor={f.name}>
            {f.label} {f.required && <span className="text-destructive">*</span>}
            {changedDot}
          </Label>
          <Textarea
            id={f.name}
            value={String(value ?? "")}
            onChange={(e) => setValue(e.target.value)}
            placeholder={f.placeholder}
            rows={3}
            aria-invalid={isMissing || undefined}
            aria-required={f.required || undefined}
            className={invalidCls}
          />
        </div>
      );
    }

    if (f.type === "select") {
      const opts = f.options ?? dynamicOptionsQueries.data?.[f.name] ?? [];
      return (
        <div key={f.name} className={`space-y-1.5 ${spanCls}`}>
          <Label htmlFor={f.name}>
            {f.label} {f.required && <span className="text-destructive">*</span>}
            {changedDot}
          </Label>
          <Select value={String(value ?? "")} onValueChange={(v) => setValue(v)}>
            <SelectTrigger
              id={f.name}
              aria-invalid={isMissing || undefined}
              aria-required={f.required || undefined}
              className={invalidCls}
            >
              <SelectValue placeholder={f.placeholder ?? "Selecione..."} />
            </SelectTrigger>
            <SelectContent>
              {opts.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (f.type === "boolean") {
      return (
        <div key={f.name} className={`flex items-center gap-2 ${spanCls}`}>
          <Checkbox
            id={f.name}
            checked={Boolean(value)}
            onCheckedChange={(checked) => setValue(Boolean(checked))}
          />
          <Label htmlFor={f.name} className="cursor-pointer">
            {f.label}
            {changedDot}
          </Label>
        </div>
      );
    }

    const isNumeric = f.type === "number";
    return (
      <div key={f.name} className={`space-y-1.5 ${spanCls}`}>
        <Label htmlFor={f.name}>
          {f.label} {f.required && <span className="text-destructive">*</span>}
          {changedDot}
        </Label>
        <Input
          id={f.name}
          type={
            isNumeric
              ? "number"
              : f.type === "date"
                ? "date"
                : f.type === "datetime"
                  ? "datetime-local"
                  : "text"
          }
          inputMode={isNumeric ? "decimal" : undefined}
          step={f.step}
          value={
            f.type === "datetime" && value
              ? String(value).slice(0, 16)
              : f.type === "date" && value
                ? String(value).slice(0, 10)
                : String(value ?? "")
          }
          onChange={(e) => setValue(e.target.value)}
          placeholder={f.placeholder}
          aria-invalid={isMissing || undefined}
          aria-required={f.required || undefined}
          className={`${isNumeric ? "tabular-nums" : ""} ${invalidCls}`.trim()}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={props.title}
        description={props.description}
        crumbs={props.crumbs}
        help={props.help}
      />

      <div
        className={
          fullscreen
            ? "fixed inset-0 z-50 space-y-4 overflow-auto bg-background p-4 sm:space-y-6 sm:p-6"
            : "mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6"
        }
      >
        <Card className="print-block">
          <div className="hidden print:block px-6 pt-4 pb-2">
            <h1 className="text-lg font-semibold text-foreground">{props.plural}</h1>
            <p className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
              {search && ` · busca: "${search}"`}
              {" · impresso em "}
              {new Date().toLocaleString("pt-BR")}
            </p>
          </div>
          <CardHeader className="flex flex-wrap items-start justify-between gap-3 space-y-0 px-3 pt-4 no-print sm:px-6 sm:pt-6">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate" title={props.plural}>
                {props.plural}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-medium text-foreground">
                  {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
                </span>
                {filtered.length !== rows.length && (
                  <span className="text-muted-foreground/80">
                    (de {rows.length} no total
                    {rows.length > 0 && (
                      <> · {Math.round((filtered.length / rows.length) * 100)}%</>
                    )}
                    )
                  </span>
                )}
                {selectedIds.size > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {selectedIds.size} selecionado{selectedIds.size === 1 ? "" : "s"}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
              {tableHasAtivo && (
                <div
                  role="group"
                  aria-label="Filtrar por status"
                  className="inline-flex rounded-md border border-border bg-muted/40 p-0.5 text-xs"
                >
                  {(["ativos", "inativos", "todos"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={ativoFilter === k}
                      onClick={() => setAtivoFilter(k)}
                      className={
                        ativoFilter === k
                          ? "rounded px-2.5 py-1 bg-background font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          : "rounded px-2.5 py-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      }
                    >
                      {k === "ativos" ? "Ativos" : k === "inativos" ? "Inativos" : "Todos"}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                aria-pressed={onlyMine}
                onClick={() => setOnlyMine((v) => !v)}
                className={
                  onlyMine
                    ? "rounded-md border border-primary/60 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    : "rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                }
                title="Mostrar apenas registros criados por mim"
              >
                Meus
              </button>
              <button
                type="button"
                aria-pressed={onlyToday}
                onClick={() => setOnlyToday((v) => !v)}
                className={
                  onlyToday
                    ? "rounded-md border border-primary/60 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    : "rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                }
                title="Mostrar apenas registros criados ou alterados hoje"
              >
                Hoje
              </button>

              <div className="relative order-first basis-full w-full sm:order-none sm:basis-auto sm:w-64 md:w-72">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder="Buscar... (/ atalho · use campo:valor)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => {
                    // Delay so clicks on the dropdown register first.
                    window.setTimeout(() => setSearchFocused(false), 150);
                    rememberSearch(search);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      rememberSearch(search);
                    } else if (e.key === "Escape" && search) {
                      e.preventDefault();
                      setSearch("");
                    }
                  }}
                  className="h-9 w-full pl-8 pr-9 [&::-webkit-search-cancel-button]:hidden"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    title="Limpar busca (Esc)"
                    aria-label="Limpar busca"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}

                {searchFocused && !search && recentSearches.length > 0 && (
                  <div className="absolute left-0 right-0 top-10 z-20 rounded-md border border-border bg-popover p-1 text-sm shadow-md">
                    <div className="px-2 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                      Buscas recentes
                    </div>
                    {recentSearches.map((q) => (
                      <div
                        key={q}
                        className="group flex items-center justify-between gap-2 rounded px-2 py-1 hover:bg-muted"
                      >
                        <button
                          type="button"
                          className="flex-1 truncate text-left"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearch(q);
                            setPage(0);
                            setSearchFocused(false);
                          }}
                          title={`Aplicar: ${q}`}
                        >
                          {q}
                        </button>
                        <button
                          type="button"
                          className="rounded p-0.5 text-muted-foreground transition-opacity hover:bg-background hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 sm:opacity-0"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            forgetSearch(q);
                          }}
                          title="Remover do histórico"
                          aria-label={`Remover ${q}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-1 w-full rounded px-2 py-1 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        clearRecentSearches();
                      }}
                    >
                      Limpar histórico
                    </button>
                  </div>
                )}
              </div>
              {(search ||
                (tableHasAtivo && ativoFilter !== "ativos") ||
                onlyMine ||
                onlyToday ||
                sortKey ||
                activeColFilters.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    if (tableHasAtivo) setAtivoFilter("ativos");
                    setOnlyMine(false);
                    setOnlyToday(false);
                    setSortKey(null);
                    setSortDir("asc");
                    setSortStack([]);
                    setColFilters({});
                    setPage(0);
                  }}
                  title="Limpar busca, filtros e ordenação"
                >
                  Limpar filtros
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const state = {
                    t: props.table,
                    s: search,
                    f: ativoFilter,
                    m: onlyMine,
                    d: onlyToday,
                    k: sortKey,
                    o: sortDir,
                    cf: colFilters,
                  };
                  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
                  const url = new URL(window.location.href);
                  url.searchParams.set("flux", encoded);
                  navigator.clipboard.writeText(url.toString());
                  toast.success(
                    "Link da visão copiado — abra em outra aba/navegador para ver os mesmos filtros",
                  );
                }}
                title="Copiar link com busca, filtros e ordenação atuais"
              >
                <Link2 className="mr-1 h-4 w-4" />
                Compartilhar visão
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    title="Visões salvas (busca + filtros + ordenação + colunas)"
                  >
                    Visões{savedViews.length > 0 ? ` (${savedViews.length})` : ""}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Visões salvas</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async (e) => {
                      e.preventDefault();
                      const name = (await promptDialog({
                        title: "Salvar visão atual",
                        label: "Nome da visão",
                        placeholder: "Ex: Ativos deste mês",
                        confirmLabel: "Salvar",
                      }))?.trim();
                      if (!name) return;
                      const view: SavedView = {
                        name,
                        s: search,
                        hidden: Array.from(hiddenCols),
                        k: sortKey,
                        o: sortDir,
                        stack: sortStack,
                        ativo: ativoFilter,
                        mine: onlyMine,
                        today: onlyToday,
                        cf: { ...colFilters },
                      };
                      const next = [view, ...savedViews.filter((v) => v.name !== name)].slice(
                        0,
                        20,
                      );
                      persistViews(next);
                      toast.success(`Visão "${name}" salva`);
                    }}
                  >
                    + Salvar visão atual…
                  </DropdownMenuItem>
                  {savedViews.length === 0 && (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      Nenhuma visão salva ainda.
                    </div>
                  )}
                  {savedViews.length > 0 && <DropdownMenuSeparator />}
                  {savedViews.map((v) => (
                    <div
                      key={v.name}
                      className="group flex items-center justify-between gap-2 px-2 py-1 text-sm hover:bg-accent"
                    >
                      <button
                        type="button"
                        className="flex-1 truncate text-left"
                        onClick={() => {
                          setSearch(v.s);
                          setHiddenCols(new Set(v.hidden));
                          setSortKey(v.k);
                          setSortDir(v.o);
                          setSortStack(v.stack ?? []);
                          if (tableHasAtivo) setAtivoFilter(v.ativo);
                          setOnlyMine(v.mine);
                          setOnlyToday(v.today);
                          setColFilters(v.cf ?? {});
                          if (v.cf && Object.values(v.cf).some((x) => x.trim() !== "")) {
                            setColFiltersOpen(true);
                          }
                          setPage(0);
                          toast.success(`Visão "${v.name}" aplicada`);
                        }}
                        title="Aplicar esta visão"
                      >
                        {v.name}
                      </button>
                      <button
                        type="button"
                        className={`rounded p-0.5 transition-opacity ${defaultViewName === v.name ? "text-warning" : "text-muted-foreground focus-visible:opacity-100 group-hover:opacity-100 sm:opacity-0"} hover:bg-background hover:text-warning`}
                        onClick={() => {
                          toggleDefaultView(v.name);
                          toast.success(
                            defaultViewName === v.name
                              ? `"${v.name}" não é mais a visão padrão`
                              : `"${v.name}" será aplicada ao abrir esta tela`,
                          );
                        }}
                        title={
                          defaultViewName === v.name
                            ? "Remover como visão padrão"
                            : "Definir como visão padrão (auto-aplica ao abrir)"
                        }
                        aria-label={`Alternar padrão para ${v.name}`}
                      >
                        <Star
                          className={`h-3 w-3 ${defaultViewName === v.name ? "fill-warning text-warning" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        className="rounded p-0.5 text-muted-foreground transition-opacity hover:bg-background hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 sm:opacity-0"
                        onClick={() => {
                          if (defaultViewName === v.name) toggleDefaultView(v.name);
                          persistViews(savedViews.filter((x) => x.name !== v.name));
                          toast.success(`Visão "${v.name}" removida`);
                        }}
                        title="Remover visão"
                        aria-label={`Remover ${v.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const rowsForExport =
                    selectedIds.size > 0
                      ? filtered.filter((r) => selectedIds.has(String(r.id)))
                      : filtered;
                  if (rowsForExport.length === 0) {
                    toast.info("Nada para exportar.");
                    return;
                  }
                  exportToCsv(
                    props.title,
                    visibleColumns.map((c) => ({
                      header: c.label,
                      accessor: (r: Record<string, unknown>) => r[c.key],
                    })),
                    rowsForExport,
                  );
                  toast.success(
                    `Exportado ${rowsForExport.length} ${rowsForExport.length === 1 ? "registro" : "registros"}${selectedIds.size > 0 ? " (seleção)" : ""}`,
                  );
                }}
                disabled={filtered.length === 0}
                title={
                  selectedIds.size > 0
                    ? `Exportar ${selectedIds.size} selecionados`
                    : "Exportar visíveis"
                }
              >
                <Download className="mr-1 h-4 w-4" />
                {selectedIds.size > 0 ? `Exportar (${selectedIds.size})` : "Exportar"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setImportText("");
                  setImportOverrides({});
                  setImportOpen(true);
                }}
                title="Importar registros colando CSV/TSV (ex.: de uma planilha)"
              >
                Importar
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                title="Imprimir lista (Ctrl+P)"
                aria-label="Imprimir lista"
                onClick={() => {
                  if (filtered.length === 0) {
                    toast.info("Nada para imprimir.");
                    return;
                  }
                  window.print();
                }}
                disabled={filtered.length === 0}
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                title={
                  fullscreen ? "Sair do modo foco (Esc)" : "Modo foco — tela cheia (Ctrl+Shift+F)"
                }
                aria-label={fullscreen ? "Sair do modo foco" : "Entrar no modo foco"}
                onClick={() => setFullscreen((v) => !v)}
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                title="Atualizar lista"
                aria-label="Atualizar lista"
                onClick={() => {
                  listQuery.refetch();
                  toast.success("Lista atualizada");
                }}
                disabled={listQuery.isFetching}
              >
                <RefreshCw className={`h-4 w-4 ${listQuery.isFetching ? "animate-spin" : ""}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={autoRefreshSec > 0 ? "default" : "outline"}
                    size="sm"
                    className="h-9 px-2 text-xs tabular-nums"
                    title="Auto-atualizar (a cada intervalo)"
                    aria-label="Configurar auto-atualização"
                  >
                    Auto
                    {autoRefreshSec > 0
                      ? ` · ${autoRefreshSec < 60 ? `${autoRefreshSec}s` : `${autoRefreshSec / 60}min`}`
                      : ""}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Auto-atualização</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[
                    { s: 0, label: "Desligada" },
                    { s: 15, label: "A cada 15s" },
                    { s: 30, label: "A cada 30s" },
                    { s: 60, label: "A cada 1min" },
                    { s: 300, label: "A cada 5min" },
                  ].map((o) => (
                    <DropdownMenuItem
                      key={o.s}
                      onSelect={() => setAutoRefreshSec(o.s)}
                      className={autoRefreshSec === o.s ? "font-semibold" : ""}
                    >
                      {autoRefreshSec === o.s ? "✓ " : "  "}
                      {o.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {listQuery.dataUpdatedAt > 0 &&
                (() => {
                  const diff = Math.max(0, Math.floor((nowTick - listQuery.dataUpdatedAt) / 1000));
                  const label =
                    diff < 5
                      ? "agora"
                      : diff < 60
                        ? `há ${diff}s`
                        : diff < 3600
                          ? `há ${Math.floor(diff / 60)}min`
                          : `há ${Math.floor(diff / 3600)}h`;
                  const stale = autoRefreshSec > 0 && diff > autoRefreshSec * 2;
                  return (
                    <span
                      className={`text-xs tabular-nums ${stale ? "text-warning" : "text-muted-foreground"} hidden lg:inline`}
                      title={`Última atualização: ${new Date(listQuery.dataUpdatedAt).toLocaleTimeString("pt-BR")}`}
                    >
                      {label}
                    </span>
                  );
                })()}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                title="Atalhos de teclado (?)"
                aria-label="Ver atalhos de teclado"
                onClick={() => setShortcutsOpen(true)}
              >
                <span className="font-mono text-sm font-bold">?</span>
              </Button>
              <div
                className="inline-flex items-center rounded-md border border-input bg-background p-0.5 text-xs"
                title="Densidade das linhas"
              >
                {(["compact", "normal", "spacious"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDensity(d)}
                    className={
                      density === d
                        ? "rounded px-2 py-1 bg-muted font-medium text-foreground"
                        : "rounded px-2 py-1 text-muted-foreground hover:text-foreground"
                    }
                    title={d === "compact" ? "Compacto" : d === "normal" ? "Normal" : "Espaçoso"}
                  >
                    {d === "compact" ? "≡" : d === "normal" ? "☰" : "▤"}
                  </button>
                ))}
              </div>
              <Button
                variant={colFiltersOpen || activeColFilters.length > 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setColFiltersOpen((v) => !v)}
                title="Filtros por coluna (estilo planilha)"
              >
                Filtros{activeColFilters.length > 0 ? ` (${activeColFilters.length})` : ""}
              </Button>
              <Button
                variant={freezeFirst ? "default" : "outline"}
                size="sm"
                onClick={() => setFreezeFirst((v) => !v)}
                title={
                  freezeFirst ? "Desafixar 1ª coluna" : "Fixar 1ª coluna ao rolar horizontalmente"
                }
              >
                <Pin className="mr-1 h-4 w-4" />
                {freezeFirst ? "1ª col fixa" : "Fixar 1ª col"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" title="Colunas visíveis">
                    <Columns3 className="mr-1 h-4 w-4" />
                    Colunas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Colunas e ordem</span>
                    <button
                      type="button"
                      className="text-xs font-normal text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.preventDefault();
                        setColOrder(props.columns.map((c) => c.key));
                        setHiddenCols(new Set());
                      }}
                      title="Restaurar ordem e visibilidade padrão"
                    >
                      Restaurar
                    </button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto py-1">
                    {orderedColumns.map((c, idx) => (
                      <div
                        key={c.key}
                        className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent/50 rounded-sm"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-primary cursor-pointer"
                          checked={!hiddenCols.has(c.key)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setHiddenCols((prev) => {
                              const next = new Set(prev);
                              if (checked) next.delete(c.key);
                              else next.add(c.key);
                              return next;
                            });
                          }}
                          aria-label={`Mostrar coluna ${c.label}`}
                        />
                        <span className="flex-1 truncate">{c.label}</span>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.preventDefault();
                            moveColumn(c.key, -1);
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Mover para a esquerda"
                          aria-label={`Mover ${c.label} para a esquerda`}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === orderedColumns.length - 1}
                          onClick={(e) => {
                            e.preventDefault();
                            moveColumn(c.key, 1);
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Mover para a direita"
                          aria-label={`Mover ${c.label} para a direita`}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={openCreate} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Novo
              </Button>
            </div>
          </CardHeader>
          {listCapped && (
            <div className="mx-6 mb-2 flex flex-wrap items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-foreground no-print">
              <span>
                Exibindo os <strong>{LIST_FETCH_CAP.toLocaleString("pt-BR")}</strong> registros mais
                recentes
                {listTotal > LIST_FETCH_CAP ? ` de ${listTotal.toLocaleString("pt-BR")}` : ""}. Use
                a busca ou os filtros para encontrar registros anteriores.
              </span>
            </div>
          )}
          {selectedIds.size > 0 && (
            <div className="mx-4 mb-2 flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-sm no-print sm:mx-6">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  <strong>{selectedIds.size}</strong>{" "}
                  {selectedIds.size === 1 ? "selecionado" : "selecionados"}
                </span>
                {(() => {
                  // Sum numeric columns (valor/saldo/total/quantidade) for selected rows.
                  const NUM_KEYS = [
                    "valor_original",
                    "saldo",
                    "valor_total",
                    "total",
                    "valor",
                    "valor_pago",
                    "quantidade",
                  ];
                  const sel = filtered.filter((r) => selectedIds.has(String(r.id)));
                  if (sel.length === 0) return null;
                  const keys = visibleColumns
                    .map((c) => c.key)
                    .filter(
                      (k) =>
                        NUM_KEYS.includes(k) &&
                        sel.some((r) => r[k] != null && !Number.isNaN(Number(r[k]))),
                    );
                  if (keys.length === 0) return null;
                  const fmt = (n: number, isMoney: boolean) =>
                    isMoney
                      ? formatBRL(n)
                      : n.toLocaleString("pt-BR");
                  return (
                    <span className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      {keys.map((k) => {
                        const label = visibleColumns.find((c) => c.key === k)?.label ?? k;
                        const total = sel.reduce((acc, r) => acc + (Number(r[k]) || 0), 0);
                        const isMoney = k !== "quantidade";
                        return (
                          <span key={k}>
                            Σ {label}:{" "}
                            <strong className="font-mono text-foreground">
                              {fmt(total, isMoney)}
                            </strong>
                          </span>
                        );
                      })}
                    </span>
                  );
                })()}
                {selectedIds.size < filtered.length &&
                  pageRows.length > 0 &&
                  pageRows.every((r) => selectedIds.has(String(r.id))) && (
                    <button
                      type="button"
                      className="text-primary underline underline-offset-2 hover:opacity-80"
                      onClick={() => setSelectedIds(new Set(filtered.map((r) => String(r.id))))}
                    >
                      Selecionar todos os {filtered.length} registros filtrados
                    </button>
                  )}
              </span>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                  Limpar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Copy selected rows as TSV: header line + one line per row,
                    // using visible columns so what you see is what you paste.
                    const sel = filtered.filter((r) => selectedIds.has(String(r.id)));
                    if (sel.length === 0) return;
                    const header = visibleColumns.map((c) => c.label).join("\t");
                    const escape = (v: unknown) =>
                      String(v ?? "")
                        .replace(/\t/g, " ")
                        .replace(/\r?\n/g, " ");
                    const body = sel
                      .map((r) => visibleColumns.map((c) => escape(r[c.key])).join("\t"))
                      .join("\n");
                    const tsv = `${header}\n${body}`;
                    navigator.clipboard.writeText(tsv);
                    toast.success(
                      `${sel.length} ${sel.length === 1 ? "linha copiada" : "linhas copiadas"} para colar em planilha`,
                    );
                  }}
                  title="Copiar linhas selecionadas para colar em Excel/Sheets (TSV)"
                >
                  <Copy className="mr-1 h-4 w-4" />
                  Copiar
                </Button>
                {tableHasAtivo && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        bulkToggleAtivoMutation.mutate({
                          ids: Array.from(selectedIds),
                          ativo: true,
                        })
                      }
                      disabled={bulkToggleAtivoMutation.isPending}
                      title="Ativar selecionados"
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Ativar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        bulkToggleAtivoMutation.mutate({
                          ids: Array.from(selectedIds),
                          ativo: false,
                        })
                      }
                      disabled={bulkToggleAtivoMutation.isPending}
                      title="Desativar selecionados"
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Desativar
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const first =
                      props.fields.find((f) => f.name !== "ativo" && f.type !== "boolean") ??
                      props.fields[0];
                    setBulkEditField(first?.name ?? "");
                    setBulkEditValue(first?.type === "boolean" ? false : "");
                    setBulkEditOpen(true);
                  }}
                  disabled={bulkEditMutation.isPending || props.fields.length === 0}
                  title="Atualizar um campo em todos os selecionados"
                >
                  <Pencil className="mr-1 h-4 w-4" />
                  Editar em lote
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkDuplicateMutation.mutate(Array.from(selectedIds))}
                  disabled={bulkDuplicateMutation.isPending || selectedIds.size === 0}
                  title="Duplicar selecionados (cria cópias novas)"
                >
                  <CopyPlus className="mr-1 h-4 w-4" />
                  {bulkDuplicateMutation.isPending ? "Duplicando…" : "Duplicar"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setBulkConfirm(true)}
                  disabled={bulkDeleteMutation.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Excluir selecionados
                </Button>
              </div>
            </div>
          )}
          <CardContent className="px-3 sm:px-6">
            {listQuery.isLoading ? (
              <div
                className="rounded-md border border-border p-3"
                role="status"
                aria-live="polite"
                aria-label="Carregando registros"
              >
                <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
                  <Skeleton className="h-4 w-4" />
                  {Array.from({ length: Math.min(5, visibleColumns.length) }).map((_, i) => (
                    <Skeleton key={i} className="h-3 flex-1" />
                  ))}
                  <Skeleton className="h-3 w-24" />
                </div>
                {Array.from({ length: 8 }).map((_, r) => (
                  <div key={r} className="flex items-center gap-3 py-2.5">
                    <Skeleton className="h-4 w-4 shrink-0" />
                    {Array.from({ length: Math.min(5, visibleColumns.length) }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-3 flex-1"
                        style={{ maxWidth: `${60 + ((r + i) % 4) * 10}%` }}
                      />
                    ))}
                    <Skeleton className="h-6 w-24 shrink-0" />
                  </div>
                ))}
                <span className="sr-only">Carregando...</span>
              </div>
            ) : filtered.length === 0 ? (
              (() => {
                const filtersActive =
                  !!search ||
                  (tableHasAtivo && ativoFilter !== "ativos") ||
                  onlyMine ||
                  onlyToday ||
                  !!sortKey;
                if (filtersActive) {
                  return (
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-12 text-center sm:px-6 sm:py-14">
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted">
                        <Search className="h-5 w-5 text-muted-foreground" aria-hidden />
                      </div>
                      <p className="mt-3 text-sm font-medium text-foreground">
                        Nenhum registro combina com os filtros atuais
                      </p>
                      <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                        {rows.length} {rows.length === 1 ? "registro existe" : "registros existem"}{" "}
                        nesta tabela — ajuste ou limpe os filtros.
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearch("");
                            if (tableHasAtivo) setAtivoFilter("ativos");
                            setOnlyMine(false);
                            setOnlyToday(false);
                            setSortKey(null);
                            setSortDir("asc");
                            setSortStack([]);
                            setPage(0);
                          }}
                        >
                          Limpar filtros
                        </Button>
                        {search && (
                          <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
                            Limpar só a busca
                          </Button>
                        )}
                        <Button size="sm" onClick={openCreate}>
                          <Plus className="mr-1 h-4 w-4" />
                          Novo {props.singular.toLowerCase()}
                        </Button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-12 text-center sm:px-6 sm:py-14">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted">
                      <Inbox className="h-5 w-5 text-muted-foreground" aria-hidden />
                    </div>
                    <p className="mt-3 text-sm font-medium text-foreground">
                      Nenhum registro ainda
                    </p>
                    <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                      Clique em <strong>Novo</strong> para cadastrar o primeiro{" "}
                      {props.singular.toLowerCase()}.
                    </p>
                    <div className="mt-4">
                      <Button size="sm" onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" />
                        Novo {props.singular.toLowerCase()}
                      </Button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="max-h-[calc(100dvh-22rem)] overflow-auto rounded-md border border-border">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/50 [&_th]:border-b [&_th]:border-border [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground">
                    <TableRow>
                      <TableHead
                        className={`w-10 no-print ${freezeFirst ? "sticky left-0 z-20 bg-muted/80" : ""}`}
                      >
                        <Checkbox
                          checked={
                            pageRows.length > 0 &&
                            pageRows.every((r) => selectedIds.has(String(r.id)))
                          }
                          onCheckedChange={(checked) => {
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              if (checked) pageRows.forEach((r) => next.add(String(r.id)));
                              else pageRows.forEach((r) => next.delete(String(r.id)));
                              return next;
                            });
                          }}
                          aria-label="Selecionar todos"
                        />
                      </TableHead>
                      {visibleColumns.map((c, colIdx) => {
                        const isPrimary = sortKey === c.key;
                        const secondaryIdx = sortStack.findIndex((l) => l.key === c.key);
                        const isSecondary = !isPrimary && secondaryIdx >= 0;
                        const secondaryDir = isSecondary ? sortStack[secondaryIdx].dir : null;
                        const isFrozen = freezeFirst && colIdx === 0;
                        return (
                          <TableHead
                            key={c.key}
                            style={
                              colWidths[c.key]
                                ? { width: colWidths[c.key], minWidth: colWidths[c.key] }
                                : { minWidth: 140 }
                            }
                            className={`relative group/th ${isFrozen ? "sticky left-10 z-20 bg-muted/80 shadow-[1px_0_0_0_var(--border)]" : ""}`}
                          >
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => toggleSort(c.key, e.shiftKey)}
                                className="inline-flex items-center gap-1 whitespace-nowrap hover:text-foreground"
                                title="Clique para ordenar · Shift+clique para adicionar como ordenação secundária"
                              >
                                {c.label}
                                {isPrimary ? (
                                  sortDir === "asc" ? (
                                    <ArrowUp className="h-3 w-3" />
                                  ) : (
                                    <ArrowDown className="h-3 w-3" />
                                  )
                                ) : isSecondary ? (
                                  <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                                    {secondaryDir === "asc" ? (
                                      <ArrowUp className="h-3 w-3" />
                                    ) : (
                                      <ArrowDown className="h-3 w-3" />
                                    )}
                                    <span className="text-[9px] font-semibold tabular-nums">
                                      {secondaryIdx + 2}
                                    </span>
                                  </span>
                                ) : (
                                  <ArrowUpDown className="h-3 w-3 opacity-40" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  // Copy this column's values from every filtered row (respects
                                  // busca/filtros/ordenação) — great for lists of e-mails, CNPJs,
                                  // números etc. to paste into e-mail, planilha ou WhatsApp.
                                  const values = filtered
                                    .map((r) => r[c.key])
                                    .filter((v) => v !== null && v !== undefined && v !== "")
                                    .map((v) => String(v));
                                  if (values.length === 0) {
                                    toast.info("Coluna sem valores para copiar");
                                    return;
                                  }
                                  navigator.clipboard.writeText(values.join("\n"));
                                  toast.success(
                                    `${values.length} ${values.length === 1 ? "valor copiado" : "valores copiados"} de "${c.label}"`,
                                  );
                                }}
                                title={`Copiar todos os valores de "${c.label}" (${filtered.length} registros filtrados)`}
                                aria-label={`Copiar coluna ${c.label}`}
                                className="rounded p-0.5 text-muted-foreground/60 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/th:opacity-100 hover:bg-muted hover:text-foreground"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                            <div
                              onMouseDown={(e) => startResize(c.key, e)}
                              onDoubleClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                resetColWidth(c.key);
                              }}
                              title="Arrastar para redimensionar · duplo clique para restaurar"
                              className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none opacity-0 group-hover/th:opacity-100 hover:bg-primary/60 no-print"
                            />
                          </TableHead>
                        );
                      })}
                      <TableHead className="min-w-[220px] whitespace-nowrap text-right no-print">
                        Ações
                      </TableHead>
                    </TableRow>
                    {colFiltersOpen && (
                      <TableRow className="bg-muted/30 no-print">
                        <TableHead
                          className={`w-10 ${freezeFirst ? "sticky left-0 z-10 bg-muted/60" : ""}`}
                        />
                        {visibleColumns.map((c, colIdx) => (
                          <TableHead
                            key={c.key}
                            className={`py-1 ${freezeFirst && colIdx === 0 ? "sticky left-10 z-10 bg-muted/60" : ""}`}
                          >
                            <Input
                              value={colFilters[c.key] ?? ""}
                              onChange={(e) =>
                                setColFilters((prev) => ({ ...prev, [c.key]: e.target.value }))
                              }
                              placeholder={`Filtrar ${c.label.toLowerCase()}`}
                              className="h-7 text-xs"
                            />
                          </TableHead>
                        ))}
                        <TableHead className="w-24 text-right">
                          {activeColFilters.length > 0 && (
                            <button
                              type="button"
                              className="text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => setColFilters({})}
                              title="Limpar todos os filtros de coluna"
                            >
                              Limpar
                            </button>
                          )}
                        </TableHead>
                      </TableRow>
                    )}
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((row) => (
                      <ContextMenu key={String(row.id)}>
                        <ContextMenuTrigger asChild>
                          <TableRow
                            key={String(row.id)}
                            data-row-id={String(row.id)}
                            data-state={selectedIds.has(String(row.id)) ? "selected" : undefined}
                            onDoubleClick={(e) => {
                              // Ignore double-click on interactive controls (buttons, checkbox, links)
                              const target = e.target as HTMLElement;
                              if (target.closest("button, a, input, [role='checkbox']")) return;
                              openEdit(row);
                            }}
                            className={`cursor-default transition-colors hover:bg-muted/50 ${
                              focusedRowId === String(row.id)
                                ? "ring-2 ring-inset ring-primary/60"
                                : ""
                            } ${
                              pinnedIds.has(String(row.id))
                                ? "bg-warning/5 border-l-2 border-l-warning/70"
                                : ""
                            } ${
                              recentIds.has(String(row.id))
                                ? "bg-primary/10 motion-safe:animate-[pulse_1.4s_ease-in-out_2]"
                                : ""
                            } ${
                              density === "compact"
                                ? "[&_td]:py-1 [&_td]:px-2"
                                : density === "spacious"
                                  ? "[&_td]:py-4 [&_td]:px-4"
                                  : "[&_td]:py-2 [&_td]:px-3"
                            }`}
                            title="Duplo-clique para editar"
                          >
                            <TableCell
                              className={`no-print ${freezeFirst ? "sticky left-0 z-10 bg-background" : ""}`}
                              onClick={(e) => {
                                // Only intercept when Shift+click on this cell (or its checkbox).
                                if (!e.shiftKey) return;
                                const id = String(row.id);
                                const rows = pageRowsRef.current;
                                const anchor = lastCheckedIdRef.current;
                                if (!anchor) {
                                  lastCheckedIdRef.current = id;
                                  return;
                                }
                                const a = rows.findIndex((r) => String(r.id) === anchor);
                                const b = rows.findIndex((r) => String(r.id) === id);
                                if (a < 0 || b < 0) return;
                                e.preventDefault();
                                e.stopPropagation();
                                const [lo, hi] = a < b ? [a, b] : [b, a];
                                const targetChecked = !selectedIds.has(id);
                                setSelectedIds((prev) => {
                                  const next = new Set(prev);
                                  for (let i = lo; i <= hi; i += 1) {
                                    const rid = String(rows[i].id);
                                    if (targetChecked) next.add(rid);
                                    else next.delete(rid);
                                  }
                                  return next;
                                });
                                lastCheckedIdRef.current = id;
                              }}
                            >
                              <Checkbox
                                checked={selectedIds.has(String(row.id))}
                                onCheckedChange={(checked) => {
                                  const id = String(row.id);
                                  lastCheckedIdRef.current = id;
                                  setSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    if (checked) next.add(id);
                                    else next.delete(id);
                                    return next;
                                  });
                                }}
                                aria-label="Selecionar"
                              />
                            </TableCell>
                            {visibleColumns.map((c, colIdx) => {
                              const raw = row[c.key];
                              const rawStr = raw === null || raw === undefined ? "" : String(raw);
                              return (
                                <TableCell
                                  key={c.key}
                                  className={`align-middle ${
                                    freezeFirst && colIdx === 0
                                      ? "sticky left-10 z-10 bg-background shadow-[1px_0_0_0_var(--border)]"
                                      : ""
                                  }`}
                                  title={
                                    c.render
                                      ? "Alt+clique filtra a lista por este valor"
                                      : rawStr
                                        ? `${rawStr}\n(Alt+clique filtra por este valor)`
                                        : "Alt+clique filtra a lista por este valor"
                                  }
                                  onClick={(e) => {
                                    // Alt+click on a cell filters the list by that value —
                                    // fastest way to answer "quais outros são iguais a este?"
                                    if (!e.altKey) return;
                                    if (raw === null || raw === undefined || raw === "") return;
                                    const v = String(raw);
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSearch(v);
                                    setPage(0);
                                    toast.success(`Filtrando por "${v}"`);
                                  }}
                                >
                                  {c.render ? c.render(row) : highlightMatch(rawStr || "—", search)}
                                </TableCell>
                              );
                            })}

                            <TableCell className="whitespace-nowrap text-right no-print">
                              <div className="flex flex-nowrap justify-end gap-0.5">
                                {(() => {
                                  const id = String(row.id);
                                  const pinned = pinnedIds.has(id);
                                  return (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={`h-8 w-8 ${pinned ? "text-warning" : "text-muted-foreground"}`}
                                      onClick={() => togglePin(id)}
                                      title={
                                        pinned
                                          ? "Desafixar (não fica mais no topo)"
                                          : "Fixar no topo da lista"
                                      }
                                      aria-label={pinned ? "Desafixar" : "Fixar"}
                                    >
                                      {pinned ? (
                                        <PinOff className="h-3.5 w-3.5" />
                                      ) : (
                                        <Pin className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                  );
                                })()}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openEdit(row)}
                                  title="Editar"
                                  aria-label="Editar"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openDuplicate(row)}
                                  title="Duplicar"
                                  aria-label="Duplicar"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </Button>
                                {tableHasAtivo && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      toggleRowAtivoMutation.mutate({
                                        id: String(row.id),
                                        ativo: !row.ativo,
                                      })
                                    }
                                    disabled={toggleRowAtivoMutation.isPending}
                                    title={row.ativo ? "Desativar" : "Ativar"}
                                    aria-label={row.ativo ? "Desativar" : "Ativar"}
                                  >
                                    {row.ativo ? (
                                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                    ) : (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                                    )}
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    const id = String(row.id);
                                    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#row-${id}`;
                                    navigator.clipboard.writeText(url);
                                    // Also update the local hash so the same tab reflects the deep link.
                                    window.history.replaceState(null, "", `#row-${id}`);
                                    setRecentIds((prev) => {
                                      const next = new Set(prev);
                                      next.add(id);
                                      return next;
                                    });
                                    setTimeout(() => {
                                      setRecentIds((prev) => {
                                        const next = new Set(prev);
                                        next.delete(id);
                                        return next;
                                      });
                                    }, 4000);
                                    toast.success("Link do registro copiado");
                                  }}
                                  title="Copiar link direto para este registro"
                                  aria-label="Copiar link direto para este registro"
                                >
                                  <Link2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  aria-label="Remover"
                                  onClick={() => setDeleteId(String(row.id))}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-56">
                          <ContextMenuItem onSelect={() => openEdit(row)}>
                            Editar
                            <span className="ml-auto text-xs text-muted-foreground">Enter</span>
                          </ContextMenuItem>
                          <ContextMenuItem onSelect={() => openDuplicate(row)}>
                            Duplicar
                            <span className="ml-auto text-xs text-muted-foreground">D</span>
                          </ContextMenuItem>
                          <ContextMenuItem onSelect={() => togglePin(String(row.id))}>
                            {pinnedIds.has(String(row.id)) ? "Desafixar" : "Fixar no topo"}
                            <span className="ml-auto text-xs text-muted-foreground">P</span>
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            onSelect={() => {
                              const id = String(row.id);
                              setSelectedIds((prev) => {
                                const next = new Set(prev);
                                if (next.has(id)) next.delete(id);
                                else next.add(id);
                                return next;
                              });
                            }}
                          >
                            {selectedIds.has(String(row.id)) ? "Remover da seleção" : "Selecionar"}
                            <span className="ml-auto text-xs text-muted-foreground">Espaço</span>
                          </ContextMenuItem>
                          <ContextMenuItem
                            onSelect={() => {
                              const id = String(row.id);
                              const url = `${window.location.origin}${window.location.pathname}${window.location.search}#row-${id}`;
                              navigator.clipboard.writeText(url);
                              toast.success("Link da linha copiado");
                            }}
                          >
                            Copiar link para esta linha
                          </ContextMenuItem>
                          <ContextMenuItem
                            onSelect={() => {
                              const tsv = visibleColumns
                                .map((c) => String(row[c.key] ?? ""))
                                .join("\t");
                              navigator.clipboard.writeText(tsv);
                              toast.success("Linha copiada (TSV)");
                            }}
                          >
                            Copiar linha (TSV)
                          </ContextMenuItem>
                          {tableHasAtivo && (
                            <ContextMenuItem
                              onSelect={() =>
                                toggleRowAtivoMutation.mutate({
                                  id: String(row.id),
                                  ativo: !row.ativo,
                                })
                              }
                            >
                              {row.ativo ? "Desativar" : "Ativar"}
                            </ContextMenuItem>
                          )}
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            onSelect={() => setDeleteId(String(row.id))}
                            className="text-destructive focus:text-destructive"
                          >
                            Excluir
                            <span className="ml-auto text-xs text-muted-foreground">Del</span>
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {columnTotals.length > 0 && (
              <div className="mt-3 rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-xs">
                <div className="mb-1 font-medium text-muted-foreground">
                  Estatísticas{selectedIds.size > 0 ? " (seleção)" : ""}:
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {columnTotals.map((t) => (
                    <div key={t.key} className="tabular-nums">
                      <span className="text-foreground font-medium">{t.label}</span>
                      <span className="text-muted-foreground">{" · "}soma </span>
                      <span className="font-semibold text-foreground">
                        {totalsFormatter.format(t.sum)}
                      </span>
                      <span className="text-muted-foreground">
                        {" · "}méd{" "}
                        <span className="text-foreground">{totalsFormatter.format(t.avg)}</span>
                        {" · "}mín{" "}
                        <span className="text-foreground">{totalsFormatter.format(t.min)}</span>
                        {" · "}máx{" "}
                        <span className="text-foreground">{totalsFormatter.format(t.max)}</span>
                        {" · "}n={t.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {filtered.length > 0 && (
              <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-sm text-muted-foreground no-print sm:flex sm:flex-wrap sm:justify-between">
                <span className="min-w-0 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Mostrando </span>
                  <span className="tabular-nums">
                    {currentPage * pageSize + 1}–
                    {Math.min((currentPage + 1) * pageSize, filtered.length)}
                  </span>
                  <span className="mx-1">de</span>
                  <span className="tabular-nums font-medium text-foreground">
                    {filtered.length}
                  </span>
                </span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <label className="flex items-center gap-1.5 text-xs">
                    <span className="hidden sm:inline">Linhas:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(0);
                      }}
                      aria-label="Linhas por página"
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {[25, 50, 100, 200].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  {filtered.length > pageSize && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(0)}
                        disabled={currentPage === 0}
                        aria-label="Primeira página"
                        title="Primeira página"
                        className="h-8 min-w-8 px-2"
                      >
                        «
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        aria-label="Página anterior"
                        title="Página anterior"
                        className="h-8 min-w-8 px-2"
                      >
                        <span aria-hidden className="sm:hidden">
                          ‹
                        </span>
                        <span className="hidden sm:inline">Anterior</span>
                      </Button>
                      <span className="whitespace-nowrap tabular-nums text-xs sm:text-sm">
                        {currentPage + 1} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage >= totalPages - 1}
                        aria-label="Próxima página"
                        title="Próxima página"
                        className="h-8 min-w-8 px-2"
                      >
                        <span aria-hidden className="sm:hidden">
                          ›
                        </span>
                        <span className="hidden sm:inline">Próxima</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(totalPages - 1)}
                        disabled={currentPage >= totalPages - 1}
                        aria-label="Última página"
                        title="Última página"
                        className="h-8 min-w-8 px-2"
                      >
                        »
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setDialogOpen(true);
            return;
          }
          // Dirty-check on close: compare current form to the row being edited
          // (or defaultValues on a new record). Confirm before discarding.
          const baseline: Record<string, unknown> = editing
            ? { ...editing }
            : { ...(props.defaultValues ?? {}) };
          const norm = (v: unknown) => (v === undefined || v === null || v === "" ? "" : String(v));
          const dirty = props.fields.some((f) => norm(form[f.name]) !== norm(baseline[f.name]));
          if (dirty && !saveMutation.isPending) {
            setDiscardConfirm(true);
            return;
          }
          setDialogOpen(false);
        }}
      >
        <DialogContent
          className="flex max-h-[90dvh] max-w-2xl flex-col overflow-hidden p-0"
          onKeyDown={(e) => {
            if (saveMutation.isPending) return;
            // Ctrl/Cmd + Shift + Enter: save and add another (create only)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Enter" && !editing) {
              e.preventDefault();
              keepOpenAfterSaveRef.current = true;
              saveMutation.mutate();
              return;
            }
            // Ctrl/Cmd + Enter to save from anywhere inside the dialog
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              keepOpenAfterSaveRef.current = false;
              saveMutation.mutate();
            }
            // Alt + ← / → move to the previous/next filtered row while editing,
            // so a reviewer can walk through a batch without closing the dialog.
            if (editing && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
              e.preventDefault();
              openAdjacent(e.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          <DialogHeader className="shrink-0 border-b border-border px-6 pb-4 pt-6">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle>
                {editing ? `Editar ${props.singular}` : `Novo ${props.singular}`}
                {editing && adjacentInfo.total > 1 ? (
                  <span className="ml-2 text-xs font-normal text-muted-foreground tabular-nums">
                    {adjacentInfo.index + 1} / {adjacentInfo.total}
                  </span>
                ) : null}
              </DialogTitle>
              {editing && adjacentInfo.total > 1 ? (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openAdjacent(-1)}
                    title="Registro anterior (Alt+←)"
                    aria-label="Registro anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openAdjacent(1)}
                    title="Próximo registro (Alt+→)"
                    aria-label="Próximo registro"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>
            <DialogDescription>
              Preencha os dados abaixo. Campos com <span className="text-destructive">*</span> são
              obrigatórios.
              <span className="ml-1 text-muted-foreground">
                Dica:{" "}
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                  Ctrl
                </kbd>
                +
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                  Enter
                </kbd>{" "}
                salva
                {!editing ? (
                  <>
                    {" "}
                    ·{" "}
                    <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                      Ctrl
                    </kbd>
                    +
                    <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                      Shift
                    </kbd>
                    +
                    <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                      Enter
                    </kbd>{" "}
                    salva e adiciona outro
                  </>
                ) : (
                  <>
                    {" "}
                    ·{" "}
                    <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                      Alt
                    </kbd>
                    +
                    <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                      ←
                    </kbd>
                    /
                    <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                      →
                    </kbd>{" "}
                    anterior/próximo
                  </>
                )}
                .
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-4 py-2 sm:grid-cols-2">{props.fields.map(renderField)}</div>
          {editing && Boolean(editing.created_at || editing.updated_at || editing.id) && (
            <div className="border-t border-border pt-2 text-[11px] text-muted-foreground">
              {editing.created_at ? (
                <span>
                  Criado em{" "}
                  <span className="tabular-nums">
                    {new Date(String(editing.created_at)).toLocaleString("pt-BR")}
                  </span>
                </span>
              ) : null}
              {Boolean(editing.updated_at) &&
              String(editing.updated_at) !== String(editing.created_at ?? "") ? (
                <span>
                  {" · "}Atualizado em{" "}
                  <span className="tabular-nums">
                    {new Date(String(editing.updated_at)).toLocaleString("pt-BR")}
                  </span>
                </span>
              ) : null}
              {editing.id ? (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(String(editing.id));
                      toast.success("ID copiado");
                    }}
                    className="font-mono text-[10px] underline underline-offset-2 hover:text-foreground"
                    title="Copiar ID"
                  >
                    {String(editing.id).slice(0, 8)}…
                  </button>
                </>
              ) : null}
            </div>
          )}
          </div>
          <DialogFooter className="shrink-0 gap-2 border-t border-border bg-background px-6 py-4 sm:gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            {editing &&
              (() => {
                const norm = (v: unknown) =>
                  v === undefined || v === null || v === "" ? "" : String(v);
                const dirty = props.fields.some(
                  (f) => norm(form[f.name]) !== norm((editing as Record<string, unknown>)[f.name]),
                );
                if (!dirty) return null;
                return (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setForm({ ...(editing as Record<string, unknown>) });
                      setMissingFields(new Set());
                      toast.success("Alterações revertidas");
                    }}
                    disabled={saveMutation.isPending}
                    title="Descartar as edições e voltar aos valores originais"
                  >
                    Reverter
                  </Button>
                );
              })()}
            {!editing && (
              <Button
                variant="secondary"
                onClick={() => {
                  keepOpenAfterSaveRef.current = true;
                  saveMutation.mutate();
                }}
                disabled={saveMutation.isPending}
                title="Salva e mantém o formulário aberto para o próximo cadastro (Ctrl+Shift+Enter)"
              >
                {saveMutation.isPending && keepOpenAfterSaveRef.current
                  ? "Salvando..."
                  : "Salvar e novo"}
              </Button>
            )}
            <Button
              onClick={() => {
                keepOpenAfterSaveRef.current = false;
                saveMutation.mutate();
              }}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending && !keepOpenAfterSaveRef.current ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={discardConfirm} onOpenChange={setDiscardConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas neste {props.singular.toLowerCase()}. Se fechar agora,
              elas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDiscardConfirm(false);
                setDialogOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Descartar e fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {props.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O registro será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Importar {props.plural.toLowerCase()}</DialogTitle>
            <DialogDescription>
              Cole aqui um CSV, TSV ou trecho copiado de uma planilha. A primeira linha deve conter
              os nomes das colunas — mapeamos automaticamente pelos rótulos dos campos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Textarea
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value);
                setImportOverrides({});
              }}
              placeholder={`nome\tcidade\nAcme\tSão Paulo\nBeta\tRio de Janeiro`}
              className="min-h-[140px] font-mono text-xs"
            />
            {importParsed && importParsed.headers.length > 0 && (
              <div className="rounded-md border border-border bg-muted/20 p-3 text-xs">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">
                    Delimitador:{" "}
                    <code>{importParsed.delim === "\t" ? "Tab" : importParsed.delim}</code>
                    {" · "}
                    {importParsed.data.length} {importParsed.data.length === 1 ? "linha" : "linhas"}{" "}
                    de dados
                  </span>
                  <span className="text-muted-foreground">
                    {importParsed.mappings.filter((m) => !!m).length}/{importParsed.headers.length}{" "}
                    colunas mapeadas
                  </span>
                </div>
                <div className="grid gap-1.5">
                  {importParsed.headers.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <code className="min-w-[10rem] truncate rounded bg-background px-1.5 py-0.5">
                        {h || <em className="text-muted-foreground">(vazio)</em>}
                      </code>
                      <span className="text-muted-foreground">→</span>
                      <Select
                        value={importParsed.mappings[i] ?? "__ignore__"}
                        onValueChange={(v) =>
                          setImportOverrides((prev) => ({
                            ...prev,
                            [i]: v === "__ignore__" ? null : v,
                          }))
                        }
                      >
                        <SelectTrigger className="h-7 flex-1 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__ignore__">— ignorar coluna —</SelectItem>
                          {props.fields.map((f) => (
                            <SelectItem key={f.name} value={f.name}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                {importParsed.data.length > 0 && (
                  <div className="mt-3 overflow-x-auto">
                    <div className="mb-1 font-medium">Prévia (3 primeiras linhas):</div>
                    <table className="w-full border-collapse text-[11px]">
                      <thead>
                        <tr>
                          {importParsed.headers.map((h, i) => (
                            <th
                              key={i}
                              className="border border-border bg-background px-1.5 py-1 text-left font-medium"
                            >
                              {importParsed.mappings[i] ? (
                                props.fields.find((f) => f.name === importParsed.mappings[i])?.label
                              ) : (
                                <span className="text-muted-foreground line-through">{h}</span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importParsed.data.slice(0, 3).map((row, ri) => (
                          <tr key={ri}>
                            {importParsed.headers.map((_, ci) => (
                              <td
                                key={ci}
                                className={`border border-border px-1.5 py-1 ${importParsed.mappings[ci] ? "" : "text-muted-foreground line-through"}`}
                              >
                                {row[ci] ?? ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImportOpen(false)}
              disabled={importMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => importMutation.mutate()}
              disabled={
                importMutation.isPending ||
                !importParsed ||
                importParsed.data.length === 0 ||
                importParsed.mappings.every((m) => !m)
              }
            >
              {importMutation.isPending
                ? "Importando…"
                : `Importar ${importParsed?.data.length ?? 0} ${importParsed?.data.length === 1 ? "registro" : "registros"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Atalhos de teclado</DialogTitle>
            <DialogDescription>Aja mais rápido sem tirar as mãos do teclado.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2 text-sm">
            {[
              { keys: ["/"], desc: "Focar a busca" },
              { keys: ["N"], desc: `Abrir formulário de novo ${props.singular.toLowerCase()}` },
              { keys: ["Esc"], desc: "Limpar seleção · fechar diálogos" },
              { keys: ["Duplo-clique"], desc: "Editar linha da tabela" },
              { keys: ["j", "k"], desc: "Mover foco entre linhas (também ↓ ↑)" },
              { keys: ["Enter"], desc: "Editar linha focada (também E)" },
              { keys: ["D"], desc: "Duplicar linha focada" },
              { keys: ["P"], desc: "Fixar/desafixar linha focada" },
              { keys: ["Espaço"], desc: "Selecionar/desselecionar linha focada (também X)" },
              { keys: ["Del"], desc: "Excluir linha focada" },
              { keys: ["Alt", "clique"], desc: "Filtrar lista pelo valor da célula" },
              { keys: ["Shift", "clique"], desc: "Adicionar coluna como ordenação secundária" },
              { keys: ["Ctrl/Cmd", "Enter"], desc: "Salvar (dentro do formulário)" },
              {
                keys: ["Ctrl/Cmd", "Shift", "Enter"],
                desc: "Salvar e novo (formulário de criação)",
              },
              { keys: ["?"], desc: "Abrir/fechar este atalho" },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 border-b border-border/60 pb-1.5 last:border-0"
              >
                <span className="text-muted-foreground">{row.desc}</span>
                <span className="flex items-center gap-1">
                  {row.keys.map((k, ki) => (
                    <kbd
                      key={ki}
                      className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground"
                    >
                      {k}
                    </kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShortcutsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkEditOpen} onOpenChange={setBulkEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar em lote</DialogTitle>
            <DialogDescription>
              Escolha um campo e o novo valor. A alteração será aplicada aos{" "}
              <strong>{selectedIds.size}</strong>{" "}
              {selectedIds.size === 1 ? "registro selecionado" : "registros selecionados"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Campo</Label>
              <Select
                value={bulkEditField}
                onValueChange={(v) => {
                  setBulkEditField(v);
                  const f = props.fields.find((x) => x.name === v);
                  setBulkEditValue(f?.type === "boolean" ? false : "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um campo" />
                </SelectTrigger>
                <SelectContent>
                  {props.fields.map((f) => (
                    <SelectItem key={f.name} value={f.name}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(() => {
              const f = props.fields.find((x) => x.name === bulkEditField);
              if (!f) return null;
              if (f.type === "boolean") {
                return (
                  <div className="grid gap-1.5">
                    <Label>Valor</Label>
                    <Select
                      value={bulkEditValue ? "true" : "false"}
                      onValueChange={(v) => setBulkEditValue(v === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sim / Ativo</SelectItem>
                        <SelectItem value="false">Não / Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
              if (f.type === "select") {
                const opts = dynamicOptionsQueries.data?.[f.name] ?? f.options ?? [];
                return (
                  <div className="grid gap-1.5">
                    <Label>Novo valor</Label>
                    <Select
                      value={String(bulkEditValue ?? "")}
                      onValueChange={(v) => setBulkEditValue(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {opts.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
              if (f.type === "textarea") {
                return (
                  <div className="grid gap-1.5">
                    <Label>Novo valor</Label>
                    <Textarea
                      value={String(bulkEditValue ?? "")}
                      onChange={(e) => setBulkEditValue(e.target.value)}
                      placeholder="Deixe em branco para limpar o campo"
                    />
                  </div>
                );
              }
              return (
                <div className="grid gap-1.5">
                  <Label>Novo valor</Label>
                  <Input
                    type={f.type === "number" ? "number" : "text"}
                    step={f.step}
                    value={String(bulkEditValue ?? "")}
                    onChange={(e) => setBulkEditValue(e.target.value)}
                    placeholder="Deixe em branco para limpar o campo"
                  />
                </div>
              );
            })()}
            {bulkEditField &&
              (() => {
                // Preview: show current distribution of values across the selection
                // AND how many rows will actually change with the chosen new value.
                const selected = rows.filter((r) => selectedIds.has(String(r.id)));
                const counts = new Map<string, number>();
                for (const r of selected) {
                  const raw = r[bulkEditField];
                  const key = raw === null || raw === undefined || raw === "" ? "—" : String(raw);
                  counts.set(key, (counts.get(key) ?? 0) + 1);
                }
                const newNorm =
                  bulkEditValue === null || bulkEditValue === undefined || bulkEditValue === ""
                    ? "—"
                    : String(bulkEditValue);
                const willChange = selected.filter((r) => {
                  const raw = r[bulkEditField];
                  const cur = raw === null || raw === undefined || raw === "" ? "—" : String(raw);
                  return cur !== newNorm;
                }).length;
                const top = Array.from(counts.entries())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4);
                return (
                  <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-[11px]">
                    <div className="mb-1 font-medium text-foreground">Prévia</div>
                    <div className="mb-1 flex flex-wrap gap-x-3 gap-y-0.5 text-muted-foreground">
                      {top.map(([k, n]) => (
                        <span key={k}>
                          <span className="tabular-nums">{n}</span>{" "}
                          {n === 1 ? "registro é" : "registros são"}{" "}
                          <span className="font-medium text-foreground">
                            {k.length > 24 ? `${k.slice(0, 24)}…` : k}
                          </span>
                        </span>
                      ))}
                      {counts.size > top.length && (
                        <span>+{counts.size - top.length} outros valores</span>
                      )}
                    </div>
                    <div className="text-foreground">
                      <span className="font-semibold text-warning">{willChange}</span>{" "}
                      {willChange === 1 ? "registro será alterado" : "registros serão alterados"}{" "}
                      para{" "}
                      <span className="font-semibold">
                        {newNorm.length > 40 ? `${newNorm.slice(0, 40)}…` : newNorm}
                      </span>
                      {willChange < selected.length && (
                        <span className="text-muted-foreground">
                          {" "}
                          · {selected.length - willChange} já{" "}
                          {selected.length - willChange === 1 ? "está" : "estão"} com esse valor
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            <p className="text-[11px] text-muted-foreground">
              Após aplicar, o toast oferece "Desfazer" por 10 segundos — cada registro volta ao
              valor anterior individualmente.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() =>
                bulkEditMutation.mutate({
                  ids: Array.from(selectedIds),
                  field: bulkEditField,
                  value: bulkEditValue,
                })
              }
              disabled={bulkEditMutation.isPending || !bulkEditField || selectedIds.size === 0}
            >
              {bulkEditMutation.isPending ? "Aplicando..." : `Aplicar a ${selectedIds.size}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={bulkConfirm} onOpenChange={setBulkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {selectedIds.size} registros?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os registros selecionados serão removidos
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bulkDeleteMutation.mutate(Array.from(selectedIds))}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover {selectedIds.size}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function StatusBadge({ ativo }: { ativo: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        ativo
          ? "border-success/40 bg-success/10 text-success"
          : "border-muted-foreground/30 text-muted-foreground"
      }
    >
      {ativo ? "Ativo" : "Inativo"}
    </Badge>
  );
}

/**
 * Wraps occurrences of `term` inside `text` with a highlighted <mark>.
 * Case-insensitive, plain-text safe.
 */
function highlightMatch(text: string, term: string) {
  const t = term.trim();
  if (!t || t.length < 2) return text;
  const lower = text.toLowerCase();
  const needle = t.toLowerCase();
  const idx = lower.indexOf(needle);
  if (idx === -1) return text;
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let hit = idx;
  let key = 0;
  while (hit !== -1) {
    if (hit > cursor) parts.push(text.slice(cursor, hit));
    parts.push(
      <mark key={key++} className="rounded bg-warning/30 px-0.5 py-0 text-foreground">
        {text.slice(hit, hit + t.length)}
      </mark>,
    );
    cursor = hit + t.length;
    hit = lower.indexOf(needle, cursor);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}
