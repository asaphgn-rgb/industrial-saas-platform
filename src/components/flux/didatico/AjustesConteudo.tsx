import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/flux/EmptyState";
import { LoadingState } from "@/components/flux/LoadingState";
import {
  atualizarStatusAjuste,
  criarAjusteConteudo,
  listarAjustesConteudo,
  removerAjuste,
  STATUS_AJUSTE_LABEL,
  type StatusAjuste,
  type TipoAjuste,
} from "@/lib/didatico-ajustes.functions";

const TOM_STATUS: Record<StatusAjuste, string> = {
  aberto: "bg-flux-warning-soft text-warning",
  em_andamento: "bg-muted text-muted-foreground",
  concluido: "bg-flux-success-soft text-success",
  dispensado: "bg-muted text-muted-foreground",
};

const TOM_PRIORIDADE: Record<string, string> = {
  critica: "bg-destructive/10 text-destructive",
  alta: "bg-flux-warning-soft text-warning",
  media: "bg-muted text-muted-foreground",
  baixa: "bg-muted text-muted-foreground",
};

/**
 * Solicitações de ajuste em um rascunho.
 * O especialista aponta exatamente o que corrigir antes de aprovar,
 * em vez de devolver o conteúdo sem direção.
 */
export function AjustesConteudo({
  conteudoId,
  campos,
}: {
  conteudoId: string;
  campos: string[];
}) {
  const qc = useQueryClient();
  const listar = useServerFn(listarAjustesConteudo);
  const criar = useServerFn(criarAjusteConteudo);
  const mudar = useServerFn(atualizarStatusAjuste);
  const excluir = useServerFn(removerAjuste);

  const [tipo, setTipo] = useState<TipoAjuste>("tarefa");
  const [campo, setCampo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [responsavel, setResponsavel] = useState("");
  const [prazo, setPrazo] = useState("");

  const chave = ["didatico-ajustes", conteudoId];
  const ajustes = useQuery({
    queryKey: chave,
    queryFn: () => listar({ data: { conteudo_id: conteudoId } }),
  });

  const invalidar = () => qc.invalidateQueries({ queryKey: ["didatico-ajustes"] });

  const novo = useMutation({
    mutationFn: () =>
      criar({
        data: {
          conteudo_id: conteudoId,
          tipo,
          descricao,
          prioridade: prioridade as "critica" | "alta" | "media" | "baixa",
          ...(campo ? { campo_alvo: campo } : {}),
          ...(responsavel ? { responsavel_nome: responsavel } : {}),
          ...(prazo ? { prazo } : {}),
        },
      }),
    onSuccess: () => {
      toast.success("Ajuste registrado para este rascunho.");
      setDescricao("");
      setCampo("");
      setResponsavel("");
      setPrazo("");
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível registrar o ajuste."),
  });

  const alterar = useMutation({
    mutationFn: (v: { id: string; status: StatusAjuste }) => mudar({ data: v }),
    onSuccess: invalidar,
    onError: (e: Error) => toast.error(e.message),
  });

  const apagar = useMutation({
    mutationFn: (id: string) => excluir({ data: { id } }),
    onSuccess: () => {
      toast.success("Ajuste removido.");
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const abertos = ajustes.data?.filter((a) => a.status === "aberto" || a.status === "em_andamento");

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden /> Ajustes solicitados
        </p>
        {!!abertos?.length && (
          <Badge variant="secondary" className={TOM_STATUS["aberto"]}>
            {abertos.length} pendente(s)
          </Badge>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">Tipo</Label>
          <Select value={tipo} onValueChange={(v) => setTipo(v as TipoAjuste)}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tarefa">Tarefa (alguém precisa executar)</SelectItem>
              <SelectItem value="comentario">Comentário (observação técnica)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Campo alvo</Label>
          <Select value={campo || "__geral__"} onValueChange={(v) => setCampo(v === "__geral__" ? "" : v)}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__geral__">Conteúdo geral</SelectItem>
              {campos.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Prioridade</Label>
          <Select value={prioridade} onValueChange={setPrioridade}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critica">Crítica</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="aj-resp" className="text-xs">
            Responsável
          </Label>
          <Input
            id="aj-resp"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            className="h-10"
            placeholder="Quem executa o ajuste"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="aj-prazo" className="text-xs">
            Prazo
          </Label>
          <Input
            id="aj-prazo"
            type="date"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="aj-desc" className="text-xs">
            O que precisa ser corrigido
          </Label>
          <Textarea
            id="aj-desc"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            placeholder="Ex.: incluir a faixa de temperatura de selagem validada e citar a norma na fonte."
          />
        </div>
      </div>

      <Button
        type="button"
        className="h-10 gap-2"
        disabled={novo.isPending || descricao.trim().length < 5}
        onClick={() => novo.mutate()}
      >
        <Plus className="h-4 w-4" aria-hidden /> Solicitar ajuste
      </Button>

      {ajustes.isLoading && <LoadingState variant="list" rows={2} />}
      {ajustes.data?.length === 0 && (
        <EmptyState title="Nenhum ajuste solicitado neste rascunho." compact />
      )}

      <div className="space-y-2">
        {ajustes.data?.map((a) => (
          <div key={a.id} className="rounded-lg border border-border p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">
                {a.tipo === "tarefa" ? "Tarefa" : "Comentário"}
                {a.campo_alvo ? ` · ${a.campo_alvo}` : ""}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={TOM_PRIORIDADE[a.prioridade]}>
                  {a.prioridade}
                </Badge>
                <Badge variant="secondary" className={TOM_STATUS[a.status]}>
                  {STATUS_AJUSTE_LABEL[a.status]}
                </Badge>
              </div>
            </div>
            <p className="mt-1 whitespace-pre-wrap">{a.descricao}</p>
            <p className="mt-1 text-muted-foreground">
              {new Date(a.created_at).toLocaleString("pt-BR")}
              {a.autor_nome ? ` · ${a.autor_nome}` : ""}
              {a.responsavel_nome ? ` · resp. ${a.responsavel_nome}` : ""}
              {a.prazo ? ` · prazo ${new Date(a.prazo).toLocaleDateString("pt-BR")}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Select
                value={a.status}
                onValueChange={(v) => alterar.mutate({ id: a.id, status: v as StatusAjuste })}
              >
                <SelectTrigger className="h-9 w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_AJUSTE_LABEL) as StatusAjuste[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_AJUSTE_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 gap-1 text-destructive"
                onClick={() => apagar.mutate(a.id)}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remover
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
