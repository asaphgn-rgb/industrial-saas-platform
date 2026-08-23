import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/authService';

// Layout & Guards
import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/guards/RoleGuard';

// Pages
import Login from '@/pages/auth/Login';
import DashboardRouter from '@/pages/dashboard/DashboardRouter';
import MonitoramentoGlobal from '@/pages/admin-global/MonitoramentoGlobal';
import GestaoProdutos from '@/pages/admin-global/GestaoProdutos';
import CadastroMultiStep from '@/pages/associado/cadastro/CadastroMultiStep';
import VitrineProdutos from '@/pages/associado/produtos/VitrineProdutos';
import PastaDigital from '@/pages/associado/pasta-digital/PastaDigital';
import CRMComercial from '@/pages/shared/CRMComercial';

function App() {
  const { setUser, setLoading } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      const { user } = await authService.getSession();
      setUser(user);
    };
    initAuth();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        
        <Route element={<RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}><AppShell /></RoleGuard>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO']}><AppShell /></RoleGuard>}>
          <Route path="/crm" element={<CRMComercial />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['ADMIN_GLOBAL']}><AppShell /></RoleGuard>}>
          <Route path="/admin-global/monitoramento" element={<MonitoramentoGlobal />} />
          <Route path="/admin-global/produtos" element={<GestaoProdutos />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['ASSOCIADO']}><AppShell /></RoleGuard>}>
          <Route path="/associado/cadastro" element={<CadastroMultiStep />} />
          <Route path="/associado/produtos" element={<VitrineProdutos />} />
          <Route path="/associado/pasta-digital" element={<PastaDigital />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
