import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PermissionDeniedProps {
  title?: string;
  description?: string;
  requiredRole?: string;
  className?: string;
}

/**
 * Bloco padrão para telas/áreas em que o usuário não tem permissão.
 * Use quando `has_role`/`can_write_*` retornar falso.
 */
export function PermissionDenied({
  title = "Acesso restrito",
  description = "Você não tem permissão para visualizar este recurso. Contate um administrador do seu tenant se precisar de acesso.",
  requiredRole,
  className,
}: PermissionDeniedProps) {
  return (
    <Card className={cn("border-warning/40 bg-warning/5", className)}>
      <CardContent className="pt-6 pb-6 flex gap-4 items-start">
        <div className="rounded-full bg-warning/15 text-warning p-2 shrink-0" aria-hidden>
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="min-w-0 space-y-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
          {requiredRole && (
            <p className="text-xs text-muted-foreground">
              Papel necessário: <span className="font-mono">{requiredRole}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
