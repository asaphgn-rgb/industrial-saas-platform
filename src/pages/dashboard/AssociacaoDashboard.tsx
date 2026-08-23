import { Users, FileCheck, Search, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AssociacaoDashboard() {
  const { user } = useAuth();

  const kpis = [
    { title: 'Meus Associados', value: '450', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Aguardando Análise', value: '34', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Pré-Aprovados', value: '125', icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Crédito a Trabalhar', value: '180', icon: Search, color: 'text-blue-600', bg: 'bg-blue-100' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Painel da Associação</h2>
        <p className="text-sm text-slate-500">
          Gerenciamento direto de associados. ID Vinculado: {user?.associacao_id || 'Nenhum'}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{kpi.value}</p>
              </div>
              <div className={`rounded-full p-3 ${kpi.bg}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Ações Recentes (Seus Associados)</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
            <div>
              <p className="font-medium text-slate-900">João M. Silva</p>
              <p className="text-sm text-slate-500">Envio de Comprovante de Renda</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
              Pendente Validação
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
            <div>
              <p className="font-medium text-slate-900">Maria C. Santos</p>
              <p className="text-sm text-slate-500">Consulta de Crédito Realizada</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
              Pré-Aprovada
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
