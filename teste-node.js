const os = require('os');

console.log('CLAUDE CODE EXECUTANDO NODE.JS COM SUCESSO');
console.log('Versão do Node.js:', process.version);
console.log('Sistema Operacional:', `${os.type()} (${os.platform()}) ${os.release()}`);
console.log('Arquitetura:', process.arch);
console.log('Diretório Atual:', process.cwd());
