import { chartPalette } from "@/lib/chart-theme";
import { formatBRL } from "@/components/flux/MoneyValue";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KpiCard, KpiCardSkeleton } from "@/components/flux/KpiCard";
import { ChartCard } from "@/components/flux/ChartCard";
import {
  ResponsiveDataTable,
  COLUMN_MIN,
  type ResponsiveColumn,
} from "@/components/flux/ResponsiveDataTable";
import { exportarCsv } from "@/lib/csv-export";
import { gerarPdfExecutivo, type PdfProgresso } from "@/lib/pdf-executivo";
import { PdfBrandingDialog } from "@/components/flux/PdfBrandingDialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Download,
  FileText,
  Loader2,
  Wallet,
  PiggyBank,
  ShoppingCart,
  AlarmClock,
  TriangleAlert,
  Timer,
} from "lucide-react";
import { dashboardCompras, type ItemCritico } from "@/lib/compras-governanca.functions";

const BRL = (v: number) =>
  formatBRL(Number(v || 0));
const BRLc = (v: number) =>
  formatBRL(Number(v || 0));
const NUM = (v: number, d = 1) =>
  Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const MES = (m: string) => {
  const [a, b] = m.split("-");
  return `${b}/${a?.slice(2)}`;
};

const CRIT_CLS: Record<ItemCritico["criticidade"], string> = {
  critico: "border-destructive/40 bg-destructive/10 text-destructive",
  alerta: "border-warning/40 bg-warning/10 text-warning",
  atencao: "border-info/40 bg-info/10 text-info",
};

export function AbaDashboardCompras() {
  const fetchDash = useServerFn(dashboardCompras);
  const [meses, setMeses] = useState("6");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfCriticosLoading, setPdfCriticosLoading] = useState(false);
  const [progresso, setProgresso] = useState<PdfProgresso | null>(null);

  const q = useQuery({
    queryKey: ["dashboard-compras", meses],
    queryFn: () => fetchDash({ data: { meses: Number(meses) } }),
  });

  const k = q.data?.kpis;
  const serie = (q.data?.serie ?? []).map((s) => ({ ...s, mesLabel: MES(s.mes) }));
  const criticos = q.data?.criticos ?? [];

  const cols: ResponsiveColumn<ItemCritico>[] = [
    {
      key: "prioridade",
      header: "Prio.",
      align: "center",
      minWidth: 90,
      render: (r) => (
        <span className="font-mono text-xs font-semibold tabular-nums">{NUM(r.prioridade)}</span>
      ),
    },
    { key: "item", header: "Item", align: "left", minWidth: COLUMN_MIN.nameWide, render: (r) => r.item },
    {
      key: "criticidade",
      header: "Criticidade",
      align: "center",
      minWidth: COLUMN_MIN.status,
      render: (r) => (
        <Badge variant="outline" className={CRIT_CLS[r.criticidade]}>
          {r.criticidade}
        </Badge>
      ),
    },
    {
      key: "saldo",
      header: "Saldo / Mín.",
      align: "right",
      minWidth: COLUMN_MIN.numeric,
      render: (r) => (
        <span className="font-mono text-xs tabular-nums">
          {NUM(r.saldo, 2)} / {NUM(r.minimo, 2)}
        </span>
      ),
    },
    {
      key: "cobertura",
      header: "Cobertura",
      align: "right",
      minWidth: COLUMN_MIN.numeric,
      render: (r) => (
        <span className="font-mono text-xs tabular-nums">
          {r.cobertura_dias === null ? "—" : `${NUM(r.cobertura_dias)} d`}
        </span>
      ),
    },
    {
      key: "valor",
      header: "Reposição",
      align: "right",
      minWidth: COLUMN_MIN.currency,
      render: (r) => <span className="font-mono text-xs tabular-nums">{BRL(r.valor_reposicao)}</span>,
    },
  ];

  const SECAO_SERIE = {
    titulo: "Evolução mensal de compras",
    colunas: ["Mês", "Gasto", "Economia", "Consumo", "Pedidos", "Recebidos", "Atrasados"],
    colunasNumericas: [1, 2, 3, 4, 5, 6],
    vazioTexto: "Sem movimentação de compras no período.",
  };
  const SECAO_CRITICOS = {
    titulo: "Itens críticos priorizados",
    colunas: [
      "Prio.",
      "Item",
      "Criticidade",
      "Saldo",
      "Mínimo",
      "Cobertura (d)",
      "Consumo/dia",
      "Valor reposição",
    ],
    colunasNumericas: [0, 3, 4, 5, 6, 7],
    vazioTexto: "Nenhum item abaixo do mínimo — estoques saudáveis.",
  };

  const linhasSerie = () =>
    serie.map((s) => [
      s.mesLabel,
      BRL(s.gasto),
      BRL(s.economia),
      BRL(s.consumo),
      s.pedidos,
      s.recebidos,
      s.atrasados,
    ]);

  const linhasCriticos = () =>
    criticos.map((c) => [
      NUM(c.prioridade),
      c.item,
      c.criticidade,
      NUM(c.saldo, 2),
      NUM(c.minimo, 2),
      c.cobertura_dias === null ? "—" : NUM(c.cobertura_dias),
      NUM(c.consumo_dia, 2),
      BRL(c.valor_reposicao),
    ]);

  async function rodarPdf(
    setBusy: (v: boolean) => void,
    fn: (onProgress: (p: PdfProgresso) => void) => Promise<{ paginas: number }>,
  ) {
    setBusy(true);
    setProgresso({ pct: 0, etapa: "Iniciando…" });
    const id = toast.loading("Gerando PDF…");
    try {
      const { paginas } = await fn(setProgresso);
      toast.success(`PDF gerado com ${paginas} página(s)`, { id });
    } catch (e) {
      console.error("Falha ao gerar PDF", e);
      toast.error("Não foi possível gerar o PDF. Tente novamente.", { id });
    } finally {
      setBusy(false);
      setProgresso(null);
    }
  }

  const exportarPdfDashboard = () =>
    rodarPdf(setPdfLoading, (onProgress) => {
      if (!k) throw new Error("Sem dados carregados");
      return gerarPdfExecutivo({
        titulo: "Dashboard de Compras e Estoques",
        subtitulo: `Últimos ${meses} meses`,
        kpis: [
          { label: "Gasto no período", valor: BRL(k.gasto) },
          { label: "Economia negociada", valor: BRL(k.economia) },
          { label: "Consumo de materiais", valor: BRL(k.consumo) },
          { label: "Pedidos emitidos", valor: String(k.pedidos) },
          { label: "Pedidos atrasados", valor: String(k.pedidos_atrasados) },
          { label: "Taxa de recebimento", valor: `${NUM(k.taxa_recebimento)}%` },
          { label: "Itens críticos", valor: String(k.itens_criticos) },
          { label: "Reposição necessária", valor: BRL(k.valor_reposicao) },
          { label: "Tempo médio de aprovação", valor: `${NUM(k.tempo_medio_aprovacao_h)} h` },
          { label: "Requisições pendentes", valor: String(k.requisicoes_pendentes) },
        ],
        secoes: [
          { ...SECAO_SERIE, linhas: linhasSerie() },
          { ...SECAO_CRITICOS, linhas: linhasCriticos() },
        ],
        orientacao: "landscape",
        nomeArquivo: `flux-dashboard-compras-${new Date().toISOString().slice(0, 10)}.pdf`,
        onProgress,
      });
    });

  const exportarPdfCriticos = () =>
    rodarPdf(setPdfCriticosLoading, (onProgress) =>
      gerarPdfExecutivo({
        titulo: "Itens Críticos Priorizados",
        subtitulo: `${criticos.length} item(ns)`,
        secoes: [{ ...SECAO_CRITICOS, linhas: linhasCriticos() }],
        orientacao: "landscape",
        nomeArquivo: `flux-itens-criticos-${new Date().toISOString().slice(0, 10)}.pdf`,
        onProgress,
      }),
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Consolidado de compras e estoques com comparativo por período.
        </p>
        <div className="flex items-center gap-2">
          <Select value={meses} onValueChange={setMeses}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            disabled={!q.data}
            onClick={() =>
              exportarCsv({
                nomeArquivo: "flux-dashboard-compras",
                colunas: ["Mês", "Gasto", "Economia", "Consumo", "Pedidos", "Recebidos", "Atrasados"],
                linhas: serie.map((s) => [
                  s.mes,
                  s.gasto,
                  s.economia,
                  s.consumo,
                  s.pedidos,
                  s.recebidos,
                  s.atrasados,
                ]),
              })
            }
          >
            <Download className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!q.data || pdfLoading || pdfCriticosLoading}
            onClick={exportarPdfDashboard}
          >
            {pdfLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            PDF
          </Button>
          <PdfBrandingDialog size="icon" />
        </div>
      </div>

      {progresso && (
        <div
          role="status"
          aria-live="polite"
          className="space-y-1 rounded-md border border-border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{progresso.etapa}</span>
            <span className="tabular-nums">{progresso.pct}%</span>
          </div>
          <Progress value={progresso.pct} className="h-2" />
        </div>
      )}


      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {q.isLoading || !k ? (
          Array.from({ length: 8 }).map((_, i) => <KpiCardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard
              label="Gasto no período"
              value={BRLc(k.gasto)}
              valueTitle={BRL(k.gasto)}
              icon={Wallet}
              tone="info"
              hint={`${k.pedidos} pedidos emitidos`}
            />
            <KpiCard
              label="Economia negociada"
              value={BRLc(k.economia)}
              valueTitle={BRL(k.economia)}
              icon={PiggyBank}
              tone={k.economia >= 0 ? "positive" : "danger"}
              hint="Preço pago vs. último preço"
            />
            <KpiCard
              label="Consumo de materiais"
              value={BRLc(k.consumo)}
              valueTitle={BRL(k.consumo)}
              icon={ShoppingCart}
              hint="Saídas valorizadas"
            />
            <KpiCard
              label="Pedidos atrasados"
              value={k.pedidos_atrasados}
              icon={AlarmClock}
              tone={k.pedidos_atrasados > 0 ? "danger" : "positive"}
              hint="Entrega prevista vencida"
            />
            <KpiCard
              label="Taxa de recebimento"
              value={`${NUM(k.taxa_recebimento)}%`}
              icon={ShoppingCart}
              tone={k.taxa_recebimento >= 80 ? "positive" : "warning"}
              hint="Pedidos totalmente recebidos"
            />
            <KpiCard
              label="Itens críticos"
              value={k.itens_criticos}
              icon={TriangleAlert}
              tone={k.itens_criticos > 0 ? "warning" : "positive"}
              hint="Abaixo do mínimo ou cobertura < 15 d"
            />
            <KpiCard
              label="Reposição necessária"
              value={BRLc(k.valor_reposicao)}
              valueTitle={BRL(k.valor_reposicao)}
              icon={Wallet}
              tone="warning"
              hint="Capital para repor mínimos"
            />
            <KpiCard
              label="Tempo médio de aprovação"
              value={`${NUM(k.tempo_medio_aprovacao_h)} h`}
              icon={Timer}
              tone={k.tempo_medio_aprovacao_h <= 24 ? "positive" : "warning"}
              hint={`${k.requisicoes_pendentes} requisição(ões) pendente(s)`}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Gasto x economia por mês"
          unit="R$"
          empty={!q.isLoading && serie.every((s) => s.gasto === 0 && s.economia === 0)}
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={serie} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.neutro} />
                <XAxis dataKey="mesLabel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => BRLc(Number(v))} />
                <Tooltip formatter={(v: number) => BRL(Number(v))} />
                <Legend />
                <Bar dataKey="gasto" name="Gasto" fill={chartPalette.serie[0]} radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="consumo"
                  name="Consumo"
                  fill={chartPalette.serie[2]}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="economia"
                  name="Economia"
                  stroke={chartPalette.positivo}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Pedidos por mês"
          unit="pedidos"
          empty={!q.isLoading && serie.every((s) => s.pedidos === 0)}
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serie} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.neutro} />
                <XAxis dataKey="mesLabel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="pedidos" name="Emitidos" fill={chartPalette.serie[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="recebidos" name="Recebidos" fill={chartPalette.positivo} radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="atrasados"
                  name="Atrasados"
                  fill={chartPalette.critico}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Itens críticos priorizados</CardTitle>
            <CardDescription>
              Ranking por criticidade, cobertura de estoque e capital necessário para reposição.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={criticos.length === 0}
            onClick={() =>
              exportarCsv({
                nomeArquivo: "flux-itens-criticos",
                colunas: [
                  "Prioridade",
                  "Item",
                  "Criticidade",
                  "Saldo",
                  "Mínimo",
                  "Cobertura (d)",
                  "Consumo/dia",
                  "Valor reposição",
                ],
                linhas: criticos.map((c) => [
                  c.prioridade,
                  c.item,
                  c.criticidade,
                  c.saldo,
                  c.minimo,
                  c.cobertura_dias ?? "",
                  c.consumo_dia,
                  c.valor_reposicao,
                ]),
              })
            }
          >
            <Download className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={criticos.length === 0 || pdfCriticosLoading || pdfLoading}
            onClick={exportarPdfCriticos}
          >
            {pdfCriticosLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            PDF
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveDataTable
            rows={criticos}
            columns={cols}
            getRowId={(r) => r.id}
            isLoading={q.isLoading}
            emptyTitle="Nenhum item crítico"
            emptyDescription="Todos os itens estão acima do mínimo com cobertura saudável."
            mobileTitle={(r) => r.item}
            mobileSubtitle={(r) => `${r.criticidade} · prioridade ${NUM(r.prioridade)}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
