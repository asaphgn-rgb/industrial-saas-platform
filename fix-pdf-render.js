import fs from 'fs';

let valCode = fs.readFileSync('src/components/documents/SecureDocumentValidation.tsx', 'utf8');

// The best way to do this in React without rewriting the whole component is a small useEffect hook inside the Modal
// or just transforming it before setting the viewingDoc. Let's transform it right before rendering.

const replacement = `  const DocumentViewerModal = () => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
      if (!viewingDoc || !viewingDoc.fileData) return;
      
      // Otimização de Engenharia: Transformar Base64 gigante em Blob URL levíssima e instantânea
      try {
        const base64Data = viewingDoc.fileData.split(',')[1];
        if (!base64Data) {
          setBlobUrl(viewingDoc.fileData); // Fallback caso não seja data URI
          return;
        }
        
        const contentType = viewingDoc.fileType || 'application/pdf';
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        
        const blob = new Blob(byteArrays, { type: contentType });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        return () => URL.revokeObjectURL(url); // Previne vazamento de memória
      } catch (err) {
        console.error("Falha ao otimizar PDF:", err);
        setBlobUrl(viewingDoc.fileData); // Fallback
      }
    }, [viewingDoc]);

    if (!viewingDoc) return null;`;

valCode = valCode.replace(
  /const DocumentViewerModal = \(\) => \{\n\s*if \(\!viewingDoc\) return null;/,
  replacement
);

valCode = valCode.replace(
  /src=\{\`\$\{viewingDoc\.fileData\}#toolbar=0&navpanes=0&scrollbar=0\`\}/,
  `src={blobUrl ? \`\${blobUrl}#toolbar=0&navpanes=0&scrollbar=0\` : ''}`
);

// We need to add useState, useEffect inside the component scope, which works because the component is defined inline.
fs.writeFileSync('src/components/documents/SecureDocumentValidation.tsx', valCode);
