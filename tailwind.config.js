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
            deep: '#0F1219', // Fundo extremo
            main: '#131720', // Fundo principal
          },
          surface: {
            100: '#1A1F2C', // Cartões
            200: '#232938', // Hover e modais
            300: '#2E364A', // Elementos destacados
          },
          border: {
            DEFAULT: '#2D3748',
            soft: '#1E293B',
          },
          primary: {
            DEFAULT: '#3B82F6', // Azul neon suave
            light: '#60A5FA',
          },
          cyan: '#2DD4BF', // Cyan neon do print
          success: '#34D399', // Verde luminoso
          ai: '#A78BFA', // Roxo neon
          warning: '#FBBF24',
          danger: '#F87171',
          text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
            muted: '#475569',
          }
        },
        elite: {
          gold: '#2DD4BF',
          navy: '#131720',
          sand: '#94A3B8',
          paper: '#0F1219',
          white: '#1A1F2C',
        }
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
        'premium-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'inner-gold': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.2)',
        'glow-cyan': '0 0 20px rgba(45, 212, 191, 0.2)',
        'neumorph': '5px 5px 15px rgba(0,0,0,0.5), -5px -5px 15px rgba(255,255,255,0.02)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%)',
      }
    },
  },
  plugins: [],
}
