import { AlertTriangle, RefreshCw, WifiOff, CloudUpload, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { friendlyError } from "@/lib/friendly-error";

/**
 * Estados visuais padrão (§14). Nenhum painel pode exibir erro técnico cru,
 * ficar vazio sem explicação ou em loading infinito.
 */
export function ErrorState({
  error,
  title = "Não foi possível carregar este painel",
  onRetry,
  compact = false,
  className,
}: {
  error?: unknown;
  title?: string;
  onRetry?: () => void;
  compact?: boolean;
  className?: string;
}) {
  const message = error ? friendlyError(error) : "Tente novamente em alguns instantes.";
  return (
    <div
      role="alert"
      data-testid="error-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-flux-danger-soft text-center",
        compact ? "px-4 py-6" : "px-6 py-10",
        className,
      )}
    >
      <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="max-w-md text-xs text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" className="min-h-11" onClick={onRetry}>
          <RefreshCw className="mr-1 h-4 w-4" aria-hidden />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export function NoDataState({
  title = "Sem dados no período",
  description = "Ajuste os filtros ou selecione outro intervalo de datas.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      data-testid="no-data-state"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center",
        className,
      )}
    >
      <Database className="h-5 w-5 text-muted-foreground" aria-hidden />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-md text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function PartialDataState({
  missing,
  className,
}: {
  missing: string;
  className?: string;
}) {
  return (
    <p
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-lg border border-warning/40 bg-flux-warning-soft px-3 py-2 text-xs text-foreground",
        className,
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-warning" aria-hidden />
      <span>Dados parciais: {missing}. Os indicadores podem mudar após a sincronização.</span>
    </p>
  );
}

export function OfflineState({ className }: { className?: string }) {
  return (
    <p
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-flux-card-soft px-3 py-2 text-xs text-muted-foreground",
        className,
      )}
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
      <span>Você está offline. Exibindo os últimos dados sincronizados.</span>
    </p>
  );
}

export function SyncPendingState({ count, className }: { count?: number; className?: string }) {
  return (
    <p
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-lg border border-info/40 bg-flux-info-soft px-3 py-2 text-xs text-foreground",
        className,
      )}
    >
      <CloudUpload className="h-4 w-4 shrink-0 text-info" aria-hidden />
      <span>
        {count ? `${count} lançamento(s) aguardando envio` : "Sincronização pendente"} — serão
        enviados assim que a conexão voltar.
      </span>
    </p>
  );
}

export default ErrorState;
