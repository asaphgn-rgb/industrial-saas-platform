import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase as typed } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { DEPARTAMENTOS } from "@/components/flux/AgendaDepartamental";
import { toast } from "sonner";
import { LifeBuoy, Plus, Send, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typed as any;

interface Solicitacao {
  id: string;
  titulo: string;
  descricao: string | null;
  departamento: string;
  etapa: string;
  tipo: string;
  prioridade: string;
  status: string;
  solicitante_id: string | null;
  solicitante_nome: string | null;
  created_at: string;
}

const PRIORIDADE_TONE: Record<string, string> = {
  critica: "bg-destructive/15 text-destructive border-destructive/30",
  alta: "bg-warning/15 text-warning border-warning/30",
  normal: "bg-muted text-foreground border-border",
  baixa: "bg-muted text-muted-foreground border-border",
};

export function SolicitacoesDepartamento() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: me } = useQuery({
    queryKey: ["solic-dep", "me"],
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
        setor: (prof?.setor as string | null) ?? null,
      };
    },
    staleTime: 5 * 60_000,
  });

  const lista = useQuery({
    queryKey: ["solic-dep", "lista"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solicitacoes_apoio")
        .select(
          "id, titulo, descricao, departamento, etapa, tipo, prioridade, status, solicitante_id, solicitante_nome, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return (data ?? []) as Solicitacao[];
    },
    staleTime: 30_000,
  });

  const criar = useMutation({
    mutationFn: async (payload: {
      titulo: string;
      descricao: string;
      departamento: string;
      prioridade: string;
      tipo: string;
    }) => {
      if (!me?.tenantId) throw new Error("Empresa ativa não identificada.");
      if (!payload.titulo.trim()) throw new Error("Informe o assunto da solicitação.");
      const { error } = await supabase.from("solicitacoes_apoio").insert({
        tenant_id: me.tenantId,
        titulo: payload.titulo.trim(),
        descricao: payload.descricao.trim() || null,
        departamento: payload.departamento,
        etapa: me.setor ?? "geral",
        tipo: payload.tipo,
        prioridade: payload.prioridade,
        status: "aberta",
        solicitante_id: me.userId,
        solicitante_nome: me.nome,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Solicitação enviada ao departamento");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["solic-dep", "lista"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const concluir = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("solicitacoes_apoio")
        .update({
          status: "concluida",
          concluida_em: new Date().toISOString(),
          atendente_id: me?.userId ?? null,
          atendente_nome: me?.nome ?? null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Solicitação concluída");
      qc.invalidateQueries({ queryKey: ["solic-dep", "lista"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const todas = lista.data ?? [];
  const abertas = todas.filter((s) => s.status !== "concluida" && s.status !== "cancelada");
  const paraMim = abertas.filter((s) => (me?.setor ? s.departamento === me.setor : false));
  const minhas = abertas.filter((s) => s.solicitante_id === me?.userId);

  const render = (rows: Solicitacao[], vazio: string, podeConcluir: boolean) =>
    lista.isLoading ? (
      <div className="space-y-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    ) : rows.length === 0 ? (
      <EmptyState icon={LifeBuoy} title={vazio} compact />
    ) : (
      <div className="space-y-2">
        {rows.map((s) => (
          <div key={s.id} className="rounded-lg border border-border p-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={PRIORIDADE_TONE[s.prioridade] ?? ""}>
                {s.prioridade}
              </Badge>
              <Badge variant="secondary">{s.departamento}</Badge>
              <span className="text-xs text-muted-foreground">
                {format(new Date(s.created_at), "dd/MM HH:mm")}
              </span>
              {podeConcluir && (
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                  onClick={() => concluir.mutate(s.id)}
                  disabled={concluir.isPending}
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Concluir
                </Button>
              )}
            </div>
            <div className="mt-1 text-sm font-medium">{s.titulo}</div>
            {s.descricao && (
              <p className="line-clamp-2 text-xs text-muted-foreground">{s.descricao}</p>
            )}
            <div className="mt-1 text-[11px] text-muted-foreground">
              De: {s.solicitante_nome ?? "—"} · {s.etapa}
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <LifeBuoy className="h-4 w-4 text-primary" />
          Solicitações entre departamentos
        </CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> Solicitar apoio
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="para-mim">
          <TabsList className="mb-3">
            <TabsTrigger value="para-mim">
              Para o meu setor
              {paraMim.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {paraMim.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="minhas">Enviadas por mim</TabsTrigger>
            <TabsTrigger value="todas">Todas abertas</TabsTrigger>
          </TabsList>
          <TabsContent value="para-mim">
            {render(paraMim, "Nenhuma solicitação para o seu setor", true)}
          </TabsContent>
          <TabsContent value="minhas">
            {render(minhas, "Você não abriu solicitações", false)}
          </TabsContent>
          <TabsContent value="todas">
            {render(abertas, "Nenhuma solicitação aberta", false)}
          </TabsContent>
        </Tabs>
      </CardContent>

      <NovaSolicitacaoDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(p) => criar.mutate(p)}
        saving={criar.isPending}
      />
    </Card>
  );
}

function NovaSolicitacaoDialog({
  open,
  onOpenChange,
  onSubmit,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (p: {
    titulo: string;
    descricao: string;
    departamento: string;
    prioridade: string;
    tipo: string;
  }) => void;
  saving: boolean;
}) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [departamento, setDepartamento] = useState<string>("Manutenção");
  const [prioridade, setPrioridade] = useState("normal");
  const [tipo, setTipo] = useState("apoio");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar apoio a um departamento</DialogTitle>
          <DialogDescription>
            A solicitação fica registrada e visível para o departamento responsável.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="sol-titulo">Assunto</Label>
            <Input
              id="sol-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Ajuste de tratamento corona na extrusora 02"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>Departamento</Label>
              <Select value={departamento} onValueChange={setDepartamento}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTAMENTOS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["apoio", "informacao", "aprovacao", "correcao"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
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
                  {["baixa", "normal", "alta", "critica"].map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="sol-desc">Detalhes</Label>
            <Textarea
              id="sol-desc"
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o que precisa, prazo desejado e impacto."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => onSubmit({ titulo, descricao, departamento, prioridade, tipo })}
            disabled={saving}
          >
            <Send className="mr-1 h-4 w-4" />
            {saving ? "Enviando…" : "Enviar solicitação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
