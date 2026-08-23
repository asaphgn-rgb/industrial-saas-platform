import { useEffect, useState } from "react";
import { MonitorSmartphone } from "lucide-react";

/**
 * Detects when the FLUX is open in more than one browser tab in the same
 * browser (via BroadcastChannel) and warns the user, since concurrent
 * edits in two tabs can produce lost updates.
 */
export function DuplicateTabWarning() {
  const [hasOther, setHasOther] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
      return;
    }
    const channel = new BroadcastChannel("flux-tabs");
    const myId = Math.random().toString(36).slice(2);

    let pongTimer: ReturnType<typeof setTimeout> | null = null;

    function ping() {
      channel.postMessage({ type: "ping", from: myId });
    }

    function onMessage(e: MessageEvent) {
      const data = e.data as { type: string; from?: string };
      if (!data || data.from === myId) return;
      if (data.type === "ping") {
        channel.postMessage({ type: "pong", from: myId });
      }
      if (data.type === "ping" || data.type === "pong") {
        setHasOther(true);
        if (pongTimer) clearTimeout(pongTimer);
        // if we don't hear from anyone for 8s, assume the other tab closed
        pongTimer = setTimeout(() => setHasOther(false), 8000);
      }
    }

    channel.addEventListener("message", onMessage);
    ping();
    const interval = setInterval(ping, 4000);

    return () => {
      clearInterval(interval);
      if (pongTimer) clearTimeout(pongTimer);
      channel.removeEventListener("message", onMessage);
      channel.close();
    };
  }, []);

  if (!hasOther) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-4 py-1.5 text-xs font-medium text-warning-foreground shadow-lg backdrop-blur">
        <MonitorSmartphone className="h-3.5 w-3.5 text-warning" />
        <span>
          FLUX está aberto em outra aba — evite editar o mesmo registro em duas abas ao mesmo tempo.
        </span>
      </div>
    </div>
  );
}
