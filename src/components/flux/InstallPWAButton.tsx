import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallPWAButton({ initialEvent = null }: { initialEvent?: BIPEvent | null }) {
  const [evt, setEvt] = useState<BIPEvent | null>(initialEvent);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (initialEvent) setEvt(initialEvent);
  }, [initialEvent]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) {
      setHidden(true);
      return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const installed = () => setHidden(true);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  if (hidden || !evt) return null;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        await evt.prompt();
        await evt.userChoice.catch(() => null);
        setEvt(null);
      }}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Instalar app
    </Button>
  );
}
