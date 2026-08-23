import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ClipboardCheck, History, MessageSquareHeart, ThumbsDown, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  listarTentativas,
  registrarFeedbackTentativa,
  registrarTentativa,
  RESULTADO_LABEL,
  type ResultadoTentativa,
} from "@/lib/didatico-tentativas.functions";
import { criteriosValidacaoDe, type ProblemaSolucao } from "@/lib/didatico/tipos";

const TONE: Record<ResultadoTentativa, string> = {
  resolvido: "bg-flux-success-soft text-success",
  parcial: "bg-flux-warning-soft text-warning",
  nao_resolvido: "bg-destructive/10 text-destructive",
  escalado: "bg-muted text-muted-foreground",
};

/**
 * Registro da tentativa de correção do operador e histórico auditável
 * do problema selecionado na estação.
 */
export function RegistroTentativa({
  etapa,
  problema,
}: {
  etapa: string;
  problema: ProblemaSolucao;
}) {
  const qc = useQueryClient();
  const salvar = useServerFn(registrarTentativa);
  const buscar = useServerFn(listarTentativas);
  const enviarFeedback = useServerFn(registrarFeedbackTentativa);

  const [acoes, setAcoes] = useState<string[]>([]);
  const [resultado, setResultado] = useState<ResultadoTentativa>("resolvido");
  const [tempo, setTempo] = useState("");
  const [operador, setOperador] = useState("");
  const [maquina, setMaquina] = useState("");
  const [observacao, setObservacao] = useState("");
  // Tentativa recém-registrada aguardando o feedback do operador.
  const [tentativaId, setTentativaId] = useState<string | null>(null);
  const [util, setUtil] = useState<boolean | null>(null);
  const [fbObs, setFbObs] = useState("");
  const [fbSev, setFbSev] = useState<"critica" | "alta" | "media" | "baixa">("media");

  const chave = ["didatico-tentativas", etapa, problema.codigo];
  const hist = useQuery({
    queryKey: chave,
    queryFn: () => buscar({ data: { etapa, problema_codigo: problema.codigo, limite: 50 } }),
  });

  const m = useMutation({
    mutationFn: () =>
      salvar({
        data: {
          etapa,
          problema_codigo: problema.codigo,
          problema_titulo: problema.titulo,
          severidade: problema.severidade,
          acoes_executadas: acoes,
          resultado,
          tempo_min: tempo ? Number(tempo) : null,
          operador_nome: operador,
          maquina,
          observacao,
        },
      }),
    onSuccess: (r) => {
      toast.success("Tentativa registrada na trilha de auditoria.");
      setTentativaId(r.id);
      setUtil(null);
      setFbObs("");
      setAcoes([]);
      setObservacao("");
      setTempo("");
      qc.invalidateQueries({ queryKey: chave });
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível registrar."),
  });

  const fb = useMutation({
    mutationFn: () =>
      enviarFeedback({
        data: {
          id: tentativaId!,
          feedback_util: util!,
          feedback_observacao: fbObs,
          feedback_severidade: fbSev,
        },
      }),
    onSuccess: () => {
      toast.success("Obrigado! Seu retorno ajusta as recomendações.");
      setTentativaId(null);
      qc.invalidateQueries({ queryKey: chave });
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível enviar o feedback."),
  });

  const criterios = criteriosValidacaoDe(problema);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ClipboardCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            Registrar tentativa de correção
          </CardTitle>
          <CardDescription>
            Marque os passos executados e o resultado — fica registrado com data, autor e máquina.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Passos executados
            </Label>
            {problema.acoes.map((a) => {
              const marcado = acoes.includes(a);
              return (
                <label
                  key={a}
                  className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <Checkbox
                    checked={marcado}
                    onCheckedChange={(v) =>
                      setAcoes((prev) => (v ? [...prev, a] : prev.filter((x) => x !== a)))
                    }
                    className="mt-0.5"
                  />
                  <span className="min-w-0">{a}</span>
                </label>
              );
            })}
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Critérios para considerar resolvido
            </p>
            <ul className="ml-4 mt-1 list-disc space-y-1 text-xs">
              {criterios.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="res" className="text-xs">
                Resultado
              </Label>
              <Select
                value={resultado}
                onValueChange={(v) => setResultado(v as ResultadoTentativa)}
              >
                <SelectTrigger id="res" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(RESULTADO_LABEL) as ResultadoTentativa[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {RESULTADO_LABEL[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="tempo" className="text-xs">
                Tempo gasto (min)
              </Label>
              <Input
                id="tempo"
                inputMode="numeric"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="op" className="text-xs">
                Operador
              </Label>
              <Input
                id="op"
                value={operador}
                onChange={(e) => setOperador(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maq" className="text-xs">
                Máquina
              </Label>
              <Input
                id="maq"
                value={maquina}
                onChange={(e) => setMaquina(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="obs" className="text-xs">
              Observação
            </Label>
            <Textarea
              id="obs"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              placeholder="O que foi observado após o ajuste?"
            />
          </div>

          <Button
            type="button"
            className="h-11 w-full"
            disabled={m.isPending || acoes.length === 0}
            onClick={() => m.mutate()}
          >
            {m.isPending ? "Registrando…" : "Registrar tentativa"}
          </Button>
          {acoes.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Marque ao menos um passo executado para registrar.
            </p>
          )}
        </CardContent>
      </Card>

      {tentativaId && (
        <Card className="border-primary/40 bg-primary/5 xl:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageSquareHeart className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              A solução recomendada ajudou?
            </CardTitle>
            <CardDescription>
              Seu retorno alimenta o painel de eficácia e reordena as recomendações do acervo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={util === true ? "default" : "outline"}
                className="h-11 gap-2"
                onClick={() => setUtil(true)}
              >
                <ThumbsUp className="h-4 w-4" aria-hidden /> Ajudou
              </Button>
              <Button
                type="button"
                variant={util === false ? "destructive" : "outline"}
                className="h-11 gap-2"
                onClick={() => setUtil(false)}
              >
                <ThumbsDown className="h-4 w-4" aria-hidden /> Não ajudou
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="fbsev" className="text-xs">
                  Severidade percebida
                </Label>
                <Select value={fbSev} onValueChange={(v) => setFbSev(v as typeof fbSev)}>
                  <SelectTrigger id="fbsev" className="h-11">
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
                <Label htmlFor="fbobs" className="text-xs">
                  Observação
                </Label>
                <Input
                  id="fbobs"
                  value={fbObs}
                  onChange={(e) => setFbObs(e.target.value)}
                  className="h-11"
                  placeholder="O que faltou ou o que funcionou melhor?"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="h-11"
                disabled={util === null || fb.isPending}
                onClick={() => fb.mutate()}
              >
                {fb.isPending ? "Enviando…" : "Enviar feedback"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11"
                onClick={() => setTentativaId(null)}
              >
                Agora não
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <History className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            Histórico deste problema
          </CardTitle>
          <CardDescription>
            {hist.data
              ? `${hist.data.total} tentativa(s) · ${hist.data.taxaResolucao}% resolvidas`
              : "Carregando trilha de auditoria…"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {hist.data && hist.data.itens.length === 0 && (
            <EmptyState title="Nenhuma tentativa registrada ainda." compact />
          )}
          {hist.data?.itens.map((t) => (
            <div key={t.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(t.created_at).toLocaleString("pt-BR")}
                  {t.operador_nome ? ` · ${t.operador_nome}` : ""}
                  {t.maquina ? ` · ${t.maquina}` : ""}
                </span>
                <Badge className={TONE[t.resultado]} variant="secondary">
                  {RESULTADO_LABEL[t.resultado]}
                </Badge>
              </div>
              {t.acoes_executadas.length > 0 && (
                <ul className="ml-4 mt-2 list-disc space-y-0.5 text-xs text-muted-foreground">
                  {t.acoes_executadas.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              )}
              {t.observacao && <p className="mt-2 text-xs">{t.observacao}</p>}
              {t.tempo_min != null && (
                <p className="mt-1 text-[11px] text-muted-foreground">{t.tempo_min} min</p>
              )}
              {t.feedback_util != null && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Feedback: {t.feedback_util ? "ajudou" : "não ajudou"}
                  {t.feedback_severidade ? ` · severidade ${t.feedback_severidade}` : ""}
                  {t.guia_versao ? ` · guia v${t.guia_versao}` : ""}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
