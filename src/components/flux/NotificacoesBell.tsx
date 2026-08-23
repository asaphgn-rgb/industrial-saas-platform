import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase as typed } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, CheckCheck, Info, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typed as any;

type Notif = {
  id: string;
  titulo: string;
  mensagem: string | null;
  tipo: string;
  categoria: string | null;
  link: string | null;
  lida: boolean;
  created_at: string;
};

const TIPO_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  info: Info,
  aviso: AlertTriangle,
  erro: XCircle,
  sucesso: CheckCircle2,
};
const TIPO_CLS: Record<string, string> = {
  info: "text-info",
  aviso: "text-warning",
  erro: "text-destructive",
  sucesso: "text-success",
};

export function NotificacoesBell() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["notificacoes-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("notificacoes")
        .select("id, titulo, mensagem, tipo, categoria, link, lida, created_at")
        .order("created_at", { ascending: false })
        .limit(30);
      return (data ?? []) as Notif[];
    },
    // Sem polling: o canal realtime abaixo já invalida on-change.
    staleTime: 5 * 60_000,
  });

  // Realtime já é assinado uma vez no shell autenticado (_authenticated/route.tsx),
  // que invalida ["notificacoes-list"]. Não abrir canal duplicado aqui.

  const marcarLida = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notificacoes")
        .update({ lida: true, lida_em: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notificacoes-list"] }),
  });

  const marcarTodas = useMutation({
    mutationFn: async () => {
      const ids = (data ?? []).filter((n) => !n.lida).map((n) => n.id);
      if (ids.length === 0) return;
      const { error } = await supabase
        .from("notificacoes")
        .update({ lida: true, lida_em: new Date().toISOString() })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Todas marcadas como lidas");
      qc.invalidateQueries({ queryKey: ["notificacoes-list"] });
    },
  });

  const naoLidas = (data ?? []).filter((n) => !n.lida).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-full justify-start gap-2 px-2">
          <span className="relative">
            <Bell className="h-4 w-4" />
          </span>
          <span className="text-xs">Notificações</span>
          {naoLidas > 0 && (
            <Badge variant="destructive" className="ml-auto h-4 min-w-[16px] px-1 text-[10px]">
              {naoLidas > 99 ? "99+" : naoLidas}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="right" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="text-sm font-semibold">Notificações</div>
          {naoLidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => marcarTodas.mutate()}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Marcar todas
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {(data ?? []).length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-2 h-8 w-8 opacity-40" />
              Nenhuma notificação
            </div>
          ) : (
            <ul className="divide-y">
              {(data ?? []).map((n) => {
                const Icon = TIPO_ICON[n.tipo] ?? Info;
                const item = (
                  <div className={`flex gap-3 p-3 ${n.lida ? "opacity-60" : "bg-muted/30"}`}>
                    <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${TIPO_CLS[n.tipo] ?? ""}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{n.titulo}</p>
                        {!n.lida && (
                          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      {n.mensagem && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {n.mensagem}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{new Date(n.created_at).toLocaleString("pt-BR")}</span>
                        {n.categoria && (
                          <Badge variant="outline" className="h-4 px-1 text-[9px]">
                            {n.categoria}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!n.lida && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          marcarLida.mutate(n.id);
                        }}
                        title="Marcar como lida"
                        aria-label="Marcar como lida"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                );
                // Only allow internal absolute paths (no protocol, no protocol-relative, no javascript:)
                const safeLink =
                  n.link && /^\/[^/\\]/.test(n.link) && !/^\/\//.test(n.link) ? n.link : null;
                return (
                  <li key={n.id}>
                    {safeLink ? (
                      <Link
                        to={safeLink}
                        onClick={() => {
                          setOpen(false);
                          if (!n.lida) marcarLida.mutate(n.id);
                        }}
                        className="block hover:bg-accent"
                      >
                        {item}
                      </Link>
                    ) : (
                      item
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Link to="/notificacoes" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Ver todas
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
