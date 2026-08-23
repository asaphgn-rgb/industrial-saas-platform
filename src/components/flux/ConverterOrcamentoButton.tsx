import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase as typedSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/friendly-error";
import { confirmDialog } from "@/components/flux/ConfirmDialog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

const BLOQUEIA = new Set(["convertido", "rejeitado", "expirado"]);

/**
 * ConverterOrcamentoButton — botão inline para converter um orçamento em
 * Pedido de Venda em 1 clique. Copia todos os itens, marca o orçamento como
 * "convertido" e navega para o pedido criado. Reutiliza a mesma lógica da
 * tela de detalhe, mas em formato compacto para listas.
 */
export function ConverterOrcamentoButton({
  orc,
  variant = "compact",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orc: Record<string, any>;
  variant?: "compact" | "full";
}) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);

  const status = String(orc?.status ?? "");
  const disabled = BLOQUEIA.has(status);

  async function handle(e: React.MouseEvent) {
    e.stopPropagation();
    if (loading || disabled) return;
    if (
      !(await confirmDialog({
        title: `Converter orçamento ${orc.numero} em Pedido de Venda?`,
        description: "Os itens serão copiados e o orçamento marcado como convertido.",
      }))
    )
      return;
    setLoading(true);
    try {
      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      const novoNumero = `PV-${orc.numero}-${suffix}`;
      const today = new Date().toISOString().slice(0, 10);
      const { data: novoPed, error: pedErr } = await supabase
        .from("pedidos_venda")
        .insert({
          tenant_id: orc.tenant_id,
          numero: novoNumero,
          cliente_id: orc.cliente_id,
          orcamento_id: orc.id,
          data_pedido: today,
          status: "aberto",
          condicao_pagamento: orc.condicao_pagamento,
          frete_tipo: orc.frete_tipo,
          frete_valor: orc.frete_valor,
          desconto_pct: orc.desconto_pct,
          vendedor_nome: orc.vendedor_nome,
          observacoes: orc.observacoes,
        })
        .select("id, numero")
        .single();
      if (pedErr) throw pedErr;

      const { data: itens } = await supabase
        .from("orcamento_itens")
        .select(
          "produto_id, descricao_livre, quantidade, unidade_medida_id, preco_unitario, desconto_pct, observacoes",
        )
        .eq("orcamento_id", orc.id);

      if (itens && itens.length > 0) {
        const novosItens = (itens as Record<string, unknown>[]).map((it) => ({
          ...it,
          tenant_id: orc.tenant_id,
          pedido_id: novoPed.id,
        }));
        const { error: itensErr } = await supabase.from("pedido_itens").insert(novosItens);
        if (itensErr) throw itensErr;
      }

      await supabase.from("orcamentos").update({ status: "convertido" }).eq("id", orc.id);

      qc.invalidateQueries({ queryKey: ["orcamentos"] });
      qc.invalidateQueries({ queryKey: ["pedidos_venda"] });
      qc.invalidateQueries({ queryKey: ["orcamento-detalhe", orc.id] });

      toast.success(`Pedido ${novoPed.numero} criado a partir do orçamento.`, {
        action: {
          label: "Abrir",
          onClick: () =>
            navigate({
              to: "/comercial/pedidos-venda/$id",
              params: { id: novoPed.id as string },
            }),
        },
      });
    } catch (err) {
      toast.error(friendlyError(err, "Falha ao converter"));
    } finally {
      setLoading(false);
    }
  }

  if (disabled) {
    return (
      <span
        className="text-[10px] text-muted-foreground"
        title={`Status "${status}" não permite conversão`}
      >
        —
      </span>
    );
  }

  if (variant === "full") {
    return (
      <Button size="sm" onClick={handle} disabled={loading}>
        {loading ? (
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        ) : (
          <ArrowRightCircle className="mr-1 h-4 w-4" />
        )}
        Converter em Pedido
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-7 gap-1 border-primary/40 px-2 text-primary hover:bg-primary/10 hover:text-primary"
      onClick={handle}
      disabled={loading}
      title="Converter em Pedido de Venda"
      aria-label={`Converter orçamento ${orc.numero} em Pedido de Venda`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <ArrowRightCircle className="h-3.5 w-3.5" />
      )}
      <span className="text-[11px] font-medium">Pedido</span>
    </Button>
  );
}
