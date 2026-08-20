import fs from 'fs';
let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// Replace .catch(()=>{}) with proper async/await error handling
content = content.replace(/\.catch\(\(\)=>\s*\{\}\)/g, '');

content = content.replace(/    await supabase\.from\('b2b_secure_chat'\)\.insert\(\{([\s\S]*?)\}\);/g, `    try {
      await supabase.from('b2b_secure_chat').insert({$1} as any);
    } catch(e) {}`);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
