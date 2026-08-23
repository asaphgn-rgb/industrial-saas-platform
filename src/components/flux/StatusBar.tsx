import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Wifi, WifiOff, CheckCircle2, Clock } from "lucide-react";

function useOnline() {
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

function formatClock(d: Date) {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function useClock() {
  const [clock, setClock] = useState(() => formatClock(new Date()));
  useEffect(() => {
    setClock(formatClock(new Date()));
    const id = setInterval(() => setClock(formatClock(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

export function StatusBar() {
  const online = useOnline();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const clock = useClock();

  return (
    <footer
      className="sticky bottom-0 z-20 flex h-6 items-center gap-3 border-t border-border bg-card/95 px-3 text-[11px] text-muted-foreground backdrop-blur print:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
        paddingRight: "max(0.75rem, env(safe-area-inset-right))",
        height: "calc(1.5rem + env(safe-area-inset-bottom))",
      }}
      aria-label="Barra de status"
    >
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`flex items-center gap-1 ${online ? "" : "text-destructive font-medium"}`}
        title={online ? "Conectado" : "Sem conexão"}
      >
        {online ? (
          <Wifi className="h-3 w-3" aria-hidden="true" />
        ) : (
          <WifiOff className="h-3 w-3" aria-hidden="true" />
        )}
        {online ? "online" : "offline"}
      </span>

      <span className="flex items-center gap-1" title="Interface pronta">
        <CheckCircle2 className="h-3 w-3 text-success" />
        pronto
      </span>

      <span className="hidden md:inline truncate text-foreground" title={path}>
        {path}
      </span>

      <span className="ml-auto flex items-center gap-1" title="Horário local">
        <Clock className="h-3 w-3" />
        {clock}
      </span>
    </footer>
  );
}
