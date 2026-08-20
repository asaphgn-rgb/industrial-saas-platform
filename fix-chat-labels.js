import fs from 'fs';

let chatCode = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// The messages need to include the sender's role/name to identify who is talking.
// Currently the message object is: 
// const newMsg: Message = { id, sender_id: currentUserId, content, created_at, is_read }
// We need to inject the sender's full role or name. Since `currentUserId` is just an ID, we can pass `currentUserRole` as a prop or find it if we have it.
// Wait, `SecureChatProps` only has `currentUserId: string`. 
// Let's modify the `Message` interface to include `sender_role?: string` and `sender_name?: string`.

chatCode = chatCode.replace(
  /export interface Message \{/,
  `export interface Message {\n  sender_role?: string;\n  sender_name?: string;`
);

chatCode = chatCode.replace(
  /export function SecureChat\(\{ roomId, currentUserId \} : SecureChatProps\) \{/,
  `export function SecureChat({ roomId, currentUserId, currentUserRole, currentUserName }: SecureChatProps & { currentUserRole?: string, currentUserName?: string }) {`
);

chatCode = chatCode.replace(
  /const newMsg: Message = \{/,
  `const newMsg: Message = {\n      sender_role: currentUserRole,\n      sender_name: currentUserName,`
);

// Substitute "Parte Autorizada" with the actual department/role
chatCode = chatCode.replace(
  /<span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Parte Autorizada<\/span>/,
  `<span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{msg.sender_role || 'Parte Autorizada'}</span>`
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', chatCode);

// Update App.tsx to pass these props
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  /<SecureChat roomId=\{demoRoomId\} currentUserId=\{currentUser\.id\} \/>/,
  `<SecureChat roomId={demoRoomId} currentUserId={currentUser.id} currentUserRole={currentUser.role} currentUserName={currentUser.name} />`
);

fs.writeFileSync('src/App.tsx', appCode);

