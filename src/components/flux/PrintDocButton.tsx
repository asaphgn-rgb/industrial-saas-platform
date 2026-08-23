import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/friendly-error";
import { openPrintDocument, type PrintDocKind } from "@/lib/print-doc";

export function PrintDocButton({
  kind,
  docId,
  label = "Imprimir / PDF",
  size = "sm",
  variant = "outline",
}: {
  kind: PrintDocKind;
  docId: string;
  label?: string;
  size?: "sm" | "default";
  variant?: "outline" | "default" | "secondary";
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      size={size}
      variant={variant}
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);
          await openPrintDocument(kind, docId);
        } catch (e) {
          toast.error(friendlyError(e, "Falha ao gerar documento"));
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <Printer className="mr-1 h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
