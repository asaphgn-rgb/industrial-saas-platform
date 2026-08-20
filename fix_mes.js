const fs = require('fs');
const file = 'src/services/industrial-mes.service.ts';
let code = fs.readFileSync(file, 'utf8');

// The issue is order.quantity_produced where order is inferred as never.
// Let's typecast the supabase results to any before doing operations.

code = code.replace(/const order = data;/g, 'const order = data as any;');
code = code.replace(/\.update\(\{([\s\S]*?)\}\)/g, '.update({$1} as any)');
fs.writeFileSync(file, code);
