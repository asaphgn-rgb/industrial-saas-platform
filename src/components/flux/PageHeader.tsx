import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ReactNode } from "react";
import { FavoriteButton } from "@/components/flux/Favorites";

export interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  help?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, crumbs = [], help, actions }: PageHeaderProps) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <nav
          className="mb-2 flex items-center gap-x-1 gap-y-0.5 overflow-x-auto whitespace-nowrap text-xs text-muted-foreground scrollbar-thin sm:flex-wrap sm:overflow-visible sm:whitespace-normal"
          aria-label="Trilha de navegação"
        >
          <Link
            to="/central-implantacao"
            className="inline-flex shrink-0 items-center gap-1 hover:text-foreground"
          >
            <Home className="h-3 w-3" /> Início
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="inline-flex shrink-0 items-center gap-1">
              <ChevronRight className="h-3 w-3 shrink-0" />
              {c.to ? (
                <Link to={c.to} className="hover:text-foreground">
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="flex min-w-0 flex-wrap items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              <span className="min-w-0 truncate">{title}</span>
              <FavoriteButton path={pathname} label={title} />
              {help && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Ajuda desta página"
                      className="h-6 w-6 shrink-0"
                    >
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">{help}</TooltipContent>
                </Tooltip>
              )}
            </h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && (
            <div className="col-span-2 flex min-w-0 flex-wrap items-center justify-start gap-2 sm:col-span-1 sm:shrink-0 sm:justify-end">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
