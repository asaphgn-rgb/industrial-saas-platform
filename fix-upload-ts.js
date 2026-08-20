import fs from 'fs';

let code = fs.readFileSync('src/components/documents/SecureUploadPage.tsx', 'utf8');

// The injected IDB code has standard JS, we need to add types for TS
code = code.replace(/async init\(\) \{/g, `async init(): Promise<IDBDatabase> {`);
code = code.replace(/const request = indexedDB\.open\(this\.dbName, 1\);/g, `const request = indexedDB.open(this.dbName, 1);`);
code = code.replace(/request\.onupgradeneeded = \(e\) => \{/g, `request.onupgradeneeded = (e: any) => {`);

code = code.replace(/async set\(key, value\) \{/g, `async set(key: string, value: any): Promise<void> {`);
code = code.replace(/const db = await this\.init\(\);/g, `const db = await this.init();`);

code = code.replace(/async get\(key\) \{/g, `async get(key: string): Promise<any> {`);

code = code.replace(/request\.onsuccess = \(\) => resolve\(\);/g, `request.onsuccess = () => resolve();`);
// resolve(request.result) should not complain if we specified Promise<any>

fs.writeFileSync('src/components/documents/SecureUploadPage.tsx', code);

// Same for SecureDocumentValidation.tsx
let valCode = fs.readFileSync('src/components/documents/SecureDocumentValidation.tsx', 'utf8');

valCode = valCode.replace(/async init\(\) \{/g, `async init(): Promise<IDBDatabase> {`);
valCode = valCode.replace(/request\.onupgradeneeded = \(e\) => \{/g, `request.onupgradeneeded = (e: any) => {`);
valCode = valCode.replace(/async set\(key, value\) \{/g, `async set(key: string, value: any): Promise<void> {`);
valCode = valCode.replace(/async get\(key\) \{/g, `async get(key: string): Promise<any> {`);
valCode = valCode.replace(/request\.onsuccess = \(\) => resolve\(\);/g, `request.onsuccess = () => resolve();`);

fs.writeFileSync('src/components/documents/SecureDocumentValidation.tsx', valCode);
