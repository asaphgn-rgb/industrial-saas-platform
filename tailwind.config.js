/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        fbsb: {
          bg: {
            deep: '#060C18',
            main: '#0B1325',
          },
          surface: {
            100: '#101A33',
            200: '#19223E',
            300: '#192D51',
          },
          border: {
            DEFAULT: '#27455D',
            soft: '#305D80',
          },
          primary: {
            DEFAULT: '#5181EA',
            light: '#56AAE7',
          },
          cyan: '#5CD2F1',
          success: '#61D3B2',
          ai: '#B572E6',
          purple: {
            dark: '#543D80',
          },
          warning: '#F2B84B',
          danger: '#EF5C68',
          text: {
            primary: '#F4F7FF',
            secondary: '#BCC2CC',
            muted: '#828995',
          }
        },
        // Mapeamento retro-compatível das cores antigas `elite` para as novas `fbsb`
        // para não quebrar a aplicação onde essas classes já existem, 
        // mas direcionando visualmente para o novo Dark Mode / Neon theme.
        elite: {
          gold: '#5CD2F1',       /* Era Cyan Flecha BSB, agora Cyan Neon */
          navy: '#0B1325',       /* Era Azul Marinho Escuro, agora Background Main */
          sand: '#BCC2CC',       /* Era Azul Claro, agora Texto Secundário (pra não ficar estranho em bg escuro) */
          paper: '#060C18',      /* Era fundo branco, agora Background Deep */
          white: '#101A33',      /* Era Branco puro, agora Surface 100 */
        }
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
        'premium-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
        'inner-gold': 'inset 0 0 0 1px rgba(92, 210, 241, 0.3)', /* Adaptado para cyan */
        'glow-blue': '0 0 20px rgba(81, 129, 234, 0.35)',
        'glow-cyan': '0 0 20px rgba(92, 210, 241, 0.30)',
        'glow-purple': '0 0 20px rgba(181, 114, 230, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(25,34,62,0.8) 0%, rgba(16,26,51,0.9) 100%)',
      }
    },
  },
  plugins: [],
}
