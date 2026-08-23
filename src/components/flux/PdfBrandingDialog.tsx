import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2, Upload, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  BRANDING_PADRAO,
  arquivoParaDataUrl,
  carregarBranding,
  salvarBranding,
  type PdfBranding,
} from "@/lib/pdf-branding";
import { FileUploadDropzone } from "@/components/flux/FileUploadDropzone";

/**
 * Editor do cabeçalho/rodapé dos PDFs executivos:
 * nome da empresa, logotipo e texto de rodapé (a data é sempre automática).
 */
export function PdfBrandingDialog({
  onChange,
  size = "sm",
}: {
  onChange?: (b: PdfBranding) => void;
  size?: "sm" | "default" | "icon";
}) {
  const [open, setOpen] = useState(false);
  const [b, setB] = useState<PdfBranding>(BRANDING_PADRAO);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setB(carregarBranding());
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size={size === "icon" ? "icon" : size} title="Personalizar PDF">
          <Settings2 className="h-4 w-4" />
          {size !== "icon" && <span className="ml-2 hidden sm:inline">Marca do PDF</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cabeçalho e rodapé do PDF</DialogTitle>
          <DialogDescription>
            Personalize a identificação usada em todos os relatórios exportados. A data de geração e
            a numeração de páginas são automáticas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pdf-empresa">Nome da empresa</Label>
            <Input
              id="pdf-empresa"
              value={b.empresa}
              maxLength={80}
              onChange={(e) => setB({ ...b, empresa: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pdf-rodape">Texto do rodapé</Label>
            <Input
              id="pdf-rodape"
              value={b.rodape}
              maxLength={120}
              placeholder="Documento interno — uso restrito"
              onChange={(e) => setB({ ...b, rodape: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="pdf-logo">Exibir logotipo</Label>
              <p className="text-xs text-muted-foreground">Usa o logotipo FLUX se nenhum for enviado.</p>
            </div>
            <Switch
              id="pdf-logo"
              checked={b.mostrarLogo}
              onCheckedChange={(v) => setB({ ...b, mostrarLogo: v })}
            />
          </div>

          {b.mostrarLogo && (
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-32 items-center justify-center rounded-md border border-border bg-muted/40 p-1">
                {b.logoDataUrl ? (
                  <img src={b.logoDataUrl} alt="Logotipo do relatório" className="max-h-12 max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground">Padrão FLUX</span>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <FileUploadDropzone
                  compact
                  accept="image/png,image/jpeg"
                  title="Trocar logo"
                  description="Solte PNG/JPG até 500KB"
                  onFileSelect={async (f) => {
                    if (f.size > 500_000) {
                      toast.error("Envie uma imagem PNG/JPG de até 500 KB");
                      return;
                    }
                    try {
                      setB({ ...b, logoDataUrl: await arquivoParaDataUrl(f) });
                      toast.success("Imagem carregada");
                    } catch {
                      toast.error("Não foi possível ler a imagem");
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!b.logoDataUrl}
                  onClick={() => setB({ ...b, logoDataUrl: null })}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Usar padrão FLUX
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setB(BRANDING_PADRAO)}>
            Restaurar padrão
          </Button>
          <Button
            onClick={() => {
              const limpo = { ...b, empresa: b.empresa.trim() || BRANDING_PADRAO.empresa };
              salvarBranding(limpo);
              onChange?.(limpo);
              toast.success("Marca do PDF atualizada");
              setOpen(false);
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
