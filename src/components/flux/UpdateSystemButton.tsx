import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Botão "Atualizar versão do sistema".
 *
 * Comportamento:
 * 1. Verifica se há itens pendentes na fila offline (flux:offline-queue:v1).
 *    Se houver, alerta e não prossegue — evita perder apontamentos.
 * 2. Limpa TODAS as caches (`caches.keys()` + `caches.delete()`).
 * 3. Desregistra o service worker atual (o próximo load registra a versão nova).
 * 4. Recarrega a página com `location.reload()`.
 *
 * NÃO limpa localStorage/sessionStorage — a fila offline vive lá e a sessão
 * do Supabase também.
 */
export function UpdateSystemButton() {
  const [updating, setUpdating] = useState(false);

  function pendingOfflineCount(): number {
    if (typeof localStorage === "undefined") return 0;
    try {
      const raw = localStorage.getItem("flux:offline-queue:v1");
      if (!raw) return 0;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  }

  async function doUpdate() {
    setUpdating(true);
    try {
      // 1) Limpar caches
      if (typeof caches !== "undefined") {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // 2) Desregistrar SW
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      toast.success("Caches limpos. Recarregando...");
      // 3) Reload
      setTimeout(() => window.location.reload(), 400);
    } catch (e) {
      setUpdating(false);
      toast.error("Falha ao atualizar: " + (e as Error).message);
    }
  }

  const pending = pendingOfflineCount();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={updating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${updating ? "animate-spin" : ""}`} />
          Atualizar versão do sistema
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Atualizar versão do sistema?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                Isto limpa caches antigos do navegador e do service worker e recarrega o FLUX com a
                versão mais recente. Sua sessão permanece ativa.
              </p>
              {pending > 0 && (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-destructive">
                  <strong>Atenção:</strong> existem <strong>{pending}</strong> apontamento(s) na
                  fila offline aguardando sincronização. Conecte-se à internet e sincronize antes de
                  atualizar para evitar reenvios.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={updating}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={doUpdate} disabled={updating}>
            {updating ? "Atualizando..." : "Atualizar agora"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
