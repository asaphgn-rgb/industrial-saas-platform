import re

with open('src/components/documents/SecureDocumentValidation.tsx', 'r', encoding='utf8') as f:
    content = f.read()

# Replace the messy fetch logic with clean logic
fetch_regex = r"const fetchDocuments = async \(\) => \{.*?setMockDocuments\(parsed\);"
clean_fetch = """const fetchDocuments = async () => {
      const { data, error } = await (supabase as any).from('b2b_documents').select('*').eq('tenant_id', 'tenant-industrial-demo-uuid');

      if (data && !error) {
        const docs = data;

        const parsed: AnalyzedDocument[] = docs.map((d: any) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          status: d.status,
          uploadDate: d.upload_date,
          regulatoryAnalysis: d.regulatory_analysis,
          resolutionAction: d.resolution_action,
          issuingAuthority: d.issuing_authority,
          fileData: d.file_data,
          fileType: d.file_type,
          isTooLarge: d.is_too_large,
          uploaderName: d.uploader_name,
          uploaderRole: d.uploader_role,
          uploaderEmail: d.uploader_email,
          deletionRequested: d.deletion_requested,
        }));

        setMockDocuments(parsed);"""

content = re.sub(fetch_regex, clean_fetch, content, flags=re.DOTALL)

# Delete document logic
delete_regex = r"const handleDeleteDocument = async \(id: string\) => \{.*?const \{ data: tenantData \}.*?\n.*?const existingSettings.*?\n.*?const \{ error \} = await \(supabase as any\)\.from\('tenants'\)\.update\(\{ settings: \{ \.\.\.existingSettings, b2b_documents: updatedDocs \} \}\)\.eq\('id', 'tenant-industrial-demo-uuid'\);"
clean_delete = """const handleDeleteDocument = async (id: string) => {
    const { error } = await (supabase as any).from('b2b_documents').delete().eq('id', id);
    const updatedDocs = mockDocuments.filter(doc => doc.id !== id);"""

content = re.sub(delete_regex, clean_delete, content, flags=re.DOTALL)

# Request deletion logic
req_delete_regex = r"const handleRequestDeletion = async \(id: string\) => \{.*?const updatedDocs = mockDocuments.map\(doc => doc\.id === id \? \{ \.\.\.doc, deletionRequested: true, deletion_requested: true \} : doc\);.*?const \{ data: tenantData \}.*?\n.*?const existingSettings.*?\n.*?const \{ error \} = await \(supabase as any\)\.from\('tenants'\)\.update\(\{ settings: \{ \.\.\.existingSettings, b2b_documents: updatedDocs \} \}\)\.eq\('id', 'tenant-industrial-demo-uuid'\);"
clean_req_delete = """const handleRequestDeletion = async (id: string) => {
    const updatedDocs = mockDocuments.map(doc => doc.id === id ? { ...doc, deletionRequested: true, deletion_requested: true } : doc);
    const { error } = await (supabase as any).from('b2b_documents').update({ deletion_requested: true }).eq('id', id);"""

content = re.sub(req_delete_regex, clean_req_delete, content, flags=re.DOTALL)

# Reject deletion logic
rej_delete_regex = r"const handleRejectDeletion = async \(id: string\) => \{.*?const updatedDocs = mockDocuments.map\(doc => doc\.id === id \? \{ \.\.\.doc, deletionRequested: false, deletion_requested: false \} : doc\);.*?const \{ data: tenantData \}.*?\n.*?const existingSettings.*?\n.*?const \{ error \} = await \(supabase as any\)\.from\('tenants'\)\.update\(\{ settings: \{ \.\.\.existingSettings, b2b_documents: updatedDocs \} \}\)\.eq\('id', 'tenant-industrial-demo-uuid'\);"
clean_rej_delete = """const handleRejectDeletion = async (id: string) => {
    const updatedDocs = mockDocuments.map(doc => doc.id === id ? { ...doc, deletionRequested: false, deletion_requested: false } : doc);
    const { error } = await (supabase as any).from('b2b_documents').update({ deletion_requested: false }).eq('id', id);"""

content = re.sub(rej_delete_regex, clean_rej_delete, content, flags=re.DOTALL)

# Clear vault logic
clear_regex = r"if\(window.confirm\(\"Deseja apagar TODOS os documentos da Nuvem e esvaziar o cofre\?\"\)\) \{.*?const \{ data: tenantData \}.*?\n.*?const existingSettings.*?\n.*?await \(supabase as any\)\.from\('tenants'\)\.update\(\{ settings: \{ \.\.\.existingSettings, b2b_documents: \[\] \} \}\)\.eq\('id', 'tenant-industrial-demo-uuid'\);"
clean_clear = """if(window.confirm("Deseja apagar TODOS os documentos da Nuvem e esvaziar o cofre?")) {
                      await (supabase as any).from('b2b_documents').delete().eq('tenant_id', 'tenant-industrial-demo-uuid');"""

content = re.sub(clear_regex, clean_clear, content, flags=re.DOTALL)


with open('src/components/documents/SecureDocumentValidation.tsx', 'w', encoding='utf8') as f:
    f.write(content)

