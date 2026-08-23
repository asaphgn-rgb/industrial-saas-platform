import { ArrowRight, Circle, CircleDot, Diamond, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export type BpmnNode = {
  id: string;
  type: "start" | "task" | "gateway" | "end" | "event";
  label: string;
  lane?: string;
  tone?: "default" | "info" | "warning" | "success" | "destructive";
};

export type BpmnLink = { from: string; to: string; label?: string };

const NODE_STYLE: Record<BpmnNode["type"], string> = {
  start: "border-success/40 bg-success/10 text-success",
  task: "border-border bg-card text-foreground",
  gateway: "border-warning/40 bg-warning/10 text-warning rotate-45",
  end: "border-destructive/40 bg-destructive/10 text-destructive",
  event: "border-info/40 bg-info/10 text-info",
};

const ICONS: Record<BpmnNode["type"], typeof Circle> = {
  start: Circle,
  task: Square,
  gateway: Diamond,
  end: CircleDot,
  event: Circle,
};

export function BpmnFlow({
  nodes,
  links,
  title,
}: {
  nodes: BpmnNode[];
  links?: BpmnLink[];
  title?: string;
}) {
  const lanes = Array.from(new Set(nodes.map((n) => n.lane ?? "Processo")));
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  return (
    <div className="space-y-3">
      {title ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-lg border bg-muted/20 p-4">
        <div className="space-y-4 min-w-[720px]">
          {lanes.map((lane) => {
            const laneNodes = nodes.filter((n) => (n.lane ?? "Processo") === lane);
            return (
              <div key={lane} className="grid grid-cols-[140px_1fr] items-center gap-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {lane}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {laneNodes.map((n, i) => {
                    const Icon = ICONS[n.type];
                    return (
                      <div key={n.id} className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex min-h-[52px] min-w-[120px] max-w-[180px] items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-center text-xs font-medium shadow-sm",
                            NODE_STYLE[n.type],
                            n.type === "gateway" && "min-w-[64px] min-h-[64px] max-w-[64px]",
                          )}
                          title={n.label}
                        >
                          <div className={cn(n.type === "gateway" && "-rotate-45")}>
                            <div className="flex items-center gap-1">
                              <Icon className="h-3 w-3 shrink-0" />
                              <span className="line-clamp-2">{n.label}</span>
                            </div>
                          </div>
                        </div>
                        {i < laneNodes.length - 1 ? (
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {links && links.length > 0 ? (
        <div className="rounded-md border bg-card p-3 text-xs text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">Fluxos condicionais</p>
          <ul className="space-y-0.5">
            {links.map((l, i) => (
              <li key={i}>
                <span className="font-mono">{nodeMap.get(l.from)?.label ?? l.from}</span>
                {" → "}
                <span className="font-mono">{nodeMap.get(l.to)?.label ?? l.to}</span>
                {l.label ? <span className="ml-1 italic">({l.label})</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
