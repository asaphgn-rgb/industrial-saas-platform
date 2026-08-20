#!/bin/bash
cat src/components/secure-chat/SecureChat.tsx | awk '
/const fetchMessages = async \(\) => \{/ {
  print "  const fetchMessages = async () => {"
  print "    // MOCK PARA DEMONSTRAÇÃO"
  print "    setMessages(["
  print "      { id: \"1\", sender_id: \"system\", content: \"Iniciando protocolo de negociação. Cofre aberto.\", created_at: new Date(Date.now() - 3600000).toISOString(), is_read: true },"
  print "      { id: \"2\", sender_id: \"partner\", content: \"A matrícula e a cadeia sucessória já foram analisadas?\", created_at: new Date(Date.now() - 1800000).toISOString(), is_read: true },"
  print "      { id: \"3\", sender_id: currentUserId, content: \"Sim. A análise preliminar está limpa. Estou anexando o relatório da auditoria fiscal do INCRA agora.\", created_at: new Date(Date.now() - 900000).toISOString(), attachment_url: \"mock.pdf\", is_read: true }"
  print "    ]);"
  print "    setLoading(false);"
  print "    return;"
  print ""
  skip=1
}
/catch \(err\) \{/ && skip==1 {
  skip=0
  print "    } catch (err) {"
  next
}
/const handleSendMessage = async \(e: React.FormEvent\) => \{/ {
  print "  const handleSendMessage = async (e: React.FormEvent) => {"
  print "    e.preventDefault();"
  print "    if (!newMessage.trim()) return;"
  print "    const msg = newMessage;"
  print "    setNewMessage(\"\");"
  print "    // MOCK PARA DEMONSTRAÇÃO"
  print "    const newMsg: Message = {"
  print "      id: Math.random().toString(),"
  print "      sender_id: currentUserId,"
  print "      content: msg,"
  print "      created_at: new Date().toISOString(),"
  print "      is_read: false"
  print "    };"
  print "    setMessages(prev => [...prev, newMsg]);"
  print "    return;"
  print ""
  skip_send=1
}
/catch \(err\) \{/ && skip_send==1 {
  skip_send=0
  print "    } catch (err) {"
  next
}
!skip && !skip_send { print }
' > tmp.tsx && mv tmp.tsx src/components/secure-chat/SecureChat.tsx
