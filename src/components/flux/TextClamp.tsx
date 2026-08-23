import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

/**
 * TextClamp — truncamento controlado para textos longos.
 *  - lines=1: truncate + white-space:nowrap (listagens).
 *  - lines>1: line-clamp-N (cards, descrições).
 * Combine com <TooltipText/> quando o texto completo precisa ser acessível.
 */
export function TextClamp({
  children,
  lines = 1,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  lines?: 1 | 2 | 3 | 4;
  className?: string;
  as?: "span" | "div" | "p";
}) {
  const cls =
    lines === 1
      ? "block truncate"
      : lines === 2
        ? "line-clamp-2"
        : lines === 3
          ? "line-clamp-3"
          : "line-clamp-4";
  return <Tag className={cn(cls, "min-w-0", className)}>{children}</Tag>;
}

/**
 * TooltipText — trunca em uma linha e revela texto completo em tooltip
 * apenas quando há realmente truncamento (não aparece sem overflow).
 * Use para nomes/descrições em células de tabela.
 */
export function TooltipText({
  text,
  className,
  side = "top",
}: {
  text: string | number | null | undefined;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}) {
  const value = text == null || text === "" ? "—" : String(text);
  if (value === "—") {
    return <span className={cn("text-muted-foreground", className)}>—</span>;
  }
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <span
          className={cn("block min-w-0 truncate", className)}
          // exibe título nativo como fallback para leitores/quando tooltip não abre
          title={value}
        >
          {value}
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-sm break-words text-xs">
        {value}
      </TooltipContent>
    </Tooltip>
  );
}
