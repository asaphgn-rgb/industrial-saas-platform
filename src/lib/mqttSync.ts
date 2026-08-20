import mqtt from 'mqtt';

// Usa o broker público de testes do Mosquitto via WebSocket seguro
const BROKER_URL = 'wss://test.mosquitto.org:8081';

class MqttSyncService {
  private client: mqtt.MqttClient | null = null;
  private room: string = '';
  private onMessageCallback: ((msg: any) => void) | null = null;

  connect(roomId: string, onMessage: (msg: any) => void) {
    this.room = `flechabsb/chat/${roomId}`;
    this.onMessageCallback = onMessage;
    
    // Conecta via WebSocket E tenta manter a conexão viva agressivamente
    this.client = mqtt.connect(BROKER_URL, {
      clientId: 'flecha_' + Math.random().toString(16).substr(2, 8),
      keepalive: 30,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    });

    this.client.on('connect', () => {
      console.log('[MQTT] Conectado ao P2P Relay (Celular/PC)');
      this.client?.subscribe(this.room, { qos: 1 });
    });

    this.client.on('message', (topic, message) => {
      if (topic === this.room && this.onMessageCallback) {
        try {
          const payload = JSON.parse(message.toString());
          this.onMessageCallback(payload);
        } catch (e) {
          console.error('[MQTT] Erro ao dar parse na mensagem', e);
        }
      }
    });

    this.client.on('error', (err) => {
      console.error('[MQTT] Erro de conexão:', err);
    });
  }

  sendMessage(messageObj: any) {
    if (this.client && this.client.connected) {
      this.client.publish(this.room, JSON.stringify(messageObj), { qos: 1, retain: true });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }
}

export const mqttRelay = new MqttSyncService();
