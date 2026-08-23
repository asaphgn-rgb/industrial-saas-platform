import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useHydrationSettled } from "@/hooks/use-hydration-settled";


/**
 * Melhora a rolagem horizontal de tabelas e grids em celular/tablet:
 *
 * - Alças visuais (setas) nas bordas esquerda/direita quando há mais conteúdo.
 * - Sombras de borda indicando que a rolagem continua.
 * - Arrasto por ponteiro (mouse/caneta) consistente com o toque nativo.
 * - Atributos de estado (`data-scroll-start` / `data-scroll-end`) usados pelo CSS.
 *
 * Use `data-no-scroll-handles` para desativar em um bloco específico.
 */

const MARK = "__fluxScrollHandles";
const SELECTOR =
  '[data-dual-scroll],[data-flux-table-wrapper],[class*="overflow-x-auto"],[class*="overflow-x-scroll"]';
const MIN_OVERFLOW = 24;

type Enhanced = HTMLElement & { [MARK]?: () => void };

function enhance(el: Enhanced) {
  if (el[MARK]) return;
  if (el.hasAttribute("data-no-scroll-handles")) return;
  if (el.getAttribute("role") === "tablist") return;
  if (el.classList.contains("flux-dual-scrollbar")) return;

  const style = window.getComputedStyle(el);
  if (!/(auto|scroll)/.test(style.overflowX)) return;

  el.classList.add("flux-scroll-x");
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
  if (!el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) {
    el.setAttribute("aria-label", "Área com rolagem horizontal");
  }

  const makeHandle = (dir: -1 | 1) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `flux-scroll-handle flux-scroll-handle--${dir === -1 ? "left" : "right"}`;
    btn.setAttribute("aria-label", dir === -1 ? "Rolar para a esquerda" : "Rolar para a direita");
    btn.tabIndex = -1;
    btn.innerHTML = dir === -1 ? "‹" : "›";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      el.scrollBy({ left: dir * Math.max(160, el.clientWidth * 0.8), behavior: "smooth" });
    });
    return btn;
  };

  const wrap = document.createElement("div");
  wrap.className = "flux-scroll-handles";
  wrap.setAttribute("aria-hidden", "false");
  const left = makeHandle(-1);
  const right = makeHandle(1);
  wrap.append(left, right);

  const host = el.parentElement;
  const positioned =
    host && window.getComputedStyle(host).position !== "static" ? host : null;
  if (host) {
    if (!positioned) host.classList.add("flux-scroll-host");
    host.appendChild(wrap);
  }

  const update = () => {
    const max = el.scrollWidth - el.clientWidth;
    const has = max > MIN_OVERFLOW;
    wrap.dataset["visible"] = has ? "true" : "false";
    el.toggleAttribute("data-scroll-start", el.scrollLeft <= 2);
    el.toggleAttribute("data-scroll-end", el.scrollLeft >= max - 2);
    el.toggleAttribute("data-scrollable-x", has);
  };

  el.addEventListener("scroll", update, { passive: true });
  const ro = new ResizeObserver(update);
  ro.observe(el);

  // Arrasto por ponteiro fino (mouse/caneta); o toque usa a rolagem nativa.
  let dragging = false;
  let startX = 0;
  let startLeft = 0;
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea, [role='button']")) return;
    if (el.scrollWidth - el.clientWidth <= MIN_OVERFLOW) return;
    dragging = true;
    startX = e.clientX;
    startLeft = el.scrollLeft;
    el.classList.add("is-panning");
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    el.scrollLeft = startLeft - (e.clientX - startX);
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove("is-panning");
  };
  el.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });

  update();

  el[MARK] = () => {
    el.removeEventListener("scroll", update);
    el.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    ro.disconnect();
    wrap.remove();
    delete el[MARK];
  };
}

export function TouchScrollEnhancer() {
  const routePath = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useHydrationSettled();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Só mexe no DOM depois que a hidratação (inclusive de rotas lazy)
    // terminou — mutar antes causa "Hydration failed".
    if (!hydrated) return;
    let raf = 0;
    const sweep = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.querySelectorAll<Enhanced>(SELECTOR).forEach((el) => {
          if (!el.isConnected) return;
          enhance(el);
        });
        // limpa elementos removidos do DOM
        document
          .querySelectorAll<Enhanced>(".flux-scroll-handles")
          .forEach((w) => {
            if (!w.parentElement?.isConnected) w.remove();
          });
      });
    };
    sweep();
    const t = window.setTimeout(sweep, 600);
    const mo = new MutationObserver(sweep);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", sweep);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      mo.disconnect();
      window.removeEventListener("resize", sweep);
    };
  }, [routePath, hydrated]);



  return null;
}

export default TouchScrollEnhancer;
