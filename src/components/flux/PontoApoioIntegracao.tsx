import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LifeBuoy,
  CheckCircle2,
  Circle,
  FileText,
  BookOpen,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import { MODULOS, type ModuloIntegracao, type ModuloSchema } from "@/lib/integracao-dados.schemas";

const STORAGE_KEY = "flux.integracao.checklist";

function lerChecklist(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, boolean>;
  } catch {
    return {};
  }
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "Minha planilha tem colunas com nomes diferentes. Preciso refazer?",
    a: "Não. Ao enviar, a IA compara seus cabeçalhos com o modelo padrão e renomeia automaticamente as colunas equivalentes (ex.: 'Razão Social' → razao_social, 'UF' → estado). O que não for reconhecido aparece como erro no staging, linha a linha.",
  },
  {
    q: "Posso enviar PDF (relatório do sistema antigo, listagem impressa)?",
    a: "Sim. O texto do PDF é extraído no seu navegador e convertido pela IA para o layout padrão do módulo. O resultado vai para a área de staging e só é gravado após a sua aprovação. Para PDFs escaneados (imagem), gere antes um PDF pesquisável ou use Excel/CSV.",
  },
  {
    q: "Em qual ordem devo importar?",
    a: "Siga a lista 'Ordem recomendada' ao lado: unidades de medida, centros de custo e depósitos primeiro; depois clientes, fornecedores, matérias-primas e produtos; em seguida máquinas, instrumentos, pessoas e, por último, saldos financeiros na data de corte.",
  },
  {
    q: "O que acontece se eu importar o mesmo arquivo duas vezes?",
    a: "Registros com código já existente na empresa são rejeitados pelo banco e aparecem como falha na linha correspondente — os demais são importados normalmente. Nada é sobrescrito silenciosamente.",
  },
  {
    q: "Onde ficam os arquivos enviados?",
    a: "Em um bucket privado isolado por empresa, com criptografia em repouso e políticas de acesso por papel. Servem como trilha de auditoria da implantação.",
  },
  {
    q: "Qual o limite por arquivo?",
    a: "5.000 linhas por importação. Para volumes maiores, divida em lotes (ex.: produtos por família) — o histórico consolida todos os envios.",
  },
];

export function PontoApoioIntegracao({
  onBaixarModelo,
  onBaixarTodos,
}: {
  onBaixarModelo: (m: ModuloIntegracao) => void;
  onBaixarTodos: () => void;
}) {
  const [check, setCheck] = useState<Record<string, boolean>>(() => lerChecklist());

  const ordenados = (Object.values(MODULOS) as ModuloSchema[]).sort((a, b) => a.ordem - b.ordem);
  const feitos = ordenados.filter((m) => check[m.id]).length;
  const pct = Math.round((feitos / ordenados.length) * 100);

  function toggle(id: string) {
    const novo = { ...check, [id]: !check[id] };
    setCheck(novo);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
    } catch {
      /* storage indisponível — checklist apenas em memória */
    }
  }

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <LifeBuoy className="h-4 w-4 text-primary" />
          Ponto de Apoio à Implantação
        </CardTitle>
        <CardDescription>
          Roteiro, checklist e respostas rápidas para você migrar todos os dados da sua indústria em
          tempo recorde.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Ordem recomendada</h4>
            <Badge variant="outline" className="tabular-nums">
              {feitos}/{ordenados.length} · {pct}%
            </Badge>
          </div>
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <ol className="space-y-1">
            {ordenados.map((m) => {
              const ok = !!check[m.id];
              return (
                <li key={m.id} className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-accent/50">
                  <button
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-pressed={ok}
                    aria-label={`Marcar ${m.titulo} como concluído`}
                    className="shrink-0"
                  >
                    {ok ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <span
                    className={`flex-1 truncate text-sm ${ok ? "text-muted-foreground line-through" : ""}`}
                  >
                    <span className="mr-1 text-xs tabular-nums text-muted-foreground">
                      {m.ordem}.
                    </span>
                    {m.titulo}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => onBaixarModelo(m.id)}
                  >
                    modelo
                  </Button>
                </li>
              );
            })}
          </ol>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={onBaixarTodos}>
              <FileText className="mr-1 h-3.5 w-3.5" /> Baixar pacote completo (.xlsx)
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link to="/manuais">
                <BookOpen className="mr-1 h-3.5 w-3.5" /> Manuais
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Perguntas frequentes
          </h4>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-3 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
            Precisa de ajuda com um layout específico? Envie o arquivo mesmo assim: o FLUX registra o
            documento, mostra exatamente quais linhas não foram entendidas e permite reenviar apenas
            a parte corrigida.
          </p>
        </div>
        <div className="lg:col-span-2">
          <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold">
            <ClipboardList className="h-3.5 w-3.5 text-primary" /> O que precisa ser informado em
            cada módulo
          </h4>
          <div className="mb-2 whitespace-pre-line text-xs text-muted-foreground">
            módulo não está liberado integração de dados e ponto de apoio da Integração devem ser separados e liberados para acesso com todas as informações pertinentes a cada um
          </div>
          <Accordion type="single" collapsible className="w-full">
            {ordenados.map((m) => {
              const obrig = m.campos.filter((c) => c.obrigatorio);
              const opc = m.campos.filter((c) => !c.obrigatorio);
              return (
                <AccordionItem key={m.id} value={`mod-${m.id}`}>
                  <AccordionTrigger className="text-left text-sm">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-xs tabular-nums text-muted-foreground">{m.ordem}.</span>
                      {m.titulo}
                      <Badge variant="outline" className="text-[10px]">
                        {m.categoria}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] tabular-nums">
                        {obrig.length} obrigatórios · {m.campos.length} campos
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p className="text-muted-foreground">{m.descricao}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                          Obrigatórios
                        </p>
                        <ul className="space-y-1">
                          {obrig.map((c) => (
                            <li key={c.nome} className="text-sm">
                              <span className="font-medium">{c.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {" "}
                                · {c.tipo}
                                {c.exemplo !== undefined ? ` · ex.: ${c.exemplo}` : ""}
                              </span>
                            </li>
                          ))}
                          {obrig.length === 0 && (
                            <li className="text-xs text-muted-foreground">Nenhum.</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                          Complementares
                        </p>
                        <ul className="space-y-1">
                          {opc.map((c) => (
                            <li key={c.nome} className="text-sm text-muted-foreground">
                              {c.label}
                              <span className="text-xs"> · {c.tipo}</span>
                            </li>
                          ))}
                          {opc.length === 0 && (
                            <li className="text-xs text-muted-foreground">Nenhum.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    {m.dicas && m.dicas.length > 0 && (
                      <ul className="list-disc space-y-1 rounded-md bg-muted/40 p-3 pl-6 text-xs text-muted-foreground">
                        {m.dicas.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => onBaixarModelo(m.id)}
                    >
                      <FileText className="mr-1 h-3.5 w-3.5" /> Baixar modelo de {m.titulo}
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
