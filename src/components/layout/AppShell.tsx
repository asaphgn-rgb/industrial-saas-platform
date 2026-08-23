import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import FloatingAIAssistant from '@/components/assistant/FloatingAIAssistant';
import { useAuth } from '@/hooks/useAuth';

export function AppShell() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <Sidebar />
      <div className="p-4 sm:ml-64 sm:p-6 mt-16 pb-24">
        <main className="mx-auto max-w-7xl">
          <Outlet />
        </main>
      </div>
      
      {/* Módulo de IA Injetado Globalmente para Usuários Logados */}
      <FloatingAIAssistant />
    </div>
  );
}
