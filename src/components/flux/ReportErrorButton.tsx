import { useState } from "react";
import { Bug } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reportError } from "@/lib/report-error";

type Props = {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
  defaultModulo?: string;
  label?: string;
};

export function ReportErrorButton({
  variant = "outline",
  size = "sm",
  className,
  defaultModulo,
  label = "Reportar erro",
}: Props) {
  const [open, setOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [modulo, setModulo] = useState(defaultModulo ?? "");
  const [sending, setSending] = useState(false);

  async function submit() {
    if (descricao.trim().length < 5) {
      toast.error("Descreva o problema com pelo menos 5 caracteres.");
      return;
    }
    setSending(true);
    const res = await reportError({
      descricao: descricao.trim(),
      modulo: modulo.trim() || null,
    });
    setSending(false);
    if (res.ok) {
      toast.success("Relato enviado. Obrigado pelo feedback!");
      setDescricao("");
      setOpen(false);
    } else if (res.error === "unauthorized") {
      toast.error("Sessão expirada. Faça login novamente para reportar.");
    } else if (res.error === "rate_limited") {
      toast.error("Muitos relatos em pouco tempo. Aguarde alguns minutos.");
    } else {
      toast.error("Não foi possível enviar o relato.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Bug className="mr-2 h-4 w-4" /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reportar um problema</DialogTitle>
          <DialogDescription>
            Descreva o que aconteceu. Não inclua senhas, dados de cartão ou informações sensíveis —
            a rota atual e versões do sistema são enviadas automaticamente para diagnóstico.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="report-modulo">Módulo (opcional)</Label>
            <Input
              id="report-modulo"
              placeholder="Ex.: Produção, Financeiro, Cadastros"
              value={modulo}
              onChange={(e) => setModulo(e.target.value)}
              maxLength={80}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="report-descricao">O que aconteceu?</Label>
            <Textarea
              id="report-descricao"
              placeholder="Descreva o passo a passo, o que era esperado e o que aconteceu."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={6}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground">{descricao.length}/2000 caracteres</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={sending}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={sending}>
            {sending ? "Enviando..." : "Enviar relato"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
