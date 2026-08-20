/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        fbsb: {
          bg: {
            deep: '#F1F5F9', // Slate 100 - Fundo mais profundo (Light)
            main: '#F8FAFC', // Slate 50 - Fundo principal (Light)
          },
          surface: {
            100: '#FFFFFF', // Fundo de cartões (Branco puro)
            200: '#F1F5F9', // Fundo secundário (Slate 100)
            300: '#E2E8F0', // Hover states (Slate 200)
          },
          border: {
            DEFAULT: '#E2E8F0', // Slate 200
            soft: '#F1F5F9',
          },
          primary: {
            DEFAULT: '#1E40AF', // Azul corporativo forte
            light: '#3B82F6',
          },
          cyan: '#0891B2', // Cyan ajustado para modo claro
          success: '#10B981', // Verde esmeralda limpo
          ai: '#8B5CF6', 
          purple: {
            dark: '#4C1D95',
          },
          warning: '#F59E0B',
          danger: '#EF4444',
          text: {
            primary: '#0F172A', // Slate 900 (Quase preto)
            secondary: '#475569', // Slate 600 (Cinza médio)
            muted: '#94A3B8', // Slate 400
          }
        },
        // Retrocompatibilidade
        elite: {
          gold: '#0891B2',
          navy: '#F8FAFC',
          sand: '#475569',
          paper: '#F1F5F9',
          white: '#FFFFFF',
        }
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-gold': 'inset 0 0 0 1px rgba(8, 145, 178, 0.15)',
        'glow-blue': '0 0 15px rgba(30, 64, 175, 0.15)',
        'glow-cyan': '0 0 15px rgba(8, 145, 178, 0.15)',
        'glow-purple': '0 0 15px rgba(139, 92, 246, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.9) 100%)',
      }
    },
  },
  plugins: [],
}
