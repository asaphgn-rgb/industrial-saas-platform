import fs from 'fs';

// 1. Inserir timeout e auto-logout no App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const sessionTimeoutLogic = `
  // Timeout de 5 minutos (300.000 ms) para deslogar por inatividade e auto-bloqueio se fechar a aba
  useEffect(() => {
    if (!currentUser) return;
    
    let inactivityTimer;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Limpeza Zero-Trace e Logout
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('B2B_MOCK_CHAT_') || key.startsWith('B2B_MOCK_VAULT')) {
            localStorage.removeItem(key);
          }
        });
        setCurrentUser(null);
        alert("Sessão expirada por inatividade (5 minutos) por motivo de segurança.");
      }, 5 * 60 * 1000);
    };

    // Limpa chat e dados quando a página for fechada ou recarregada (Zero Trace)
    const handleBeforeUnload = () => {
       Object.keys(localStorage).forEach(key => {
         if (key.startsWith('B2B_MOCK_CHAT_') || key.startsWith('B2B_MOCK_VAULT')) {
           localStorage.removeItem(key);
         }
       });
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser]);
`;

if(!appContent.includes('const resetTimer = () => {')) {
   appContent = appContent.replace(
      "export default function App() {\n  const [activeTab, setActiveTab] = useState<TabType>('pipeline_secure');",
      `import { useEffect } from 'react';\n\nexport default function App() {\n  const [activeTab, setActiveTab] = useState<TabType>('pipeline_secure');\n\n${sessionTimeoutLogic}`
   );
   fs.writeFileSync('src/App.tsx', appContent);
}

