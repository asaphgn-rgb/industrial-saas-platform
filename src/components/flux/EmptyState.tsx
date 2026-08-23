import { type LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; icon?: LucideIcon };
  className?: string;
  compact?: boolean;
}

/**
 * Estado vazio padrão do FLUX.
 * Use em listas, tabelas e painéis que podem não ter dados.
 * Mobile-first: centralizado, com padding generoso e tap target ≥ 44px.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      data-testid="empty-state"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-6 px-4 gap-2" : "py-12 px-6 gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full bg-muted/60 text-muted-foreground grid place-items-center",
          compact ? "h-10 w-10" : "h-14 w-14",
        )}
        aria-hidden="true"
      >
        <Icon className={compact ? "h-5 w-5" : "h-7 w-7"} />
      </div>
      <p
        role="heading"
        aria-level={2}
        className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-base")}
      >
        {title}
      </p>
      {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
      {action && (
        <Button size="sm" onClick={action.onClick} className="mt-2 min-h-11">
          {action.icon && <action.icon className="h-4 w-4 mr-1" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
