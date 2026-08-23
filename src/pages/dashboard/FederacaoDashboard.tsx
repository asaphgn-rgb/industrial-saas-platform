import { Link } from 'react-router-dom';
import { Users, Building, Activity, FileText, ArrowRight, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function FederacaoDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamond-950">Painel da Federação</h2>
          <p className="text-sm text-diamond-400 mt-1">Bem-vindo, {user?.email}. Gerencie suas associações abaixo.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Acesso Seguro
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building className="h-24 w-24 text-diamond-500 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Associações</h3>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building className="h-5 w-5" /></span>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-4xl font-black text-diamond-950">12</p>
            <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> +2 este mês
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="h-24 w-24 text-diamond-500 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Associados</h3>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users className="h-5 w-5" /></span>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-4xl font-black text-diamond-950">1.450</p>
            <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> +150 este mês
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="h-24 w-24 text-diamond-500 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Processos Ativos</h3>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Activity className="h-5 w-5" /></span>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-4xl font-black text-diamond-950">48</p>
            <p className="text-sm text-amber-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> 5 aguardando
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="h-24 w-24 text-diamond-500 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Contratos</h3>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileText className="h-5 w-5" /></span>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-4xl font-black text-diamond-950">312</p>
            <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> 100% regular
            </p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-diamond-950">Ações Rápidas</h3>
          </div>
          <div className="p-2">
            <Link to="/federacao/associacoes" className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-diamond-950">Gerenciar Associações</p>
                  <p className="text-sm text-slate-500">Cadastre e edite associações vinculadas.</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-diamond-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
