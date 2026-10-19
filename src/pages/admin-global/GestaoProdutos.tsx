import { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit2,
  TrendingUp,
  Key,
  Building2,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Tag,
  DollarSign,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GestaoProdutos() {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [modalNovo, setModalNovo] = useState(false);

  const [empreendimentos, setEmpreendimentos] = useState([
    {
      id: 1,
      nome: 'Residencial Diamante Sul — Gleba Urbanizada',
      codigo: 'MBB-DF-001',
      tipo: 'LOTE URBANIZADO',
      cidade: 'Tororó, Brasília/DF',
      vgv: 48500000.00,
      status: 'DISPONIVEL',
      unidadesTotais: 180,
      unidadesLivres: 42,
      faixaRenda: 'Faixa 2 e 3 (MCMV / Cooperativo)',
      imagem: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
      evolucaoObra: 38.5,
      valorMedio: 185000.00
    },
    {
      id: 2,
      nome: 'Edifício Parque das Águas — Torres A & B',
      codigo: 'MBB-DF-002',
      tipo: 'APARTAMENTO',
      cidade: 'Águas Claras, Brasília/DF',
      vgv: 62000000.00,
      status: 'LANCAMENTO',
      unidadesTotais: 120,
      unidadesLivres: 68,
      faixaRenda: 'Faixa 3 e SBPE Habitacional',
      imagem: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      evolucaoObra: 15.0,
      valorMedio: 215000.00
    },
    {
      id: 3,
      nome: 'Condomínio Reserva do Parque — Casas Térreas',
      codigo: 'MBB-GO-001',
      tipo: 'CASA EM CONDOMINIO',
      cidade: 'Jardins de Versalhes, Goiânia/GO',
      vgv: 34800000.00,
      status: 'DISPONIVEL',
      unidadesTotais: 85,
      unidadesLivres: 19,
      faixaRenda: 'Faixa 2 e 3 (Cooperativo)',
      imagem: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
      evolucaoObra: 62.0,
      valorMedio: 248000.00
    },
    {
      id: 4,
      nome: 'Loteamento Solar Alvorada — Etapa 1',
      codigo: 'MBB-GO-002',
      tipo: 'LOTE URBANIZADO',
      cidade: 'Luziânia/GO',
      vgv: 22400000.00,
      status: 'DISPONIVEL',
      unidadesTotais: 210,
      unidadesLivres: 88,
      faixaRenda: 'Faixa 1 e 2 (Subsidência Social)',
      imagem: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      evolucaoObra: 84.0,
      valorMedio: 120000.00
    }
  ]);

  const filtrados = empreendimentos.filter(emp => {
    const matchTipo = filtroTipo === 'TODOS' || emp.tipo === filtroTipo;
    const matchBusca =
      emp.nome.toLowerCase().includes(busca.toLowerCase()) ||
      emp.cidade.toLowerCase().includes(busca.toLowerCase()) ||
      emp.codigo.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  const vgvTotal = empreendimentos.reduce((acc, e) => acc + e.vgv, 0);
  const unidadesTotais = empreendimentos.reduce((acc, e) => acc + e.unidadesTotais, 0);
  const unidadesLivres = empreendimentos.reduce((acc, e) => acc + e.unidadesLivres, 0);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner de Gestão Habitacional Coinest */}
      <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
              Carteira de Ativos Habitacionais · DY INVESTI
            </span>
            <span className="text-xs text-[#88A395] font-semibold">Portfólio & Matrizes de Obra</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#15241E] tracking-tight">
            Gestão de Empreendimentos & Produtos
          </h2>
          <p className="text-xs sm:text-sm text-[#526E62] mt-0.5">
            Portfólio de loteamentos, moradias populares e controle de estoque de unidades para alocação direta aos associados.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/espelho-vendas"
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2EBE5] hover:bg-[#F4F7F5] text-[#16382C] text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-[#16382C]" /> Espelho de Lotes
          </Link>
          <button
            onClick={() => alert('Abrindo formulário de cadastro de novo empreendimento na matriz SAP RE-FX')}
            className="px-5 py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C8F2D6]" /> Novo Empreendimento
          </button>
        </div>
      </div>

      {/* Grid de 3 Cards Analíticos Coinest Style */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="bg-white rounded-3xl border border-[#E2EBE5] p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#88A395]">VGV Total em Carteira</span>
            <p className="text-3xl font-black text-[#15241E] mt-1">
              {vgvTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-[11px] font-semibold text-[#10B981] mt-1">+14.5% vs ano anterior</p>
          </div>
          <div className="p-3 bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] rounded-2xl">
            <TrendingUp className="h-6 w-6 text-[#16382C]" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E2EBE5] p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#88A395]">Unidades Cadastradas</span>
            <p className="text-3xl font-black text-[#15241E] mt-1">{unidadesTotais}</p>
            <p className="text-[11px] font-semibold text-[#526E62] mt-1">Em {empreendimentos.length} empreendimentos</p>
          </div>
          <div className="p-3 bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] rounded-2xl">
            <Package className="h-6 w-6 text-[#16382C]" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E2EBE5] p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#88A395]">Unidades Disponíveis</span>
            <p className="text-3xl font-black text-[#10B981] mt-1">{unidadesLivres}</p>
            <p className="text-[11px] font-semibold text-[#16382C] mt-1">Aptas para reserva da fila social</p>
          </div>
          <div className="p-3 bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] rounded-2xl">
            <Key className="h-6 w-6 text-[#16382C]" />
          </div>
        </div>
      </div>

      {/* Barra de Filtro e Busca Coinest */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2EBE5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#88A395]" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por empreendimento, cidade ou código..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-[#15241E] outline-none focus:border-[#16382C] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-[#15241E] outline-none"
          >
            <option value="TODOS">Todas as Tipologias</option>
            <option value="LOTE URBANIZADO">Lotes Urbanizados</option>
            <option value="APARTAMENTO">Apartamentos</option>
            <option value="CASA EM CONDOMINIO">Casas em Condomínio</option>
          </select>
        </div>
      </div>

      {/* Grid de Cards de Alta Resolução de Empreendimentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtrados.map(emp => (
          <div
            key={emp.id}
            className="group bg-white rounded-3xl border border-[#E2EBE5] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Imagem em Alta Resolução */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={emp.imagem}
                  alt={emp.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#16382C] text-white shadow-md">
                    {emp.tipo}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8EE] text-[#16382C]">
                    Reg. {emp.codigo}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-bold text-[#C8F2D6] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {emp.cidade}
                  </p>
                  <h3 className="text-lg font-black tracking-tight leading-snug mt-0.5 text-white">
                    {emp.nome}
                  </h3>
                </div>
              </div>

              {/* Corpo de Informações Comerciais */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-[#F4F7F5] rounded-2xl border border-[#E2EBE5] text-xs">
                  <div>
                    <span className="text-[10px] text-[#88A395] uppercase font-bold block">VGV Estimado</span>
                    <strong className="text-[#15241E] text-xs font-black">
                      {emp.vgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#88A395] uppercase font-bold block">Estoque Disponível</span>
                    <strong className="text-[#10B981] text-xs font-black">
                      {emp.unidadesLivres} de {emp.unidadesTotais} unid.
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#88A395] uppercase font-bold block">Ticket Médio</span>
                    <strong className="text-[#16382C] text-xs font-black">
                      {emp.valorMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                </div>

                {/* Barra de Evolução de Obras */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#526E62] font-semibold">Evolução de Obras & Infraestrutura</span>
                    <strong className="text-[#16382C] font-bold">{emp.evolucaoObra}%</strong>
                  </div>
                  <div className="w-full bg-[#E2EBE5] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#16382C] h-full rounded-full transition-all duration-500"
                      style={{ width: `${emp.evolucaoObra}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#526E62]">
                  <strong>Elegibilidade:</strong> {emp.faixaRenda}
                </p>
              </div>
            </div>

            {/* Ações Inferiores */}
            <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-[#E2EBE5]/60 mt-2">
              <Link
                to="/admin/espelho-vendas"
                className="flex-1 py-2.5 px-4 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Ver Espelho de Lotes</span>
                <ArrowRight className="size-3.5 text-[#C8F2D6]" />
              </Link>
              <button
                onClick={() => alert(`Exportando dossiê de aprovação e matrícula de ${emp.nome}`)}
                className="p-2.5 rounded-2xl border border-[#E2EBE5] text-[#526E62] hover:bg-[#F4F7F5] hover:text-[#16382C] transition-colors"
                title="Baixar Dossiê PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
