import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/flux/EmptyState";
import { toast } from "sonner";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  CalendarClock,
  Lock,
} from "lucide-react";
import { useAgendaPessoal } from "@/hooks/use-agenda-pessoal";
import {
  PIPELINE_STATUS,
  PRIORIDADES_AGENDA,
  PROXIMO_STATUS,
  TIPOS_AGENDA,
  calcularEficiencia,
  chaveDia,
  dataRef,
  isAtrasada,
  isConcluida,
  statusLabel,
  sugerirNovaData,
  semaforoDia,
  semaforoItem,
  SEMAFORO_CLS,
  SEMAFORO_LABEL,
  toLocalInput,
  type AgendaItem,
} from "@/lib/agenda-pessoal";

const SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function matriz(ref: Date) {
  const first = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const last = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  const dias: Date[] = [];
  for (let i = first.getDay(); i > 0; i--) {
    const d = new Date(first);
    d.setDate(d.getDate() - i);
    dias.push(d);
  }
  for (let d = 1; d <= last.getDate(); d++) dias.push(new Date(ref.getFullYear(), ref.getMonth(), d));
  while (dias.length % 7 !== 0) {
    const d = new Date(dias[dias.length - 1]);
    d.setDate(d.getDate() + 1);
    dias.push(d);
  }
  return dias;
}

const sameDay = (a: Date, b: Date) => chaveDia(a) === chaveDia(b);
const hora = (i: AgendaItem) =>
  i.start_at ? new Date(i.start_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";

const toneDe = (i: AgendaItem) =>
  isConcluida(i)
    ? "border-success/40 bg-success/10 text-success"
    : isAtrasada(i)
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : i.status === "em_andamento"
        ? "border-info/40 bg-info/10 text-info"
        : "border-primary/30 bg-primary/10 text-primary";

/**
 * Agenda pessoal estilo Google dentro do "Meu Dia":
 * clique no dia → cadastro do compromisso, atividades do dia listadas abaixo
 * com pipeline de evolução, atraso destacado e reprogramação sugerida.
 * Todos os dados são exclusivos do usuário logado (RLS por user_id).
 */
export function AgendaPessoal() {
  const { lista, isLoading, criar, atualizar, excluir } = useAgendaPessoal();
  const [ref, setRef] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());
  const [form, setForm] = useState<{ base: Date; item: AgendaItem | null } | null>(null);
  const [reagendar, setReagendar] = useState<AgendaItem | null>(null);

  const porDia = useMemo(() => {
    const map = new Map<string, AgendaItem[]>();
    for (const i of lista) {
      const k = chaveDia(dataRef(i));
      map.set(k, [...(map.get(k) ?? []), i]);
    }
    for (const arr of map.values())
      arr.sort((a, b) => dataRef(a).getTime() - dataRef(b).getTime());
    return map;
  }, [lista]);

  const dias = useMemo(() => matriz(ref), [ref]);
  const doDia = porDia.get(chaveDia(selected)) ?? [];
  const efDia = calcularEficiencia(doDia);
  const atrasadas = useMemo(() => lista.filter((i) => isAtrasada(i)), [lista]);

  const avancar = (i: AgendaItem) => {
    const prox = PROXIMO_STATUS[i.status];
    if (!prox) return;
    atualizar.mutate(
      { id: i.id, patch: { status: prox } },
      {
        onSuccess: () =>
          toast.success(prox === "concluida" ? "Atividade concluída. 👏" : "Atividade iniciada."),
      },
    );
  };

  return (
    <Card>
      <CardHeader className="flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-primary" />
            Minha agenda do dia
          </CardTitle>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Visível somente para você — clique em qualquer dia para
            lançar um compromisso.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Button variant="outline" size="icon" aria-label="Mês anterior"
            onClick={() => setRef(new Date(ref.getFullYear(), ref.getMonth() - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[9rem] text-center text-sm font-semibold capitalize">
            {ref.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </div>
          <Button variant="outline" size="icon" aria-label="Próximo mês"
            onClick={() => setRef(new Date(ref.getFullYear(), ref.getMonth() + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setRef(new Date()); setSelected(new Date()); }}>
            Hoje
          </Button>
          <Button size="sm" onClick={() => setForm({ base: selected, item: null })}>
            <Plus className="mr-1 h-4 w-4" /> Novo
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-muted-foreground">
            {SEMANA.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          {isLoading ? (
            <Skeleton className="mt-1 h-72 w-full" />
          ) : (
            <div className="mt-1 grid grid-cols-7 gap-1">
              {dias.map((d) => {
                const k = chaveDia(d);
                const evs = porDia.get(k) ?? [];
                const outroMes = d.getMonth() !== ref.getMonth();
                const hoje = sameDay(d, new Date());
                const sel = sameDay(d, selected);
                const pend = evs.filter((e) => !isConcluida(e)).length;
                const sem = semaforoDia(evs);
                const cls = sem ? SEMAFORO_CLS[sem] : null;
                const multi = evs.length > 1;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelected(d)}
                    onDoubleClick={() => { setSelected(d); setForm({ base: d, item: null }); }}
                    title={
                      evs.length === 0
                        ? "Clique para ver o dia · duplo clique para agendar"
                        : `${evs.length} atividade(s) — ${SEMAFORO_LABEL[sem!]}`
                    }
                    className={`group relative min-h-[4.75rem] overflow-hidden rounded-lg border p-1 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                      sel
                        ? "border-primary ring-1 ring-primary"
                        : cls
                          ? `${cls.border} ${cls.soft}`
                          : "border-border hover:bg-muted/50"
                    } ${outroMes ? "opacity-40" : ""}`}
                  >
                    {/* Faixa-semáforo: um segmento por atividade do dia */}
                    {evs.length > 0 && (
                      <span className="absolute inset-x-0 top-0 flex h-1 gap-px" aria-hidden>
                        {evs.slice(0, 6).map((e) => (
                          <span
                            key={e.id}
                            className={`flex-1 ${SEMAFORO_CLS[semaforoItem(e)].dot} ${
                              semaforoItem(e) === "vermelho" ? "semaforo-blink" : ""
                            }`}
                          />
                        ))}
                      </span>
                    )}
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`text-xs font-semibold ${hoje ? "text-primary" : "text-foreground"}`}>
                        {d.getDate()}
                      </span>
                      {pend > 0 && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-1.5 text-[10px] font-semibold ${
                            cls ? `${cls.soft} ${cls.text}` : "bg-primary/15 text-primary"
                          }`}
                        >
                          {multi && <span className={`h-1.5 w-1.5 rounded-full ${cls?.dot ?? ""}`} />}
                          {pend}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 space-y-0.5">
                      {evs.slice(0, 2).map((e) => (
                        <div key={e.id} className={`truncate rounded border px-1 text-[10px] ${toneDe(e)}`}>
                          {hora(e) && `${hora(e)} `}
                          {e.title}
                        </div>
                      ))}
                      {evs.length > 2 && (
                        <div className="px-1 text-[10px] font-medium text-muted-foreground">
                          +{evs.length - 2} atividades
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Legenda do semáforo */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
            <span className="font-semibold uppercase tracking-wide">Semáforo do prazo</span>
            {(["verde", "laranja", "vermelho"] as const).map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${SEMAFORO_CLS[s].dot} ${
                    s === "vermelho" ? "semaforo-blink" : ""
                  }`}
                />
                {SEMAFORO_LABEL[s]}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-2 w-6 gap-px overflow-hidden rounded-full">
                <span className="flex-1 bg-success" />
                <span className="flex-1 bg-warning" />
                <span className="flex-1 bg-destructive" />
              </span>
              Faixa dividida = mais de uma atividade no dia
            </span>
          </div>



          {atrasadas.length > 0 && (
            <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {atrasadas.length} atividade(s) com prazo ultrapassado
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Reprograme para manter seus indicadores confiáveis — a nova data sugerida já é o
                próximo dia útil.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {atrasadas.slice(0, 6).map((i) => (
                  <Button key={i.id} size="sm" variant="outline" onClick={() => setReagendar(i)}>
                    <CalendarClock className="mr-1 h-3.5 w-3.5" />
                    <span className="max-w-[12rem] truncate">{i.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-sm font-semibold capitalize">
              {selected.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
            </div>
            <Badge variant={efDia.percentual >= 80 ? "default" : "secondary"}>
              {efDia.concluidas}/{efDia.total} · {efDia.percentual}%
            </Badge>
          </div>

          {doDia.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Dia livre"
              description="Clique em Novo (ou duplo clique no dia) para planejar seu compromisso."
              compact
            />
          ) : (
            <ScrollArea className="h-[22rem] pr-2">
              <div className="space-y-2">
                {doDia.map((i) => {
                  const etapa = PIPELINE_STATUS.findIndex((p) => p.key === i.status);
                  const prox = PROXIMO_STATUS[i.status];
                  return (
                    <div
                      key={i.id}
                      className={`rounded-lg border p-2.5 ${
                        isConcluida(i)
                          ? "border-border bg-muted/40"
                          : isAtrasada(i)
                            ? "border-destructive/40 bg-destructive/5"
                            : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {TIPOS_AGENDA.find((t) => t.value === i.category)?.label ?? "Atividade"}
                            </Badge>
                            {i.priority && (
                              <Badge
                                variant={i.priority === "alta" ? "destructive" : "secondary"}
                                className="text-[10px] capitalize"
                              >
                                {i.priority}
                              </Badge>
                            )}
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {hora(i) || "Sem horário"}
                            </span>
                          </div>
                          <p className={`mt-1 text-sm font-medium ${isConcluida(i) ? "line-through" : ""}`}>
                            {i.title}
                          </p>
                          {i.description_safe && (
                            <p className="mt-0.5 line-clamp-2 whitespace-pre-line text-xs text-muted-foreground">
                              {i.description_safe}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          aria-label="Excluir atividade"
                          onClick={() => excluir.mutate(i.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Pipeline de evolução */}
                      <div className="mt-2 flex items-center gap-1">
                        {PIPELINE_STATUS.map((p, idx) => (
                          <div key={p.key} className="flex flex-1 items-center gap-1" title={p.hint}>
                            <div
                              className={`h-1.5 flex-1 rounded-full ${
                                idx <= etapa && etapa >= 0 ? "bg-primary" : "bg-muted"
                              }`}
                            />
                            {idx === PIPELINE_STATUS.length - 1 && (
                              <span className="text-[10px] font-medium text-muted-foreground">
                                {statusLabel(i.status)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {prox && (
                          <Button size="sm" variant={prox === "concluida" ? "default" : "outline"}
                            onClick={() => avancar(i)}>
                            {prox === "concluida" ? (
                              <><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Concluir</>
                            ) : (
                              <><PlayCircle className="mr-1 h-3.5 w-3.5" /> Iniciar</>
                            )}
                          </Button>
                        )}
                        {isConcluida(i) && (
                          <Button size="sm" variant="outline"
                            onClick={() => atualizar.mutate({ id: i.id, patch: { status: "pendente" } })}>
                            Reabrir
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setReagendar(i)}>
                          <CalendarClock className="mr-1 h-3.5 w-3.5" /> Reprogramar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setForm({ base: selected, item: i })}>
                          Editar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>

      <FormDialog
        state={form}
        onClose={() => setForm(null)}
        onCreate={(v) => criar.mutate(v, { onSuccess: () => setForm(null) })}
        onUpdate={(id, patch) =>
          atualizar.mutate({ id, patch }, {
            onSuccess: () => { toast.success("Compromisso atualizado."); setForm(null); },
          })
        }
        saving={criar.isPending || atualizar.isPending}
      />

      <ReagendarDialog
        item={reagendar}
        onClose={() => setReagendar(null)}
        onConfirm={(id, iso) =>
          atualizar.mutate({ id, patch: { start_at: iso, due_at: iso, status: "pendente" } }, {
            onSuccess: () => { toast.success("Prazo atualizado e indicadores recalculados."); setReagendar(null); },
          })
        }
      />
    </Card>
  );
}

function FormDialog({
  state,
  onClose,
  onCreate,
  onUpdate,
  saving,
}: {
  state: { base: Date; item: AgendaItem | null } | null;
  onClose: () => void;
  onCreate: (v: {
    title: string;
    description_safe: string | null;
    start_at: string | null;
    due_at: string | null;
    priority: string;
    category: string;
  }) => void;
  onUpdate: (id: string, patch: Record<string, unknown>) => void;
  saving: boolean;
}) {
  const item = state?.item ?? null;
  const inicioPadrao = useMemo(() => {
    if (item?.start_at) return toLocalInput(new Date(item.start_at));
    const d = new Date(state?.base ?? new Date());
    d.setHours(9, 0, 0, 0);
    return toLocalInput(d);
  }, [item, state?.base]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [inicio, setInicio] = useState(inicioPadrao);
  const [prazo, setPrazo] = useState("");
  const [tipo, setTipo] = useState("reuniao");
  const [prioridade, setPrioridade] = useState("media");
  const [key, setKey] = useState("");

  // Reidrata o formulário quando abre para outro dia/atividade.
  const openKey = `${state ? chaveDia(state.base) : ""}-${item?.id ?? "novo"}`;
  if (state && key !== openKey) {
    setKey(openKey);
    setTitulo(item?.title ?? "");
    setDescricao(item?.description_safe ?? "");
    setInicio(inicioPadrao);
    setPrazo(item?.due_at ? toLocalInput(new Date(item.due_at)) : "");
    setTipo(item?.category ?? "reuniao");
    setPrioridade(item?.priority ?? "media");
  }

  const salvar = () => {
    if (!titulo.trim()) {
      toast.error("Informe o título do compromisso.");
      return;
    }
    const startIso = inicio ? new Date(inicio).toISOString() : null;
    const dueIso = prazo ? new Date(prazo).toISOString() : startIso;
    if (item) {
      onUpdate(item.id, {
        title: titulo.trim(),
        description_safe: descricao.trim() || null,
        start_at: startIso,
        due_at: dueIso,
        priority: prioridade,
        category: tipo,
      });
      return;
    }
    onCreate({
      title: titulo.trim(),
      description_safe: descricao.trim() || null,
      start_at: startIso,
      due_at: dueIso,
      priority: prioridade,
      category: tipo,
    });
  };

  return (
    <Dialog open={!!state} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Editar compromisso" : "Novo compromisso"}</DialogTitle>
          <DialogDescription>
            {state
              ? state.base.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ag-titulo">Título</Label>
            <Input
              id="ag-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Reunião de produção · linha 2"
              autoFocus
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ag-inicio">Início</Label>
              <Input id="ag-inicio" type="datetime-local" value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ag-prazo">Prazo (opcional)</Label>
              <Input id="ag-prazo" type="datetime-local" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_AGENDA.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prioridade</Label>
              <Select value={prioridade} onValueChange={setPrioridade}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORIDADES_AGENDA.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ag-desc">Detalhes / resultado esperado</Label>
            <Textarea
              id="ag-desc"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Pauta, participantes externos, entregável combinado..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={salvar} disabled={saving}>
            {item ? "Salvar alterações" : "Agendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReagendarDialog({
  item,
  onClose,
  onConfirm,
}: {
  item: AgendaItem | null;
  onClose: () => void;
  onConfirm: (id: string, iso: string) => void;
}) {
  const sugestao = item ? toLocalInput(sugerirNovaData(item)) : "";
  const [valor, setValor] = useState("");
  const [key, setKey] = useState("");
  if (item && key !== item.id) {
    setKey(item.id);
    setValor(sugestao);
  }

  return (
    <Dialog open={!!item} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reprogramar atividade</DialogTitle>
          <DialogDescription>
            {item?.title} — prazo original{" "}
            {item?.due_at ? new Date(item.due_at).toLocaleString("pt-BR") : "não definido"}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="ag-nova">Nova data e hora (sugerida: próximo dia útil)</Label>
          <Input id="ag-nova" type="datetime-local" value={valor} onChange={(e) => setValor(e.target.value)} />
          <p className="text-xs text-muted-foreground">
            Ao confirmar, a atividade volta para "Planejada" e todos os indicadores de eficiência
            são recalculados.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => item && valor && onConfirm(item.id, new Date(valor).toISOString())}
            disabled={!valor}
          >
            Confirmar nova data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
