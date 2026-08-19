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
        elite: {
          gold: '#E1AE47',       /* Dourado para call-to-actions, ícones e destaques sutis */
          navy: '#224366',       /* Azul Marinho Profundo (Brand principal, fundos nobres, textos fortes) */
          sand: '#C6AE96',       /* Areia / Bege Escuro para bordas, badges premium e tipografia secundária */
          paper: '#E5E5E3',      /* Cinza Quente / Fundo off-white para um aspecto de papelaria sofisticada */
          white: '#F9F9F8',      /* Branco levemente aquecido para os modais e painéis */
        }
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(34, 67, 102, 0.08)',
        'premium-hover': '0 20px 40px -10px rgba(34, 67, 102, 0.15)',
        'inner-gold': 'inset 0 0 0 1px rgba(225, 174, 71, 0.3)',
      }
    },
  },
  plugins: [],
}
