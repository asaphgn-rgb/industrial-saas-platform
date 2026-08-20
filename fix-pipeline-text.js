import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const newText = `          {/* Sessão: Módulos Seguros */}
          <div>
            <h3 className="text-[10px] font-bold text-fbsb-text-secondary uppercase tracking-[0.2em] mb-4 pl-2">Due Diligence</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => { setActiveTab('pipeline_secure'); setIsMobileMenuOpen(false); }}
                className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 \${
                  activeTab === 'pipeline_secure'
                    ? 'bg-fbsb-primary text-white shadow-premium'
                    : 'text-fbsb-text-secondary hover:bg-fbsb-surface-200 hover:text-fbsb-text-primary'
                }\`}
              >
                <LayoutDashboard className={\`w-4 h-4 \${activeTab === 'pipeline_secure' ? 'text-fbsb-cyan' : 'text-fbsb-text-secondary'}\`} />
                <span className="tracking-wide">Sobre a FLECHA BSB</span>
              </button>`;

content = content.replace(/          \{\/\* Sessão: Módulos Seguros \*\/\}[\s\S]*?<span className="tracking-wide">Pipeline Estratégico<\/span>\n              <\/button>/, newText);

fs.writeFileSync('src/App.tsx', content);

