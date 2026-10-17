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
  Calendar,
  Flame,
  ChevronRight
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
    HABILITADO: { label: 'Habilitado', classe: 'bg-blue-50 text-blue-700 border-blue-200' },
    CONVOCADO: { label: 'Convocado p/ Escolha', classe: 'bg-red-50 text-[#EC0000] border-red-200' },
    EM_DOCUMENTACAO: { label: 'Conferindo Pasta', classe: 'bg-amber-50 text-amber-700 border-amber-200' },
    DESISTENTE: { label: 'Desistente', classe: 'bg-slate-100 text-slate-700 border-slate-200' },
    CONTEMPLADO: { label: 'Contemplado / Assinado', classe: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
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
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Classificação & Motor Social Auditável
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Fila de Classificação Social & Scoring Habitacional
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Critérios transparentes de alocação de moradia sem favorecimentos pessoais, auditados por conselhos e órgãos fiscais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMostrarParametros(!mostrarParametros)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Sliders className="h-4 w-4 text-[#EC0000]" /> Matriz de Ponderação
          </button>
          <button
            onClick={() => alert('Exportando lista oficial de classificação')}
            className="px-4 py-2.5 rounded-xl bg-[#EC0000] hover:bg-[#CC0000] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-600/20 transition-all"
          >
            <Download className="h-4 w-4" /> Exportar Lista Oficial
          </button>
        </div>
      </div>

      {/* Painel Retrátil de Ajuste de Pesos do Algoritmo */}
      {mostrarParametros && (
        <div className="bg-[#141414] text-white p-6 sm:p-7 rounded-3xl border border-neutral-800 shadow-xl space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                <Award className="h-4 w-4 text-[#EC0000]" />
                Matriz de Ponderação Socioeconômica Santander / MCMV
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Defina o peso relativo de cada indicador no cálculo final do score do associado (Soma = 100%).
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30">
              Total: {Object.values(pesos).reduce((a, b) => a + b, 0)}%
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Renda Per Capita</label>
              <input
                type="number"
                value={pesos.pesoRenda}
                onChange={e => setPesos({ ...pesos, pesoRenda: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:border-[#EC0000] outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Tempo de Associação</label>
              <input
                type="number"
                value={pesos.pesoTempo}
                onChange={e => setPesos({ ...pesos, pesoTempo: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:border-[#EC0000] outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Dependentes</label>
              <input
                type="number"
                value={pesos.pesoDependentes}
                onChange={e => setPesos({ ...pesos, pesoDependentes: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:border-[#EC0000] outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Presença PCD</label>
              <input
                type="number"
                value={pesos.pesoPCD}
                onChange={e => setPesos({ ...pesos, pesoPCD: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:border-[#EC0000] outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Mulher Chefe Família</label>
              <input
                type="number"
                value={pesos.pesoMulherChefe}
                onChange={e => setPesos({ ...pesos, pesoMulherChefe: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:border-[#EC0000] outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Idoso na Família</label>
              <input
                type="number"
                value={pesos.pesoIdoso}
                onChange={e => setPesos({ ...pesos, pesoIdoso: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:border-[#EC0000] outline-none font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Cards de Resumo Santander Style */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fila Geral Ativa</span>
          <p className="text-3xl font-black text-slate-900 mt-1">15.430</p>
          <p className="text-[11px] text-slate-400 mt-1">Todas as Associações</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Convocados no Lote Atual</span>
          <p className="text-3xl font-black text-amber-600 mt-1">120</p>
          <p className="text-[11px] text-slate-400 mt-1">Para escolha de unidade</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Famílias PCD / Idosos</span>
          <p className="text-3xl font-black text-purple-600 mt-1">2.418</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Prioridade Lei Federal</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-[#EC0000] uppercase tracking-wider block">Score Médio dos Aprovados</span>
          <p className="text-3xl font-black text-[#EC0000] mt-1">84.2 pts</p>
          <p className="text-[11px] text-slate-400 mt-1">Escala de 0 a 100</p>
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome do associado, CPF ou associação vinculada..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-[#F4F6F9] focus:bg-white focus:border-[#EC0000] focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
          />
        </div>

        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#EC0000] w-full md:w-auto"
        >
          <option value="TODOS">Todos os Status</option>
          <option value="HABILITADO">Habilitados</option>
          <option value="CONVOCADO">Convocados</option>
          <option value="EM_DOCUMENTACAO">Em Documentação</option>
          <option value="CONTEMPLADO">Contemplados</option>
        </select>
      </div>

      {/* Tabela de Classificação Social Santander Style */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8FAFC] text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/80">
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
            <tbody className="divide-y divide-slate-100 text-xs">
              {filaFiltrada.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 text-center">
                    <span className="w-8 h-8 rounded-2xl bg-[#141414] text-white font-black text-xs inline-flex items-center justify-center shadow-sm">
                      #{item.posicao_geral}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900 text-sm">{item.nome_associado}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      CPF {item.cpf_mascarado} · {item.associacao_nome}
                    </p>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className="font-black text-[#EC0000] text-base">
                      {item.pontuacao_total.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block">pontos</span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {item.possui_pcd && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                          PCD
                        </span>
                      )}
                      {item.mulher_chefe_familia && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-pink-50 text-pink-700 border border-pink-200">
                          Mulher Chefe
                        </span>
                      )}
                      {item.idoso_na_familia && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                          Idoso
                        </span>
                      )}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                        {item.numero_dependentes} dep.
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                        {item.tempo_associacao_meses}m filiado
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900">
                    R$ {item.renda_per_capita.toFixed(2).replace('.', ',')}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge[item.status].classe}`}>
                      {item.status === 'CONVOCADO' && <Clock className="h-3 w-3" />}
                      {item.status === 'CONTEMPLADO' && <CheckCircle2 className="h-3 w-3" />}
                      {statusBadge[item.status].label}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert(`Convocando associado ${item.nome_associado} para escolha de lote/unidade!`)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-[#EC0000] border border-red-200 hover:bg-red-100 transition-colors shadow-sm"
                    >
                      Convocar ➔
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-[#F4F6F9] text-xs text-slate-500 flex justify-between items-center">
          <span>Algoritmo social parametrizável com trilha imutável para compliance público</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
