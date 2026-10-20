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
import LivroRazaoContabil from './pages/admin-global/LivroRazaoContabil';
import FechamentoContabil from './pages/admin-global/FechamentoContabil';
import ParceriasCoBranded from './pages/admin-global/ParceriasCoBranded';
import ParticipacaoResultadosRede from './pages/federacao/ParticipacaoResultadosRede';
import AdesaoCashbackOnboarding from './pages/associado/AdesaoCashbackOnboarding';
import RadarImoveisDesejados from './pages/associado/RadarImoveisDesejados';
import ContaDigitalCartaoApp from './pages/associado/ContaDigitalCartaoApp';
import CartaoDashboard from './pages/cartao/CartaoDashboard';
import GestaoCartoes from './pages/cartao/GestaoCartoes';
import RedeParceiros from './pages/cartao/RedeParceiros';
import FaturasLiquidacao from './pages/cartao/FaturasLiquidacao';
import PoliticasRisco from './pages/cartao/PoliticasRisco';
import AntifraudeBacen from './pages/cartao/AntifraudeBacen';
import CartaoVirtual from './pages/cartao/CartaoVirtual';
import SimuladorParcelamento from './pages/cartao/SimuladorParcelamento';
import PortalLojista from './pages/cartao/PortalLojista';
import CashbackMoradia from './pages/cartao/CashbackMoradia';
import EspelhoUnidades from './pages/habitacional/EspelhoUnidades';
import FilaSocialScoring from './pages/habitacional/FilaSocialScoring';
import GestaoContratosDigitais from './pages/habitacional/GestaoContratosDigitais';
import SimuladorCreditoSantander from './pages/habitacional/SimuladorCreditoSantander';

// Suíte DYAMOND - Ecossistema Financeiro e de Benefícios
import CentralOperacoes from './pages/dyamond/CentralOperacoes';
import Carteira360 from './pages/dyamond/Carteira360';
import ProdutosOfertas from './pages/dyamond/ProdutosOfertas';
import MarketplaceDyamond from './pages/dyamond/MarketplaceDyamond';
import BeneficiosClube from './pages/dyamond/BeneficiosClube';
import FinanceiroAPI from './pages/dyamond/FinanceiroAPI';
import AprovacoesEsteira from './pages/dyamond/AprovacoesEsteira';
import AtendimentoOmnichannel from './pages/dyamond/AtendimentoOmnichannel';
import RelatoriosEstrategicos from './pages/dyamond/RelatoriosEstrategicos';
import GovernancaControle from './pages/dyamond/GovernancaControle';

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

        {/* Rotas Suíte DYAMOND (10 Módulos Oficiais) */}
        <Route
          path="/dashboard"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><CentralOperacoes /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/carteira-360"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><Carteira360 /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/produtos-ofertas"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><ProdutosOfertas /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/marketplace"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><MarketplaceDyamond /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/beneficios"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><BeneficiosClube /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/financeiro-api"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><FinanceiroAPI /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/aprovacoes"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><AprovacoesEsteira /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/atendimento"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><AtendimentoOmnichannel /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/relatorios"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><RelatoriosEstrategicos /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/governanca"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><GovernancaControle /></AppLayout>
            </RoleGuard>
          }
        />

        {/* Rotas ADMIN_GLOBAL Adicionais */}
        <Route
          path="/admin/dashboard-global"
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
        <Route
          path="/admin/livro-razao"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><LivroRazaoContabil /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/fechamento-contabil"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><FechamentoContabil /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/parcerias-cobranded"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL']}>
              <AppLayout><ParceriasCoBranded /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/espelho-vendas"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO']}>
              <AppLayout><EspelhoUnidades /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/fila-social"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO']}>
              <AppLayout><FilaSocialScoring /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/contratos"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><GestaoContratosDigitais /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/admin/simulador-santander"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><SimuladorCreditoSantander /></AppLayout>
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
        <Route
          path="/federacao/participacao-resultados"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO']}>
              <AppLayout><ParticipacaoResultadosRede /></AppLayout>
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
        <Route
          path="/associado/adesao-cashback"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><AdesaoCashbackOnboarding /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/associado/radar-imoveis"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><RadarImoveisDesejados /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/associado/cartao-digital"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><ContaDigitalCartaoApp /></AppLayout>
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
        <Route
          path="/cartao/virtual"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><CartaoVirtual /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/cartao/simulador-parcelamento"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><SimuladorParcelamento /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/cartao/portal-lojista"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO']}>
              <AppLayout><PortalLojista /></AppLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/cartao/cashback-moradia"
          element={
            <RoleGuard allowedRoles={['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']}>
              <AppLayout><CashbackMoradia /></AppLayout>
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
