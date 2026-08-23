import { PercentValue } from "@/components/flux/MoneyValue";
/**
 * Blocos visuais da Visão 360° — Painel Executivo.
 * Componentes puramente de apresentação (sem fetch), alinhados ao
 * design system FLUX (Dark Navy + Cyan) e ao layout executivo aprovado.
 */
import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { autorizarRota } from "@/lib/visao360-acl";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ChevronRight, HelpCircle, TrendingDown, TrendingUp } from "lucide-react";

/* ---------------------------------------------------------------- helpers */

export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(v || 0);
export const brlShort = (v: number) => {
  const a = Math.abs(v || 0);
  if (a >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`;
  if (a >= 1_000) return `R$ ${(v / 1_000).toFixed(1)}K`;
  return `R$ ${(v || 0).toFixed(0)}`;
};
export const nf = (v: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(v || 0);
export const pct = (v: number, d = 1) => `${(v || 0).toFixed(d)}%`;

export type Tone = "positive" | "warning" | "danger" | "info" | "neutral";

const toneText: Record<Tone, string> = {
  positive: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  neutral: "text-muted-foreground",
};
const toneBg: Record<Tone, string> = {
  positive: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/30",
  danger: "bg-destructive/10 border-destructive/30",
  info: "bg-info/10 border-info/30",
  neutral: "bg-muted/40 border-border",
};

export function Help({ text }: { text: string }) {
  return (
    <span title={text} className="inline-flex cursor-help text-muted-foreground/70">
      <HelpCircle className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">{text}</span>
    </span>
  );
}

export function SectionTitle({
  icon: Icon,
  title,
  hint,
  right,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  hint?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2", className)}>
      <h2 className="flex min-w-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
        {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
        <span className="truncate">{title}</span>
        {hint && <Help text={hint} />}
      </h2>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
}

export function Panel({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border border-border/70 bg-card shadow-[var(--shadow-card)]",
        padded && "p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Chip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
        toneBg[tone],
        toneText[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------- sparkline */

export function Sparkline({ data, tone = "info" }: { data: number[]; tone?: Tone }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / Math.max(1, data.length - 1)) * 100},${28 - ((v - min) / span) * 24}`)
    .join(" ");
  const stroke =
    tone === "positive"
      ? "var(--color-success)"
      : tone === "danger"
        ? "var(--color-destructive)"
        : tone === "warning"
          ? "var(--color-warning)"
          : "var(--color-primary)";
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-1 h-9 w-full opacity-40"
      aria-hidden
    >
      <polyline
        points={pts}
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ------------------------------------------------------- drill-down / clique */

/** Navega para qualquer rota interna a partir de um bloco do painel. */
/**
 * Contexto de ACL do drill-down: lista de papéis do usuário na empresa ativa.
 * Quando presente, qualquer `Drill` com destino que o perfil não pode abrir
 * deixa de ser clicável (o dado continua visível, a navegação é negada).
 * `null` = ACL ainda não carregada → navegação liberada só na tela; o backend
 * (RLS por tenant e papel) continua sendo a autorização real.
 */
export const DrillAclContext = React.createContext<readonly string[] | null>(null);

export function DrillAclProvider({
  papeis,
  children,
}: {
  papeis: readonly string[] | null;
  children: React.ReactNode;
}) {
  return <DrillAclContext.Provider value={papeis}>{children}</DrillAclContext.Provider>;
}

/** Autoriza um href contra os papéis do contexto. */
export function useDrillPermitido(href?: string): boolean {
  const papeis = React.useContext(DrillAclContext);
  if (!href) return true;
  if (papeis === null) return true;
  return !!autorizarRota(href, papeis);
}

export function useDrill() {
  const navigate = useNavigate();
  return React.useCallback(
    (href?: string) => {
      if (href) void navigate({ to: href as never });
    },
    [navigate],
  );
}

/** Auditoria de exibição bloqueada — uma vez por rota, por sessão. */
const jaAuditado = new Set<string>();

/**
 * Bloco de drill-down negado: continua visível (o dado é informativo), não
 * navega e registra a negativa em `audit_logs` pelo servidor.
 */
function DrillNegado({
  href,
  className,
  contexto,
  children,
}: {
  href: string;
  className?: string;
  contexto?: string;
  children: React.ReactNode;
}) {
  const auditar = React.useCallback(
    (clique: boolean) => {
      void import("@/lib/modulo-acesso.functions")
        .then((m) => m.registrarDrillNegado({ data: { href, contexto, clique } }))
        .catch(() => undefined);
    },
    [href, contexto],
  );

  React.useEffect(() => {
    if (jaAuditado.has(href)) return;
    jaAuditado.add(href);
    auditar(false);
  }, [href, auditar]);

  return (
    <div
      className={cn(className, "cursor-not-allowed opacity-95")}
      data-drill-denied="true"
      data-drill-target={href}
      title="Você não tem permissão para abrir este módulo."
      onClick={() => auditar(true)}
    >
      {children}
    </div>
  );
}



/**
 * Envolve um bloco do painel: vira botão navegável quando recebe `href`
 * (ou `onClick`), mantendo exatamente o mesmo layout visual.
 */
export function Drill({
  href,
  onClick,
  className,
  ariaLabel,
  children,
}: {
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const drill = useDrill();
  const permitido = useDrillPermitido(href);
  if (!href && !onClick) return <div className={className}>{children}</div>;

  if (href && !permitido) {
    // Sem permissão de perfil/empresa: mantém o bloco visível, sem navegação.
    // Toda exibição bloqueada e toda tentativa de clique viram auditoria
    // (usuário, empresa e contexto do drill) via server function.
    return (
      <DrillNegado href={href} className={className} contexto={ariaLabel}>
        {children}
      </DrillNegado>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      data-drill-href={href}
      onClick={() => (onClick ? onClick() : drill(href))}
      className={cn(
        className,
        "w-full cursor-pointer text-left transition-colors hover:border-primary/60 hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
      )}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------- KPI hero */

export function KpiHero({
  label,
  value,
  delta,
  deltaInverse,
  icon: Icon,
  tone = "info",
  spark,
  hint,
  href,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaInverse?: boolean;
  icon?: LucideIcon;
  tone?: Tone;
  spark?: number[];
  hint?: string;
  href?: string;
}) {
  const up = (delta ?? 0) >= 0;
  const good = deltaInverse ? !up : up;
  return (
    <Drill
      href={href}
      ariaLabel={href ? `Abrir detalhes de ${label}` : undefined}
      className="relative min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card px-4 pb-3 pt-3 shadow-[var(--shadow-card)]"
    >
      {spark && <Sparkline data={spark} tone={good ? "positive" : "danger"} />}
      <div className="relative flex items-center gap-2">
        {Icon && <Icon className={cn("h-4 w-4 shrink-0", toneText[tone])} aria-hidden />}
        <span className="truncate text-[13px] font-medium text-muted-foreground">{label}</span>
        {hint && <Help text={hint} />}
      </div>
      <div className="relative mt-2 flex items-end justify-between gap-2">
        <span className="truncate font-mono text-[clamp(1.5rem,2vw,1.9rem)] font-bold leading-none tracking-tight tabular-nums text-foreground">
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
              good ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </Drill>
  );
}

/* ---------------------------------------------------------- top ofensores */

export function VilaoRow({
  rank,
  titulo,
  tags,
  formula,
  valor,
  share,
  href,
}: {
  rank: number;
  titulo: string;
  tags: string[];
  formula: string;
  valor: number;
  share: number;
  href?: string;
}) {
  return (
    <Drill
      href={href}
      ariaLabel={href ? `Abrir ${titulo}` : undefined}
      className="flex items-center gap-3 rounded-xl border border-destructive/25 bg-destructive/[0.04] px-3 py-2.5"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-destructive/15 font-mono text-xs font-bold text-destructive">
        #{rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{titulo}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {tags.join(" · ")} <span className="italic opacity-70">· {formula}</span>
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-mono text-sm font-bold text-destructive tabular-nums">
          {brlShort(valor)}/mês
        </p>
        <p className="text-[11px] text-muted-foreground tabular-nums">
          {pct(share)} do faturamento
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </Drill>
  );
}

/* -------------------------------------------------------------- pipeline */

export type PipelineItem = {
  nome: string;
  icon: LucideIcon;
  contagem: number;
  alertas: number;
  criticos?: number;
  href?: string;
};

/** Cor de identidade de cada etapa da cadeia (ponta a ponta). */
const PIPELINE_COR: Record<string, string> = {
  Vendas: "var(--color-chart-current)",
  PCP: "var(--color-chart-4)",
  Compras: "var(--color-chart-warning)",
  Estoque: "var(--color-chart-positive)",
  Produção: "var(--color-chart-5)",
  Engenharia: "var(--color-chart-4)",
  Manutenção: "var(--color-chart-warning)",
  Qualidade: "var(--color-chart-positive)",
  Logística: "var(--color-chart-current)",
  RH: "var(--color-chart-previous)",
  Financeiro: "var(--color-chart-realized)",
};

/**
 * Pipeline de Processos — Ponta a Ponta.
 *
 * Fita horizontal com uma etapa por módulo: chip de ícone na cor da etapa,
 * nome, contador em destaque e selo de alerta. Etapas com pendência ganham
 * borda âmbar/vermelha com halo; setas finas ligam uma etapa à seguinte.
 * Rola horizontalmente em telas estreitas, sem quebrar a sequência.
 */
export function PipelineStrip({ items }: { items: PipelineItem[] }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]">
      <div className="flex min-w-full items-stretch gap-0">

        {items.map((it, i) => {
          const alerta = it.criticos ? "danger" : it.alertas ? "warning" : "neutral";
          const cor =
            alerta === "danger"
              ? "var(--color-chart-negative)"
              : alerta === "warning"
                ? "var(--color-chart-warning)"
                : (PIPELINE_COR[it.nome] ?? "var(--color-chart-current)");
          const aviso = it.criticos ? it.criticos : it.alertas;
          return (
            <React.Fragment key={it.nome}>
              {i > 0 && (
                <span
                  className="mx-1 self-center text-[13px] font-light text-muted-foreground/45"
                  aria-hidden
                >
                  →
                </span>
              )}
              <Drill
                href={it.href}
                ariaLabel={it.href ? `Abrir ${it.nome}` : undefined}
                className={cn(
                  "relative grid min-w-[92px] flex-1 basis-0 justify-items-center gap-1.5 rounded-xl border px-2 py-3.5 text-center transition-all",
                  alerta === "neutral" && "border-border/60 bg-card/60",
                )}
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-xl"
                  aria-hidden
                  style={
                    alerta === "neutral"
                      ? undefined
                      : {
                          border: `1px solid color-mix(in oklab, ${cor} 65%, transparent)`,
                          background: `color-mix(in oklab, ${cor} 7%, transparent)`,
                          boxShadow: `0 0 18px -8px ${cor}`,
                        }
                  }
                />
                <span
                  className="relative grid h-9 w-9 place-items-center rounded-lg"
                  style={{ background: `color-mix(in oklab, ${cor} 16%, transparent)` }}
                >
                  <it.icon className="h-[18px] w-[18px]" style={{ color: cor }} aria-hidden />
                </span>
                <span className="relative w-full truncate text-[11.5px] font-medium tracking-tight text-foreground/90">
                  {it.nome}
                </span>
                <span
                  className="relative font-mono text-[17px] font-bold leading-none tabular-nums"
                  style={{ color: cor }}
                >
                  {nf(it.contagem)}
                </span>
                <span className="relative flex h-[14px] items-center">
                  {aviso > 0 && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums",
                        it.criticos ? "text-destructive" : "text-warning",
                      )}
                    >
                      <AlertTriangle className="h-2.5 w-2.5" aria-hidden />
                      {aviso}
                    </span>
                  )}
                </span>
              </Drill>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}


/* --------------------------------------------------------------- treemap */

export function Treemap({ items }: { items: { nome: string; valor: number; cor: string }[] }) {
  const total = items.reduce((a, i) => a + i.valor, 0) || 1;
  const [a, b, c, d] = items;
  const box = (it?: { nome: string; valor: number; cor: string }, className?: string) =>
    it ? (
      <div
        className={cn("relative min-h-[70px] overflow-hidden rounded-md p-2", className)}
        style={{ background: it.cor }}
      >
        <p className="truncate text-[11px] font-semibold text-background/95 mix-blend-luminosity">
          {it.nome}
        </p>
        <p className="text-[11px] font-bold text-background/95 tabular-nums mix-blend-luminosity">
          {pct((it.valor / total) * 100)}
        </p>
      </div>
    ) : null;
  return (
    <div className="space-y-3">
      <div className="grid h-[200px] grid-cols-3 gap-1.5">
        {box(a, "row-span-2")}
        <div className="grid grid-rows-2 gap-1.5">
          {box(b)}
          {box(c)}
        </div>
        {box(d, "row-span-2")}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((i) => (
          <div key={i.nome} className="rounded-lg border border-border/70 px-2 py-1.5 text-center">
            <p className="truncate text-[10px] text-muted-foreground">{i.nome}</p>
            <p className="font-mono text-[13px] font-bold tabular-nums text-foreground">
              {brlShort(i.valor)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- fluxo de valor */

export function ValueFlow({
  etapas,
  rendimento,
  perda,
}: {
  etapas: { de: string; para: string; valor: number; tone: Tone }[];
  rendimento: number;
  perda: number;
}) {
  const max = Math.max(...etapas.map((e) => e.valor), 1);
  const barBg: Record<Tone, string> = {
    positive: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
    info: "bg-info",
    neutral: "bg-muted-foreground",
  };
  return (
    <div className="space-y-2">
      {etapas.map((e, i) => (
        <div key={i} className="grid grid-cols-[86px_minmax(0,1fr)_86px] items-center gap-2">
          <span className="truncate text-right text-[11px] text-muted-foreground">{e.de}</span>
          <div className="relative h-4 rounded-full bg-muted/40">
            <div
              className={cn("h-4 rounded-full", barBg[e.tone])}
              style={{ width: `${Math.max(4, (e.valor / max) * 100)}%` }}
            />
            <span className="absolute inset-0 grid place-items-center font-mono text-[10px] font-bold text-foreground tabular-nums">
              {nf(e.valor)}
            </span>
          </div>
          <span className="truncate text-[11px] text-muted-foreground">{e.para}</span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
        <span>
          Rendimento: <strong className="text-success">{pct(rendimento)}</strong>
        </span>
        <span>
          Perda: <strong className="text-destructive">{pct(perda)}</strong> (Refugo + Devoluções)
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- heatmap */

function heatClass(v: number) {
  if (v >= 85) return "bg-success/25 text-success border-success/40";
  if (v >= 75) return "bg-info/25 text-info border-info/40";
  if (v >= 65) return "bg-warning/25 text-warning border-warning/40";
  return "bg-destructive/25 text-destructive border-destructive/40";
}

export function Heatmap({
  titulo,
  linhas,
  colunas,
}: {
  titulo: string;
  colunas: string[];
  linhas: { nome: string; valores: number[] }[];
}) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {titulo}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-separate border-spacing-1 text-center">
          <thead>
            <tr>
              <th />
              {colunas.map((c) => (
                <th key={c} className="text-[11px] font-medium text-muted-foreground">
                  {c}
                </th>
              ))}
              <th className="text-[11px] font-medium text-muted-foreground">Média</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => {
              const media = l.valores.reduce((a, b) => a + b, 0) / Math.max(1, l.valores.length);
              return (
                <tr key={l.nome}>
                  <td className="whitespace-nowrap pr-2 text-left font-mono text-[11px] text-muted-foreground">
                    {l.nome}
                  </td>
                  {l.valores.map((v, i) => (
                    <td key={i}>
                      <span
                        className={cn(
                          "block rounded-md border px-1 py-1 font-mono text-[11px] font-semibold tabular-nums",
                          heatClass(v),
                        )}
                      >
                        {v.toFixed(0)}%
                      </span>
                    </td>
                  ))}
                  <td>
                    <span
                      className={cn(
                        "block rounded-md border px-1 py-1 font-mono text-[11px] font-bold tabular-nums",
                        heatClass(media),
                      )}
                    >
                      {media.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function HeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1">
        <i className="h-2.5 w-2.5 rounded-sm bg-success" /> ≥85%
      </span>
      <span className="flex items-center gap-1">
        <i className="h-2.5 w-2.5 rounded-sm bg-info" /> 75–84%
      </span>
      <span className="flex items-center gap-1">
        <i className="h-2.5 w-2.5 rounded-sm bg-warning" /> 65–74%
      </span>
      <span className="flex items-center gap-1">
        <i className="h-2.5 w-2.5 rounded-sm bg-destructive" /> &lt;65%
      </span>
    </div>
  );
}

/* ----------------------------------------------------------- barra e meta */

export function MetaBar({ nome, valor, meta }: { nome: string; valor: number; meta: number }) {
  const ok = valor >= meta;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-[12px]">
        <span className="truncate font-medium text-foreground">{nome}</span>
        <span className="shrink-0 text-muted-foreground">
          Meta: {meta.toFixed(0)}%{" "}
          <strong className={ok ? "text-success" : "text-destructive"}><PercentValue value={valor} decimals={0} /></strong>
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className={cn("h-full rounded-full", ok ? "bg-success" : "bg-destructive")}
          style={{ width: `${Math.min(100, Math.max(2, valor))}%` }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- mini stat */

export function MiniStat({
  label,
  value,
  delta,
  tone = "neutral",
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: number;
  tone?: Tone;
  icon?: LucideIcon;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border/70 bg-background/40 px-3 py-2.5">
      <p className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
        {Icon && <Icon className={cn("h-3.5 w-3.5 shrink-0", toneText[tone])} aria-hidden />}
        {label}
      </p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <span className="truncate font-mono text-[15px] font-bold tabular-nums text-foreground">
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              "shrink-0 text-[11px] font-semibold tabular-nums",
              delta >= 0 ? "text-success" : "text-destructive",
            )}
          >
            {delta >= 0 ? "↗" : "↘"} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- DRE */

export function DreTable({
  linhas,
}: {
  linhas: { nome: string; valor: number; share: number; destaque?: boolean; negativo?: boolean }[];
}) {
  return (
    <div className="space-y-1">
      {linhas.map((l) => (
        <div
          key={l.nome}
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_auto_52px] items-center gap-2 rounded-lg border px-3 py-2 text-[13px]",
            l.destaque
              ? "border-success/30 bg-success/[0.06]"
              : "border-border/60 bg-background/30",
          )}
        >
          <span
            className={cn(
              "truncate",
              l.destaque ? "font-semibold text-success" : "text-foreground",
            )}
          >
            {l.nome}
          </span>
          <span
            className={cn(
              "font-mono font-bold tabular-nums",
              l.negativo ? "text-destructive" : l.destaque ? "text-success" : "text-foreground",
            )}
          >
            {l.negativo ? "-" : ""}
            {brl(Math.abs(l.valor))}
          </span>
          <span className="text-right text-[11px] text-muted-foreground tabular-nums">
            {l.share.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ gauge */

export function ScoreGauge({ score }: { score: number }) {
  const r = 54;
  const c = Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, score)) / 100) * c;
  const cor =
    score >= 80
      ? "var(--color-success)"
      : score >= 60
        ? "var(--color-warning)"
        : "var(--color-destructive)";
  return (
    <div className="relative mx-auto w-[160px]">
      <svg viewBox="0 0 140 80" className="w-full">
        <path
          d="M 16 74 A 54 54 0 0 1 124 74"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity={0.4}
        />
        <path
          d="M 16 74 A 54 54 0 0 1 124 74"
          fill="none"
          stroke={cor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <p className="font-mono text-3xl font-bold leading-none tabular-nums text-foreground">
          {score.toFixed(0)}
        </p>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Score geral</p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- alerta */

export function AlertRow({
  nivel,
  modulo,
  titulo,
  descricao,
  data,
  href,
}: {
  nivel: "critico" | "atencao" | "info";
  modulo: string;
  titulo: string;
  descricao?: string;
  data?: string;
  href?: string;
}) {
  const tone: Tone = nivel === "critico" ? "danger" : nivel === "atencao" ? "warning" : "info";
  return (
    <Drill
      href={href}
      ariaLabel={href ? `Abrir alerta: ${titulo}` : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3 py-2.5",
        nivel === "critico"
          ? "border-destructive/40 bg-destructive/[0.05]"
          : nivel === "atencao"
            ? "border-warning/40 bg-warning/[0.05]"
            : "border-border/70 bg-background/30",
      )}
    >
      <span
        className={cn("h-2 w-2 shrink-0 rounded-full", toneText[tone].replace("text-", "bg-"))}
      />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2">
          <Chip tone={tone}>
            {nivel === "critico" ? "CRÍTICO" : nivel === "atencao" ? "ATENÇÃO" : "INFO"}
          </Chip>
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {modulo}
          </span>
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-foreground">{titulo}</p>
        {descricao && <p className="truncate text-[11px] text-muted-foreground">{descricao}</p>}
      </div>
      {data && <span className="shrink-0 text-[11px] text-muted-foreground">{data}</span>}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </Drill>
  );
}

/* ---------------------------------------------------------------- módulos */

export function ProcessoCard({
  icon: Icon,
  nome,
  resumo,
  alertas,
  criticos,
  href,
}: {
  icon: LucideIcon;
  nome: string;
  resumo: string;
  alertas: number;
  criticos?: number;
  href?: string;
}) {
  return (
    <Drill
      href={href}
      ariaLabel={href ? `Abrir módulo ${nome}` : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-background/30 px-3 py-3",
        criticos ? "border-l-4 border-l-destructive border-border/70" : "border-border/70",
      )}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{nome}</p>
        <p className="truncate text-[11px] text-muted-foreground">{resumo}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {criticos ? <Chip tone="danger">{criticos} crítico</Chip> : null}
        {alertas > 0 && (
          <Chip tone="warning">
            {alertas} alerta{alertas > 1 ? "s" : ""}
          </Chip>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
      </div>
    </Drill>
  );
}

export function MaquinaCard({
  codigo,
  nome,
  status,
  oee,
  perda,
  href,
}: {
  codigo: string;
  nome: string;
  status: string;
  oee: number;
  perda: number;
  href?: string;
}) {
  const rodando = !/parad|inativ|manuten/i.test(status);
  return (
    <Drill
      href={href}
      ariaLabel={href ? `Abrir máquina ${codigo}` : undefined}
      className="min-w-0 rounded-xl border border-border/70 bg-background/30 p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-[12px] font-bold text-foreground">{codigo}</p>
          <p className="truncate text-[11px] text-muted-foreground">{nome}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            rodando ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {rodando ? "Rodando" : "Parada"}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>OEE</span>
        <span className="font-mono font-bold tabular-nums text-foreground"><PercentValue value={oee} decimals={0} /></span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.min(100, oee)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">Perda: {perda.toFixed(1)}%</p>
    </Drill>
  );
}

export function DeptCard({
  nome,
  score,
  detalhe,
  alertas,
  href,
}: {
  nome: string;
  score: number;
  detalhe: string;
  alertas: number;
  href?: string;
}) {
  const tone: Tone = score >= 85 ? "positive" : score >= 70 ? "warning" : "danger";
  return (
    <Drill
      href={href}
      ariaLabel={href ? `Abrir departamento ${nome}` : undefined}
      className={cn(
        "min-w-0 rounded-xl border bg-background/30 p-3",
        tone === "danger"
          ? "border-destructive/40"
          : tone === "warning"
            ? "border-warning/40"
            : "border-border/70",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <i
            className={cn("h-2 w-2 shrink-0 rounded-full", toneText[tone].replace("text-", "bg-"))}
          />
          <span className="truncate text-[13px] font-semibold text-foreground">{nome}</span>
        </span>
        <span
          className={cn("shrink-0 font-mono text-[12px] font-bold tabular-nums", toneText[tone])}
        >
          {score.toFixed(0)}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "positive"
              ? "bg-success"
              : tone === "warning"
                ? "bg-warning"
                : "bg-destructive",
          )}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
      <p className="mt-1.5 truncate text-[11px] text-muted-foreground">{detalhe}</p>
      {alertas > 0 && (
        <p className="mt-0.5 text-[11px] font-medium text-warning">⚠ {alertas} alertas</p>
      )}
    </Drill>
  );
}
