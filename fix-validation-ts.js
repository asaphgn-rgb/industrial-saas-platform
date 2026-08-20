import fs from 'fs';

let valCode = fs.readFileSync('src/components/documents/SecureDocumentValidation.tsx', 'utf8');

const idbHelper = `
// --- Utilitário IndexedDB para suportar dezenas de MegaBytes ---
const vaultDB = {
  dbName: 'B2B_Vault_DB',
  storeName: 'documents',
  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  },
  async set(key: string, value: any): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  async get(key: string): Promise<any> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
};
`;

valCode = valCode.replace(/import \{[\s\S]*?lucide-react';/, (match) => match + "\n" + idbHelper);

fs.writeFileSync('src/components/documents/SecureDocumentValidation.tsx', valCode);
