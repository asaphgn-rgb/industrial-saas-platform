import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellOff, Bell } from "lucide-react";
import { toast } from "sonner";

const KEY = "flux:notifications-muted-until";

export function NOTIF_MUTED_UNTIL(): number {
  if (typeof window === "undefined") return 0;
  const raw = Number(localStorage.getItem(KEY) ?? "0");
  return Number.isFinite(raw) ? raw : 0;
}

export function isNotifMuted(): boolean {
  return NOTIF_MUTED_UNTIL() > Date.now();
}

function tomorrow8am(): number {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(8, 0, 0, 0);
  return d.getTime();
}

const OPTIONS: { label: string; ms: () => number }[] = [
  { label: "15 minutos", ms: () => Date.now() + 15 * 60_000 },
  { label: "1 hora", ms: () => Date.now() + 60 * 60_000 },
  { label: "4 horas", ms: () => Date.now() + 4 * 60 * 60_000 },
  { label: "Até amanhã 08:00", ms: tomorrow8am },
];

function label(until: number): string {
  const ms = until - Date.now();
  if (ms <= 0) return "";
  const min = Math.round(ms / 60_000);
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h`;
  return `${Math.round(h / 24)} d`;
}

export function NotificationSnooze() {
  const [until, setUntil] = useState<number>(0);
  const [, setNow] = useState(0);

  useEffect(() => {
    setUntil(NOTIF_MUTED_UNTIL());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  function set(next: number) {
    localStorage.setItem(KEY, String(next));
    setUntil(next);
    if (next === 0) toast.success("Notificações reativadas");
    else toast.info(`Silenciado por ${label(next)}`);
  }

  const muted = until > Date.now();
  const remaining = muted ? label(until) : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={muted ? `Silenciado (${remaining})` : "Silenciar notificações"}
          className="relative"
          aria-label={muted ? `Silenciado (${remaining})` : "Silenciar notificações"}
        >
          {muted ? <BellOff className="h-4 w-4 text-warning" /> : <Bell className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          {muted ? `Silenciado por ${remaining}` : "Silenciar notificações"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.map((o) => (
          <DropdownMenuItem key={o.label} onClick={() => set(o.ms())}>
            {o.label}
          </DropdownMenuItem>
        ))}
        {muted ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => set(0)} className="text-primary">
              Reativar agora
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
