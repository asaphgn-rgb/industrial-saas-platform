const fs = require('fs');
let content = fs.readFileSync('src/integrations/supabase/client.ts', 'utf8');

content = content.replace(
  'const SUPABASE_URL = "https://ujttkjvxxljonqepglae.supabase.co" || import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;',
  'const SUPABASE_URL = "https://ujttkjvxxljonqepglae.supabase.co"; // import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;'
);

content = content.replace(
  'const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA" || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;',
  'const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA"; // import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;'
);

fs.writeFileSync('src/integrations/supabase/client.ts', content);
