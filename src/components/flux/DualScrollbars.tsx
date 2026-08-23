import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useHydrationSettled } from "@/hooks/use-hydration-settled";


/**
 * Adiciona uma barra de rolagem horizontal NO TOPO de qualquer container que
 * já role horizontalmente (a barra nativa fica embaixo). Assim o usuário pode
 * navegar para a direita/esquerda tanto no início quanto no fim do relatório.
 *
 * - Global: varre o DOM, observa mutações, redimensionamentos e visibilidade.
 * - Acessível: a barra espelhada é focável (`role="scrollbar"`) e responde a
 *   setas, PageUp/PageDown, Home/End.
 * - Performance: observers compartilhados, agendamento em rAF/idle, varredura
 *   incremental somente quando nós entram/saem do DOM e containers fora da
 *   viewport ficam pausados.
 * - Compatível com modais, abas e listas virtualizadas: containers ocultos ou
 *   destacados do DOM têm a barra removida automaticamente, sem duplicação.
 *
 * Para desativar em um bloco específico use `data-no-dual-scroll`.
 */

const MARKER = "__fluxDualScroll";
const SELECTOR =
  '[data-dual-scroll],[class*="overflow-x-auto"],[class*="overflow-x-scroll"],[class*="overflow-auto"]';
const MIN_OVERFLOW = 12;
const STEP = 64;

type State = {
  bar: HTMLDivElement;
  spacer: HTMLDivElement;
  cleanup: () => void;
  visible: boolean;
};

type Enhanced = HTMLElement & { [MARKER]?: State };

const tracked = new Set<Enhanced>();

function isEligible(el: HTMLElement) {
  if (el.classList.contains("flux-dual-scrollbar")) return false;
  if (el.hasAttribute("data-no-dual-scroll")) return false;
  if (el.closest("[data-no-dual-scroll]")) return false;
  if (el.getAttribute("role") === "tablist" || el.querySelector(':scope > [role="tablist"]'))
    return false;
  if (!el.isConnected) return false;
  const style = window.getComputedStyle(el);
  if (!/(auto|scroll)/.test(style.overflowX)) return false;
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (el.offsetParent === null && style.position !== "fixed") return false;
  return true;
}

function sync(el: Enhanced) {
  const state = el[MARKER];
  if (!state) return;
  if (!el.isConnected) {
    state.cleanup();
    return;
  }
  const overflow = el.scrollWidth - el.clientWidth;
  if (overflow <= MIN_OVERFLOW || !isEligible(el)) {
    if (state.visible) {
      state.visible = false;
      state.bar.style.display = "none";
      state.bar.setAttribute("aria-hidden", "true");
      state.bar.tabIndex = -1;
    }
    return;
  }
  if (!state.visible) {
    state.visible = true;
    state.bar.style.display = "block";
    state.bar.removeAttribute("aria-hidden");
    state.bar.tabIndex = 0;
  }
  const width = `${el.scrollWidth}px`;
  if (state.spacer.style.width !== width) state.spacer.style.width = width;
  // A barra precisa ter exatamente a largura visível do container, senão o
  // curso máximo dela fica menor que o do conteúdo e o fim nunca é alcançado.
  const viewport = `${el.clientWidth}px`;
  if (state.bar.style.width !== viewport) state.bar.style.width = viewport;
  if (Math.abs(state.bar.scrollLeft - el.scrollLeft) > 1) state.bar.scrollLeft = el.scrollLeft;
  state.bar.setAttribute("aria-valuemin", "0");
  state.bar.setAttribute("aria-valuemax", String(Math.round(overflow)));
  state.bar.setAttribute("aria-valuenow", String(Math.round(el.scrollLeft)));
}

let sharedResizeObserver: ResizeObserver | null = null;
let sharedIntersectionObserver: IntersectionObserver | null = null;

function enhance(el: Enhanced) {
  if (el[MARKER]) {
    sync(el);
    return;
  }
  if (!isEligible(el)) return;
  if (el.scrollWidth - el.clientWidth <= MIN_OVERFLOW) return;

  const parent = el.parentElement;
  if (!parent) return;
  // Evita duplicação caso um bar já exista imediatamente antes (re-render/HMR).
  const previous = el.previousElementSibling;
  if (previous?.classList.contains("flux-dual-scrollbar")) previous.remove();

  const bar = document.createElement("div");
  bar.className = "flux-dual-scrollbar";
  bar.setAttribute("role", "scrollbar");
  bar.setAttribute("aria-orientation", "horizontal");
  bar.setAttribute("aria-label", "Rolagem horizontal do conteúdo abaixo");
  bar.tabIndex = 0;
  const spacer = document.createElement("div");
  spacer.className = "flux-dual-scrollbar-spacer";
  bar.appendChild(spacer);
  parent.insertBefore(bar, el);

  let lock = false;
  const onBar = () => {
    if (lock) return;
    lock = true;
    el.scrollLeft = bar.scrollLeft;
    bar.setAttribute("aria-valuenow", String(Math.round(bar.scrollLeft)));
    lock = false;
  };
  const onEl = () => {
    if (lock) return;
    lock = true;
    bar.scrollLeft = el.scrollLeft;
    bar.setAttribute("aria-valuenow", String(Math.round(el.scrollLeft)));
    lock = false;
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const max = el.scrollWidth - el.clientWidth;
    const page = Math.max(el.clientWidth - 40, STEP);
    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
        next = el.scrollLeft + STEP;
        break;
      case "ArrowLeft":
        next = el.scrollLeft - STEP;
        break;
      case "PageDown":
        next = el.scrollLeft + page;
        break;
      case "PageUp":
        next = el.scrollLeft - page;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = max;
        break;
      default:
        return;
    }
    event.preventDefault();
    const target = Math.min(Math.max(next, 0), max);
    el.scrollLeft = target;
    bar.scrollLeft = target;
    bar.setAttribute("aria-valuenow", String(Math.round(target)));
  };

  bar.addEventListener("scroll", onBar, { passive: true });
  el.addEventListener("scroll", onEl, { passive: true });
  bar.addEventListener("keydown", onKeyDown);

  sharedResizeObserver?.observe(el);
  if (el.firstElementChild) sharedResizeObserver?.observe(el.firstElementChild);
  sharedIntersectionObserver?.observe(el);

  el[MARKER] = {
    bar,
    spacer,
    visible: true,
    cleanup: () => {
      bar.removeEventListener("scroll", onBar);
      bar.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("scroll", onEl);
      sharedResizeObserver?.unobserve(el);
      if (el.firstElementChild) sharedResizeObserver?.unobserve(el.firstElementChild);
      sharedIntersectionObserver?.unobserve(el);
      bar.remove();
      tracked.delete(el);
      delete el[MARKER];
    },
  };
  tracked.add(el);

  sync(el);
}

export function DualScrollbars() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useHydrationSettled();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hydrated) return;


    let frame = 0;
    let idle = 0;
    const offscreen = new WeakSet<Element>();

    const schedule = (fn: () => void) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fn);
    };

    const syncTracked = () => {
      tracked.forEach((el) => {
        if (!el.isConnected) {
          el[MARKER]?.cleanup();
          return;
        }
        if (offscreen.has(el)) return;
        sync(el);
      });
    };

    const scan = () => {
      schedule(() => {
        syncTracked();
        document.querySelectorAll<HTMLElement>(SELECTOR).forEach((node) => {
          const target = node as Enhanced;
          if (!target[MARKER]) enhance(target);
        });
      });
    };

    const scanIdle = () => {
      const ric = (window as unknown as { requestIdleCallback?: typeof requestAnimationFrame })
        .requestIdleCallback;
      if (ric) {
        window.clearTimeout(idle);
        idle = window.setTimeout(() => ric(() => scan()), 0);
      } else {
        scan();
      }
    };

    sharedResizeObserver = new ResizeObserver((entries) => {
      schedule(() => {
        for (const entry of entries) {
          const el = (
            (entry.target as Enhanced)[MARKER]
              ? entry.target
              : (entry.target.parentElement ?? entry.target)
          ) as Enhanced;
          if (el[MARKER]) sync(el);
        }
      });
    });

    sharedIntersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            offscreen.delete(entry.target);
            sync(entry.target as Enhanced);
          } else {
            offscreen.add(entry.target);
          }
        }
      },
      { rootMargin: "200px" },
    );

    // Aguarda o fim da hidratação (incl. rotas lazy) antes de tocar no DOM.
    let cancelled = false;
    let timers: number[] = [];
    let mutationTimer = 0;
    let mo: MutationObserver | null = null;
    const onResize = () => schedule(syncTracked);

    const start = () => {
      if (cancelled) return;
      scan();
      timers = [80, 300, 900].map((ms) => window.setTimeout(scan, ms));

      mo = new MutationObserver((records) => {
        // Só reage quando nós realmente entram/saem do DOM (ignora atributos,
        // texto e as próprias barras que inserimos).
        let relevant = false;
        for (const record of records) {
          const nodes = [...record.addedNodes, ...record.removedNodes];
          if (
            nodes.some(
              (n) =>
                n.nodeType === 1 && !(n as HTMLElement).classList?.contains("flux-dual-scrollbar"),
            )
          ) {
            relevant = true;
            break;
          }
        }
        if (!relevant) return;
        window.clearTimeout(mutationTimer);
        mutationTimer = window.setTimeout(scanIdle, 200);
      });
      mo.observe(document.body, { childList: true, subtree: true });

      window.addEventListener("resize", onResize);
    };

    const boot = () => requestAnimationFrame(() => requestAnimationFrame(start));
    if (document.readyState === "complete") {
      boot();
    } else {
      window.addEventListener("load", boot, { once: true });
    }


    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(mutationTimer);
      window.clearTimeout(idle);
      window.removeEventListener("load", boot);
      mo?.disconnect();
      window.removeEventListener("resize", onResize);

      sharedResizeObserver?.disconnect();
      sharedIntersectionObserver?.disconnect();
      sharedResizeObserver = null;
      sharedIntersectionObserver = null;
      [...tracked].forEach((el) => el[MARKER]?.cleanup());
      tracked.clear();
    };
  }, [pathname, hydrated]);

  return null;
}

export default DualScrollbars;
