import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  Eye,
  Key,
  Clock,
  Download,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Database,
  Building2,
  Cpu
} from 'lucide-react';

export const GovernanceView: React.FC = () => {
  const [selectedAuditFilter, setSelectedAuditFilter] = useState('all');
  const [searchAudit, setSearchAudit] = useState('');

  const auditEvents = [
    {
      id: 'AUD-98214',
      timestamp: '14/05/2025 10:24:18',
      actor: 'Fabiano Asaph (Gerente Sênior)',
      action: 'Aprovação de Alçada de Crédito',
      target: 'Proposta #DM-8421 (Metalúrgica Horizonte)',
      ip: '189.40.12.88',
      status: 'Sucesso',
      severity: 'Info',
    },
    {
      id: 'AUD-98213',
      timestamp: '14/05/2025 10:18:02',
      actor: 'Sistema (BaaS Gateway SPI)',
      action: 'Transmissão de Mensagem Pix',
      target: 'EndToEndId E00038166202505141018...',
      ip: '10.240.0.14',
      status: 'Sucesso',
      severity: 'Info',
    },
    {
      id: 'AUD-98212',
      timestamp: '14/05/2025 09:45:11',
      actor: 'Mariana Costa (Cliente)',
      action: 'Consentimento Open Finance Renovado',
      target: 'Compartilhamento de Dados Cadastrais',
      ip: '177.18.230.104',
      status: 'Sucesso',
      severity: 'Info',
    },
    {
      id: 'AUD-98211',
      timestamp: '14/05/2025 08:30:45',
      actor: 'Robô de Conciliação Noturna',
      action: 'Fechamento Contábil D-1',
      target: 'Lote #LOT-4412 (Banco Parceiro S.A.)',
      ip: '10.240.1.2',
      status: 'Sucesso',
      severity: 'Info',
    },
    {
      id: 'AUD-98210',
      timestamp: '13/05/2025 22:15:33',
      actor: 'Auditoria Externa (PwC)',
      action: 'Extração de Trilha WORM de Conformidade',
      target: 'Relatório Trimestral BACEN 4.557',
      ip: '200.143.18.5',
      status: 'Sucesso',
      severity: 'Alerta',
    },
  ];

  const rbacRoles = [
    {
      role: 'Diretoria Executiva & Alçada Máxima',
      usersCount: 3,
      scope: 'Aprovação de operações > R$ 1M, alteração de regras do motor e parâmetros BACEN.',
      mfaRequired: true,
    },
    {
      role: 'Mesa de Crédito & Underwriting',
      usersCount: 8,
      scope: 'Análise documental, emissão de pareceres de risco e aprovação até R$ 500k.',
      mfaRequired: true,
    },
    {
      role: 'Gerentes de Contas & Carteira',
      usersCount: 14,
      scope: 'Gestão da carteira 360°, originação de propostas e atendimento omnichannel.',
      mfaRequired: true,
    },
    {
      role: 'Auditoria & Compliance (DPO)',
      usersCount: 4,
      scope: 'Acesso irrestrito de leitura a logs WORM, relatórios regulatórios e gestão LGPD.',
      mfaRequired: true,
    },
  ];

  const filteredAudits = auditEvents.filter((a) => {
    const matchesFilter = selectedAuditFilter === 'all' || a.severity.toLowerCase() === selectedAuditFilter;
    const matchesSearch =
      a.actor.toLowerCase().includes(searchAudit.toLowerCase()) ||
      a.action.toLowerCase().includes(searchAudit.toLowerCase()) ||
      a.id.toLowerCase().includes(searchAudit.toLowerCase()) ||
      a.target.toLowerCase().includes(searchAudit.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Governança & Compliance</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Conformidade regulatória BACEN, proteção de dados LGPD, controle RBAC e trilha de auditoria WORM.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Índice Geral de Conformidade: 98,6%
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Auditado
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Conformidade LGPD
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">100%</p>
            <p className="text-[10px] text-slate-500 mt-1">DPO registrado & consentimentos em dia</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              BACEN 4.557
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Separação Regulatória
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">Ativa</p>
            <p className="text-[10px] text-slate-500 mt-1">DYAMOND Tech ↔ Banco Parceiro S.A.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              WORM Ativo
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Trilha de Auditoria
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">100% Imutável</p>
            <p className="text-[10px] text-slate-500 mt-1">Armazenamento em cofre criptografado</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Zero Trust
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              MFA Obrigatório
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">29 / 29</p>
            <p className="text-[10px] text-slate-500 mt-1">100% dos operadores com biometria/FIDO2</p>
          </div>
        </div>
      </div>

      {/* Row 2: Pilares da Governança Operacional Santander-Grade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Segregação de Funções & Alçadas</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Nenhum operador pode simultaneamente originar e aprovar propostas de crédito. As alçadas são estritamente delimitadas por limites operacionais (até R$ 50k, até R$ 500k e Diretoria).
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center text-blue-600 text-xs font-bold gap-1 cursor-pointer hover:underline">
            <span>Ver matriz de alçadas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Segurança da Informação & LGPD</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Anonimização e mascaramento de CPF/CNPJ em telas operacionais. Ciclo de vida de retenção de dados cadastrais conforme normas da autoridade regulatória (ANPD) e do BACEN.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center text-emerald-600 text-xs font-bold gap-1 cursor-pointer hover:underline">
            <span>Dossiê do DPO</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">BaaS & Relação com Banco Parceiro</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            A liquidação financeira das contas, Pix e depósitos à vista ocorre estritamente na instituição bancária licenciada, atuando a DYAMOND como provedora tecnológica e de benefícios.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center text-purple-600 text-xs font-bold gap-1 cursor-pointer hover:underline">
            <span>Acordo de Nível de Serviço (SLA)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Row 3: Trilha de Auditoria em Tempo Real (8 cols) + RBAC Roles (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Audit Log Stream (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Trilha de Auditoria (Logs WORM)</h2>
                <p className="text-[11px] text-slate-500">
                  Registros imutáveis com carimbo de tempo para comprovação perante órgãos reguladores.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setSelectedAuditFilter('all')}
                  className={`px-2.5 py-1 rounded-lg ${selectedAuditFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedAuditFilter('alerta')}
                  className={`px-2.5 py-1 rounded-lg ${selectedAuditFilter === 'alerta' ? 'bg-white text-amber-600 shadow-sm' : ''}`}
                >
                  Alertas
                </button>
                <button
                  onClick={() => setSelectedAuditFilter('info')}
                  className={`px-2.5 py-1 rounded-lg ${selectedAuditFilter === 'info' ? 'bg-white text-blue-600 shadow-sm' : ''}`}
                >
                  Info
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar registro de auditoria por ID, usuário ou ação..."
                value={searchAudit}
                onChange={(e) => setSearchAudit(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Audit Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">ID / Data & Hora</th>
                    <th className="py-2.5 px-3">Operador / Agente</th>
                    <th className="py-2.5 px-3">Ação Executada</th>
                    <th className="py-2.5 px-3">Alvo / Registro</th>
                    <th className="py-2.5 px-3">IP Origem</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAudits.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-mono font-bold text-blue-600 text-[11px]">{log.id}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{log.timestamp}</p>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {log.actor}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {log.action}
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px]">
                        {log.target}
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                        {log.ip}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.severity === 'Alerta'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          ● {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              Trilha auditada e assinada com certificado digital ICP-Brasil.
            </span>
            <button
              onClick={() => alert('Download do arquivo de auditoria assinado em formato WORM/XML.')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Trilha Assinada</span>
            </button>
          </div>
        </div>

        {/* Right: Matriz de Perfis RBAC (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Perfis de Acesso (RBAC)</h2>
                <p className="text-[11px] text-slate-500">
                  Governança e papéis de permissão.
                </p>
              </div>
              <Users className="w-4 h-4 text-blue-600" />
            </div>

            <div className="space-y-3">
              {rbacRoles.map((role, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 hover:bg-slate-100/60 rounded-xl border border-slate-200/70 space-y-1.5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">{role.role}</h3>
                    <span className="px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                      {role.usersCount} usuários
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {role.scope}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" /> MFA Obrigatório
                    </span>
                    <button
                      onClick={() => alert(`Configurando permissões de: ${role.role}`)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Configurar →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
            <strong>Certificação ISO 27001 & SOC 2:</strong> Todas as alterações de permissão exigem dupla autorização (four-eyes principle) e registro em log de auditoria.
          </div>
        </div>
      </div>
    </div>
  );
};
