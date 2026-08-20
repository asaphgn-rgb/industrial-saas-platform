import fs from 'fs';

let content = fs.readFileSync('src/lib/cloudSync.ts', 'utf8');
content = content.replace(
  "connect(roomId: string, callback: (msgs: any[]) => void) {",
  "connect(roomId: string, callback: (msgs: any[]) => void) {\n    if (this.timer) clearInterval(this.timer);"
);
fs.writeFileSync('src/lib/cloudSync.ts', content);
