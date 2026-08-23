import { useEffect, useState } from "react";
import { flushQueue, listQueued } from "@/lib/offline-queue";
import { haptic } from "@/lib/haptic";
import { toast } from "sonner";
import { Wifi, WifiOff, CloudUpload } from "lucide-react";

export function OfflineIndicator() {
  const [mounted, setMounted] = useState(false);
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    setMounted(true);
    setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    const refresh = () => setPending(listQueued().length);
    refresh();

    const onOnline = async () => {
      setOnline(true);
      const q = listQueued();
      if (q.length) {
        toast.info(`Sincronizando ${q.length} apontamento(s)…`);
        const { ok, fail } = await flushQueue();
        refresh();
        if (ok) {
          toast.success(`${ok} apontamento(s) enviados`);
          haptic.success();
        }
        if (fail) {
          toast.error(`${fail} falharam — permanecem na fila`);
          haptic.error();
        }
      }
    };
    const onOffline = () => {
      setOnline(false);
      toast.warning("Sem conexão — apontamentos serão enfileirados");
      haptic.medium();
    };
    const onChanged = () => refresh();

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("flux:offline-queue-changed", onChanged);
    const interval = window.setInterval(refresh, 15_000);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("flux:offline-queue-changed", onChanged);
      window.clearInterval(interval);
    };
  }, []);

  if (!mounted) return null;
  if (online && pending === 0) return null;

  return (
    <div
      className="fixed bottom-10 left-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur print:hidden md:bottom-8"
      style={{ bottom: "calc(2.5rem + env(safe-area-inset-bottom))" }}
    >
      {online ? (
        <>
          <CloudUpload className="h-3.5 w-3.5 text-warning" /> {pending} pendente(s)
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5 text-destructive" /> Offline
          {pending ? ` · ${pending} na fila` : ""}
        </>
      )}
      {online && pending > 0 && (
        <button
          className="ml-1 text-primary underline"
          onClick={async () => {
            const { ok, fail } = await flushQueue();
            if (ok) {
              toast.success(`${ok} enviados`);
              haptic.success();
            }
            if (fail) {
              toast.error(`${fail} falharam`);
              haptic.error();
            }
          }}
        >
          sincronizar
        </button>
      )}
      {!online && <Wifi className="h-3.5 w-3.5 opacity-40" />}
    </div>
  );
}
