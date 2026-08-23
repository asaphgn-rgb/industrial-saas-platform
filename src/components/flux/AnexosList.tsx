import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as typedSupabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paperclip, Upload, Download, Trash2, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { LoadingState } from "@/components/flux/LoadingState";
import { EmptyState } from "@/components/flux/EmptyState";
import { FileUploadDropzone } from "@/components/flux/FileUploadDropzone";

import { friendlyError } from "@/lib/friendly-error";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;
const BUCKET = "anexos";
const MAX_MB = 20;

type Anexo = {
  id: string;
  autor_id: string;
  autor_nome: string | null;
  nome_arquivo: string;
  caminho: string;
  tamanho_bytes: number | null;
  mime_type: string | null;
  created_at: string;
};

function humanSize(n: number | null): string {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function AnexosList({
  entidade,
  entidadeId,
  title = "Anexos",
  description = "Contratos, artes, PDFs, planilhas e imagens vinculados a este registro.",
}: {
  entidade: string;
  entidadeId: string;
  title?: string;
  description?: string;
}) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const meQuery = useQuery({
    queryKey: ["me-for-anexos"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase
        .from("profiles")
        .select("tenant_id, nome_completo, email")
        .eq("id", user.id)
        .maybeSingle();
      return {
        userId: user.id as string,
        tenantId: (profile?.tenant_id ?? null) as string | null,
        nome: (profile?.nome_completo ?? user.email ?? "Usuário") as string,
      };
    },
  });

  const listQuery = useQuery({
    queryKey: ["anexos", entidade, entidadeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anexos")
        .select(
          "id, autor_id, autor_nome, nome_arquivo, caminho, tamanho_bytes, mime_type, created_at",
        )
        .eq("entidade", entidade)
        .eq("entidade_id", entidadeId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Anexo[];
    },
    enabled: Boolean(entidadeId),
  });

  async function handleUpload(file: File) {
    const me = meQuery.data;
    if (!me?.tenantId) {
      toast.error("Perfil sem empresa vinculada.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Arquivo excede ${MAX_MB} MB.`);
      return;
    }
    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
    const caminho = `${me.tenantId}/${entidade}/${entidadeId}/${crypto.randomUUID()}-${safeName}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(caminho, file, { contentType: file.type || undefined, upsert: false });
    if (upErr) {
      setUploading(false);
      toast.error("Falha no upload", { description: upErr.message });
      return;
    }
    const { error: insErr } = await supabase.from("anexos").insert({
      tenant_id: me.tenantId,
      entidade,
      entidade_id: entidadeId,
      autor_id: me.userId,
      autor_nome: me.nome,
      nome_arquivo: file.name,
      caminho,
      tamanho_bytes: file.size,
      mime_type: file.type || null,
    });
    setUploading(false);
    if (insErr) {
      await supabase.storage.from(BUCKET).remove([caminho]);
      toast.error("Falha ao registrar anexo", { description: insErr.message });
      return;
    }
    toast.success("Arquivo enviado");
    qc.invalidateQueries({ queryKey: ["anexos", entidade, entidadeId] });
  }

  async function handleDownload(a: Anexo) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(a.caminho, 60);
    if (error || !data?.signedUrl) {
      toast.error("Não foi possível gerar o link", { description: error?.message });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  const deleteMutation = useMutation({
    mutationFn: async (a: Anexo) => {
      const { error: sErr } = await supabase.storage.from(BUCKET).remove([a.caminho]);
      if (sErr) throw sErr;
      const { error } = await supabase.from("anexos").delete().eq("id", a.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Anexo removido");
      qc.invalidateQueries({ queryKey: ["anexos", entidade, entidadeId] });
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const items = listQuery.data ?? [];
  const me = meQuery.data;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Paperclip className="h-4 w-4" /> {title}
            <span className="ml-1 text-xs font-normal text-muted-foreground">({items.length})</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || !me?.tenantId}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Selecionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploadDropzone
          onFileSelect={handleUpload}
          loading={uploading}
          title="Solte arquivos aqui para anexar"
          description={`Máximo ${MAX_MB} MB por arquivo.`}
          compact
          accept="*"
          className="bg-muted/30 border-muted-foreground/10"
        />

        {listQuery.isLoading ? (
          <LoadingState variant="card" rows={3} />
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhum arquivo anexado ainda. Máx. {MAX_MB} MB por arquivo.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((a) => {
              const mine = me?.userId === a.autor_id;
              return (
                <li key={a.id} className="flex items-center gap-3 py-2">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.nome_arquivo}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {humanSize(a.tamanho_bytes)} · {a.autor_nome ?? "—"} ·{" "}
                      {new Date(a.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDownload(a)}
                    title="Baixar"
                    aria-label="Baixar"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  {mine && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate(a)}
                      title="Remover"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
