import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  Clock,
  Download,
  FileText,
  Lightbulb,
  RefreshCw,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { KpiCard } from "@/components/flux/KpiCard";
import { EmptyState } from "@/components/flux/EmptyState";
import { LoadingState } from "@/components/flux/LoadingState";
import {
  ResponsiveDataTable,
  type ResponsiveColumn,
} from "@/components/flux/ResponsiveDataTable";
import { exportarCsv } from "@/lib/csv-export";
import { gerarPdfExecutivo } from "@/lib/pdf-executivo";
import {
  listarEmpresasDidatico,
  painelEficaciaDidatico,
  type LinhaEficacia,
  type PainelEficacia as DadosEficacia,
} from "@/lib/didatico-analytics.functions";

const TODOS = "__todos__";

const TOM_ALERTA: Record<string, string> = {
  critica: "bg-destructive/10 text-destructive",
  alta: "bg-flux-warning-soft text-warning",
  media: "bg-muted text-muted-foreground",
};

const num = (v: number | null, sufixo = "") => (v != null ? `${v}${sufixo}` : "—");

/** Painel de eficácia do Material Didático por estação, problema e módulo. */
export function PainelEficacia() {
  const buscar = useServerFn(painelEficaciaDidatico);
  const empresasFn = useServerFn(listarEmpresasDidatico);

  const [dias, setDias] = useState("90");
  const [empresa, setEmpresa] = useState(TODOS);
  const [etapa, setEtapa] = useState(TODOS);
  const [problema, setProblema] = useState(TODOS);
  const [modulo, setModulo] = useState(TODOS);
  const [pdfPct, setPdfPct] = useState<number | null>(null);

  const empresas = useQuery({ queryKey: ["didatico-empresas"], queryFn: () => empresasFn({}) });

  const filtros = {
    dias: Number(dias),
    ...(empresa !== TODOS ? { tenantId: empresa } : {}),
    ...(etapa !== TODOS ? { etapa } : {}),
    ...(problema !== TODOS ? { problemaCodigo: problema } : {}),
    ...(modulo !== TODOS ? { modulo } : {}),
  };

  const q = useQuery({
    queryKey: ["didatico-eficacia", filtros],
    queryFn: () => buscar({ data: filtros }),
  });

  const d = q.data;

  const rotuloFiltros = useMemo(() => {
    const partes = [`Últimos ${dias} dias`];
    if (empresa !== TODOS)
      partes.push(`Empresa: ${empresas.data?.find((e) => e.id === empresa)?.nome ?? empresa}`);
    if (etapa !== TODOS) partes.push(`Estação: ${etapa}`);
    if (problema !== TODOS) partes.push(`Problema: ${problema}`);
    if (modulo !== TODOS) partes.push(`Módulo: ${modulo}`);
    return partes.join(" · ");
  }, [dias, empresa, etapa, problema, modulo, empresas.data]);

  const secoes = (dados: DadosEficacia) => [
    {
      titulo: "Eficácia por estação",
      colunas: ["Estação", "Tentativas", "Resolvidas", "Taxa", "Tempo médio", "Recorrência", "Feedback útil"],
      colunasNumericas: [1, 2, 3, 4, 5, 6],
      linhas: dados.porEstacao.map((l) => [
        l.rotulo,
        l.tentativas,
        l.resolvidas,
        `${l.taxaResolucao}%`,
        num(l.tempoMedioMin, " min"),
        l.recorrencia,
        num(l.utilPct, "%"),
      ]),
    },
    {
      titulo: "Eficácia por problema",
      colunas: ["Estação", "Problema", "Tentativas", "Resolvidas", "Taxa", "Tempo médio", "Recorrência"],
      colunasNumericas: [2, 3, 4, 5, 6],
      linhas: dados.porProblema.map((l) => [
        l.etapa,
        l.rotulo,
        l.tentativas,
        l.resolvidas,
        `${l.taxaResolucao}%`,
        num(l.tempoMedioMin, " min"),
        l.recorrencia,
      ]),
    },
    {
      titulo: "Eficácia por módulo",
      colunas: ["Módulo", "Tentativas", "Resolvidas", "Taxa", "Tempo médio", "Recorrência"],
      colunasNumericas: [1, 2, 3, 4, 5],
      linhas: dados.porModulo.map((l) => [
        l.rotulo,
        l.tentativas,
        l.resolvidas,
        `${l.taxaResolucao}%`,
        num(l.tempoMedioMin, " min"),
        l.recorrencia,
      ]),
    },
    {
      titulo: "Alertas de piora no período",
      colunas: ["Dimensão", "Item", "Indicador", "Anterior", "Atual", "Severidade"],
      colunasNumericas: [3, 4],
      vazioTexto: "Nenhuma piora relevante identificada.",
      linhas: dados.alertas.map((a) => [
        a.dimensao,
        a.rotulo,
        a.tipo === "taxa" ? "Taxa de resolução" : "Tempo médio",
        a.tipo === "taxa" ? `${a.anterior}%` : `${a.anterior} min`,
        a.tipo === "taxa" ? `${a.atual}%` : `${a.atual} min`,
        a.severidade,
      ]),
    },
    {
      titulo: "Prioridades de atualização do acervo",
      colunas: ["Problema", "Estação", "Prioridade", "Não resolvidas", "Feedback negativo", "Ação sugerida"],
      colunasNumericas: [2, 3, 4],
      vazioTexto: "Nenhuma recomendação — o acervo está resolvendo bem.",
      linhas: dados.recomendacoes.map((r) => [
        r.rotulo,
        r.etapa,
        r.prioridade,
        r.naoResolvidas,
        r.feedbackNegativo,
        r.acaoSugerida,
      ]),
    },
  ];

  const exportarCsvPainel = () => {
    if (!d) return;
    const linhas: (string | number)[][] = [];
    for (const s of secoes(d)) {
      linhas.push([s.titulo, "", "", "", "", "", ""]);
      linhas.push(s.colunas as string[]);
      s.linhas.forEach((l) => linhas.push(l));
      linhas.push([]);
    }
    exportarCsv({
      nomeArquivo: `eficacia-material-didatico-${new Date().toISOString().slice(0, 10)}`,
      colunas: ["Eficácia do Material Didático", rotuloFiltros, "", "", "", "", ""],
      linhas,
    });
    toast.success("CSV gerado.");
  };

  const exportarPdfPainel = async () => {
    if (!d) return;
    setPdfPct(1);
    try {
      await gerarPdfExecutivo({
        titulo: "Eficácia do Material Didático",
        subtitulo: rotuloFiltros,
        orientacao: "landscape",
        nomeArquivo: `eficacia-material-didatico-${new Date().toISOString().slice(0, 10)}.pdf`,
        kpis: [
          { label: "Taxa de resolução", valor: `${d.totais.taxaResolucao}%` },
          { label: "Tentativas", valor: String(d.totais.tentativas) },
          { label: "Tempo médio", valor: num(d.totais.tempoMedioMin, " min") },
          { label: "Feedback útil", valor: num(d.totais.utilPct, "%") },
          { label: "Escalonamentos", valor: String(d.totais.escalonamentos) },
        ],
        secoes: secoes(d),
        onProgress: (p) => setPdfPct(p.pct),
      });
      toast.success("PDF pronto para compartilhar com a liderança.");
    } catch (e) {
      toast.error((e as Error).message || "Falha ao gerar o PDF.");
    } finally {
      setPdfPct(null);
    }
  };

  const colunas = (rotulo: string): ResponsiveColumn<LinhaEficacia>[] => [
    { key: "rotulo", header: rotulo, align: "left", render: (l) => l.rotulo },
    { key: "tentativas", header: "Tentativas", render: (l) => l.tentativas },
    { key: "resolvidas", header: "Resolvidas", render: (l) => l.resolvidas },
    { key: "taxaResolucao", header: "Taxa", render: (l) => `${l.taxaResolucao}%` },
    {
      key: "tempoMedioMin",
      header: "Tempo médio",
      render: (l) => num(l.tempoMedioMin, " min"),
    },
    { key: "recorrencia", header: "Recorrência", render: (l) => l.recorrencia },
    { key: "utilPct", header: "Feedback útil", render: (l) => num(l.utilPct, "%") },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Filtros</CardTitle>
          <CardDescription>{rotuloFiltros}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="space-y-1">
              <Label className="text-xs">Período</Label>
              <Select value={dias} onValueChange={setDias}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="180">Últimos 180 dias</SelectItem>
                  <SelectItem value="365">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Empresa</Label>
              <Select value={empresa} onValueChange={setEmpresa}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODOS}>Todas as empresas</SelectItem>
                  {empresas.data?.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Estação</Label>
              <Select value={etapa} onValueChange={setEtapa}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODOS}>Todas as estações</SelectItem>
                  {d?.opcoes.etapas.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Problema</Label>
              <Select value={problema} onValueChange={setProblema}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODOS}>Todos os problemas</SelectItem>
                  {d?.opcoes.problemas.map((p) => (
                    <SelectItem key={p.codigo} value={p.codigo}>
                      {p.codigo} · {p.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Módulo</Label>
              <Select value={modulo} onValueChange={setModulo}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODOS}>Todos os módulos</SelectItem>
                  {d?.opcoes.modulos.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-2"
              disabled={!d || d.totais.tentativas === 0}
              onClick={exportarCsvPainel}
            >
              <Download className="h-4 w-4" aria-hidden /> Exportar CSV
            </Button>
            <Button
              type="button"
              className="h-10 gap-2"
              disabled={!d || d.totais.tentativas === 0 || pdfPct != null}
              onClick={() => void exportarPdfPainel()}
            >
              <FileText className="h-4 w-4" aria-hidden />
              {pdfPct != null ? "Gerando PDF…" : "Exportar PDF"}
            </Button>
            {(etapa !== TODOS || problema !== TODOS || modulo !== TODOS || empresa !== TODOS) && (
              <Button
                type="button"
                variant="ghost"
                className="h-10"
                onClick={() => {
                  setEmpresa(TODOS);
                  setEtapa(TODOS);
                  setProblema(TODOS);
                  setModulo(TODOS);
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
          {pdfPct != null && <Progress value={pdfPct} className="h-2" />}
        </CardContent>
      </Card>

      {q.isLoading && <LoadingState variant="table" />}

      {d && d.totais.tentativas === 0 && (
        <EmptyState
          title="Nenhuma tentativa registrada no período"
          description="Ajuste os filtros ou aguarde novos registros dos operadores nas estações."
        />
      )}

      {d && d.totais.tentativas > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Taxa de resolução"
              value={`${d.totais.taxaResolucao}%`}
              icon={TrendingUp}
              hint={`${d.totais.resolvidas} de ${d.totais.tentativas} tentativas`}
            />
            <KpiCard
              label="Tempo médio"
              value={num(d.totais.tempoMedioMin, " min")}
              icon={Clock}
              hint="Da identificação à validação"
            />
            <KpiCard
              label="Feedback útil"
              value={num(d.totais.utilPct, "%")}
              icon={ThumbsUp}
              hint="Operadores que aprovaram a recomendação"
            />
            <KpiCard
              label="Escalonamentos"
              value={String(d.totais.escalonamentos)}
              icon={Activity}
              hint="Casos enviados à engenharia/qualidade"
            />
          </div>

          <Card className={d.alertas.length ? "border-warning/50" : undefined}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning" aria-hidden />
                Alertas automáticos
              </CardTitle>
              <CardDescription>
                Comparação com os {d.periodoDias} dias anteriores — só dispara com amostra mínima de
                3 tentativas nos dois períodos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {d.alertas.length === 0 && (
                <EmptyState title="Nenhuma piora relevante no período." compact />
              )}
              {d.alertas.map((a) => (
                <div
                  key={`${a.dimensao}-${a.chave}-${a.tipo}`}
                  className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-border p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{a.rotulo}</p>
                    <p className="text-xs text-muted-foreground">{a.mensagem}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      {a.dimensao}
                    </Badge>
                    <Badge variant="secondary" className={TOM_ALERTA[a.severidade]}>
                      {a.severidade}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                O que atualizar primeiro
              </CardTitle>
              <CardDescription>
                Ordem gerada pelo feedback dos operadores, severidade percebida e reincidência.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {d.recomendacoes.length === 0 && (
                <EmptyState title="Sem recomendações — o acervo está resolvendo bem." compact />
              )}
              {d.recomendacoes.map((r, i) => (
                <div key={r.chave} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="min-w-0 font-medium">
                      {i + 1}. {r.rotulo}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        {r.etapa}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={TOM_ALERTA[r.severidadePredominante] ?? TOM_ALERTA["media"]!}
                      >
                        prioridade {r.prioridade}
                      </Badge>
                    </div>
                  </div>
                  <ul className="ml-4 mt-1 list-disc space-y-0.5 text-xs text-muted-foreground">
                    {r.motivos.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs">
                    <strong>Ação sugerida:</strong> {r.acaoSugerida}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Tabs defaultValue="estacao">
            <TabsList>
              <TabsTrigger value="estacao">Por estação</TabsTrigger>
              <TabsTrigger value="problema">Por problema</TabsTrigger>
              <TabsTrigger value="modulo">Por módulo</TabsTrigger>
            </TabsList>

            <TabsContent value="estacao" className="mt-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4 text-primary" aria-hidden />
                    Eficácia por estação
                  </CardTitle>
                  <CardDescription>
                    Onde a orientação resolve e onde o defeito insiste.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveDataTable
                    columns={colunas("Estação")}
                    rows={d.porEstacao}
                    getRowId={(l) => l.chave}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="problema" className="mt-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Eficácia por problema</CardTitle>
                  <CardDescription>
                    Recorrência alta com taxa baixa indica solução a revisar no acervo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveDataTable
                    columns={[
                      {
                        key: "etapa",
                        header: "Estação",
                        align: "left",
                        render: (l) => l.etapa,
                      },
                      ...(colunas("Problema") as ResponsiveColumn<
                        LinhaEficacia & { etapa: string }
                      >[]),
                    ]}
                    rows={d.porProblema}
                    getRowId={(l) => l.chave}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modulo" className="mt-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Eficácia por módulo</CardTitle>
                  <CardDescription>Visão consolidada por família de conteúdo.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveDataTable
                    columns={colunas("Módulo")}
                    rows={d.porModulo}
                    getRowId={(l) => l.chave}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
