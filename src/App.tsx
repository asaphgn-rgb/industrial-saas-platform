import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { RoleGuard } from './guards/RoleGuard';

// Layouts
import Sidebar from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar'; // AQUI A CORREÇÃO (destructuring)

// Pages
import Login from './pages/auth/Login';
import AdminGlobalDashboard from './pages/dashboard/AdminGlobalDashboard';
import FederacaoDashboard from './pages/dashboard/FederacaoDashboard';
import AssociacaoDashboard from './pages/dashboard/AssociacaoDashboard';
import AssociadoDashboard from './pages/dashboard/AssociadoDashboard';
import CRMComercial from './pages/shared/CRMComercial';
import GestaoFederacoes from './pages/admin-global/GestaoFederacoes';
import GestaoProdutos from './pages/admin-global/GestaoProdutos';
import AuditoriaLogs from './pages/admin-global/AuditoriaLogs';
import MonitoramentoGlobal from './pages/admin-global/MonitoramentoGlobal';
import CartaoDashboard from './pages/cartao/CartaoDashboard';
import GestaoCartoes from './pages/cartao/GestaoCartoes';
import RedeParceiros from './pages/cartao/RedeParceiros';
import FaturasLiquidacao from './pages/cartao/FaturasLiquidacao';
import PoliticasRisco from './pages/cartao/PoliticasRisco';
import AntifraudeBacen from './pages/cartao/AntifraudeBacen';
import { CommunicationHub } from './components/secure-chat/CommunicationHub';
import FloatingAIAssistant from './components/assistant/FloatingAIAssistant';
import { useAuth } from './hooks/useAuth';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);

  const chatUser = user ? {
    id: user.id,
    name: user.email.split('@')[0].toUpperCase(),
    role: user.role,
    initials: user.role ? user.role.substring(0, 3) : 'USR',
    email: user.email,
  } : null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onToggleChat={() => setShowChat(!showChat)} isChatOpen={showChat} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 mt-20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Drawer de Comunicação Segura Criptografada B2B */}
      {showChat && chatUser && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[600px] lg:w-[750px] bg-slate-900 shadow-2xl border-l border-slate-700 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 text-white">
            <span className="font-bold text-sm tracking-wide flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Canal B2B Criptografado E2E
            </span>
            <button
              onClick={() => setShowChat(false)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Fechar ✕
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <CommunicationHub currentUser={chatUser} globalRoomId="morar-bem-brasil-global" />
          </div>
        </div>
      )}

      <FloatingAIAssistant />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas ADMIN_GLOBAL */}
        <Route
          path="/dashboard"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><AdminGlobalDashboard /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/crm"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><CRMComercial /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/federacoes"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><GestaoFederacoes /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/produtos"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><GestaoProdutos /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/auditoria"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><AuditoriaLogs /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/monitoramento"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><MonitoramentoGlobal /></AppLayout>
            </RoleGuard>
          }
        />

        {/* Rotas FEDERACAO */}
        <Route
          path="/federacao/dashboard"
          element={
            <RoleGuard allowedRoles={['FEDERACAO']}>
              <AppLayout><FederacaoDashboard /></AppLayout>
            </RoleGuard>
          }
        />

        {/* Rotas ASSOCIACAO */}
        <Route
          path="/associacao/dashboard"
          element={
            <RoleGuard allowedRoles={['ASSOCIACAO']}>
              <AppLayout><AssociacaoDashboard /></AppLayout>
            </RoleGuard>
          }
        />

        {/* Rotas ASSOCIADO */}
        <Route
          path="/associado/dashboard"
          element={
            <RoleGuard allowedRoles={['ASSOCIADO']}>
              <AppLayout><AssociadoDashboard /></AppLayout>
            </RoleGuard>
          }
        />

        {/* Rotas CARTÃO DIAMOND (Gestão Segregada & Independente) */}
        <Route
          path="/cartao"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO']}>
              <AppLayout><CartaoDashboard /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/cartao/gestao"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><GestaoCartoes /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/cartao/parceiros"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><RedeParceiros /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/cartao/faturas"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><FaturasLiquidacao /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/cartao/politicas-risco"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><PoliticasRisco /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/cartao/auditoria-antifraude"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><AntifraudeBacen /></AppLayout>
            </RoleGuard>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;
