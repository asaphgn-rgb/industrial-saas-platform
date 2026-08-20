import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// The logic was injected at the top of App, before currentUser state was declared.
// We need to move it below currentUser declaration, and fix the TS implicitly any error.

// Remover a injeção falha:
appContent = appContent.replace(/  \/\/ Timeout de 5 minutos[\s\S]*?\}, \[currentUser\]\);\n/m, '');

// Re-injetar após currentUser:
const sessionTimeoutLogic = `
  // Timeout de 5 minutos (300.000 ms) para deslogar por inatividade e auto-bloqueio se fechar a aba
  useEffect(() => {
    if (!currentUser) return;
    
    let inactivityTimer: any;
    
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

appContent = appContent.replace(
    `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);`,
    `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n${sessionTimeoutLogic}`
);

fs.writeFileSync('src/App.tsx', appContent);
