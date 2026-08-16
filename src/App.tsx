import React, { useState } from 'react';
import { Shield, Factory, CheckCircle2, AlertTriangle, Layers, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'qms' | 'mes'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Factory className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SaaS Industrial & SGQ ISO 9001</h1>
            <p className="text-xs text-slate-400">Plataforma Multi-Tenant Enterprise • ISA-95</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-3.5 h-3.5 mr-1" /> RLS Ativo
          </span>
          <span className="text-xs text-slate-400">Ambiente: <strong className="text-slate-200">DEV (São Paulo)</strong></span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 p-4 flex flex-col space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Painel Geral & OEE</span>
          </button>
          <button
            onClick={() => setActiveTab('qms')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'qms' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>SGQ & ISO 9001</span>
          </button>
          <button
            onClick={() => setActiveTab('mes')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'mes' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Ordens & Chão de Fábrica</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OEE Global Fabril</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-white">86.4%</span>
                    <span className="text-xs text-emerald-400 font-medium">+2.1% vs meta</span>
                  </div>
                  <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '86.4%' }}></div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Não Conformidades Abertas</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-white">2</span>
                    <span className="text-xs text-amber-400 font-medium">Ciclo CAPA ativo</span>
                  </div>
                  <div className="mt-4 text-xs text-slate-400">1 em investigação • 1 em ação preventiva</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ordens em Produção</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-white">14</span>
                    <span className="text-xs text-blue-400 font-medium">100% no prazo</span>
                  </div>
                  <div className="mt-4 text-xs text-slate-400">Células CNC 01, Injeção 03 e Montagem</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-base font-semibold text-white">Conexão com Lovable e Supabase DEV</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Este projeto está integrado via GitHub, com banco PostgreSQL na região de São Paulo, políticas de RLS e trilha de auditoria imutável ISO 9001.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'qms' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white">Módulo SGQ & Gestão ISO 9001</h3>
              <p className="text-sm text-slate-400 mt-1">Controle de Documentos (Cláusula 7.5) e Gestão de Não Conformidades (Cláusulas 8.7/10.2).</p>
            </div>
          )}

          {activeTab === 'mes' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white">Módulo MES & Controle de Chão de Fábrica</h3>
              <p className="text-sm text-slate-400 mt-1">Apontamentos em tempo real, gestão de centros de trabalho e ordens de produção (ISA-95).</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
