import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


interface LoadingStateProps {
  variant?: "page" | "card" | "list" | "table";
  rows?: number;
  className?: string;
  /**
   * Depois de `timeoutMs` (padrão 15s) o skeleton é substituído por um
   * bloco de erro amigável com botão "Tentar novamente". Passe `onRetry`
   * para permitir reexecução — normalmente `() => query.refetch()`.
   */
  timeoutMs?: number;
  onRetry?: () => void;
}

/**
 * Bloco de erro amigável exibido quando o carregamento excede o timeout.
 * Substitui skeletons infinitos por uma orientação clara ao usuário.
 */
function LoadingTimeout({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-warning/40 bg-warning/5 p-6 text-center",
        className,
      )}
      role="alert"
    >
      <AlertCircle className="h-6 w-6 text-warning" aria-hidden />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">Não foi possível carregar os dados.</p>
        <p className="text-xs text-muted-foreground">
          A resposta demorou mais que o esperado. Verifique sua conexão ou os filtros ativos.
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onRetry ?? (() => { if (typeof window !== "undefined") window.location.reload(); })}
      >
        <RefreshCw className="mr-2 h-3.5 w-3.5" />
        {onRetry ? "Tentar novamente" : "Recarregar página"}
      </Button>
    </div>
  );
}


/**
 * Esqueletos padronizados de carregamento do FLUX.
 * Sempre preferir aqui em vez de spinners para telas de listagem/dashboard.
 */
export function LoadingState({
  variant = "card",
  rows = 5,
  className,
  timeoutMs = 15000,
  onRetry,
}: LoadingStateProps) {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (!timeoutMs) return;
    const t = setTimeout(() => setTimedOut(true), timeoutMs);
    return () => clearTimeout(t);
  }, [timeoutMs]);

  if (timedOut) {
    return (
      <LoadingTimeout
        onRetry={onRetry ? () => { setTimedOut(false); onRetry(); } : undefined}
        className={className}
      />
    );
  }

  if (variant === "page") {
    return (
      <div className={cn("space-y-4", className)} aria-busy="true" aria-live="polite" data-testid="loading-state">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }
  if (variant === "list") {
    return (
      <div className={cn("space-y-2", className)} aria-busy="true" aria-live="polite" data-testid="loading-state">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 border rounded">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "table") {
    return (
      <div className={cn("space-y-1", className)} aria-busy="true" aria-live="polite">
        <Skeleton className="h-10" />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    );
  }
  return (
    <div className={cn("space-y-3", className)} aria-busy="true" aria-live="polite">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-32" />
    </div>
  );
}
