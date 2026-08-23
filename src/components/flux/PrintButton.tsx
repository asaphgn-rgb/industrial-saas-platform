import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="Imprimir ou salvar como PDF (Ctrl+P)"
      aria-label="Imprimir ou salvar como PDF (Ctrl+P)"
      onClick={() => window.print()}
      className="no-print"
    >
      <Printer className="h-4 w-4" />
    </Button>
  );
}

/**
 * Renders a print-only footer with page URL and timestamp,
 * so printed reports are self-identifying for audit.
 */
export function PrintFooter() {
  const now = new Date();
  const stamp = now.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return (
    <div
      aria-hidden
      className="hidden print:block fixed bottom-0 inset-x-0 border-t border-border bg-background px-4 py-1 text-[10px] text-muted-foreground"
    >
      FLUX · {typeof window !== "undefined" ? window.location.href : ""} · impresso em {stamp}
    </div>
  );
}
