import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  LifeBuoy,
  Search,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SeverityBadge, type Severity } from "@/components/flux/SeverityBadge";
import { EmptyState } from "@/components/flux/EmptyState";
import { RegistroTentativa } from "@/components/flux/didatico/RegistroTentativa";
import { cn } from "@/lib/utils";
import {
  criteriosValidacaoDe,
  linkSeguro,
  nivelValidacao,
  NIVEL_VALIDACAO_LABEL,
  SEVERIDADE_LABEL,
  SEVERIDADE_ORDEM,
  textoBusca,
  type ProblemaSolucao,
  type Severidade,
} from "@/lib/didatico/tipos";

const SEV_MAP: Record<Severidade, Severity> = {
  critica: "critico",
  alta: "alto",
  media: "medio",
  baixa: "baixo",
};

const FILTROS: (Severidade | "todas")[] = ["todas", "critica", "alta", "media", "baixa"];

/**
 * Assistente de Problemas & Soluções do chão de fábrica.
 *
 * Padrão mestre-detalhe: o operador seleciona o problema à esquerda e a
 * solução aparece imediatamente ao lado, sem troca de página — em tablet
 * a lista fica acima e o detalhe abaixo, mantendo alvos de toque ≥ 44px.
 */
export function ProblemasSolucoes({
  problemas,
  etapa,
  titulo = "Problemas & Soluções",
  descricao = "Selecione o sintoma observado na máquina — a solução recomendada aparece ao lado.",
  className,
}: {
  problemas: ProblemaSolucao[];
  /** Etapa do processo — habilita registro e histórico de tentativas. */
  etapa?: string;
  titulo?: string;
  descricao?: string;
  className?: string;
}) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Severidade | "todas">("todas");
  const [selecionado, setSelecionado] = useState<string | null>(problemas[0]?.codigo ?? null);

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return problemas
      .filter((p) => (filtro === "todas" ? true : p.severidade === filtro))
      .filter((p) => (q ? textoBusca(p).includes(q) : true))
      .sort(
        (a, b) =>
          SEVERIDADE_ORDEM[a.severidade] - SEVERIDADE_ORDEM[b.severidade] ||
          a.codigo.localeCompare(b.codigo),
      );
  }, [problemas, busca, filtro]);

  const atual = useMemo(
    () => lista.find((p) => p.codigo === selecionado) ?? lista[0] ?? null,
    [lista, selecionado],
  );

  if (problemas.length === 0) {
    return (
      <EmptyState
        title="Sem base de problemas cadastrada para este processo."
        description="A biblioteca técnica ainda não cobre esta etapa."
        compact
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
    <div className="grid gap-4 lg:grid-cols-[minmax(280px,360px)_1fr]">
      {/* ── Lista de problemas ───────────────────────────────── */}
      <Card className="flex min-h-0 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <LifeBuoy className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {titulo}
          </CardTitle>
          <CardDescription>{descricao}</CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar sintoma, defeito ou código"
              className="h-11 pl-9"
              aria-label="Buscar problema"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {FILTROS.map((f) => (
              <Button
                key={f}
                type="button"
                size="sm"
                variant={filtro === f ? "default" : "outline"}
                className="h-8 text-xs"
                onClick={() => setFiltro(f)}
              >
                {f === "todas" ? "Todas" : SEVERIDADE_LABEL[f]}
              </Button>
            ))}
          </div>

          {lista.length === 0 ? (
            <EmptyState title="Nenhum problema encontrado para esta busca." compact />
          ) : (
            <ScrollArea className="max-h-[26rem] pr-2 lg:max-h-[34rem]">
              <ul className="space-y-2">
                {lista.map((p) => {
                  const ativo = atual?.codigo === p.codigo;
                  return (
                    <li key={p.codigo}>
                      <button
                        type="button"
                        onClick={() => setSelecionado(p.codigo)}
                        aria-current={ativo ? "true" : undefined}
                        className={cn(
                          "flex w-full min-h-[44px] flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                          ativo
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-muted/50",
                        )}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {p.codigo}
                          </span>
                          <SeverityBadge severity={SEV_MAP[p.severidade]} />
                        </span>
                        <span className="text-sm font-semibold leading-snug">{p.titulo}</span>
                        {p.termoEn && (
                          <span className="text-[11px] italic text-muted-foreground">
                            {p.termoEn}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* ── Solução ──────────────────────────────────────────── */}
      {atual && <PainelSolucao problema={atual} />}
    </div>

    {/* ── Registro e histórico de tentativas ─────────────────── */}
    {etapa && atual && <RegistroTentativa etapa={etapa} problema={atual} />}
    </div>
  );
}

function PainelSolucao({ problema: p }: { problema: ProblemaSolucao }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base leading-snug">
              <span className="font-mono text-xs text-muted-foreground">{p.codigo}</span>{" "}
              {p.titulo}
            </CardTitle>
            {p.termoEn && <CardDescription className="italic">{p.termoEn}</CardDescription>}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-1">
            <Badge variant="outline" className="text-[10px]">
              {NIVEL_VALIDACAO_LABEL[nivelValidacao(p.fontes, p.naoConfirmado)]}
            </Badge>
            <SeverityBadge severity={SEV_MAP[p.severidade]} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {p.naoConfirmado && (
          <p className="rounded-lg border border-warning/40 bg-flux-warning-soft p-3 text-xs text-warning">
            Conteúdo de referência interna, ainda não confirmado em norma ou publicação técnica.
            Valide com a engenharia antes de padronizar.
          </p>
        )}

        <Bloco icon={AlertTriangle} titulo="Sintomas" tone="warning">
          <ul className="ml-4 list-disc space-y-1 text-sm">
            {p.sintomas.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Bloco>

        <Bloco icon={Search} titulo="Causas prováveis (da mais comum para a menos comum)">
          <ol className="ml-4 list-decimal space-y-1 text-sm">
            {p.causas.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </Bloco>

        <Bloco icon={CheckCircle2} titulo="O que fazer agora" tone="success">
          <ol className="space-y-2">
            {p.acoes.map((a, i) => (
              <li key={a} className="flex gap-3 rounded-lg border border-border p-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="min-w-0">{a}</span>
              </li>
            ))}
          </ol>
        </Bloco>

        {p.parametros && p.parametros.length > 0 && (
          <Bloco icon={Wrench} titulo="Parâmetros de referência">
            <div className="grid gap-2 sm:grid-cols-2">
              {p.parametros.map((par) => (
                <div key={par.nome} className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">{par.nome}</p>
                  <p className="font-mono text-sm font-semibold tabular-nums">
                    {par.faixa}
                    {par.unidade ? ` ${par.unidade}` : ""}
                  </p>
                  {par.observacao && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{par.observacao}</p>
                  )}
                </div>
              ))}
            </div>
          </Bloco>
        )}

        <Bloco icon={ShieldAlert} titulo="Quando escalar" tone="danger">
          <p className="text-sm">{p.escalarQuando}</p>
          {p.escalarPara && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowRight className="h-3 w-3" aria-hidden /> Acionar: {p.escalarPara}
            </p>
          )}
        </Bloco>

        <Bloco icon={BookOpen} titulo="Prevenção">
          <ul className="ml-4 list-disc space-y-1 text-sm">
            {p.prevencao.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Bloco>

        <Bloco icon={ShieldCheck} titulo="Critérios de validação da correção" tone="success">
          <ul className="ml-4 list-disc space-y-1 text-sm">
            {criteriosValidacaoDe(p).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Bloco>

        <Separator />
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Fontes técnicas
          </p>
          <ul className="space-y-1">
            {p.fontes.map((f) => {
              const href = linkSeguro(f.url);
              return (
                <li key={f.titulo} className="text-xs text-muted-foreground">
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
        </div>

      </CardContent>
    </Card>
  );
}

function Bloco({
  icon: Icon,
  titulo,
  tone,
  children,
}: {
  icon: typeof AlertTriangle;
  titulo: string;
  tone?: "warning" | "success" | "danger";
  children: React.ReactNode;
}) {
  const cor =
    tone === "warning"
      ? "text-warning"
      : tone === "success"
        ? "text-success"
        : tone === "danger"
          ? "text-destructive"
          : "text-primary";
  return (
    <section className="space-y-2">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className={cn("h-4 w-4 shrink-0", cor)} aria-hidden />
        {titulo}
      </h4>
      {children}
    </section>
  );
}
