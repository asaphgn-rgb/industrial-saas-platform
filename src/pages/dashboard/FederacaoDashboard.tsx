import { Building, Users, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function FederacaoDashboard() {
  const { user } = useAuth();

  const kpis = [
    { title: 'Minhas Associações', value: '12', icon: Building, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Associados Vinculados', value: '1.240', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Pré-aprovados', value: '380', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Vendas/Adesões', value: '45', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard da Federação</h2>
        <p className="text-sm text-slate-500">
          Resumo da sua Federação. Acesso restrito à jurisdição de ID: {user?.federacao_id || 'Não vinculada'}.
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
        <h3 className="font-semibold text-slate-800 mb-4">Desempenho por Associação</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Associação</th>
                <th className="px-4 py-3">Associados</th>
                <th className="px-4 py-3">Crédito Pré-aprovado</th>
                <th className="px-4 py-3 rounded-tr-lg">Taxa Conversão</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">Assoc. Habitacional Norte</td>
                <td className="px-4 py-3">450</td>
                <td className="px-4 py-3">125</td>
                <td className="px-4 py-3 text-emerald-600">28%</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">Assoc. Moradia Digna Sul</td>
                <td className="px-4 py-3">790</td>
                <td className="px-4 py-3">255</td>
                <td className="px-4 py-3 text-emerald-600">32%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
