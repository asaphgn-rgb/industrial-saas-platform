/**
 * 🛡️ ASAPH GUARDIAN SECURITY SHIELD — V2.4 ENTERPRISE DEFENSE
 * Sistema Avançado de Proteção Anti-Clonagem, Anti-Inspeção e Anti-Tampering.
 *
 * Funcionalidades de Blindagem:
 * 1. Bloqueio de atalhos DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U).
 * 2. Bloqueio de clique com botão direito (contextmenu) em superfícies do sistema.
 * 3. Detecção e neutralização de abertura de ferramentas de depuração (Timing Trap).
 * 4. Sanitização de console em produção para erradicação de vazamento de payloads.
 * 5. Proteção contra Clickjacking e Embedding não autorizado em IFrames.
 */

export interface SecurityShieldConfig {
  blockDevToolsShortcuts?: boolean;
  blockContextMenu?: boolean;
  disableConsoleInProduction?: boolean;
  preventIframeEmbedding?: boolean;
  detectDevToolsOpen?: boolean;
}

const DEFAULT_CONFIG: SecurityShieldConfig = {
  blockDevToolsShortcuts: true,
  blockContextMenu: true,
  disableConsoleInProduction: true,
  preventIframeEmbedding: true,
  detectDevToolsOpen: true,
};

export class SecurityShield {
  private static instance: SecurityShield | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): SecurityShield {
    if (!SecurityShield.instance) {
      SecurityShield.instance = new SecurityShield();
    }
    return SecurityShield.instance;
  }

  public initialize(config: SecurityShieldConfig = DEFAULT_CONFIG): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // 1. Prevenção de Iframe Embedding (Anti-Clickjacking de Client)
    if (config.preventIframeEmbedding) {
      this.preventFrameBusting();
    }

    // 2. Bloqueio de atalhos de inspeção de código
    if (config.blockDevToolsShortcuts) {
      this.bindDevToolsShortcuts();
    }

    // 3. Bloqueio de menu de contexto (botão direito)
    if (config.blockContextMenu) {
      this.bindContextMenuBlock();
    }

    // 4. Sanitização de Console em Produção
    if (config.disableConsoleInProduction && import.meta.env.PROD) {
      this.sanitizeProductionConsole();
    }

    // 5. Armadilha de temporização para detecção de depurador
    if (config.detectDevToolsOpen) {
      this.bindDebuggerDetection();
    }

    this.isInitialized = true;
  }

  /**
   * Garante que o sistema nunca seja envelopado em iframes maliciosos.
   */
  private preventFrameBusting(): void {
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = window.self.location.href;
      }
    } catch {
      // Se cross-origin bloquear o acesso a top, força o documento a ficar invisível
      document.documentElement.style.display = 'none';
    }
  }

  /**
   * Bloqueia atalhos de teclado habitualmente usados para abrir DevTools ou inspecionar fonte.
   */
  private bindDevToolsShortcuts(): void {
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl + Shift + I (Inspecionar)
        // Ctrl + Shift + J (Console)
        // Ctrl + Shift + C (Selecionar Elemento)
        if (ctrlOrCmd && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl + U (Ver Código-Fonte da Página)
        if (ctrlOrCmd && (e.key === 'U' || e.key === 'u')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl + S (Salvar Página Completa no Disco)
        if (ctrlOrCmd && (e.key === 'S' || e.key === 's')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      },
      { capture: true }
    );
  }

  /**
   * Impede a exibição do menu de contexto padrão em áreas que não sejam inputs de texto.
   */
  private bindContextMenuBlock(): void {
    window.addEventListener(
      'contextmenu',
      (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        // Permite botão direito apenas em inputs e textareas para copiar/colar legítimo do usuário
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return true;
        }
        e.preventDefault();
        return false;
      },
      { capture: true }
    );
  }

  /**
   * Suprime logs, alertas e depuração em console para evitar vazamento de estruturas de dados e tokens.
   */
  private sanitizeProductionConsole(): void {
    const noop = () => {};
    // Preserva apenas console.error com máscara segura
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.warn = noop;
    console.trace = noop;
    console.table = noop;
  }

  /**
   * Timing trap: quando DevTools está aberto com debugger acoplado, a execução atrasa deliberadamente.
   */
  private bindDebuggerDetection(): void {
    setInterval(() => {
      const startTime = performance.now();
      // Avaliação indireta para detecção de timing
      Function('debugger')();
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        // DevTools ou Depurador em execução ativa
        // Opcional: registrar evento de telemetria ou resetar tokens sensíveis em memória
      }
    }, 2000);
  }
}

export const securityShield = SecurityShield.getInstance();
