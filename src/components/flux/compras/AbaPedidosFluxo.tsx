import { formatBRL } from "@/components/flux/MoneyValue";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Download, Send, PackageCheck, PackageOpen, Ban, History } from "lucide-react";
import {
  listarPedidosFluxo,
  mudarStatusPedido,
  type PedidoFluxoRow,
  type PcStatus,
} from "@/lib/compras-governanca.functions";

const BRL = (v: number) =>
  formatBRL(Number(v || 0));
const NUM = (v: number, d = 2) =>
  Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const DT = (v: string | null) => (v ? new Date(v).toLocaleString("pt-BR") : "—");

const STATUS_LABEL: Record<string, string> = {
  aberto: "Aberto",
  emitido: "Emitido",
  aprovado: "Aprovado",
  confirmado: "Confirmado",
  enviado: "Enviado",
  parcial: "Parcial",
  recebido_parcial: "Recebido parcial",
  recebido: "Recebido",
  cancelado: "Cancelado",
};
const STATUS_CLS: Record<string, string> = {
  aberto: "border-info/40 bg-info/10 text-info",
  enviado: "border-primary/40 bg-primary/10 text-primary",
  recebido_parcial: "border-warning/40 bg-warning/10 text-warning",
  recebido: "border-success/40 bg-success/10 text-success",
  cancelado: "border-destructive/40 bg-destructive/10 text-destructive",
};
const STATUS_ICON: Record<string, typeof Send> = {
  enviado: Send,
  recebido_parcial: PackageOpen,
  recebido: PackageCheck,
  cancelado: Ban,
};

export function AbaPedidosFluxo() {
  const qc = useQueryClient();
  const fetchPedidos = useServerFn(listarPedidosFluxo);
  const mudar = useServerFn(mudarStatusPedido);
  const [dias, setDias] = useState("120");
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [aberto, setAberto] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["pc-fluxo", dias],
    queryFn: () => fetchPedidos({ data: { dias: Number(dias) } }),
  });

  const mMudar = useMutation({
    mutationFn: (v: { id: string; status: PcStatus; motivo?: string | null }) =>
      mudar({ data: v }),
    onSuccess: (r) => {
      toast.success(`Status atualizado para ${STATUS_LABEL[r.status] ?? r.status} (${r.percentual_recebido}% recebido)`);
      qc.invalidateQueries({ queryKey: ["pc-fluxo"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = useMemo(() => {
    let base = q.data ?? [];
    if (statusFiltro !== "todos") base = base.filter((r) => r.status === statusFiltro);
    const t = filtro.trim().toLowerCase();
    if (t)
      base = base.filter(
        (r) => r.numero.toLowerCase().includes(t) || r.fornecedor.toLowerCase().includes(t),
      );
    return base;
  }, [q.data, filtro, statusFiltro]);

  const acao = (r: PedidoFluxoRow, s: PcStatus) => {
    let motivo: string | null = null;
    if (s === "cancelado") {
      motivo = window.prompt(`Motivo do cancelamento do pedido ${r.numero}:`) ?? null;
      if (!motivo) return;
    }
    mMudar.mutate({ id: r.id, status: s, motivo });
  };

  const cols: ResponsiveColumn<PedidoFluxoRow>[] = [
    {
      key: "numero",
      header: "Pedido",
      align: "center",
      minWidth: COLUMN_MIN.code,
      render: (r) => <span className="font-mono text-xs tabular-nums">{r.numero}</span>,
    },
    {
      key: "fornecedor",
      header: "Fornecedor",
      align: "left",
      minWidth: COLUMN_MIN.nameWide,
      render: (r) => r.fornecedor,
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      minWidth: COLUMN_MIN.status,
      render: (r) => (
        <Badge variant="outline" className={STATUS_CLS[r.status] ?? "border-muted text-muted-foreground"}>
          {STATUS_LABEL[r.status] ?? r.status}
        </Badge>
      ),
    },
    {
      key: "recebido",
      header: "Recebimento",
      align: "center",
      minWidth: COLUMN_MIN.numeric,
      render: (r) => (
        <div className="mx-auto w-28 space-y-1">
          <Progress value={Math.min(100, r.percentual_recebido)} className="h-1.5" />
          <span className="block text-center font-mono text-[11px] tabular-nums text-muted-foreground">
            {NUM(r.qtd_recebida)} / {NUM(r.qtd_pedida)} ({r.percentual_recebido}%)
          </span>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      minWidth: COLUMN_MIN.numeric,
      render: (r) => <span className="font-mono text-xs tabular-nums">{BRL(r.total)}</span>,
    },
    {
      key: "entrega",
      header: "Entrega prev.",
      align: "center",
      minWidth: COLUMN_MIN.date,
      hideBelow: "lg",
      render: (r) =>
        r.data_entrega_prevista
          ? new Date(r.data_entrega_prevista).toLocaleDateString("pt-BR")
          : "—",
    },
    {
      key: "acoes",
      header: "Fluxo",
      align: "center",
      minWidth: 220,
      render: (r) => (
        <div className="flex flex-wrap justify-center gap-1">
          {r.proximos_status.length === 0 && (
            <span className="text-xs text-muted-foreground">Fluxo encerrado</span>
          )}
          {r.proximos_status.map((s) => {
            const Icon = STATUS_ICON[s] ?? Send;
            return (
              <Button
                key={s}
                size="sm"
                variant={s === "cancelado" ? "ghost" : "outline"}
                className={s === "cancelado" ? "text-destructive" : ""}
                disabled={mMudar.isPending}
                onClick={() => acao(r, s)}
              >
                <Icon className="mr-1 h-3.5 w-3.5" />
                {STATUS_LABEL[s]}
              </Button>
            );
          })}
          <Button size="sm" variant="ghost" onClick={() => setAberto(aberto === r.id ? null : r.id)}>
            <History className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const detalhe = rows.find((r) => r.id === aberto) ?? null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Fluxo do pedido de compra</CardTitle>
            <CardDescription>
              Aberto → Enviado → Recebido parcial → Recebido, com cancelamento controlado. Cada
              transição valida as quantidades recebidas dos itens e registra histórico.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Pedido ou fornecedor"
              className="w-52"
            />
            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="recebido_parcial">Recebido parcial</SelectItem>
                <SelectItem value="recebido">Recebido</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dias} onValueChange={setDias}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="120">120 dias</SelectItem>
                <SelectItem value="365">12 meses</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportarCsv({
                  nomeArquivo: "flux-pedidos-compra-fluxo",
                  colunas: [
                    "Pedido",
                    "Fornecedor",
                    "Status",
                    "Qtd pedida",
                    "Qtd recebida",
                    "% recebido",
                    "Total",
                    "Enviado em",
                  ],
                  linhas: rows.map((r) => [
                    r.numero,
                    r.fornecedor,
                    STATUS_LABEL[r.status] ?? r.status,
                    r.qtd_pedida,
                    r.qtd_recebida,
                    r.percentual_recebido,
                    r.total,
                    DT(r.enviado_em),
                  ]),
                })
              }
            >
              <Download className="mr-2 h-4 w-4" /> CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveDataTable
            rows={rows}
            columns={cols}
            getRowId={(r) => r.id}
            isLoading={q.isLoading}
            emptyTitle="Nenhum pedido no período"
            mobileTitle={(r) => r.numero}
            mobileSubtitle={(r) => `${r.fornecedor} · ${STATUS_LABEL[r.status] ?? r.status}`}
          />
        </CardContent>
      </Card>

      {detalhe && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico do pedido {detalhe.numero}</CardTitle>
            <CardDescription>
              {detalhe.itens_pendentes} item(ns) com saldo pendente de recebimento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {detalhe.historico.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma transição registrada — o histórico começa na primeira mudança de status.
              </p>
            ) : (
              <ol className="space-y-3 border-l pl-4">
                {detalhe.historico.map((h) => (
                  <li key={h.id} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                    <p className="font-medium">
                      {STATUS_LABEL[h.status_anterior ?? ""] ?? h.status_anterior ?? "Criação"} →{" "}
                      {STATUS_LABEL[h.status_novo] ?? h.status_novo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {DT(h.created_at)} · {h.usuario_nome ?? "Sistema"}
                      {h.motivo ? ` · ${h.motivo}` : ""}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
