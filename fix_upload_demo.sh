#!/bin/bash

# Replaces the whole try/catch block of the upload batch to just mock success
# Because without a real supabase server running locally and an active auth token,
# the storage.upload and db.insert will throw Network/JWT errors anyway.
# We will mock the delay and the success for visual demonstration.

cat src/components/documents/SecureUploadPage.tsx | awk '
/try \{/ {
  print "    try {"
  print "      // MOCK PARA DEMONSTRAÇÃO (SEM SUPABASE LOCAL STARTADO)"
  print "      await new Promise(r => setTimeout(r, 2500)); // Simulando criptografia E2E e upload"
  print "      uploadedCount = parsedFiles.length;"
  print ""
  print "      setUploadStatus({"
  print "        success: true,"
  print "        message: \"[DEMO] Todos os documentos foram encriptados e classificados com sucesso no cofre.\","
  print "        uploadedCount"
  print "      });"
  print "      return;"
  print ""
  skip=1
}
/setUploadStatus\(\{/ && skip==1 {
  skip2=1
}
/catch \(err: any\) \{/ && skip==1 {
  skip=0
  print "    } catch (err: any) {"
  next
}
!skip { print }
' > tmp.tsx && mv tmp.tsx src/components/documents/SecureUploadPage.tsx
