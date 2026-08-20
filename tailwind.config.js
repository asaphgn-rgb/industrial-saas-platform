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
            deep: '#000000', // C6 Pure Black
            main: '#0A0A0A', // C6 Dark Background
          },
          surface: {
            100: '#141414', // C6 Card
            200: '#1F1F1F', // C6 Card Hover
            300: '#2D2D2D', // C6 Element
          },
          border: {
            DEFAULT: '#262626',
            soft: '#1A1A1A',
          },
          primary: {
            DEFAULT: '#262626', // Carbon dark
            light: '#404040',
          },
          cyan: '#E8C37D', // Gold/Champagne replacing the neon cyan
          success: '#34D399', 
          ai: '#A78BFA',
          warning: '#FBBF24',
          danger: '#F87171',
          text: {
            primary: '#FFFFFF',
            secondary: '#A3A3A3',
            muted: '#737373',
          }
        },
        elite: {
          gold: '#E8C37D',
          navy: '#0A0A0A',
          sand: '#A3A3A3',
          paper: '#000000',
          white: '#141414',
        }
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
        'premium-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'inner-gold': 'inset 0 1px 1px rgba(232, 195, 125, 0.2)',
        'glow-blue': '0 0 20px rgba(38, 38, 38, 0.5)',
        'glow-cyan': '0 0 15px rgba(232, 195, 125, 0.15)',
        'neumorph': '5px 5px 15px rgba(0,0,0,0.8), -5px -5px 15px rgba(255,255,255,0.01)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.95) 100%)',
      }
    },
  },
  plugins: [],
}
