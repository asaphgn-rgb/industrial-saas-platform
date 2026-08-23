import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
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
import {
  ResponsiveDataTable,
  COLUMN_MIN,
  type ResponsiveColumn,
} from "@/components/flux/ResponsiveDataTable";
import { exportarCsv } from "@/lib/csv-export";
import { Download, Filter } from "lucide-react";
import { trilhaAvancada, type TrilhaAvancadaRow } from "@/lib/compras-governanca.functions";

const NUM = (v: number) =>
  Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const DT = (v: string) => new Date(v).toLocaleString("pt-BR");

const hoje = new Date();
const isoDia = (d: Date) => d.toISOString().slice(0, 10);

const TIPO_CLS: Record<string, string> = {
  entrada: "border-success/40 bg-success/10 text-success",
  saida: "border-destructive/40 bg-destructive/10 text-destructive",
  transferencia: "border-info/40 bg-info/10 text-info",
  ajuste: "border-warning/40 bg-warning/10 text-warning",
};

export function AbaTrilhaAvancada() {
  const fetchTrilha = useServerFn(trilhaAvancada);
  const [de, setDe] = useState(isoDia(new Date(hoje.getTime() - 30 * 86400000)));
  const [ate, setAte] = useState(isoDia(hoje));
  const [tipo, setTipo] = useState("todos");
  const [op, setOp] = useState("");
  const [busca, setBusca] = useState("");

  const q = useQuery({
    queryKey: ["trilha-avancada", de, ate, tipo, op],
    queryFn: () =>
      fetchTrilha({
        data: { inicio: de, fim: ate, tipo: tipo === "todos" ? null : tipo, op: op || null },
      }),
  });

  const rows = useMemo(() => {
    const t = busca.trim().toLowerCase();
    if (!t) return q.data ?? [];
    return (q.data ?? []).filter(
      (r) =>
        r.item.toLowerCase().includes(t) ||
        (r.documento ?? "").toLowerCase().includes(t) ||
        r.usuario.toLowerCase().includes(t),
    );
  }, [q.data, busca]);

  const cols: ResponsiveColumn<TrilhaAvancadaRow>[] = [
    {
      key: "data",
      header: "Data/hora",
      align: "center",
      minWidth: COLUMN_MIN.date,
      render: (r) => <span className="whitespace-nowrap tabular-nums">{DT(r.data)}</span>,
    },
    {
      key: "tipo",
      header: "Tipo",
      align: "center",
      minWidth: COLUMN_MIN.status,
      render: (r) => (
        <Badge variant="outline" className={TIPO_CLS[r.tipo] ?? "border-muted text-muted-foreground"}>
          {r.tipo}
        </Badge>
      ),
    },
    { key: "item", header: "Item", align: "left", minWidth: COLUMN_MIN.nameWide, render: (r) => r.item },
    {
      key: "qtd",
      header: "Qtd",
      align: "right",
      minWidth: COLUMN_MIN.numeric,
      render: (r) => (
        <span
          className={`font-mono text-xs tabular-nums ${
            r.quantidade < 0 ? "text-destructive" : "text-success"
          }`}
        >
          {NUM(r.quantidade)}
        </span>
      ),
    },
    {
      key: "saldo",
      header: "Antes → Depois",
      align: "left",
      minWidth: 220,
      render: (r) => (
        <span className="text-xs text-muted-foreground">
          {r.antes} → <span className="text-foreground">{r.depois}</span>
        </span>
      ),
    },
    {
      key: "op",
      header: "OP",
      align: "center",
      minWidth: COLUMN_MIN.code,
      hideBelow: "md",
      render: (r) => r.op ?? "—",
    },
    {
      key: "documento",
      header: "Documento",
      align: "center",
      minWidth: COLUMN_MIN.code,
      hideBelow: "lg",
      render: (r) => r.documento ?? "—",
    },
    {
      key: "usuario",
      header: "Usuário",
      align: "left",
      minWidth: COLUMN_MIN.name,
      hideBelow: "lg",
      render: (r) => r.usuario,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4 text-primary" />
          Trilha de auditoria de movimentações
        </CardTitle>
        <CardDescription>
          Filtre por período, tipo de movimentação e ordem de produção. Cada linha mostra o saldo
          antes e depois do lançamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5">
            <Label>De</Label>
            <Input type="date" value={de} onChange={(e) => setDe(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Até</Label>
            <Input type="date" value={ate} onChange={(e) => setAte(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
                <SelectItem value="ajuste">Ajuste</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>OP</Label>
            <Input value={op} onChange={(e) => setOp(e.target.value)} placeholder="Nº da OP" />
          </div>
          <div className="space-y-1.5">
            <Label>Busca livre</Label>
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Item, documento, usuário"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {rows.length} movimentação(ões) no filtro atual.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportarCsv({
                nomeArquivo: `flux-trilha-estoque-${de}_${ate}`,
                colunas: [
                  "Data",
                  "Tipo",
                  "Item",
                  "Quantidade",
                  "Unidade",
                  "Antes",
                  "Depois",
                  "OP",
                  "Documento",
                  "Origem",
                  "Usuário",
                  "Detalhe",
                ],
                linhas: rows.map((r) => [
                  DT(r.data),
                  r.tipo,
                  r.item,
                  r.quantidade,
                  r.unidade,
                  r.antes,
                  r.depois,
                  r.op ?? "",
                  r.documento ?? "",
                  r.origem,
                  r.usuario,
                  r.detalhe ?? "",
                ]),
              })
            }
          >
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        </div>

        <ResponsiveDataTable
          rows={rows}
          columns={cols}
          getRowId={(r) => r.id}
          isLoading={q.isLoading}
          emptyTitle="Nenhuma movimentação encontrada"
          emptyDescription="Amplie o período ou remova os filtros."
          mobileTitle={(r) => r.item}
          mobileSubtitle={(r) => `${DT(r.data)} · ${r.tipo}`}
        />
      </CardContent>
    </Card>
  );
}
