import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * MobileRecordCard — representação de "linha de tabela" em formato card,
 * usado quando a tabela precisa colapsar em telas pequenas.
 *
 * Slots:
 *  - title, subtitle: identificação principal (nome/código).
 *  - status: badge à direita.
 *  - fields: pares label/value renderizados em grid 2 colunas.
 *  - actions: menu de ações (ex.: TableActionsMenu) — no canto direito superior.
 */
export function MobileRecordCard({
  title,
  subtitle,
  status,
  fields,
  actions,
  onClick,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  status?: ReactNode;
  fields?: { label: string; value: ReactNode }[];
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const clickable = typeof onClick === "function";
  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(
      target.closest(
        "a,button,input,select,textarea,label,[role=button],[role=menuitem],[data-no-row-click]",
      ),
    );
  };
  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={
        clickable
          ? (e) => {
              if (isInteractiveTarget(e.target)) return;
              onClick!();
            }
          : undefined
      }
      onKeyDown={
        clickable
          ? (e) => {
              if (isInteractiveTarget(e.target)) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick!();
              }
            }
          : undefined
      }
      className={cn(
        "rounded-xl border border-border bg-card p-3 shadow-sm",
        clickable &&
          "cursor-pointer hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="min-w-0 truncate text-sm font-semibold text-foreground">{title}</div>
          {subtitle && (
            <div className="mt-0.5 min-w-0 truncate text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {status}
          {actions}
        </div>
      </div>
      {fields && fields.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-3">
          {fields.map((f, i) => (
            <div key={i} className="min-w-0">
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {f.label}
              </dt>
              <dd className="mt-0.5 min-w-0 break-words font-medium text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
