import { useMemo, useState } from "react";
import { Printer, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type KpiDia = { label: string; meta: string; realizado: string; ok: boolean };
type LinhaSetor = {
  setor: string;
  maquina: string;
  operador: string;
  kg: string;
  parada: string;
  desvio: string;
};
type Bloqueio = { lote: string; produto: string; tipo: string; status: string };

const KPIS: KpiDia[] = [
  { label: "Produção Total (kg)", meta: "12.000", realizado: "11.480", ok: false },
  { label: "OEE Geral (%)", meta: "78,0", realizado: "81,4", ok: true },
  { label: "Refugo / Borra (%)", meta: "3,0", realizado: "4,6", ok: false },
  { label: "OPs Entregues no Prazo (%)", meta: "95,0", realizado: "96,2", ok: true },
];

const SETORES: LinhaSetor[] = [
  { setor: "Extrusão", maquina: "EXT-01", operador: "J. Ferreira", kg: "4.120", parada: "Troca de resina", desvio: "±6%" },
  { setor: "Extrusão", maquina: "EXT-02", operador: "M. Souza", kg: "3.050", parada: "Quebra de balão", desvio: "±4%" },
  { setor: "Impressão", maquina: "FLX-06", operador: "R. Lima", kg: "1.940", parada: "Lavagem de anilox", desvio: "±3%" },
  { setor: "Laminação", maquina: "LAM-01", operador: "C. Dias", kg: "1.210", parada: "Aguardando cura", desvio: "±2%" },
  { setor: "Corte/Solda", maquina: "CS-04", operador: "A. Prado", kg: "1.160", parada: "Ajuste de refile", desvio: "±5%" },
];

const BLOQUEIOS: Bloqueio[] = [
  { lote: "LT-24817", produto: "Filme PEBD 60µ", tipo: "Espessura fora de faixa", status: "Quarentena" },
  { lote: "LT-24822", produto: "Sacola Impressa 4 cores", tipo: "Registro de cor", status: "NC aberta" },
];

const TURNOS = ["1º Turno", "2º Turno", "3º Turno"];

export function DailyMeetingReportModal({
  industria = "FLUX FILME INDÚSTRIA DE PLÁSTICOS FLEXÍVEIS",
}: {
  industria?: string;
}) {
  const [open, setOpen] = useState(false);
  const [turno, setTurno] = useState(TURNOS[0]);

  const dataHora = useMemo(
    () =>
      new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [open],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="no-print gap-2">
          <FileText className="h-4 w-4" />
          Pauta da Reunião Diária (A4)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="no-print flex-row items-center justify-between gap-3 border-b px-5 py-3">
          <DialogTitle className="text-base">Reunião Diária de 15 Minutos — Pré-visualização A4</DialogTitle>
          <div className="flex items-center gap-2">
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-2 text-sm"
              aria-label="Turno da reunião"
            >
              {TURNOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <Button size="sm" className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Imprimir / PDF
            </Button>
          </div>
        </DialogHeader>

        {/* Folha A4 */}
        <div className="bg-white px-8 py-6 text-[#0a0a0a] print:px-0 print:py-0">
          {/* Cabeçalho */}
          <div className="print-header">
            <div className="print-header__bar" />
            <div className="flex items-start justify-between gap-8">
              <div>
                <div className="text-lg font-black tracking-tight text-[#042B3D]">FLUX FILME</div>
                <div className="text-sm font-semibold text-[#0a0a0a]">{industria}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-[#3f3f46]">
                  Ata / Pauta da Reunião Diária de Produção — 15 min
                </div>
              </div>
              <div className="text-right text-[11px] leading-relaxed text-[#3f3f46]">
                <div>
                  <strong className="text-[#0a0a0a]">Data/Hora:</strong> {dataHora}
                </div>
                <div>
                  <strong className="text-[#0a0a0a]">Turno:</strong> {turno}
                </div>
                <div>
                  <strong className="text-[#0a0a0a]">Participantes:</strong> Diretoria · PCP · Encarregados
                </div>
              </div>
            </div>
          </div>

          {/* Quadro 1 */}
          <section className="print-block mt-5 rounded-md border border-[#d4d4d8]">
            <h2 className="border-b border-[#d4d4d8] bg-[#f4f4f5] px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-[#042B3D]">
              Quadro 1 — KPIs do Dia (Meta vs Realizado)
            </h2>
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="bg-white text-left">
                  <th className="border-b border-[#e4e4e7] px-3 py-1.5 font-semibold">Indicador</th>
                  <th className="border-b border-[#e4e4e7] px-3 py-1.5 text-right font-semibold">Meta</th>
                  <th className="border-b border-[#e4e4e7] px-3 py-1.5 text-right font-semibold">Realizado</th>
                  <th className="border-b border-[#e4e4e7] px-3 py-1.5 text-center font-semibold">Situação</th>
                </tr>
              </thead>
              <tbody>
                {KPIS.map((k) => (
                  <tr key={k.label}>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5">{k.label}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5 text-right tabular-nums">{k.meta}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5 text-right font-semibold tabular-nums">
                      {k.realizado}
                    </td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5 text-center font-semibold">
                      {k.ok ? "OK" : "Desvio"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Quadro 2 */}
          <section className="print-block mt-4 rounded-md border border-[#d4d4d8]">
            <h2 className="border-b border-[#d4d4d8] bg-[#f4f4f5] px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-[#042B3D]">
              Quadro 2 — Destaques por Setor
            </h2>
            <table className="w-full border-collapse text-[9.5px]">
              <thead>
                <tr className="text-left">
                  {["Setor", "Máquina", "Operador", "Kg Produzidos", "Principal Motivo de Parada", "Desvio de Espessura"].map(
                    (h) => (
                      <th key={h} className="border-b border-[#e4e4e7] px-3 py-1.5 font-semibold">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {SETORES.map((l) => (
                  <tr key={l.maquina}>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5">{l.setor}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5">{l.maquina}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5">{l.operador}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5 text-right tabular-nums">{l.kg}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5">{l.parada}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5 text-center">{l.desvio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Quadro 3 */}
          <section className="print-block mt-4 rounded-md border border-[#d4d4d8]">
            <h2 className="border-b border-[#d4d4d8] bg-[#f4f4f5] px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-[#042B3D]">
              Quadro 3 — Bloqueios de Qualidade (ISO 9001)
            </h2>
            <table className="w-full border-collapse text-[9.5px]">
              <thead>
                <tr className="text-left">
                  {["Lote", "Produto", "Não Conformidade", "Status"].map((h) => (
                    <th key={h} className="border-b border-[#e4e4e7] px-3 py-1.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BLOQUEIOS.map((b) => (
                  <tr key={b.lote}>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5 font-medium">{b.lote}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5">{b.produto}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5">{b.tipo}</td>
                    <td className="border-b border-[#f1f1f4] px-3 py-1.5">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Quadro 4 */}
          <section className="print-block mt-4 rounded-md border border-[#d4d4d8]">
            <h2 className="border-b border-[#d4d4d8] bg-[#f4f4f5] px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-[#042B3D]">
              Quadro 4 — Plano de Ação das Próximas 24 Horas
            </h2>
            <div className="px-3 py-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="mb-4 flex items-end gap-2 text-[10.5px]">
                  <span className="text-[#71717a]">{n}.</span>
                  <span className="flex-1 border-b border-dashed border-[#a1a1aa]">&nbsp;</span>
                  <span className="w-28 border-b border-dashed border-[#a1a1aa] text-center text-[9px] text-[#71717a]">
                    Responsável
                  </span>
                  <span className="w-20 border-b border-dashed border-[#a1a1aa] text-center text-[9px] text-[#71717a]">
                    Prazo
                  </span>
                </div>
              ))}
              <div className="mt-8 grid grid-cols-3 gap-6 text-center text-[9.5px] text-[#3f3f46]">
                {["Visto — Diretoria", "Visto — PCP", "Visto — Encarregado de Fábrica"].map((v) => (
                  <div key={v}>
                    <div className="border-t border-[#0a0a0a] pt-1">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <p className="mt-4 text-[8.5px] text-[#71717a]">
            Documento gerado automaticamente pelo FLUX — Sistema de Gestão Industrial. Registro de reunião diária
            conforme requisito 9.3 (Análise Crítica) da ISO 9001:2015.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DailyMeetingReportModal;
