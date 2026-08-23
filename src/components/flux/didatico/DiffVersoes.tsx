import { useMemo, useState } from "react";
import { GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/flux/EmptyState";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Estado = "igual" | "alterado" | "adicionado" | "removido";

const TOM: Record<Estado, string> = {
  igual: "bg-muted text-muted-foreground",
  alterado: "bg-flux-warning-soft text-warning",
  adicionado: "bg-flux-success-soft text-success",
  removido: "bg-destructive/10 text-destructive",
};

/** Achata o conteúdo em pares caminho → texto, com rótulos legíveis. */
function achatar(valor: any, prefixo = "", saida = new Map<string, string>()) {
  if (valor === null || valor === undefined) return saida;
  if (Array.isArray(valor)) {
    valor.forEach((v, i) => achatar(v, `${prefixo}[${i + 1}]`, saida));
    return saida;
  }
  if (typeof valor === "object") {
    for (const [k, v] of Object.entries(valor)) {
      achatar(v, prefixo ? `${prefixo} › ${k}` : k, saida);
    }
    return saida;
  }
  saida.set(prefixo || "valor", String(valor));
  return saida;
}

export type LinhaDiff = { campo: string; base: string; novo: string; estado: Estado };

export function calcularDiff(base: any, novo: any): LinhaDiff[] {
  const a = achatar(base);
  const b = achatar(novo);
  const campos = [...new Set([...a.keys(), ...b.keys()])];
  return campos.map((campo) => {
    const esq = a.get(campo);
    const dir = b.get(campo);
    const estado: Estado =
      esq === undefined ? "adicionado" : dir === undefined ? "removido" : esq === dir ? "igual" : "alterado";
    return { campo, base: esq ?? "", novo: dir ?? "", estado };
  });
}

/**
 * Comparação lado a lado entre duas versões do guia.
 * Mostra o que mudou por campo — e não um dump JSON — para o especialista
 * decidir a aprovação com clareza.
 */
export function DiffVersoes({
  base,
  novo,
  rotuloBase,
  rotuloNovo,
}: {
  base: any;
  novo: any;
  rotuloBase: string;
  rotuloNovo: string;
}) {
  const [somenteDif, setSomenteDif] = useState(true);
  const linhas = useMemo(() => calcularDiff(base, novo), [base, novo]);
  const mudancas = linhas.filter((l) => l.estado !== "igual");
  const visiveis = somenteDif ? mudancas : linhas;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <GitCompare className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {mudancas.length} campo(s) com diferença de {linhas.length} comparado(s)
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => setSomenteDif((v) => !v)}
        >
          {somenteDif ? "Mostrar todos os campos" : "Mostrar apenas diferenças"}
        </Button>
      </div>

      {visiveis.length === 0 ? (
        <EmptyState title="As duas versões são idênticas." compact />
      ) : (
        <div className="max-h-96 overflow-auto rounded-md border border-border">
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 z-10 bg-muted">
              <tr>
                <th className="w-1/4 px-2 py-1.5 text-left font-semibold">Campo</th>
                <th className="w-[37.5%] px-2 py-1.5 text-left font-semibold">{rotuloBase}</th>
                <th className="w-[37.5%] px-2 py-1.5 text-left font-semibold">{rotuloNovo}</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((l) => (
                <tr key={l.campo} className="border-t border-border align-top">
                  <td className="px-2 py-1 font-medium">
                    <span className="block break-words">{l.campo}</span>
                    {l.estado !== "igual" && (
                      <Badge variant="secondary" className={`mt-1 ${TOM[l.estado]}`}>
                        {l.estado}
                      </Badge>
                    )}
                  </td>
                  <td
                    className={`whitespace-pre-wrap break-words border-l border-border px-2 py-1 ${
                      l.estado === "alterado" || l.estado === "removido" ? "bg-destructive/5" : ""
                    }`}
                  >
                    {l.base || "—"}
                  </td>
                  <td
                    className={`whitespace-pre-wrap break-words border-l border-border px-2 py-1 ${
                      l.estado === "alterado" || l.estado === "adicionado"
                        ? "bg-flux-success-soft/40"
                        : ""
                    }`}
                  >
                    {l.novo || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
