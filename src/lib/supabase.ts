import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ydeoqgmdaoqprualzufc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZW9xZ21kYW9xcHJ1YWx6dWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNzM1MDMsImV4cCI6MjEwMjg0OTUwM30.AlXGwtt03-T4dnA2fjRInDX_-FxOtUGY74LPIVcHAUo';

if (!supabaseUrl) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});
