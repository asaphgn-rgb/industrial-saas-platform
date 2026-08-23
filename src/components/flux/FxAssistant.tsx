import { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRouterState, useNavigate } from "@tanstack/react-router";

import { friendlyError } from "@/lib/friendly-error";
const AssistantMarkdown = lazy(() => import("@/components/flux/AssistantMarkdown"));
import {
  iaConsultiva,
  iaAlertas,
  iaParecerExecutivo,
  iaComparativoMensal,
  iaPrevisaoAtraso,
  iaAlertasContagem,
} from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  User,
  Sparkles,
  X,
  GripVertical,
  Minus,
  Bot,
  Trash2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Clock,
  HelpCircle,
  Copy,
  Check,
  RotateCw,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import fxMascot from "@/assets/fx-mascot.png";

type Turno = { role: "user" | "assistant"; content: string };
type Pos = { x: number; y: number };

const STORAGE_KEY = "fx-assistant-pos-v1";
const HISTORY_KEY = "fx-assistant-history-v1";
const DRAFT_KEY = "fx-assistant-draft-v1";

const ORB_SIZE = 76;
const PANEL_W = 380;
const PANEL_H = 540;

const SUGESTOES_PADRAO = [
  "Resumo executivo de hoje",
  "Onde há risco financeiro?",
  "O que priorizar agora?",
  "Explicar meu OEE atual",
];

const SUGESTOES_POR_ROTA: Array<{
  match: RegExp;
  sugestoes: string[];
  atalhos?: Array<{ label: string; to: string }>;
}> = [
  {
    match: /^\/(dashboard)?$/,
    sugestoes: [
      "Resumo executivo de hoje",
      "Onde há risco financeiro?",
      "O que priorizar agora?",
      "Como estou vs mês passado?",
    ],
  },
  {
    match: /^\/producao|^\/ordens|^\/op/,
    sugestoes: [
      "Quais OPs estão em risco de atraso?",
      "Por que meu OEE caiu?",
      "Como reduzir refugo?",
      "O que priorizar na fábrica hoje?",
    ],
    atalhos: [
      { label: "Ver produção", to: "/producao/painel" },
      { label: "Ordens", to: "/producao/ordens-producao" },
    ],
  },
  {
    match: /^\/pedidos|^\/vendas|^\/comercial/,
    sugestoes: [
      "Como está minha carteira?",
      "Quais clientes atrasaram pagamento?",
      "Comparar vendas com mês passado",
      "Onde perco margem?",
    ],
    atalhos: [
      { label: "Pedidos", to: "/comercial/pedidos-venda" },
      { label: "Financeiro", to: "/financeiro/painel" },
    ],
  },
  {
    match: /^\/financeiro|^\/fluxo|^\/contas/,
    sugestoes: [
      "Como está meu fluxo de caixa?",
      "Quais contas vencem essa semana?",
      "Onde há risco financeiro?",
      "Analisar entradas vs saídas",
    ],
    atalhos: [{ label: "Financeiro", to: "/financeiro/painel" }],
  },
  {
    match: /^\/estoque|^\/materias/,
    sugestoes: [
      "Quais itens estão em ruptura?",
      "O que preciso comprar essa semana?",
      "Onde tenho excesso de estoque?",
      "Giro de estoque atual",
    ],
    atalhos: [{ label: "Estoque", to: "/estoque/painel" }],
  },
  {
    match: /^\/qualidade|^\/nao-conformidade/,
    sugestoes: [
      "Quais NCs estão abertas?",
      "Principais causas de refugo",
      "Como está minha taxa de refugo?",
      "Priorizar tratativas de qualidade",
    ],
    atalhos: [{ label: "Qualidade", to: "/qualidade/painel" }],
  },
  {
    match: /^\/crm|^\/leads/,
    sugestoes: [
      "Como está meu funil?",
      "Quais leads priorizar?",
      "Cotações pendentes há mais tempo",
      "Taxa de conversão atual",
    ],
    atalhos: [{ label: "CRM", to: "/comercial/crm" }],
  },
  {
    match: /^\/manutencao|^\/maquinas/,
    sugestoes: [
      "Quais máquinas têm mais paradas?",
      "OMs pendentes prioritárias",
      "MTBF/MTTR atual",
      "Sugestões preventivas",
    ],
    atalhos: [{ label: "Manutenção", to: "/manutencao/painel" }],
  },
];

function sugestoesPara(rota: string): string[] {
  const hit = SUGESTOES_POR_ROTA.find((r) => r.match.test(rota));
  return hit?.sugestoes ?? SUGESTOES_PADRAO;
}

function atalhosPara(rota: string): Array<{ label: string; to: string }> {
  const hit = SUGESTOES_POR_ROTA.find((r) => r.match.test(rota));
  return hit?.atalhos ?? [];
}

const ROTA_LABELS: Array<{ match: RegExp; label: string }> = [
  { match: /^\/(dashboard)?$/, label: "Dashboard" },
  { match: /^\/producao/, label: "Produção" },
  { match: /^\/ordens|^\/op/, label: "Ordens de Produção" },
  { match: /^\/pedidos/, label: "Pedidos" },
  { match: /^\/vendas|^\/comercial/, label: "Vendas" },
  { match: /^\/financeiro|^\/fluxo|^\/contas/, label: "Financeiro" },
  { match: /^\/estoque|^\/materias/, label: "Estoque" },
  { match: /^\/qualidade|^\/nao-conformidade/, label: "Qualidade" },
  { match: /^\/crm|^\/leads/, label: "CRM" },
  { match: /^\/manutencao|^\/maquinas/, label: "Manutenção" },
];

function nomeDaTela(rota: string): string {
  return ROTA_LABELS.find((r) => r.match.test(rota))?.label ?? `tela ${rota}`;
}

const GREETINGS = [
  "Olá! Sou a FX 👋 sua engenheira virtual do FLUX. Em que posso ajudar?",
  "Oi! Aqui é a FX. Posso analisar sua operação, sugerir ações ou explicar qualquer tela.",
  "Pronto para acelerar. Me pergunte qualquer coisa sobre seu negócio.",
];

function clampPos(p: Pos): Pos {
  if (typeof window === "undefined") return p;
  const maxX = Math.max(8, window.innerWidth - ORB_SIZE - 8);
  const maxY = Math.max(8, window.innerHeight - ORB_SIZE - 8);
  return {
    x: Math.min(Math.max(8, p.x), maxX),
    y: Math.min(Math.max(8, p.y), maxY),
  };
}

function loadPos(): Pos {
  if (typeof window === "undefined") return { x: 24, y: 120 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return clampPos(JSON.parse(raw) as Pos);
  } catch {}
  return clampPos({
    x: window.innerWidth - ORB_SIZE - 24,
    y: window.innerHeight - ORB_SIZE - 168,
  });
}

export function FxAssistant() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: 24, y: 120 });
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [historico, setHistorico] = useState<Turno[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const [dragging, setDragging] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);
  const [hover, setHover] = useState(false);
  const [greeting, setGreeting] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const askFn = useServerFn(iaConsultiva);
  const alertasFn = useServerFn(iaAlertas);
  const parecerFn = useServerFn(iaParecerExecutivo);
  const comparativoFn = useServerFn(iaComparativoMensal);
  const previsaoFn = useServerFn(iaPrevisaoAtraso);
  const contagemFn = useServerFn(iaAlertasContagem);

  const { data: contagem } = useQuery({
    queryKey: ["fx-alertas-contagem"],
    queryFn: () => contagemFn(),
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
    retry: false,
  });
  const badgeTotal = (contagem?.critico ?? 0) + (contagem?.alto ?? 0);
  const badgeTone =
    (contagem?.critico ?? 0) > 0
      ? "bg-destructive"
      : (contagem?.alto ?? 0) > 0
        ? "bg-warning"
        : "bg-primary";

  const rota = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const prevCriticoRef = useRef<number | null>(null);

  // Track critical alert count (toast notification disabled per user request;
  // the AlertsBellTop badge already surfaces this in the topbar).
  useEffect(() => {
    prevCriticoRef.current = contagem?.critico ?? 0;
  }, [contagem?.critico]);

  // Mount + restore position + history + draft
  useEffect(() => {
    setMounted(true);
    setPos(loadPos());
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Turno[];
        if (Array.isArray(parsed)) setHistorico(parsed.slice(-20));
      }
    } catch {}
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) setPergunta(draft);
    } catch {}
  }, []);

  // Keep orb inside viewport on resize/rotate
  useEffect(() => {
    if (!mounted) return;
    const onResize = () => setPos((p) => clampPos(p));
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [mounted]);

  // Persist position
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    } catch {}
  }, [pos, mounted]);

  // Persist history
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historico.slice(-20)));
    } catch {}
  }, [historico, mounted]);

  // Persist draft (debounced via effect)
  useEffect(() => {
    if (!mounted) return;
    try {
      if (pergunta.trim()) localStorage.setItem(DRAFT_KEY, pergunta);
      else localStorage.removeItem(DRAFT_KEY);
    } catch {}
  }, [pergunta, mounted]);

  // Keyboard shortcuts: Ctrl/Cmd+J toggle, Esc close
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setOpen((o) => !o);
        setMinimized(false);
        return;
      }
      if (e.key === "Escape" && open) {
        // don't hijack Esc when user is inside a modal/select on top of us
        const target = e.target as HTMLElement | null;
        if (target?.closest("[role='dialog'],[role='menu'],[data-radix-popper-content-wrapper]"))
          return;
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  // Greeting bubble when idle — desktop-only and at most once per session
  useEffect(() => {
    if (open || historico.length > 0) {
      setGreeting(null);
      return;
    }
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return; // mobile: skip (competes with content)
    try {
      if (window.sessionStorage.getItem("fx-greeted") === "1") return;
    } catch {}
    const t = setTimeout(() => {
      setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
      try {
        window.sessionStorage.setItem("fx-greeted", "1");
      } catch {}
    }, 2500);
    const t2 = setTimeout(() => setGreeting(null), 8000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [open, historico.length, pos.x, pos.y]);

  const mutation = useMutation({
    mutationFn: async (p: string) => askFn({ data: { pergunta: p, historico, rota } }),
    onSuccess: (res, p) => {
      setHistorico((h) => [
        ...h,
        { role: "user", content: p },
        { role: "assistant", content: res.resposta },
      ]);
      setPergunta("");
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  const alertasMut = useMutation({
    mutationFn: async () => alertasFn(),
    onSuccess: (res) => {
      const lista =
        res.alertas.length === 0
          ? "✅ Nenhum alerta ativo no momento."
          : res.alertas
              .map((a) => `- **[${a.severidade.toUpperCase()}]** ${a.titulo} — ${a.detalhe}`)
              .join("\n");
      const conteudo = `## 🚨 Alertas ativos\n\n${lista}${res.narrativa ? `\n\n---\n\n${res.narrativa}` : ""}`;
      setHistorico((h) => [
        ...h,
        { role: "user", content: "Analisar alertas" },
        { role: "assistant", content: conteudo },
      ]);
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  const parecerMut = useMutation({
    mutationFn: async () => parecerFn(),
    onSuccess: (res) => {
      setHistorico((h) => [
        ...h,
        { role: "user", content: "Gerar parecer executivo" },
        { role: "assistant", content: res.parecer },
      ]);
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  const comparativoMut = useMutation({
    mutationFn: async () => comparativoFn(),
    onSuccess: (res) => {
      const conteudo = `## 📊 Comparativo ${res.labelAnt} → ${res.labelAtual}\n\n${res.analise}`;
      setHistorico((h) => [
        ...h,
        { role: "user", content: "Comparar mês atual vs anterior" },
        { role: "assistant", content: conteudo },
      ]);
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  const previsaoMut = useMutation({
    mutationFn: async () => previsaoFn(),
    onSuccess: (res) => {
      const lista =
        res.emRisco.length === 0
          ? ""
          : "\n\n" +
            res.emRisco
              .map(
                (o) =>
                  `- **[${o.risco.toUpperCase()}]** OP ${o.numero}${o.produto ? ` · ${o.produto}` : ""} — ${o.progresso.toFixed(0)}% · ${o.motivos.join("; ")}`,
              )
              .join("\n");
      const conteudo = `## ⏱️ OPs em risco de atraso${lista}\n\n${res.narrativa}`;
      setHistorico((h) => [
        ...h,
        { role: "user", content: "Prever atrasos de OPs" },
        { role: "assistant", content: conteudo },
      ]);
    },
    onError: (err: Error) => toast.error(friendlyError(err)),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [
    historico,
    mutation.isPending,
    alertasMut.isPending,
    parecerMut.isPending,
    comparativoMut.isPending,
    previsaoMut.isPending,
  ]);

  // Autofoco no textarea ao abrir/expandir
  useEffect(() => {
    if (open && !minimized) {
      const t = setTimeout(() => textareaRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open, minimized]);

  const enviar = useCallback(
    (p?: string) => {
      const q = (p ?? pergunta).trim();
      if (!q || mutation.isPending) return;
      mutation.mutate(q);
    },
    [pergunta, mutation],
  );

  // Drag handlers (pointer)
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragOffset.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    startPoint.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    setWasDragged(false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragOffset.current) return;
    const nx = e.clientX - dragOffset.current.dx;
    const ny = e.clientY - dragOffset.current.dy;
    const maxX = window.innerWidth - ORB_SIZE - 8;
    const maxY = window.innerHeight - ORB_SIZE - 8;
    setPos({ x: Math.max(8, Math.min(maxX, nx)), y: Math.max(8, Math.min(maxY, ny)) });
    if (startPoint.current) {
      const dx = e.clientX - startPoint.current.x;
      const dy = e.clientY - startPoint.current.y;
      if (Math.hypot(dx, dy) > 4) setWasDragged(true);
    }
  };
  const onPointerUp = () => {
    dragOffset.current = null;
    startPoint.current = null;
    setDragging(false);
    // Snap to nearest edge
    setPos((p) => {
      const w = window.innerWidth;
      const snapLeft = p.x < w / 2;
      return {
        x: snapLeft ? 16 : w - ORB_SIZE - 16,
        y: Math.max(16, Math.min(window.innerHeight - ORB_SIZE - 16, p.y)),
      };
    });
  };

  // Panel positioning relative to orb, kept on screen
  const panelStyle = useMemo(() => {
    if (typeof window === "undefined") return {};
    const w = window.innerWidth;
    const h = window.innerHeight;
    const openLeft = pos.x + ORB_SIZE / 2 > w / 2;
    const left = openLeft
      ? Math.max(12, pos.x - PANEL_W - 12)
      : Math.min(w - PANEL_W - 12, pos.x + ORB_SIZE + 12);
    const top = Math.max(12, Math.min(h - PANEL_H - 12, pos.y - PANEL_H / 2 + ORB_SIZE / 2));
    return { left, top, width: PANEL_W, height: PANEL_H };
  }, [pos, open]);

  if (!mounted) return null;

  const busy =
    mutation.isPending ||
    alertasMut.isPending ||
    parecerMut.isPending ||
    comparativoMut.isPending ||
    previsaoMut.isPending;

  return (
    <>
      {/* Floating orb */}
      <div
        className={cn(
          "fixed z-50 print:hidden touch-none select-none",
          dragging ? "cursor-grabbing" : "cursor-grab",
          !dragging && "transition-[left,top] duration-300 ease-out",
        )}
        style={{ left: pos.x, top: pos.y, width: ORB_SIZE, height: ORB_SIZE }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          if (wasDragged) return;
          setOpen((o) => !o);
          setMinimized(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
            setMinimized(false);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`FX — Assistente FLUX${badgeTotal > 0 ? ` · ${badgeTotal} alerta(s)` : ""} · Ctrl+J`}
        aria-expanded={open}
        title="FX — Assistente FLUX · Ctrl+J · arraste para reposicionar"
      >
        {/* pulse rings */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full bg-primary/25",
            busy ? "animate-ping" : "animate-[fx-pulse_2.6s_ease-in-out_infinite]",
          )}
        />
        <span className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/40 via-accent/30 to-primary/40 opacity-60 blur-md" />
        {/* mascot body */}
        <div
          className={cn(
            "relative flex h-full w-full items-center justify-center",
            hover && !dragging && "scale-110",
            "transition-transform duration-200 ease-out",
            !busy && "animate-[fx-float_5s_ease-in-out_infinite]",
            busy && "animate-[fx-wobble_0.9s_ease-in-out_infinite]",
          )}
          style={{
            filter:
              "drop-shadow(0 10px 20px color-mix(in oklab, var(--primary) calc(0.35 * 100%), transparent)) drop-shadow(0 4px 8px rgb(0 0 0 / 0.15))",
          }}
        >
          <img
            src={fxMascot}
            alt="FX"
            draggable={false}
            className="h-full w-full object-contain pointer-events-none"
          />
          {/* status dot */}
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-background",
              busy ? "bg-warning animate-pulse" : "bg-success",
            )}
          />
          {/* alert badge — click opens panel + runs analysis */}
          {badgeTotal > 0 && !busy && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
                setMinimized(false);
                if (!alertasMut.isPending) alertasMut.mutate();
              }}
              className={cn(
                "absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full ring-2 ring-background text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-[fx-in_0.3s_ease-out] hover:scale-110 transition-transform cursor-pointer",
                badgeTone,
              )}
              title={`${contagem?.critico ?? 0} crítico(s), ${contagem?.alto ?? 0} alto(s), ${contagem?.medio ?? 0} médio(s) — clique para analisar`}
              aria-label={`Ver ${badgeTotal} alerta(s)`}
            >
              {badgeTotal > 9 ? "9+" : badgeTotal}
            </button>
          )}
        </div>

        {/* Greeting bubble */}
        {greeting && !open && !dragging && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-[260px] rounded-2xl border bg-popover px-3 py-2 text-xs leading-snug text-popover-foreground shadow-lg animate-[fx-in_0.35s_ease-out]",
              pos.x < window.innerWidth / 2 ? "left-[76px]" : "right-[76px]",
            )}
          >
            {greeting}
          </div>
        )}
      </div>

      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            "fixed z-50 print:hidden flex flex-col rounded-2xl border bg-card/95 backdrop-blur-xl shadow-2xl",
            "animate-[fx-in_0.25s_ease-out]",
            minimized && "!h-14 overflow-hidden",
          )}
          style={panelStyle}
        >
          {/* header */}
          <div className="flex items-center gap-2 border-b bg-gradient-to-r from-primary/10 via-accent/5 to-transparent px-3 py-2.5 rounded-t-2xl">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <img
                src={fxMascot}
                alt="FX"
                className="h-full w-full object-contain"
                draggable={false}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
                FX
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  IA
                </span>
              </div>
              <div className="text-[11px] leading-tight text-muted-foreground">
                {busy ? "Pensando…" : "Engenheira virtual FLUX · online"}
              </div>
            </div>
            <GripVertical className="h-4 w-4 text-muted-foreground/40" />
            {historico.length > 0 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => {
                    try {
                      const md =
                        `# Conversa FX — ${new Date().toLocaleString("pt-BR")}\n\n` +
                        historico
                          .map((t) =>
                            t.role === "user"
                              ? `## 👤 Você\n\n${t.content}`
                              : `## 🤖 FX\n\n${t.content}`,
                          )
                          .join("\n\n---\n\n");
                      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `fx-conversa-${new Date().toISOString().slice(0, 10)}.md`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast.success("Conversa exportada");
                    } catch {
                      toast.error("Não foi possível exportar");
                    }
                  }}
                  aria-label="Exportar conversa"
                  title="Exportar conversa (.md)"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setHistorico([])}
                  aria-label="Limpar conversa"
                  title="Limpar conversa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}

            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setMinimized((m) => !m)}
              aria-label="Minimizar"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {!minimized && (
            <>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
                {historico.length === 0 && !busy && (
                  <div className="space-y-3">
                    <div className="rounded-2xl rounded-tl-sm border bg-muted/50 px-3 py-2 text-sm">
                      Sou a <span className="font-semibold text-primary">FX</span>, sua engenheira
                      virtual do FLUX. Analiso seus dados em tempo real e ajudo você a interpretar
                      cada tela. 💡
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Sugestões para esta tela
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sugestoesPara(rota).map((s: string) => (
                        <button
                          key={s}
                          onClick={() => enviar(s)}
                          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-foreground/80 hover:border-primary/40 hover:bg-primary/10 transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {atalhosPara(rota).length > 0 && (
                      <>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground pt-1">
                          Ir para
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {atalhosPara(rota).map((a) => (
                            <button
                              key={a.to}
                              onClick={() => {
                                navigate({ to: a.to });
                                setOpen(false);
                              }}
                              className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-foreground/80 hover:border-accent/50 hover:bg-accent/10 transition"
                            >
                              → {a.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {historico.map((t, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2",
                      t.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {t.role === "assistant" && (
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        <Bot className="h-3 w-3" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "group relative max-w-[82%] rounded-2xl px-3 py-2 text-sm",
                        t.role === "user"
                          ? "whitespace-pre-wrap rounded-tr-sm bg-primary text-primary-foreground"
                          : "rounded-tl-sm border bg-muted/50",
                      )}
                    >
                      {t.role === "assistant" ? (
                        <>
                          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:mt-2 prose-headings:mb-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-strong:text-foreground prose-code:text-primary">
                            <Suspense
                              fallback={
                                <div className="whitespace-pre-wrap text-sm opacity-70">
                                  {t.content}
                                </div>
                              }
                            >
                              <AssistantMarkdown
                                content={t.content}
                                onInternalLink={(href) => {
                                  navigate({ to: href });
                                  setOpen(false);
                                }}
                              />
                            </Suspense>
                          </div>
                          <div className="absolute -top-2 -right-2 flex gap-1 opacity-100 transition focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0">
                            {i === historico.length - 1 &&
                              historico[i - 1]?.role === "user" &&
                              ![
                                "Analisar alertas",
                                "Gerar parecer executivo",
                                "Comparar mês atual vs anterior",
                                "Prever atrasos de OPs",
                              ].includes(historico[i - 1].content) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const prev = historico[i - 1]?.content;
                                    if (!prev || busy) return;
                                    setHistorico((h) => h.slice(0, -2));
                                    mutation.mutate(prev);
                                  }}
                                  className="h-6 w-6 rounded-full border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40 transition flex items-center justify-center shadow-sm"
                                  aria-label="Regenerar resposta"
                                  title="Regenerar resposta"
                                  disabled={busy}
                                >
                                  <RotateCw className="h-3 w-3" />
                                </button>
                              )}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(t.content);
                                  setCopiedIdx(i);
                                  setTimeout(() => setCopiedIdx((c) => (c === i ? null : c)), 1500);
                                } catch {
                                  toast.error("Não foi possível copiar");
                                }
                              }}
                              className="h-6 w-6 rounded-full border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40 transition flex items-center justify-center shadow-sm"
                              aria-label="Copiar resposta"
                              title={copiedIdx === i ? "Copiado!" : "Copiar resposta"}
                            >
                              {copiedIdx === i ? (
                                <Check className="h-3 w-3 text-success" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        t.content
                      )}
                    </div>

                    {t.role === "user" && (
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                        <User className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}

                {busy && (
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border bg-muted/50 px-3 py-2">
                      <span className="h-1.5 w-1.5 animate-[fx-dot_1s_ease-in-out_infinite] rounded-full bg-primary" />
                      <span className="h-1.5 w-1.5 animate-[fx-dot_1s_ease-in-out_infinite_0.15s] rounded-full bg-primary" />
                      <span className="h-1.5 w-1.5 animate-[fx-dot_1s_ease-in-out_infinite_0.3s] rounded-full bg-primary" />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t px-2.5 pt-2 pb-1.5 space-y-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-7 gap-1 text-[11px] font-medium border-primary/30 bg-primary/5 hover:bg-primary/10"
                  onClick={() =>
                    enviar(
                      `Explique o que a tela "${nomeDaTela(rota)}" mostra, quais decisões eu devo tomar aqui e como interpretar os principais indicadores.`,
                    )
                  }
                  disabled={busy}
                  title={`Explicar tela: ${nomeDaTela(rota)}`}
                >
                  <HelpCircle className="h-3 w-3 text-primary" />
                  Explicar esta tela
                </Button>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-[11px] font-medium"
                    onClick={() =>
                      enviar(
                        "Gere um briefing do dia com o resumo executivo, alertas críticos e prioridades operacionais da planta.",
                      )
                    }
                    disabled={busy}
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    Briefing do Dia
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-[11px] font-medium"
                    onClick={() => alertasMut.mutate()}
                    disabled={busy}
                  >
                    <AlertTriangle className="h-3 w-3 text-warning" />
                    Alertas
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-[11px] font-medium"
                    onClick={() => previsaoMut.mutate()}
                    disabled={busy}
                  >
                    <Clock className="h-3 w-3 text-destructive" />
                    Risco de atraso
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-[11px] font-medium"
                    onClick={() => parecerMut.mutate()}
                    disabled={busy}
                  >
                    <FileText className="h-3 w-3 text-primary" />
                    Parecer executivo
                  </Button>
                </div>
              </div>

              <div className="border-t p-2.5">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={pergunta}
                    onChange={(e) => setPergunta(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        enviar();
                      }
                    }}
                    placeholder="Pergunte à FX…"
                    rows={2}
                    className="resize-none text-sm"
                    disabled={busy}
                  />
                  <Button
                    size="icon"
                    aria-label="Enviar"
                    onClick={() => enviar()}
                    disabled={busy || !pergunta.trim()}
                    className="shrink-0 self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Sparkles className="h-2.5 w-2.5" /> Enter envia · Shift+Enter quebra linha ·
                  Ctrl+J alterna
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fx-float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fx-pulse {
          0%,100% { transform: scale(1); opacity: .45; }
          50% { transform: scale(1.15); opacity: .1; }
        }
        @keyframes fx-in {
          from { opacity: 0; transform: translateY(6px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fx-dot {
          0%,100% { transform: translateY(0); opacity: .4; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
        @keyframes fx-blink {
          0%,92%,100% { transform: scaleY(1); }
          95% { transform: scaleY(.1); }
        }
        @keyframes fx-wobble {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(-3deg); }
          75% { transform: translateY(-2px) rotate(3deg); }
        }
      `}</style>
    </>
  );
}
