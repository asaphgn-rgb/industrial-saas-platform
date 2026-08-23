import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { checarAcessoModulo } from "@/lib/modulo-acesso.functions";
import { LoadingState } from "@/components/flux/LoadingState";
import { PermissionDenied } from "@/components/flux/PermissionDenied";


/**
 * Portão de módulo verificado no servidor.
 *
 * Envolve uma área inteira de rotas (ex.: `/financeiro/*`). O papel é lido do
 * banco por uma server function — digitar a URL direto não contorna o bloqueio,
 * e cada negativa vira uma linha em `audit_logs` com usuário, empresa e rota.
 *
 * A defesa real continua sendo a RLS (`can_read_financeiro` e afins); este
 * componente evita telas vazias e deixa a negativa auditável.
 */
export function ModuloGuard({
  modulo,
  papelSugerido,
  children,
}: {
  modulo: string;
  papelSugerido?: string;
  children: React.ReactNode;
}) {
  const checar = useServerFn(checarAcessoModulo);
  const href = useRouterState({ select: (s) => s.location.pathname });
  // Sem sessão o RPC vai falhar com "No authorization header"; espera o
  // layout _authenticated redirecionar para /auth antes de checar.
  const [temSessao, setTemSessao] = useState<boolean | null>(null);
  useEffect(() => {
    let vivo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (vivo) setTemSessao(Boolean(data.session));
    });
    return () => {
      vivo = false;
    };
  }, []);

  const { data, isPending, isError } = useQuery({
    queryKey: ["acesso-modulo", modulo, href],
    queryFn: () => checar({ data: { modulo, href, origem: "rota_direta" } }),
    staleTime: 60_000,
    retry: false,
    enabled: temSessao === true,
  });

  if (temSessao === null || (temSessao && isPending)) return <LoadingState />;
  if (!temSessao) return <LoadingState />;

  // Fail-closed: qualquer falha na verificação bloqueia a área.
  if (isError || !data?.permitido) {
    return (
      <div className="p-4">
        <PermissionDenied
          description="Você não tem permissão para abrir este módulo nesta empresa. A tentativa foi registrada na auditoria."
          requiredRole={papelSugerido}
        />
      </div>
    );
  }
  return <>{children}</>;
}
