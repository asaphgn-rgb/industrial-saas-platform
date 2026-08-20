import fs from 'fs';

let chatCode = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

// Chat container needs padding adjustments for mobile
chatCode = chatCode.replace(
  /<div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-white border border-elite-sand\/20 rounded-2xl shadow-premium overflow-hidden font-sans">/,
  `<div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-white md:border border-elite-sand/20 md:rounded-2xl shadow-premium overflow-hidden font-sans absolute md:relative inset-0 md:inset-auto">`
);

chatCode = chatCode.replace(
  /<div className="flex-1 p-6 overflow-y-auto space-y-6 bg-\[\#f4f2ef\]/,
  `<div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6 bg-[#f4f2ef]`
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', chatCode);

// E2E UI
let uploadCode = fs.readFileSync('src/components/documents/SecureUploadPage.tsx', 'utf8');
uploadCode = uploadCode.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">/,
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">`
);
fs.writeFileSync('src/components/documents/SecureUploadPage.tsx', uploadCode);

