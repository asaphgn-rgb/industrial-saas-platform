# Guia Sênior: Deploy Criptografado na Vercel (Vault B2B)

Para hospedar o sistema com o link público definitivo, garantindo os níveis de blindagem combinados:

## Passo 1: Repositório Seguro no GitHub
O GitHub irá guardar o código-fonte de forma privada. O código atual possui a lógica `E2E (End-to-End Encryption)` para o chat.
1. No terminal, inicie a configuração pro seu GitHub (Troque "SEU_USUARIO"):
```bash
git remote add origin https://github.com/SEU_USUARIO/nome-do-repo-privado.git
git push -u origin main
```

## Passo 2: Supabase (Backend Isolado)
Você não precisa subir containers manualmente, o Supabase provisiona o banco Postgres com RLS grátis.
1. Acesse [Supabase.com](https://supabase.com/) e crie um projeto "Vault B2B".
2. Copie a sua `URL` e sua `Anon Public Key`.
3. (Opcional - Ativação do Banco Real): O App atualmente opera em *Modo Memória Segura (Local Storage)* para que você demonstre sem depender do banco. Quando você for migrar de fato pro Supabase, basta alterar no `SecureUploadPage.tsx` e `SecureChat.tsx` as partes indicadas como "Mock" para usar os métodos `supabase.from('documents').insert(...)`.

## Passo 3: Deploy Vercel (SSL de Categoria Bancária)
1. Acesse [Vercel.com](https://vercel.com/) e crie uma conta.
2. Clique em **Add New Project** e conecte o GitHub. Selecione o repositório que acabamos de enviar no Passo 1.
3. **CRÍTICO:** Antes de clicar em *Deploy*, na tela de configuração, abra a aba "Environment Variables".
4. Adicione as chaves abaixo para que a build seja compilada com blindagem:
   - `VITE_SUPABASE_URL` = [Sua URL do Supabase]
   - `VITE_SUPABASE_ANON_KEY` = [Sua Chave do Supabase]
5. Clique em **Deploy**.

## Sobre a Segurança E2E Implementada
Adicionei o módulo `src/lib/crypto.ts` usando o **AES-GCM-256** derivado com **PBKDF2**. 
As mensagens digitadas no chat pelo Comprador são cifradas antes de sair do navegador. Mesmo que um invasor (ou você como Administrador do Banco) abra a tabela `chat_messages` do Supabase, o que ele verá será um *Hash* ilegível. Somente a interface que possuir a *CryptoKey* derivada do contexto do participante conseguirá ler.

O visualizador de documentos agora também trava o scroll original e inibe as ações contextuais para não permitir o download fácil (uso nativo bloqueado).
