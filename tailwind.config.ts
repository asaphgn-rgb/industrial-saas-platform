import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        /* DESIGN SYSTEM OFICIAL DYAMOND ECOSSISTEMA */
        dyamond: {
          // Sidebar Navy Profundo
          sidebar: "#06152B",       // Fundo da sidebar navy escuro
          sidebarHover: "#0E223D",  // Hover de itens da sidebar
          sidebarActive: "#0066FF", // Azul royal elétrico para item ativo
          sidebarText: "#8E9CAB",   // Texto inativo da sidebar
          sidebarTextActive: "#FFFFFF",
          sidebarBorder: "#132742",

          // Canvas e Superfícies
          canvas: "#F4F7FC",        // Fundo geral do sistema (cinza azulado clean)
          canvasAlt: "#EEF3F9",
          surface: "#FFFFFF",       // Cards e painéis brancos
          surfaceHover: "#F8FAFD",
          border: "#E2E8F4",        // Bordas sutis dos cards
          borderSubtle: "#EDF2F9",

          // Cores de Ação e Marca
          blue: "#0066FF",          // Azul Dyamond primário (botões e destaques)
          blueHover: "#0052CC",
          blueLight: "#EBF3FF",     // Fundo de badges azuis
          gold: "#D4AF37",          // Dourado institucional do diamante
          goldLight: "#FAF3E0",     // Fundo champagne suave
          goldDark: "#AA8C2C",

          // Status e Indicadores
          green: "#00A854",         // Verde status online e sucesso
          greenLight: "#E6F7ED",    // Badge verde suave
          amber: "#F59E0B",         // Em análise / pendente
          amberLight: "#FEF3C7",
          red: "#EF4444",           // Erro e alertas críticos
          redLight: "#FEE2E2",

          // Tipografia
          textTitle: "#0A192F",     // Títulos de alto contraste
          textBody: "#334155",      // Texto corrido
          textMuted: "#64748B",     // Metadados e labels secundárias
          textSubtle: "#94A3B8",    // Placeholders e rodapés
        },
        /* ALIASES RETROCOMPATÍVEIS */
        diamond: {
          50: '#EBF3FF',
          100: '#D6E6FF',
          200: '#B0CEFF',
          300: '#7AAEFF',
          400: '#4288FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003E99',
          800: '#0A192F',
          900: '#06152B',
          950: '#030B17',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        'dyamond-sm': '0 1px 3px rgba(10, 25, 47, 0.04), 0 1px 2px rgba(10, 25, 47, 0.02)',
        'dyamond': '0 4px 20px -2px rgba(10, 25, 47, 0.05), 0 2px 6px -1px rgba(10, 25, 47, 0.02)',
        'dyamond-card': '0 10px 30px -4px rgba(10, 25, 47, 0.06), 0 4px 10px -2px rgba(10, 25, 47, 0.03)',
        'dyamond-blue': '0 8px 25px -4px rgba(0, 102, 255, 0.35)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
