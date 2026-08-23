import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase as typedSupabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

/**
 * Botão que abre um diálogo com assunto/corpo pré-preenchidos e
 * dispara `mailto:` no cliente de e-mail padrão do usuário.
 * Não envia e-mail pelo servidor — usa o cliente de e-mail local.
 */
export function EnviarPorEmailButton({
  destinatarioPadrao,
  assuntoPadrao,
  corpoPadrao,
}: {
  destinatarioPadrao?: string | null;
  assuntoPadrao: string;
  corpoPadrao: string;
}) {
  const [open, setOpen] = useState(false);
  const [para, setPara] = useState(destinatarioPadrao ?? "");
  const [assunto, setAssunto] = useState(assuntoPadrao);
  const [corpo, setCorpo] = useState(corpoPadrao);

  const { data: assinatura } = useQuery({
    queryKey: ["assinatura-email"],
    enabled: open,
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return "";
      const { data: profile } = await supabase
        .from("profiles")
        .select("nome_completo, tenant_id")
        .eq("id", user.user.id)
        .maybeSingle();
      const { data: tenant } = profile?.tenant_id
        ? await supabase
            .from("tenants")
            .select("nome_fantasia, razao_social, telefone, email")
            .eq("id", profile.tenant_id)
            .maybeSingle()
        : { data: null };
      const linhas = [
        "",
        "---",
        profile?.nome_completo ?? user.user.email ?? "",
        tenant?.nome_fantasia || tenant?.razao_social || "",
        tenant?.telefone ?? "",
        tenant?.email ?? "",
      ].filter(Boolean);
      return linhas.join("\n");
    },
  });

  function enviar() {
    const corpoFinal = corpo + (assinatura ? "\n" + assinatura : "");
    const url = `mailto:${encodeURIComponent(para)}?subject=${encodeURIComponent(
      assunto,
    )}&body=${encodeURIComponent(corpoFinal)}`;
    window.location.href = url;
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setPara(destinatarioPadrao ?? "");
          setAssunto(assuntoPadrao);
          setCorpo(corpoPadrao);
          setOpen(true);
        }}
      >
        <Mail className="mr-1 h-4 w-4" />
        Enviar por e-mail
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enviar por e-mail</DialogTitle>
            <DialogDescription>
              Abre o seu cliente de e-mail padrão com o assunto e corpo abaixo pré-preenchidos. Sua
              assinatura da empresa é adicionada automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="email-para">Para</Label>
              <Input
                id="email-para"
                type="email"
                value={para}
                onChange={(e) => setPara(e.target.value)}
                placeholder="cliente@empresa.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email-assunto">Assunto</Label>
              <Input
                id="email-assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email-corpo">Mensagem</Label>
              <Textarea
                id="email-corpo"
                rows={10}
                value={corpo}
                onChange={(e) => setCorpo(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={enviar} disabled={!assunto.trim()}>
              <Send className="mr-1 h-4 w-4" />
              Abrir e-mail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
