import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Plugin customizado para interceptar o client.ts gerado pela Lovable e forçar o bypass
const lovableBypassPlugin = () => {
  return {
    name: 'lovable-supabase-bypass',
    enforce: 'pre',
    resolveId(source) {
      if (source.includes('integrations/supabase/client') || source.includes('integrations\\supabase\\client')) {
        return '\0lovable-supabase-bypass';
      }
      return null;
    },
    load(id) {
      if (id === '\0lovable-supabase-bypass') {
        return `
          import { createClient } from '@supabase/supabase-js';

          // BYPASS DEFINITIVO: O Vite está injetando isso diretamente na memória
          const supabaseUrl = "https://ujttkjvxxljonqepglae.supabase.co";
          const supabaseAnonKey = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA";

          export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true,
            },
            db: {
              schema: 'public',
            },
          });
        `;
      }
      return null;
    }
  }
}

export default defineConfig({
  plugins: [react(), lovableBypassPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: parseInt(process.env.PORT || '5173'),
    allowedHosts: true,
  },
  esbuild: {
    // Elimina comandos de depuração no bundle final de produção
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
  build: {
    // Supressão total de Source Maps para impedir engenharia reversa do código TypeScript
    sourcemap: false,
    // Minificação agressiva e ofuscação de identificadores
    minify: 'esbuild',
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        // Fragmentação modular para evitar que arquivos únicos contenham a lógica integral
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          icons: ['lucide-react'],
          charts: ['recharts'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
})
