import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/flux/EmptyState";
import { Target, CheckCircle2, AlertTriangle, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { listarPlanoAcao, concluirAcaoPlano } from "@/lib/plano-acao.functions";

/**
 * Plano de ação das reuniões (relatórios A4) dentro do "Meu Dia".
 * Mostra o que cada usuário precisa executar hoje, com prazo, responsabilidade
 * e a evolução consolidada — o motor de comprometimento diário da equipe.
 */
export function PlanoAcaoMeuDia() {
  const qc = useQueryClient();
  const listar = useServerFn(listarPlanoAcao);
  const concluir = useServerFn(concluirAcaoPlano);
  const [salvando, setSalvando] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["meu-dia", "plano-acao"],
    queryFn: () => listar(),
    staleTime: 60_000,
  });

  const toggle = (id: string, concluida: boolean) => {
    setSalvando(id);
    concluir({ data: { id, concluir: !concluida } })
      .then(() => {
        qc.invalidateQueries({ queryKey: ["meu-dia", "plano-acao"] });
        toast.success(concluida ? "Ação reaberta." : "Ação concluída. Bom trabalho!");
      })
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setSalvando(null));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <Target className="h-4 w-4 text-primary" />
          Plano de ação das reuniões
          {data && data.total > 0 && (
            <>
              <Badge variant="secondary">{data.concluidas}/{data.total} concluídas</Badge>
              {data.atrasadas > 0 && (
                <Badge variant="destructive">{data.atrasadas} atrasadas</Badge>
              )}
              {data.hoje > 0 && <Badge>{data.hoje} para hoje</Badge>}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : !data || data.total === 0 ? (
          <EmptyState
            icon={Target}
            title="Nenhuma ação atribuída"
            description="As ações dos relatórios de reunião (pontos críticos e oportunidades) aparecem aqui com responsável e prazo."
          />
        ) : (
          <>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Evolução do plano</span>
                <span className="font-semibold text-foreground">{data.progresso}%</span>
              </div>
              <Progress value={data.progresso} className="h-2" />
            </div>
            <ul className="space-y-2">
              {data.itens.slice(0, 12).map((i) => (
                <li
                  key={i.id}
                  className={`rounded-lg border p-3 ${
                    i.concluida
                      ? "border-border bg-muted/40 opacity-70"
                      : i.atrasada
                        ? "border-destructive/40 bg-destructive/5"
                        : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium leading-snug ${i.concluida ? "line-through" : ""}`}
                      >
                        {i.titulo}
                      </p>
                      {i.descricao && (
                        <p className="mt-1 whitespace-pre-line text-xs leading-snug text-muted-foreground">
                          {i.descricao}
                        </p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {i.departamento && (
                          <Badge variant="outline" className="capitalize">
                            {i.departamento}
                          </Badge>
                        )}
                        {i.prioridade && (
                          <Badge
                            variant={i.prioridade === "alta" ? "destructive" : "secondary"}
                            className="capitalize"
                          >
                            {i.prioridade}
                          </Badge>
                        )}
                        {i.due_at && (
                          <span className="inline-flex items-center gap-1">
                            {i.atrasada ? (
                              <AlertTriangle className="h-3 w-3 text-destructive" />
                            ) : (
                              <CalendarClock className="h-3 w-3" />
                            )}
                            Prazo {new Date(i.due_at).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={i.concluida ? "outline" : "default"}
                      disabled={salvando === i.id}
                      onClick={() => toggle(i.id, i.concluida)}
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      {i.concluida ? "Reabrir" : "Concluir"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
