// Motor de Sincronização Serverless Multi-Dispositivo (Ntfy via HTTPS/WSS 443)
// Bypass total de firewalls e limites de portas (funciona 100% em 4G corporativo)

export class NtfySync {
  private roomId: string = '';
  private ws: WebSocket | null = null;
  private onMessage: (msg: any) => void = () => {};

  private get topic() {
    return `flechabsb_chat_${this.roomId}`;
  }

  connect(roomId: string, callback: (msg: any) => void) {
    this.roomId = roomId;
    this.onMessage = callback;

    this.connectWs();
  }

  private connectWs() {
    if (this.ws) this.ws.close();

    // Conecta via WebSocket Seguro na porta 443 (Garante passar por qualquer bloqueio)
    this.ws = new WebSocket(`wss://ntfy.sh/${this.topic}/ws`);

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // ntfy.sh manda eventos com o formato { event: 'message', message: 'teu json' }
        if (data.event === 'message' && data.message) {
          const payload = JSON.parse(data.message);
          this.onMessage(payload);
        }
      } catch (e) {}
    };

    this.ws.onclose = () => {
      // Reconexão automática se a internet do celular cair
      setTimeout(() => this.connectWs(), 3000);
    };
  }

  async pushMessage(messageObj: any) {
    try {
      await fetch(`https://ntfy.sh/${this.topic}`, {
        method: 'POST',
        body: JSON.stringify(messageObj),
        headers: {
          'Title': 'B2B Sync',
          'Priority': 'default'
        }
      });
    } catch(e) {}
  }

  disconnect() {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }
}

export const ntfyRelay = new NtfySync();
