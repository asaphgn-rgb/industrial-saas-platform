# Análise: Comunicação Celular x Computador

O Supabase exige uma conta válida e as chaves `.env` configuradas para realizar o roteamento de mensagens via internet (Cloud Broadcast). Como os arquivos de ambiente do seu sistema podem ainda estar usando o "mock key" (chave de testes provisória), as chamadas para `supabase.channel()` são negadas em nuvem pelo próprio Supabase, logo o celular não se conecta ao computador.

Para garantir que a **comunicação multiplataforma (Celular, Computador, Tablet) opere 100% via Nuvem** SEM depender das suas credenciais do Supabase estarem válidas (e mantendo a blindagem Zero-Trace exigida de não usar banco de dados real), vamos utilizar um protocolo **WebRTC Mesh Serverless (P2P real)** através de um public relay (ou Socket.IO/Pusher via hook público). 

Porém, WebRTC real num projeto front-end React Vite sem backend dedicado é instável para envio de arquivos pesados (Base64) ou requer servidor STUN/TURN (como o Twilio ou Google STUN). 

A abordagem de **Engenharia de Sistemas** mais segura, escalável e infalível hoje (já que o aplicativo é hospedado na Vercel e o Vercel não suporta WebSockets contínuos nativos sem Redis/Pusher) é o uso de **PartyKit/Yjs** ou do próprio **Supabase (se você criar a conta)**. 
