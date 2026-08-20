import fs from 'fs';
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if(!appContent.includes('SecureAboutPage')) {
  appContent = appContent.replace(
    "import { SecureLogin } from './components/auth/SecureLogin';",
    "import { SecureLogin } from './components/auth/SecureLogin';\nimport { SecureAboutPage } from './components/documents/SecureAboutPage';"
  );
  
  appContent = appContent.replace(
    "{/* Módulos Novos - Ambiente Secreto */}",
    "{/* Módulos Novos - Ambiente Secreto */}\n          {activeTab === 'pipeline_secure' && (<div className=\"absolute inset-0 bg-fbsb-bg-main overflow-y-auto\"><SecureAboutPage /></div>)}"
  );
  
  appContent = appContent.replace(
    "          {activeTab === 'pipeline_secure' && (\n            <div className=\"absolute inset-0\">\n               <KanbanBoard boardId={demoBoardId} />\n            </div>\n          )}",
    ""
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
}
