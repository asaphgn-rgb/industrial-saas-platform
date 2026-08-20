import fs from 'fs';

let chatCode = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

const secEffect = `
  useEffect(() => {
    const handleBlur = () => setSecurityBlur(true);
    const handleFocus = () => setSecurityBlur(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey && e.key === '4')) {
        e.preventDefault();
        setSecurityBlur(true);
        setTimeout(() => setSecurityBlur(false), 3000);
      }
    };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
`;

chatCode = chatCode.replace(
  /useEffect\(\(\) => \{\n    fetchMessages\(\);\n  \}, \[roomId\]\);/,
  `useEffect(() => { fetchMessages(); }, [roomId]);\n${secEffect}`
);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', chatCode);
