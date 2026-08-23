const fs = require('fs');
let content = fs.readFileSync('src/integrations/supabase/client.ts', 'utf8');

content = content.replace(
  'const SUPABASE_PUBLISHABLE_KEY =\n    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;',
  'const SUPABASE_PUBLISHABLE_KEY = PROD_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;'
);

fs.writeFileSync('src/integrations/supabase/client.ts', content);
