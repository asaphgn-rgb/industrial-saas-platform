import { useEffect, useState } from "react";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpdateSystemButton } from "@/components/flux/UpdateSystemButton";

/**
 * Overlay global que aparece apenas quando um ChunkLoadError persiste
 * após a tentativa de reload automática (`flux-chunk-reload`).
 *
 * Objetivo: dar ao usuário uma ação clara — "Atualizar sistema" — sem
 * derrubar a navegação nem interferir na fila offline / sessão Supabase
 * (o `UpdateSystemButton` respeita esses limites).
 *
 * O componente escuta `window` para `unhandledrejection` e `error`, e
 * despacha um `CustomEvent('flux:chunk-error')` para consumidores
 * externos (ex.: telemetria).
 */
export function ChunkErrorOverlay() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: PromiseRejectionEvent | ErrorEvent) => {
      const msg =
        (event as PromiseRejectionEvent).reason?.message ?? (event as ErrorEvent).message ?? "";
      if (typeof msg !== "string") return;
      if (
        !/ChunkLoadError|Failed to fetch dynamically imported module|Loading chunk .* failed|Importing a module script failed/i.test(
          msg,
        )
      ) {
        return;
      }

      // Se o auto-reload guarded já disparou uma vez, o problema persiste.
      // Mostra overlay em vez de recarregar de novo (evita loop).
      try {
        const alreadyReloaded = sessionStorage.getItem("flux-chunk-reload") === "1";
        if (alreadyReloaded) {
          setMessage(msg.slice(0, 200));
          setVisible(true);
          window.dispatchEvent(new CustomEvent("flux:chunk-error", { detail: { message: msg } }));
        }
      } catch {
        setMessage(msg.slice(0, 200));
        setVisible(true);
      }
    };

    window.addEventListener("unhandledrejection", handler);
    window.addEventListener("error", handler);
    return () => {
      window.removeEventListener("unhandledrejection", handler);
      window.removeEventListener("error", handler);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flux-chunk-overlay-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm print:hidden"
    >
      <div className="w-full max-w-md rounded-lg border border-destructive/40 bg-card p-6 shadow-lg">
        <div className="mb-3 flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <h2 id="flux-chunk-overlay-title" className="text-lg font-semibold">
            Uma nova versão do FLUX está disponível
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar um dos arquivos do sistema. Isso normalmente indica que houve
          uma atualização enquanto sua janela estava aberta. Atualize para carregar a versão mais
          recente — sua sessão e a fila de apontamentos offline serão preservadas.
        </p>
        <div className="mt-4 rounded-md border border-border bg-muted/40 p-2 text-[11px] text-muted-foreground">
          Código técnico: {message || "chunk indisponível"}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <UpdateSystemButton />
          <Button
            variant="outline"
            onClick={() => {
              setVisible(false);
              try {
                sessionStorage.removeItem("flux-chunk-reload");
              } catch {
                /* noop */
              }
            }}
          >
            Continuar sem atualizar
          </Button>
          <Button asChild variant="ghost">
            <a href="/painel">
              <Home className="mr-2 h-4 w-4" /> Início
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
