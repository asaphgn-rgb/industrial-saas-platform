/**
 * Estilos compartilhados dos tooltips do Recharts para casar
 * com a paleta FLUX Premium (Dark Navy + Cyan).
 * Uso: <Tooltip {...tooltipDark} />
 */
export const tooltipDark = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "0.5rem",
    color: "var(--foreground)",
    boxShadow: "0 10px 30px -12px rgba(0,0,0,0.6)",
    fontSize: "0.8125rem",
  } as React.CSSProperties,
  labelStyle: {
    color: "var(--muted-foreground)",
    fontWeight: 500,
    marginBottom: "0.25rem",
  } as React.CSSProperties,
  itemStyle: {
    color: "var(--foreground)",
  } as React.CSSProperties,
  cursor: { fill: "color-mix(in oklab, var(--muted) calc(0.35 * 100%), transparent)" },
};

/** Spread em <XAxis /> e <YAxis /> para casar com o tema escuro. */
export const axisDark = {
  stroke: "var(--muted-foreground)",
  tick: { fill: "var(--muted-foreground)", fontSize: 11 },
  tickLine: { stroke: "var(--border)" },
  axisLine: { stroke: "var(--border)" },
};

/** Spread em <CartesianGrid /> para grid sutil sobre fundo navy. */
export const gridDark = {
  stroke: "var(--border)",
  strokeDasharray: "3 3",
  vertical: false,
};

/** Spread em <Legend /> para tipografia consistente. */
export const legendDark = {
  wrapperStyle: {
    color: "var(--muted-foreground)",
    fontSize: "0.75rem",
  } as React.CSSProperties,
};

