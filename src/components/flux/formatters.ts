/**
 * Formatadores oficiais FLUX — item 7 do Prompt Mestre.
 *
 * Toda coluna de `DataTable` que renderiza número, moeda, data ou percentual
 * DEVE usar estes helpers. Isso garante:
 *  - locale pt-BR consistente;
 *  - números tabulares (mesma largura por dígito);
 *  - alinhamento à direita implícito nas colunas numéricas;
 *  - tolerância a null/undefined/NaN.
 */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const int = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

function dec(digits: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

const pct = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type Nullable<T> = T | null | undefined;

function toNum(v: Nullable<number | string>): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function toDate(v: Nullable<Date | string | number>): Date | null {
  if (v == null || v === "") return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Moeda BRL. Retorna "—" quando o valor é nulo/inválido. */
export function fmtBRL(v: Nullable<number | string>, fallback = "—"): string {
  const n = toNum(v);
  return n == null ? fallback : brl.format(n);
}

/** Inteiro pt-BR. */
export function fmtInt(v: Nullable<number | string>, fallback = "—"): string {
  const n = toNum(v);
  return n == null ? fallback : int.format(n);
}

/** Decimal com N casas (default 2). */
export function fmtDec(
  v: Nullable<number | string>,
  digits = 2,
  fallback = "—",
): string {
  const n = toNum(v);
  return n == null ? fallback : dec(digits).format(n);
}

/**
 * Percentual pt-BR. Passe `alreadyPercent=true` quando o número já vier em
 * escala 0-100; caso contrário assume-se escala 0-1.
 */
export function fmtPct(
  v: Nullable<number | string>,
  { alreadyPercent = false, fallback = "—" }: { alreadyPercent?: boolean; fallback?: string } = {},
): string {
  const n = toNum(v);
  if (n == null) return fallback;
  return pct.format(alreadyPercent ? n / 100 : n);
}

/** Data curta dd/mm/aaaa. */
export function fmtDate(v: Nullable<Date | string | number>, fallback = "—"): string {
  const d = toDate(v);
  return d == null ? fallback : dateFmt.format(d);
}

/** Data + hora dd/mm/aaaa hh:mm. */
export function fmtDateTime(v: Nullable<Date | string | number>, fallback = "—"): string {
  const d = toDate(v);
  return d == null ? fallback : dateTimeFmt.format(d);
}

/**
 * Formata códigos internos (SKU, número de doc) preservando caracteres
 * originais e forçando fonte tabular quando renderizado em <span>.
 */
export function fmtCodigo(v: Nullable<string | number>, fallback = "—"): string {
  if (v == null || v === "") return fallback;
  return String(v);
}

/** Classe utilitária para colunas numéricas — números tabulares, à direita. */
export const numCellCls = "text-right font-mono tabular-nums";
/** Classe utilitária para códigos — monoespaçada, à esquerda. */
export const codeCellCls = "text-left font-mono tabular-nums";
