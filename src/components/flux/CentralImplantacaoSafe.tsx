import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Circle,
  ClipboardList,
  Database,
  Factory,
  FileCheck,
  Home,
  Landmark,
  Package,
  Plug,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  UserCheck,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "@/components/flux/LoadingState";
import { PermissionDenied } from "@/components/flux/PermissionDenied";
import { ReportErrorButton } from "@/components/flux/ReportErrorButton";

type Severity = "info" | "warning" | "error";
type DiagnosticIssue = {
  scope: string;
  message: string;
  severity: Severity;
  code?: string | null;
};

type ImplantacaoDiagnostic = {
  user: { id: string; email: string | null } | null;
  profile: { nome_completo: string | null; email: string | null; tenant_id: string | null } | null;
  tenant: {
    razao_social: string | null;
    nome_fantasia: string | null;
    cnpj: string | null;
    status?: string | null;
  } | null;
  roles: string[];
  counts: Record<string, number>;
  issues: DiagnosticIssue[];
};

const EMPTY_DIAGNOSTIC: ImplantacaoDiagnostic = {
  user: null,
  profile: null,
  tenant: null,
  roles: [],
  counts: {},
  issues: [],
};

function issue(
  scope: string,
  message: string,
  severity: Severity = "warning",
  code?: string | null,
): DiagnosticIssue {
  return { scope, message, severity, code };
}

function databaseMessage(error: { message?: string; code?: string } | null | undefined): string {
  const text = `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();
  if (/permission|rls|row-level|42501|403|not authorized|not allowed/.test(text)) {
    return "Você não possui permissão para acessar esta área. Solicite liberação ao administrador.";
  }
  return "Não foi possível carregar os dados da implantação. O erro foi registrado para análise técnica.";
}

function safeCount(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function fetchImplantacaoDiagnostic(): Promise<ImplantacaoDiagnostic> {
  const state: ImplantacaoDiagnostic = {
    ...EMPTY_DIAGNOSTIC,
    counts: {},
    issues: [],
  };

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      state.issues.push(
        issue(
          "autenticacao",
          "Sessão não encontrada. Entre novamente para continuar.",
          "error",
          userError?.message,
        ),
      );
      return state;
    }

    const user = userData.user;
    state.user = { id: user.id, email: user.email ?? null };

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("nome_completo, email, tenant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      state.issues.push(issue("perfil", databaseMessage(profileError), "error", profileError.code));
      return state;
    }

    state.profile = profile ?? null;
    const tenantId = profile?.tenant_id ?? null;

    if (!profile) {
      state.issues.push(
        issue("perfil", "Perfil não definido. Complete seu cadastro para continuar.", "warning"),
      );
      return state;
    }

    if (!tenantId) {
      state.issues.push(
        issue(
          "empresa",
          "Empresa ainda não configurada. Inicie o cadastro da empresa para continuar.",
          "warning",
        ),
      );
      return state;
    }

    const [{ data: tenant, error: tenantError }, { data: rolesData, error: rolesError }] =
      await Promise.all([
        supabase
          .from("tenants")
          .select("razao_social, nome_fantasia, cnpj, status")
          .eq("id", tenantId)
          .maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id).eq("tenant_id", tenantId),
      ]);

    if (tenantError) {
      state.issues.push(issue("tenant", databaseMessage(tenantError), "error", tenantError.code));
    }
    state.tenant = tenant ?? null;

    if (!tenant && !tenantError) {
      state.issues.push(
        issue("empresa", "Empresa não configurada ou indisponível para sua sessão.", "warning"),
      );
    }

    if (rolesError) {
      state.issues.push(issue("permissoes", databaseMessage(rolesError), "error", rolesError.code));
    }
    state.roles = (rolesData ?? []).map((r) => String(r.role)).filter(Boolean);
    if (state.roles.length === 0) {
      state.issues.push(
        issue("permissoes", "Permissões não configuradas para este usuário.", "warning"),
      );
    }

    const businessCounts = await Promise.all([
      countByTenant("profiles", tenantId, "usuarios"),
      countByTenant("clientes", tenantId, "clientes"),
      countByTenant("fornecedores", tenantId, "fornecedores"),
      countByTenant("materias_primas", tenantId, "materiais"),
      countByTenant("produtos", tenantId, "produtos"),
      countByTenant("maquinas", tenantId, "maquinas"),
      countByTenant("depositos", tenantId, "depositos"),
      countByTenant("unidades_medida", tenantId, "unidades"),
      countByTenant("centros_custo", tenantId, "centros_custo"),
      countByTenant("fichas_tecnicas", tenantId, "fichas"),
      countByTenant("ficha_roteiro", tenantId, "roteiros"),
      countByTenant("ficha_bom", tenantId, "bom"),
      countByTenant("user_connected_apps", tenantId, "conexoes"),
    ]);

    for (const item of businessCounts) {
      state.counts[item.key] = item.count;
      if (item.error) {
        state.issues.push(issue(item.key, databaseMessage(item.error), "error", item.error.code));
      }
    }

    return state;
  } catch (error) {
    state.issues.push(
      issue(
        "runtime",
        "Não foi possível carregar os dados da implantação. O erro foi registrado para análise técnica.",
        "error",
        error instanceof Error ? error.message : "unknown",
      ),
    );
    return state;
  }
}

async function countByTenant(table: string, tenantId: string, key: string) {
  const db = supabase as unknown as {
    from: (name: string) => {
      select: (
        columns: string,
        options: { count: "exact"; head: true },
      ) => {
        eq: (
          column: string,
          value: string,
        ) => Promise<{ count: number | null; error: { message: string; code?: string } | null }>;
      };
    };
  };

  const { count, error } = await db
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  return {
    key,
    count: safeCount(count),
    error: error ? { message: error.message, code: error.code } : null,
  };
}

export function CentralImplantacaoSafe() {
  const diagnosticQuery = useQuery({
    queryKey: ["central-implantacao", "safe-diagnostic"],
    queryFn: fetchImplantacaoDiagnostic,
    retry: false,
    staleTime: 30_000,
    throwOnError: false,
  });

  const diagnostic = diagnosticQuery.data ?? EMPTY_DIAGNOSTIC;
  const tenantName =
    diagnostic.tenant?.nome_fantasia ||
    diagnostic.tenant?.razao_social ||
    "Empresa não configurada";
  const profileName =
    diagnostic.profile?.nome_completo ||
    diagnostic.profile?.email ||
    diagnostic.user?.email ||
    "Perfil não definido";
  const rolesLabel =
    diagnostic.roles.length > 0 ? diagnostic.roles.join(", ") : "Permissões não configuradas";

  const checklist = useMemo(
    () => [
      {
        id: "empresa",
        title: "Empresa",
        description: "Dados jurídicos, contato e identificação da unidade industrial.",
        icon: Building2,
        done: !!diagnostic.tenant,
        enabled: true,
        metric: tenantName,
        to: "/cadastros/empresa" as const,
      },
      {
        id: "usuario",
        title: "Usuário",
        description: "Perfil pessoal identificado e vinculado à sessão autenticada.",
        icon: UserCheck,
        done: !!diagnostic.profile,
        enabled: true,
        metric: profileName,
        to: "/perfil" as const,
      },
      {
        id: "permissoes",
        title: "Permissões",
        description: "Papéis por empresa para manter acesso correto aos módulos.",
        icon: ShieldCheck,
        done: diagnostic.roles.length > 0,
        enabled: !!diagnostic.profile?.tenant_id,
        metric: rolesLabel,
        to: "/cadastros/usuarios" as const,
      },
      {
        id: "usuarios",
        title: "Equipe",
        description: "Usuários operacionais e administrativos vinculados à empresa.",
        icon: Users,
        done: (diagnostic.counts.usuarios || 0) > 1,
        enabled: !!diagnostic.tenant,
        metric: `${diagnostic.counts.usuarios || 0} usuário(s)`,
        to: "/cadastros/usuarios" as const,
      },
      {
        id: "estrutura",
        title: "Estrutura industrial",
        description: "Máquinas e cadastros básicos para produção.",
        icon: Factory,
        done: (diagnostic.counts.maquinas || 0) > 0,
        enabled: !!diagnostic.tenant,
        metric: `${diagnostic.counts.maquinas || 0} máquina(s)`,
        to: "/cadastros/maquinas" as const,
      },
      {
        id: "comercial",
        title: "Clientes e fornecedores",
        description: "Base comercial mínima para pedidos, compras e rastreabilidade.",
        icon: ShoppingCart,
        done: (diagnostic.counts.clientes || 0) > 0 && (diagnostic.counts.fornecedores || 0) > 0,
        enabled: !!diagnostic.tenant,
        metric: `${diagnostic.counts.clientes || 0} cliente(s) · ${diagnostic.counts.fornecedores || 0} fornecedor(es)`,
        to: "/cadastros/clientes" as const,
      },
      {
        id: "materiais",
        title: "Materiais e produtos",
        description: "Matérias-primas, produtos e cadastros para engenharia/PCP.",
        icon: Package,
        done: (diagnostic.counts.materiais || 0) > 0 && (diagnostic.counts.produtos || 0) > 0,
        enabled: !!diagnostic.tenant,
        metric: `${diagnostic.counts.materiais || 0} material(is) · ${diagnostic.counts.produtos || 0} produto(s)`,
        to: "/cadastros/materias-primas" as const,
      },
      {
        id: "unidades",
        title: "Unidades de medida",
        description: "Padroniza KG, MIL, M, M², UN antes de cadastros técnicos.",
        icon: Ruler,
        done: (diagnostic.counts.unidades || 0) > 0,
        enabled: !!diagnostic.tenant,
        metric: `${diagnostic.counts.unidades || 0} unidade(s)`,
        to: "/cadastros/unidades" as const,
      },
      {
        id: "depositos",
        title: "Depósitos",
        description: "Locais físicos de estoque para saldos, lotes e movimentações.",
        icon: Warehouse,
        done: (diagnostic.counts.depositos || 0) > 0,
        enabled: !!diagnostic.tenant,
        metric: `${diagnostic.counts.depositos || 0} depósito(s)`,
        to: "/cadastros/depositos" as const,
      },
      {
        id: "centros_custo",
        title: "Centros de custo",
        description: "Base contábil para apropriação de despesas e custos de OP.",
        icon: Landmark,
        done: (diagnostic.counts.centros_custo || 0) > 0,
        enabled: !!diagnostic.tenant,
        metric: `${diagnostic.counts.centros_custo || 0} centro(s)`,
        to: "/cadastros/centros-custo" as const,
      },
      {
        id: "fichas",
        title: "Fichas técnicas",
        description: "Especificações de produto que alimentam BOM, roteiro e qualidade.",
        icon: FileCheck,
        done: (diagnostic.counts.fichas || 0) > 0,
        enabled: (diagnostic.counts.produtos || 0) > 0,
        metric: `${diagnostic.counts.fichas || 0} ficha(s)`,
        to: "/engenharia/fichas-tecnicas" as const,
      },
      {
        id: "bom",
        title: "BOM (lista de materiais)",
        description: "Consumo previsto por produto — base para MRP e custo padrão.",
        icon: ClipboardList,
        done: (diagnostic.counts.bom || 0) > 0,
        enabled: (diagnostic.counts.fichas || 0) > 0,
        metric: `${diagnostic.counts.bom || 0} item(ns) de BOM`,
        to: "/engenharia/bom" as const,
      },
      {
        id: "roteiros",
        title: "Roteiros de produção",
        description: "Sequência de operações por máquina — habilita PCP e apontamento.",
        icon: Wrench,
        done: (diagnostic.counts.roteiros || 0) > 0,
        enabled: (diagnostic.counts.fichas || 0) > 0,
        metric: `${diagnostic.counts.roteiros || 0} etapa(s) de roteiro`,
        to: "/engenharia/roteiro" as const,
      },
      {
        id: "conexoes",
        title: "Conexões externas",
        description: "Calendário, e-mail, tarefas e mensageria autorizados para produtividade.",
        icon: Plug,
        done: (diagnostic.counts.conexoes || 0) > 0,
        enabled: !!diagnostic.tenant,
        metric: `${diagnostic.counts.conexoes || 0} conexão(ões) ativa(s)`,
        to: "/meu-dia/integracoes" as const,
      },
    ],
    [diagnostic, profileName, rolesLabel, tenantName],
  );

  const done = checklist.filter((item) => item.done).length;
  const progress = Math.round((done / checklist.length) * 100);
  const hasPermissionIssue = diagnostic.issues.some(
    (i) => i.scope === "permissoes" || /permissão|permiss/.test(i.message.toLowerCase()),
  );
  const hasDatabaseIssue = diagnostic.issues.some((i) => i.severity === "error");

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Implantação</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Central de Implantação FLUX
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Priorize os cadastros que destravam operação, produção, custos e rastreabilidade.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => void diagnosticQuery.refetch()}
              disabled={diagnosticQuery.isFetching}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${diagnosticQuery.isFetching ? "animate-spin" : ""}`}
              />
              Atualizar status
            </Button>
            <Button asChild variant="outline">
              <Link to="/meu-dia/integracoes">
                <Plug className="mr-2 h-4 w-4" /> Assistente de conexões
              </Link>
            </Button>
            <Button asChild>
              <Link to="/painel">
                <Home className="mr-2 h-4 w-4" /> Ir para o painel
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-6 p-6">
        {diagnosticQuery.isLoading && <CentralLoading />}

        {!diagnosticQuery.isLoading && diagnostic.issues.length > 0 && (
          <Alert variant={hasDatabaseIssue ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{hasPermissionIssue ? "Acesso limitado" : "Ação necessária"}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{primaryMessage(diagnostic.issues)}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <ReportErrorButton defaultModulo="Central de Implantação" />
                <Button variant="outline" size="sm" onClick={() => void diagnosticQuery.refetch()}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!diagnosticQuery.isLoading && hasPermissionIssue && (
          <PermissionDenied
            title="Permissões incompletas"
            description="Seu usuário está autenticado, mas ainda não tem papéis suficientes para concluir a implantação. Peça a um administrador para revisar seu acesso."
          />
        )}

        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatusCard
            title="Empresa"
            value={tenantName}
            status={diagnostic.tenant ? "Configurada" : "Pendente"}
            ok={!!diagnostic.tenant}
          />
          <StatusCard
            title="Usuário"
            value={profileName}
            status={diagnostic.user ? "Autenticado" : "Sem sessão"}
            ok={!!diagnostic.user}
          />
          <StatusCard
            title="Vínculo"
            value={diagnostic.profile?.tenant_id ? "Empresa vinculada" : "Empresa ausente"}
            status={diagnostic.profile?.tenant_id ? "Ativo" : "Pendente"}
            ok={!!diagnostic.profile?.tenant_id}
          />
          <StatusCard
            title="Permissões"
            value={rolesLabel}
            status={diagnostic.roles.length ? "Ativas" : "Pendentes"}
            ok={diagnostic.roles.length > 0}
          />
        </section>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-center">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Status da implantação</p>
                <h2 className="truncate text-2xl font-bold tracking-tight">
                  {implantacaoStatus(progress)}
                </h2>
              </div>
              <div className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate">
                    {done} de {checklist.length} itens concluídos
                  </span>
                  <strong className="shrink-0 tabular-nums">{progress}%</strong>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              Checklist inicial
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {checklist.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className={item.done ? "border-success/30 bg-success/5" : "border-border"}
                >
                  <CardHeader className="flex-row items-start gap-3 space-y-0 pb-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${item.done ? "bg-success text-success-foreground" : item.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {item.done ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <Badge variant="outline" className="h-5 text-[10px]">
                          {item.done
                            ? "Concluído"
                            : item.enabled
                              ? "Pendente"
                              : "Aguardando empresa"}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      {item.metric || "Pendente"}
                    </span>
                    {item.enabled ? (
                      <Button asChild size="sm" variant={item.done ? "outline" : "default"}>
                        <Link to={item.to}>
                          {item.done ? "Revisar" : "Abrir"}{" "}
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Circle className="h-3 w-3" /> Configure a empresa primeiro
                      </span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </section>
    </div>
  );
}

function primaryMessage(issues: DiagnosticIssue[]): string {
  const first = issues[0];
  if (!first) return "Dados carregados com segurança.";
  if (issues.some((i) => i.scope === "empresa")) {
    return "Empresa ainda não configurada. Inicie o cadastro da empresa para continuar.";
  }
  if (issues.some((i) => /permissão|permiss/.test(i.message.toLowerCase()))) {
    return "Você não possui permissão para acessar esta área. Solicite liberação ao administrador.";
  }
  return (
    first.message ||
    "Não foi possível carregar os dados da implantação. O erro foi registrado para análise técnica."
  );
}

function implantacaoStatus(progress: number): string {
  if (progress >= 90) return "Operação pronta";
  if (progress >= 60) return "Implantação avançada";
  if (progress >= 30) return "Implantação em andamento";
  return "Início da implantação";
}

function StatusCard({
  title,
  value,
  status,
  ok,
}: {
  title: string;
  value: string;
  status: string;
  ok: boolean;
}) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="truncate text-base" title={value}>
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge
          variant="outline"
          className={
            ok
              ? "border-success/40 bg-success/10 text-success"
              : "border-warning/40 bg-warning/10 text-warning"
          }
        >
          {status}
        </Badge>
      </CardContent>
    </Card>
  );
}

function CentralLoading() {
  return <LoadingState variant="page" className="py-2" />;
}
