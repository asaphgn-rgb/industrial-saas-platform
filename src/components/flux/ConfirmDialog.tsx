import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Promise-based confirmation dialog. Substitui `window.confirm()`.
 *
 *   if (!(await confirmDialog({ title: "Excluir?", description: "Ação irreversível." }))) return;
 */
type ConfirmOpts = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type PendingRequest = ConfirmOpts & { resolve: (v: boolean) => void };

let pushRequest: ((req: PendingRequest) => void) | null = null;

export function confirmDialog(opts: ConfirmOpts | string): Promise<boolean> {
  const normalized: ConfirmOpts = typeof opts === "string" ? { title: opts } : opts;
  return new Promise((resolve) => {
    if (!pushRequest) {
      // Fallback: se o host global ainda não montou, cai para o confirm nativo.
      if (typeof window !== "undefined") {
        const msg = [normalized.title, normalized.description].filter(Boolean).join("\n\n");
        resolve(window.confirm(msg));
      } else {
        resolve(false);
      }
      return;
    }
    pushRequest({ ...normalized, resolve });
  });
}

export function ConfirmDialogHost() {
  const [queue, setQueue] = useState<PendingRequest[]>([]);
  const current = queue[0];

  useEffect(() => {
    pushRequest = (req) => setQueue((q) => [...q, req]);
    return () => {
      pushRequest = null;
    };
  }, []);

  function resolveCurrent(result: boolean) {
    if (!current) return;
    current.resolve(result);
    setQueue((q) => q.slice(1));
  }

  return (
    <AlertDialog
      open={!!current}
      onOpenChange={(open) => {
        if (!open) resolveCurrent(false);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{current?.title ?? ""}</AlertDialogTitle>
          {current?.description && (
            <AlertDialogDescription className="whitespace-pre-line">
              {current.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => resolveCurrent(false)}>
            {current?.cancelLabel ?? "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => resolveCurrent(true)}
            className={
              current?.destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : undefined
            }
          >
            {current?.confirmLabel ?? "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
