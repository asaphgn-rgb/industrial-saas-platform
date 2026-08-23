import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { toast } from "sonner";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "flux:pwa-install-dismissed-at";
const IOS_DISMISS_KEY = "flux:pwa-ios-dismissed-at";
const DISMISS_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function isRecentlyDismissed(key: string): boolean {
  try {
    const ts = Number(localStorage.getItem(key) ?? "0");
    return Number.isFinite(ts) && Date.now() - ts < DISMISS_MS;
  } catch {
    return false;
  }
}

function markDismissed(key: string) {
  try {
    localStorage.setItem(key, String(Date.now()));
  } catch {
    // ignore
  }
}

/**
 * Sidebar install hint. Two branches:
 * - Chromium/Edge/Android: uses beforeinstallprompt for one-tap install.
 * - iOS Safari (no event): explains Share → Adicionar à Tela de Início.
 */
export function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIos, setShowIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }

    // iOS Safari detection (no beforeinstallprompt). Show hint once every 14d.
    const ua = window.navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIOS && !isRecentlyDismissed(IOS_DISMISS_KEY)) {
      setShowIos(true);
    }

    if (isRecentlyDismissed(DISMISS_KEY)) return;

    function onPrompt(e: Event) {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setInstalled(true);
      setEvt(null);
      setShowIos(false);
      toast.success("FLUX instalado como aplicativo");
    }
    window.addEventListener("beforeinstallprompt", onPrompt as EventListener);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function install() {
    if (!evt) return;
    const { haptic } = await import("@/lib/haptic");
    haptic.light();
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === "accepted") haptic.success();
    else markDismissed(DISMISS_KEY);
    setEvt(null);
  }

  function dismissChromium() {
    markDismissed(DISMISS_KEY);
    setEvt(null);
  }

  function dismissIos() {
    markDismissed(IOS_DISMISS_KEY);
    setShowIos(false);
  }

  if (evt) {
    return (
      <div className="mx-2 mb-1 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-2 py-1.5 text-[10px] text-sidebar-foreground">
        <Download className="h-3.5 w-3.5 shrink-0 text-primary" />
        <div className="flex-1 leading-tight">
          <p className="font-medium">Instalar FLUX como app</p>
          <p className="text-sidebar-foreground/70">Abre mais rápido e sem barra do navegador</p>
        </div>
        <button
          onClick={install}
          className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground hover:bg-primary/90"
        >
          Instalar
        </button>
        <button
          onClick={dismissChromium}
          className="rounded px-1 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          title="Adiar por 14 dias"
        >
          ×
        </button>
      </div>
    );
  }

  if (showIos) {
    return (
      <div className="mx-2 mb-1 flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 px-2 py-1.5 text-[10px] text-sidebar-foreground">
        <Share className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <div className="flex-1 leading-tight">
          <p className="font-medium">Instalar no iPhone/iPad</p>
          <p className="text-sidebar-foreground/70">
            Toque em <span className="font-medium">Compartilhar</span> e depois em{" "}
            <span className="font-medium">Adicionar à Tela de Início</span>.
          </p>
        </div>
        <button
          onClick={dismissIos}
          className="rounded px-1 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          title="Adiar por 14 dias"
        >
          ×
        </button>
      </div>
    );
  }

  return null;
}
