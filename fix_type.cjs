const fs = require('fs');
let content = fs.readFileSync('src/services/industrial-mes.service.ts', 'utf8');

content = content.replace(/\(order as never\)\.produced_quantity/g, '((order as unknown) as any).produced_quantity');
content = content.replace(/\(order as never\)\.planned_quantity/g, '((order as unknown) as any).planned_quantity');
content = content.replace(/\(order as never\)\.scrap_quantity/g, '((order as unknown) as any).scrap_quantity');
fs.writeFileSync('src/services/industrial-mes.service.ts', content);
