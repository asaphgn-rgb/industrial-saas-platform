import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<div className="p-2 space-y-1">[\s\S]*?<\/div>\s*<\/div>\s*\)\}/, 
`<div className="p-2 space-y-1">
  <button
    onClick={() => setCurrentUser(null)}
    className="w-full flex items-center justify-center p-3 rounded-lg transition-colors text-center text-red-500 hover:bg-red-50 hover:text-red-700 border border-transparent font-bold text-xs"
  >
     Encerrar Sessão (Log out)
  </button>
</div>
</div>
)}`);

fs.writeFileSync('src/App.tsx', code);
