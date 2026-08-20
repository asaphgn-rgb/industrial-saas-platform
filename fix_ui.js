import fs from "fs";
let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');
content = content.replace(/                \{msg\.attachment_url && \(\[\s\S\]\*?\)\}/, newAttachUI);
content = content.replace(/      \{\/\* Input de Mensagem \*\/\}\[\s\S\]\*?    <\/div>\n  \);\n\}\n$/, newForm + '\n    </div>\n  );\n}\n');
fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
