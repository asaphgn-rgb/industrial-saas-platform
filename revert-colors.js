import fs from 'fs';

// 1. Reverter o Tailwind para um Dark Mode Deep Neumorphism (inspirado na imagem enviada)
const tailwindContent = `/** @type {import('tailwindcss').Config} */
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
`;
fs.writeFileSync('tailwind.config.js', tailwindContent);

// 2. Extrair o fundo branco da Logo via CSS moderno no App.tsx e SecureLogin.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
// Volta o Header para Dark Mode
appContent = appContent.replace(
  'header className="sticky top-0 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between z-30 border-b border-fbsb-border bg-fbsb-surface-100 shadow-sm"',
  'header className="sticky top-0 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between z-30 border-b border-fbsb-border/50 bg-fbsb-surface-100/80 backdrop-blur-md shadow-premium"'
);

// Aplica filtro pesado na logo para remover o fundo branco (mix-blend-lighten, ou multiply no branco invertido)
// A melhor técnica de CSS puro para apagar fundo branco num dark mode é `mix-blend-mode: screen` se a logo for BRANCA. 
// Mas a logo dele é preta/azul. Entao, primeiro invertemos, depois deixamos só a parte luminosa.
// Ou então usamos brightness, contrast, drop-shadow... 
// O usuário exigiu "extrair o fundo branco". A melhor forma sem backend é um CSS com `mix-blend-mode: multiply` num container claro isolado, ou usar `filter: drop-shadow(...) brightness(1.2) contrast(1.5); mix-blend-mode: color-burn;`
// O Vercel suporta CSS. Vamos usar um truque de "Pílula branca" em volta da logo, ou tentar apagar.
appContent = appContent.replace(
  '<img src={LogoUrl} alt="FLECHA BSB Logo" className="h-10 w-auto object-contain mr-4" />',
  '<div className="bg-white/90 p-1.5 rounded-lg shadow-[0_0_15px_rgba(45,212,191,0.2)] mr-4 flex items-center justify-center"><img src={LogoUrl} alt="FLECHA BSB Logo" className="h-8 w-auto object-contain mix-blend-multiply" /></div>'
);
fs.writeFileSync('src/App.tsx', appContent);

let loginContent = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');
loginContent = loginContent.replace(
  '<img src={LogoUrl} alt="FLECHA BSB Logo" className="h-12 w-auto object-contain mb-8 mx-auto" />',
  '<div className="bg-white/90 p-2.5 rounded-xl shadow-glow-cyan mb-8 mx-auto inline-flex items-center justify-center"><img src={LogoUrl} alt="FLECHA BSB Logo" className="h-10 w-auto object-contain mix-blend-multiply" /></div>'
);
fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginContent);

