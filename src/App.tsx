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
  MessageSquareLock
} from 'lucide-react';
import { QmsNonConformanceModule } from './components/QmsNonConformanceModule';
import { IndustrialMesModule } from './components/IndustrialMesModule';
import { QmsDocumentModule } from './components/QmsDocumentModule';

// Novos módulos secretos
import { SecureUploadPage } from './components/documents/SecureUploadPage';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { SecureChat } from './components/secure-chat/SecureChat';

type TabType = 'dashboard' | 'qms' | 'mes' | 'documents' | 'upload_secure' | 'pipeline_secure' | 'chat_secure';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pipeline_secure');

  const currentTenantId = 'tenant-industrial-demo-uuid';
  const currentUnitId = 'unit-sp-planta-01-uuid';

  const demoBoardId = '00000000-0000-0000-0000-000000000001';
  const demoRoomId = '11111111-1111-1111-1111-111111111111';
  const demoUserId = '22222222-2222-2222-2222-222222222222';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between shadow-sm z-20 relative">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 p-2.5 rounded-lg text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Cofre de Negociações & SGQ</h1>
            <p className="text-xs text-slate-500 font-medium">Ambiente Restrito e Auditável (ISO 9001)</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Blindagem Ativa (RLS)
          </span>
          <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center border border-slate-300">
            <span className="text-sm font-bold text-slate-600">FA</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white p-4 flex flex-col space-y-6 overflow-y-auto z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

          {/* Sessão: Módulos Seguros */}
          <div>
            <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ambiente Restrito</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('pipeline_secure')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'pipeline_secure' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'pipeline_secure' ? 'text-emerald-100' : 'text-slate-400'}`} />
                <span>Pipeline de Negociações</span>
              </button>

              <button
                onClick={() => setActiveTab('upload_secure')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'upload_secure' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UploadCloud className={`w-4 h-4 ${activeTab === 'upload_secure' ? 'text-emerald-100' : 'text-slate-400'}`} />
                <span>Cofre Digital (Upload)</span>
              </button>

              <button
                onClick={() => setActiveTab('chat_secure')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'chat_secure' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <MessageSquareLock className={`w-4 h-4 ${activeTab === 'chat_secure' ? 'text-emerald-100' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">Canais Seguros</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
              </button>
            </div>
          </div>

          {/* Sessão: Módulos Industriais Standard */}
          <div>
            <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fábrica & Qualidade</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Activity className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-blue-100' : 'text-slate-400'}`} />
                <span>Painel Geral & OEE</span>
              </button>
              <button
                onClick={() => setActiveTab('qms')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'qms' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${activeTab === 'qms' ? 'text-blue-100' : 'text-slate-400'}`} />
                <span>SGQ & Ciclo CAPA</span>
              </button>
              <button
                onClick={() => setActiveTab('mes')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'mes' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Layers className={`w-4 h-4 ${activeTab === 'mes' ? 'text-blue-100' : 'text-slate-400'}`} />
                <span>Terminal MES</span>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'documents' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FileText className={`w-4 h-4 ${activeTab === 'documents' ? 'text-blue-100' : 'text-slate-400'}`} />
                <span>Docs SGQ (Públicos)</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {/* Módulos Novos - Ambiente Secreto */}
          {activeTab === 'pipeline_secure' && (
            <div className="absolute inset-0">
               <KanbanBoard boardId={demoBoardId} />
            </div>
          )}

          {activeTab === 'upload_secure' && (
            <div className="p-8">
               <SecureUploadPage />
            </div>
          )}

          {activeTab === 'chat_secure' && (
            <div className="p-8 h-full">
               <SecureChat roomId={demoRoomId} currentUserId={demoUserId} />
            </div>
          )}


          {/* Módulos Antigos - Dashboard e SGQ */}
          {activeTab === 'dashboard' && (
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">OEE Global Fabril</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-slate-900">86.4%</span>
                    <span className="text-xs text-emerald-600 font-medium">+2.1% vs meta</span>
                  </div>
                  <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '86.4%' }}></div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Não Conformidades Abertas</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-slate-900">2</span>
                    <span className="text-xs text-amber-600 font-medium">Ciclo CAPA ativo</span>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">1 em investigação • 1 em verificação</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ordens em Produção</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-slate-900">14</span>
                    <span className="text-xs text-blue-600 font-medium">100% no prazo</span>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">Células CNC 01, Injeção 03 e Montagem</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-md">
                <h3 className="text-base font-semibold flex items-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mr-2" />
                  Conexão Operacional Multi-Tenant
                </h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
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

          {activeTab === 'mes' && (
             <div className="p-8">
              <IndustrialMesModule tenantId={currentTenantId} unitId={currentUnitId} />
             </div>
          )}

          {activeTab === 'documents' && (
            <div className="p-8">
              <QmsDocumentModule tenantId={currentTenantId} unitId={currentUnitId} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}