import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase as typed } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  MapPin,
  Users,
  Trash2,
  Check,
  X,
  Clock,
} from "lucide-react";
import { format, addMonths, isSameDay, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typed as any;

export const DEPARTAMENTOS = [
  "Comercial",
  "Engenharia",
  "PCP",
  "Produção",
  "Qualidade",
  "Manutenção",
  "Suprimentos",
  "Estoque",
  "Expedição",
  "Financeiro",
  "Fiscal",
  "RH",
  "TI",
  "Diretoria",
] as const;

const TIPOS: Record<string, { label: string; cls: string }> = {
  reuniao: { label: "Reunião", cls: "bg-primary/15 text-primary border-primary/30" },
  tarefa: { label: "Tarefa", cls: "bg-muted text-foreground border-border" },
  prazo: { label: "Prazo", cls: "bg-warning/15 text-warning border-warning/30" },
  comunicado: { label: "Comunicado", cls: "bg-info/15 text-info border-info/30" },
  visita: { label: "Visita", cls: "bg-success/15 text-success border-success/30" },
};

const PRIORIDADES = ["baixa", "normal", "alta", "critica"];

interface Evento {
  id: string;
  tenant_id: string;
  titulo: string;
  descricao: string | null;
  inicio: string;
  fim: string | null;
  dia_inteiro: boolean;
  local: string | null;
  tipo: string;
  prioridade: string;
  status: string;
  departamentos: string[];
  created_by: string;
}

interface Participante {
  id: string;
  evento_id: string;
  user_id: string | null;
  nome: string | null;
  departamento: string | null;
  resposta: string;
}

function monthMatrix(ref: Date) {
  const first = startOfMonth(ref);
  const last = endOfMonth(ref);
  const days: Date[] = [];
  const startPad = first.getDay();
  for (let i = startPad; i > 0; i--) {
    const d = new Date(first);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(ref.getFullYear(), ref.getMonth(), d));
  }
  while (days.length % 7 !== 0) {
    const d = new Date(days[days.length - 1]);
    d.setDate(d.getDate() + 1);
    days.push(d);
  }
  return days;
}

export function AgendaDepartamental() {
  const qc = useQueryClient();
  const [ref, setRef] = useState(() => new Date());
  const [selected, setSelected] = useState<Date>(() => new Date());
  const [openNovo, setOpenNovo] = useState(false);
  const [detalhe, setDetalhe] = useState<Evento | null>(null);

  const { data: me } = useQuery({
    queryKey: ["agenda", "me"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data?.user?.id ?? null;
      const { data: tid } = await supabase.rpc("current_tenant_id");
      const { data: prof } = uid
        ? await supabase.from("profiles").select("nome_completo, setor").eq("id", uid).maybeSingle()
        : { data: null };
      return {
        userId: uid as string | null,
        tenantId: (tid as string | null) ?? null,
        nome: prof?.nome_completo ?? null,
        setor: prof?.setor ?? null,
      };
    },
    staleTime: 5 * 60_000,
  });

  const { data: pessoas } = useQuery({
    queryKey: ["agenda", "pessoas"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, nome_completo, email, setor")
        .eq("ativo", true)
        .order("nome_completo")
        .limit(200);
      return (data ?? []) as Array<{
        id: string;
        nome_completo: string | null;
        email: string;
        setor: string | null;
      }>;
    },
    staleTime: 5 * 60_000,
  });

  const mesKey = format(ref, "yyyy-MM");
  const eventos = useQuery({
    queryKey: ["agenda", "eventos", mesKey],
    queryFn: async () => {
      const de = new Date(ref.getFullYear(), ref.getMonth() - 1, 20).toISOString();
      const ate = new Date(ref.getFullYear(), ref.getMonth() + 2, 10).toISOString();
      const { data, error } = await supabase
        .from("agenda_eventos")
        .select("*")
        .gte("inicio", de)
        .lte("inicio", ate)
        .order("inicio");
      if (error) throw error;
      return (data ?? []) as Evento[];
    },
    staleTime: 30_000,
  });

  const participantes = useQuery({
    queryKey: ["agenda", "participantes", detalhe?.id],
    enabled: !!detalhe?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("agenda_participantes")
        .select("*")
        .eq("evento_id", detalhe!.id);
      return (data ?? []) as Participante[];
    },
  });

  const dias = useMemo(() => monthMatrix(ref), [ref]);
  const porDia = useMemo(() => {
    const map = new Map<string, Evento[]>();
    for (const e of eventos.data ?? []) {
      const k = format(new Date(e.inicio), "yyyy-MM-dd");
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    return map;
  }, [eventos.data]);

  const doDia = porDia.get(format(selected, "yyyy-MM-dd")) ?? [];

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["agenda", "eventos"] });
    qc.invalidateQueries({ queryKey: ["agenda", "participantes"] });
  };

  const excluir = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("agenda_eventos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Compromisso excluído");
      setDetalhe(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const responder = useMutation({
    mutationFn: async ({ id, resposta }: { id: string; resposta: string }) => {
      const { error } = await supabase
        .from("agenda_participantes")
        .update({ resposta })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Resposta registrada");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4 text-primary" />
          Agenda dos departamentos
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => setRef(addMonths(ref, -1))} aria-label="Mês anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[9rem] text-center text-sm font-semibold capitalize">
            {format(ref, "MMMM 'de' yyyy", { locale: ptBR })}
          </div>
          <Button variant="outline" size="icon" onClick={() => setRef(addMonths(ref, 1))} aria-label="Próximo mês">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const h = new Date();
              setRef(h);
              setSelected(h);
            }}
          >
            Hoje
          </Button>
          <Button size="sm" onClick={() => setOpenNovo(true)}>
            <Plus className="mr-1 h-4 w-4" /> Novo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-muted-foreground">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          {eventos.isLoading ? (
            <Skeleton className="mt-1 h-64 w-full" />
          ) : (
            <div className="mt-1 grid grid-cols-7 gap-1">
              {dias.map((d) => {
                const k = format(d, "yyyy-MM-dd");
                const evs = porDia.get(k) ?? [];
                const outroMes = d.getMonth() !== ref.getMonth();
                const hoje = isSameDay(d, new Date());
                const sel = isSameDay(d, selected);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelected(d)}
                    className={`min-h-[4.25rem] rounded-lg border p-1 text-left transition ${
                      sel ? "border-primary ring-1 ring-primary" : "border-border hover:bg-muted/50"
                    } ${outroMes ? "opacity-40" : ""}`}
                  >
                    <div
                      className={`text-xs font-semibold ${hoje ? "text-primary" : "text-foreground"}`}
                    >
                      {d.getDate()}
                    </div>
                    <div className="mt-0.5 space-y-0.5">
                      {evs.slice(0, 2).map((e) => (
                        <div
                          key={e.id}
                          className={`truncate rounded border px-1 text-[10px] ${TIPOS[e.tipo]?.cls ?? TIPOS.tarefa.cls}`}
                        >
                          {e.dia_inteiro ? "" : `${format(new Date(e.inicio), "HH:mm")} `}
                          {e.titulo}
                        </div>
                      ))}
                      {evs.length > 2 && (
                        <div className="px-1 text-[10px] text-muted-foreground">
                          +{evs.length - 2} mais
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-2 text-sm font-semibold capitalize">
            {format(selected, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </div>
          {doDia.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Sem compromissos"
              description="Clique em Novo para lançar um compromisso e convidar pessoas ou departamentos."
              compact
            />
          ) : (
            <ScrollArea className="h-64 pr-2">
              <div className="space-y-2">
                {doDia.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setDetalhe(e)}
                    className="w-full rounded-lg border border-border p-2 text-left transition hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={TIPOS[e.tipo]?.cls}>
                        {TIPOS[e.tipo]?.label ?? e.tipo}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {e.dia_inteiro ? "Dia inteiro" : format(new Date(e.inicio), "HH:mm")}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-sm font-medium">{e.titulo}</div>
                    {e.departamentos?.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {e.departamentos.map((d) => (
                          <Badge key={d} variant="secondary" className="text-[10px]">
                            {d}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>

      <NovoEventoDialog
        open={openNovo}
        onOpenChange={setOpenNovo}
        dataBase={selected}
        tenantId={me?.tenantId ?? null}
        userId={me?.userId ?? null}
        setorPadrao={me?.setor ?? null}
        pessoas={pessoas ?? []}
        onSaved={invalidate}
      />

      <Dialog open={!!detalhe} onOpenChange={(v) => !v && setDetalhe(null)}>
        <DialogContent className="max-w-lg">
          {detalhe && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Badge variant="outline" className={TIPOS[detalhe.tipo]?.cls}>
                    {TIPOS[detalhe.tipo]?.label ?? detalhe.tipo}
                  </Badge>
                  {detalhe.titulo}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {detalhe.dia_inteiro
                      ? format(new Date(detalhe.inicio), "dd/MM/yyyy") + " · dia inteiro"
                      : `${format(new Date(detalhe.inicio), "dd/MM/yyyy HH:mm")}${
                          detalhe.fim ? ` → ${format(new Date(detalhe.fim), "HH:mm")}` : ""
                        }`}
                  </span>
                  {detalhe.local && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {detalhe.local}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              {detalhe.descricao && (
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {detalhe.descricao}
                </p>
              )}

              {detalhe.departamentos?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {detalhe.departamentos.map((d) => (
                    <Badge key={d} variant="secondary">
                      {d}
                    </Badge>
                  ))}
                </div>
              )}

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4" /> Participantes
                </div>
                <div className="space-y-1">
                  {(participantes.data ?? []).length === 0 && (
                    <p className="text-xs text-muted-foreground">Nenhum convidado.</p>
                  )}
                  {(participantes.data ?? []).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-md border border-border px-2 py-1 text-sm"
                    >
                      <span className="truncate">
                        {p.nome ?? p.departamento ?? "—"}
                        {p.departamento && p.nome ? (
                          <span className="text-muted-foreground"> · {p.departamento}</span>
                        ) : null}
                      </span>
                      {p.user_id && p.user_id === me?.userId ? (
                        <span className="flex gap-1">
                          <Button
                            size="sm"
                            variant={p.resposta === "confirmado" ? "default" : "outline"}
                            onClick={() => responder.mutate({ id: p.id, resposta: "confirmado" })}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={p.resposta === "recusado" ? "destructive" : "outline"}
                            onClick={() => responder.mutate({ id: p.id, resposta: "recusado" })}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </span>
                      ) : (
                        <Badge
                          variant={
                            p.resposta === "confirmado"
                              ? "default"
                              : p.resposta === "recusado"
                                ? "destructive"
                                : "outline"
                          }
                          className="capitalize"
                        >
                          {p.resposta}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                {detalhe.created_by === me?.userId && (
                  <Button
                    variant="destructive"
                    onClick={() => excluir.mutate(detalhe.id)}
                    disabled={excluir.isPending}
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Excluir
                  </Button>
                )}
                <Button variant="outline" onClick={() => setDetalhe(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function NovoEventoDialog({
  open,
  onOpenChange,
  dataBase,
  tenantId,
  userId,
  setorPadrao,
  pessoas,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  dataBase: Date;
  tenantId: string | null;
  userId: string | null;
  setorPadrao: string | null;
  pessoas: Array<{ id: string; nome_completo: string | null; email: string; setor: string | null }>;
  onSaved: () => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("reuniao");
  const [prioridade, setPrioridade] = useState("normal");
  const [data, setData] = useState(format(dataBase, "yyyy-MM-dd"));
  const [hora, setHora] = useState("09:00");
  const [horaFim, setHoraFim] = useState("10:00");
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [local, setLocal] = useState("");
  const [deps, setDeps] = useState<string[]>(setorPadrao ? [setorPadrao] : []);
  const [convidados, setConvidados] = useState<string[]>([]);

  const salvar = useMutation({
    mutationFn: async () => {
      if (!tenantId) throw new Error("Empresa ativa não identificada.");
      if (!titulo.trim()) throw new Error("Informe o título do compromisso.");
      const inicio = new Date(`${data}T${diaInteiro ? "00:00" : hora}:00`);
      const fim = diaInteiro ? null : new Date(`${data}T${horaFim}:00`);
      const { data: ev, error } = await supabase
        .from("agenda_eventos")
        .insert({
          tenant_id: tenantId,
          titulo: titulo.trim(),
          descricao: descricao.trim() || null,
          inicio: inicio.toISOString(),
          fim: fim ? fim.toISOString() : null,
          dia_inteiro: diaInteiro,
          local: local.trim() || null,
          tipo,
          prioridade,
          departamentos: deps,
          created_by: userId,
        })
        .select("id")
        .single();
      if (error) throw error;
      if (convidados.length > 0) {
        const rows = convidados.map((id) => {
          const p = pessoas.find((x) => x.id === id);
          return {
            evento_id: ev.id,
            tenant_id: tenantId,
            user_id: id,
            nome: p?.nome_completo ?? p?.email ?? null,
            departamento: p?.setor ?? null,
          };
        });
        const { error: e2 } = await supabase.from("agenda_participantes").insert(rows);
        if (e2) throw e2;
      }
    },
    onSuccess: () => {
      toast.success("Compromisso criado e convites enviados");
      onOpenChange(false);
      setTitulo("");
      setDescricao("");
      setLocal("");
      setConvidados([]);
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo compromisso</DialogTitle>
          <DialogDescription>
            Lance reuniões, prazos e comunicados e convide pessoas ou departamentos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="ag-titulo">Título</Label>
            <Input
              id="ag-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Reunião de planejamento semanal"
            />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIPOS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prioridade</Label>
            <Select value={prioridade} onValueChange={setPrioridade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORIDADES.map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ag-data">Data</Label>
            <Input
              id="ag-data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="ag-hora">Início</Label>
              <Input
                id="ag-hora"
                type="time"
                value={hora}
                disabled={diaInteiro}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="ag-hora-fim">Fim</Label>
              <Input
                id="ag-hora-fim"
                type="time"
                value={horaFim}
                disabled={diaInteiro}
                onChange={(e) => setHoraFim(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox
              id="ag-dia"
              checked={diaInteiro}
              onCheckedChange={(v) => setDiaInteiro(!!v)}
            />
            <Label htmlFor="ag-dia" className="cursor-pointer">
              Dia inteiro
            </Label>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="ag-local">Local / link</Label>
            <Input
              id="ag-local"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="Sala de reuniões, chão de fábrica, link de vídeo…"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="ag-desc">Descrição / pauta</Label>
            <Textarea
              id="ag-desc"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Objetivo, pauta e o que cada departamento precisa trazer."
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Departamentos envolvidos</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {DEPARTAMENTOS.map((d) => {
                const on = deps.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setDeps(on ? deps.filter((x) => x !== d) : [...deps, d])
                    }
                    className={`rounded-full border px-2.5 py-1 text-xs transition ${
                      on
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label>Convidar pessoas</Label>
            <ScrollArea className="mt-1 h-40 rounded-md border border-border p-2">
              <div className="space-y-1">
                {pessoas.length === 0 && (
                  <p className="text-xs text-muted-foreground">Nenhum usuário disponível.</p>
                )}
                {pessoas.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm hover:bg-muted"
                  >
                    <Checkbox
                      checked={convidados.includes(p.id)}
                      onCheckedChange={(v) =>
                        setConvidados(
                          v ? [...convidados, p.id] : convidados.filter((x) => x !== p.id),
                        )
                      }
                    />
                    <span className="truncate">{p.nome_completo ?? p.email}</span>
                    {p.setor && (
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        {p.setor}
                      </Badge>
                    )}
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => salvar.mutate()} disabled={salvar.isPending}>
            {salvar.isPending ? "Salvando…" : "Criar compromisso"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
