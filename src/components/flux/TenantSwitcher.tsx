import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Building2, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type MyTenant = {
  tenant_id: string;
  nome_fantasia: string | null;
  razao_social: string | null;
  role: string;
  is_active: boolean;
};

export function TenantSwitcher(_props: { collapsed?: boolean } = {}) {
  const qc = useQueryClient();

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["my-tenants"],
    queryFn: async (): Promise<MyTenant[]> => {
      const { data, error } = await supabase.rpc("list_my_tenants");
      if (error) throw error;
      return (data as MyTenant[]) ?? [];
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const switchMut = useMutation({
    mutationFn: async (tenantId: string) => {
      const { error } = await supabase.rpc("set_active_tenant", { _tenant_id: tenantId });
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Empresa alterada");
      // Refetch everything under the new tenant
      await qc.cancelQueries();
      qc.clear();
      // Hard refresh to guarantee all module-scoped caches reset (offline queue, etc.)
      window.location.assign("/");
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Falha ao trocar de empresa";
      toast.error(msg);
    },
  });

  if (!tenants || tenants.length < 2) return null; // hide when single-tenant

  const active = tenants.find((t) => t.is_active) ?? tenants[0];
  const label = active.nome_fantasia ?? active.razao_social ?? "Empresa";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 max-w-[200px]"
          aria-label="Trocar de empresa"
          title="Trocar de empresa"
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline truncate text-xs">{label}</span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Minhas empresas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          tenants.map((t) => (
            <DropdownMenuItem
              key={t.tenant_id}
              onClick={() => {
                if (t.is_active || switchMut.isPending) return;
                switchMut.mutate(t.tenant_id);
              }}
              disabled={switchMut.isPending}
              className="flex items-start gap-2"
            >
              <div className="mt-0.5 w-4 shrink-0">
                {t.is_active ? <Check className="h-4 w-4 text-primary" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {t.nome_fantasia ?? t.razao_social ?? "Empresa sem nome"}
                </p>
                <p className="truncate text-[10px] text-muted-foreground capitalize">{t.role}</p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
