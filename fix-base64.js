import fs from 'fs';

let code = fs.readFileSync('src/components/documents/SecureUploadPage.tsx', 'utf8');

const replacement = `  const handleFilesSelection = async (files: File[]) => {
    // Para renderizar PDFs e imagens reais na tela de Validação
    const readFileAsBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const newParsedFiles = await Promise.all(
      files.map(async (file) => {
        const parsed = analyzeFile(file);
        try {
          // Convertendo para Base64 para armazenar no localStorage e recuperar no visualizador
          const base64 = await readFileAsBase64(file);
          parsed.fileData = base64;
          parsed.fileType = file.type;
        } catch (e) {
          console.error('Erro ao ler arquivo', e);
        }
        return parsed;
      })
    );
    
    setParsedFiles(prev => [...prev, ...newParsedFiles]);
    setUploadStatus(null);
  };`;

code = code.replace(/const handleFilesSelection = \(files: File\[\]\) => \{[\s\S]*?setUploadStatus\(null\);\n  \};/, replacement);
fs.writeFileSync('src/components/documents/SecureUploadPage.tsx', code);
