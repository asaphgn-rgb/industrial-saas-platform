import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * IconBadge — área fixa e alinhamento consistente para ícones de card,
 * seção e toolbar (§4/§10 do Design System). Evita ícones "dançando"
 * entre painéis por causa de tamanhos e paddings diferentes.
 */

export type IconBadgeTone =
  | "default"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "financial"
  | "production"
  | "stock"
  | "quality"
  | "commercial";

const toneClass: Record<IconBadgeTone, string> = {
  default: "bg-primary/10 text-primary",
  neutral: "bg-muted text-muted-foreground",
  success: "bg-flux-success-soft text-success",
  warning: "bg-flux-warning-soft text-warning",
  danger: "bg-flux-danger-soft text-destructive",
  info: "bg-flux-info-soft text-info",
  financial: "bg-flux-success-soft text-success",
  production: "bg-primary/10 text-primary",
  stock: "bg-flux-info-soft text-info",
  quality: "bg-accent/15 text-accent-foreground",
  commercial: "bg-primary/10 text-primary",
};


const sizeClass = {
  sm: "h-7 w-7 [&_svg]:h-3.5 [&_svg]:w-3.5",
  md: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
  lg: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5",
} as const;

export function IconBadge({
  icon: Icon,
  tone = "default",
  size = "md",
  className,
  label,
}: {
  icon: LucideIcon;
  tone?: IconBadgeTone;
  size?: keyof typeof sizeClass;
  className?: string;
  /** Rótulo acessível quando o ícone carrega significado próprio. */
  label?: string;
}) {
  return (
    <span
      data-icon-badge={tone}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "grid shrink-0 place-items-center rounded-lg",
        sizeClass[size],
        toneClass[tone],
        className,
      )}
    >
      <Icon />
    </span>
  );
}

export default IconBadge;
