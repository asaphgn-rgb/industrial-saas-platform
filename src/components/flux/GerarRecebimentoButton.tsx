import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase as typedSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackageCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/friendly-error";
import { useQueryClient } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

type PC = Record<string, unknown> & {
  id: string;
  numero: string;
  tenant_id: string;
  fornecedor_id?: string | null;
  status?: string;
};

export function GerarRecebimentoButton({ pc }: { pc: PC }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nf, setNf] = useState("");
  const [chave, setChave] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(today);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const bloqueado = pc.status === "cancelado" || pc.status === "recebido";

  async function handle() {
    if (loading) return;
    setLoading(true);
    try {
      // Carrega itens do PC com saldo pendente
      const { data: itens, error: iErr } = await supabase
        .from("pc_itens")
        .select(
          "id, materia_prima_id, unidade_medida_id, preco_unitario, quantidade, quantidade_recebida",
        )
        .eq("pedido_compra_id", pc.id);
      if (iErr) throw iErr;
      const pendentes = ((itens ?? []) as Array<Record<string, unknown>>)
        .map((it) => {
          const pend = Number(it.quantidade ?? 0) - Number(it.quantidade_recebida ?? 0);
          return Object.assign({}, it, { _pendente: pend > 0 ? pend : 0 }) as Record<
            string,
            unknown
          > & { _pendente: number };
        })
        .filter((it) => it._pendente > 0);

      if (pendentes.length === 0) {
        toast.warning("Não há itens pendentes de recebimento neste PC.");
        setLoading(false);
        return;
      }

      // Gera número REC único-ish
      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      const numero = `REC-${pc.numero}-${suffix}`;

      const { data: rec, error: rErr } = await supabase
        .from("recebimentos")
        .insert({
          tenant_id: pc.tenant_id,
          numero,
          pedido_compra_id: pc.id,
          fornecedor_id: pc.fornecedor_id ?? null,
          data_recebimento: data,
          nota_fiscal: nf || null,
          chave_nfe: chave || null,
          status: "recebido",
          observacoes: `Gerado a partir do PC ${pc.numero}`,
        })
        .select("id, numero")
        .single();
      if (rErr) throw rErr;

      const rows = pendentes.map((it) => ({
        tenant_id: pc.tenant_id,
        recebimento_id: rec.id,
        pc_item_id: it.id,
        materia_prima_id: it.materia_prima_id ?? null,
        unidade_medida_id: it.unidade_medida_id ?? null,
        preco_unitario: it.preco_unitario ?? null,
        quantidade: it._pendente,
      }));
      const { error: itErr } = await supabase.from("recebimento_itens").insert(rows);
      if (itErr) throw itErr;

      qc.invalidateQueries({ queryKey: ["pc-detalhe", pc.id] });
      qc.invalidateQueries({ queryKey: ["cadastro-crud", "recebimentos"] });

      toast.success(`Recebimento ${rec.numero} gerado com ${rows.length} item(s).`, {
        action: {
          label: "Abrir",
          onClick: () =>
            navigate({ to: "/suprimentos/recebimentos/$id", params: { id: rec.id as string } }),
        },
      });
      setOpen(false);
      navigate({ to: "/suprimentos/recebimentos/$id", params: { id: rec.id as string } });
    } catch (e) {
      toast.error(friendlyError(e, "Falha ao gerar recebimento"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={bloqueado}
          title={bloqueado ? "PC cancelado ou totalmente recebido" : undefined}
        >
          <PackageCheck className="mr-1 h-4 w-4" />
          Gerar Recebimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Recebimento a partir do PC</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Os itens serão criados automaticamente com a quantidade pendente de cada linha do pedido{" "}
            {pc.numero}.
          </p>
          <div>
            <Label>Data do recebimento</Label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nota Fiscal</Label>
              <Input value={nf} onChange={(e) => setNf(e.target.value)} placeholder="Nº NF" />
            </div>
            <div>
              <Label>Chave NFe</Label>
              <Input
                value={chave}
                onChange={(e) => setChave(e.target.value)}
                placeholder="44 dígitos"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <PackageCheck className="mr-1 h-4 w-4" />
            )}
            Gerar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
