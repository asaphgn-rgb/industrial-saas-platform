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
          gold: '#00b0c7',       /* Cyan da Flecha BSB para CTA, Botões e Destaques (Substituiu o Gold) */
          navy: '#041f4a',       /* Azul Marinho Escuro da Fonte BSB */
          sand: '#006eb8',       /* Azul Claro intermediário da flecha */
          paper: '#F0F4F8',      /* Fundo branco-azulado claro */
          white: '#FFFFFF',      /* Branco puro para modais */
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
