#!/bin/bash
cat src/components/kanban/KanbanBoard.tsx | awk '
/const fetchBoardData = async \(\) => \{/ {
  print "  const fetchBoardData = async () => {"
  print "    // MOCK PARA DEMONSTRAÇÃO"
  print "    setColumns(["
  print "      { id: \"col1\", name: \"Novos Documentos (Triagem)\", order_index: 0 },"
  print "      { id: \"col2\", name: \"Análise Jurídica / Ambiental\", order_index: 1 },"
  print "      { id: \"col3\", name: \"Aprovados (Cofre)\", order_index: 2 }"
  print "    ]);"
  print "    setCards(["
  print "      { id: \"card1\", column_id: \"col1\", title: \"Matrícula Fazenda Esperança\", description: \"Pendente validação de ônus e alienações. Cadeia sucessória anexada.\", order_index: 0 },"
  print "      { id: \"card2\", column_id: \"col2\", title: \"CAR & Licença Ambiental (LAU)\", description: \"Analisando reserva legal e multas do IBAMA anteriores a 2018.\", order_index: 0 },"
  print "      { id: \"card3\", column_id: \"col3\", title: \"Certidões Negativas Federais\", description: \"CNDs emitidas pela Receita. Livre de embargos.\", order_index: 0 }"
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
!skip { print }
' > tmp.tsx && mv tmp.tsx src/components/kanban/KanbanBoard.tsx
