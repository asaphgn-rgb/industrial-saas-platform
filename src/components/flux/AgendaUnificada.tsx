import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/flux/EmptyState";
import { sincronizarAppConectado } from "@/lib/meu-dia-sync.functions";
import { useRealtimeInvalidate } from "@/hooks/useRealtimeInvalidate";
import {
  Calendar,
  CheckSquare,
  Mail,
  ExternalLink,
  Plug,
  ArrowRight,
  Check,
  MailOpen,
  RefreshCw,
  Loader2,
  Plus,
} from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { friendlyError } from "@/lib/friendly-error";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

type Event = {
  id: string;
  title: string;
  start_at: string;
  end_at: string | null;
  is_all_day: boolean | null;
  location: string | null;
  meeting_link: string | null;
  provider_key: string;
};

type Task = {
  id: string;
  title: string;
  due_at: string | null;
  status: string;
  priority: number | null;
  source_url: string | null;
  provider_key: string;
};

type Message = {
  id: string;
  subject_safe: string | null;
  sender_safe: string | null;
  snippet_safe: string | null;
  received_at: string;
  is_unread: boolean | null;
  source_url: string | null;
  provider_key: string;
};

const PROVIDER_LABEL: Record<string, string> = {
  google_calendar: "Google",
  microsoft_calendar: "Outlook",
  icloud_caldav: "iCloud",
  google_tasks: "Google Tasks",
  microsoft_todo: "MS To Do",
  todoist: "Todoist",
  trello: "Trello",
  notion: "Notion",
  gmail: "Gmail",
  whatsapp_business: "WhatsApp",
};

function whenLabel(iso: string, allDay?: boolean | null): string {
  const d = new Date(iso);
  if (allDay) {
    if (isToday(d)) return "Hoje · dia todo";
    if (isTomorrow(d)) return "Amanhã · dia todo";
    return format(d, "dd/MM · 'dia todo'", { locale: ptBR });
  }
  if (isToday(d)) return `Hoje · ${format(d, "HH:mm")}`;
  if (isTomorrow(d)) return `Amanhã · ${format(d, "HH:mm")}`;
  return format(d, "dd/MM · HH:mm", { locale: ptBR });
}

/**
 * Agenda unificada — consolida eventos de calendário, tarefas externas e
 * mensagens autorizadas dos próximos ~2 dias em uma única visão do Meu Dia.
 * Renderiza estado vazio informativo quando o usuário ainda não conectou
 * nenhum provedor.
 */
export function AgendaUnificada() {
  useRealtimeInvalidate(
    ["external_calendar_events", "external_tasks", "external_messages"],
    [
      ["meu-dia", "external-events"],
      ["meu-dia", "external-tasks"],
      ["meu-dia", "external-messages"],
    ],
    "rt-meu-dia-agenda",
  );

  const userIdQ = useQuery({
    queryKey: ["meu-dia", "user-id"],
    queryFn: async () => (await supabase.auth.getUser()).data.user?.id ?? null,
    staleTime: 5 * 60_000,
  });
  const userId = userIdQ.data;

  const inicio = useMemo(() => new Date().toISOString(), []);
  const fim = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }, []);

  const connectedQ = useQuery({
    queryKey: ["meu-dia", "connected-count", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count } = await db
        .from("user_connected_apps")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "active");
      return count ?? 0;
    },
  });

  const eventsQ = useQuery({
    queryKey: ["meu-dia", "external-events", userId, inicio, fim],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await db
        .from("external_calendar_events")
        .select("id, title, start_at, end_at, is_all_day, location, meeting_link, provider_key")
        .eq("user_id", userId)
        .gte("start_at", inicio)
        .lte("start_at", fim)
        .order("start_at")
        .limit(20);
      return (data ?? []) as Event[];
    },
  });

  const tasksQ = useQuery({
    queryKey: ["meu-dia", "external-tasks", userId, fim],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await db
        .from("external_tasks")
        .select("id, title, due_at, status, priority, source_url, provider_key")
        .eq("user_id", userId)
        .neq("status", "completed")
        .or(`due_at.is.null,due_at.lte.${fim}`)
        .order("due_at", { ascending: true, nullsFirst: false })
        .limit(15);
      return (data ?? []) as Task[];
    },
  });

  const messagesQ = useQuery({
    queryKey: ["meu-dia", "external-messages", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await db
        .from("external_messages")
        .select(
          "id, subject_safe, sender_safe, snippet_safe, received_at, is_unread, source_url, provider_key",
        )
        .eq("user_id", userId)
        .eq("is_unread", true)
        .order("received_at", { ascending: false })
        .limit(8);
      return (data ?? []) as Message[];
    },
  });

  const qc = useQueryClient();
  const runSync = useServerFn(sincronizarAppConectado);
  const [syncingAll, setSyncingAll] = useState(false);

  const invalidateAgenda = () => {
    qc.invalidateQueries({ queryKey: ["meu-dia", "external-events"] });
    qc.invalidateQueries({ queryKey: ["meu-dia", "external-tasks"] });
    qc.invalidateQueries({ queryKey: ["meu-dia", "external-messages"] });
  };

  const tasksKey = ["meu-dia", "external-tasks", userId] as const;
  const messagesKey = ["meu-dia", "external-messages", userId] as const;
  const bellKey = ["meu-dia-bell-top"] as const;

  const completeTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db
        .from("external_tasks")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: tasksKey });
      const previous = qc.getQueryData<Task[]>(tasksKey);
      qc.setQueryData<Task[]>(tasksKey, (old) => (old ?? []).filter((t) => t.id !== id));
      return { previous };
    },
    onError: (e: Error, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(tasksKey, ctx.previous);
      toast.error(friendlyError(e));
    },
    onSuccess: () => toast.success("Tarefa concluída."),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: tasksKey });
      qc.invalidateQueries({ queryKey: bellKey });
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db
        .from("external_messages")
        .update({ is_unread: false })
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: messagesKey });
      const previous = qc.getQueryData<Message[]>(messagesKey);
      qc.setQueryData<Message[]>(messagesKey, (old) => (old ?? []).filter((m) => m.id !== id));
      return { previous };
    },
    onError: (e: Error, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(messagesKey, ctx.previous);
      toast.error(friendlyError(e));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: messagesKey });
      qc.invalidateQueries({ queryKey: bellKey });
    },
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Sessão inválida.");
      const { error } = await db
        .from("external_messages")
        .update({ is_unread: false })
        .eq("user_id", userId)
        .eq("is_unread", true);
      if (error) throw error;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: messagesKey });
      const previous = qc.getQueryData<Message[]>(messagesKey);
      qc.setQueryData<Message[]>(messagesKey, []);
      return { previous };
    },
    onError: (e: Error, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(messagesKey, ctx.previous);
      toast.error(friendlyError(e));
    },
    onSuccess: () => toast.success("Todas as mensagens marcadas como lidas."),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: messagesKey });
      qc.invalidateQueries({ queryKey: bellKey });
    },
  });

  // Captura rápida de item externo (tarefa ou evento) como tarefa pessoal do Flux
  const captureToFlux = useMutation({
    mutationFn: async (payload: { texto: string; data_prazo: string | null }) => {
      if (!userId) throw new Error("Sessão inválida.");
      const { data: profile } = await db
        .from("profiles")
        .select("tenant_id")
        .eq("id", userId)
        .maybeSingle();
      const tenantId = profile?.tenant_id;
      if (!tenantId) throw new Error("Tenant não encontrado.");
      const { error } = await db.from("tarefas_pessoais").insert({
        user_id: userId,
        tenant_id: tenantId,
        texto: payload.texto,
        data_prazo: payload.data_prazo ? payload.data_prazo.slice(0, 10) : null,
        concluida: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Capturado em Minhas Tarefas.");
      qc.invalidateQueries({ queryKey: ["meu-dia", "tarefas-pessoais"] });
      qc.invalidateQueries({ queryKey: ["minhas-tarefas"] });
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const syncAll = async () => {
    if (!userId) return;
    setSyncingAll(true);
    try {
      const { data: apps } = await db
        .from("user_connected_apps")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .eq("sync_enabled", true);
      const list = (apps ?? []) as { id: string }[];
      if (list.length === 0) {
        toast.info("Nenhuma integração ativa para sincronizar.");
        return;
      }
      const results = await Promise.allSettled(
        list.map((a) => runSync({ data: { connectedAppId: a.id } })),
      );
      const ok = results.filter((r) => r.status === "fulfilled").length;
      const fail = results.length - ok;
      if (fail === 0) toast.success(`Sincronizado (${ok} integração(ões)).`);
      else toast.warning(`Sincronizado: ${ok} ok · ${fail} com erro.`);
      invalidateAgenda();
      qc.invalidateQueries({ queryKey: ["meu-dia", "user-apps"] });
    } finally {
      setSyncingAll(false);
    }
  };

  // Auto-sync silencioso: ao montar, sincroniza integrações ativas cujo
  // last_sync_at seja nulo ou anterior a 15 min — mantém a agenda "fresca"
  // sem ação do usuário e sem duplicar dados (upsert idempotente no server).
  const autoSyncDone = useRef(false);
  useEffect(() => {
    if (!userId || autoSyncDone.current) return;
    autoSyncDone.current = true;
    const STALE_MS = 15 * 60_000;
    (async () => {
      const { data: apps } = await db
        .from("user_connected_apps")
        .select("id, last_sync_at")
        .eq("user_id", userId)
        .eq("status", "active")
        .eq("sync_enabled", true);
      const list = (apps ?? []) as { id: string; last_sync_at: string | null }[];
      const stale = list.filter(
        (a) => !a.last_sync_at || Date.now() - new Date(a.last_sync_at).getTime() > STALE_MS,
      );
      if (stale.length === 0) return;
      await Promise.allSettled(stale.map((a) => runSync({ data: { connectedAppId: a.id } })));
      invalidateAgenda();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loading = eventsQ.isLoading || tasksQ.isLoading || messagesQ.isLoading;
  const totalExterno =
    (eventsQ.data?.length ?? 0) + (tasksQ.data?.length ?? 0) + (messagesQ.data?.length ?? 0);
  const semConexao = (connectedQ.data ?? 0) === 0;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-primary" /> Agenda unificada
          {totalExterno > 0 && (
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {totalExterno}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          {!semConexao && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={syncAll}
              disabled={syncingAll}
              title="Sincronizar todas as integrações ativas"
            >
              {syncingAll ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="mr-1 h-3 w-3" />
              )}
              Sincronizar
            </Button>
          )}
          <Link
            to="/meu-dia/integracoes"
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary"
          >
            Integrações <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </>
        ) : semConexao ? (
          <EmptyState
            icon={Plug}
            title="Nenhuma agenda externa conectada"
            description="Conecte Google Calendar, Outlook, Todoist e outros para consolidar seu dia."
            action={{
              label: "Conectar agora",
              icon: ArrowRight,
              onClick: () => {
                window.location.href = "/meu-dia/integracoes";
              },
            }}
            compact
          />
        ) : totalExterno === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Nada agendado nos próximos 2 dias. 🎉
          </p>
        ) : (
          <>
            {(eventsQ.data?.length ?? 0) > 0 && (
              <Section icon={Calendar} label="Próximos eventos">
                {eventsQ.data!.map((e) => (
                  <ItemRow
                    key={e.id}
                    title={e.title}
                    meta={whenLabel(e.start_at, e.is_all_day)}
                    hint={e.location ?? undefined}
                    href={e.meeting_link ?? undefined}
                    provider={e.provider_key}
                    secondaryAction={{
                      icon: Plus,
                      label: "Capturar em Minhas Tarefas",
                      disabled: captureToFlux.isPending,
                      onClick: () =>
                        captureToFlux.mutate({
                          texto: e.title,
                          data_prazo: e.start_at,
                        }),
                    }}
                  />
                ))}
              </Section>
            )}
            {(tasksQ.data?.length ?? 0) > 0 && (
              <Section icon={CheckSquare} label="Tarefas externas">
                {tasksQ.data!.map((t) => (
                  <ItemRow
                    key={t.id}
                    title={t.title}
                    meta={t.due_at ? whenLabel(t.due_at) : "Sem prazo"}
                    href={t.source_url ?? undefined}
                    provider={t.provider_key}
                    tone={t.priority && t.priority >= 3 ? "warn" : undefined}
                    action={{
                      icon: Check,
                      label: "Concluir",
                      disabled: completeTask.isPending,
                      onClick: () => completeTask.mutate(t.id),
                    }}
                    secondaryAction={{
                      icon: Plus,
                      label: "Capturar em Minhas Tarefas",
                      disabled: captureToFlux.isPending,
                      onClick: () =>
                        captureToFlux.mutate({
                          texto: t.title,
                          data_prazo: t.due_at,
                        }),
                    }}
                  />
                ))}
              </Section>
            )}
            {(messagesQ.data?.length ?? 0) > 0 && (
              <Section
                icon={Mail}
                label="Mensagens não lidas"
                headerAction={
                  <button
                    type="button"
                    className="text-[10px] font-medium text-primary hover:underline disabled:opacity-50"
                    onClick={() => markAllRead.mutate()}
                    disabled={markAllRead.isPending}
                  >
                    Marcar todas
                  </button>
                }
              >
                {messagesQ.data!.map((m) => (
                  <ItemRow
                    key={m.id}
                    title={m.subject_safe || m.sender_safe || "(sem assunto)"}
                    meta={m.sender_safe ?? undefined}
                    hint={m.snippet_safe ?? undefined}
                    href={m.source_url ?? undefined}
                    provider={m.provider_key}
                    action={{
                      icon: MailOpen,
                      label: "Marcar como lida",
                      disabled: markRead.isPending,
                      onClick: () => markRead.mutate(m.id),
                    }}
                    secondaryAction={{
                      icon: Plus,
                      label: "Capturar em Minhas Tarefas",
                      disabled: captureToFlux.isPending,
                      onClick: () =>
                        captureToFlux.mutate({
                          texto: `Responder: ${m.subject_safe || m.sender_safe || "(sem assunto)"}`,
                          data_prazo: null,
                        }),
                    }}
                  />
                ))}
              </Section>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Section({
  icon: Icon,
  label,
  children,
  headerAction,
}: {
  icon: typeof Calendar;
  label: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
        {headerAction && (
          <span className="ml-auto normal-case tracking-normal">{headerAction}</span>
        )}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

type RowAction = {
  icon: typeof Calendar;
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

function ItemRow({
  title,
  meta,
  hint,
  href,
  provider,
  tone,
  action,
  secondaryAction,
}: {
  title: string;
  meta?: string;
  hint?: string;
  href?: string;
  provider: string;
  tone?: "warn";
  action?: RowAction;
  secondaryAction?: RowAction;
}) {
  const providerLabel = PROVIDER_LABEL[provider] ?? provider;
  const inner = (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5">
        <span className="truncate font-medium">{title}</span>
        <Badge variant="outline" className="shrink-0 text-[9px]">
          {providerLabel}
        </Badge>
      </div>
      {meta && <p className="text-[11px] text-muted-foreground">{meta}</p>}
      {hint && <p className="truncate text-[11px] text-muted-foreground/80">{hint}</p>}
    </div>
  );
  const wrapperClass = `flex items-start gap-2 rounded-md border p-2 text-sm transition ${
    tone === "warn"
      ? "border-warning/40 bg-warning/5"
      : "border-border hover:border-primary/40 hover:bg-muted/50"
  }`;
  const renderAction = (a: RowAction, key: string) => {
    const Icon = a.icon;
    return (
      <Button
        key={key}
        type="button"
        size="icon"
        variant="ghost"
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary"
        onClick={(e) => {
          e.stopPropagation();
          a.onClick();
        }}
        disabled={a.disabled}
        title={a.label}
        aria-label={a.label}
      >
        <Icon className="h-3.5 w-3.5" />
      </Button>
    );
  };
  return (
    <div className={wrapperClass}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-start gap-2"
        >
          {inner}
          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        </a>
      ) : (
        inner
      )}
      {action && renderAction(action, "primary")}
      {secondaryAction && renderAction(secondaryAction, "secondary")}
    </div>
  );
}
