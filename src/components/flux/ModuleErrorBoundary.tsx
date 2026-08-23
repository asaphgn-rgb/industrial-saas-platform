import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { reportError } from "@/lib/report-error";

interface Props {
  children: ReactNode;
  /** Nome do bloco isolado — aparece na mensagem e no log. */
  area: string;
}

interface State {
  erro: Error | null;
}

/**
 * Error Boundary local: isola falhas de um bloco (ex.: OCR) para que o
 * restante da página continue funcionando, registrando a falha na telemetria.
 */
export class ModuleErrorBoundary extends Component<Props, State> {
  state: State = { erro: null };

  static getDerivedStateFromError(erro: Error): State {
    return { erro };
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    try {
      void reportError({
        descricao: `Falha isolada em ${this.props.area}: ${erro.message}`.slice(0, 300),
        modulo: this.props.area,
        error: erro,
        severity: "error",
        contexto: { componentStack: (info.componentStack ?? "").slice(0, 2000) },
      });

    } catch {
      /* telemetria nunca deve derrubar a página */
    }
    // eslint-disable-next-line no-console
    console.error(`[${this.props.area}]`, erro);
  }

  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Falha em {this.props.area}</AlertTitle>
        <AlertDescription className="space-y-2">
          <p className="text-sm">
            Este bloco foi isolado e a falha foi registrada. O restante da página continua
            funcionando normalmente.
          </p>
          <p className="font-mono text-xs opacity-80">{this.state.erro.message}</p>
          <Button size="sm" variant="outline" onClick={() => this.setState({ erro: null })}>
            <RotateCcw className="mr-2 h-4 w-4" /> Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
}
