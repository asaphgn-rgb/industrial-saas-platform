import fs from 'fs';
let content = fs.readFileSync('src/lib/cloudSync.ts', 'utf8');
content = content.replace(/  \}\);\n    \} catch\(e\) \{\}\n  \}/, '  }');
fs.writeFileSync('src/lib/cloudSync.ts', content);
