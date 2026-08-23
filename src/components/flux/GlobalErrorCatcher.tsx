import { useEffect } from "react";
import { toast } from "sonner";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { pushError } from "@/lib/diagnostics/error-bus";

/**
 * Catches uncaught runtime errors and unhandled promise rejections so the
 * user always gets a friendly message instead of a silent failure.
 * The full error is still logged to the console for debugging.
 */
export function GlobalErrorCatcher() {
  useEffect(() => {
    let lastMsg = "";
    let lastAt = 0;

    function notify(message: string) {
      const now = Date.now();
      // dedupe same message within 3s to avoid toast spam on loops
      if (message === lastMsg && now - lastAt < 3000) return;
      lastMsg = message;
      lastAt = now;
      toast.error("Ocorreu um erro inesperado", {
        description: message.slice(0, 240),
      });
    }

    function onError(e: ErrorEvent) {
      // Ignore ResizeObserver noise and script-loading CORS errors
      const msg = e.message ?? "";
      if (msg.includes("ResizeObserver") || msg === "Script error." || msg === "") {
        return;
      }
      notify(msg);
      reportLovableError(
        e.error ?? new Error(msg),
        {
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
        },
        { mechanism: "onerror", handled: false, severity: "error" },
      );
      pushError({
        kind: "runtime",
        message: msg,
        stack: e.error?.stack,
        extra: { filename: e.filename, lineno: e.lineno, colno: e.colno },
      });
      // don't preventDefault — let React error boundaries also see it
    }

    function onRejection(e: PromiseRejectionEvent) {
      const reason = e.reason;
      const msg =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "Promessa rejeitada sem mensagem";
      notify(msg);
      reportLovableError(
        reason instanceof Error ? reason : new Error(msg),
        {
          reason_type: typeof reason,
        },
        { mechanism: "unhandledrejection", handled: false, severity: "error" },
      );
      pushError({
        kind: "unhandledrejection",
        message: msg,
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
