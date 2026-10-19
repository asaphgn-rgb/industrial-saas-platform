import { useState } from 'react';
import {
  Home,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Building2,
  DollarSign,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Bell,
  Heart,
  Eye,
  Plus,
  Layers,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { TipoImovelDesejado } from '@/types/ecosystem';

export default function RadarImoveisDesejados() {
  const [abaAtiva, setAbaAtiva] = useState<'DISPONIVEIS' | 'MEU_RADAR'>('DISPONIVEIS');
  const [tipoFiltro, setTipoFiltro] = useState<string>('TODOS');
  const [busca, setBusca] = useState('');

  // Formulário do Radar de Imóvel Desejado
  const [meuRadar, setMeuRadar] = useState({
    tipoImovel: 'LOTE' as TipoImovelDesejado,
    bairrosInteresse: 'Tororó, Jardim Botânico, São Sebastião, Santa Maria',
    cidadeUf: 'Brasília/DF',
    valorMaximo: '220000.00',
    valorEntrada: '25000.00',
    possuiFgts: true,
    valorFgts: '28000.00',
    quartosMinimos: 2,
    vagasMinimas: 1
  });

  // Imóveis Disponíveis na Carteira MBB para Comercialização Imediata
  const imoveisCarteira = [
    {
      id: 'imv-01',
      titulo: 'Lote Residencial Quadra 01 - Lote 01',
      empreendimento: 'Residencial Diamante Sul',
      localizacao: 'Tororó, Brasília/DF',
      tipo: 'LOTE',
      metragem: 250,
      quartos: 0,
      vagas: 0,
      valorTabela: 185000.00,
      valorComDescontoMBB: 168000.00,
      compatibilidadeScoring: 98,
      status: 'DISPONIVEL',
      imagem: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
      destaque: 'Ideal para o seu perfil aprovado de R$ 220.000'
    },
    {
      id: 'imv-02',
      titulo: 'Apartamento 2 Qts c/ Varanda e Vaga',
      empreendimento: 'Edifício Parque das Águas',
      localizacao: 'Águas Claras, Brasília/DF',
      tipo: 'APARTAMENTO',
      metragem: 62,
      quartos: 2,
      vagas: 1,
      valorTabela: 240000.00,
      valorComDescontoMBB: 215000.00,
      compatibilidadeScoring: 92,
      status: 'DISPONIVEL',
      imagem: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      destaque: 'Financiamento com subsídio associativo'
    },
    {
      id: 'imv-03',
      titulo: 'Casa Térrea 3 Quartos em Condomínio',
      empreendimento: 'Residencial Aliança Norte',
      localizacao: 'Sobradinho II, Brasília/DF',
      tipo: 'CASA',
      metragem: 88,
      quartos: 3,
      vagas: 2,
      valorTabela: 280000.00,
      valorComDescontoMBB: 248000.00,
      compatibilidadeScoring: 85,
      status: 'DISPONIVEL',
      imagem: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
      destaque: 'Uso de FGTS aceito como entrada integral'
    }
  ];

  const salvarRadar = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Radar de Imóveis configurado com sucesso! Você será alertado assim que houver matching.");
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner do Radar Inteligente */}
      <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              Motor Inteligente de Matching Habitacional
            </span>
            <span className="text-xs text-[#88A395] font-semibold">Carteira MBB + Oportunidades Sob Demanda</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#15241E] tracking-tight">
            Radar de Imóveis & Oportunidades
          </h2>
          <p className="text-xs sm:text-sm text-[#526E62] mt-0.5">
            Encontre unidades disponíveis em nossa carteira com condições cooperativas ou cadastre o imóvel desejado para busca ativa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-[#F4F7F5] rounded-2xl border border-[#E2EBE5]">
            <button
              onClick={() => setAbaAtiva('DISPONIVEIS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                abaAtiva === 'DISPONIVEIS'
                  ? 'bg-[#16382C] text-white shadow-sm'
                  : 'text-[#526E62] hover:text-[#16382C]'
              }`}
            >
              Imóveis em Carteira ({imoveisCarteira.length})
            </button>
            <button
              onClick={() => setAbaAtiva('MEU_RADAR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                abaAtiva === 'MEU_RADAR'
                  ? 'bg-[#16382C] text-white shadow-sm'
                  : 'text-[#526E62] hover:text-[#16382C]'
              }`}
            >
              Meu Radar de Preferências
            </button>
          </div>
        </div>
      </div>

      {/* ABA 1: IMÓVEIS DISPONÍVEIS NA CARTEIRA MBB */}
      {abaAtiva === 'DISPONIVEIS' && (
        <div className="space-y-6">
          {/* Barra de Filtro e Busca */}
          <div className="bg-white p-4 rounded-3xl border border-[#E2EBE5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#88A395]" />
              <input
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar por bairro, empreendimento..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-[#15241E] outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={tipoFiltro}
                onChange={e => setTipoFiltro(e.target.value)}
                className="px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-[#15241E] outline-none"
              >
                <option value="TODOS">Todos os Tipos</option>
                <option value="LOTE">Lotes Urbanizados</option>
                <option value="APARTAMENTO">Apartamentos</option>
                <option value="CASA">Casas</option>
              </select>
            </div>
          </div>

          {/* Grid de Imóveis em Destaque */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {imoveisCarteira.map(imv => (
              <div key={imv.id} className="bg-white rounded-3xl border border-[#E2EBE5] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={imv.imagem}
                    alt={imv.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#16382C] text-white shadow-md">
                    <Sparkles className="w-3 h-3 text-[#C8F2D6]" /> {imv.compatibilidadeScoring}% de Compatibilidade
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white/95 text-[#16382C] backdrop-blur-sm border border-[#E2EBE5]">
                    {imv.tipo}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-[#88A395] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#16382C]" /> {imv.localizacao}
                    </p>
                    <h4 className="text-base font-black text-[#15241E] leading-snug group-hover:text-[#16382C] transition-colors">
                      {imv.titulo}
                    </h4>
                    <p className="text-xs text-[#526E62]">
                      {imv.metragem}m² {imv.quartos > 0 ? `· ${imv.quartos} quartos · ${imv.vagas} vaga` : '· Lote plano urbanizado'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E2EBE5]/60 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-[#88A395] line-through block">
                          Tabela: {imv.valorTabela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="text-lg font-black text-[#16382C]">
                          {imv.valorComDescontoMBB.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6]">
                        Desconto MBB
                      </span>
                    </div>

                    <p className="text-[11px] font-medium text-[#10B981] bg-[#F4F7F5] p-2 rounded-xl border border-[#E2EBE5]">
                      ✓ {imv.destaque}
                    </p>

                    <button
                      onClick={() => alert(`Proposta iniciada para ${imv.titulo}. O laudo de crédito será anexado automaticamente.`)}
                      className="w-full py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      Reservar com Minha Pré-Análise <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: FORMULÁRIO DO RADAR DE IMÓVEIS DESEJADOS */}
      {abaAtiva === 'MEU_RADAR' && (
        <form onSubmit={salvarRadar} className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#E2EBE5]/60 pb-3">
            <h3 className="text-base font-black text-[#15241E]">
              Configurar Perfil do Imóvel dos Sonhos (Matching Ativo)
            </h3>
            <p className="text-xs text-[#526E62] mt-0.5">
              Caso não encontre a unidade ideal em estoque, nossa inteligência fará a busca contínua com prioridade de compra.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">Tipo de Imóvel Pretendido</label>
              <select
                value={meuRadar.tipoImovel}
                onChange={e => setMeuRadar({ ...meuRadar, tipoImovel: e.target.value as TipoImovelDesejado })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none"
              >
                <option value="LOTE">Lote Urbanizado para Construção</option>
                <option value="APARTAMENTO">Apartamento Pronto ou na Planta</option>
                <option value="CASA">Casa Residencial</option>
                <option value="INDIFERENTE">Qualquer Oportunidade Aprovada</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">Cidade / UF de Interesse</label>
              <input
                type="text"
                value={meuRadar.cidadeUf}
                onChange={e => setMeuRadar({ ...meuRadar, cidadeUf: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#15241E]">Bairros e Regiões de Preferência</label>
              <input
                type="text"
                value={meuRadar.bairrosInteresse}
                onChange={e => setMeuRadar({ ...meuRadar, bairrosInteresse: e.target.value })}
                placeholder="Ex: Tororó, Jardim Botânico, Águas Claras, Samambaia..."
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">Valor Máximo do Imóvel (R$)</label>
              <input
                type="text"
                value={meuRadar.valorMaximo}
                onChange={e => setMeuRadar({ ...meuRadar, valorMaximo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">Recurso Próprio para Entrada (R$)</label>
              <input
                type="text"
                value={meuRadar.valorEntrada}
                onChange={e => setMeuRadar({ ...meuRadar, valorEntrada: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">Número Mínimo de Quartos</label>
              <input
                type="number"
                min={1}
                max={5}
                value={meuRadar.quartosMinimos}
                onChange={e => setMeuRadar({ ...meuRadar, quartosMinimos: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">Vagas de Garagem Mínimas</label>
              <input
                type="number"
                min={0}
                max={4}
                value={meuRadar.vagasMinimas}
                onChange={e => setMeuRadar({ ...meuRadar, vagasMinimas: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#16382C] font-bold">
              <Bell className="w-4 h-4 text-[#16382C]" />
              <span>Notificações Automáticas ativadas no WhatsApp e E-mail</span>
            </div>
            <span className="text-[#88A395]">Matching diário em tempo real</span>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C8F2D6]" /> Salvar Preferências no Radar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
