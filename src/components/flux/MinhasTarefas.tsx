import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase as typedSupabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, Trash2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { confirmDialog } from "@/components/flux/ConfirmDialog";
import { useAgendaPessoal } from "@/hooks/use-agenda-pessoal";
import { SEMAFORO_CLS, SEMAFORO_LABEL, semaforoItem } from "@/lib/agenda-pessoal";

import { friendlyError } from "@/lib/friendly-error";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

type Tarefa = {
  id: string;
  texto: string;
  concluida: boolean;
  data_prazo: string | null;
  prioridade: string;
  created_at: string;
};

const PRIO_COLOR: Record<string, string> = {
  baixa: "bg-muted text-muted-foreground",
  normal: "bg-info/10 text-info",
  alta: "bg-warning/10 text-warning",
  urgente: "bg-destructive/10 text-destructive",
};

export function MinhasTarefas({ compact = false, limit }: { compact?: boolean; limit?: number }) {
  const queryClient = useQueryClient();
  const [texto, setTexto] = useState("");
  const [prazo, setPrazo] = useState("");
  const [prioridade, setPrioridade] = useState("normal");
  const [showConcluidas, setShowConcluidas] = useState(false);

  const { data: me } = useQuery({
    queryKey: ["me-basic-tarefas"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return null;
      const { data: profile } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", user.user.id)
        .maybeSingle();
      return { userId: user.user.id, tenantId: profile?.tenant_id ?? null };
    },
    staleTime: 5 * 60 * 1000,
  });

  const query = useQuery({
    queryKey: ["tarefas-pessoais", showConcluidas, limit ?? null],
    enabled: !!me?.userId,
    queryFn: async (): Promise<Tarefa[]> => {
      let q = supabase
        .from("tarefas_pessoais")
        .select("id, texto, concluida, data_prazo, prioridade, created_at")
        .order("concluida", { ascending: true })
        .order("data_prazo", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (!showConcluidas) q = q.eq("concluida", false);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data as Tarefa[]) ?? [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!me?.userId || !me?.tenantId) throw new Error("Sem empresa vinculada");
      if (!texto.trim()) throw new Error("Digite a tarefa");
      const { error } = await supabase.from("tarefas_pessoais").insert({
        user_id: me.userId,
        tenant_id: me.tenantId,
        texto: texto.trim(),
        data_prazo: prazo || null,
        prioridade,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTexto("");
      setPrazo("");
      setPrioridade("normal");
      queryClient.invalidateQueries({ queryKey: ["tarefas-pessoais"] });
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, concluida }: { id: string; concluida: boolean }) => {
      const { error } = await supabase
        .from("tarefas_pessoais")
        .update({
          concluida,
          concluida_em: concluida ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas-pessoais"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tarefas_pessoais").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tarefa removida");
      queryClient.invalidateQueries({ queryKey: ["tarefas-pessoais"] });
    },
  });

  const hoje = new Date().toISOString().slice(0, 10);
  const items = query.data ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Minhas tarefas</CardTitle>
          </div>
          {!compact && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowConcluidas((v) => !v)}
            >
              {showConcluidas ? "Ocultar concluídas" : "Mostrar concluídas"}
            </Button>
          )}
        </div>
        <CardDescription>
          Lista pessoal — só você vê.{" "}
          {compact ? "" : "Use para lembretes, follow-ups e pendências do dia."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            addMutation.mutate();
          }}
        >
          <Input
            placeholder="Nova tarefa..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="flex-1"
          />
          {!compact && (
            <>
              <Input
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                className="w-full sm:w-40"
              />
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </>
          )}
          <Button type="submit" size="sm" disabled={addMutation.isPending || !texto.trim()}>
            <Plus className="mr-1 h-4 w-4" />
            Adicionar
          </Button>
        </form>

        <AgendaEmTarefas />

        {query.isLoading ? (
          <p className="py-6 text-center text-xs text-muted-foreground">Carregando...</p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            {showConcluidas ? "Nenhuma tarefa." : "Nenhuma tarefa pendente. 🎉"}
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {items.map((t) => {
              const atrasada = !t.concluida && t.data_prazo && t.data_prazo < hoje;
              return (
                <li
                  key={t.id}
                  className="flex items-start gap-3 px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <Checkbox
                    checked={t.concluida}
                    onCheckedChange={(v) => toggleMutation.mutate({ id: t.id, concluida: !!v })}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={
                        t.concluida ? "line-through text-muted-foreground" : "text-foreground"
                      }
                    >
                      {t.texto}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                      {t.data_prazo && (
                        <span
                          className={`inline-flex items-center gap-1 ${
                            atrasada ? "text-destructive font-medium" : "text-muted-foreground"
                          }`}
                        >
                          <CalendarDays className="h-3 w-3" />
                          {new Date(t.data_prazo).toLocaleDateString("pt-BR")}
                          {atrasada ? " · atrasada" : ""}
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className={`px-1.5 py-0 text-[10px] ${PRIO_COLOR[t.prioridade] ?? ""}`}
                      >
                        {t.prioridade}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    aria-label="Remover tarefa"
                    onClick={async () => {
                      if (await confirmDialog({ title: "Remover esta tarefa?" })) deleteMutation.mutate(t.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Espelho das atividades da agenda pessoal ("Meu Dia") dentro de Minhas tarefas:
 * tudo que é agendado no calendário aparece aqui imediatamente, com o
 * semáforo de prazo (verde / laranja / vermelho piscando).
 */
function AgendaEmTarefas() {
  const { lista, isLoading, atualizar } = useAgendaPessoal();

  const itens = lista
    .filter((i) => i.status !== "concluida" && i.status !== "cancelada")
    .sort(
      (a, b) =>
        new Date(a.due_at ?? a.start_at ?? a.created_at).getTime() -
        new Date(b.due_at ?? b.start_at ?? b.created_at).getTime(),
    )
    .slice(0, 8);

  if (isLoading || itens.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <div className="mb-2 flex items-center gap-2">
        <CalendarDays className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Da minha agenda
        </span>
      </div>
      <ul className="space-y-1.5">
        {itens.map((i) => {
          const s = semaforoItem(i);
          const cls = SEMAFORO_CLS[s];
          const quando = i.start_at ?? i.due_at;
          return (
            <li
              key={i.id}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition ${cls.border} ${cls.soft}`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${cls.dot} ${
                  s === "vermelho" ? "semaforo-blink" : ""
                }`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-foreground">{i.title}</p>
                <p className={`text-[11px] ${cls.text}`}>
                  {SEMAFORO_LABEL[s]}
                  {quando ? ` · ${new Date(quando).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}` : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => atualizar.mutate({ id: i.id, patch: { status: "concluida" } })}
              >
                Concluir
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
