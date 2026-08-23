import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Tema travado em "dark" — a paleta anexa (#001D39 → #BDD8E9) é a identidade
 * visual oficial do FLUX. Mantemos a API antiga (`useTheme`) para não quebrar
 * componentes que já a consomem, porém `setTheme` é um no-op e sempre resolve
 * para "dark".
 */
type Theme = "dark";

type Ctx = {
  theme: Theme;
  resolved: "dark";
  setTheme: (t: Theme) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "flux-theme";

function forceDark() {
  const root = document.documentElement;
  root.classList.add("dark");
  root.classList.remove("light");
  root.style.colorScheme = "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [ctx] = useState<Ctx>(() => ({
    theme: "dark",
    resolved: "dark",
    setTheme: () => {
      /* travado em dark */
    },
  }));

  useEffect(() => {
    // Limpa qualquer preferência antiga salva ("light" | "system") e garante
    // que o storage reflita o tema travado.
    try {
      localStorage.setItem(STORAGE_KEY, "dark");
    } catch {
      /* storage indisponível — ignora */
    }
    forceDark();
  }, []);

  return <ThemeCtx.Provider value={ctx}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme fora do ThemeProvider");
  return ctx;
}

/** Inline script para evitar FOUC — aplica `dark` antes do React montar. */
export const THEME_INIT_SCRIPT = `
(function(){try{
  var r=document.documentElement;
  r.classList.add('dark');
  r.classList.remove('light');
  r.style.colorScheme='dark';
  try{localStorage.setItem('${STORAGE_KEY}','dark');}catch(e){}
}catch(e){}})();
`;
