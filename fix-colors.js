import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/bg-elite-paper/g, 'bg-fbsb-bg-main');
  content = content.replace(/text-elite-navy/g, 'text-fbsb-text-primary');
  content = content.replace(/border-elite-sand(\/[0-9]+)?/g, 'border-fbsb-border');
  content = content.replace(/bg-elite-white/g, 'bg-fbsb-surface-100');
  content = content.replace(/bg-elite-navy/g, 'bg-fbsb-primary');
  content = content.replace(/text-elite-gold/g, 'text-fbsb-cyan');
  content = content.replace(/bg-elite-gold/g, 'bg-fbsb-cyan');
  content = content.replace(/text-elite-sand/g, 'text-fbsb-text-secondary');
  content = content.replace(/border-elite-gold/g, 'border-fbsb-cyan');
  content = content.replace(/text-slate-[0-9]+/g, 'text-fbsb-text-secondary');
  content = content.replace(/bg-slate-[0-9]+/g, 'bg-fbsb-surface-200');
  content = content.replace(/border-slate-[0-9]+/g, 'border-fbsb-border');
  content = content.replace(/bg-white/g, 'bg-fbsb-surface-100');
  
  // Clean up any remaining elite-* classes
  content = content.replace(/elite-navy/g, 'fbsb-primary');
  content = content.replace(/elite-gold/g, 'fbsb-cyan');
  content = content.replace(/elite-sand/g, 'fbsb-text-secondary');
  content = content.replace(/elite-paper/g, 'fbsb-bg-deep');
  content = content.replace(/elite-white/g, 'fbsb-surface-100');

  fs.writeFileSync(filePath, content);
}

const filesToFix = [
  'src/App.tsx',
  'src/components/auth/SecureLogin.tsx',
  'src/components/documents/SecureDocumentValidation.tsx',
  'src/components/documents/SecureUploadPage.tsx',
  'src/components/kanban/KanbanBoard.tsx',
  'src/components/secure-chat/SecureChat.tsx'
];

filesToFix.forEach(replaceInFile);
console.log('Colors replaced');
