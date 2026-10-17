import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus,
  Headphones,
  FileText,
  CreditCard,
  Building2,
  PieChart
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { MOCK_CLIENTS_360, Client360 } from '@/data/enterpriseData';

export const Portfolio360View: React.FC = () => {
  const [clients, setClients] = useState<Client360[]>(MOCK_CLIENTS_360);
  const [selectedClient, setSelectedClient] = useState<Client360>(MOCK_CLIENTS_360[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfileFilter, setSelectedProfileFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProfile = selectedProfileFilter === 'all' || c.profileType === selectedProfileFilter;
    const matchesStatus = selectedStatusFilter === 'all' || c.status === selectedStatusFilter;
    return matchesSearch && matchesProfile && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Carteira 360°</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Gestão unificada de clientes, associados e oportunidades.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs font-semibold text-slate-500">
            Seg, 26 de mai. de 2025
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ +12% <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Clientes ativos
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">2.048</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              ↑ +18% <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Potencial
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">R$ 3,2 mi</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              ↑ +25% <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Novas oportunidades
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">188</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              ↑ +4 p.p. <span className="text-slate-400 font-normal">vs. mês anterior</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Dados completos
            </span>
            <p className="text-2xl font-black text-slate-900 font-sans mt-0.5">94%</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left Table (8 cols) + Right Client Card 360 (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Clients Table Box */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">Carteira de clientes</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Exportação da carteira gerada em formato CSV/Excel com dados em conformidade com a LGPD.')}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Exportar</span>
                </button>
                <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none">
                  <option>Últimos 30 dias</option>
                  <option>Últimos 90 dias</option>
                  <option>Ano atual (2025)</option>
                </select>
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-4">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF/CNPJ, e-mail ou telefone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedProfileFilter}
                  onChange={(e) => setSelectedProfileFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="all">Todos os perfis</option>
                  <option value="Pessoa Física">Pessoa Física</option>
                  <option value="Associado">Associado</option>
                  <option value="Empresarial">Empresarial</option>
                  <option value="Família">Família</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="all">Todos os status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Em negociação">Em negociação</option>
                  <option value="Em análise">Em análise</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 border-y border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Perfil</th>
                    <th className="py-2.5 px-3">Produtos</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Próxima ação</th>
                    <th className="py-2.5 px-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.map((client) => {
                    const isSelected = selectedClient.id === client.id;
                    return (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/60 font-medium' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {client.initials}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{client.name}</p>
                              <p className="text-[11px] text-slate-400 font-mono">{client.document}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              client.profileType === 'Pessoa Física'
                                ? 'bg-blue-50 text-blue-700'
                                : client.profileType === 'Associado'
                                ? 'bg-purple-50 text-purple-700'
                                : client.profileType === 'Empresarial'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {client.profileType}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <p className="text-[11px] text-slate-600 truncate max-w-[160px]">
                            {client.products.join(', ')}
                          </p>
                        </td>

                        <td className="py-3 px-3">
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                client.status === 'Ativo'
                                  ? 'bg-emerald-500'
                                  : client.status === 'Em negociação'
                                  ? 'bg-amber-500'
                                  : 'bg-blue-500'
                              }`}
                            />
                            <span
                              className={
                                client.status === 'Ativo'
                                  ? 'text-emerald-700'
                                  : client.status === 'Em negociação'
                                  ? 'text-amber-700'
                                  : 'text-blue-700'
                              }
                            >
                              {client.status}
                            </span>
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <p className="text-xs font-semibold text-slate-800">{client.nextAction}</p>
                          <p className="text-[10px] text-slate-400">{client.nextActionDate}</p>
                        </td>

                        <td className="py-3 px-2 text-center">
                          <ChevronRight className="w-4 h-4 text-slate-400 hover:text-blue-600 inline" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Client Detail Side Card 360 (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate flex flex-col justify-between space-y-4">
          <div>
            {/* Header with photo / initials */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                  {selectedClient.initials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedClient.name}</h3>
                  <p className="text-xs font-mono text-slate-400">{selectedClient.document}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Cliente desde {selectedClient.clientSince}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                ● Ativo
              </span>
            </div>

            {/* Profile Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
              <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                {selectedClient.riskScore}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">
                {selectedClient.engagement}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-bold">
                Perfil investidor: {selectedClient.investorProfile}
              </span>
            </div>

            {/* Products Contracted List */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Produtos contratados
                </span>
                <span className="text-[10px] text-slate-400">
                  {selectedClient.contractedProducts.length} ativos
                </span>
              </div>

              <div className="space-y-2">
                {selectedClient.contractedProducts.map((prod, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-blue-600 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{prod.name}</p>
                        <p className="text-[10px] text-slate-400">{prod.date}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">
                      {prod.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => alert(`Gerando oferta personalizada inteligente para ${selectedClient.name}`)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Criar oferta</span>
            </button>
            <button
              onClick={() => alert(`Abrindo formulário de atendimento corporativo para ${selectedClient.name}`)}
              className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Headphones className="w-4 h-4 text-slate-500" />
              <span>Registrar atendimento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Segmentação da Carteira (4 Horizontal Cards) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-corporate space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Segmentação da carteira</h2>
          <button
            onClick={() => alert('Abrindo análise analítica avançada de segmentação.')}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            Ver análise completa <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Segment 1: Empresarial */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Empresarial</span>
              <span className="text-[10px] font-bold text-emerald-600">↑ 14%</span>
            </div>
            <p className="text-2xl font-black text-slate-900 font-sans mt-1">412</p>
            <p className="text-[11px] text-slate-500">clientes</p>
            <div className="flex items-end gap-1 h-8 mt-2">
              <div className="w-2 bg-emerald-300 rounded-t h-3" />
              <div className="w-2 bg-emerald-400 rounded-t h-5" />
              <div className="w-2 bg-emerald-500 rounded-t h-7" />
              <div className="w-2 bg-emerald-600 rounded-t h-6" />
              <div className="w-2 bg-emerald-500 rounded-t h-8" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">R$ 1,8 mi de potencial</p>
          </div>

          {/* Segment 2: Famílias */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Famílias</span>
              <span className="text-[10px] font-bold text-rose-600">↑ 11%</span>
            </div>
            <p className="text-2xl font-black text-slate-900 font-sans mt-1">856</p>
            <p className="text-[11px] text-slate-500">clientes</p>
            <div className="flex items-end gap-1 h-8 mt-2">
              <div className="w-2 bg-rose-300 rounded-t h-4" />
              <div className="w-2 bg-rose-400 rounded-t h-5" />
              <div className="w-2 bg-rose-500 rounded-t h-6" />
              <div className="w-2 bg-rose-600 rounded-t h-8" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">R$ 620 mil de potencial</p>
          </div>

          {/* Segment 3: Associados */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Associados</span>
              <span className="text-[10px] font-bold text-purple-600">↑ 9%</span>
            </div>
            <p className="text-2xl font-black text-slate-900 font-sans mt-1">518</p>
            <p className="text-[11px] text-slate-500">clientes</p>
            <div className="flex items-end gap-1 h-8 mt-2">
              <div className="w-2 bg-purple-300 rounded-t h-3" />
              <div className="w-2 bg-purple-400 rounded-t h-6" />
              <div className="w-2 bg-purple-500 rounded-t h-8" />
              <div className="w-2 bg-purple-600 rounded-t h-7" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">R$ 450 mil de potencial</p>
          </div>

          {/* Segment 4: Alta oportunidade */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Alta oportunidade</span>
              <span className="text-[10px] font-bold text-amber-600">↑ 28%</span>
            </div>
            <p className="text-2xl font-black text-slate-900 font-sans mt-1">262</p>
            <p className="text-[11px] text-slate-500">clientes</p>
            <div className="flex items-end gap-1 h-8 mt-2">
              <div className="w-2 bg-amber-300 rounded-t h-4" />
              <div className="w-2 bg-amber-400 rounded-t h-5" />
              <div className="w-2 bg-amber-500 rounded-t h-7" />
              <div className="w-2 bg-amber-600 rounded-t h-8" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">R$ 1,1 mi de potencial</p>
          </div>
        </div>
      </div>
    </div>
  );
};
