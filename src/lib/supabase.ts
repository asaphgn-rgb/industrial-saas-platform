import { createClient } from '@supabase/supabase-js';

// By-pass definitivo: usando este arquivo para escapar do autogeneration da Lovable
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
