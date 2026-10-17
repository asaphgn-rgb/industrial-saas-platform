import { useState } from 'react';
import {
  Users,
  Award,
  Filter,
  Search,
  Download,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpDown,
  Building,
  HeartHandshake,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { ItemFilaSocial, StatusFilaSocial } from '@/types/habitacional';

export default function FilaSocialScoring() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [mostrarParametros, setMostrarParametros] = useState(false);

  // Pesos dos Parâmetros de Classificação Social (Conformidade com Programas Habitacionais Públicos e Cooperativos)
  const [pesos, setPesos] = useState({
    pesoRenda: 30, // Menor renda = mais pontos
    pesoTempo: 25, // Tempo como associado adimplente
    pesoDependentes: 15,
    pesoPCD: 15,
    pesoMulherChefe: 10,
    pesoIdoso: 5
  });

  const [fila, setFila] = useState<ItemFilaSocial[]>([
    {
      id: 'fs-001',
      associado_id: 'u-1',
      nome_associado: 'Maria das Graças de Oliveira',
      cpf_mascarado: '***.312.891-**',
      associacao_nome: 'Associação Habitacional Sol Nascente',
      pontuacao_total: 94.50,
      posicao_geral: 1,
      renda_per_capita: 480.00,
      tempo_associacao_meses: 42,
      numero_dependentes: 3,
      possui_pcd: true,
      mulher_chefe_familia: true,
      idoso_na_familia: false,
      status: 'CONVOCADO',
      data_inscricao: '10/04/2023',
      data_ultima_convocacao: '15/10/2026'
    },
    {
      id: 'fs-002',
      associado_id: 'u-2',
      nome_associado: 'Raimundo Nonato da Silva',
      cpf_mascarado: '***.514.229-**',
      associacao_nome: 'Associação Moradia Digna Ceilândia',
      pontuacao_total: 88.20,
      posicao_geral: 2,
      renda_per_capita: 620.00,
      tempo_associacao_meses: 36,
      numero_dependentes: 2,
      possui_pcd: false,
      mulher_chefe_familia: false,
      idoso_na_familia: true,
      status: 'HABILITADO',
      data_inscricao: '18/10/2023'
    },
    {
      id: 'fs-003',
      associado_id: 'u-3',
      nome_associado: 'Francisca Helena Souza',
      cpf_mascarado: '***.908.112-**',
      associacao_nome: 'Associação Habitacional Sol Nascente',
      pontuacao_total: 82.00,
      posicao_geral: 3,
      renda_per_capita: 750.00,
      tempo_associacao_meses: 28,
      numero_dependentes: 4,
      possui_pcd: false,
      mulher_chefe_familia: true,
      idoso_na_familia: false,
      status: 'EM_DOCUMENTACAO',
      data_inscricao: '05/02/2024'
    },
    {
      id: 'fs-004',
      associado_id: 'u-4',
      nome_associado: 'José Antunes Moreira',
      cpf_mascarado: '***.671.309-**',
      associacao_nome: 'Associação Parque das Flores',
      pontuacao_total: 76.80,
      posicao_geral: 4,
      renda_per_capita: 980.00,
      tempo_associacao_meses: 20,
      numero_dependentes: 1,
      possui_pcd: true,
      mulher_chefe_familia: false,
      idoso_na_familia: false,
      status: 'HABILITADO',
      data_inscricao: '14/06/2024'
    },
    {
      id: 'fs-005',
      associado_id: 'u-5',
      nome_associado: 'Antônio Carlos Peixoto',
      cpf_mascarado: '***.112.548-**',
      associacao_nome: 'Associação Moradia Digna Ceilândia',
      pontuacao_total: 71.40,
      posicao_geral: 5,
      renda_per_capita: 1100.00,
      tempo_associacao_meses: 18,
      numero_dependentes: 2,
      possui_pcd: false,
      mulher_chefe_familia: false,
      idoso_na_familia: true,
      status: 'CONTEMPLADO',
      data_inscricao: '22/08/2024'
    }
  ]);

  const statusBadge: Record<StatusFilaSocial, { label: string; classe: string }> = {
    HABILITADO: { label: 'Habilitado', classe: 'bg-blue-100 text-blue-800' },
    CONVOCADO: { label: 'Convocado p/ Escolha', classe: 'bg-amber-100 text-amber-800' },
    EM_DOCUMENTACAO: { label: 'Conferindo Pasta', classe: 'bg-purple-100 text-purple-800' },
    DESISTENTE: { label: 'Desistente', classe: 'bg-red-100 text-red-800' },
    CONTEMPLADO: { label: 'Contemplado / Assinado', classe: 'bg-emerald-100 text-emerald-800' }
  };

  const filaFiltrada = fila.filter(item => {
    const matchBusca =
      item.nome_associado.toLowerCase().includes(busca.toLowerCase()) ||
      item.cpf_mascarado.includes(busca) ||
      item.associacao_nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'TODOS' || item.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Motor de Scoring & Fila de Classificação Social
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Trilha 100% Auditável
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Critérios transparentes de alocação de moradia sem favorecimentos pessoais, auditados por conselhos e órgãos fiscais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMostrarParametros(!mostrarParametros)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Sliders className="h-4 w-4 text-blue-600" /> Parâmetros de Pesos
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Exportar Lista Oficial
          </button>
        </div>
      </div>

      {/* Painel Retrátil de Ajuste de Pesos do Algoritmo */}
      {mostrarParametros && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                Matriz de Ponderação Socioeconômica
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Defina o peso relativo de cada indicador no cálculo final do score de cada associado (Soma = 100%).
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/30">
              Total: {Object.values(pesos).reduce((a, b) => a + b, 0)}%
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Renda Per Capita</label>
              <input
                type="number"
                value={pesos.pesoRenda}
                onChange={e => setPesos({ ...pesos, pesoRenda: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Tempo de Associação</label>
              <input
                type="number"
                value={pesos.pesoTempo}
                onChange={e => setPesos({ ...pesos, pesoTempo: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Dependentes</label>
              <input
                type="number"
                value={pesos.pesoDependentes}
                onChange={e => setPesos({ ...pesos, pesoDependentes: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Presença PCD</label>
              <input
                type="number"
                value={pesos.pesoPCD}
                onChange={e => setPesos({ ...pesos, pesoPCD: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Mulher Chefe Família</label>
              <input
                type="number"
                value={pesos.pesoMulherChefe}
                onChange={e => setPesos({ ...pesos, pesoMulherChefe: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Idoso na Família</label>
              <input
                type="number"
                value={pesos.pesoIdoso}
                onChange={e => setPesos({ ...pesos, pesoIdoso: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total na Fila Ativa</span>
          <p className="text-3xl font-black text-slate-900 mt-2">15.430</p>
          <p className="text-xs text-slate-400 mt-1">Todas as Associações</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Convocados no Lote Atual</span>
          <p className="text-3xl font-black text-amber-600 mt-2">120</p>
          <p className="text-xs text-slate-400 mt-1">Para escolha de unidade</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Famílias c/ PCD / Idosos</span>
          <p className="text-3xl font-black text-purple-600 mt-2">2.418</p>
          <p className="text-xs text-emerald-600 mt-1">Prioridade Lei Federal</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Score Médio dos Aprovados</span>
          <p className="text-3xl font-black text-blue-600 mt-2">84.2 pts</p>
          <p className="text-xs text-slate-400 mt-1">Escala de 0 a 100</p>
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome do associado, CPF ou associação vinculada..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-blue-500 w-full md:w-auto"
        >
          <option value="TODOS">Todos os Status</option>
          <option value="HABILITADO">Habilitados</option>
          <option value="CONVOCADO">Convocados</option>
          <option value="EM_DOCUMENTACAO">Em Documentação</option>
          <option value="CONTEMPLADO">Contemplados</option>
        </select>
      </div>

      {/* Tabela de Classificação Social */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-center">Posição</th>
                <th className="py-4 px-6">Associado & Associação</th>
                <th className="py-4 px-6 text-center">Score Social</th>
                <th className="py-4 px-6">Critérios Atendidos</th>
                <th className="py-4 px-6">Renda Per Capita</th>
                <th className="py-4 px-6">Status da Fila</th>
                <th className="py-4 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filaFiltrada.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 text-center">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs inline-flex items-center justify-center shadow-sm">
                      #{item.posicao_geral}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{item.nome_associado}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      CPF {item.cpf_mascarado} · {item.associacao_nome}
                    </p>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className="font-extrabold text-blue-600 text-base">
                      {item.pontuacao_total.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">pontos</span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {item.possui_pcd && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                          PCD
                        </span>
                      )}
                      {item.mulher_chefe_familia && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-100 text-pink-800">
                          Mulher Chefe
                        </span>
                      )}
                      {item.idoso_na_familia && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          Idoso
                        </span>
                      )}
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.numero_dependentes} dep.
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.tempo_associacao_meses}m filiado
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-semibold text-slate-700">
                    R$ {item.renda_per_capita.toFixed(2).replace('.', ',')}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge[item.status].classe}`}>
                      {item.status === 'CONVOCADO' && <Clock className="h-3.5 w-3.5" />}
                      {item.status === 'CONTEMPLADO' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {statusBadge[item.status].label}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert(`Convocando associado ${item.nome_associado} para escolha de lote/unidade!`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Convocar ➔
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
