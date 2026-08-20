import fs from 'fs';
import path from 'path';

const filesToFix = [
  'src/App.tsx',
  'src/components/auth/SecureLogin.tsx',
  'src/components/documents/SecureAboutPage.tsx',
  'src/components/secure-chat/SecureChat.tsx'
];

filesToFix.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Hardcoded hex colors
  content = content.replace(/#000000/g, '#06141B');
  content = content.replace(/#0A0A0A/g, '#11212D');
  content = content.replace(/#141414/g, '#253745');
  content = content.replace(/#1A1F2C/g, '#253745');
  content = content.replace(/#1C1C1E/g, '#4A5C6A');
  content = content.replace(/#1F1F1F/g, '#4A5C6A');
  content = content.replace(/#2D2D2D/g, '#4A5C6A');
  content = content.replace(/#131720/g, '#11212D');
  content = content.replace(/#0F1219/g, '#06141B');
  content = content.replace(/#D4AF37/g, '#9BA8AB');
  content = content.replace(/#E8C37D/g, '#9BA8AB');
  content = content.replace(/#A3A3A3/g, '#9BA8AB');
  content = content.replace(/#2DD4BF/g, '#9BA8AB'); // old cyan
  content = content.replace(/#3B82F6/g, '#4A5C6A'); // old blue
  content = content.replace(/#1E40AF/g, '#253745'); // old dark blue

  // Tailwinds classes with unallowed colors
  content = content.replace(/text-white/g, 'text-[#CCD0CF]');
  content = content.replace(/text-slate-[0-9]+/g, 'text-[#9BA8AB]');
  content = content.replace(/bg-slate-[0-9]+/g, 'bg-[#253745]');
  content = content.replace(/border-slate-[0-9]+/g, 'border-[#4A5C6A]');
  
  content = content.replace(/text-emerald-[0-9]+/g, 'text-[#9BA8AB]');
  content = content.replace(/bg-emerald-[0-9]+/g, 'bg-[#4A5C6A]');
  content = content.replace(/border-emerald-[0-9]+/g, 'border-[#4A5C6A]');
  
  content = content.replace(/text-amber-[0-9]+/g, 'text-[#9BA8AB]');
  content = content.replace(/bg-amber-[0-9]+/g, 'bg-[#4A5C6A]');
  
  content = content.replace(/text-red-[0-9]+/g, 'text-[#9BA8AB]');
  content = content.replace(/bg-red-[0-9]+/g, 'bg-[#4A5C6A]');
  content = content.replace(/border-red-[0-9]+/g, 'border-[#4A5C6A]');

  content = content.replace(/text-black/g, 'text-[#06141B]');
  content = content.replace(/bg-white/g, 'bg-[#CCD0CF]');
  
  content = content.replace(/from-\[#[0-9A-Fa-f]+\]/g, 'from-[#253745]');
  content = content.replace(/to-\[#[0-9A-Fa-f]+\]/g, 'to-[#11212D]');
  
  fs.writeFileSync(filePath, content);
});
console.log('Palette enforced');
