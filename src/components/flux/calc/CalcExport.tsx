import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileDown, Info, Table2 } from "lucide-react";
import { toast } from "sonner";
import type { Aviso } from "@/lib/calc-validacao";
import {
  exportarCalculosCsv,
  exportarCalculosPdf,
  type BlocoCalculo,
  type ParPair,
} from "@/lib/export-calculos";

type Registro = BlocoCalculo;

type Ctx = {
  registrar: (id: string, dados: Registro) => void;
  remover: (id: string) => void;
};

const CalcExportCtx = createContext<Ctx | null>(null);

/** Reúne os blocos de cálculo exibidos e habilita exportação PDF/CSV. */
export function CalcExportProvider({
  estacao,
  children,
}: {
  estacao: string;
  children: React.ReactNode;
}) {
  const mapa = useRef(new Map<string, Registro>());
  const [, force] = useState(0);
  const [gerando, setGerando] = useState(false);

  const registrar = useCallback((id: string, dados: Registro) => {
    mapa.current.set(id, dados);
    force((n) => n + 1);
  }, []);
  const remover = useCallback((id: string) => {
    mapa.current.delete(id);
    force((n) => n + 1);
  }, []);

  const ctx = useMemo(() => ({ registrar, remover }), [registrar, remover]);

  const montarInput = () => {
    const blocos = Array.from(mapa.current.values());
    const resumo: ParPair[] = blocos.flatMap((b) =>
      b.resultados.slice(0, 2).map((r) => [`${b.titulo}: ${r[0]}`, r[1]] as ParPair),
    );
    return {
      titulo: "Cálculos técnicos do processo",
      estacao,
      blocos,
      resumo: resumo.slice(0, 6),
    };
  };

  const pdf = async () => {
    setGerando(true);
    try {
      await exportarCalculosPdf(montarInput());
      toast.success("PDF dos cálculos gerado.");
    } catch {
      toast.error("Não foi possível gerar o PDF.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <CalcExportCtx.Provider value={ctx}>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            exportarCalculosCsv(montarInput());
            toast.success("CSV dos cálculos exportado.");
          }}
        >
          <Table2 className="mr-2 h-4 w-4" /> CSV
        </Button>
        <Button variant="outline" size="sm" onClick={pdf} disabled={gerando}>
          <FileDown className="mr-2 h-4 w-4" /> {gerando ? "Gerando…" : "PDF"}
        </Button>
      </div>
      {children}
    </CalcExportCtx.Provider>
  );
}

/** Registra os parâmetros e resultados de um bloco para exportação. */
export function useRegistroCalculo(id: string, dados: Registro) {
  const ctx = useContext(CalcExportCtx);
  const serial = JSON.stringify(dados);
  useEffect(() => {
    if (!ctx) return;
    ctx.registrar(id, JSON.parse(serial) as Registro);
    return () => ctx.remover(id);
  }, [ctx, id, serial]);
}

/** Lista de mensagens de validação (erros e alertas) com recomendação. */
export function AvisosValidacao({ avisos }: { avisos: Aviso[] }) {
  if (!avisos.length) return null;
  return (
    <div className="space-y-1.5">
      {avisos.map((a, i) => (
        <div
          key={`${a.campo}-${i}`}
          className={`flex gap-2 rounded-md border px-3 py-2 text-xs ${
            a.nivel === "erro"
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-warning/40 bg-warning/10 text-warning-foreground"
          }`}
          role={a.nivel === "erro" ? "alert" : "status"}
        >
          {a.nivel === "erro" ? (
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          ) : (
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          )}
          <span>
            <strong className="font-semibold">{a.mensagem}</strong>
            {a.recomendacao ? <span className="block opacity-90">{a.recomendacao}</span> : null}
          </span>
        </div>
      ))}
    </div>
  );
}
