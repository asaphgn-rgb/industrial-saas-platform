import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: parseInt(process.env.PORT || '5173')
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify("https://ujttkjvxxljonqepglae.supabase.co"),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify("sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA"),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify("sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA"),
    'process.env.SUPABASE_URL': JSON.stringify("https://ujttkjvxxljonqepglae.supabase.co"),
    'process.env.SUPABASE_PUBLISHABLE_KEY': JSON.stringify("sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA")
  }
})
