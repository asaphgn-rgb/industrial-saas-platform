import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Search,
  StickyNote,
  Timer,
  BellRing,
  Clipboard,
  FileText,
  Activity,
  PictureInPicture2,
  Sunset,
  ZoomIn,
  Keyboard,
  Lock,
  Filter,
  Bookmark,
  Tv,
  Focus,
} from "lucide-react";

type Item = {
  label: string;
  keys: string; // "Alt" + letter
  key: string; // the letter for KeyboardEvent
  icon: React.ComponentType<{ className?: string }>;
  section: "produtividade" | "utilidades" | "sistema";
};

const ITEMS: Item[] = [
  { label: "Busca global", keys: "Alt+K", key: "k", icon: Search, section: "produtividade" },
  { label: "Bloco de notas", keys: "Alt+N", key: "n", icon: StickyNote, section: "produtividade" },
  { label: "Lembretes", keys: "Alt+L", key: "l", icon: BellRing, section: "produtividade" },
  { label: "Pomodoro", keys: "Alt+—", key: "", icon: Timer, section: "produtividade" },
  { label: "Marcar página", keys: "Alt+M", key: "m", icon: Bookmark, section: "produtividade" },
  { label: "Modo zen", keys: "Alt+Z", key: "z", icon: Focus, section: "produtividade" },

  {
    label: "Copiar resumo da tela",
    keys: "Alt+T",
    key: "t",
    icon: FileText,
    section: "utilidades",
  },
  {
    label: "Histórico do clipboard",
    keys: "Alt+U",
    key: "u",
    icon: Clipboard,
    section: "utilidades",
  },
  {
    label: "Filtro rápido de tabelas",
    keys: "Alt+/",
    key: "/",
    icon: Filter,
    section: "utilidades",
  },
  {
    label: "Picture-in-Picture",
    keys: "Alt+O",
    key: "o",
    icon: PictureInPicture2,
    section: "utilidades",
  },
  { label: "Modo apresentação", keys: "Alt+P", key: "p", icon: Tv, section: "utilidades" },
  { label: "Passagem de turno", keys: "Alt+E", key: "e", icon: Sunset, section: "utilidades" },

  { label: "Zoom da interface", keys: "Alt+=", key: "=", icon: ZoomIn, section: "sistema" },
  { label: "Diagnóstico do sistema", keys: "Alt+I", key: "i", icon: Activity, section: "sistema" },
  { label: "Atalhos de teclado", keys: "Shift+?", key: "?", icon: Keyboard, section: "sistema" },
  { label: "Bloquear tela", keys: "Alt+X", key: "x", icon: Lock, section: "sistema" },
];

function fire(item: Item) {
  if (!item.key) return;
  const shift = item.key === "?";
  const alt = !shift;
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: item.key,
      altKey: alt,
      shiftKey: shift,
      bubbles: true,
    }),
  );
}

function Section({ title, items }: { title: string; items: Item[] }) {
  return (
    <>
      <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {title}
      </DropdownMenuLabel>
      {items.map((it) => (
        <DropdownMenuItem
          key={it.label}
          onSelect={() => fire(it)}
          disabled={!it.key}
          className="gap-2"
        >
          <it.icon className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1">{it.label}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{it.keys}</span>
        </DropdownMenuItem>
      ))}
    </>
  );
}

export function ToolboxMenu() {
  const prod = ITEMS.filter((i) => i.section === "produtividade");
  const util = ITEMS.filter((i) => i.section === "utilidades");
  const sys = ITEMS.filter((i) => i.section === "sistema");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Ferramentas do FLUX" aria-label="Ferramentas">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <Section title="Produtividade" items={prod} />
        <DropdownMenuSeparator />
        <Section title="Utilidades" items={util} />
        <DropdownMenuSeparator />
        <Section title="Sistema" items={sys} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
