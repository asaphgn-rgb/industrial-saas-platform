import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase as typed } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Factory,
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typed as any;

const cappedCount = (rows: unknown[] | null | undefined) => rows?.length ?? 0;

/**
 * Compact top-bar indicator that surfaces critical operational alerts.
 * Click opens a dropdown with per-category counts linking to the exact page.
 */
export function AlertsBellTop() {
  const { data, isLoading } = useQuery({
    queryKey: ["alerts-bell-top"],
    queryFn: async () => {
      const hoje = new Date().toISOString().slice(0, 10);
      const [ops, cr, cp, ncs] = await Promise.all([
        supabase
          .from("ordens_producao")
          .select("id")
          .in("status", ["aberta", "liberada", "em_producao", "pausada"])
          .lt("data_prazo", hoje)
          .limit(100),
        supabase
          .from("contas_receber")
          .select("id")
          .neq("status", "pago")
          .neq("status", "cancelado")
          .lt("data_vencimento", hoje)
          .limit(100),
        supabase
          .from("contas_pagar")
          .select("id")
          .neq("status", "pago")
          .neq("status", "cancelado")
          .lt("data_vencimento", hoje)
          .limit(100),
        supabase
          .from("nao_conformidades")
          .select("id")
          .in("status", ["aberta", "em_analise", "em_tratamento"])
          .limit(100),
      ]);
      return {
        ops: cappedCount(ops.data),
        cr: cappedCount(cr.data),
        cp: cappedCount(cp.data),
        ncs: cappedCount(ncs.data),
      };
    },
    refetchInterval: 5 * 60_000,
    staleTime: 60_000,
  });

  const total = (data?.ops ?? 0) + (data?.cr ?? 0) + (data?.cp ?? 0) + (data?.ncs ?? 0);
  const label = total > 99 ? "99+" : String(total);
  const tone =
    total === 0 ? "text-muted-foreground" : total >= 10 ? "text-destructive" : "text-warning";

  const rows: Array<{
    key: string;
    icon: typeof Factory;
    label: string;
    count: number;
    to: string;
  }> = [
    {
      key: "ops",
      icon: Factory,
      label: "OPs atrasadas",
      count: data?.ops ?? 0,
      to: "/producao/ordens-producao",
    },
    {
      key: "cr",
      icon: ArrowDownCircle,
      label: "A receber vencidas",
      count: data?.cr ?? 0,
      to: "/financeiro/contas-receber",
    },
    {
      key: "cp",
      icon: ArrowUpCircle,
      label: "A pagar vencidas",
      count: data?.cp ?? 0,
      to: "/financeiro/contas-pagar",
    },
    {
      key: "ncs",
      icon: ShieldAlert,
      label: "Não conformidades abertas",
      count: data?.ncs ?? 0,
      to: "/qualidade/nao-conformidades",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Central de alertas${total > 0 ? ` — ${total} pendências` : ""}`}
        >
          <AlertTriangle className={`h-5 w-5 ${tone}`} />
          {total > 0 && (
            <Badge
              variant={total >= 10 ? "destructive" : "secondary"}
              className="absolute -right-1 -top-1 h-4 min-w-[1rem] rounded-full px-1 text-[10px] leading-none"
            >
              {label}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Alertas operacionais</span>
          {total > 0 && (
            <Badge variant={total >= 10 ? "destructive" : "secondary"} className="text-[10px]">
              {label}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="px-2 py-3 text-xs text-muted-foreground">Carregando…</div>
        ) : total === 0 ? (
          <div className="px-2 py-3 text-xs text-muted-foreground">
            Tudo em dia. Nenhum alerta crítico.
          </div>
        ) : (
          rows
            .filter((r) => r.count > 0)
            .map((r) => (
              <DropdownMenuItem key={r.key} asChild>
                <Link to={r.to} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm">
                    <r.icon className="h-4 w-4 text-muted-foreground" />
                    {r.label}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {r.count}
                  </Badge>
                </Link>
              </DropdownMenuItem>
            ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/central-alertas" className="flex items-center justify-between text-sm">
            <span>Abrir Central de Alertas</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
