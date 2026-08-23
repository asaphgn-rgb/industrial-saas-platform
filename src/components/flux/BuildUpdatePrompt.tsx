import { useEffect, useRef } from "react";
import { toast } from "sonner";

const POLL_MS = 5 * 60_000; // check every 5 minutes

/**
 * Detects that a fresh FLUX deploy is live and offers a one-click reload.
 * Strategy: fetch the app entry (`/`) every ~5 min with a cache-busting
 * query, extract the hashed script URLs Vite injects, and hash them. The
 * first response primes the reference; any change afterwards triggers a
 * sticky toast with a "Recarregar" action. Skips while the tab is hidden
 * or the browser is offline, so it never wakes a sleeping laptop just to
 * poll HTML.
 */
export function BuildUpdatePrompt() {
  const known = useRef<string | null>(null);
  const notified = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function check() {
      if (cancelled) return;
      if (document.visibilityState !== "visible") return schedule();
      if (typeof navigator !== "undefined" && navigator.onLine === false) return schedule();

      try {
        const res = await fetch(`/?_v=${Date.now()}`, {
          cache: "no-store",
          headers: { "cache-control": "no-cache" },
        });
        if (!res.ok) return schedule();
        const html = await res.text();
        const fingerprint = extractAssetsFingerprint(html);
        if (!fingerprint) return schedule();

        if (known.current == null) {
          known.current = fingerprint;
        } else if (known.current !== fingerprint && !notified.current) {
          notified.current = true;
          toast("Nova versão do FLUX disponível", {
            description: "Recarregue para carregar as últimas melhorias.",
            duration: Infinity,
            action: {
              label: "Recarregar",
              onClick: () => window.location.reload(),
            },
          });
        }
      } catch {
        /* network hiccup — try again next tick */
      } finally {
        schedule();
      }
    }

    function schedule() {
      if (cancelled) return;
      timer = setTimeout(check, POLL_MS);
    }

    // Prime immediately, but with a small delay so we don't race the app boot.
    timer = setTimeout(check, 30_000);

    // Also re-check right after the tab becomes visible again.
    const onVis = () => {
      if (document.visibilityState === "visible" && !notified.current) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(check, 2_000);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return null;
}

/**
 * Vite injects hashed script/link URLs into the served index.html
 * (e.g. /assets/index-Ab12cd34.js). Their union is stable per deploy
 * and changes on every new build — a reliable "build id" without
 * server support.
 */
function extractAssetsFingerprint(html: string): string | null {
  const matches = html.match(/\/assets\/[a-zA-Z0-9._-]+/g);
  if (!matches || matches.length === 0) return null;
  const uniq = Array.from(new Set(matches)).sort();
  return uniq.join("|");
}
