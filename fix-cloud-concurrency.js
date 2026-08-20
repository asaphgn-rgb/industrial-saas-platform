import fs from 'fs';

let content = fs.readFileSync('src/lib/cloudSync.ts', 'utf8');

const newPush = `  async pushState(messages: any[]) {
    try {
      // 1. Pega estado do servidor antes de sobrescrever para evitar apagar a mensagem do outro no celular
      const res = await fetch(this.url + '?t=' + Date.now());
      let serverData = [];
      if (res.ok) {
         try { serverData = await res.json(); } catch(e){}
      }
      
      // 2. Faz o Merge (sem duplicar IDs)
      const allMsgs = [...(Array.isArray(serverData) ? serverData : []), ...messages];
      
      // 3. Remove duplicados pelo ID (para garantir que só existe um)
      const unique = Array.from(new Map(allMsgs.map(m => [m.id, m])).values());
      
      // Ordena por data
      unique.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      this.lastCount = unique.length;
      
      // 4. Salva o merge no servidor
      await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unique)
      });
      
      // Dispara para mim mesmo a versão final
      this.onMessage(unique);
      
    } catch(e) {}
  }`;

content = content.replace(/  async pushState\([\s\S]*?  \}/g, newPush);
fs.writeFileSync('src/lib/cloudSync.ts', content);

