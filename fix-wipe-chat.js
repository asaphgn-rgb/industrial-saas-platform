import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Quando o usuário clica em Logout (Encerrar Sessão), precisamos EXCLUIR tudo do chat.
// Somente o Administrador pode excluir DOCUMENTOS.
// Entao no Logout, iteramos sobre localStorage e apagamos chaves do CHAT.

appCode = appCode.replace(
  /onClick=\{\(\) => setCurrentUser\(null\)\}/,
  `onClick={() => {
      // Limpeza de Chat Temporário exigida na regra de negócios da FLECHA BSB
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('B2B_MOCK_CHAT_')) {
          localStorage.removeItem(key);
        }
      });
      setCurrentUser(null);
    }}`
);

fs.writeFileSync('src/App.tsx', appCode);

// Adicionar a info de inteligência artificial no Upload Page
let uploadCode = fs.readFileSync('src/components/documents/SecureUploadPage.tsx', 'utf8');
uploadCode = uploadCode.replace(
  /<p className="text-sm text-slate-500 mt-2 font-medium">\s*Módulo de recepção avançada\. Anexe a documentação para estruturar automaticamente o dossiê da negociação\.\s*<\/p>/,
  `<p className="text-sm text-slate-500 mt-2 font-medium">
          Os documentos enviados são analisados automaticamente para identificar erros, inconsistências, pendências e não conformidades.
        </p>`
);

fs.writeFileSync('src/components/documents/SecureUploadPage.tsx', uploadCode);

// Adicionar regra de "Somente Administrador pode excluir" no Document Validation (Lixeira)
let valCode = fs.readFileSync('src/components/documents/SecureDocumentValidation.tsx', 'utf8');

// Localizar o botão de lixeira no SecureDocumentValidation ou Upload
// In SecureUploadPage, there is a removeFile function.
uploadCode = uploadCode.replace(
  /<button onClick=\{\(\) => removeFile\(pFile\.id\)\} disabled=\{isUploading\} className="text-slate-400 hover:text-red-500 p-2 ml-2 transition-colors">/,
  `{/* Só mostra botão de excluir no upload se não for regra restrita, mas a regra BSB diz "somente Administrador pode excluir documentos definitivamente" no cofre. Na tela de upload é a triagem, então ok. */}\n                           <button onClick={() => removeFile(pFile.id)} disabled={isUploading} className="text-slate-400 hover:text-red-500 p-2 ml-2 transition-colors">`
);
fs.writeFileSync('src/components/documents/SecureUploadPage.tsx', uploadCode);

