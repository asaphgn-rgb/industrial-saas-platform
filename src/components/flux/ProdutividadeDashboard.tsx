import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Gauge, Download, Printer, TrendingUp, AlertTriangle, Target, Flame } from "lucide-react";
import { useAgendaPessoal } from "@/hooks/use-agenda-pessoal";
import {
  calcularEficiencia,
  chaveDia,
  dataRef,
  isConcluida,
  porCategoria,
  relatorioCsv,
  serieDiaria,
  serieMensal,
} from "@/lib/agenda-pessoal";

function baixarCsv(nome: string, conteudo: string) {
  const blob = new Blob([`\uFEFF${conteudo}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  progress,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Gauge;
  tone?: "default" | "positive" | "warning" | "negative";
  progress?: number;
}) {
  const cls =
    tone === "positive"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "negative"
          ? "text-destructive"
          : "text-primary";
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${cls}`} />
      </div>
      <div className={`mt-1 text-2xl font-black tabular-nums ${cls}`}>{value}</div>
      {typeof progress === "number" && <Progress value={progress} className="mt-2 h-1.5" />}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * Dashboard de produtividade pessoal: eficiência do dia, do mês e do ano,
 * séries históricas, foco por tipo de atividade e exportação de relatório.
 */
export function ProdutividadeDashboard() {
  const { lista, isLoading } = useAgendaPessoal();

  const hojeKey = chaveDia(new Date());
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  const doDia = useMemo(() => lista.filter((i) => chaveDia(dataRef(i)) === hojeKey), [lista, hojeKey]);
  const doMes = useMemo(
    () => lista.filter((i) => dataRef(i).getMonth() === mesAtual && dataRef(i).getFullYear() === anoAtual),
    [lista, mesAtual, anoAtual],
  );
  const doAno = useMemo(() => lista.filter((i) => dataRef(i).getFullYear() === anoAtual), [lista, anoAtual]);

  const efDia = calcularEficiencia(doDia);
  const efMes = calcularEficiencia(doMes);
  const efAno = calcularEficiencia(doAno);

  const diaria = useMemo(() => serieDiaria(lista, 14), [lista]);
  const mensal = useMemo(() => serieMensal(lista, anoAtual), [lista, anoAtual]);
  const categorias = useMemo(() => porCategoria(doMes), [doMes]);

  // Sequência de dias com 100% de entrega (gamificação leve).
  const streak = useMemo(() => {
    let s = 0;
    for (let k = 0; k < 60; k++) {
      const d = new Date();
      d.setDate(d.getDate() - k);
      const itens = lista.filter((i) => chaveDia(dataRef(i)) === chaveDia(d) && i.status !== "cancelada");
      if (itens.length === 0) {
        if (k === 0) continue;
        break;
      }
      if (itens.every(isConcluida)) s += 1;
      else break;
    }
    return s;
  }, [lista]);

  if (isLoading) return <Skeleton className="h-80 w-full" />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Eficiência hoje"
          value={`${efDia.percentual}%`}
          hint={`${efDia.concluidas} de ${efDia.total} atividades entregues`}
          icon={Gauge}
          tone={efDia.percentual >= 80 ? "positive" : efDia.percentual >= 50 ? "warning" : "negative"}
          progress={efDia.percentual}
        />
        <Kpi
          label="Acumulado do mês"
          value={`${efMes.percentual}%`}
          hint={`Pontualidade ${efMes.pontualidade}% · ${efMes.total} planejadas`}
          icon={TrendingUp}
          tone={efMes.percentual >= 80 ? "positive" : "warning"}
          progress={efMes.percentual}
        />
        <Kpi
          label="Acumulado do ano"
          value={`${efAno.percentual}%`}
          hint={`${efAno.concluidas} entregas em ${anoAtual}`}
          icon={Target}
          tone={efAno.percentual >= 80 ? "positive" : "warning"}
          progress={efAno.percentual}
        />
        <Kpi
          label="Atrasadas agora"
          value={String(efAno.atrasadas)}
          hint={streak > 0 ? `${streak} dia(s) seguidos com 100% de entrega` : "Reprograme para zerar o passivo"}
          icon={efAno.atrasadas > 0 ? AlertTriangle : Flame}
          tone={efAno.atrasadas > 0 ? "negative" : "positive"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Eficiência diária — últimos 14 dias</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={diaria} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number, n: string) => [n === "eficiencia" ? `${v}%` : v, n]}
                />
                <Area
                  type="monotone"
                  dataKey="eficiencia"
                  name="Eficiência"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="concluidas" name="Concluídas" stroke="var(--color-chart-3)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Evolução mensal — {anoAtual}</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mensal} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="planejadas" name="Planejadas" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="concluidas" name="Concluídas" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-sm">Onde seu tempo está indo — mês atual</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                baixarCsv(`meu-dia-produtividade-${chaveDia(new Date())}.csv`, relatorioCsv(doAno))
              }
            >
              <Download className="mr-1 h-4 w-4" /> Exportar relatório
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer className="mr-1 h-4 w-4" /> Imprimir
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categorias.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sem atividades neste mês. Agende seus compromissos para começar a medir sua eficiência.
            </p>
          ) : (
            <ul className="space-y-2">
              {categorias.map((c) => {
                const pct = c.total ? Math.round((c.concluidas / c.total) * 100) : 0;
                return (
                  <li key={c.nome}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{c.nome}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {c.concluidas}/{c.total} · {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="mt-1 h-1.5" />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
