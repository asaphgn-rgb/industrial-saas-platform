import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase as typedSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/friendly-error";
import { confirmDialog } from "@/components/flux/ConfirmDialog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

type SC = Record<string, unknown> & {
  id: string;
  numero: string;
  tenant_id: string;
  status?: string;
};

export function GerarCotacaoButton({ sc }: { sc: SC }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function handle() {
    if (loading) return;
    if (
      !(await confirmDialog({
        title: `Gerar uma cotação a partir da SC ${sc.numero}?`,
        description: "Os itens serão copiados sem fornecedor definido.",
      }))
    )
      return;
    setLoading(true);
    try {
      const { data: itens, error: iErr } = await supabase
        .from("sc_itens")
        .select("materia_prima_id, descricao_livre, quantidade, unidade_medida_id, observacoes")
        .eq("solicitacao_id", sc.id);
      if (iErr) throw iErr;
      if (!itens || itens.length === 0) {
        toast.warning("Esta SC não possui itens.");
        setLoading(false);
        return;
      }

      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      const { data: cot, error: cErr } = await supabase
        .from("cotacoes")
        .insert({
          tenant_id: sc.tenant_id,
          numero: `COT-${sc.numero}-${suffix}`,
          solicitacao_id: sc.id,
          data_cotacao: new Date().toISOString().slice(0, 10),
          status: "aberta",
          observacoes: `Gerada a partir da SC ${sc.numero}`,
        })
        .select("id, numero")
        .single();
      if (cErr) throw cErr;

      const rows = (itens as Array<Record<string, unknown>>).map((it) => ({
        tenant_id: sc.tenant_id,
        cotacao_id: cot.id,
        materia_prima_id: it.materia_prima_id ?? null,
        descricao_livre: it.descricao_livre ?? null,
        quantidade: it.quantidade,
        unidade_medida_id: it.unidade_medida_id ?? null,
        preco_unitario: 0,
        observacoes: it.observacoes ?? null,
      }));
      const { error: itErr } = await supabase.from("cotacao_itens").insert(rows);
      if (itErr) throw itErr;

      // Atualiza status da SC
      await supabase.from("solicitacoes_compra").update({ status: "cotando" }).eq("id", sc.id);

      qc.invalidateQueries({ queryKey: ["sc-detalhe", sc.id] });
      qc.invalidateQueries({ queryKey: ["cadastro-crud", "cotacoes"] });

      toast.success(`Cotação ${cot.numero} criada com ${rows.length} item(s).`);
      navigate({ to: "/suprimentos/cotacoes/$id", params: { id: cot.id as string } });
    } catch (e) {
      toast.error(friendlyError(e, "Falha ao gerar cotação"));
    } finally {
      setLoading(false);
    }
  }

  const bloqueado = sc.status === "cancelada" || sc.status === "atendida";
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handle}
      disabled={loading || bloqueado}
      title={bloqueado ? "SC cancelada ou já atendida" : undefined}
    >
      {loading ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <FileSpreadsheet className="mr-1 h-4 w-4" />
      )}
      Gerar Cotação
    </Button>
  );
}
