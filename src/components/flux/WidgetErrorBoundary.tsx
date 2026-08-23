import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

type Props = {
  /** Nome curto do widget para diagnóstico. Ex.: "TopBar", "AppSidebar". */
  name: string;
  /** Conteúdo a ser isolado. */
  children: ReactNode;
  /**
   * Modo compacto: renderiza apenas um ícone de alerta discreto quando o
   * widget falhar. Ideal para itens da Topbar/sidebar onde não pode ocupar
   * espaço.
   */
  compact?: boolean;
  /** Fallback custom (opcional). Recebe `retry`. */
  fallback?: (retry: () => void, error: Error) => ReactNode;
};

type State = { error: Error | null };

/**
 * ErrorBoundary escopado por widget. Impede que uma exceção em um item
 * secundário (ex.: Topbar, sidebar, sino de notificações) derrube toda a
 * navegação/layout. Nunca aplicar em roteador ou <Outlet /> — isso é
 * responsabilidade do errorComponent da rota.
 */
export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Encaminha para telemetria interna; nunca deixa telemetria derrubar UI.
    try {
      reportLovableError(error, {
        boundary: "widget",
        widget: this.props.name,
        componentStack: info.componentStack?.slice(0, 2000),
      });
    } catch {
      /* noop */
    }
  }

  retry = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { children, compact, fallback, name } = this.props;
    if (!error) return children;

    if (fallback) return fallback(this.retry, error);

    if (compact) {
      return (
        <button
          type="button"
          onClick={this.retry}
          title={`Falha em ${name}. Clique para recarregar o componente.`}
          aria-label={`Falha em ${name}. Recarregar.`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
        >
          <AlertTriangle className="h-4 w-4" />
        </button>
      );
    }

    return (
      <div
        role="alert"
        className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
      >
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">
          Falha ao carregar {name}. O restante do sistema segue funcionando.
        </span>
        <button
          type="button"
          onClick={this.retry}
          className="inline-flex items-center gap-1 rounded border border-destructive/40 px-2 py-0.5 text-[11px] font-medium hover:bg-destructive/10"
        >
          <RefreshCw className="h-3 w-3" /> Tentar novamente
        </button>
      </div>
    );
  }
}
