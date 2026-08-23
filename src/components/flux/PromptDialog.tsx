import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/**
 * Promise-based prompt dialog. Substitui `window.prompt()`.
 *
 *   const name = await promptDialog({ title: "Nome desta visão:" });
 *   if (!name) return;
 */
type PromptOpts = {
  title: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  label?: string;
};

type PendingRequest = PromptOpts & { resolve: (v: string | null) => void };

let pushRequest: ((req: PendingRequest) => void) | null = null;

export function promptDialog(opts: PromptOpts | string): Promise<string | null> {
  const normalized: PromptOpts = typeof opts === "string" ? { title: opts } : opts;
  return new Promise((resolve) => {
    if (!pushRequest) {
      if (typeof window !== "undefined") {
        const result = window.prompt(normalized.title, normalized.defaultValue ?? "");
        resolve(result?.trim() || null);
      } else {
        resolve(null);
      }
      return;
    }
    pushRequest({ ...normalized, resolve });
  });
}

export function PromptDialogHost() {
  const [queue, setQueue] = useState<PendingRequest[]>([]);
  const [value, setValue] = useState("");
  const current = queue[0];

  useEffect(() => {
    pushRequest = (req) => setQueue((q) => [...q, req]);
    return () => {
      pushRequest = null;
    };
  }, []);

  useEffect(() => {
    if (current) setValue(current.defaultValue ?? "");
  }, [current]);

  function resolveCurrent(result: string | null) {
    if (!current) return;
    current.resolve(result);
    setQueue((q) => q.slice(1));
    setValue("");
  }

  return (
    <Dialog
      open={!!current}
      onOpenChange={(open) => {
        if (!open) resolveCurrent(null);
      }}
    >
      <DialogContent
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            resolveCurrent(value.trim() || null);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{current?.title ?? ""}</DialogTitle>
          {current?.description && (
            <DialogDescription>{current.description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-2 py-2">
          {current?.label && <Label htmlFor="flux-prompt-input">{current.label}</Label>}
          <Input
            id="flux-prompt-input"
            autoFocus
            value={value}
            placeholder={current?.placeholder}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => resolveCurrent(null)}>
            {current?.cancelLabel ?? "Cancelar"}
          </Button>
          <Button onClick={() => resolveCurrent(value.trim() || null)}>
            {current?.confirmLabel ?? "OK"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
