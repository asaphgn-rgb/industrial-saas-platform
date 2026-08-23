import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Camada de DEBUG (apenas em desenvolvimento) para caçar estouros horizontais.
 *
 * - Ativa/desativa com Ctrl+Alt+O (ou `?debug=overflow` na URL).
 * - Destaca com contorno os elementos cuja largura ultrapassa a viewport.
 * - Mostra a rota atual e identifica a tabela/painel responsável por cada
 *   estouro (id, data-testid, caption, cabeçalho mais próximo, classes).
 *
 * Nunca é montada em produção e não altera layout (usa outline, não border).
 */

type Offender = {
  key: string;
  label: string;
  right: number;
  excess: number;
  el: HTMLElement;
  isTable: boolean;
};

const OUTLINE_ATTR = "data-flux-overflow-debug";
const MAX_ITEMS = 40;

function describe(el: HTMLElement): string {
  if (el.dataset["testid"]) return `[data-testid="${el.dataset["testid"]}"]`;
  if (el.id) return `#${el.id}`;
  const table = el.tagName === "TABLE" ? el : el.querySelector("table");
  const caption = table?.querySelector("caption")?.textContent?.trim();
  if (caption) return `tabela “${caption.slice(0, 48)}”`;
  const heading = el
    .closest("section, article, div[class*='card'], main")
    ?.querySelector("h1, h2, h3, [data-card-title]")
    ?.textContent?.trim();
  const tag = el.tagName.toLowerCase();
  const cls =
    typeof el.className === "string" && el.className
      ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
      : "";
  return heading ? `${tag}${cls} — “${heading.slice(0, 48)}”` : `${tag}${cls}`;
}

export function OverflowDebugLayer() {
  const routePath = useRouterState({ select: (s) => s.location.pathname });
  const [active, setActive] = useState(false);
  const [items, setItems] = useState<Offender[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const markedRef = useRef<HTMLElement[]>([]);

  const clearMarks = useCallback(() => {
    for (const el of markedRef.current) el.removeAttribute(OUTLINE_ATTR);
    markedRef.current = [];
  }, []);

  const scan = useCallback(() => {
    clearMarks();
    const viewport = document.documentElement.clientWidth;
    const found: Offender[] = [];
    const nodes = document.body.querySelectorAll<HTMLElement>("*");
    let i = 0;
    for (const el of Array.from(nodes)) {
      if (el.closest("[data-flux-overflow-panel]")) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const right = rect.right + window.scrollX;
      const excess = Math.round(right - viewport);
      if (excess <= 1) continue;
      // ignora quando um ancestral com rolagem própria já contém o estouro
      const scroller = el.parentElement?.closest<HTMLElement>(
        "[data-dual-scroll],[class*='overflow-x-auto'],[class*='overflow-x-scroll'],[data-radix-scroll-area-viewport]",
      );
      if (scroller && scroller.scrollWidth > scroller.clientWidth) continue;
      el.setAttribute(OUTLINE_ATTR, "true");
      markedRef.current.push(el);
      found.push({
        key: `${i++}`,
        label: describe(el),
        right: Math.round(right),
        excess,
        el,
        isTable: el.tagName === "TABLE" || !!el.querySelector("table"),
      });
      if (found.length >= MAX_ITEMS) break;
    }
    found.sort((a, b) => b.excess - a.excess);
    setItems(found);
  }, [clearMarks]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("debug") === "overflow") {
      setActive(true);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === "o" || e.key === "O")) {
        e.preventDefault();
        setActive((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) {
      clearMarks();
      setItems([]);
      return;
    }
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => scan());
    };
    schedule();
    const t = window.setTimeout(schedule, 800);
    window.addEventListener("resize", schedule);
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("resize", schedule);
      mo.disconnect();
      clearMarks();
    };
  }, [active, routePath, scan, clearMarks]);

  if (!active) return null;

  return (
    <div
      data-flux-overflow-panel
      className="fixed bottom-3 left-3 z-[9999] max-h-[45dvh] w-[min(22rem,calc(100vw-1.5rem))] overflow-auto rounded-lg border border-destructive/50 bg-background/95 p-3 text-xs shadow-lg backdrop-blur"
      role="region"
      aria-label="Depuração de estouro horizontal"
    >
      <div className="flex items-center justify-between gap-2">
        <strong className="text-destructive">Overflow debug</strong>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scan()}
            className="rounded border border-border px-2 py-1"
          >
            Reescanear
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="rounded border border-border px-2 py-1"
            aria-expanded={!collapsed}
          >
            {collapsed ? "Abrir" : "Recolher"}
          </button>
          <button
            type="button"
            onClick={() => setActive(false)}
            className="rounded border border-border px-2 py-1"
            aria-label="Fechar painel de depuração"
          >
            ×
          </button>
        </div>
      </div>
      <p className="mt-1 text-muted-foreground">
        Rota: <span className="font-mono">{routePath}</span> · viewport{" "}
        {typeof document !== "undefined" ? document.documentElement.clientWidth : 0}px ·{" "}
        {items.length} elemento(s)
      </p>
      {!collapsed && (
        <ul className="mt-2 space-y-1">
          {items.length === 0 && (
            <li className="text-muted-foreground">Nenhum estouro horizontal detectado. 🎉</li>
          )}
          {items.map((it) => (
            <li key={it.key}>
              <button
                type="button"
                className="w-full rounded border border-border/60 px-2 py-1 text-left hover:bg-muted"
                onClick={() => it.el.scrollIntoView({ block: "center", inline: "center" })}
              >
                <span className="font-mono break-all">{it.label}</span>
                <span className="ml-1 text-destructive">+{it.excess}px</span>
                {it.isTable && <span className="ml-1 text-muted-foreground">(tabela)</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[10px] text-muted-foreground">Ctrl+Alt+O alterna esta camada.</p>
    </div>
  );
}

export default OverflowDebugLayer;
