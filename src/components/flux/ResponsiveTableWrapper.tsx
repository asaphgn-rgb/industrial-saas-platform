import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a wide table so it scrolls horizontally on small screens
 * instead of overflowing the layout. Bleeds the scroll area to the
 * viewport edges below `sm:` for better mobile readability.
 */
export function ResponsiveTableWrapper({
  children,
  className,
  bleed = true,
}: {
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <div
      data-flux-table-wrapper=""
      className={cn("w-full overflow-x-auto", bleed && "-mx-4 px-4 sm:mx-0 sm:px-0", className)}
    >
      {children}
    </div>
  );
}
