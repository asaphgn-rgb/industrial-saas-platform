import fs from 'fs';

let chatCode = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

chatCode = chatCode.replace(
  /export function SecureChat\(\{ roomId, currentUserId \} : SecureChatProps & \{ currentUserRole\?: string, currentUserName\?: string \}\) \{/,
  `export function SecureChat({ roomId, currentUserId, currentUserRole, currentUserName }: SecureChatProps) {`
);

// Fallback to be sure
if(chatCode.includes('export function SecureChat({ roomId, currentUserId }: SecureChatProps) {')) {
  chatCode = chatCode.replace(
    /export function SecureChat\(\{ roomId, currentUserId \}: SecureChatProps\) \{/,
    `export function SecureChat({ roomId, currentUserId, currentUserRole, currentUserName }: SecureChatProps) {`
  );
}

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', chatCode);
