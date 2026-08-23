import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Image as ImageIcon, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FileUploadDropzone } from "@/components/flux/FileUploadDropzone";

/* eslint-disable @typescript-eslint/no-explicit-any */

type EstadoOcr = "ocioso" | "carregando_motor" | "processando" | "indisponivel";

/**
 * Anexo de print com OCR sob demanda.
 *
 * - O motor de OCR é opcional: quando o pacote não estiver disponível na build,
 *   exibimos uma orientação clara em vez de quebrar a rota.
 * - Trava contra execuções concorrentes + barra de progresso real.
 */
export function OcrAnexo({ onTexto }: { onTexto: (texto: string) => void }) {
  const [estado, setEstado] = useState<EstadoOcr>("ocioso");
  const [progresso, setProgresso] = useState(0);
  const [etapa, setEtapa] = useState("");
  const rodandoRef = useRef(false);

  const rodando = estado === "carregando_motor" || estado === "processando";

  async function carregarMotor(): Promise<any | null> {
    // Especificador em variável evita que o bundler tente resolver em build.
    const mod = "tesseract" + ".js";
    try {
      const t: any = await import(/* @vite-ignore */ mod);
      return t?.recognize ? t : (t?.default?.recognize ? t.default : null);
    } catch {
      return null;
    }
  }

  async function processar(file: File) {
    if (rodandoRef.current) {
      toast.info("Já existe um OCR em andamento — aguarde a conclusão.");
      return;
    }
    rodandoRef.current = true;
    setProgresso(0);
    setEtapa("Carregando motor de OCR…");
    setEstado("carregando_motor");

    try {
      const motor = await carregarMotor();
      if (!motor) {
        setEstado("indisponivel");
        return;
      }

      setEstado("processando");
      setEtapa("Reconhecendo texto…");
      const { data } = await motor.recognize(file, "por+eng", {
        logger: (m: { status?: string; progress?: number }) => {
          if (typeof m.progress === "number") setProgresso(Math.round(m.progress * 100));
          if (m.status) setEtapa(m.status);
        },
      });
      const texto = String(data?.text ?? "").trim();
      if (!texto) {
        toast.warning("Nenhum texto reconhecido na imagem.");
      } else {
        onTexto(texto);
        toast.success("Texto extraído do print.");
      }
      setEstado("ocioso");
    } catch (e) {
      setEstado("ocioso");
      toast.error((e as Error)?.message || "Falha ao processar a imagem.");
    } finally {
      rodandoRef.current = false;
      setProgresso(0);
      setEtapa("");
    }
  }

  return (
    <div className="space-y-2">
      <FileUploadDropzone
        onFileSelect={(f) => void processar(f)}
        loading={rodando}
        accept="image/*"
        title={rodando ? "Processando..." : "Anexar print (OCR)"}
        description="Solte o print aqui para extração de texto"
        compact
      />

      {rodando && (
        <div className="space-y-1">
          <Progress value={estado === "carregando_motor" ? 5 : progresso} />
          <p className="text-xs text-muted-foreground">
            {etapa}
            {estado === "processando" ? ` · ${progresso}%` : ""}
          </p>
        </div>
      )}

      {estado === "indisponivel" && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>OCR não disponível nesta instalação</AlertTitle>
          <AlertDescription className="space-y-1 text-sm">
            <p>
              O motor de leitura de imagens (<span className="font-mono">tesseract.js</span>) não
              está incluído nesta build. O diagnóstico continua funcionando normalmente com texto
              colado.
            </p>
            <p className="text-xs text-muted-foreground">
              Para habilitar: adicione o pacote <span className="font-mono">tesseract.js</span> às
              dependências do projeto e publique novamente. Enquanto isso, cole o texto do console
              ou use “Colar da área de transferência”.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
