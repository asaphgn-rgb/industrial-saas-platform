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
        /* IDENTIDADE VISUAL OFICIAL DYINVEST — PALETA CORPORATIVA OFICIAL */
        dyinvest: {
          midnight: "#010736",      // Azul Noturno Mais Profundo (Base Primária de Contraste)
          deep: "#0D1C42",          // Azul Escuro Real (Sidebar e Destaques Institucionais)
          royal: "#22396F",         // Azul Royal Corporativo (Elementos de Ação e Bordas de Foco)
          cream: "#FCF1D0",         // Bege / Creme Suave (Superfícies de Destaque e Badges Nobres)
          creamDark: "#E2D4A8",     // Borda e sombra de suporte ao Creme
        },

        /* DESIGN SYSTEM DYAMOND / DY INVEST ATUALIZADO */
        dyamond: {
          // Sidebar em Azul Noturno e Azul Escuro da Marca Dyinvest
          sidebar: "#010736",       // #010736 (Paleta Dyinvest)
          sidebarHover: "#0D1C42",  // #0D1C42 (Paleta Dyinvest)
          sidebarActive: "#22396F", // #22396F (Paleta Dyinvest)
          sidebarText: "#94A3B8",   // Texto inativo da sidebar
          sidebarTextActive: "#FFFFFF",
          sidebarBorder: "#1E293B",

          // Canvas e Superfícies
          canvas: "#F8FAFD",        // Fundo suave de alta ergonomia
          canvasAlt: "#F1F5F9",
          surface: "#FFFFFF",       // Cards e painéis brancos
          surfaceHover: "#F8FAFC",
          border: "#E2E8F0",        // Bordas refinadas dos cards
          borderSubtle: "#CBD5E1",

          // Cores de Ação e Marca Dyinvest
          blue: "#22396F",          // Azul Corporativo Dyinvest
          blueHover: "#0D1C42",
          blueLight: "#EEF2F6",     // Fundo suave para botões e chips
          gold: "#D4AF37",          // Dourado Institucional de Prestígio
          goldLight: "#FCF1D0",     // Bege Nobre Dyinvest
          goldDark: "#AA8C2C",

          // Status e Indicadores
          green: "#047857",         // Verde institucional
          greenLight: "#ECFDF5",    // Badge verde suave
          amber: "#D97706",         // Em análise / pendente
          amberLight: "#FEF3C7",
          red: "#DC2626",           // Erro e alertas
          redLight: "#FEE2E2",

          // Tipografia
          textTitle: "#010736",     // Azul noturno para títulos de alto impacto
          textBody: "#1E293B",      // Texto corrido de alta legibilidade
          textMuted: "#475569",     // Metadados e labels secundárias
          textSubtle: "#64748B",    // Placeholders e rodapés
        },

        /* ALIASES RETROCOMPATÍVEIS */
        diamond: {
          50: '#F8FAFD',
          100: '#EEF2F6',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#22396F',
          600: '#0D1C42',
          700: '#010736',
          800: '#010736',
          900: '#010736',
          950: '#00041C',
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
