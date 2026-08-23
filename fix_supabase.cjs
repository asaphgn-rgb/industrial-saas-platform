const fs = require('fs');
let content = fs.readFileSync('src/integrations/supabase/client.ts', 'utf8');

content = content.replace(
  'const SUPABASE_URL = PROD_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;',
  'const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;'
);

content = content.replace(
  'const SUPABASE_PUBLISHABLE_KEY = PROD_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;',
  'const SUPABASE_PUBLISHABLE_KEY =\n    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;'
);

content = content.replace(
  '// ── Production Supabase credentials (hardcoded to prevent stale build cache) ──\nconst PROD_SUPABASE_URL = "https://ujttkjvxxljonqepglae.supabase.co";\nconst PROD_SUPABASE_KEY = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA";\n\n',
  ''
);

fs.writeFileSync('src/integrations/supabase/client.ts', content);
