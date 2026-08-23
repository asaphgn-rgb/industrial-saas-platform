import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Aplica largura máxima confortável em telas grandes. */
  bounded?: boolean;
}

/**
 * Container padrão de conteúdo interno do FLUX.
 * Aplica padding uniforme, largura controlada e evita overflow horizontal.
 * Use em toda página abaixo do PageHeader ou como wrapper direto.
 */
export function PageContainer({
  children,
  bounded = true,
  className,
  ...rest
}: PageContainerProps) {
  return (
    <div
      {...rest}
      data-flux-page=""
      className={cn(
        "w-full min-w-0",
        // Padding fluido por aparelho + respeito às áreas seguras (notch/gestos)
        "px-[max(0.75rem,env(safe-area-inset-left))] py-4",
        "sm:px-6 sm:py-6 lg:px-8 xl:px-10",
        "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        bounded && "mx-auto max-w-[1600px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

