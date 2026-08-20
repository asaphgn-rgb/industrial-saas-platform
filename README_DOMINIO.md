# Configuração do Domínio (flechabsb.com)

Para configurar o domínio `flechabsb.com` na sua arquitetura atual, que envolve o Vercel (Front-end) e opcionalmente o Supabase (Backend/Banco), siga os 3 passos obrigatórios.

## 1. Configurar na Vercel (Hospedagem do Site)
Como o sistema foi implantado na Vercel, o Vercel precisa saber que ele é o dono do domínio `flechabsb.com`.
1. Acesse o painel da **Vercel** > Vá no seu projeto do Vault B2B.
2. Acesse a aba **Settings** > **Domains**.
3. No campo "Enter domain", digite `flechabsb.com` e adicione.
4. O Vercel gerará **records de DNS** (Geralmente um `A Record` apontando para um IP tipo `76.76.21.21` e/ou um `CNAME` para `cname.vercel-dns.com`).
5. Copie esses valores que a Vercel gerou.

## 2. Configurar onde você comprou o Domínio (Registro.br, GoDaddy, HostGator, Cloudflare, etc)
Você precisará apontar o seu domínio para os servidores da Vercel.
1. Acesse o painel onde você comprou o domínio `flechabsb.com`.
2. Vá em **Zonas de DNS** (ou Gerenciamento de DNS).
3. Adicione ou edite as entradas para combinar com o que o Vercel pediu:
   - **Tipo**: `A` | **Nome/Host**: `@` (ou vazio) | **Valor/Destino**: O IP dado pelo Vercel (ex: `76.76.21.21`).
   - **Tipo**: `CNAME` | **Nome/Host**: `www` | **Valor/Destino**: `cname.vercel-dns.com`.
4. Salve. A propagação do DNS pode demorar de alguns minutos a algumas horas. O Vercel emitirá o SSL (cadeado de segurança) automaticamente assim que reconhecer o domínio.

## 3. Configurar no Supabase (Para Liberação de Autenticação / CORS)
Se estiver usando o banco real do Supabase com o esquema de Login deles, o Supabase precisa saber que `flechabsb.com` é um domínio permitido para redirecionamento.
1. Acesse o painel do **Supabase** > **Authentication** > **URL Configuration**.
2. Em **Site URL**, altere para `https://flechabsb.com`.
3. Em **Redirect URLs**, adicione:
   - `https://flechabsb.com/*`
   - `https://www.flechabsb.com/*`
4. Na aba **API Settings**, caso exista configuração de restrição CORS explícita, verifique se seu domínio está na white-list (geralmente o padrão do Supabase já permite o Site URL, mas garanta que o Vercel Front-end converse livremente com ele).

## Auditoria e Ponto de Escalação
O código desenvolvido nestas interações opera primariamente sobre **Mock Storage (Local e Base64)** para os Dossiês (Vault), Arquivos, Chat e Login. Isso garante a demonstração perfeita de Due Diligence e criptografia visual para o público e investidores.

**Para escalar e colocar dados em Produção (Full-Backend):**
A arquitetura do Front-end (UI, Telas, Roteamento, State) já está de nível altíssimo. Para tornar permanente, as chamadas fictícias ("Mocks") que injetamos (ex: `localStorage.setItem('B2B_MOCK_VAULT')` e `setTimeout` no Login) precisarão ser religadas às funções nativas do Supabase SDK (como `supabase.auth.signInWithPassword()` e `supabase.from('documents').upload()`). O código original para esses endpoints do Supabase **continua intacto** nos arquivos da pasta `/services/`, portanto o sistema está apto a transição imediata para dados em nuvem.
