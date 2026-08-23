import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ResponsiveDataTable,
  type ResponsiveColumn,
} from "@/components/flux/ResponsiveDataTable";

/**
 * DataTable universal do FLUX.
 *
 * Camada fina sobre {@link ResponsiveDataTable} que adiciona:
 *  - toolbar (filtros/busca embutidos acima da tabela);
 *  - ordenação client-side por coluna `sortable`;
 *  - paginação client-side quando `pageSize` é informado;
 *  - contador de linhas visíveis.
 *
 * Toda tabela nova do FLUX deve usar `DataTable`. Ele mantém o desenho
 * responsivo (cards em <md, tabela em >=md) e os estados universais
 * (loading/empty/error) já resolvidos pelo componente base.
 */
export type DataTableColumn<T> = ResponsiveColumn<T> & {
  /** Habilita ordenação client-side por essa coluna. */
  sortable?: boolean;
  /** Extrator de valor para ordenação. Padrão: usa `render` como string. */
  sortAccessor?: (row: T) => string | number | Date | null | undefined;
};

export interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  error?: Error | null;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Renderiza acima da tabela — busca, filtros, botões. */
  toolbar?: ReactNode;
  /** Se informado, ativa paginação client-side. */
  pageSize?: number;
  onRowClick?: (row: T) => void;
  className?: string;
  mobileTitle?: (row: T) => ReactNode;
  mobileSubtitle?: (row: T) => ReactNode;
  mobileStatus?: (row: T) => ReactNode;
  mobileActions?: (row: T) => ReactNode;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "pt-BR", { numeric: true });
}

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  isLoading,
  error,
  emptyTitle,
  emptyDescription,
  toolbar,
  pageSize,
  onRowClick,
  className,
  mobileTitle,
  mobileSubtitle,
  mobileStatus,
  mobileActions,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortable) return rows;
    const acc = col.sortAccessor;
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = acc ? acc(a) : String(col.render(a) ?? "");
      const vb = acc ? acc(b) : String(col.render(b) ?? "");
      const cmp = compare(va, vb);
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sort, columns]);

  const paged = useMemo(() => {
    if (!pageSize) return sorted;
    const start = page * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;

  const wrappedColumns: ResponsiveColumn<T>[] = columns.map((c) => {
    if (!c.sortable) return c;
    const isActive = sort?.key === c.key;
    return {
      ...c,
      header: (
        <button
          type="button"
          onClick={() =>
            setSort((s) => {
              if (s?.key !== c.key) return { key: c.key, dir: "asc" };
              if (s.dir === "asc") return { key: c.key, dir: "desc" };
              return null;
            })
          }
          className="inline-flex items-center gap-1 whitespace-nowrap hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          <span>{c.header}</span>
          {isActive ? (
            sort?.dir === "asc" ? (
              <ArrowUp className="h-3 w-3 shrink-0" />
            ) : (
              <ArrowDown className="h-3 w-3 shrink-0" />
            )
          ) : (
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
          )}
        </button>
      ),
    };
  });


  return (
    <div className={cn("space-y-3", className)}>
      {toolbar && (
        <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
      )}
      <ResponsiveDataTable
        rows={paged}
        columns={wrappedColumns}
        getRowId={getRowId}
        isLoading={isLoading}
        error={error}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        onRowClick={onRowClick}
        mobileTitle={mobileTitle}
        mobileSubtitle={mobileSubtitle}
        mobileStatus={mobileStatus}
        mobileActions={mobileActions}
      />
      {pageSize && sorted.length > pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Mostrando <strong className="text-foreground">{paged.length}</strong> de{" "}
            <strong className="text-foreground">{sorted.length}</strong> registros
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[80px] text-center tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page + 1 >= totalPages}
              aria-label="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
