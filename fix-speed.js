import fs from 'fs';

let uploadCode = fs.readFileSync('src/components/documents/SecureUploadPage.tsx', 'utf8');

// Reduce artificial wait times
uploadCode = uploadCode.replace(
  /await new Promise\(r => setTimeout\(r, 2500\)\); \/\/ Simulando criptografia E2E e upload/,
  `await new Promise(r => setTimeout(r, 600)); // Simulando criptografia E2E rápida`
);

uploadCode = uploadCode.replace(
  /setTimeout\(\(\) => onUploadComplete\(\), 1500\);/,
  `setTimeout(() => onUploadComplete(), 400);`
);

fs.writeFileSync('src/components/documents/SecureUploadPage.tsx', uploadCode);

// Document Validation Page speedups
let valCode = fs.readFileSync('src/components/documents/SecureDocumentValidation.tsx', 'utf8');
valCode = valCode.replace(
  /setTimeout\(\(\) => \{\n\s*setSignatureStep\('signed'\);\n\s*\}, 3500\); \/\/ Simulando handshake B2B longo/,
  `setTimeout(() => {
      setSignatureStep('signed');
    }, 800); // Handshake ultrarrápido`
);

fs.writeFileSync('src/components/documents/SecureDocumentValidation.tsx', valCode);
