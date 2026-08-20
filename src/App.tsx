import React, { useState } from 'react';
import {
  ShieldCheck,
  Factory,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity,
  FileText,
  UploadCloud,
  LayoutDashboard,
  MessageSquareLock,
  Lock,
  Search,
  Settings
} from 'lucide-react';
import { QmsNonConformanceModule } from './components/QmsNonConformanceModule';
import { IndustrialMesModule } from './components/IndustrialMesModule';
import { QmsDocumentModule } from './components/QmsDocumentModule';
import LogoUrl from '/logo-flecha.png';

// Novos módulos secretos
import { SecureUploadPage } from './components/documents/SecureUploadPage';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { SecureChat } from './components/secure-chat/SecureChat';
import { SecureDocumentValidation } from './components/documents/SecureDocumentValidation';
import { SecureLogin } from './components/auth/SecureLogin';
import { SecureAboutPage } from './components/documents/SecureAboutPage';
import { CeoAccessControl } from './components/admin/CeoAccessControl';

type TabType = 'dashboard' | 'qms' | 'mes' | 'documents' | 'upload_secure' | 'pipeline_secure' | 'chat_secure' | 'validation_secure';

import { useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pipeline_secure');




  // Mocks dos usuários para teste B2B
  const mockUsers = [
    { id: '22222222-2222-2222-2222-222222222222', name: 'Administrador (CEO)', role: 'Acesso Global & Master', initials: 'CEO' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Sócio / Auditor', role: 'Auditoria & Due Diligence', initials: 'AUD' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Investidor (Comprador)', role: 'Avaliação de Ativos', initials: 'INV' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Jurídico (Advogado)', role: 'Compliance & Contratos', initials: 'JUR' }
  ];
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Timeout de 5 minutos (300.000 ms) para deslogar por inatividade e auto-bloqueio se fechar a aba
  useEffect(() => {
    if (!currentUser) return;
    
    let inactivityTimer: any;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setCurrentUser(null);
        alert("Sessão expirada por inatividade (5 minutos) por motivo de segurança. O cofre está trancado, faça o login novamente para reaver seus arquivos.");
      }, 5 * 60 * 1000);
    };

    // Limpa chat e dados quando a página for fechada ou recarregada (Zero Trace)
    const handleBeforeUnload = () => {
       // Zero-Trace amenizado: Mantemos o cofre e o histórico da sala para demonstração colaborativa.
       // Não destrói B2B_MOCK_VAULT e nem B2B_MOCK_CHAT no refresh
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


  const currentTenantId = 'tenant-industrial-demo-uuid';
  const currentUnitId = 'unit-sp-planta-01-uuid';

  const demoBoardId = '00000000-0000-0000-0000-000000000001';
  const demoRoomId = '11111111-1111-1111-1111-111111111111';

  if (!currentUser) return <SecureLogin onLogin={setCurrentUser} mockUsers={mockUsers} />;

  return (
    <div className="min-h-screen bg-fbsb-bg-main text-fbsb-text-primary flex flex-col font-sans">

      {/* Top Header - Estilo Premium Light para acomodar a Logo Naturalmente */}
      <header className="sticky top-0 px-4 md:px-8 py-4 flex items-center justify-between z-30 border-b border-white/5 bg-fbsb-bg-deep/95 backdrop-blur-2xl shadow-premium">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            className="md:hidden p-2 text-fbsb-text-primary hover:text-fbsb-cyan focus:outline-none transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <div className="flex items-center">
             <div className="flex items-center justify-center mr-6"><img src={LogoUrl} alt="FLECHA BSB Logo" className="h-16 md:h-24 w-auto object-contain scale-125 origin-left" /></div>
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] uppercase tracking-widest text-fbsb-text-muted font-bold mt-0.5 ml-4">Ambiente Restrito: <span className="text-fbsb-cyan">{currentUser.currentFolder || 'COFRE GERAL'}</span></p>
          </div>
        </div>


        <div className="flex items-center space-x-6 relative">
          <div className="flex flex-col items-end">
             <span className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-fbsb-surface-200 text-fbsb-text-secondary border border-fbsb-border">
               <Lock className="w-3 h-3" />
               <span>End-to-End Encrypted</span>
             </span>
          </div>
          <div className="flex items-center space-x-3 pl-0 md:pl-6 md:border-l border-fbsb-border relative">

             {/* Componente de Switch de Usuário (Demonstração B2B) */}
             <div className="relative">
               <div
                 className="flex items-center space-x-3 cursor-pointer group"
                 onClick={() => setShowUserMenu(!showUserMenu)}
               >
                 <div className="text-right hidden md:block">
                   <p className="text-xs font-bold text-fbsb-text-secondary">{currentUser.name}</p>
                   <p className="text-[10px] text-fbsb-text-secondary font-semibold uppercase">{currentUser.role}</p>
                 </div>
                 <div className="h-10 w-10 bg-gradient-to-br from-fbsb-primary to-slate-800 rounded-full flex items-center justify-center shadow-inner-gold transform group-hover:scale-105 transition-transform border-2 border-fbsb-cyan">
                   <span className="text-sm font-bold text-fbsb-cyan">{currentUser.initials}</span>
                 </div>
               </div>

               {/* Dropdown de Login Swap */}
               {showUserMenu && (
                 <div className="absolute right-0 mt-3 w-56 bg-fbsb-surface-100 rounded-xl shadow-premium border border-fbsb-border overflow-hidden z-50">
                    <div className="px-4 py-3 bg-fbsb-surface-200 border-b border-fbsb-border">
                       <p className="text-[10px] uppercase font-bold text-fbsb-text-secondary tracking-wider">Conta do Usuário</p>
                    </div>
                    <div className="p-2 space-y-1">
  <button
    onClick={() => {
      // Limpeza de Chat Temporário exigida na regra de negócios da FLECHA BSB
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('B2B_MOCK_CHAT_')) {
          localStorage.removeItem(key);
        }
      });
      setCurrentUser(null);
    }}
    className="w-full flex items-center justify-center p-3 rounded-lg transition-colors text-center text-fbsb-text-secondary hover:bg-fbsb-surface-200 hover:text-fbsb-text-secondary border border-transparent font-bold text-xs"
  >
     Encerrar Sessão (Log out)
  </button>
</div>
</div>
)}
             </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar - Estilo Clean Luxury */}
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-fbsb-surface-200/50 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        
        <aside className={`
          fixed md:relative top-0 left-0 h-full z-50 md:z-10
          w-72 bg-fbsb-bg-main border-r border-white/5 p-6 flex flex-col space-y-8 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)]
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>

          {/* Sessão: Módulos Seguros */}
          <div>
            <h3 className="text-[10px] font-bold text-fbsb-text-secondary uppercase tracking-[0.2em] mb-4 pl-2">Due Diligence</h3>
            <div className="space-y-1.5">

              {currentUser?.initials === 'CEO' && (
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                    activeTab === 'dashboard'
                      ? 'bg-fbsb-surface-100 text-white font-bold shadow-glow-cyan border border-fbsb-cyan/30'
                      : 'text-fbsb-text-primary font-medium hover:bg-fbsb-surface-200 hover:text-white'
                  }`}
                >
                  <Activity className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-fbsb-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'text-fbsb-text-secondary'}`} />
                  <span className="tracking-wide text-fbsb-cyan font-bold">Painel Diretivo (CEO)</span>
                </button>
              )}

              <button
                onClick={() => { setActiveTab('pipeline_secure'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                  activeTab === 'pipeline_secure'
                    ? 'bg-fbsb-surface-100 text-white font-bold shadow-glow-cyan border border-fbsb-cyan/30'
                    : 'text-fbsb-text-primary font-medium hover:bg-fbsb-surface-200 hover:text-white'
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 ${activeTab === 'pipeline_secure' ? 'text-fbsb-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'text-fbsb-primary-light'}`} />
                <span className="tracking-wide">Sobre a FLECHA BSB</span>
              </button>

              <button
                onClick={() => { setActiveTab('upload_secure'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                  activeTab === 'upload_secure'
                    ? 'bg-fbsb-surface-100 text-white font-bold shadow-glow-cyan border border-fbsb-cyan/30'
                    : 'text-fbsb-text-primary font-medium hover:bg-fbsb-surface-200 hover:text-white'
                }`}
              >
                <UploadCloud className={`w-5 h-5 ${activeTab === 'upload_secure' ? 'text-fbsb-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'text-fbsb-primary-light'}`} />
                <span className="tracking-wide">Dossiê Documental</span>
              </button>

              <button
                onClick={() => { setActiveTab('validation_secure'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                  activeTab === 'validation_secure'
                    ? 'bg-fbsb-surface-100 text-white font-bold shadow-glow-cyan border border-fbsb-cyan/30'
                    : 'text-fbsb-text-primary font-medium hover:bg-fbsb-surface-200 hover:text-white'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${activeTab === 'validation_secure' ? 'text-fbsb-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'text-fbsb-primary-light'}`} />
                <span className="tracking-wide">Validação & Aceite</span>
              </button>

              <button
                onClick={() => { setActiveTab('chat_secure'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                  activeTab === 'chat_secure'
                    ? 'bg-fbsb-surface-100 text-white font-bold shadow-glow-cyan border border-fbsb-cyan/30'
                    : 'text-fbsb-text-primary font-medium hover:bg-fbsb-surface-200 hover:text-white'
                }`}
              >
                <MessageSquareLock className={`w-5 h-5 ${activeTab === 'chat_secure' ? 'text-fbsb-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'text-fbsb-primary-light'}`} />
                <span className="flex-1 text-left tracking-wide">Canais Criptografados</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'chat_secure' ? 'bg-fbsb-surface-100 text-fbsb-text-primary border border-fbsb-border' : 'bg-fbsb-cyan text-[#03090F]'}`}>3</span>
              </button>
            </div>
          </div>

          </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-fbsb-bg-deep relative">
          {/* Módulos Novos - Ambiente Secreto */}
          {activeTab === 'pipeline_secure' && (<div className="absolute inset-0 bg-fbsb-bg-main overflow-y-auto"><SecureAboutPage /></div>)}


          {activeTab === 'upload_secure' && (
            <div className="p-4 md:p-12 max-w-7xl mx-auto h-full overflow-y-auto">
               <SecureUploadPage onUploadComplete={() => setActiveTab('validation_secure')} currentUser={currentUser} />
            </div>
          )}

          {activeTab === 'validation_secure' && (
            <div className="p-4 md:p-12 max-w-[1600px] mx-auto min-h-full">
               <SecureDocumentValidation currentUser={currentUser} />
            </div>
          )}

          {activeTab === 'chat_secure' && (
            <div className="p-4 md:p-8 h-full">
               <SecureChat roomId={demoRoomId} currentUserId={currentUser.id} currentUserRole={currentUser.role} currentUserName={currentUser.name} />
            </div>
          )}

          {/* Módulos Antigos - Dashboard e SGQ */}
          {activeTab === 'dashboard' && (
            <div className="p-4 md:p-8 space-y-6">
              {/* Controles de Acesso (RBAC) */}
              <CeoAccessControl currentTenantId={currentTenantId} />

              <div className="pt-8 border-t border-white/10 mt-8">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-fbsb-text-secondary mb-6 flex items-center">
                   <Activity className="w-4 h-4 mr-2" /> Painel de KPIs Globais
                 </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-fbsb-surface-100 border border-fbsb-border rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-semibold text-fbsb-text-secondary uppercase tracking-wider">OEE Global Fabril</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-fbsb-text-secondary">86.4%</span>
                    <span className="text-xs text-fbsb-text-secondary font-medium">+2.1% vs meta</span>
                  </div>
                  <div className="mt-4 w-full bg-fbsb-surface-200 rounded-full h-1.5">
                    <div className="bg-fbsb-surface-200 h-1.5 rounded-full" style={{ width: '86.4%' }}></div>
                  </div>
                </div>

                <div className="bg-fbsb-surface-100 border border-fbsb-border rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-semibold text-fbsb-text-secondary uppercase tracking-wider">Não Conformidades Abertas</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-fbsb-text-secondary">2</span>
                    <span className="text-xs text-fbsb-text-secondary font-medium">Ciclo CAPA ativo</span>
                  </div>
                  <div className="mt-4 text-xs text-fbsb-text-secondary">1 em investigação • 1 em verificação</div>
                </div>

                <div className="bg-fbsb-surface-100 border border-fbsb-border rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-semibold text-fbsb-text-secondary uppercase tracking-wider">Ordens em Produção</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-fbsb-text-secondary">14</span>
                    <span className="text-xs text-blue-600 font-medium">100% no prazo</span>
                  </div>
                  <div className="mt-4 text-xs text-fbsb-text-secondary">Células CNC 01, Injeção 03 e Montagem</div>
                </div>
              </div>

              <div className="bg-fbsb-surface-200 border border-fbsb-border rounded-xl p-6 text-fbsb-text-primary shadow-md">
                <h3 className="text-base font-semibold flex items-center">
                  <ShieldCheck className="w-5 h-5 text-fbsb-text-secondary mr-2" />
                  Conexão Operacional Multi-Tenant
                </h3>
                <p className="text-sm text-fbsb-text-secondary mt-2 leading-relaxed">
                  Ambiente conectado ao Supabase DEV, banco PostgreSQL com políticas de RLS extremo e trilha de auditoria imutável ativa.
                  Todos os módulos de segurança e gestão industrial operam isolados neste Tenant.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'qms' && (
            <div className="p-8">
              <QmsNonConformanceModule tenantId={currentTenantId} unitId={currentUnitId} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}