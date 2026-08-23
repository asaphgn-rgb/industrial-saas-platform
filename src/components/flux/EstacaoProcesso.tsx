import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Factory,
  Gauge,
  LifeBuoy,
  Percent,
  Send,
  Timer,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/flux/PageHeader";
import { ProblemasSolucoes } from "@/components/flux/didatico/ProblemasSolucoes";
import { MaterialDidatico } from "@/components/flux/didatico/MaterialDidatico";
import { BotaoGuiaPdf } from "@/components/flux/didatico/BotaoGuiaPdf";
import { processoDidatico } from "@/lib/didatico/processos";
import { CalculadoraProcesso } from "@/components/flux/CalculadoraProcesso";


import { KpiCard, KpiCardSkeleton } from "@/components/flux/KpiCard";
import { EmptyState } from "@/components/flux/EmptyState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getEspecificacao } from "@/lib/producao-especificacoes";
import {
  DEPARTAMENTOS_APOIO,
  DEPARTAMENTO_LABEL,
  ETAPA_LABEL,
  abrirSolicitacaoApoio,
  apontarProducaoEstacao,
  painelEstacao,
  type PainelEstacao,
} from "@/lib/estacao-processo.functions";

const num = (v: number, d = 0) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function EstacaoProcesso({ etapa }: { etapa: string }) {
  const qc = useQueryClient();
  const carregar = useServerFn(painelEstacao);
  const [dias, setDias] = useState(30);

  const q = useQuery({
    queryKey: ["estacao-processo", etapa, dias],
    queryFn: () => carregar({ data: { etapa, dias } }),
    refetchInterval: 60_000,
  });

  const titulo = ETAPA_LABEL[etapa] ?? etapa;
  const spec = getEspecificacao(etapa);
  const d = q.data;
  const didatico = useMemo(() => processoDidatico(etapa), [etapa]);


  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title={`Estação · ${titulo}`}
        description="Apontamento por tablet, gestão do processo e apoio entre setores — dados exclusivos desta etapa."
        crumbs={[{ label: "Produção", to: "/producao/painel" }, { label: titulo }]}
        help="Esta tela mostra apenas o que pertence a este processo: máquinas, apontamentos, paradas, manutenções, qualidade, OPs e solicitações de apoio."
        actions={
          <div className="flex items-center gap-2">
            <Select value={String(dias)} onValueChange={(v) => setDias(Number(v))}>
              <SelectTrigger className="h-11 w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Hoje</SelectItem>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild variant="outline" className="h-11">
              <Link to="/producao/apoio">
                <LifeBuoy className="mr-2 h-4 w-4" /> Apoio
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {q.isError && (
          <Card className="border-destructive/50">
            <CardContent className="p-4 text-sm text-destructive">
              {(q.error as Error)?.message ?? "Falha ao carregar a estação."}
            </CardContent>
          </Card>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {q.isLoading || !d
            ? Array.from({ length: 6 }).map((_, i) => <KpiCardSkeleton key={i} />)
            : [
                {
                  label: "OEE do processo",
                  value: `${num(d.kpis.oee, 1)}%`,
                  icon: Gauge,
                  tone: d.kpis.oee >= 65 ? "positive" : d.kpis.oee >= 45 ? "warning" : "danger",
                  hint: `Disp. ${num(d.kpis.disponibilidade, 0)}% · Perf. ${num(d.kpis.desempenho, 0)}%`,
                },
                {
                  label: "Produzido",
                  value: num(d.kpis.produzido),
                  icon: Factory,
                  tone: "info",
                  hint: `${d.kpis.apontamentos} apontamentos`,
                  delta: d.kpis.tendenciaPct,
                  deltaLabel: "vs. 1ª metade",
                },
                {
                  label: "Refugo",
                  value: `${num(d.kpis.refugoPct, 1)}%`,
                  icon: Percent,
                  tone: d.kpis.refugoPct > 5 ? "danger" : "positive",
                  hint: `${num(d.kpis.refugo)} un/kg perdidos`,
                },
                {
                  label: "Produtividade",
                  value: `${num(d.kpis.produtividadeHora, 0)}/h`,
                  icon: TrendingUp,
                  tone: "default",
                  hint: `${num(d.kpis.horasProduzindo, 1)} h produzindo`,
                },
                {
                  label: "Paradas",
                  value: `${num(d.kpis.horasParadas, 1)} h`,
                  icon: Timer,
                  tone: d.kpis.horasParadas > d.kpis.horasProduzindo * 0.2 ? "warning" : "default",
                  hint: `${d.paradas.length} eventos registrados`,
                },
                {
                  label: "Pendências do processo",
                  value: d.manutencoes.length + d.ocorrencias.length,
                  icon: AlertTriangle,
                  tone:
                    d.manutencoes.length + d.ocorrencias.length > 0 ? "warning" : ("positive" as const),
                  hint: `${d.manutencoes.length} manutenção · ${d.ocorrencias.length} qualidade`,
                },
              ].map((k) => (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <KpiCard key={k.label} {...(k as any)} />
              ))}
        </div>

        {/* Insights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BrainCircuit className="h-4 w-4 text-primary" /> Insights do analisador
            </CardTitle>
            <CardDescription>
              Leitura automática dos dados reais desta etapa, com ação sugerida ao responsável.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {q.isLoading ? (
              <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </>
            ) : (d?.insights.length ?? 0) === 0 ? (
              <EmptyState title="Sem recomendações no período." compact />
            ) : (
              d?.insights.map((i) => (
                <div
                  key={i.id}
                  className={`rounded-lg border-l-4 border border-border p-3 ${
                    i.tom === "critico"
                      ? "border-l-destructive bg-destructive/5"
                      : i.tom === "atencao"
                        ? "border-l-warning bg-warning/5"
                        : i.tom === "positivo"
                          ? "border-l-success bg-success/5"
                          : "border-l-muted-foreground/40"
                  }`}
                >
                  <p className="text-sm font-semibold">{i.titulo}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{i.detalhe}</p>
                  {i.acao && (
                    <p className="mt-2 text-xs font-medium text-foreground/90">→ {i.acao}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="apontar">
          <TabsList className="flex w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="apontar" className="h-11">
              Apontar
            </TabsTrigger>
            <TabsTrigger value="ops" className="h-11">
              Minhas OPs
            </TabsTrigger>
            <TabsTrigger value="produtividade" className="h-11">
              Produtividade
            </TabsTrigger>
            <TabsTrigger value="ocorrencias" className="h-11">
              Ocorrências
            </TabsTrigger>
            <TabsTrigger value="apoio" className="h-11">
              Apoio
            </TabsTrigger>
            <TabsTrigger value="padroes" className="h-11">
              Padrões
            </TabsTrigger>
            <TabsTrigger value="calculos" className="h-11">
              Cálculos
            </TabsTrigger>
            {didatico && (
              <>
                <TabsTrigger value="problemas" className="h-11">
                  Problemas &amp; Soluções
                </TabsTrigger>
                <TabsTrigger value="aprender" className="h-11">
                  Aprender
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="calculos" className="mt-4">
            <CalculadoraProcesso etapa={etapa} />
          </TabsContent>

          <TabsContent value="apontar" className="mt-4">

            <FormApontamento
              etapa={etapa}
              dados={d}
              onOk={() => qc.invalidateQueries({ queryKey: ["estacao-processo", etapa] })}
            />
          </TabsContent>

          <TabsContent value="ops" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ordens alocadas a este processo</CardTitle>
                <CardDescription>
                  Sequência de trabalho — cada OP segue rastreada até a conclusão.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(d?.ops.length ?? 0) === 0 ? (
                  <EmptyState title="Nenhuma OP em aberto neste processo." compact />
                ) : (
                  d?.ops.map((o) => (
                    <Link
                      key={o.id}
                      to="/producao/ordens-producao/$opId"
                      params={{ opId: o.id }}
                      className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            OP {o.numero}
                            {o.maquina_nome ? ` · ${o.maquina_nome}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {num(o.produzida)} de {num(o.planejada)} ·{" "}
                            {o.data_prazo
                              ? `prazo ${new Date(o.data_prazo).toLocaleDateString("pt-BR")}`
                              : "sem prazo"}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {o.atrasada && <Badge variant="destructive">Atrasada</Badge>}
                          {o.prioridade === "alta" && <Badge variant="outline">Prioritária</Badge>}
                          <Badge variant="secondary">{o.status}</Badge>
                        </div>
                      </div>
                      <Progress value={o.progresso} className="mt-2 h-2" />
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="produtividade" className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" /> Por operador
                </CardTitle>
                <CardDescription>Ritmo, volume e perda de cada operador na etapa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(d?.porOperador.length ?? 0) === 0 ? (
                  <EmptyState title="Sem apontamentos no período." compact />
                ) : (
                  d?.porOperador.map((o) => (
                    <div key={o.nome} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{o.nome}</p>
                        <span className="font-mono text-sm font-semibold tabular-nums">
                          {num(o.pph, 0)}/h
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {num(o.produzido)} produzidos · {num(o.horas, 1)} h · refugo{" "}
                        {num(o.refugoPct, 1)}%
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4" /> Por máquina
                </CardTitle>
                <CardDescription>Volume, paradas e disponibilidade por recurso.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(d?.porMaquina.length ?? 0) === 0 ? (
                  <EmptyState title="Sem produção registrada por máquina." compact />
                ) : (
                  d?.porMaquina.map((m) => (
                    <div key={m.nome} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{m.nome}</p>
                        <Badge
                          variant="outline"
                          className={
                            m.disponibilidade >= 85
                              ? "border-success/40 bg-success/10 text-success"
                              : m.disponibilidade >= 70
                                ? "border-warning/40 bg-warning/10 text-warning"
                                : "border-destructive/40 bg-destructive/10 text-destructive"
                          }
                        >
                          {num(m.disponibilidade, 0)}% disp.
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {num(m.produzido)} produzidos · {num(m.horas, 1)} h ·{" "}
                        {num(m.paradasMin, 0)} min parada
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Pareto de refugo</CardTitle>
                <CardDescription>Onde atacar primeiro para reduzir perda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(d?.paretoRefugo.length ?? 0) === 0 ? (
                  <EmptyState title="Sem refugo registrado no período." compact />
                ) : (
                  d?.paretoRefugo.map((p) => (
                    <div key={p.motivo} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate font-medium">{p.motivo}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {num(p.qtd)} · {num(p.pct, 1)}% (acum. {num(p.acumulado, 0)}%)
                        </span>
                      </div>
                      <Progress value={p.pct} className="h-2" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ocorrencias" className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Timer className="h-4 w-4" /> Paradas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(d?.paradas.length ?? 0) === 0 ? (
                  <EmptyState title="Sem paradas no período." compact />
                ) : (
                  d?.paradas.map((p) => (
                    <div key={p.id} className="rounded-lg border border-border p-3 text-sm">
                      <p className="font-medium">{p.motivo ?? "Sem motivo"}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.recurso ?? "—"} ·{" "}
                        {p.inicio ? new Date(p.inicio).toLocaleString("pt-BR") : "—"} ·{" "}
                        {num(Number(p.duracao_min ?? 0))} min
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wrench className="h-4 w-4" /> Manutenções / intervenções
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(d?.manutencoes.length ?? 0) === 0 ? (
                  <EmptyState title="Nenhuma OS aberta para as máquinas do processo." compact />
                ) : (
                  d?.manutencoes.map((o) => (
                    <div key={o.id} className="rounded-lg border border-border p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium">
                          {o.numero ?? "OS"} · {o.recurso ?? "—"}
                        </p>
                        <Badge variant="secondary">{o.status ?? "—"}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {o.tipo ?? "—"} ·{" "}
                        {o.data_prevista
                          ? `previsto ${new Date(o.data_prevista).toLocaleDateString("pt-BR")}`
                          : "sem data"}
                      </p>
                      {o.descricao && <p className="mt-1 text-xs">{o.descricao}</p>}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4" /> Qualidade (NCs)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(d?.ocorrencias.length ?? 0) === 0 ? (
                  <EmptyState title="Sem não conformidades abertas." compact />
                ) : (
                  d?.ocorrencias.map((n) => (
                    <div key={n.id} className="rounded-lg border border-border p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium">{n.numero ?? "NC"}</p>
                        <Badge variant="destructive">{n.severidade ?? "—"}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{n.descricao ?? "—"}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apoio" className="mt-4">
            <FormApoio
              etapa={etapa}
              dados={d}
              onOk={() => qc.invalidateQueries({ queryKey: ["estacao-processo", etapa] })}
            />
          </TabsContent>

          <TabsContent value="padroes" className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tolerâncias do processo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(spec?.tolerancias ?? []).map((t) => (
                  <div
                    key={t.parametro}
                    className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
                  >
                    <span>{t.parametro}</span>
                    <span className="font-mono text-xs">
                      {t.faixa}
                      {t.critico ? " ·  crítico" : ""}
                    </span>
                  </div>
                ))}
                {!spec && <EmptyState title="Sem padrão cadastrado para esta etapa." compact />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Checklist de setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(spec?.checklistSetup ?? []).map((c) => (
                  <div key={c.ordem} className="flex items-start gap-2 rounded-lg border p-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      {c.descricao}
                      {c.obrigatorio && (
                        <Badge variant="outline" className="ml-2">
                          obrigatório
                        </Badge>
                      )}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          {didatico && (
            <>
              <TabsContent value="problemas" className="mt-4">
                <ProblemasSolucoes problemas={didatico.problemas} etapa={didatico.etapa} />
              </TabsContent>
              <TabsContent value="aprender" className="mt-4 space-y-3">
                <div className="flex justify-end">
                  <BotaoGuiaPdf processo={didatico} />
                </div>
                <MaterialDidatico material={didatico.material} />
              </TabsContent>
            </>
          )}
        </Tabs>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FormApontamento({
  etapa,
  dados,
  onOk,
}: {
  etapa: string;
  dados?: PainelEstacao;
  onOk: () => void;
}) {
  const spec = getEspecificacao(etapa);
  const apontar = useServerFn(apontarProducaoEstacao);
  const [form, setForm] = useState({
    op_id: "",
    maquina_id: "",
    operador_nome: "",
    quantidade_produzida: "",
    quantidade_refugo: "",
    motivo_refugo: "",
    observacoes: "",
    data_inicio: "",
    data_fim: "",
  });

  const mut = useMutation({
    mutationFn: async () => {
      const maquina = dados?.maquinas.find((m) => m.id === form.maquina_id);
      return apontar({
        data: {
          etapa,
          op_id: form.op_id || null,
          maquina_id: form.maquina_id || null,
          recurso: maquina?.nome ?? null,
          operador_nome: form.operador_nome || null,
          quantidade_produzida: Number(form.quantidade_produzida || 0),
          quantidade_refugo: Number(form.quantidade_refugo || 0),
          motivo_refugo: form.motivo_refugo || null,
          observacoes: form.observacoes || null,
          data_inicio: form.data_inicio ? new Date(form.data_inicio).toISOString() : undefined,
          data_fim: form.data_fim ? new Date(form.data_fim).toISOString() : undefined,
        },
      });
    },
    onSuccess: () => {
      toast.success("Apontamento registrado");
      setForm((f) => ({
        ...f,
        quantidade_produzida: "",
        quantidade_refugo: "",
        motivo_refugo: "",
        observacoes: "",
        data_inicio: "",
        data_fim: "",
      }));
      onOk();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const podeEnviar = Number(form.quantidade_produzida || 0) > 0 || Number(form.quantidade_refugo || 0) > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList className="h-4 w-4" /> Apontamento de produção
        </CardTitle>
        <CardDescription>
          Campos otimizados para tablet — toque grande, envio imediato e rastreio pela OP.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Campo label="Ordem de produção">
          <Select value={form.op_id} onValueChange={(v) => setForm({ ...form, op_id: v })}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a OP" />
            </SelectTrigger>
            <SelectContent>
              {(dados?.ops ?? []).map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  OP {o.numero} · {num(o.produzida)}/{num(o.planejada)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Máquina / recurso">
          <Select value={form.maquina_id} onValueChange={(v) => setForm({ ...form, maquina_id: v })}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a máquina" />
            </SelectTrigger>
            <SelectContent>
              {(dados?.maquinas ?? []).map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.codigo ? `${m.codigo} · ` : ""}
                  {m.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Operador">
          <Input
            className="h-12"
            value={form.operador_nome}
            onChange={(e) => setForm({ ...form, operador_nome: e.target.value })}
            placeholder="Nome de quem operou"
          />
        </Campo>

        <Campo label="Início">
          <Input
            type="datetime-local"
            className="h-12"
            value={form.data_inicio}
            onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
          />
        </Campo>
        <Campo label="Fim">
          <Input
            type="datetime-local"
            className="h-12"
            value={form.data_fim}
            onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
          />
        </Campo>

        <Campo label="Quantidade boa">
          <Input
            inputMode="decimal"
            className="h-12 text-lg font-semibold tabular-nums"
            value={form.quantidade_produzida}
            onChange={(e) => setForm({ ...form, quantidade_produzida: e.target.value })}
            placeholder="0"
          />
        </Campo>

        <Campo label="Refugo">
          <Input
            inputMode="decimal"
            className="h-12 text-lg font-semibold tabular-nums"
            value={form.quantidade_refugo}
            onChange={(e) => setForm({ ...form, quantidade_refugo: e.target.value })}
            placeholder="0"
          />
        </Campo>

        <Campo label="Motivo do refugo">
          <Select
            value={form.motivo_refugo}
            onValueChange={(v) => setForm({ ...form, motivo_refugo: v })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a causa" />
            </SelectTrigger>
            <SelectContent>
              {(spec?.motivosRefugoComuns ?? ["Setup inicial", "Outros"]).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Observações" className="sm:col-span-2 xl:col-span-3">
          <Textarea
            rows={2}
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
            placeholder="Condições do processo, ajustes, amostras coletadas..."
          />
        </Campo>

        <div className="sm:col-span-2 xl:col-span-3">
          <Button
            className="h-14 w-full text-base"
            disabled={!podeEnviar || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? "Enviando..." : "Registrar apontamento"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FormApoio({
  etapa,
  dados,
  onOk,
}: {
  etapa: string;
  dados?: PainelEstacao;
  onOk: () => void;
}) {
  const abrir = useServerFn(abrirSolicitacaoApoio);
  const [form, setForm] = useState({
    departamento: "manutencao",
    tipo: "apoio",
    prioridade: "normal",
    titulo: "",
    descricao: "",
    maquina_id: "",
    op_id: "",
    solicitante_nome: "",
  });

  const mut = useMutation({
    mutationFn: () =>
      abrir({
        data: {
          etapa,
          departamento: form.departamento,
          tipo: form.tipo,
          prioridade: form.prioridade,
          titulo: form.titulo,
          descricao: form.descricao || null,
          maquina_id: form.maquina_id || null,
          op_id: form.op_id || null,
          solicitante_nome: form.solicitante_nome || null,
        },
      }),
    onSuccess: (r) => {
      toast.success(`Solicitação ${r.numero} enviada ao setor de apoio`);
      setForm((f) => ({ ...f, titulo: "", descricao: "" }));
      onOk();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const abertas = useMemo(
    () => (dados?.solicitacoes ?? []).filter((s) => s.status !== "concluida"),
    [dados?.solicitacoes],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Send className="h-4 w-4" /> Pedir apoio a outro departamento
          </CardTitle>
          <CardDescription>
            A mensagem chega imediatamente à caixa do setor de destino e notifica os responsáveis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Campo label="Departamento">
            <Select
              value={form.departamento}
              onValueChange={(v) => setForm({ ...form, departamento: v })}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPARTAMENTOS_APOIO.map((dp) => (
                  <SelectItem key={dp} value={dp}>
                    {DEPARTAMENTO_LABEL[dp]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <Campo label="Prioridade">
            <Select
              value={form.prioridade}
              onValueChange={(v) => setForm({ ...form, prioridade: v })}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="parada_linha">Linha parada</SelectItem>
              </SelectContent>
            </Select>
          </Campo>
          <Campo label="Tipo">
            <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apoio">Apoio operacional</SelectItem>
                <SelectItem value="manutencao">Falha de máquina</SelectItem>
                <SelectItem value="qualidade">Dúvida / desvio de qualidade</SelectItem>
                <SelectItem value="material">Falta de material</SelectItem>
                <SelectItem value="ocorrencia">Ocorrência geral</SelectItem>
                <SelectItem value="seguranca">Segurança</SelectItem>
              </SelectContent>
            </Select>
          </Campo>
          <Campo label="Máquina (opcional)">
            <Select
              value={form.maquina_id}
              onValueChange={(v) => setForm({ ...form, maquina_id: v })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {(dados?.maquinas ?? []).map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <Campo label="Assunto" className="sm:col-span-2">
            <Input
              className="h-12"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ex.: Seladora 03 com solda fraca desde as 14h"
            />
          </Campo>
          <Campo label="Detalhes" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="O que aconteceu, o que já foi tentado e o impacto na produção."
            />
          </Campo>
          <div className="sm:col-span-2">
            <Button
              className="h-14 w-full text-base"
              disabled={form.titulo.trim().length < 3 || mut.isPending}
              onClick={() => mut.mutate()}
            >
              {mut.isPending ? "Enviando..." : "Enviar solicitação"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Solicitações deste processo</CardTitle>
          <CardDescription>Acompanhe o atendimento dos setores de apoio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {(dados?.solicitacoes.length ?? 0) === 0 ? (
            <EmptyState title="Nenhuma solicitação registrada." compact />
          ) : (
            dados?.solicitacoes.map((s) => (
              <div key={s.id} className="rounded-lg border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{s.titulo}</p>
                  <Badge
                    variant={
                      s.status === "concluida"
                        ? "secondary"
                        : s.prioridade === "parada_linha"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {s.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {DEPARTAMENTO_LABEL[s.departamento] ?? s.departamento} ·{" "}
                  {new Date(s.created_at).toLocaleString("pt-BR")}
                </p>
                {s.resposta && <p className="mt-1 text-xs">Resposta: {s.resposta}</p>}
              </div>
            ))
          )}
          {abertas.length > 0 && (
            <p className="pt-2 text-xs text-muted-foreground">
              {abertas.length} solicitação(ões) aguardando conclusão.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Campo({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
