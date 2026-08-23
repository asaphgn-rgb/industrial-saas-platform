import { useEffect, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

/**
 * Thin animated progress bar at the very top of the viewport whenever
 * any TanStack Query fetch or mutation is in flight. Provides constant
 * visual feedback for slow connections without blocking the UI.
 */
export function GlobalLoadingBar() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const active = fetching + mutating > 0;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      return;
    }
    // Keep bar visible briefly after completion so short requests still register
    const t = setTimeout(() => setVisible(false), 250);
    return () => clearTimeout(t);
  }, [active]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-transparent"
      aria-hidden="true"
    >
      <div
        className={
          active
            ? "h-full w-1/3 animate-[flux-loading_1.2s_ease-in-out_infinite] bg-primary"
            : "h-full w-full bg-primary opacity-0 transition-opacity duration-200"
        }
      />
      <style>{`
        @keyframes flux-loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
