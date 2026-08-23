import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Watches the Supabase session and proactively warns the user ~2 min
 * before it expires, offering a one-click renewal so long shifts don't
 * get logged out mid-task.
 */
export function SessionExpiryWatcher() {
  const warnedForRef = useRef<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    async function check() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session?.expires_at) return;

      const expMs = session.expires_at * 1000;
      const remaining = expMs - Date.now();

      // Warn once per session between 2min and 30s before expiry
      if (
        remaining <= 2 * 60 * 1000 &&
        remaining > 30 * 1000 &&
        warnedForRef.current !== session.expires_at
      ) {
        warnedForRef.current = session.expires_at;
        toast.warning("Sua sessão vai expirar em breve", {
          description: "Clique em Continuar para renovar sem sair do sistema.",
          duration: 90_000,
          action: {
            label: "Continuar",
            onClick: async () => {
              const { error } = await supabase.auth.refreshSession();
              if (error) {
                toast.error("Não foi possível renovar a sessão", {
                  description: "Faça login novamente.",
                });
              } else {
                toast.success("Sessão renovada");
              }
            },
          },
        });
      }
    }

    check();
    timer = setInterval(check, 30_000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  return null;
}
