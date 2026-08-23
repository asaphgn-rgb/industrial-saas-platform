import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/flux/EmptyState";
import { BarChart3 } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: React.ReactNode;
  /** Unidade de medida ou fonte dos dados (ex: "un/dia", "R$", "Fonte: OP"). */
  unit?: string;
  icon?: LucideIcon;
  /** Ação à direita do header (botão exportar, filtro, "ver detalhes"…). */
  actions?: React.ReactNode;
  /** Rodapé opcional (leitura de tendência, insights, fonte). */
  footer?: React.ReactNode;
  /** Se true, renderiza estado vazio padronizado. */
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * Wrapper padrão FLUX para cards com gráficos.
 * Padroniza título, subtítulo, unidade, ícone, ação e estado vazio —
 * evita a inconsistência de padding/tipografia entre painéis.
 */
export function ChartCard({
  title,
  subtitle,
  unit,
  icon: Icon,
  actions,
  footer,
  empty,
  emptyTitle = "Sem dados para exibir",
  emptyDescription = "Ajuste o filtro ou aguarde novos lançamentos.",
  children,
  className,
  bodyClassName,
}: ChartCardProps) {
  return (
    <Card className={cn("flex min-w-0 flex-col", className)}>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 space-y-0 pb-2 sm:flex sm:flex-row sm:justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle className="flex items-center gap-2 text-base">
            {Icon && <Icon className="h-4 w-4 text-primary" aria-hidden />}
            <span className="truncate">{title}</span>
            {unit && (
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground/80">
                {unit}
              </span>
            )}
          </CardTitle>
          {subtitle && <CardDescription className="mt-1">{subtitle}</CardDescription>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </CardHeader>
      <CardContent className={cn("flex-1 pt-1", bodyClassName)}>
        {empty ? (
          <EmptyState icon={BarChart3} title={emptyTitle} description={emptyDescription} compact />
        ) : (
          children
        )}
      </CardContent>
      {footer && (
        <div className="border-t border-border/60 px-6 py-2 text-[11px] text-muted-foreground">
          {footer}
        </div>
      )}
    </Card>
  );
}
