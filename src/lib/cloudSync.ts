// Motor de Sincronização Cloud Serverless Infalível (KVDB via HTTPS)
// Bypass total de WebSocket (funciona em 4G, firewalls, corporativo)

export class CloudSync {
  private roomId: string = '';
  private lastCount = 0;
  private timer: any = null;
  private onMessage: (msgs: any[]) => void = () => {};

  // Usamos um bucket público para demonstração B2B (totalmente descartável e sem cache agressivo)
  private get url() {
    return `https://kvdb.io/A8GzWzD5hE7k1yG2m12yXn/room_${this.roomId}`;
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
    this.lastCount = messages.length;
    try {
      await fetch(this.url, {
        method: 'POST', // KVDB aceita POST para sobrescrever a key
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages)
      });
    } catch(e) {}
  }

  disconnect() {
    if (this.timer) clearInterval(this.timer);
  }
}

export const cloudRelay = new CloudSync();