import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleGuard from './guards/RoleGuard';

// Layouts
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

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
import CommunicationHub from './components/secure-chat/CommunicationHub';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <CommunicationHub />
    </div>
  );
}

function App() {
  return (
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

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
