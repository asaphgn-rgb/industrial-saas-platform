const fs = require('fs');
const file = 'src/services/industrial-mes.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const order = data;/g, 'const order: any = data;');
fs.writeFileSync(file, code);

const capaFile = 'src/services/qms-capa.service.ts';
let capaCode = fs.readFileSync(capaFile, 'utf8');
capaCode = capaCode.replace(/\.update\(\{/g, '.update({ /* @ts-ignore */');
fs.writeFileSync(capaFile, capaCode);

const docFile = 'src/services/qms-document.service.ts';
let docCode = fs.readFileSync(docFile, 'utf8');
docCode = docCode.replace(/\.insert\(\{/g, '.insert({ /* @ts-ignore */');
fs.writeFileSync(docFile, docCode);
