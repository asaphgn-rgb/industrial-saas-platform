import { Fragment } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

function humanize(seg: string): string {
  return decodeURIComponent(seg)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Segments that are UUIDs / numeric IDs — render as raw but short
function isIdLike(seg: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(seg) || /^\d+$/.test(seg);
}

function displaySegment(seg: string): string {
  if (isIdLike(seg)) {
    // Short-hash preview so long UUIDs don't blow up the bar
    return seg.length > 10 ? `${seg.slice(0, 6)}…` : seg;
  }
  return humanize(seg);
}

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const segs = pathname.split("/").filter(Boolean);

  // Hide on the home page, auth, and top-level dashboards (already labeled by their <h1>)
  if (segs.length === 0) return null;

  const crumbs = segs.map((seg, i) => ({
    label: displaySegment(seg),
    to: "/" + segs.slice(0, i + 1).join("/"),
    isLast: i === segs.length - 1,
  }));

  return (
    <nav
      aria-label="Trilha de navegação"
      className="flex items-center gap-1 overflow-x-auto whitespace-nowrap border-b border-border/60 bg-muted/20 px-4 py-1.5 text-xs text-muted-foreground [scrollbar-width:thin]"
    >
      <Link
        to="/"
        aria-label="Ir para a página inicial"
        className="flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 hover:bg-muted hover:text-foreground"
        title="Início"
      >
        <Home className="h-3 w-3" aria-hidden="true" />
      </Link>
      {crumbs.map((c) => (
        <Fragment key={c.to}>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-50" aria-hidden="true" />
          {c.isLast ? (
            <span
              aria-current="page"
              className="max-w-[40ch] shrink-0 truncate rounded px-1.5 py-0.5 font-medium text-foreground"
              title={c.to}
            >
              {c.label}
            </span>
          ) : (
            <Link
              to={c.to as any}
              className="max-w-[24ch] shrink-0 truncate rounded px-1.5 py-0.5 hover:bg-muted hover:text-foreground"
              title={c.to}
            >
              {c.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
