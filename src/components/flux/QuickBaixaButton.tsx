import { formatBRL } from "@/components/flux/MoneyValue";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as typedSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/friendly-error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

const BRL = (v: number) => formatBRL(v);

/**
 * QuickBaixaButton — botão de "baixa rápida" (quitação) inline em uma lista
 * de contas a receber ou pagar. Um clique abre um popover pré-preenchido com
 * data = hoje e valor = saldo atual do título; o usuário confirma sem
 * precisar abrir a tela de detalhe.
 */
export function QuickBaixaButton({
  row,
  tabela,
  compact = true,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Record<string, any>;
  tabela: "receber" | "pagar";
  compact?: boolean;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const status = String(row?.status ?? "");
  const saldoRaw =
    row?.saldo != null
      ? Number(row.saldo)
      : Math.max((Number(row?.valor_original) || 0) - (Number(row?.valor_pago) || 0), 0);
  const saldo = Number.isFinite(saldoRaw) ? Math.max(saldoRaw, 0) : 0;

  const today = new Date().toISOString().slice(0, 10);
  const [valor, setValor] = useState<string>(saldo.toFixed(2));
  const [data, setData] = useState<string>(today);
  const [forma, setForma] = useState<string>(
    tabela === "receber"
      ? String(row?.forma_recebimento ?? "")
      : String(row?.forma_pagamento ?? ""),
  );

  const tblBaixas = tabela === "receber" ? "contas_receber_baixas" : "contas_pagar_baixas";
  const listKey = tabela === "receber" ? "contas_receber" : "contas_pagar";

  const mutation = useMutation({
    mutationFn: async () => {
      const v = Number(valor);
      if (!Number.isFinite(v) || v <= 0) throw new Error("Informe um valor válido.");
      if (v > saldo + 0.009) throw new Error(`Valor maior que o saldo (${BRL(saldo)}).`);
      const { data: userRes } = await supabase.auth.getUser();
      const { error } = await supabase.from(tblBaixas).insert({
        tenant_id: row.tenant_id,
        conta_id: row.id,
        data_baixa: data,
        valor: v,
        forma: forma || null,
        conta_bancaria: row.conta_bancaria ?? null,
        observacoes: v >= saldo - 0.009 ? "Quitação total (lista)" : "Baixa parcial (lista)",
        created_by: userRes?.user?.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(
        Number(valor) >= saldo - 0.009 ? "Título quitado." : "Baixa parcial registrada.",
      );
      setOpen(false);
      qc.invalidateQueries({ queryKey: [listKey] });
      qc.invalidateQueries({ queryKey: ["cr-detalhe", row.id] });
      qc.invalidateQueries({ queryKey: ["cp-detalhe", row.id] });
      qc.invalidateQueries({ queryKey: ["child", tblBaixas] });
      qc.invalidateQueries({ queryKey: ["painel-financeiro"] });
    },
    onError: (e: Error) => toast.error(friendlyError(e, "Falha ao registrar baixa.")),
  });

  if (saldo <= 0 || status === "pago" || status === "cancelado") {
    return (
      <span className="text-[10px] text-muted-foreground" title="Título sem saldo em aberto">
        —
      </span>
    );
  }

  const label = tabela === "receber" ? "Receber" : "Pagar";

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          // Reset defaults on each open so a stale value doesn't get reused.
          setValor(saldo.toFixed(2));
          setData(today);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          size={compact ? "sm" : "default"}
          variant="outline"
          className="h-7 gap-1 border-success/40 px-2 text-success hover:bg-success/10 hover:text-success"
          onClick={(e) => e.stopPropagation()}
          title={`Baixa rápida — ${label} ${BRL(saldo)}`}
          aria-label={`Registrar baixa rápida de ${BRL(saldo)}`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-72"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !mutation.isPending) {
            e.preventDefault();
            mutation.mutate();
          }
        }}
      >
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold">Baixa rápida</p>
            <p className="text-[11px] text-muted-foreground">
              Saldo em aberto: <span className="font-mono">{BRL(saldo)}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="qb-data" className="text-[11px]">
                Data
              </Label>
              <Input
                id="qb-data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="qb-valor" className="text-[11px]">
                Valor
              </Label>
              <Input
                id="qb-valor"
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="h-8 font-mono"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="qb-forma" className="text-[11px]">
              Forma
            </Label>
            <Input
              id="qb-forma"
              placeholder={tabela === "receber" ? "PIX, boleto, etc." : "PIX, TED, boleto…"}
              value={forma}
              onChange={(e) => setForma(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="flex justify-between gap-2 pt-1">
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => setValor(saldo.toFixed(2))}
              className="text-[11px]"
              title="Usar saldo total"
            >
              Total
            </Button>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" type="button" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                )}
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
