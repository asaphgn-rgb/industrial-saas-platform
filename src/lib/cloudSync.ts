// Motor de Sincronização Cloud Serverless Infalível (KVDB via HTTPS)
// Bypass total de WebSocket (funciona em 4G, firewalls, corporativo)

export class CloudSync {
  private roomId: string = '';
  private lastCount = 0;
  private timer: any = null;
  private onMessage: (msgs: any[]) => void = () => {};

  // Usamos um bucket público para demonstração B2B (totalmente descartável e sem cache agressivo)
  private get url() {
    return `https://kvdb.io/AEyQCvAyYtJo4EW7KwWsWa/room_${this.roomId}`;
  }

  connect(roomId: string, callback: (msgs: any[]) => void) {
    this.roomId = roomId;
    this.onMessage = callback;

    // Polling agressivo a cada 2 segundos
    this.timer = setInterval(async () => {
      try {
        const res = await fetch(this.url + '?timestamp=' + new Date().getTime());
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > this.lastCount) {
            this.lastCount = data.length;
            this.onMessage(data);
          }
        }
      } catch (e) {}
    }, 2000);
  }

  async pushState(messages: any[]) {
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
  }

  disconnect() {
    if (this.timer) clearInterval(this.timer);
  }
}

export const cloudRelay = new CloudSync();