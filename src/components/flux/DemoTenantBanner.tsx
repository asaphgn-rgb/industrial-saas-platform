import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Sparkles } from "lucide-react";

/**
 * Faixa discreta exibida no topo quando o tenant atual está marcado
 * como `is_demo = true`. Deixa claro para o usuário (e para quem estiver
 * assistindo à demonstração) que os dados são fictícios e serão
 * limpos ao desativar o modo demo.
 */
export function DemoTenantBanner() {
  const { data: isDemo } = useQuery({
    queryKey: ["tenant-is-demo"],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: tid } = await (supabase as any).rpc("current_tenant_id");
      if (!tid) return false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("tenants")
        .select("is_demo")
        .eq("id", tid)
        .maybeSingle();
      return Boolean(data?.is_demo);
    },
  });

  if (!isDemo) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 border-b border-warning/40 bg-warning/10 px-3 py-1.5 text-[11px] font-medium text-warning"
    >
      <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="truncate">
        Modo demonstração — dados fictícios para exibição do sistema. Serão removidos ao desativar.
      </span>
    </div>
  );
}
