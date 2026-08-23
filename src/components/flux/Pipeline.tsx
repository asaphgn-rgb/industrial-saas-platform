import type { LucideIcon } from "lucide-react";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { chartPalette } from "@/lib/chart-theme";

export type PipelineTone =
  | "receita"
  | "positivo"
  | "atencao"
  | "critico"
  | "neutro"
  | "producao"
  | "ia";

export interface PipelineStage {
  key: string;
  label: string;
  count: number;
  /** Cor semântica: "positivo" quando ok, "atencao" quando alerta, "critico" quando bloqueio. */
  tone?: PipelineTone;
  /** Sublabel opcional (ex: tempo médio, valor, %). */
  hint?: string;
  /** Valor financeiro/secundário opcional exibido em linha separada. */
  value?: string;
  icon?: LucideIcon;
  /** Marcar como gargalo — desenha halo âmbar e badge no header. */
  gargalo?: boolean;
}

interface PipelineProps {
  stages: PipelineStage[];
  title?: string;
  subtitle?: string;
  className?: string;
  /** Nome do módulo, apenas informativo. */
  modulo?: string;
}

/**
 * Pipeline visual reutilizável — usado por Comercial, PCP, MRP, Produção, Qualidade,
 * Manutenção, Financeiro, Implantação, Estoque, Suprimentos, Engenharia.
 *
 * Responsivo:
 *  - Mobile (<640px): timeline vertical empilhada com conectores verticais.
 *  - Tablet (640-1023px): grid 2 colunas.
 *  - Desktop (≥1024px): fluxo horizontal com chevrons.
 * Badge de "Gargalo" ocupa espaço real no header (nunca sobre a borda).
 */
export function Pipeline({ stages, title, subtitle, className, modulo }: PipelineProps) {
  const total = stages.reduce((s, e) => s + (e.count || 0), 0);
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      {(title || subtitle || modulo) && (
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div className="min-w-0">
            {modulo && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                Pipeline · {modulo}
              </p>
            )}
            {title && (
              <h2 className="mt-0.5 truncate text-base font-bold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {total > 0 && (
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-semibold text-muted-foreground">
              {total.toLocaleString("pt-BR")} no fluxo
            </span>
          )}
        </div>
      )}

      {/* Mobile: timeline vertical */}
      <ol className="flex flex-col gap-2 sm:hidden" aria-label="Etapas do pipeline">
        {stages.map((s, i) => (
          <StageCard key={s.key} stage={s} index={i} orientation="vertical" isLast={i === stages.length - 1} />
        ))}
      </ol>

      {/* Tablet: grid 2 colunas */}
      <ol className="hidden grid-cols-2 gap-3 sm:grid lg:hidden">
        {stages.map((s, i) => (
          <StageCard key={s.key} stage={s} index={i} orientation="grid" />
        ))}
      </ol>

      {/* Desktop: horizontal com chevrons */}
      <ol className="hidden min-w-0 items-stretch gap-3 lg:flex">
        {stages.map((s, i) => (
          <li key={s.key} className="flex min-w-0 flex-1 items-stretch gap-3">
            <StageCard stage={s} index={i} orientation="horizontal" />
            {i < stages.length - 1 && (
              <ChevronRight
                className="shrink-0 self-center text-muted-foreground/50"
                strokeWidth={2}
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

interface StageCardProps {
  stage: PipelineStage;
  index: number;
  orientation: "vertical" | "grid" | "horizontal";
  isLast?: boolean;
}

function StageCard({ stage: s, index: i, orientation, isLast }: StageCardProps) {
  const cor = toneColor(s.tone ?? "neutro");
  const Icon = s.icon;
  const card = (
    <div
      className={cn(
        "relative flex min-h-[104px] flex-1 flex-col gap-2 rounded-lg border p-3 transition-shadow",
        orientation === "horizontal" && "min-w-[160px]",
        s.gargalo
          ? "border-warning/60 shadow-[0_0_0_1px_var(--warning),0_0_18px_-8px_var(--warning)]"
          : "border-border/70 hover:border-border",
      )}
      style={{ background: `color-mix(in oklab, ${cor} 10%, var(--card))` }}
    >
      {/* Header: número · label · badge · ícone */}
      <div className="flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <span aria-hidden> · </span>
          <span className="break-words">{s.label}</span>
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          {s.gargalo && (
            <span
              className="inline-flex items-center gap-0.5 rounded-full bg-warning/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-warning"
              title="Etapa identificada como gargalo"
            >
              <AlertTriangle className="h-2.5 w-2.5" aria-hidden />
              Gargalo
            </span>
          )}
          {Icon && <Icon className="h-3.5 w-3.5" style={{ color: cor }} aria-hidden />}
        </div>
      </div>

      {/* Valor principal + secundários (linha-base comum) */}
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className="font-mono text-2xl font-bold leading-none tabular-nums"
          style={{ color: cor }}
        >
          {(s.count ?? 0).toLocaleString("pt-BR")}
        </span>
        {s.value && (
          <span className="truncate font-mono text-xs font-semibold text-foreground/80 tabular-nums">
            {s.value}
          </span>
        )}
        {s.hint && (
          <span className="truncate text-[11px] text-muted-foreground">{s.hint}</span>
        )}
      </div>
    </div>
  );

  if (orientation === "vertical") {
    return (
      <li className="flex gap-3">
        <div className="flex flex-col items-center pt-2">
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold tabular-nums"
            style={{ background: `color-mix(in oklab, ${cor} 20%, var(--card))`, color: cor }}
            aria-hidden
          >
            {i + 1}
          </span>
          {!isLast && <span className="mt-1 w-px flex-1 bg-border" aria-hidden />}
        </div>
        <div className="min-w-0 flex-1">{card}</div>
      </li>
    );
  }

  if (orientation === "grid") return <li className="flex">{card}</li>;
  return card;
}

function toneColor(t: PipelineTone): string {
  switch (t) {
    case "receita":
      return chartPalette.receita;
    case "positivo":
      return chartPalette.positivo;
    case "atencao":
      return chartPalette.atencao;
    case "critico":
      return chartPalette.critico;
    case "producao":
      return chartPalette.producao;
    case "ia":
      return chartPalette.ia;
    default:
      return chartPalette.neutro;
  }
}
