import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as typedSupabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LoadingState } from "@/components/flux/LoadingState";
import { EmptyState } from "@/components/flux/EmptyState";

import { friendlyError } from "@/lib/friendly-error";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

type Comentario = {
  id: string;
  autor_id: string;
  autor_nome: string | null;
  texto: string;
  created_at: string;
};

export function ComentariosThread({
  entidade,
  entidadeId,
  title = "Comentários",
  description = "Colabore com sua equipe neste registro. Todos da empresa podem ver.",
}: {
  entidade: string;
  entidadeId: string;
  title?: string;
  description?: string;
}) {
  const qc = useQueryClient();
  const [texto, setTexto] = useState("");

  const meQuery = useQuery({
    queryKey: ["me-for-comments"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase
        .from("profiles")
        .select("tenant_id, nome_completo, email")
        .eq("id", user.id)
        .maybeSingle();
      return {
        userId: user.id as string,
        tenantId: (profile?.tenant_id ?? null) as string | null,
        nome: (profile?.nome_completo ?? user.email ?? "Usuário") as string,
      };
    },
  });

  const listQuery = useQuery({
    queryKey: ["comentarios", entidade, entidadeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comentarios")
        .select("id, autor_id, autor_nome, texto, created_at")
        .eq("entidade", entidade)
        .eq("entidade_id", entidadeId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Comentario[];
    },
    enabled: Boolean(entidadeId),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const me = meQuery.data;
      if (!me?.tenantId) throw new Error("Perfil sem empresa vinculada.");
      const t = texto.trim();
      if (!t) throw new Error("Digite algo antes de enviar.");
      const { error } = await supabase.from("comentarios").insert({
        tenant_id: me.tenantId,
        entidade,
        entidade_id: entidadeId,
        autor_id: me.userId,
        autor_nome: me.nome,
        texto: t,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTexto("");
      qc.invalidateQueries({ queryKey: ["comentarios", entidade, entidadeId] });
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("comentarios").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comentarios", entidade, entidadeId] });
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const items = listQuery.data ?? [];
  const me = meQuery.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" /> {title}
          <span className="ml-1 text-xs font-normal text-muted-foreground">({items.length})</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {listQuery.isLoading ? (
          <LoadingState variant="card" rows={3} />
        ) : items.length === 0 ? (
          <EmptyState title={"Nenhum comentário ainda. Seja o primeiro a comentar."} compact />
        ) : (
          <ul className="space-y-3">
            {items.map((c) => {
              const initials = (c.autor_nome ?? "?")
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
              const mine = me?.userId === c.autor_id;
              return (
                <li key={c.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-muted text-[11px]">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-card/50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{c.autor_nome ?? "Usuário"}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(c.created_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      {mine && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteMutation.mutate(c.id)}
                          title="Remover comentário"
                          aria-label="Remover comentário"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground/90">
                      {c.texto}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="border-t border-border pt-3">
          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva um comentário… (Ctrl+Enter envia)"
            rows={3}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && texto.trim()) {
                e.preventDefault();
                addMutation.mutate();
              }
            }}
          />
          <div className="mt-2 flex justify-end">
            <Button
              onClick={() => addMutation.mutate()}
              disabled={!texto.trim() || addMutation.isPending || !me?.tenantId}
              size="sm"
            >
              {addMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Comentar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
