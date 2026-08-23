import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateSystemButton } from "@/components/flux/UpdateSystemButton";
import { reportError } from "@/lib/report-error";
import { reportLovableError } from "@/lib/lovable-error-reporting";

type Props = { children: ReactNode };
type State = { error: Error | null };

function isChunkError(error: Error | null): boolean {
  const text = `${error?.name ?? ""} ${error?.message ?? ""}`;
  return /ChunkLoadError|Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk .* failed/i.test(
    text,
  );
}

export class CentralImplantacaoErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    try {
      reportLovableError(error, {
        boundary: "central_implantacao",
        module: "Central de Implantação",
        componentStack: info.componentStack?.slice(0, 2000),
      });
    } catch {
      /* noop */
    }

    void reportError({
      descricao: "Falha capturada no ErrorBoundary da Central de Implantação",
      modulo: "Central de Implantação",
      error,
      contexto: {
        boundary: "CentralImplantacaoErrorBoundary",
        componentStack: info.componentStack?.slice(0, 2000),
      },
    }).catch(() => {});
  }

  private retry = () => this.setState({ error: null });

  render() {
    const chunkError = isChunkError(this.state.error);
    if (!this.state.error) return this.props.children;

    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-3xl items-center justify-center p-6">
        <Card className="w-full border-destructive/40">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle className="text-lg">
                {chunkError
                  ? "Uma nova versão do FLUX está disponível"
                  : "Central de Implantação indisponível no momento"}
              </CardTitle>
            </div>
            <CardDescription>
              {chunkError
                ? "Atualize o sistema para carregar os arquivos mais recentes sem afetar sua fila offline."
                : "O erro foi isolado nesta página e registrado para análise técnica. A navegação do sistema permanece ativa."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              Código técnico: {(this.state.error.name || "Error").slice(0, 60)}
            </div>
            <div className="flex flex-wrap gap-2">
              {chunkError ? (
                <UpdateSystemButton />
              ) : (
                <Button onClick={this.retry}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
                </Button>
              )}
              <Button asChild variant="outline">
                <Link to="/painel">
                  <Home className="mr-2 h-4 w-4" /> Ir para início
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
