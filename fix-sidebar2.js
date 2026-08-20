import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// I accidentally deleted the closing </aside> tag when removing the block.
appCode = appCode.replace(
  /\{?\/\* Content Area \*\/\}?/,
  `</aside>\n\n        {/* Content Area */}`
);

fs.writeFileSync('src/App.tsx', appCode);
