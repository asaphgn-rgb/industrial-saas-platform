import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BellRing, BellOff } from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/friendly-error";
import { useServerFn } from "@tanstack/react-start";
import {
  getVapidPublicKey,
  salvarPushSubscription,
  removerPushSubscription,
  testarPush,
} from "@/lib/push.functions";
import {
  pushSuportado,
  pegarSubscriptionAtual,
  subscribeParaPush,
  subToJson,
} from "@/lib/push-client";

export function PushToggle() {
  const [ativo, setAtivo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suportado, setSuportado] = useState(true);

  const getKey = useServerFn(getVapidPublicKey);
  const salvar = useServerFn(salvarPushSubscription);
  const remover = useServerFn(removerPushSubscription);
  const testar = useServerFn(testarPush);

  useEffect(() => {
    setSuportado(pushSuportado());
    pegarSubscriptionAtual().then((s) => setAtivo(!!s));
  }, []);

  async function habilitar() {
    setLoading(true);
    try {
      const { publicKey } = await getKey();
      if (!publicKey) throw new Error("Chave VAPID não configurada");
      const sub = await subscribeParaPush(publicKey);
      await salvar({ data: subToJson(sub) });
      setAtivo(true);
      toast.success("Notificações no dispositivo ativadas");
      const { enviados } = await testar({});
      if (enviados > 0) toast.info("Enviamos um push de teste agora");
    } catch (e) {
      toast.error(friendlyError(e, "Falha ao ativar push"));
    } finally {
      setLoading(false);
    }
  }

  async function desabilitar() {
    setLoading(true);
    try {
      const sub = await pegarSubscriptionAtual();
      if (sub) {
        await remover({ data: { endpoint: sub.endpoint } });
        await sub.unsubscribe();
      }
      setAtivo(false);
      toast.success("Notificações no dispositivo desativadas");
    } catch (e) {
      toast.error(friendlyError(e, "Falha ao desativar"));
    } finally {
      setLoading(false);
    }
  }

  if (!suportado) {
    return (
      <div className="text-sm text-muted-foreground">
        Este navegador não suporta push. Abra pelo Chrome/Edge/Firefox ou instale o app no celular.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {ativo ? (
        <Button variant="outline" size="sm" onClick={desabilitar} disabled={loading}>
          <BellOff className="mr-2 h-4 w-4" /> Desligar push neste dispositivo
        </Button>
      ) : (
        <Button size="sm" onClick={habilitar} disabled={loading}>
          <BellRing className="mr-2 h-4 w-4" /> Ativar push neste dispositivo
        </Button>
      )}
    </div>
  );
}
