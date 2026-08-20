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
            deep: '#06141B', 
            main: '#11212D', 
          },
          surface: {
            100: '#253745', 
            200: '#4A5C6A', 
            300: '#9BA8AB', 
          },
          border: {
            DEFAULT: '#4A5C6A',
            soft: '#253745',
          },
          primary: {
            DEFAULT: '#9BA8AB', 
            light: '#CCD0CF',
          },
          cyan: '#9BA8AB', 
          success: '#9BA8AB', 
          ai: '#9BA8AB',
          warning: '#4A5C6A',
          danger: '#4A5C6A',
          text: {
            primary: '#CCD0CF',
            secondary: '#9BA8AB',
            muted: '#4A5C6A',
          }
        },
        elite: {
          gold: '#9BA8AB',
          navy: '#11212D',
          sand: '#9BA8AB',
          paper: '#06141B',
          white: '#CCD0CF',
        }
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(6, 20, 27, 0.8), inset 0 1px 1px rgba(204, 208, 207, 0.05)',
        'premium-hover': '0 15px 40px -10px rgba(6, 20, 27, 0.9), inset 0 1px 1px rgba(204, 208, 207, 0.1)',
        'inner-gold': 'inset 0 1px 1px rgba(204, 208, 207, 0.1)',
        'glow-blue': '0 0 20px rgba(155, 168, 171, 0.2)',
        'glow-cyan': '0 0 20px rgba(155, 168, 171, 0.3)',
        'neumorph': '5px 5px 15px rgba(6,20,27,0.8), -5px -5px 15px rgba(37,55,69,0.5)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(37,55,69,0.8) 0%, rgba(17,33,45,0.95) 100%)',
      }
    },
  },
  plugins: [],
}
