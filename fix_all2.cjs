const fs = require('fs');

function fix(file) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Convert 'const order = data' or similar to 'const order = data as any;'
    code = code.replace(/const (\w+) = data;/g, 'const $1 = data as any;');
    
    // Supabase update/insert type casting 
    code = code.replace(/\.update\(\{([\s\S]*?)\}\)/g, '.update({$1} as any)');
    code = code.replace(/\.insert\(\{([\s\S]*?)\}\)/g, '.insert({$1} as any)');
    code = code.replace(/\.insert\(\[\{([\s\S]*?)\}\]\)/g, '.insert([{$1}] as any)');
    
    fs.writeFileSync(file, code);
}

fix('src/services/industrial-mes.service.ts');
fix('src/services/qms-capa.service.ts');
fix('src/services/qms-document.service.ts');
