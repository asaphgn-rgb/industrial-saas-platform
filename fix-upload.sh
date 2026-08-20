#!/bin/bash
sed -i -e '275,283d' src/components/documents/SecureUploadPage.tsx
sed -i -e '275,278c\      const { error } = await (supabase as any).from('\''b2b_documents'\'').insert(cloudDocuments).abortSignal(controller.signal);' src/components/documents/SecureUploadPage.tsx
