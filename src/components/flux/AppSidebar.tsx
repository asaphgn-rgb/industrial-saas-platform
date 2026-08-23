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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState, useMemo } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminAccess } from "@/lib/admin-access.functions";
import { NotificacoesBell } from "@/components/flux/NotificacoesBell";
import { RecentRoutes } from "@/components/flux/RecentRoutes";
import { FavoritesSidebar } from "@/components/flux/Favorites";
import { RecentsTracker } from "@/components/flux/Recents";

import { InstallPrompt } from "@/components/flux/InstallPrompt";
import { TenantSwitcher } from "@/components/flux/TenantSwitcher";
import { WidgetErrorBoundary } from "@/components/flux/WidgetErrorBoundary";
import fluxMark from "@/assets/brand/flux-mark.webp";
import {
  Home,
  Gauge,
  Rocket,
  ClipboardList,
  Users,
  Building2,
  ShoppingCart,
  Wrench,
  Boxes,
  Package,
  Factory,
  ShieldCheck,
  Truck,
  DollarSign,
  BarChart3,
  Brain,
  FileText,
  GraduationCap,
  Settings,
  ChevronRight,
  Circle,
  AlertTriangle,
  CheckSquare,
  FileSpreadsheet,
  Search,
} from "lucide-react";

type NavChild = {
  title: string;
  url?: string;
  enabled?: boolean;
  search?: Record<string, string>;
};
type NavGroup = {
  label: string;
  items: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    url?: string;
    enabled?: boolean;
    children?: NavChild[];
  }[];
};

export const NAV: NavGroup[] = [
  {
    label: "Painel",
    items: [
      { title: "Meu Dia", icon: Home, url: "/meu-dia", enabled: true },
      { title: "Visão 360°", icon: Gauge, url: "/visao-360", enabled: true },
      {
        title: "Alertas & Pendências",
        icon: AlertTriangle,
        children: [
          { title: "Central de Alertas", url: "/central-alertas", enabled: true },
          { title: "Alertas Críticos", url: "/alertas/criticos", enabled: true },
          { title: "Minhas Pendências", url: "/pendencias", enabled: true },
          { title: "Minhas Tarefas", url: "/tarefas", enabled: true },
          { title: "Notificações", url: "/notificacoes", enabled: true },
        ],
      },
      {
        title: "Painéis & Relatórios",
        icon: FileSpreadsheet,
        children: [
        { title: "Central de Relatórios", url: "/relatorios", enabled: true },
          { title: "Executive Intelligence Hub", url: "/bi/executivo", enabled: true },
          { title: "Reunião A4 — Executivo", url: "/relatorios/reuniao", search: { dep: "executivo" }, enabled: true },
          { title: "Reunião A4 — Comercial", url: "/relatorios/reuniao", search: { dep: "comercial" }, enabled: true },
          { title: "Reunião A4 — Produção/PCP", url: "/relatorios/reuniao", search: { dep: "producao" }, enabled: true },
          { title: "Reunião A4 — Qualidade", url: "/relatorios/reuniao", search: { dep: "qualidade" }, enabled: true },
          { title: "Reunião A4 — Manutenção", url: "/relatorios/reuniao", search: { dep: "manutencao" }, enabled: true },
          { title: "Reunião A4 — Estoque", url: "/relatorios/reuniao", search: { dep: "estoque" }, enabled: true },
          { title: "Reunião A4 — Suprimentos", url: "/relatorios/reuniao", search: { dep: "suprimentos" }, enabled: true },
          { title: "Reunião A4 — Financeiro", url: "/relatorios/reuniao", search: { dep: "financeiro" }, enabled: true },
          { title: "Reunião A4 — Expedição", url: "/relatorios/reuniao", search: { dep: "expedicao" }, enabled: true },
          { title: "Reunião A4 — RH", url: "/relatorios/reuniao", search: { dep: "rh" }, enabled: true },
          { title: "Estoques & Compras Inteligentes", url: "/estoque/gestao-integrada", enabled: true },
          { title: "Operacionais", url: "/relatorios/operacionais", enabled: true },
          { title: "Gerenciais", url: "/relatorios/gerenciais", enabled: true },
          { title: "Executivos", url: "/relatorios/executivos", enabled: true },
          { title: "Industrial", url: "/relatorios/industrial", enabled: true },
        ],
      },

    ],
  },
  {
    label: "Comercial",
    items: [
      {
        title: "Vendas & CRM",
        icon: ShoppingCart,
        children: [
          { title: "Painel Comercial", url: "/comercial/painel", enabled: true },
          { title: "CRM", url: "/comercial/crm", enabled: true },
          { title: "Orçamentos", url: "/comercial/orcamentos", enabled: true },
          { title: "Pedidos de Venda", url: "/comercial/pedidos-venda", enabled: true },
          { title: "Carteira de Pedidos", url: "/comercial/carteira", enabled: true },
          { title: "Metas de Vendas", url: "/comercial/metas-vendas", enabled: true },
          { title: "Curva ABC", url: "/comercial/curva-abc", enabled: true },
          { title: "Calculadora de Preço", url: "/comercial/precificacao", enabled: true },
        ],
      },
    ],
  },
  {
    label: "Operações",
    items: [
      {
        title: "Engenharia & PCP",
        icon: Wrench,
        children: [
          { title: "Fichas Técnicas", url: "/engenharia/fichas-tecnicas", enabled: true },
          { title: "BOM / Estrutura", url: "/engenharia/bom", enabled: true },
          { title: "Roteiro de Produção", url: "/engenharia/roteiro", enabled: true },
          { title: "Simulador de Preço", url: "/engenharia/simulador-preco", enabled: true },
          { title: "PCP", url: "/planejamento/pcp", enabled: true },
          { title: "PCP Inteligente", url: "/planejamento/pcp-inteligente", enabled: true },
          { title: "APS Visual (Gantt)", url: "/planejamento/aps-visual", enabled: true },
          { title: "MRP", url: "/planejamento/mrp", enabled: true },
          { title: "Capacidade Produtiva", url: "/planejamento/capacidade", enabled: true },
        ],
      },
      {
        title: "Suprimentos & Estoque",
        icon: Boxes,
        children: [
          { title: "Painel de Suprimentos", url: "/suprimentos/painel", enabled: true },
          { title: "Sugestão de Compra", url: "/suprimentos/sugestao-compra", enabled: true },
          {
            title: "Solicitações de Compra",
            url: "/suprimentos/solicitacoes-compra",
            enabled: true,
          },
          { title: "Cotações", url: "/suprimentos/cotacoes", enabled: true },
          { title: "Pedidos de Compra", url: "/suprimentos/pedidos-compra", enabled: true },
          { title: "Recebimentos", url: "/suprimentos/recebimentos", enabled: true },
          { title: "Gestão Integrada de Estoques", url: "/estoque/gestao-integrada", enabled: true },
          { title: "Aprovações, Políticas & Cotações", url: "/estoque/compras-inteligentes", enabled: true },
          { title: "Painel de Estoque", url: "/estoque/painel", enabled: true },
          { title: "Saldos", url: "/estoque/saldos", enabled: true },
          { title: "Movimentações", url: "/estoque/movimentacoes", enabled: true },
          { title: "Lotes", url: "/estoque/lotes", enabled: true },
          { title: "Inventário", url: "/estoque/inventario", enabled: true },
        ],
      },
      {
        title: "Produção",
        icon: Factory,
        children: [
          { title: "Painel de Produção", url: "/producao/painel", enabled: true },
          { title: "Kanban de OPs", url: "/producao/kanban", enabled: true },
          { title: "Ordens de Produção", url: "/producao/ordens-producao", enabled: true },
          { title: "Universal MES Station", url: "/producao/chao-de-fabrica", enabled: true },
          { title: "OEE por Máquina", url: "/producao/oee", enabled: true },
          { title: "Custos por OP", url: "/producao/custos", enabled: true },
          { title: "Apontamento Offline", url: "/producao/apontamento-offline", enabled: true },
          { title: "Extrusão", url: "/producao/extrusao", enabled: true },
          { title: "Impressão Flexográfica", url: "/producao/impressao", enabled: true },
          { title: "Laminação", url: "/producao/laminacao", enabled: true },
          { title: "Rebobinamento", url: "/producao/rebobinamento", enabled: true },
          { title: "Corte e Solda", url: "/producao/corte-solda", enabled: true },
          { title: "Sacoleira / Blocadeira", url: "/producao/sacoleira", enabled: true },
          { title: "Apoio à Produção", url: "/producao/apoio", enabled: true },

        ],
      },
    ],
  },
  {
    label: "Manutenção",
    items: [
      {
        title: "Manutenção",
        icon: Wrench,
        children: [
          { title: "Central de Manutenção", url: "/manutencao", enabled: true },
          { title: "Painel de Manutenção", url: "/manutencao/painel", enabled: true },
          { title: "Painel Executivo", url: "/manutencao/executivo", enabled: true },
          { title: "Ordens de Manutenção", url: "/manutencao/ordens-manutencao", enabled: true },
          { title: "Paradas de Máquina", url: "/manutencao/paradas", enabled: true },
          {
            title: "Preventiva / Corretiva",
            url: "/manutencao/preventiva-corretiva",
            enabled: true,
          },
          { title: "PCM Preventivo", url: "/manutencao/preventivo", enabled: true },
          { title: "Preditiva (MTBF/MTTR)", url: "/manutencao/preditiva", enabled: true },
          { title: "TPM (Manut. Autônoma)", url: "/manutencao/tpm", enabled: true },
          { title: "Reconciliação TPM", url: "/manutencao/tpm-reconciliacao", enabled: true },
        ],
      },
    ],
  },
  {
    label: "Expedição",
    items: [
      {
        title: "Expedição",
        icon: Truck,
        children: [
          { title: "Central de Expedição", url: "/expedicao", enabled: true },
          { title: "Painel de Expedição", url: "/expedicao/painel", enabled: true },
          { title: "Separação (WMS)", url: "/expedicao/separacao", enabled: true },
          { title: "Romaneios de Carga", url: "/expedicao/romaneios", enabled: true },
          { title: "Etiquetas de Volume (ZPL)", url: "/expedicao/etiquetas-zpl", enabled: true },
          { title: "Entregas e Rastreio", url: "/expedicao/entregas", enabled: true },
        ],
      },
    ],
  },
  {
    label: "Qualidade",
    items: [
      {
        title: "Qualidade",
        icon: ShieldCheck,
        children: [
          { title: "Painel da Qualidade", url: "/qualidade/painel", enabled: true },
          { title: "Inspeções", url: "/qualidade/inspecoes", enabled: true },
          { title: "Não Conformidades", url: "/qualidade/nao-conformidades", enabled: true },
          { title: "Rastreabilidade", url: "/qualidade/rastreabilidade", enabled: true },
          { title: "Pareto de Refugo", url: "/qualidade/pareto-refugo", enabled: true },
          { title: "Processos & POPs", url: "/qualidade/processos", enabled: true },
        ],
      },
    ],
  },
  {
    label: "Financeiro",
    items: [
      {
        title: "Financeiro",
        icon: DollarSign,
        children: [
          { title: "Painel Financeiro", url: "/financeiro/painel", enabled: true },
          { title: "Contas a Receber", url: "/financeiro/contas-receber", enabled: true },
          { title: "Contas a Pagar", url: "/financeiro/contas-pagar", enabled: true },
          {
            title: "Conciliação Bancária (OFX)",
            url: "/financeiro/conciliacao-ofx",
            enabled: true,
          },
          { title: "CNAB 240 (Cobrança)", url: "/financeiro/cnab", enabled: true },
          { title: "CNAB 240 (Pagamentos)", url: "/financeiro/cnab-pagamentos", enabled: true },
          { title: "SPED Contábil (ECD)", url: "/financeiro/sped-contabil", enabled: true },
          { title: "Fluxo de Caixa", url: "/financeiro/fluxo-caixa", enabled: true },
          { title: "Fluxo Projetado", url: "/financeiro/fluxo-projetado", enabled: true },
          { title: "DRE", url: "/financeiro/dre", enabled: true },
          { title: "Custo por Processo", url: "/financeiro/custo-processos", enabled: true },
          {
            title: "Precificação Automática",
            url: "/financeiro/precificacao-automatica",
            enabled: true,
          },

        ],
      },
      {
        title: "Contabilidade",
        icon: BarChart3,
        children: [
          { title: "Plano de Contas", url: "/contabilidade/plano-contas", enabled: true },
          { title: "Lançamentos Contábeis", url: "/contabilidade/lancamentos", enabled: true },
          { title: "DRE", url: "/financeiro/dre", enabled: true },
        ],
      },
      {
        title: "Custos & Fiscal",
        icon: BarChart3,
        children: [
          { title: "Custo por OP", url: "/custos/op", enabled: true },
          { title: "Custo por Produto", url: "/custos/produto", enabled: true },
          { title: "Central Fiscal", url: "/fiscal", enabled: true },
          { title: "NF-e Emitidas/Recebidas", url: "/fiscal/notas", enabled: true },
          { title: "Apurações Fiscais", url: "/fiscal/apuracoes", enabled: true },
          { title: "NF-e (homologação)", url: "/fiscal/nfe-homologacao", enabled: true },
          { title: "Bloco K (SPED)", url: "/fiscal/bloco-k", enabled: true },
        ],
      },
      {
        title: "Orçamento Gerencial",
        icon: DollarSign,
        children: [{ title: "Orçado vs. Realizado", url: "/orcamento/gerencial", enabled: true }],
      },
    ],
  },
  {
    label: "Administração",
    items: [
      {
        title: "RH",
        icon: Users,
        children: [
          { title: "Painel RH", url: "/rh/painel", enabled: true },
          { title: "Colaboradores", url: "/cadastros/colaboradores", enabled: true },
          { title: "Cargos e Salários", url: "/rh/cargos", enabled: true },
          { title: "Histórico de Cargos", url: "/rh/historico-cargos", enabled: true },
          { title: "Desempenho", url: "/rh/desempenho", enabled: true },
          { title: "Metas", url: "/rh/metas", enabled: true },
          { title: "Feedbacks 1:1", url: "/rh/feedbacks", enabled: true },
          { title: "Treinamentos", url: "/rh/treinamentos", enabled: true },
        ],
      },
      {
        title: "Folha & Ponto",
        icon: Users,
        children: [
          { title: "Painel de Folha", url: "/folha/painel", enabled: true },
          { title: "Holerites", url: "/folha/holerites", enabled: true },
          { title: "Férias", url: "/folha/ferias", enabled: true },
          { title: "Rescisões", url: "/folha/rescisoes", enabled: true },
          { title: "Registros de Ponto", url: "/ponto/registros", enabled: true },
          { title: "Escalas", url: "/ponto/escalas", enabled: true },
          { title: "Banco de Horas", url: "/ponto/banco-horas", enabled: true },
        ],
      },
      {
        title: "Projetos & Timesheet",
        icon: BarChart3,
        children: [
          { title: "Painel de Projetos", url: "/projetos-gerenciais/painel", enabled: true },
          { title: "Fases & Tarefas", url: "/projetos-gerenciais/fases", enabled: true },
          { title: "Alocações", url: "/projetos-gerenciais/alocacoes", enabled: true },
          { title: "Timesheet", url: "/projetos-gerenciais/timesheet", enabled: true },
        ],
      },

      {
        title: "Cadastros",
        icon: Building2,
        children: [
          { title: "Central de Cadastros", url: "/cadastros", enabled: true },
          { title: "Empresa", url: "/cadastros/empresa", enabled: true },

          { title: "Usuários & Permissões", url: "/cadastros/usuarios", enabled: true },
          { title: "Clientes", url: "/cadastros/clientes", enabled: true },
          { title: "Fornecedores", url: "/cadastros/fornecedores", enabled: true },
          { title: "Produtos", url: "/cadastros/produtos", enabled: true },
          { title: "Matérias-primas", url: "/cadastros/materias-primas", enabled: true },
          { title: "Máquinas", url: "/cadastros/maquinas", enabled: true },
          { title: "Depósitos", url: "/cadastros/depositos", enabled: true },
          { title: "Centros de Custo", url: "/cadastros/centros-custo", enabled: true },
          { title: "Unidades de Medida", url: "/cadastros/unidades", enabled: true },
        ],
      },
      {
        title: "Indicadores & IA",
        icon: Brain,
        children: [
          { title: "Indicadores — Diretoria", url: "/indicadores/diretoria", enabled: true },
          { title: "Indicadores — Produção", url: "/indicadores/producao", enabled: true },
          { title: "Indicadores — Estoque", url: "/indicadores/estoque", enabled: true },
          { title: "Indicadores — Máquinas", url: "/indicadores/maquinas", enabled: true },
          { title: "Faturamento Mensal", url: "/indicadores/faturamento-mensal", enabled: true },
          { title: "Top Clientes", url: "/indicadores/top-clientes", enabled: true },
          { title: "IA Consultiva", url: "/ia/consultiva", enabled: true },
          { title: "Alertas Inteligentes", url: "/ia/alertas", enabled: true },
          { title: "Parecer Executivo", url: "/ia/parecer-executivo", enabled: true },
          { title: "Consumo de IA", url: "/ia/consumo", enabled: true },
        ],
      },
      {
        title: "Sistema",
        icon: Settings,
        children: [
          { title: "Central de Implantação", url: "/central-implantacao", enabled: true },
          {
            title: "Central de Arquivos (Audit)",
            url: "/admin/arquivos",
            enabled: true,
          },
          { title: "Integração de Dados", url: "/implantacao/integracao-dados", enabled: true },
          {
            title: "Ponto de Apoio à Integração",
            url: "/implantacao/ponto-apoio",
            enabled: true,
          },
          { title: "Configurações", url: "/admin/configuracoes", enabled: true },
          { title: "Permissões", url: "/admin/permissoes", enabled: true },
          { title: "Segurança Audit", url: "/admin/seguranca", enabled: true },
          { title: "MFA (2FA)", url: "/admin/mfa", enabled: true },
          { title: "Saúde de Dados", url: "/admin/saude-dados", enabled: true },
          { title: "Cobertura Demo", url: "/admin/cobertura-demo", enabled: true },
          { title: "Kit Comercial (vídeos)", url: "/admin/kit-comercial", enabled: true },
          { title: "Relatórios Agendados", url: "/admin/relatorios-agendados", enabled: true },
          { title: "Integridade de Rotas", url: "/admin/integridade-rotas", enabled: true },
          { title: "Diagnóstico assistido", url: "/admin/diagnostico", enabled: true },
          { title: "Auditoria & Logs", url: "/admin/auditoria", enabled: true },
          { title: "Prontidão Comercial 360°", url: "/admin/prontidao-comercial", enabled: true },
          { title: "Analytics da Landing", url: "/admin/landing-analytics", enabled: true },
          { title: "API Pública", url: "/admin/api-publica", enabled: true },
          { title: "API Keys", url: "/admin/api-keys", enabled: true },
        ],
      },

      {
        title: "Treinamento & Suporte",
        icon: GraduationCap,
        children: [
          { title: "FLUX Academy AI", url: "/academy", enabled: true },
          { title: "Minha Trilha", url: "/academy/minha-trilha", enabled: true },
          { title: "Cursos", url: "/academy/cursos", enabled: true },
          { title: "Biblioteca Didática", url: "/academy/biblioteca", enabled: true },
          { title: "Gestão Didática", url: "/academy/gestao-didatica", enabled: true },
          
          { title: "Certificados", url: "/academy/certificados", enabled: true },
          { title: "Primeiros Passos", url: "/suporte/primeiros-passos", enabled: true },
          { title: "Manuais por Módulo", url: "/manuais", enabled: true },
          { title: "Estudo (Biblioteca)", url: "/estudo", enabled: true },
          { title: "Cálculos Técnicos", url: "/calculos-tecnicos", enabled: true },
          { title: "Trilhas por Perfil", url: "/suporte/trilhas", enabled: true },
          { title: "Base de Conhecimento", url: "/suporte/base-conhecimento", enabled: true },
        ],
      },
    ],
  },
];

const DefaultMenuIcon = Circle;

function safeChildren(children: unknown): NavChild[] {
  if (!Array.isArray(children)) return [];
  return children
    .filter((c): c is NavChild => !!c && typeof (c as NavChild).title === "string")
    .map((c) => ({
      title: c.title || "Item sem nome",
      url: typeof c.url === "string" ? c.url : undefined,
      // Preserva os search params (ex.: ?dep=qualidade) — sem isso todos os
      // relatórios A4 apontariam para a mesma página sem seleção.
      search: c.search && typeof c.search === "object" ? c.search : undefined,
      enabled: c.enabled !== false,
    }));
}

function safeGroups(nav: unknown): NavGroup[] {
  if (!Array.isArray(nav)) return [];
  return nav
    .filter((g): g is NavGroup => !!g && Array.isArray((g as NavGroup).items))
    .map((g) => ({
      label: g.label || "Menu",
      items: g.items
        .filter((i) => !!i && typeof i.title === "string")
        .map((i) => ({
          title: i.title || "Item sem nome",
          icon: (i.icon as NavGroup["items"][number]["icon"]) || DefaultMenuIcon,
          url: typeof i.url === "string" ? i.url : undefined,
          enabled: i.enabled !== false,
          children: i.children ? safeChildren(i.children) : undefined,
        })),
    }));
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const searchAtual = useRouterState({
    select: (r) => r.location.search as Record<string, unknown>,
  });

  const { data: adminInfo } = useQuery({
    queryKey: ["admin-access"],
    queryFn: () => getAdminAccess(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const groups = useMemo(() => {
    const rawGroups = safeGroups(NAV);
    
    // Bloqueia o tópico "Administração" para quem não for admin ou super_admin (implantador)
    return rawGroups.map(group => {
      if (group.label === "Administração" && !adminInfo?.isAdmin && !adminInfo?.isSuperAdmin) {
        return {
          ...group,
          items: group.items.map(item => {
            // Se for o item "Sistema", bloqueia explicitamente
            if (item.title === "Sistema") {
              return { ...item, enabled: false };
            }
            return item;
          })
        };
      }
      return group;
    });
  }, [adminInfo]);

  const [environmentLabel, setEnvironmentLabel] = useState("Produção");

  useEffect(() => {
    setEnvironmentLabel(window.location.hostname.includes("preview") ? "Preview" : "Produção");
  }, []);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader
        role="banner"
        aria-label="Cabeçalho do sistema"
        className="border-b border-sidebar-border/60 gap-3"
      >
        <div className="flex items-center gap-3 px-2 pt-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface ring-1 ring-sidebar-primary/40 shadow-[0_0_20px_-4px_var(--sidebar-primary)]"
            aria-hidden
          >
            <img src={fluxMark} alt="" className="h-full w-full object-cover" />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-base font-bold tracking-tight text-sidebar-foreground">
                FLUX
              </span>
              <span className="truncate text-[10px] uppercase tracking-[0.15em] font-semibold text-sidebar-foreground/90">
                Gestão Industrial
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="mx-2 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/50 px-3 py-2">
            <div className="mb-0.5 flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/75">
                Ambiente
              </span>
              <span className="rounded bg-sidebar-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sidebar-primary-foreground">
                {environmentLabel}
              </span>
            </div>
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              Embalagens Flexíveis
            </p>
          </div>
        )}

        {!collapsed && <TenantSwitcher collapsed={collapsed} />}

        {!collapsed && (
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
                );
              }
            }}
            className="group mx-2 flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/40 px-3 py-2 text-left transition-colors hover:border-sidebar-primary/50 hover:bg-sidebar-accent/70"
          >
            <Search className="h-3.5 w-3.5 text-sidebar-foreground/70 group-hover:text-sidebar-primary" />
            <span className="flex-1 text-xs text-sidebar-foreground/70">Busca rápida…</span>
            <kbd className="rounded border border-sidebar-border/70 bg-sidebar px-1 py-0.5 font-mono text-[9px] text-sidebar-foreground/75">
              ⌘K
            </kbd>
          </button>
        )}
      </SidebarHeader>

      <SidebarContent role="navigation" aria-label="Navegação principal">
        <WidgetErrorBoundary name="FavoritesSidebar" compact>
          <FavoritesSidebar />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary name="RecentsTracker" compact>
          <RecentsTracker />
        </WidgetErrorBoundary>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon || DefaultMenuIcon;
                  const children = item.children ?? [];
                  if (children.length > 0) {
                    const anyActive = children.some((c) => c.url && pathname.startsWith(c.url));
                    return (
                      <SidebarMenuItem key={item.title}>
                        <Collapsible defaultOpen={anyActive} className="group/collapsible">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={anyActive}
                              aria-expanded={anyActive}
                              className="data-[active=true]:bg-sidebar-accent/60 data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold data-[active=true]:[&_svg:first-child]:text-sidebar-primary"
                            >
                              <Icon />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {children.map((child) => (
                                <SidebarMenuSubItem key={child.title}>
                                  {child.enabled && child.url ? (
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={
                                        pathname === child.url &&
                                        (!child.search ||
                                          Object.entries(child.search).every(
                                            ([k, v]) => String(searchAtual?.[k] ?? "") === v,
                                          ))
                                      }
                                    >
                                      <Link to={child.url} search={child.search as never}>
                                        <Circle className="fill-current" />
                                        <span>{child.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  ) : (
                                    <SidebarMenuSubButton
                                      asChild
                                      className="cursor-not-allowed opacity-50"
                                    >
                                      <span title="Em construção — próximas fases">
                                        <Circle />
                                        <span>{child.title}</span>
                                        <span className="ml-auto shrink-0 rounded bg-sidebar-accent/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                                          em breve
                                        </span>
                                      </span>
                                    </SidebarMenuSubButton>
                                  )}
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                    );
                  }

                  const enabled = item.enabled && item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      {enabled ? (
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={pathname === item.url}
                          className="relative overflow-hidden transition-colors data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-sidebar-primary data-[active=true]:before:shadow-[0_0_8px_var(--sidebar-primary)] data-[active=true]:[&_svg]:text-sidebar-primary"
                        >
                          <Link to={item.url!}>
                            <Icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          tooltip={`${item.title} (em breve)`}
                          aria-disabled="true"
                          data-disabled=""
                          onClick={(e) => e.preventDefault()}
                          className="pointer-events-none cursor-not-allowed opacity-50"
                        >
                          <Icon />
                          <span>{item.title}</span>
                          <span className="ml-auto text-[9px] uppercase tracking-wider">
                            em breve
                          </span>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <WidgetErrorBoundary name="RecentRoutes" compact>
          <RecentRoutes />
        </WidgetErrorBoundary>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && (
          <>
            <div className="px-1 pt-1">
              <WidgetErrorBoundary name="NotificacoesBell" compact>
                <NotificacoesBell />
              </WidgetErrorBoundary>
            </div>
            <WidgetErrorBoundary name="InstallPrompt" compact>
              <InstallPrompt />
            </WidgetErrorBoundary>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
