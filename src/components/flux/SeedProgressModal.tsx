import { CheckCircle2, Circle, Loader2, XCircle, AlertTriangle, RotateCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export type StepStatus = "pending" | "running" | "success" | "error";

export interface ProgressStep {
  id: string;
  label: string;
  status: StepStatus;
  count?: number;
  detalhes?: Record<string, number>;
  erro?: string;
}

interface SeedProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  steps: ProgressStep[];
  /** true enquanto qualquer passo está rodando */
  running: boolean;
  /** habilita botão de retry quando existe passo com erro */
  onRetry?: () => void;
  /** ação alternativa (ex.: “Ir ao Painel”) exibida ao concluir com sucesso */
  onConcluir?: () => void;
}

function statusIcon(status: StepStatus) {
  switch (status) {
    case "running":
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case "error":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground/40" />;
  }
}

export function SeedProgressModal({
  open,
  onOpenChange,
  title,
  description,
  steps,
  running,
  onRetry,
  onConcluir,
}: SeedProgressModalProps) {
  const done = steps.filter((s) => s.status === "success" || s.status === "error").length;
  const total = steps.length || 1;
  const pct = Math.round((done / total) * 100);
  const hasError = steps.some((s) => s.status === "error");
  const allOk = !running && !hasError && done === total;

  return (
    <Dialog open={open} onOpenChange={(v) => (running ? null : onOpenChange(v))}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : allOk ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : hasError ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : null}
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Progress value={pct} className="h-2 flex-1" />
            <span className="text-xs tabular-nums text-muted-foreground">
              {done}/{total}
            </span>
          </div>

          <ul className="space-y-2 rounded-md border bg-muted/30 p-3 text-sm">
            {steps.map((s) => (
              <li key={s.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {statusIcon(s.status)}
                    <span
                      className={
                        s.status === "error" ? "text-destructive font-medium" : "font-medium"
                      }
                    >
                      {s.label}
                    </span>
                  </div>
                  {typeof s.count === "number" && s.status === "success" && (
                    <Badge variant="secondary" className="text-[10px]">
                      +{s.count} registros
                    </Badge>
                  )}
                  {s.status === "error" && (
                    <Badge variant="destructive" className="text-[10px]">
                      Falhou
                    </Badge>
                  )}
                </div>
                {s.status === "error" && s.erro && (
                  <p className="ml-6 rounded bg-destructive/10 px-2 py-1 text-xs text-destructive break-words">
                    {s.erro}
                  </p>
                )}
                {s.status === "success" && s.detalhes && Object.keys(s.detalhes).length > 0 && (
                  <p className="ml-6 text-[11px] text-muted-foreground">
                    {Object.entries(s.detalhes)
                      .filter(([, v]) => v > 0)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ") || "sem novos registros (já estava populado)"}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="gap-2">
          {hasError && onRetry && (
            <Button variant="outline" onClick={onRetry} disabled={running}>
              <RotateCw className="mr-2 h-4 w-4" /> Tentar novamente
            </Button>
          )}
          {allOk && onConcluir && <Button onClick={onConcluir}>Ir para o Painel</Button>}
          <Button
            variant={allOk ? "outline" : "secondary"}
            onClick={() => onOpenChange(false)}
            disabled={running}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
