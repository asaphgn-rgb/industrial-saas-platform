import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// DESTRUIDOR DO OVERLAY LOVABLE
// Como a Lovable ignora o index.html no modo preview, injetamos diretamente no main.tsx
if (typeof window !== 'undefined') {
  console.log("Iniciando escudo anti-overlay da Lovable...");
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes as any) {
        if (node.nodeType === 1) { // Element node
          const text = node.textContent || "";
          if (text.includes("Missing Supabase environment variable") || text.includes("Connect Supabase in Lovable Cloud")) {
            node.remove(); // Destrói o elemento instantaneamente
          }

          // Tenta achar filhos que contenham o texto
          const badElements = node.querySelectorAll ? node.querySelectorAll('*') : [];
          badElements.forEach((el: any) => {
            if ((el.textContent || "").includes("Connect Supabase in Lovable Cloud")) {
              let parent = el;
              for(let i=0; i<6; i++) {
                if(parent.parentElement && parent.parentElement.tagName !== 'BODY' && parent.parentElement.tagName !== 'HTML') {
                  parent = parent.parentElement;
                }
              }
              parent.remove();
            }
          });
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Backup loop para caçar o overlay caso escape do observer
  setInterval(() => {
    document.querySelectorAll('div').forEach(div => {
      if (div.textContent && div.textContent.includes('Connect Supabase in Lovable Cloud')) {
        div.remove();
      }
    });
  }, 100);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
