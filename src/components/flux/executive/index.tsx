/**
 * Kit Executivo FLUX — componentes reutilizáveis do padrão "Painel Executivo"
 * (Visão 360°). Use estes blocos em qualquer painel de diretoria para manter
 * tipografia, espaçamentos, grid e cores idênticos entre telas.
 *
 * Composição típica de página:
 *   <ExecPage>
 *     <ExecHeader ... />
 *     <ExecFilters ... />
 *     <ExecKpiGrid>...</ExecKpiGrid>
 *     <ExecSection title="..."> ... </ExecSection>
 *   </ExecPage>
 */
import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, FileDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Help, Panel, SectionTitle } from "@/components/flux/visao360/panels";

export { Panel, SectionTitle, Help };

/* ------------------------------------------------------------------ página */

export function ExecPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-4 p-3 sm:space-y-5 md:p-5", className)}>{children}</div>;
}

/* --------------------------------------------------------------- cabeçalho */

export function ExecHeader({
  icon: Icon,
  title,
  subtitle,
  hint,
  periodLabel,
  statusLabel = "Sistema operacional",
  onExport,
  exporting,
  actions,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  hint?: string;
  periodLabel?: string;
  statusLabel?: string;
  onExport?: () => void;
  exporting?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <header className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <h1 className="flex min-w-0 items-center gap-2 text-[18px] font-bold leading-tight tracking-tight text-foreground sm:text-[22px]">
          {Icon && <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />}
          <span className="min-w-0 truncate">{title}</span>
          {hint && <Help text={hint} />}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {actions}
        {onExport && (
          <Button size="sm" variant="outline" onClick={onExport} disabled={exporting}>
            {exporting ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-1.5 h-4 w-4" />
            )}
            Exportar PDF
          </Button>
        )}
        {statusLabel && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 text-[12px] text-muted-foreground">
            <i className="h-2 w-2 rounded-full bg-success" aria-hidden /> {statusLabel}
          </span>
        )}
        {periodLabel && (
          <span className="rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 text-[12px] text-muted-foreground">
            {periodLabel}
          </span>
        )}
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------- filtros */

export interface ExecPeriodOption<T extends string = string> {
  id: T;
  label: string;
}

export function ExecFilters<T extends string>({
  options,
  value,
  onChange,
  navLabel,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  note,
}: {
  options: ExecPeriodOption<T>[];
  value: T;
  onChange: (v: T) => void;
  navLabel?: string;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  note?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="tablist"
        aria-label="Período"
        className="inline-flex max-w-full overflow-x-auto rounded-lg border border-border/70 bg-background/40 p-0.5"
      >
        {options.map((o) => (
          <button
            key={o.id}
            role="tab"
            type="button"
            aria-selected={value === o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-[12px] transition-colors",
              value === o.id
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {navLabel && (
        <div className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background/40 px-1.5 py-1">
          <button
            type="button"
            aria-label="Período anterior"
            disabled={prevDisabled}
            className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-40"
            onClick={onPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-1 text-[12px] font-medium text-foreground">{navLabel}</span>
          <button
            type="button"
            aria-label="Próximo período"
            disabled={nextDisabled}
            className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-40"
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {note && <span className="w-full text-[11px] text-muted-foreground sm:w-auto">{note}</span>}
    </div>
  );
}

/* ----------------------------------------------------------------- seções */

export function ExecSection({
  icon,
  title,
  hint,
  right,
  children,
  bodyClassName,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  hint?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  bodyClassName?: string;
  className?: string;
}) {
  return (
    <Panel className={className}>
      <SectionTitle icon={icon} title={title} hint={hint} right={right} />
      <div className={cn("mt-3", bodyClassName)}>{children}</div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ grids */

const gridCols: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 xl:grid-cols-6",
};

export function ExecKpiGrid({
  cols = 3,
  children,
  className,
}: {
  cols?: 2 | 3 | 4 | 6;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-testid="exec-kpi-grid" className={cn("grid gap-3", gridCols[cols], className)}>
      {children}
    </div>
  );
}

export function ExecGrid({
  cols = 3,
  children,
  className,
}: {
  cols?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        cols === 2
          ? "grid-cols-1 lg:grid-cols-2"
          : cols === 4
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
            : "grid-cols-1 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- tabelas */

export interface ExecColumn<Row> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  /** Rótulo compacto exibido no card de mobile (default: header). */
  mobileLabel?: string;
  cell: (row: Row) => React.ReactNode;
  /** Oculta a coluna nos cards de mobile. */
  hideOnMobile?: boolean;
}

/**
 * Tabela executiva responsiva — tabela real no desktop e lista de cards no
 * mobile, preservando exatamente as mesmas informações e hierarquia.
 */
export function ExecTable<Row>({
  columns,
  rows,
  rowKey,
  emptyLabel = "Sem registros no período.",
  dense,
  footer,
}: {
  columns: ExecColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row, i: number) => string;
  emptyLabel?: string;
  dense?: boolean;
  footer?: React.ReactNode;
}) {
  if (rows.length === 0) {
    return <p className="py-6 text-center text-[12px] text-muted-foreground">{emptyLabel}</p>;
  }
  const align = (a?: string) =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[520px] border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-border/70">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-2 py-2 font-semibold uppercase tracking-wide text-muted-foreground",
                    align(c.align),
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={rowKey(r, i)}
                className="border-b border-border/40 last:border-0 hover:bg-muted/20"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      dense ? "px-2 py-1.5" : "px-2 py-2",
                      align(c.align),
                      c.align === "right" && "font-mono tabular-nums",
                    )}
                  >
                    {c.cell(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <ul className="space-y-2 sm:hidden">
        {rows.map((r, i) => (
          <li
            key={rowKey(r, i)}
            className="rounded-xl border border-border/70 bg-background/30 p-3"
          >
            <p className="mb-1.5 truncate text-[13px] font-semibold text-foreground">
              {columns[0].cell(r)}
            </p>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
              {columns.slice(1).map((c) =>
                c.hideOnMobile ? null : (
                  <div key={c.key} className="flex min-w-0 items-baseline justify-between gap-2">
                    <dt className="truncate text-[11px] text-muted-foreground">
                      {c.mobileLabel ?? c.header}
                    </dt>
                    <dd className="shrink-0 font-mono text-[12px] tabular-nums text-foreground">
                      {c.cell(r)}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </li>
        ))}
      </ul>
      {footer && <div className="mt-2 text-[11px] text-muted-foreground">{footer}</div>}
    </>
  );
}

/* --------------------------------------------------------------- skeleton */

export function ExecKpiSkeleton() {
  return (
    <div className="grid h-full grid-rows-[auto_minmax(40px,auto)_auto] gap-2 rounded-xl border border-border/70 bg-card px-4 py-3">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
}

export function ExecPanelSkeleton({ height = 190 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-3 w-full rounded-lg" style={{ height }} />
    </div>
  );
}

/** Esqueleto de página executiva — mesma malha do painel real (sem CLS). */
export function ExecPageSkeleton({ kpis = 6 }: { kpis?: number }) {
  return (
    <ExecPage>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-6 w-72 max-w-full" />
          <Skeleton className="h-3.5 w-56 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
      <Skeleton className="h-9 w-64 max-w-full rounded-lg" />
      <ExecKpiGrid cols={3}>
        {Array.from({ length: kpis }).map((_, i) => (
          <ExecKpiSkeleton key={i} />
        ))}
      </ExecKpiGrid>
      <ExecPanelSkeleton height={140} />
      <ExecPanelSkeleton height={96} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ExecPanelSkeleton />
        <ExecPanelSkeleton />
        <ExecPanelSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ExecPanelSkeleton height={220} />
        <ExecPanelSkeleton height={220} />
      </div>
    </ExecPage>
  );
}
