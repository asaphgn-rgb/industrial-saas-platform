import { formatBRL } from "@/components/flux/MoneyValue";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ResponsiveDataTable,
  COLUMN_MIN,
  type ResponsiveColumn,
} from "@/components/flux/ResponsiveDataTable";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import {
  listarAlcadas,
  salvarAlcada,
  excluirAlcada,
  type AlcadaRow,
} from "@/lib/compras-governanca.functions";

const BRL = (v: number | null) =>
  v === null
    ? "Sem limite"
    : formatBRL(Number(v || 0));

const PAPEIS = [
  { value: "super_admin", label: "Super admin" },
  { value: "admin", label: "Administrador" },
  { value: "diretor", label: "Diretor" },
  { value: "gestor", label: "Gestor" },
  { value: "compras", label: "Compras" },
  { value: "financeiro", label: "Financeiro" },
];

type FormState = {
  id: string | null;
  nome: string;
  familia: string;
  valor_min: string;
  valor_max: string;
  niveis_necessarios: string;
  papeis: string[];
  ordem: string;
  observacoes: string;
};

const VAZIO: FormState = {
  id: null,
  nome: "",
  familia: "",
  valor_min: "0",
  valor_max: "",
  niveis_necessarios: "1",
  papeis: [],
  ordem: "0",
  observacoes: "",
};

export function AbaAlcadas() {
  const qc = useQueryClient();
  const fetchAlcadas = useServerFn(listarAlcadas);
  const salvar = useServerFn(salvarAlcada);
  const excluir = useServerFn(excluirAlcada);
  const [form, setForm] = useState<FormState>(VAZIO);

  const q = useQuery({ queryKey: ["compra-alcadas"], queryFn: () => fetchAlcadas() });

  const mSalvar = useMutation({
    mutationFn: () =>
      salvar({
        data: {
          id: form.id,
          nome: form.nome,
          familia: form.familia || null,
          valor_min: form.valor_min,
          valor_max: form.valor_max,
          niveis_necessarios: form.niveis_necessarios,
          papeis: form.papeis,
          ordem: form.ordem,
          observacoes: form.observacoes || null,
        },
      }),
    onSuccess: () => {
      toast.success("Alçada salva");
      setForm(VAZIO);
      qc.invalidateQueries({ queryKey: ["compra-alcadas"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const mExcluir = useMutation({
    mutationFn: (id: string) => excluir({ data: { id } }),
    onSuccess: () => {
      toast.success("Alçada removida");
      qc.invalidateQueries({ queryKey: ["compra-alcadas"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cols: ResponsiveColumn<AlcadaRow>[] = [
    { key: "nome", header: "Alçada", align: "left", minWidth: COLUMN_MIN.nameWide, render: (r) => r.nome },
    {
      key: "familia",
      header: "Família",
      align: "center",
      minWidth: COLUMN_MIN.code,
      render: (r) => r.familia ?? "Todas",
    },
    {
      key: "faixa",
      header: "Faixa de valor",
      align: "right",
      minWidth: COLUMN_MIN.numeric,
      render: (r) => (
        <span className="font-mono text-xs tabular-nums">
          {BRL(r.valor_min)} → {BRL(r.valor_max)}
        </span>
      ),
    },
    {
      key: "niveis",
      header: "Aprovadores",
      align: "center",
      minWidth: COLUMN_MIN.status,
      render: (r) => (
        <Badge
          variant="outline"
          className={
            r.niveis_necessarios > 1
              ? "border-warning/40 bg-warning/10 text-warning"
              : "border-info/40 bg-info/10 text-info"
          }
        >
          {r.niveis_necessarios} nível{r.niveis_necessarios > 1 ? "s" : ""}
        </Badge>
      ),
    },
    {
      key: "papeis",
      header: "Papéis autorizados",
      align: "left",
      minWidth: COLUMN_MIN.observations,
      hideBelow: "lg",
      render: (r) => (r.papeis.length ? r.papeis.join(", ") : "Gestão / Compras (padrão)"),
    },
    {
      key: "acoes",
      header: "Ações",
      align: "center",
      minWidth: COLUMN_MIN.actions,
      render: (r) => (
        <div className="flex justify-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setForm({
                id: r.id,
                nome: r.nome,
                familia: r.familia ?? "",
                valor_min: String(r.valor_min),
                valor_max: r.valor_max === null ? "" : String(r.valor_max),
                niveis_necessarios: String(r.niveis_necessarios),
                papeis: r.papeis,
                ordem: String(r.ordem),
                observacoes: r.observacoes ?? "",
              })
            }
          >
            Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => mExcluir.mutate(r.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {form.id ? "Editar alçada" : "Nova alçada de aprovação"}
          </CardTitle>
          <CardDescription>
            Defina faixas de valor e família de produto. Quando a requisição cair na faixa, o número de
            aprovadores configurado passa a ser exigido — cada nível precisa de um usuário diferente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex.: Compras acima de R$ 50 mil"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Família de produto (opcional)</Label>
              <Input
                value={form.familia}
                onChange={(e) => setForm({ ...form, familia: e.target.value })}
                placeholder="Ex.: resinas, tintas, embalagem"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Aprovadores exigidos</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.niveis_necessarios}
                onChange={(e) => setForm({ ...form, niveis_necessarios: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Valor mínimo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.valor_min}
                onChange={(e) => setForm({ ...form, valor_min: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Valor máximo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.valor_max}
                onChange={(e) => setForm({ ...form, valor_max: e.target.value })}
                placeholder="vazio = sem limite"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Ordem de avaliação</Label>
              <Input
                type="number"
                value={form.ordem}
                onChange={(e) => setForm({ ...form, ordem: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Papéis autorizados a aprovar</Label>
            <div className="flex flex-wrap gap-4">
              {PAPEIS.map((p) => (
                <label key={p.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.papeis.includes(p.value)}
                    onCheckedChange={(v) =>
                      setForm({
                        ...form,
                        papeis: v
                          ? [...form.papeis, p.value]
                          : form.papeis.filter((x) => x !== p.value),
                      })
                    }
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => mSalvar.mutate()} disabled={mSalvar.isPending || !form.nome.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              {form.id ? "Salvar alterações" : "Criar alçada"}
            </Button>
            {form.id && (
              <Button variant="outline" onClick={() => setForm(VAZIO)}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alçadas configuradas</CardTitle>
          <CardDescription>
            A alçada mais específica vence: família definida tem prioridade sobre faixa geral.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveDataTable
            rows={q.data ?? []}
            columns={cols}
            getRowId={(r) => r.id}
            isLoading={q.isLoading}
            emptyTitle="Nenhuma alçada configurada"
            emptyDescription="Sem alçada, toda requisição exige apenas 1 aprovação."
            mobileTitle={(r) => r.nome}
            mobileSubtitle={(r) => `${BRL(r.valor_min)} → ${BRL(r.valor_max)}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
