import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Keeps document.title in sync with the current page's <h1>.
 * Preserves the "(N)" unread-notification prefix maintained by NotifBellTop.
 * Falls back to the route's own head() title when no <h1> is present.
 */
export function PageTitleSync() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Give the new route a moment to render its <h1>
    const t = setTimeout(() => {
      const h1 = document.querySelector("h1");
      const heading = h1?.textContent?.trim();
      if (!heading) return;

      // Preserve unread-count prefix like "(3) ..."
      const match = document.title.match(/^\((\d+|99\+)\)\s*/);
      const prefix = match ? match[0] : "";
      const next = `${prefix}${heading} · FLUX`;
      if (document.title !== next) {
        document.title = next;
      }
    }, 200);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
