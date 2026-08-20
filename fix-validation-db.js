import fs from 'fs';

let valCode = fs.readFileSync('src/components/documents/SecureDocumentValidation.tsx', 'utf8');

// I can see the previous regex replace FAILED because the logic in SecureDocumentValidation.tsx 
// had `const savedMock = localStorage.getItem('B2B_MOCK_VAULT');` but my regex was looking for `setDocuments(JSON.parse(savedMock))`, 
// whereas the code actually does `setMockDocuments(JSON.parse(savedMock))`.
// That's why the uploaded documents "disappeared": SecureUploadPage saves to IndexedDB, but SecureDocumentValidation is still reading from localStorage!

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

// Insert helper if it's not there
if (!valCode.includes('const vaultDB')) {
  valCode = valCode.replace(/import \{ Search, Filter/g, 
    idbHelper + "\nimport { Search, Filter"
  );
}

// Replace the localStorage logic
valCode = valCode.replace(
  /const savedMock = localStorage\.getItem\('B2B_MOCK_VAULT'\);[\s\S]*?\}\s*\}, \[\]\);/,
  `vaultDB.get('B2B_MOCK_VAULT').then(savedMock => {
      if (savedMock) {
        try {
          const parsed = typeof savedMock === 'string' ? JSON.parse(savedMock) : savedMock;
          setMockDocuments(parsed);
          if (parsed.length > 0) setExpandedDocId(parsed[0].id);
        } catch (e) {}
      }
    });
  }, []);`
);

fs.writeFileSync('src/components/documents/SecureDocumentValidation.tsx', valCode);
