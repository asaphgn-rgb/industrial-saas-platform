/**
 * AppSidebarErrorBoundary — isola falhas da sidebar dinâmica e cai em
 * AppSidebarSafe. Registra o incidente em frontend_error_logs via o endpoint
 * autenticado /api/public/report-error.
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { AppSidebarSafe } from "@/components/flux/AppSidebarSafe";
import { reportError } from "@/lib/report-error";
import { reportLovableError } from "@/lib/lovable-error-reporting";

type Props = { children: ReactNode };
type State = { error: Error | null; attempt: number };

export class AppSidebarErrorBoundary extends Component<Props, State> {
  state: State = { error: null, attempt: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    try {
      reportLovableError(error, {
        boundary: "app_sidebar",
        widget: "AppSidebar",
        componentStack: info.componentStack?.slice(0, 2000),
      });
    } catch {
      /* noop */
    }

    void reportError({
      descricao: "Falha capturada no AppSidebarErrorBoundary",
      modulo: "AppSidebar",
      error,
      severity: "warning",
      contexto: {
        boundary: "AppSidebarErrorBoundary",
        componentStack: info.componentStack?.slice(0, 2000),
      },
    }).catch(() => {});
  }

  private retry = () => {
    this.setState((prev) => ({ error: null, attempt: prev.attempt + 1 }));
  };

  render() {
    if (this.state.error) {
      return (
        <AppSidebarSafe
          reason="A sidebar completa está temporariamente indisponível. O restante do sistema segue operando normalmente."
          onRetry={this.retry}
        />
      );
    }
    // `key` força remount ao pressionar "Tentar carregar menu completo".
    return (
      <div key={this.state.attempt} className="contents">
        {this.props.children}
      </div>
    );
  }
}
