import { useEffect, useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Shortcut = { keys: string[]; label: string };

const SHORTCUTS: { group: string; items: Shortcut[] }[] = [
  {
    group: "Global",
    items: [
      { keys: ["Ctrl", "K"], label: "Abrir busca / paleta de comandos" },
      { keys: ["?"], label: "Mostrar atalhos de teclado" },
      { keys: ["u"], label: "Voltar (histórico)" },
      { keys: ["Esc"], label: "Fechar diálogos" },
    ],
  },
  {
    group: "Ir para (pressione g e depois...)",
    items: [
      { keys: ["g", "h"], label: "Meu Dia" },
      { keys: ["g", "i"], label: "Integrações do Meu Dia" },
      { keys: ["g", "p"], label: "Painel Geral" },
      { keys: ["g", "a"], label: "Central de Alertas" },
      { keys: ["g", "n"], label: "Notificações" },
      { keys: ["g", "t"], label: "Minhas Tarefas" },
      { keys: ["g", "c"], label: "Clientes" },
      { keys: ["g", "o"], label: "Pedidos de Venda" },
      { keys: ["g", "q"], label: "Orçamentos" },
      { keys: ["g", "v"], label: "Contas a Receber" },
      { keys: ["g", "d"], label: "Contas a Pagar" },
      { keys: ["g", "f"], label: "Fluxo de Caixa" },
      { keys: ["g", "e"], label: "Painel de Estoque" },
      { keys: ["g", "r"], label: "Painel de Produção" },
      { keys: ["g", "k"], label: "Kanban de Produção" },
    ],
  },
];

const G_MAP: Record<string, string> = {
  h: "/meu-dia",
  i: "/meu-dia/integracoes",
  p: "/visao-360",
  a: "/central-alertas",
  n: "/notificacoes",
  t: "/tarefas",
  c: "/cadastros/clientes",
  o: "/comercial/pedidos-venda",
  q: "/comercial/orcamentos",
  v: "/financeiro/contas-receber",
  d: "/financeiro/contas-pagar",
  f: "/financeiro/fluxo-caixa",
  e: "/estoque/painel",
  r: "/producao/painel",
  k: "/producao/ordens-producao?view=kanban",
};

function isTyping(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pendingG = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;

      // "?" opens help
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen(true);
        return;
      }

      // "u" volta no histórico
      if (e.key === "u" || e.key === "U") {
        e.preventDefault();
        window.history.back();
        return;
      }

      // "g" then <letter>
      if (pendingG.current != null) {
        const to = G_MAP[e.key.toLowerCase()];
        window.clearTimeout(pendingG.current);
        pendingG.current = null;
        if (to) {
          e.preventDefault();
          const [path, qs] = to.split("?");
          const search = qs ? Object.fromEntries(new URLSearchParams(qs).entries()) : undefined;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          navigate({ to: path as any, search: search as any });
        }

        return;
      }
      if (e.key === "g" || e.key === "G") {
        pendingG.current = window.setTimeout(() => {
          pendingG.current = null;
        }, 900);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (pendingG.current != null) window.clearTimeout(pendingG.current);
    };
  }, [navigate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Atalhos de teclado</DialogTitle>
          <DialogDescription>
            Acelere o uso do FLUX com estas combinações. Não funcionam enquanto você digita em um
            campo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {SHORTCUTS.map((g) => (
            <div key={g.group}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {g.group}
              </h4>
              <ul className="space-y-1.5">
                {g.items.map((s) => (
                  <li key={s.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-foreground">{s.label}</span>
                    <span className="flex items-center gap-1">
                      {s.keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="inline-flex min-w-[1.75rem] items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
