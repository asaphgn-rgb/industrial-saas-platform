// E2E Encryption Utils - Padrão Banking (AES-GCM 256)
// A criptografia ocorre puramente no frontend do cliente. O backend (Supabase) só recebe hashes e ciphertexts.

const ALGORITHM = 'AES-GCM';
const DERIVATION_ALGORITHM = 'PBKDF2';
const ITERATIONS = 100000;

// Para o demo E2E simplificado, usamos um secret do room. Na prática real, usa-se Diffie-Hellman Key Exchange
export async function deriveKey(roomSecret: string, salt: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(roomSecret),
    { name: DERIVATION_ALGORITHM },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: DERIVATION_ALGORITHM,
      salt: enc.encode(salt),
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Cifra uma string de texto, retornando Base64 (iv + ciphertext)
export async function encryptE2E(text: string, cryptoKey: CryptoKey): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedText = new TextEncoder().encode(text);
  
  const cipherBuffer = await window.crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv
    },
    cryptoKey,
    encodedText
  );

  // Combina IV e Cipher em um array unico e converte para B64
  const cipherArray = new Uint8Array(cipherBuffer);
  const combined = new Uint8Array(iv.length + cipherArray.length);
  combined.set(iv, 0);
  combined.set(cipherArray, iv.length);
  
  return btoa(String.fromCharCode.apply(null, Array.from(combined)));
}

// Decifra o payload (Base64) voltando para o texto limpo
export async function decryptE2E(cipherB64: string, cryptoKey: CryptoKey): Promise<string> {
  try {
    const combinedStr = atob(cipherB64);
    const combined = new Uint8Array(combinedStr.length);
    for (let i = 0; i < combinedStr.length; i++) {
        combined[i] = combinedStr.charCodeAt(i);
    }

    const iv = combined.slice(0, 12);
    const cipherText = combined.slice(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv
      },
      cryptoKey,
      cipherText
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch(e) {
    console.error("Tentativa de quebra de sigilo / erro de descriptografia", e);
    return "⚠️ [MENSAGEM ILEGÍVEL OU CHAVE INCOMPATÍVEL]";
  }
}
