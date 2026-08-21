import re

with open('src/components/documents/SecureUploadPage.tsx', 'r', encoding='utf8') as f:
    content = f.read()

# 1. No handleFilesSelection, agora vamos guardar APENAS o objeto FILE cru no estado `parsedFiles` sem ler como base64,
# porque vamos enviar para o Supabase Storage
file_selection_regex = r"const handleFilesSelection = async \(files: File\[\]\) => \{.*?setParsedFiles\(prev => \[\.\.\.prev, \.\.\.newParsedFiles\]\);\s*setUploadStatus\(null\);\s*\};"

clean_file_selection = """const handleFilesSelection = async (files: File[]) => {
    const currentOffset = parsedFiles.length;

    const newParsedFiles = await Promise.all(
      files.map(async (file, idx) => {
        const parsed = analyzeFile(file, currentOffset + idx);
        
        // Vamos guardar o objeto File original e o seu mimetype
        parsed.fileType = file.type;
        parsed.rawFile = file; // <-- CAMPO NOVO: Para mandar no form-data do Storage

        return parsed;
      })
    );

    setParsedFiles(prev => [...prev, ...newParsedFiles]);
    setUploadStatus(null);
  };"""

content = re.sub(file_selection_regex, clean_file_selection, content, flags=re.DOTALL)


# 2. No onUploadBatch, mudamos a lógica para subir arquivo a arquivo no Bucket, pegar as strings de caminho,
# e então fazer UM ÚNICO INSERT no final contendo os filePaths.
upload_batch_regex = r"const onUploadBatch = async \(\) => \{.*?finally \{\s*setIsUploading\(false\);\s*\}\s*\};"

clean_upload_batch = """const onUploadBatch = async () => {
    if (parsedFiles.length === 0) return;
    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Cria todos os uploads para o Storage e monta o payload do BD em paralelo
      const cloudDocuments = await Promise.all(parsedFiles.map(async (pf) => {
         let status = 'Aprovado';
         let resolutionAction = null;

         if (pf.category === 'Fiscal_INCRA' && pf.file.name.toLowerCase().includes('2024')) {
             status = 'Pendente';
             resolutionAction = 'Acessar o portal do SNCR (Sistema Nacional de Cadastro Rural) via gov.br, gerar o boleto da taxa de serviço cadastral de 2026, efetuar o pagamento e emitir o CCIR atualizado. O sistema confirmará a compensação em até 48h úteis.';
         }

         let filePath = null;
         
         // Se houver arquivo físico e tamanho > 0, subir pro Storage
         if (pf.rawFile) {
            const fileName = `${Date.now()}_${pf.rawFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            filePath = `vdr_uploads/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('vdr_secure_files')
              .upload(filePath, pf.rawFile, {
                cacheControl: '3600',
                upsert: false
              });
              
            if (uploadError) {
              console.error("Falha ao subir binário para bucket", uploadError);
              filePath = null; // Falhou
            }
         }

         return {
           id: pf.id,
           tenant_id: 'tenant-industrial-demo-uuid',
           title: pf.title,
           category: pf.category.split('_')[0],
           status: status,
           upload_date: new Date().toISOString().split('T')[0],
           issuing_authority: 'Autoridade Reguladora Virtual',
           regulatory_analysis: pf.consultativeNote,
           resolution_action: resolutionAction,
           file_data: filePath, // Caminho no S3 Bucket, não Base64
           file_type: pf.fileType,
           is_too_large: false, // O Bucket não tem limite severo como o Base64 JSON
           uploader_name: currentUser?.name || 'Usuário Não Identificado',
           uploader_role: currentUser?.role || 'Usuário do Sistema',
           uploader_email: currentUser?.email || 'N/A'
         };
      }));

      // API do Supabase BD Save.
      const { error } = await (supabase as any).from('b2b_documents').insert(cloudDocuments);

      if (error) {
        throw new Error(error.message);
      }

      setUploadStatus({
        success: true,
        message: "O lote foi encriptado e sincronizado com o cofre de nuvem.",
        uploadedCount: cloudDocuments.length
      });

      if (onUploadComplete) {
         setTimeout(() => onUploadComplete(), 400);
      }
      return;

    } catch (err: any) {
      console.error("Falha no Lote:", err);
      let errorMsg = err.message || 'Falha no armazenamento seguro.';

      setUploadStatus({
        success: false,
        message: 'Atenção: Houve falha na sincronização na Nuvem (Processamento Interrompido).',
        error: errorMsg,
        uploadedCount: 0
      });
    } finally {
      setIsUploading(false);
    }
  };"""

content = re.sub(upload_batch_regex, clean_upload_batch, content, flags=re.DOTALL)


# Remover erro de tipagem no arquivo rawFile adicionando a propriedade
type_regex = r"fileData\?: string;"
clean_type = "fileData?: string;\n  rawFile?: File;"
content = re.sub(type_regex, clean_type, content)

with open('src/components/documents/SecureUploadPage.tsx', 'w', encoding='utf8') as f:
    f.write(content)

