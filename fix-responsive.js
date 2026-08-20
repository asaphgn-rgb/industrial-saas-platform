import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// The main layout in App.tsx is:
// <div className="flex-1 flex overflow-hidden">
//   <aside className="w-72...">
//   <main className="flex-1...">
// </div>
// On mobile, "flex" row with fixed width 72 (w-72) will squeeze the main content or break off-screen.
// We need to implement a true responsive layout: Hamburger menu for mobile, hiding the sidebar on small screens, stacking elements.

// 1. We need to add state for mobile menu: const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
appCode = appCode.replace(
  /const \[showUserMenu, setShowUserMenu\] = useState\(false\);/,
  `const [showUserMenu, setShowUserMenu] = useState(false);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);`
);

// 2. Add Hamburger button to Header (visible only on md-)
// It will be added near the ShieldCheck logo.
appCode = appCode.replace(
  /<div className="flex items-center space-x-4">/,
  `<div className="flex items-center space-x-3 md:space-x-4">
          <button 
            className="md:hidden p-2 text-slate-500 hover:text-elite-navy focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>`
);

// 3. Update the main layout wrapper and Sidebar classes
appCode = appCode.replace(
  /<div className="flex-1 flex overflow-hidden">/,
  `<div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">`
);

appCode = appCode.replace(
  /<aside className="w-72 bg-elite-white border-r border-elite-sand\/20 p-6 flex flex-col space-y-8 overflow-y-auto z-10 shadow-\[4px_0_24px_rgba\(0,0,0,0\.02\)\]">/,
  `{/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        
        <aside className={\`
          fixed md:relative top-0 left-0 h-full z-50 md:z-10
          w-72 bg-elite-white border-r border-elite-sand/20 p-6 flex flex-col space-y-8 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)]
          transform transition-transform duration-300 ease-in-out
          \${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        \`}>`
);

// 4. Update the activeTab click inside Sidebar to also close the mobile menu
appCode = appCode.replace(
  /onClick=\{\(\) => setActiveTab\('pipeline_secure'\)\}/g,
  `onClick={() => { setActiveTab('pipeline_secure'); setIsMobileMenuOpen(false); }}`
);
appCode = appCode.replace(
  /onClick=\{\(\) => setActiveTab\('upload_secure'\)\}/g,
  `onClick={() => { setActiveTab('upload_secure'); setIsMobileMenuOpen(false); }}`
);
appCode = appCode.replace(
  /onClick=\{\(\) => setActiveTab\('validation_secure'\)\}/g,
  `onClick={() => { setActiveTab('validation_secure'); setIsMobileMenuOpen(false); }}`
);
appCode = appCode.replace(
  /onClick=\{\(\) => setActiveTab\('chat_secure'\)\}/g,
  `onClick={() => { setActiveTab('chat_secure'); setIsMobileMenuOpen(false); }}`
);

// 5. Hide End-to-End Encrypted badge on mobile to save header space
appCode = appCode.replace(
  /<span className="inline-flex items-center space-x-1\.5 px-3 py-1 rounded-full text-\[10px\] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">/,
  `<span className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">`
);

// 6. Fix header padding on mobile
appCode = appCode.replace(
  /<header className="glass-panel sticky top-0 px-8 py-5 flex items-center justify-between z-30 border-b border-elite-sand\/20">/,
  `<header className="glass-panel sticky top-0 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between z-30 border-b border-elite-sand/20">`
);

fs.writeFileSync('src/App.tsx', appCode);

// ---- FIXING SecureDocumentValidation.tsx for Mobile ----
let valCode = fs.readFileSync('src/components/documents/SecureDocumentValidation.tsx', 'utf8');

// The Validation page has a hardcoded layout grid that breaks mobile
valCode = valCode.replace(
  /<div className="grid grid-cols-12 gap-8 h-full min-h-\[800px\]">/,
  `<div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 h-full min-h-[800px]">`
);

// Sidebar of Validation (col-span-3) -> should be full width on mobile
valCode = valCode.replace(
  /<div className="col-span-3 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">/,
  `<div className="w-full lg:col-span-3 flex flex-col h-[400px] lg:h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4 lg:mb-0">`
);

// Main validation area (col-span-9)
valCode = valCode.replace(
  /<div className="col-span-9 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">/,
  `<div className="w-full lg:col-span-9 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[500px]">`
);

// Document Viewer Modal Width and Height
valCode = valCode.replace(
  /<div className="bg-white rounded-2xl shadow-premium w-full max-w-5xl h-\[85vh\] flex flex-col overflow-hidden relative"/,
  `<div className="bg-white rounded-2xl shadow-premium w-full md:max-w-5xl h-[95vh] md:h-[85vh] flex flex-col overflow-hidden relative"`
);

// Make Document header texts responsive inside viewer
valCode = valCode.replace(
  /<h3 className="font-bold font-serif">\{viewingDoc\.title\}<\/h3>/,
  `<h3 className="font-bold font-serif text-sm md:text-base truncate max-w-[200px] md:max-w-md">{viewingDoc.title}</h3>`
);

// Hide some Lucide icons on mobile inside the validation header
valCode = valCode.replace(
  /<span className="text-\[10px\] font-bold text-slate-400 uppercase tracking-widest mt-1">Nível de Acesso<\/span>/,
  `<span className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nível de Acesso</span>`
);

fs.writeFileSync('src/components/documents/SecureDocumentValidation.tsx', valCode);

// ---- FIXING KanbanBoard.tsx for Mobile ----
let kanbanCode = fs.readFileSync('src/components/kanban/KanbanBoard.tsx', 'utf8');

// Replace flex grid with block/flex-col on small screens
kanbanCode = kanbanCode.replace(
  /<div className="flex h-full space-x-6">/,
  `<div className="flex flex-col md:flex-row h-full space-y-6 md:space-y-0 md:space-x-6 pb-20 md:pb-0">`
);
// Make Kanban columns full width on mobile
kanbanCode = kanbanCode.replace(
  /className="w-80 flex-shrink-0 flex flex-col bg-slate-50\/50 rounded-2xl"/g,
  `className="w-full md:w-80 flex-shrink-0 flex flex-col bg-slate-50/50 rounded-2xl"`
);

fs.writeFileSync('src/components/kanban/KanbanBoard.tsx', kanbanCode);
