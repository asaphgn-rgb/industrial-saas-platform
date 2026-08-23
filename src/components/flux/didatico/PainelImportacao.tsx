import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AlertTriangle, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { importarConteudosDidaticos } from "@/lib/didatico-curadoria.functions";
import { MODELO_CSV, parseImportacao, type ResultadoParse } from "@/lib/didatico/importacao";
import { FileUploadDropzone } from "@/components/flux/FileUploadDropzone";

/** Importação em massa de problemas/soluções via CSV ou JSON. */
export function PainelImportacao() {
  const qc = useQueryClient();
  const importar = useServerFn(importarConteudosDidaticos);
  const [texto, setTexto] = useState("");
  const [preview, setPreview] = useState<ResultadoParse | null>(null);

  const m = useMutation({
    mutationFn: () => importar({ data: { linhas: preview!.validas } }),
    onSuccess: (r) => {
      toast.success(`${r.importados} guia(s) importados para a fila de revisão.`);
      setTexto("");
      setPreview(null);
      qc.invalidateQueries({ queryKey: ["didatico-conteudos"] });
    },
    onError: (e: Error) => toast.error(e.message || "Falha na importação."),
  });

  const baixarModelo = () => {
    const url = URL.createObjectURL(new Blob([MODELO_CSV], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo-material-didatico.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lerArquivo = async (file: File | undefined) => {
    if (!file) return;
    const conteudo = await file.text();
    setTexto(conteudo);
    setPreview(parseImportacao(conteudo));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Upload className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          Importar problemas, soluções e critérios
        </CardTitle>
        <CardDescription>
          Aceita CSV ou JSON. Linhas sem fonte técnica ou com link não-https são recusadas — o acervo
          só recebe conteúdo rastreável.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <FileUploadDropzone
            onFileSelect={(f) => void lerArquivo(f)}
            loading={m.isPending}
            title="Importar CSV/JSON"
            description="Solte o arquivo ou clique para selecionar"
            compact
            accept=".csv,.json,text/csv,application/json"
          />
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" className="flex-1 gap-2" onClick={baixarModelo}>
              <Download className="h-4 w-4" aria-hidden /> Baixar modelo CSV
            </Button>
            <p className="text-[10px] text-muted-foreground px-2 italic">
              * O sistema valida a rastreabilidade técnica automaticamente.
            </p>
          </div>
        </div>

        <Textarea
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setPreview(null);
          }}
          rows={8}
          placeholder="Cole aqui o CSV ou JSON…"
          className="font-mono text-xs"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-11"
            disabled={!texto.trim()}
            onClick={() => setPreview(parseImportacao(texto))}
          >
            Validar
          </Button>
          <Button
            type="button"
            className="h-11"
            disabled={!preview?.validas.length || m.isPending}
            onClick={() => m.mutate()}
          >
            {m.isPending ? "Importando…" : `Importar ${preview?.validas.length ?? 0} guia(s)`}
          </Button>
        </div>

        {preview && (
          <div className="space-y-2 rounded-lg border border-border p-3 text-xs">
            <p>
              <strong>{preview.validas.length}</strong> linha(s) válida(s) ·{" "}
              <strong>{preview.erros.length}</strong> com erro
            </p>
            {preview.erros.length > 0 && (
              <ul className="space-y-1">
                {preview.erros.slice(0, 20).map((e) => (
                  <li key={`${e.linha}-${e.mensagem}`} className="flex items-start gap-2 text-destructive">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>
                      Linha {e.linha}: {e.mensagem}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {preview.validas.length > 0 && (
              <ul className="ml-4 list-disc space-y-0.5 text-muted-foreground">
                {preview.validas.slice(0, 10).map((l) => (
                  <li key={`${l.etapa}-${l.codigo}`}>
                    {l.etapa} · {l.codigo} — {l.titulo}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
