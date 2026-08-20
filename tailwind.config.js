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
            deep: '#03090F', // Ultra dark navy
            main: '#07131D', // Dark navy
          },
          surface: {
            100: '#0D2235', // Cards
            200: '#16344E', // Hover cards
            300: '#1F4A6D', // Active states
          },
          border: {
            DEFAULT: '#1A324A',
            soft: '#0D2235',
          },
          primary: {
            DEFAULT: '#005BB5', // Shield Blue
            light: '#3388FF',
          },
          cyan: '#00D4FF', // Light Cyan from Logo Arrow
          success: '#00E676', // Green for valid
          ai: '#00D4FF',
          warning: '#FFC107',
          danger: '#FF3B30',
          text: {
            primary: '#F0F6FC', // Bright ice white
            secondary: '#8BADC1', // Muted ice blue
            muted: '#4B6982',
          }
        },
        elite: {
          gold: '#00D4FF',
          navy: '#07131D',
          sand: '#8BADC1',
          paper: '#03090F',
          white: '#F0F6FC',
        }
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
        'premium-hover': '0 15px 40px -10px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'inner-gold': 'inset 0 1px 1px rgba(0, 212, 255, 0.15)',
        'glow-blue': '0 0 20px rgba(0, 91, 181, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neumorph': '5px 5px 15px rgba(3,9,15,0.8), -5px -5px 15px rgba(13,34,53,0.5)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(13,34,53,0.8) 0%, rgba(7,19,29,0.95) 100%)',
      }
    },
  },
  plugins: [],
}
