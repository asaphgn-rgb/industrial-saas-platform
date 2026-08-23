/**
 * AppSidebarSafe — menu mínimo estático (sem queries, sem realtime, sem
 * dependência de tenant/perfil/permissões). Serve como fallback do
 * AppSidebarErrorBoundary e para usuários em estágio inicial de implantação.
 *
 * Regras:
 * - Nunca faz chamada de rede.
 * - Nunca lê tenant/perfil.
 * - Nunca acessa `.map()` sobre dados dinâmicos — todos os itens são estáticos.
 * - Ícones importados diretamente (sem lookup dinâmico).
 * - Nada de módulos operacionais (financeiro, produção, expedição) —
 *   segurança real permanece no backend/RLS; a sidebar só esconde.
 */
import { Link } from "@tanstack/react-router";
import {
  Home,
  Rocket,
  Building2,
  Users,
  FileSpreadsheet,
  GraduationCap,
  LifeBuoy,
  UserCircle,
  LogOut,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import fluxMark from "@/assets/brand/flux-mark.webp";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type SafeItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

const IMPLANTACAO_ITEMS: SafeItem[] = [
  { title: "Início", url: "/meu-dia", icon: Home },
  { title: "Central de Implantação", url: "/central-implantacao", icon: Rocket },
  { title: "Empresa", url: "/cadastros/empresa", icon: Building2 },
  { title: "Usuários e Permissões", url: "/cadastros/usuarios", icon: Users },
  { title: "Integração de Dados", url: "/implantacao/integracao-dados", icon: FileSpreadsheet },
];

const SUPORTE_ITEMS: SafeItem[] = [
  { title: "Treinamento", url: "/suporte/primeiros-passos", icon: GraduationCap },
  { title: "Status do Sistema", url: "/status-sistema", icon: LifeBuoy },
  { title: "Meu Perfil", url: "/perfil", icon: UserCircle },
];

type Props = {
  /** Motivo curto e amigável (opcional). Exibido no header do modo seguro. */
  reason?: string;
  /** Handler opcional para reexecutar o AppSidebar real após correção. */
  onRetry?: () => void;
};

export function AppSidebarSafe({ reason, onRetry }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
    } catch {
      /* noop — permitir logout mesmo sem rede */
    }
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface ring-1 ring-sidebar-primary/40">
            <img src={fluxMark} alt="" className="h-full w-full object-cover" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-sidebar-foreground">FLUX</span>
              <span className="text-[10px] text-sidebar-foreground/60">Modo implantação</span>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mx-2 mb-2 rounded-md border border-warning/30 bg-warning/10 p-2 text-[11px] leading-snug text-warning">
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold">Menu simplificado</p>
                <p className="text-warning/90">
                  {reason ??
                    "Exibindo apenas itens essenciais de implantação enquanto a empresa e as permissões não estão configuradas."}
                </p>
                {onRetry && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-1 h-6 px-2 text-[11px]"
                    onClick={onRetry}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" /> Tentar carregar menu completo
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Implantação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {IMPLANTACAO_ITEMS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Suporte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SUPORTE_ITEMS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Sair" className="text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
