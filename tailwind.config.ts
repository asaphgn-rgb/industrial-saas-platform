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
        /* PALETA DIAMOND PREMIUM / COINEST FINTECH BENCHMARK */
        forest: {
          50: '#F0F7F4',
          100: '#DCEDE5',
          200: '#BBDACD',
          300: '#8FBFA9',
          400: '#5F9E82',
          500: '#3D8165',
          600: '#2C664F',
          700: '#23513F',
          800: '#1B4032',
          900: '#133E32', // Dark Forest Green (Cards & Brand)
          950: '#0B241D',
        },
        mint: {
          50: '#F2FBF5',
          100: '#E1F7E8',
          200: '#C3EFD1',
          300: '#95E3AF',
          400: '#5FD288',
          500: '#34B765', // Vibrant Mint/Lime
          600: '#25954F',
          700: '#1E7540',
          800: '#1B5D36',
          900: '#174D2E',
        },
        sage: {
          50: '#F6F8F6',
          100: '#EBEEEA',
          200: '#D7DDD6',
          300: '#BAC4B9',
          400: '#97A596',
          500: '#798778',
        },
        diamond: {
          50: '#F4F8F5', // Canvas Mint Claro
          100: '#E4EDE6', // Bordas e divisores suaves
          200: '#C9DCD0',
          300: '#9FBFAC',
          400: '#64748B',
          500: '#22C55E', // Acento Verde/Mint vibrante
          600: '#16A34A',
          700: '#15803D',
          800: '#1B4032',
          900: '#133E32', // Dark Forest Green
          950: '#0F2C24', // Deepest Green Canvas
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
