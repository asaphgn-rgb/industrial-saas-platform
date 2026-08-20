import fs from 'fs';

let code = fs.readFileSync('src/components/documents/SecureUploadPage.tsx', 'utf8');

// I will write a robust Vanilla IndexedDB helper right inside the file.
// Since it's a bit verbose, I'll inject a utility function outside the component and replace localStorage.setItem.

const idbHelper = `
// --- Utilitário IndexedDB para suportar dezenas de MegaBytes (Bypass de cota do LocalStorage) ---
const vaultDB = {
  dbName: 'B2B_Vault_DB',
  storeName: 'documents',
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  },
  async set(key, value) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  async get(key) {
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

// Insert the IDB helper after imports
code = code.replace(/import { SafeAny } from '\.\.\/\.\.\/types\/supabase-override';/, 
  "import { SafeAny } from '../../types/supabase-override';\n" + idbHelper
);

// Replace localStorage with vaultDB in onUploadBatch
code = code.replace(
  /localStorage\.setItem\('B2B_MOCK_VAULT', JSON\.stringify\(docsForValidation\)\);/,
  `await vaultDB.set('B2B_MOCK_VAULT', docsForValidation);`
);

fs.writeFileSync('src/components/documents/SecureUploadPage.tsx', code);

// Now I need to update SecureDocumentValidation.tsx to read from IndexedDB instead of localStorage
let valCode = fs.readFileSync('src/components/documents/SecureDocumentValidation.tsx', 'utf8');

valCode = valCode.replace(/import \{ Search, Filter/g, 
  idbHelper + "\nimport { Search, Filter"
);

// find where it reads: const savedMock = localStorage.getItem('B2B_MOCK_VAULT');
valCode = valCode.replace(
  /const savedMock = localStorage\.getItem\('B2B_MOCK_VAULT'\);\n\s*if \(savedMock\) \{\n\s*setDocuments\(JSON\.parse\(savedMock\)\);\n\s*\}/g,
  `vaultDB.get('B2B_MOCK_VAULT').then(savedMock => {
      if (savedMock) {
        setDocuments(savedMock);
      }
    }).catch(err => console.error("Erro ao ler do IndexedDB", err));`
);

fs.writeFileSync('src/components/documents/SecureDocumentValidation.tsx', valCode);

