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
        /* DESIGN SYSTEM COINEST FINTECH & DIAMOND SUITE */
        coinest: {
          canvas: "#F4F7F5",       // Fundo cinza/verde menta claríssimo e elegante
          canvasAlt: "#EBF2EE",    // Variação de fundo suave
          surface: "#FFFFFF",      // Cards em branco puro
          border: "#E2EBE5",       // Bordas sutis e limpas
          borderLight: "#EDF3EF",  // Bordas ultrafinas de cartões
          forest: "#16382C",       // Verde floresta profundo executivo (cor âncora)
          forestHover: "#112B22",  // Hover escuro do verde floresta
          forestLight: "#1F4E3D",  // Tom intermediário elegante
          mint: "#C8F2D6",         // Verde menta pastel para pílulas ativas do menu
          mintLight: "#E8F8EE",    // Fundo ultra suave de microinterações
          mintBadge: "#D5F5E0",    // Badges de status concluído
          lime: "#A3E635",         // Destaque dinâmico em gráficos e progresso
          emerald: "#10B981",      // Sucesso financeiro
          amber: "#F59E0B",        // Alerta suave
          rose: "#EF4444",         // Inadimplência e badges de notificação
          textPrimary: "#15241E",  // Texto de alto contraste e legibilidade
          textSecondary: "#526E62",// Rótulos, legendas e metadados
          textMuted: "#88A395",    // Placeholders e textos terciários
        },
        /* ALIAS DIAMOND PARA COMPATIBILIDADE DE ROTAS E COMPONENTES */
        diamond: {
          50: '#F4FBF7',
          100: '#E8F8EE',
          200: '#D5F5E0',
          300: '#C8F2D6',
          400: '#6EE7B7',
          500: '#16382C', // Forest Green Oficial Coinest
          600: '#1F4E3D',
          700: '#16382C',
          800: '#112B22',
          900: '#0C1F18',
          950: '#081410',
        },
        santander: {
          DEFAULT: '#16382C',
          red: '#16382C',
          bright: '#1F4E3D',
          dark: '#112B22',
          light: '#E8F8EE',
          subtle: '#D5F5E0',
          grayBg: '#F4F7F5',
          surface: '#FFFFFF',
          darkCard: '#16382C',
          charcoal: '#15241E',
          border: '#E2EBE5',
          green: '#10B981',
          greenLight: '#E8F8EE',
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
        'coinest-sm': '0 1px 3px rgba(22, 56, 44, 0.04), 0 1px 2px rgba(22, 56, 44, 0.02)',
        'coinest': '0 4px 20px -2px rgba(22, 56, 44, 0.05), 0 2px 6px -1px rgba(22, 56, 44, 0.02)',
        'coinest-card': '0 10px 30px -4px rgba(22, 56, 44, 0.06), 0 4px 10px -2px rgba(22, 56, 44, 0.03)',
        'coinest-dark': '0 15px 35px -5px rgba(12, 31, 24, 0.4)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
