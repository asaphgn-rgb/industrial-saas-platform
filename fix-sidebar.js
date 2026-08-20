import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// The user asked to remove "Gestão CAPA" and "Operacional & ISO 9001" completely from the sidebar.
appCode = appCode.replace(
  /\{?\/\* Sessão: Módulos Industriais Standard \*\/\}?[\s\S]*?\{?\/\* Content Area \*\/\}?/,
  `{/* Content Area */}`
);

// We also need to remove the rendering of QMS in the main area
appCode = appCode.replace(
  /\{activeTab === 'qms' && \([\s\S]*?<\/[Qq]msNonConformanceModule>[\s\S]*?\)\}/,
  ``
);

// We should also remove the dashboard tab since they crossed out the whole section
appCode = appCode.replace(
  /\{activeTab === 'dashboard' && \([\s\S]*?Conexão Operacional Multi-Tenant[\s\S]*?\}\s*\)\}/,
  ``
);

// Let's make sure the divider above it is also removed
appCode = appCode.replace(
  /<div className="w-full h-px bg-gradient-to-r from-transparent via-elite-sand\/30 to-transparent"><\/div>\s*\{?\/\* Content Area \*\/\}?/,
  `{/* Content Area */}`
);

fs.writeFileSync('src/App.tsx', appCode);
