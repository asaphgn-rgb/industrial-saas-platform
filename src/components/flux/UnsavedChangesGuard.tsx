import { useEffect } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

/**
 * Warns the user before closing the tab / navigating away if there are
 * in-flight mutations or fetches (data not yet persisted / synced).
 */
export function UnsavedChangesGuard() {
  const mutating = useIsMutating();
  const fetching = useIsFetching();

  useEffect(() => {
    if (mutating === 0 && fetching === 0) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Required for Chrome
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [mutating, fetching]);

  return null;
}
