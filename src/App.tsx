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
    <div className="min-h-screen bg-elite-paper text-elite-navy flex flex-col font-sans">
      {/* Top Header - Estilo Premium Glassmorphism */}
      <header className="glass-panel sticky top-0 px-8 py-5 flex items-center justify-between z-30 border-b border-elite-sand/20">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-elite-navy to-slate-800 p-2.5 rounded-xl text-elite-gold shadow-premium">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-elite-navy">Vault <span className="font-light text-slate-500">| B2B Intelligence</span></h1>
            <p className="text-[11px] uppercase tracking-widest text-elite-sand font-semibold mt-0.5">Ambiente Altamente Restrito</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm">
           <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Pesquisar no cofre..." className="pl-9 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-elite-gold focus:bg-white w-64 transition-all" />
           </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-end">
             <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
               <Lock className="w-3 h-3" />
               <span>End-to-End Encrypted</span>
             </span>
          </div>
          <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
             <button className="text-slate-400 hover:text-elite-navy transition-colors">
               <Settings className="w-5 h-5" />
             </button>
             <div className="h-10 w-10 bg-gradient-to-br from-elite-navy to-slate-800 rounded-full flex items-center justify-center shadow-inner-gold cursor-pointer transform hover:scale-105 transition-transform">
               <span className="text-sm font-bold text-elite-gold">FA</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Estilo Clean Luxury */}
        <aside className="w-72 bg-elite-white border-r border-elite-sand/20 p-6 flex flex-col space-y-8 overflow-y-auto z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

          {/* Sessão: Módulos Seguros */}
          <div>
            <h3 className="text-[10px] font-bold text-elite-sand uppercase tracking-[0.2em] mb-4 pl-2">Due Diligence</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveTab('pipeline_secure')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'pipeline_secure'
                    ? 'bg-elite-navy text-white shadow-premium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-elite-navy'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'pipeline_secure' ? 'text-elite-gold' : 'text-slate-400'}`} />
                <span className="tracking-wide">Pipeline Estratégico</span>
              </button>

              <button
                onClick={() => setActiveTab('upload_secure')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'upload_secure'
                    ? 'bg-elite-navy text-white shadow-premium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-elite-navy'
                }`}
              >
                <UploadCloud className={`w-4 h-4 ${activeTab === 'upload_secure' ? 'text-elite-gold' : 'text-slate-400'}`} />
                <span className="tracking-wide">Dossiê Documental</span>
              </button>

              <button
                onClick={() => setActiveTab('chat_secure')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'chat_secure'
                    ? 'bg-elite-navy text-white shadow-premium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-elite-navy'
                }`}
              >
                <MessageSquareLock className={`w-4 h-4 ${activeTab === 'chat_secure' ? 'text-elite-gold' : 'text-slate-400'}`} />
                <span className="flex-1 text-left tracking-wide">Canais Criptografados</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'chat_secure' ? 'bg-white text-elite-navy' : 'bg-elite-gold text-white'}`}>3</span>
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-elite-sand/30 to-transparent"></div>

          {/* Sessão: Módulos Industriais Standard */}
          <div>
            <h3 className="text-[10px] font-bold text-elite-sand uppercase tracking-[0.2em] mb-4 pl-2">Operacional & ISO 9001</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <Activity className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-slate-300' : 'text-slate-400'}`} />
                <span>Analytics & OEE</span>
              </button>
              <button
                onClick={() => setActiveTab('qms')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'qms' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${activeTab === 'qms' ? 'text-slate-300' : 'text-slate-400'}`} />
                <span>Gestão CAPA</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-elite-paper relative">
          {/* Módulos Novos - Ambiente Secreto */}
          {activeTab === 'pipeline_secure' && (
            <div className="absolute inset-0">
               <KanbanBoard boardId={demoBoardId} />
            </div>
          )}

          {activeTab === 'upload_secure' && (
            <div className="p-8 md:p-12 max-w-7xl mx-auto">
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

        </main>
      </div>
    </div>
  );
}