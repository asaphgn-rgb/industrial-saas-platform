import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Target, Users, ListChecks, Gauge, Archive } from "lucide-react";

export type Pop = {
  codigo: string;
  titulo: string;
  versao: string;
  departamento: string;
  objetivo: string;
  escopo: string;
  responsaveis: string[];
  procedimento: string[];
  indicadores: string[];
  registros: string[];
  norma?: string;
};

export function PopCard({ pop }: { pop: Pop }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {pop.codigo} · {pop.titulo}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{pop.departamento}</p>
          </div>
          <div className="flex gap-1.5">
            <Badge variant="outline" className="text-[10px]">
              v{pop.versao}
            </Badge>
            {pop.norma ? (
              <Badge variant="secondary" className="text-[10px]">
                {pop.norma}
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <Section icon={Target} title="Objetivo">
          <p className="text-muted-foreground">{pop.objetivo}</p>
        </Section>
        <Section icon={ListChecks} title="Escopo">
          <p className="text-muted-foreground">{pop.escopo}</p>
        </Section>
        <Section icon={Users} title="Responsáveis">
          <div className="flex flex-wrap gap-1.5">
            {pop.responsaveis.map((r) => (
              <Badge key={r} variant="outline" className="text-[11px]">
                {r}
              </Badge>
            ))}
          </div>
        </Section>
        <Section icon={ListChecks} title="Procedimento">
          <ol className="ml-5 list-decimal space-y-1 text-muted-foreground">
            {pop.procedimento.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </Section>
        <div className="grid gap-4 md:grid-cols-2">
          <Section icon={Gauge} title="Indicadores">
            <ul className="ml-5 list-disc space-y-0.5 text-muted-foreground">
              {pop.indicadores.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </Section>
          <Section icon={Archive} title="Registros">
            <ul className="ml-5 list-disc space-y-0.5 text-muted-foreground">
              {pop.registros.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Section>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
        <Icon className="h-3 w-3" />
        {title}
      </div>
      {children}
    </div>
  );
}
