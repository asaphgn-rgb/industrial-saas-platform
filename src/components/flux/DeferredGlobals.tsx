import { lazy, Suspense, useEffect, useState } from "react";

const CommandPalette = lazy(() =>
  import("@/components/flux/CommandPalette").then((m) => ({ default: m.CommandPalette })),
);
const KeyboardShortcuts = lazy(() =>
  import("@/components/flux/KeyboardShortcuts").then((m) => ({ default: m.KeyboardShortcuts })),
);
const InstallPWAButton = lazy(() =>
  import("@/components/flux/InstallPWAButton").then((m) => ({ default: m.InstallPWAButton })),
);

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

/**
 * Defer non-critical global UI (command palette, PWA install button) until
 * after first paint. Keeps ~30KB of JS + Radix Dialog off the initial bundle
 * on cold loads while remaining transparent to end users.
 */
export function DeferredGlobals() {
  const [ready, setReady] = useState(false);
  const [installReady, setInstallReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load CommandPalette when the browser is idle, OR immediately on the
    // first Cmd/Ctrl+K keypress if that happens before idle fires.
    let cancelled = false;
    const arm = () => {
      if (cancelled) return;
      setReady(true);
    };

    const idle: number =
      (
        window as unknown as {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }
      ).requestIdleCallback?.(arm, { timeout: 2500 }) ?? window.setTimeout(arm, 1500);

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) arm();
    };
    window.addEventListener("keydown", onKey);

    // InstallPWAButton is only useful if the browser dispatches beforeinstallprompt.
    // Wait for it instead of mounting the component eagerly.
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setInstallReady(true);
    };
    window.addEventListener("beforeinstallprompt", onInstall);

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeinstallprompt", onInstall);
      const cancel = (window as unknown as { cancelIdleCallback?: (id: number) => void })
        .cancelIdleCallback;
      if (cancel) cancel(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  return (
    <>
      {ready ? (
        <Suspense fallback={null}>
          <CommandPalette />
          <KeyboardShortcuts />
        </Suspense>
      ) : null}
      {installReady ? (
        <div
          className="fixed left-4 z-40 md:hidden print:hidden"
          style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
        >
          <Suspense fallback={null}>
            <InstallPWAButton initialEvent={installPrompt} />
          </Suspense>
        </div>
      ) : null}
    </>
  );
}
