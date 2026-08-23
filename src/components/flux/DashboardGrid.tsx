import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Estruturas globais de layout de dashboard (§2 e §6 do padrão visual FLUX).
 *
 * Regra: nenhum painel deve declarar `grid-cols-*` próprio para KPIs.
 * Use `DashboardGrid` — ele garante o mesmo comportamento responsivo
 * (4 → 3 → 2 → 1 colunas) em todos os módulos, sem card espremido.
 */

type Density = "compact" | "default" | "wide";

const densityClass: Record<Density, string> = {
  compact: "flux-grid flux-grid--compact",
  default: "flux-grid",
  wide: "flux-grid flux-grid--wide",
};

export function DashboardGrid({
  children,
  density = "default",
  className,
}: {
  children: ReactNode;
  /** compact = KPIs curtos · default = KPIs padrão · wide = cards financeiros/gráficos */
  density?: Density;
  className?: string;
}) {
  return (
    <div data-flux-grid={density} className={cn(densityClass[density], className)}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-muted-readable">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function DashboardSection({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section data-flux-section className={cn("min-w-0 space-y-3", className)}>
      {title && <SectionHeader title={title} description={description} actions={actions} />}
      {children}
    </section>
  );
}

/** Container vertical padrão de uma página de dashboard. */
export function DashboardPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-flux-dashboard className={cn("min-w-0 space-y-5 sm:space-y-6", className)}>
      {children}
    </div>
  );
}

export default DashboardGrid;
