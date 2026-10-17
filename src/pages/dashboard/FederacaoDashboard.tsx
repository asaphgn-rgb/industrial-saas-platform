import { Link } from 'react-router-dom';
import { Users, Building, Activity, FileText, ArrowRight, ShieldCheck, TrendingUp, AlertCircle, Building2, ChevronRight, FileCheck, Landmark } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function FederacaoDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Gestão Regional da Federação
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">Painel da Federação</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Bem-vindo, {user?.email}. Acompanhe suas associações vinculadas e o fluxo habitacional regional.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/simulador-santander"
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
          >
            Esteira de Crédito
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Acesso Seguro (RLS)
          </span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1.5">Associações</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">12</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +2 este mês
              </p>
            </div>
            <div className="rounded-2xl p-3 bg-red-50 border border-red-100 text-[#EC0000]">
              <Building className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1.5">Associados</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">1.450</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +150 novos filiados
              </p>
            </div>
            <div className="rounded-2xl p-3 bg-slate-100 border border-slate-200 text-slate-800">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1.5">Processos Ativos</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">48</p>
              <p className="text-[11px] font-semibold text-amber-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> 5 em análise Caixa
              </p>
            </div>
            <div className="rounded-2xl p-3 bg-amber-50 border border-amber-100 text-amber-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1.5">Contratos</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">312</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> 100% regularizados
              </p>
            </div>
            <div className="rounded-2xl p-3 bg-slate-100 border border-slate-200 text-slate-800">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas Santander Style */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Ações Rápidas & Gestão de Entidades</h3>
          </div>
          <div className="p-2 divide-y divide-slate-100">
            <Link to="/federacao/associacoes" className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-[#EC0000] rounded-xl group-hover:bg-red-100 transition-colors">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Gerenciar Associações Vinculadas</p>
                  <p className="text-xs text-slate-500">Cadastre, edite e audite entidades do polo regional.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#EC0000] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/admin/espelho-vendas" className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 text-slate-800 rounded-xl group-hover:bg-slate-200 transition-colors">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Espelho de Vendas & Mapeamento</p>
                  <p className="text-xs text-slate-500">Visualização de blocos, quadras e lotes por status.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#EC0000] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/admin/fila-social" className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Fila Regional & Motor de Scoring</p>
                  <p className="text-xs text-slate-500">Classificação social transparente conforme edital.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#EC0000] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">Conformidade Regulatória Bacen / RLS</h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                100% ISOLADO
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              O escopo de leitura da Federação está restrito estritamente às associações subordinadas e seus associados através de Row Level Security.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Polo Regional:</span>
                <strong className="text-slate-900 font-bold">Distrito Federal & Entorno</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Última Auditoria:</span>
                <strong className="text-slate-900 font-bold">17/10/2026 09:15</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 flex justify-between items-center text-xs">
            <span className="text-slate-400">Emissão de certidões</span>
            <Link to="/federacao/relatorios" className="font-bold text-[#EC0000] hover:underline">
              Relatório Completo em PDF →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
