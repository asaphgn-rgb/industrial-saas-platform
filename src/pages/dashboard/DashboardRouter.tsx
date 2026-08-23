import { useAuth } from '@/hooks/useAuth';
import AdminGlobalDashboard from './AdminGlobalDashboard';
import FederacaoDashboard from './FederacaoDashboard';
import AssociacaoDashboard from './AssociacaoDashboard';
import AssociadoDashboard from './AssociadoDashboard';

export default function DashboardRouter() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'ADMIN_GLOBAL':
      return <AdminGlobalDashboard />;
    case 'FEDERACAO':
      return <FederacaoDashboard />;
    case 'ASSOCIACAO':
      return <AssociacaoDashboard />;
    case 'ASSOCIADO':
      return <AssociadoDashboard />;
    default:
      return <div>Perfil não identificado ou carregando...</div>;
  }
}
