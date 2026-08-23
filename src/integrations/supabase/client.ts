import { createClient } from '@supabase/supabase-js';

// FORCING HARDCODED KEYS to bypass Lovable Cloud environment variable errors.
// This is necessary because Lovable Cloud UI is blocking the app rendering.
const supabaseUrl = "https://ujttkjvxxljonqepglae.supabase.co";
const supabaseAnonKey = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
