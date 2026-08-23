import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const main = (document.querySelector("main") as HTMLElement | null) ?? null;
    const target: HTMLElement | Window = main ?? window;

    const getScroll = () =>
      main ? main.scrollTop : window.scrollY || document.documentElement.scrollTop;

    const onScroll = () => setVisible(getScroll() > 400);

    target.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => target.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const handleClick = () => {
    const main = document.querySelector("main") as HTMLElement | null;
    if (main) {
      main.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className="fixed right-4 z-40 h-11 w-11 rounded-full shadow-lg print:hidden md:right-6"
      style={{ bottom: "calc(5.25rem + env(safe-area-inset-bottom))" }}
      title="Voltar ao topo"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
