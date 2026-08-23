import type { ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/flux/LoadingState";
import { PermissionDenied } from "@/components/flux/PermissionDenied";
import { getAdminAccess } from "@/lib/admin-access.functions";

interface AdminGateProps {
  children: ReactNode;
  /** Nome descritivo do recurso para a mensagem. */
  recurso?: string;
}

/**
 * Gate de UI para páginas administrativas: só renderiza os filhos quando o
 * usuário for admin ou super_admin no tenant ativo. Em caso contrário,
 * mostra o bloco padrão de permissão negada. Complementa (não substitui) as
 * checagens `assertAdmin` nas server functions.
 */
export function AdminGate({ children, recurso = "esta área administrativa" }: AdminGateProps) {
  const fetchAccess = useServerFn(getAdminAccess);
  const q = useQuery({
    queryKey: ["admin-access"],
    queryFn: () => fetchAccess(),
    staleTime: 60_000,
  });

  if (q.isLoading) return <LoadingState variant="page" />;
  if (q.isError) {
    return (
      <PermissionDenied
        title="Não foi possível validar permissões"
        description={(q.error as Error).message}
      />
    );
  }
  const info = q.data;
  if (!info || (!info.isAdmin && !info.isSuperAdmin)) {
    return (
      <div className="p-4 md:p-6">
        <PermissionDenied
          title="Acesso restrito a administradores"
          description={`Apenas admins ou super_admins do tenant podem acessar ${recurso}. Contate um administrador para receber o papel adequado.`}
          requiredRole="admin | super_admin"
        />
      </div>
    );
  }
  return <>{children}</>;
}
