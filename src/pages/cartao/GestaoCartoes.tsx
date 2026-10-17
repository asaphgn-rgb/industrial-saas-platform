import { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Lock,
  Unlock,
  PlusCircle,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Download,
  Flame,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { CartaoItem } from '@/types/cartao';

export default function GestaoCartoes() {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  const [cartoes, setCartoes] = useState<CartaoItem[]>([
    {
      id: 'c-101',
      numero_mascarado: '•••• •••• •••• 4892',
      titular: 'Marcos Vinicius Almeida',
      cpf_mascarado: '***.482.918-**',
      tipo: 'BENEFICIO',
      status: 'ATIVO',
      limite_total: 5000,
      limite_disponivel: 3160,
      fatura_atual: 1840,
      vencimento: '10/11/2026',
      data_emissao: '12/03/2026',
      cashback_acumulado: 142.50
    },
    {
      id: 'c-102',
      numero_mascarado: '•••• •••• •••• 9921',
      titular: 'Ana Cláudia Fontes',
      cpf_mascarado: '***.723.101-**',
      tipo: 'CREDITO',
      status: 'ATIVO',
      limite_total: 8000,
      limite_disponivel: 4500,
      fatura_atual: 3500,
      vencimento: '15/11/2026',
      data_emissao: '05/04/2026',
      cashback_acumulado: 210.80
    },
    {
      id: 'c-103',
      numero_mascarado: '•••• •••• •••• 3341',
      titular: 'Roberto Carlos Silveira',
      cpf_mascarado: '***.195.448-**',
      tipo: 'CONSIGNADO',
      status: 'BLOQUEADO',
      limite_total: 3500,
      limite_disponivel: 0,
      fatura_atual: 2890,
      vencimento: '20/11/2026',
      data_emissao: '18/01/2026',
      cashback_acumulado: 45.00
    },
    {
      id: 'c-104',
      numero_mascarado: '•••• •••• •••• 7712',
      titular: 'Patrícia Mendes Castro',
      cpf_mascarado: '***.889.332-**',
      tipo: 'CORPORATIVO',
      status: 'EM_ANALISE',
      limite_total: 12000,
      limite_disponivel: 12000,
      fatura_atual: 0,
      vencimento: '05/11/2026',
      data_emissao: '14/10/2026',
      cashback_acumulado: 0
    }
  ]);

  const toggleStatus = (id: string) => {
    setCartoes(prev =>
      prev.map(c => {
        if (c.id === id) {
          const novoStatus = c.status === 'ATIVO' ? 'BLOQUEADO' : 'ATIVO';
          return { ...c, status: novoStatus };
        }
        return c;
      })
    );
  };

  const cartoesFiltrados = cartoes.filter(c => {
    const matchBusca =
      c.titular.toLowerCase().includes(busca.toLowerCase()) ||
      c.numero_mascarado.includes(busca) ||
      c.cpf_mascarado.includes(busca);
    const matchTipo = filtroTipo === 'TODOS' || c.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'TODOS' || c.status === filtroStatus;
    return matchBusca && matchTipo && matchStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Emissão & Gestão de Limites Bacen
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Gestão da Base de Cartões Santander Diamond
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoramento de cartões físicos/virtuais, faturas, consumo de limite e travas preventivas antifraude.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exportando base de cartões')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 text-[#EC0000]" /> Exportar Base
          </button>
          <button
            onClick={() => alert('Abrindo formulário de emissão de cartão')}
            className="px-4 py-2.5 rounded-xl bg-[#EC0000] hover:bg-[#CC0000] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-600/20 transition-all"
          >
            <PlusCircle className="h-4 w-4" /> Emitir Novo Cartão
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por titular, CPF ou final do cartão..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-[#F4F6F9] focus:bg-white focus:border-[#EC0000] focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#EC0000]"
          >
            <option value="TODOS">Todos os Tipos</option>
            <option value="BENEFICIO">Benefício</option>
            <option value="CREDITO">Crédito</option>
            <option value="CONSIGNADO">Consignado</option>
            <option value="CORPORATIVO">Corporativo</option>
          </select>

          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#EC0000]"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="ATIVO">Ativo</option>
            <option value="BLOQUEADO">Bloqueado</option>
            <option value="EM_ANALISE">Em Análise</option>
          </select>
        </div>
      </div>

      {/* Tabela de Cartões Santander Style */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8FAFC] text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/80">
              <tr>
                <th className="py-4 px-6">Cartão & Titular</th>
                <th className="py-4 px-6">Tipo</th>
                <th className="py-4 px-6">Limite Total / Disponível</th>
                <th className="py-4 px-6">Fatura Atual</th>
                <th className="py-4 px-6">Cashback / Esfera</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Ação de Segurança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {cartoesFiltrados.map(cartao => (
                <tr key={cartao.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-[#141414] text-[#EC0000] border border-neutral-800 shadow-sm">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{cartao.titular}</p>
                        <p className="text-xs text-slate-400 font-mono">
                          {cartao.numero_mascarado} • CPF {cartao.cpf_mascarado}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      {cartao.tipo}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-black text-slate-900">
                      R$ {cartao.limite_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-600">
                      Disp: R$ {cartao.limite_disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-black text-[#EC0000]">
                      R$ {cartao.fatura_atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-slate-400">Vencimento: {cartao.vencimento}</p>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-black text-slate-900 text-xs block">
                      R$ {cartao.cashback_acumulado.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600">
                      Abatível na Moradia
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        cartao.status === 'ATIVO'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : cartao.status === 'BLOQUEADO'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {cartao.status === 'ATIVO' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {cartao.status === 'BLOQUEADO' && <Lock className="h-3.5 w-3.5" />}
                      {cartao.status === 'EM_ANALISE' && <Clock className="h-3.5 w-3.5" />}
                      {cartao.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => toggleStatus(cartao.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                        cartao.status === 'ATIVO'
                          ? 'bg-red-50 text-[#EC0000] border border-red-200 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {cartao.status === 'ATIVO' ? (
                        <>
                          <Lock className="h-3.5 w-3.5" /> Bloquear Cartão
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3.5 w-3.5" /> Desbloquear
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-[#F4F6F9] text-xs text-slate-500 flex justify-between items-center">
          <span>Barramento de autorização conectado ao arranjo de pagamento Santander / Elo / Mastercard</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
