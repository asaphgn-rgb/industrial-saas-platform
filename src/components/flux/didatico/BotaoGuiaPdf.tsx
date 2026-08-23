import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ProcessoDidatico } from "@/lib/didatico/tipos";

/** Exporta o guia didático completo do processo em PDF A4. */
export function BotaoGuiaPdf({
  processo,
  className,
}: {
  processo: ProcessoDidatico;
  className?: string;
}) {
  const [gerando, setGerando] = useState(false);

  async function exportar() {
    setGerando(true);
    try {
      const { gerarPdfGuiaProcesso } = await import("@/lib/pdf-didatico");
      await gerarPdfGuiaProcesso({
        titulo: processo.material.titulo,
        material: processo.material,
        problemas: processo.problemas,
      });
      toast.success("Guia didático gerado em PDF.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao gerar o PDF.");
    } finally {
      setGerando(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={gerando}
      onClick={exportar}
    >
      {gerando ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <FileDown className="mr-2 h-4 w-4" aria-hidden />
      )}
      Exportar guia em PDF
    </Button>
  );
}
