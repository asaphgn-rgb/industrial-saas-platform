import { formatBRL } from "@/components/flux/MoneyValue";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState } from "@/components/flux/LoadingState";
import { EmptyState } from "@/components/flux/EmptyState";
import { ResponsiveDataTable } from "@/components/flux/ResponsiveDataTable";
import { Save } from "lucide-react";
import {
  salvarVersaoCusto,
  listarVersoesCusto,
  compararVersoesCusto,
} from "@/lib/custo-versoes.functions";
import type { CustoProcessosResultado } from "@/lib/custo-processos.functions";

const brl = (v: number) =>
  Number.isFinite(v)
    ? formatBRL(v)
    : "—";
const num = (v: number, d = 1) =>
  Number.isFinite(v) ? v.toLocaleString("pt-BR", { maximumFractionDigits: d }) : "—";
const dataBr = (iso: string) => new Date(iso).toLocaleString("pt-BR");

export function VersoesCusto({
  dados,
  de,
  ate,
  custoHoraPadrao,
}: {
  dados: CustoProcessosResultado | undefined;
  de: string;
  ate: string;
  custoHoraPadrao: number;
}) {
  const qc = useQueryClient();
  const salvarFn = useServerFn(salvarVersaoCusto);
  const listarFn = useServerFn(listarVersoesCusto);
  const compararFn = useServerFn(compararVersoesCusto);

  const [observacao, setObservacao] = useState("");
  const [baseId, setBaseId] = useState("");
  const [compId, setCompId] = useState("");

  const versoes = useQuery({
    queryKey: ["custo-versoes"],
    queryFn: () => listarFn({}),
    staleTime: 30_000,
  });

  const salvar = useMutation({
    mutationFn: () => {
      if (!dados) throw new Error("Sem dados no período para versionar.");
      return salvarFn({
        data: {
          de,
          ate,
          custoHoraPadrao,
          totalCusto: dados.totalCusto,
          totalCustoParada: dados.totalCustoParada,
          totalProduzido: dados.totalProduzido,
          totalRefugo: dados.totalRefugo,
          custoMedioUnidade: dados.custoMedioUnidade,
          observacao,
          porEtapa: dados.porEtapa.map((e) => ({
            etapa: e.etapa,
            horasProducao: e.horasProducao,
            custoTotal: e.custoTotal,
            custoParada: e.custoParada,
            produzido: e.produzido,
            refugoPct: e.refugoPct,
            custoPorUnidade: e.custoPorUnidade,
          })),
          porMaquina: dados.porMaquina,
          porDia: dados.porDia,
        },
      });
    },
    onSuccess: (r) => {
      toast.success(`Versão ${r.versao} salva para auditoria.`);
      setObservacao("");
      qc.invalidateQueries({ queryKey: ["custo-versoes"] });
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível salvar a versão."),
  });

  const comparacao = useQuery({
    queryKey: ["custo-comparacao", baseId, compId],
    queryFn: () => compararFn({ data: { baseId, comparadoId: compId } }),
    enabled: Boolean(baseId && compId && baseId !== compId),
  });

  const lista = versoes.data ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Nova versão do período</CardTitle>
          <CardDescription>
            Congela os custos por processo e máquina de {de} a {ate}, registrando autor e data.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-1">
            <Label className="text-xs">Observação (opcional)</Label>
            <Input
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex.: fechamento de julho, custo/hora revisado"
              className="h-11"
            />
          </div>
          <Button onClick={() => salvar.mutate()} disabled={!dados || salvar.isPending}>
            <Save className="mr-2 h-4 w-4" /> {salvar.isPending ? "Salvando…" : "Salvar versão"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Histórico de versões</CardTitle>
          <CardDescription>Quem gerou, quando e com quais parâmetros.</CardDescription>
        </CardHeader>
        <CardContent>
          {versoes.isLoading ? (
            <LoadingState variant="list" />
          ) : !lista.length ? (
            <EmptyState
              title="Nenhuma versão salva"
              description="Salve a primeira versão para começar o histórico de auditoria."
            />
          ) : (
            <ResponsiveDataTable
              rows={lista}
              getRowId={(v) => v.id}
              mobileTitle={(v) => `v${v.versao} · ${v.periodoDe} → ${v.periodoAte}`}
              columns={[
                { key: "v", header: "Versão", render: (v) => <Badge variant="outline">v{v.versao}</Badge> },
                { key: "per", header: "Período", render: (v) => `${v.periodoDe} → ${v.periodoAte}` },
                { key: "ch", header: "R$/h padrão", align: "right", render: (v) => brl(v.custoHoraPadrao) },
                { key: "tot", header: "Custo total", align: "right", render: (v) => brl(v.totalCusto) },
                { key: "par", header: "Paradas", align: "right", render: (v) => brl(v.totalCustoParada) },
                { key: "cmu", header: "R$/un", align: "right", render: (v) => brl(v.custoMedioUnidade) },
                { key: "autor", header: "Autor", render: (v) => v.autor },
                { key: "quando", header: "Gerado em", render: (v) => dataBr(v.criadoEm) },
                { key: "obs", header: "Observação", render: (v) => v.observacao ?? "—" },
              ]}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Comparar períodos</CardTitle>
          <CardDescription>Variação de custo por processo e por máquina entre duas versões.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs">Versão base</Label>
              <Select value={baseId} onValueChange={setBaseId}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {lista.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      v{v.versao} · {v.periodoDe} → {v.periodoAte}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Comparar com</Label>
              <Select value={compId} onValueChange={setCompId}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {lista.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      v{v.versao} · {v.periodoDe} → {v.periodoAte}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {comparacao.isLoading ? (
            <LoadingState variant="list" />
          ) : comparacao.data ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Base: v{comparacao.data.base.versao} ({comparacao.data.base.periodo}) por{" "}
                {comparacao.data.base.autor} · Comparado: v{comparacao.data.comparado.versao} (
                {comparacao.data.comparado.periodo}) por {comparacao.data.comparado.autor}
              </p>
              {[
                { titulo: "Indicadores", linhas: comparacao.data.kpis },
                { titulo: "Por processo", linhas: comparacao.data.porEtapa },
                { titulo: "Por máquina", linhas: comparacao.data.porMaquina },
              ].map((bloco) => (
                <div key={bloco.titulo} className="space-y-2">
                  <h4 className="text-sm font-semibold">{bloco.titulo}</h4>
                  <ResponsiveDataTable
                    rows={bloco.linhas}
                    getRowId={(l) => `${bloco.titulo}-${l.chave}`}
                    mobileTitle={(l) => l.chave}
                    columns={[
                      { key: "k", header: "Item", render: (l) => <span className="capitalize">{l.chave}</span> },
                      { key: "b", header: "Base", align: "right", render: (l) => num(l.base, 2) },
                      { key: "c", header: "Comparado", align: "right", render: (l) => num(l.comparado, 2) },
                      {
                        key: "d",
                        header: "Variação",
                        align: "right",
                        render: (l) => (
                          <span className={l.variacao > 0 ? "text-destructive" : "text-success"}>
                            {l.variacao > 0 ? "+" : ""}
                            {num(l.variacao, 2)}
                          </span>
                        ),
                      },
                      {
                        key: "p",
                        header: "Variação %",
                        align: "right",
                        render: (l) => `${l.variacaoPct > 0 ? "+" : ""}${num(l.variacaoPct, 1)}%`,
                      },
                    ]}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Selecione duas versões diferentes para ver as variações.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
