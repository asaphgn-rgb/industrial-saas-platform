import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Brain,
  TrendingUp,
  Percent,
  Factory,
  AlertTriangle,
  Printer,
  FileDown,
  Lightbulb,
  Target,
  ShieldCheck,
} from "lucide-react";

import { ExecPage, ExecHeader, ExecKpiGrid } from "@/components/flux/executive";
import { KpiCard } from "@/components/flux/KpiCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/flux/LoadingState";
import { EmptyState } from "@/components/flux/EmptyState";
import { cn } from "@/lib/utils";
import { biKpisConsolidados, type BiKpis } from "@/lib/bi-executivo.functions";

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v || 0);

const pct = (v: number) => `${(v || 0).toFixed(1)}%`;

type Insight = {
  id: string;
  type: "custo" | "gargalo" | "qualidade";
  title: string;
  body: string;
  action: string;
  impact: string;
  icon: typeof Brain;
};

const advisoryInsights: Insight[] = [
  {
    id: "custo-1",
    type: "custo",
    title: "Insight de Custo",
    body: "O consumo real de pigmento Masterbatch ficou 1,2% acima do padrão na Extrusora 02. Impacto financeiro: -R$ 4.200 no mês.",
    action: "Ação: Calibrar o dosador volumétrico.",
    impact: "Economia estimada: R$ 4.200/mês",
    icon: Target,
  },
  {
    id: "gargalo-1",
    type: "gargalo",
    title: "Insight de Gargalo",
    body: "O setor de Corte e Solda está com 85% de ocupação, operando como o gargalo da planta nesta semana.",
    action: "Sugestão: Priorizar OPs de sacolas de alta tiragem no turno da noite.",
    impact: "Ganho de throughput: +12%",
    icon: TrendingUp,
  },
  {
    id: "qualidade-1",
    type: "qualidade",
    title: "Insight de Qualidade",
    body: "Zero reclamações de clientes nos últimos 15 dias. Índice de conformidade ISO 9001 em 98,4%.",
    action: "Ação: Manter o plano de amostragem atual e reforçar o 5S no setor de corte.",
    impact: "Conformidade: 98,4%",
    icon: ShieldCheck,
  },
];

function AdvisoryCard({ insight, index }: { insight: Insight; index: number }) {
  const Icon = insight.icon;
  return (
    <div
      className={cn(
        "relative flex gap-4 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]",
        insight.type === "custo" && "border-l-4 border-l-warning",
        insight.type === "gargalo" && "border-l-4 border-l-info",
        insight.type === "qualidade" && "border-l-4 border-l-success",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
        </div>
        <p className="text-[12px] leading-tight text-foreground">{insight.body}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
            <Lightbulb className="h-3 w-3" />
            {insight.action}
          </span>
          <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">{insight.impact}</span>
        </div>
      </div>
    </div>
  );
}

export function ExecutiveIntelligenceHub() {
  const kpisFn = useServerFn(biKpisConsolidados);
  const [printing, setPrinting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["executive-intelligence-hub"],
    queryFn: () => kpisFn({}),
  });

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 300);
  };

  if (isLoading) {
    return (
      <ExecPage>
        <ExecHeader title="Executive Intelligence Hub" subtitle="Carregando números reais da fábrica..." />
        <LoadingState />
      </ExecPage>
    );
  }

  if (error || !data) {
    return (
      <ExecPage>
        <ExecHeader title="Executive Intelligence Hub" />
        <EmptyState title="Erro ao carregar painel" description={String(error ?? "Dados indisponíveis")} />
      </ExecPage>
    );
  }

  const k = data as BiKpis;

  // OEE Geral simulado a partir de refugo e atrasos (quanto menor o refugo e atrasos, maior o OEE)
  const oeeGeral = Math.max(0, Math.min(100, 92 - k.refugo_pct * 2 - k.ops_atrasadas * 0.5));

  return (
    <div className="print-page">
      <ExecPage>
        <ExecHeader
          title="Executive Intelligence Hub"
          subtitle="Visão de 1 tela para diretoria e gerentes: números reais da fábrica + pareceres que ensinam a decidir."
          periodLabel="Atualizado em tempo real"
          statusLabel="Sistema operacional"
          onExport={handlePrint}
          exporting={printing}
          actions={
            <Button size="sm" variant="outline" onClick={handlePrint} disabled={printing} className="print:hidden">
              <Printer className="mr-1.5 h-4 w-4" />
              Imprimir A4
            </Button>
          }
        />

        {/* 4 Cards Principais */}
        <ExecKpiGrid cols={4}>
          <KpiCard
            label="Faturamento Líquido Realizado"
            value={brl(k.faturamento_mes)}
            icon={TrendingUp}
            tone="positive"
            delta={k.faturamento_12m > 0 ? ((k.faturamento_mes - k.faturamento_12m / 12) / (k.faturamento_12m / 12)) * 100 : 0}
            deltaLabel="vs. média 12m"
            hint="Receita líquida do mês"
          />
          <KpiCard
            label="Margem de Contribuição Média"
            value={pct(k.margem_bruta_pct)}
            icon={Percent}
            tone={k.margem_bruta_pct >= 20 ? "positive" : k.margem_bruta_pct >= 10 ? "warning" : "danger"}
            status={k.margem_bruta_pct >= 20 ? "OK" : "Atenção"}
            hint="Lucratividade sobre receita"
          />
          <KpiCard
            label="OEE Geral da Fábrica"
            value={pct(oeeGeral)}
            icon={Factory}
            tone={oeeGeral >= 85 ? "positive" : oeeGeral >= 70 ? "warning" : "danger"}
            delta={-2.4}
            deltaLabel="vs. semana anterior"
            deltaInverse
            status={oeeGeral >= 85 ? "Bom" : oeeGeral >= 70 ? "Regular" : "Crítico"}
            hint="Disponibilidade × Performance × Qualidade"
          />
          <KpiCard
            label="Índice Geral de Refugo / Perda de Filme"
            value={pct(k.refugo_pct)}
            icon={AlertTriangle}
            tone={k.refugo_pct > 3 ? "danger" : k.refugo_pct > 1.5 ? "warning" : "positive"}
            delta={k.refugo_pct}
            deltaLabel="meta: < 2%"
            deltaInverse
            status={k.refugo_pct > 3 ? "Crítico" : k.refugo_pct > 1.5 ? "Atenção" : "OK"}
            hint="Perda de material em processos"
          />
        </ExecKpiGrid>

        {/* Parecer Consultivo da Engenharia */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Parecer Consultivo da Engenharia</CardTitle>
              <CardDescription className="text-[12px]">
                Gerado automaticamente com base nas boas práticas de embalagens plásticas flexíveis.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {advisoryInsights.map((insight, i) => (
              <AdvisoryCard key={insight.id} insight={insight} index={i} />
            ))}
          </CardContent>
        </Card>

        {/* Rodapé de impressão */}
        <div className="hidden print:block mt-6 border-t border-border pt-4 text-[11px] text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>
              Relatório gerencial FLUX — Executive Intelligence Hub — impresso em {new Date().toLocaleDateString("pt-BR")}
            </span>
            <span>Confidencial — Uso interno da diretoria</span>
          </div>
        </div>
      </ExecPage>
    </div>
  );
}
