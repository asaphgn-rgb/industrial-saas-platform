import {
  BookOpen,
  ClipboardCheck,
  ExternalLink,
  Gauge,
  HardHat,
  Scale,
  Sliders,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  linkSeguro,
  type Fonte,
  type MaterialDidatico as Material,
} from "@/lib/didatico/tipos";
import { cn } from "@/lib/utils";

const NIVEL_LABEL: Record<Material["nivel"], string> = {
  operacional: "Operacional",
  tatico: "Tático",
  estrategico: "Estratégico",
};

/**
 * Renderiza o material didático validado de um processo ou módulo.
 * Layout de leitura: coluna única com largura de linha controlada — legível
 * em tablet de chão de fábrica e em desktop.
 */
export function MaterialDidatico({
  material: m,
  className,
}: {
  material: Material;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {m.titulo}
              </CardTitle>
              <CardDescription>{m.objetivo}</CardDescription>
            </div>
            <div className="flex shrink-0 gap-1">
              <Badge variant="outline">{NIVEL_LABEL[m.nivel]}</Badge>
              <Badge variant="secondary">{m.duracaoMin} min</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {m.fundamentos.length > 0 && (
        <Secao icon={BookOpen} titulo="Fundamentos">
          <div className="space-y-5">
            {m.fundamentos.map((t) => (
              <article key={t.titulo} className="space-y-2">
                <h4 className="text-sm font-semibold">{t.titulo}</h4>
                {t.conteudo.map((p) => (
                  <p key={p} className="max-w-[75ch] text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
                {t.itens && t.itens.length > 0 && (
                  <ul className="ml-4 list-disc space-y-1 text-sm">
                    {t.itens.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </Secao>
      )}

      {m.variaveisControle && m.variaveisControle.length > 0 && (
        <Secao icon={Sliders} titulo="Variáveis de controle">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {m.variaveisControle.map((v) => (
              <div key={v.nome} className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">{v.nome}</p>
                <p className="font-mono text-sm font-semibold tabular-nums">
                  {v.faixa}
                  {v.unidade ? ` ${v.unidade}` : ""}
                </p>
                {v.observacao && (
                  <p className="mt-1 text-[11px] text-muted-foreground">{v.observacao}</p>
                )}
              </div>
            ))}
          </div>
        </Secao>
      )}

      {m.indicadores && m.indicadores.length > 0 && (
        <Secao icon={Gauge} titulo="Indicadores e fórmulas">
          <div className="grid gap-2 lg:grid-cols-2">
            {m.indicadores.map((i) => (
              <div key={i.nome} className="rounded-lg border border-border p-3">
                <p className="text-sm font-semibold">
                  {i.nome}
                  {i.sigla ? ` (${i.sigla})` : ""}
                </p>
                <p className="mt-1 break-words rounded bg-muted/60 p-2 font-mono text-xs">
                  {i.formula}
                </p>
                {i.meta && (
                  <p className="mt-1 text-xs">
                    <span className="font-semibold">Meta / referência:</span> {i.meta}
                  </p>
                )}
                {i.interpretacao && (
                  <p className="mt-1 text-xs text-muted-foreground">{i.interpretacao}</p>
                )}
                {i.fonte && <ListaFontes fontes={[i.fonte]} className="mt-2" />}
              </div>
            ))}
          </div>
        </Secao>
      )}

      {m.errosComuns && m.errosComuns.length > 0 && (
        <Secao icon={XCircle} titulo="Erros comuns e como evitar">
          <div className="space-y-2">
            {m.errosComuns.map((e) => (
              <div key={e.erro} className="rounded-lg border border-border p-3 text-sm">
                <p className="font-semibold text-destructive">{e.erro}</p>
                <p className="mt-1 text-muted-foreground">→ {e.comoEvitar}</p>
              </div>
            ))}
          </div>
        </Secao>
      )}

      {m.checklist && m.checklist.length > 0 && (
        <Secao icon={ClipboardCheck} titulo="Checklist prático">
          <ul className="space-y-2">
            {m.checklist.map((c, i) => (
              <li key={c} className="flex gap-3 rounded-lg border border-border p-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="min-w-0">{c}</span>
              </li>
            ))}
          </ul>
        </Secao>
      )}

      {m.seguranca && m.seguranca.length > 0 && (
        <Secao icon={HardHat} titulo="Segurança">
          <ul className="ml-4 list-disc space-y-1 text-sm">
            {m.seguranca.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Secao>
      )}

      {m.normas && m.normas.length > 0 && (
        <Secao icon={Scale} titulo="Normas e regulamentos aplicáveis">
          <ListaFontes fontes={m.normas} />
        </Secao>
      )}

      <Card>
        <CardContent className="space-y-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Fontes técnicas do conteúdo
          </p>
          <Separator />
          <ListaFontes fontes={m.fontes} />
        </CardContent>
      </Card>
    </div>
  );
}

function Secao({
  icon: Icon,
  titulo,
  children,
}: {
  icon: typeof BookOpen;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ListaFontes({ fontes, className }: { fontes: Fonte[]; className?: string }) {
  return (
    <ul className={cn("space-y-1", className)}>
      {fontes.map((f) => {
        const href = linkSeguro(f.url);
        return (
          <li key={`${f.origem}-${f.titulo}`} className="text-xs text-muted-foreground">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener nofollow"
                className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground"
              >
                {f.titulo}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            ) : (
              <span>{f.titulo}</span>
            )}
            <Badge variant="outline" className="ml-2 text-[10px]">
              {f.origem}
            </Badge>
            {f.referencia && <span className="ml-1">· {f.referencia}</span>}
          </li>
        );
      })}
    </ul>
  );
}
