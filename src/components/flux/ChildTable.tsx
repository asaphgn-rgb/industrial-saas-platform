import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as typedSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import type { FieldDef, ColumnDef, FieldOption } from "@/components/flux/CadastroCrud";
import { LoadingState } from "@/components/flux/LoadingState";

import { friendlyError } from "@/lib/friendly-error";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

export type ChildTableProps = {
  title: string;
  description?: string;
  table: string;
  parentField: string;
  parentId: string;
  tenantId: string;
  singular: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  orderBy?: string;
  ascending?: boolean;
  footer?: (rows: Record<string, unknown>[]) => React.ReactNode;
};

/**
 * Reusable master-detail child table for any parent entity.
 * Extracted from FichaChildTable to work with orcamento_id, pedido_id, op_id etc.
 */
export function ChildTable(props: ChildTableProps) {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});

  const listQuery = useQuery({
    queryKey: [props.table, "by-parent", props.parentField, props.parentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(props.table)
        .select("*")
        .eq(props.parentField, props.parentId)
        .order(props.orderBy ?? "created_at", { ascending: props.ascending ?? true });
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

  const dynamicOptions = useQuery({
    queryKey: [props.table, "opts", props.tenantId],
    queryFn: async () => {
      const result: Record<string, FieldOption[]> = {};
      for (const f of props.fields) {
        if (f.loadOptions) result[f.name] = await f.loadOptions(props.tenantId);
      }
      return result;
    },
  });

  const rows = listQuery.data ?? [];

  function openCreate() {
    setEditing(null);
    setForm({});
    setDialogOpen(true);
  }
  function openEdit(row: Record<string, unknown>) {
    setEditing(row);
    setForm({ ...row });
    setDialogOpen(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      for (const f of props.fields) {
        if (f.required) {
          const v = form[f.name];
          if (v === undefined || v === null || v === "") {
            throw new Error(`Campo obrigatório: ${f.label}`);
          }
        }
      }

      const payload: Record<string, unknown> = { ...form };
      for (const f of props.fields) {
        if (payload[f.name] === "") payload[f.name] = null;
        if (f.type === "number" && payload[f.name] !== null && payload[f.name] !== undefined) {
          payload[f.name] = Number(payload[f.name]);
        }
      }
      // Remove server-computed columns
      delete payload.total;
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.created_by;
      delete payload.tenant_id;
      delete payload[props.parentField];

      if (editing) {
        const { error } = await supabase
          .from(props.table)
          .update(payload)
          .eq("id", editing.id as string);
        if (error) throw error;
      } else {
        const insertObj: Record<string, unknown> = {
          ...payload,
          tenant_id: props.tenantId,
          created_by: user.id,
        };
        insertObj[props.parentField] = props.parentId;
        const { error } = await supabase.from(props.table).insert(insertObj);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? `${props.singular} atualizado` : `${props.singular} adicionado`);
      setDialogOpen(false);
      qc.invalidateQueries({
        queryKey: [props.table, "by-parent", props.parentField, props.parentId],
      });
      // Also invalidate parent so recalculated totals show
      qc.invalidateQueries();
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(props.table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${props.singular} removido`);
      setDeleteId(null);
      qc.invalidateQueries({
        queryKey: [props.table, "by-parent", props.parentField, props.parentId],
      });
      qc.invalidateQueries();
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  function renderField(f: FieldDef) {
    const value = form[f.name] ?? "";
    const setValue = (v: unknown) => setForm((p) => ({ ...p, [f.name]: v }));
    const span = f.colSpan === 2 ? "sm:col-span-2" : "";

    if (f.type === "textarea") {
      return (
        <div key={f.name} className={`space-y-1.5 ${span}`}>
          <Label htmlFor={f.name}>
            {f.label} {f.required && <span className="text-destructive">*</span>}
          </Label>
          <Textarea
            id={f.name}
            value={String(value ?? "")}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
          />
        </div>
      );
    }
    if (f.type === "select") {
      const opts = f.options ?? dynamicOptions.data?.[f.name] ?? [];
      return (
        <div key={f.name} className={`space-y-1.5 ${span}`}>
          <Label htmlFor={f.name}>
            {f.label} {f.required && <span className="text-destructive">*</span>}
          </Label>
          <Select value={String(value ?? "")} onValueChange={(v) => setValue(v)}>
            <SelectTrigger id={f.name}>
              <SelectValue placeholder={f.placeholder ?? "Selecione..."} />
            </SelectTrigger>
            <SelectContent>
              {opts.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    return (
      <div key={f.name} className={`space-y-1.5 ${span}`}>
        <Label htmlFor={f.name}>
          {f.label} {f.required && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id={f.name}
          type={f.type === "number" ? "number" : "text"}
          step={f.step}
          value={String(value ?? "")}
          onChange={(e) => setValue(e.target.value)}
          placeholder={f.placeholder}
        />
      </div>
    );
  }

  const footerNode = useMemo(() => (props.footer ? props.footer(rows) : null), [rows, props]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">{props.title}</CardTitle>
          {props.description && <CardDescription>{props.description}</CardDescription>}
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Adicionar
        </Button>
      </CardHeader>
      <CardContent>
        {listQuery.isLoading ? (
          <LoadingState variant="list" rows={4} />
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-10 text-center">
            <Inbox className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-2 text-sm">Nenhum item</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {props.columns.map((c) => (
                    <TableHead key={c.key}>{c.label}</TableHead>
                  ))}
                  <TableHead className="w-20 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={String(row.id)}>
                    {props.columns.map((c) => (
                      <TableCell key={c.key}>
                        {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Editar"
                          onClick={() => openEdit(row)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          aria-label="Remover"
                          onClick={() => setDeleteId(String(row.id))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {footerNode}
          </>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar ${props.singular}` : `Adicionar ${props.singular}`}
            </DialogTitle>
            <DialogDescription>Preencha os dados abaixo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">{props.fields.map(renderField)}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover item?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
