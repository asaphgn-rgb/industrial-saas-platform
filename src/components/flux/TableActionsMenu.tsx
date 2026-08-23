import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RowAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
};

/**
 * TableActionsMenu — menu de ações por linha de tabela.
 * Área de toque ≥ 36px, ícone centralizado, tooltip nativo.
 */
export function TableActionsMenu({
  actions,
  label = "Ações da linha",
  align = "end",
  triggerClassName,
}: {
  actions: RowAction[];
  label?: string;
  align?: "start" | "center" | "end";
  triggerClassName?: string;
}) {
  const enabled = actions.filter((a) => !a.disabled);
  if (enabled.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          title={label}
          className={cn("h-9 w-9", triggerClassName)}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((a) => (
          <span key={a.key}>
            {a.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              disabled={a.disabled}
              onSelect={() => {
                if (a.onSelect) a.onSelect();
                else if (a.href) window.location.href = a.href;
              }}
              className={cn(a.destructive && "text-destructive focus:text-destructive")}
            >
              {a.icon && (
                <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                  {a.icon}
                </span>
              )}
              <span className="truncate">{a.label}</span>
            </DropdownMenuItem>
          </span>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
