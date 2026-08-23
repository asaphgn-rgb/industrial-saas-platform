import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/flux/EmptyState";
import { LoadingState } from "@/components/flux/LoadingState";
import { MobileRecordCard } from "@/components/flux/MobileRecordCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ColumnAlign = "left" | "right" | "center";

/** Larguras mínimas padrão FLUX — evita colunas espremidas em notebooks. */
export const COLUMN_MIN = {
  checkbox: 44,
  code: 120,
  date: 120,
  status: 140,
  currency: 140,
  numeric: 120,
  person: 160,
  paymentTerms: 160,
  actions: 120,
  observations: 260,
  name: 220,
  nameWide: 320,
} as const;

export type ResponsiveColumn<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: ColumnAlign;
  /** Largura mínima em px — use COLUMN_MIN.* quando possível. */
  minWidth?: number;
  /** Oculta a coluna abaixo do breakpoint informado. */
  hideBelow?: "sm" | "md" | "lg" | "xl";
  /** Rótulo curto para uso no card mobile (default: header como string). */
  mobileLabel?: string;
  /** Ocultar coluna no formato card mobile. */
  hideOnMobile?: boolean;
};

const alignCls: Record<ColumnAlign, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

/** Justificação do conteúdo (flex) espelhando o alinhamento do texto. */
const justifyCls: Record<ColumnAlign, string> = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center",
};

const hideBelowCls: Record<NonNullable<ResponsiveColumn<unknown>["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

/**
 * ResponsiveDataTable — tabela padrão do FLUX.
 *  - Desktop / tablet: <table> com scroll horizontal controlado e larguras mínimas.
 *  - Mobile (< md): lista de MobileRecordCard.
 *  - Colunas com hideBelow são ocultadas progressivamente antes do scroll horizontal.
 *  - Loading / empty / error tratados de forma consistente.
 */
export function ResponsiveDataTable<T>({
  rows,
  columns,
  getRowId,
  isLoading,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription,
  error,
  mobileTitle,
  mobileSubtitle,
  mobileStatus,
  mobileActions,
  onRowClick,
  getRowAriaLabel,
  className,
  footer,
}: {
  rows: T[];
  columns: ResponsiveColumn<T>[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  error?: Error | null;
  /** Renderers para o card mobile — se ausentes, usa a primeira coluna como título. */
  mobileTitle?: (row: T) => ReactNode;
  mobileSubtitle?: (row: T) => ReactNode;
  mobileStatus?: (row: T) => ReactNode;
  mobileActions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  getRowAriaLabel?: (row: T) => string;
  className?: string;
  footer?: ReactNode;
}) {
  if (isLoading) return <LoadingState variant="table" />;
  if (error) {
    return <EmptyState title="Não foi possível carregar" description={error.message} />;
  }
  if (!rows || rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const mobileFields = (row: T) =>
    columns
      .filter((c) => !c.hideOnMobile)
      .map((c) => ({
        label: c.mobileLabel ?? (typeof c.header === "string" ? c.header : c.key),
        value: c.render(row),
      }));

  return (
    <div className={cn("space-y-3", className)}>
      {/* Mobile: cards */}
      <div className="grid gap-2 md:hidden">
        {rows.map((row) => (
          <MobileRecordCard
            key={getRowId(row)}
            title={mobileTitle ? mobileTitle(row) : columns[0]?.render(row)}
            subtitle={mobileSubtitle?.(row)}
            status={mobileStatus?.(row)}
            actions={mobileActions?.(row)}
            fields={mobileFields(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          />
        ))}
      </div>

      {/* Desktop / tablet: table */}
      <div className="hidden md:block">
        <div
          data-flux-table-wrapper=""
          className="w-full overflow-x-auto rounded-xl border border-border"
        >
          <Table className="min-w-full" data-flux-table="">
            <TableHeader className="bg-muted/40">
              <TableRow>
                {columns.map((c) => (
                  <TableHead
                    key={c.key}
                    className={cn(
                      "whitespace-nowrap text-[11px] font-medium uppercase tracking-wider sm:text-xs",
                      alignCls[c.align ?? "center"],
                      c.hideBelow && hideBelowCls[c.hideBelow],
                    )}
                    style={c.minWidth ? { minWidth: c.minWidth } : undefined}
                    data-align={c.align ?? "center"}
                    data-col={c.key}
                  >
                    <div
                      className={cn(
                        "flex w-full items-center gap-1",
                        justifyCls[c.align ?? "center"],
                      )}
                    >
                      {c.header}
                    </div>
                  </TableHead>

                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const rowId = getRowId(row);
                const clickable = Boolean(onRowClick);
                const handleActivate = () => onRowClick?.(row);
                const isInteractiveTarget = (target: EventTarget | null) => {
                  if (!(target instanceof HTMLElement)) return false;
                  return Boolean(
                    target.closest(
                      "a,button,input,select,textarea,label,[role=button],[role=menuitem],[data-no-row-click]",
                    ),
                  );
                };
                return (
                  <TableRow
                    key={rowId}
                    onClick={
                      clickable
                        ? (e) => {
                            if (isInteractiveTarget(e.target)) return;
                            handleActivate();
                          }
                        : undefined
                    }
                    onKeyDown={
                      clickable
                        ? (e) => {
                            if (isInteractiveTarget(e.target)) return;
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleActivate();
                            }
                          }
                        : undefined
                    }
                    role={clickable ? "button" : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    aria-label={
                      clickable ? (getRowAriaLabel?.(row) ?? `Abrir registro ${rowId}`) : undefined
                    }
                    className={cn(
                      clickable &&
                        "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    )}
                  >
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        className={cn(
                          "align-middle",
                          alignCls[c.align ?? "center"],
                          c.hideBelow && hideBelowCls[c.hideBelow],
                          c.align === "right" && "font-mono tabular-nums",
                        )}
                        style={c.minWidth ? { minWidth: c.minWidth } : undefined}
                        data-align={c.align ?? "center"}
                        data-col={c.key}
                      >
                        <div
                          className={cn(
                            "flex w-full min-w-0 items-center gap-1",
                            justifyCls[c.align ?? "center"],
                            alignCls[c.align ?? "center"],
                            "[&>*]:min-w-0",
                          )}
                        >
                          {c.render(row)}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {footer}
    </div>
  );
}
