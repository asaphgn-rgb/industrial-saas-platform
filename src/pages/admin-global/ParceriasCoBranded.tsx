import { useState } from 'react';
import {
  Building2,
  Plus,
  Store,
  CreditCard,
  Percent,
  CheckCircle2,
  Search,
  ExternalLink,
  ShieldCheck,
  Download,
  Sliders,
  DollarSign,
  Palette,
  Eye,
  Layers,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { EmpresaParceiraWhitelabel } from '@/types/ecosystem';

export default function ParceriasCoBranded() {
  const [busca, setBusca] = useState('');
  const [modalNovo, setModalNovo] = useState(false);

  // Empresas Privadas Credenciadas com Bandeira Diamond (Co-Branded White Label)
  const [empresas, setEmpresas] = useState<EmpresaParceiraWhitelabel[]>([
    {
      id: 'emp-wb-01',
      razao_social: 'Construforte Materiais de Construção S.A.',
      nome_fantasia: 'Construforte Diamond Card',
      cnpj: '18.492.102/0001-88',
      slug_personalizado: 'construforte',
      segmento_atuacao: 'Materiais de Construção & Obra',
      cor_primaria_hex: '#16382C',
      cor_secundaria_hex: '#C8F2D6',
      tipo_convenio: 'CO_BRANDED_BENEFICIOS',
      desconto_oferecido_pct: 12.00,
      taxa_cashback_associado_pct: 4.00,
      taxa_mdr_repasse_pct: 1.80,
      status_parceria: 'ATIVO',
      cartoes_emitidos_count: 4210,
      created_at: '2026-02-15'
    },
    {
      id: 'emp-wb-02',
      razao_social: 'Supermercados Campeão Aliança Ltda.',
      nome_fantasia: 'Campeão Card Mais Diamond',
      cnpj: '09.812.441/0001-32',
      slug_personalizado: 'campeao-super',
      segmento_atuacao: 'Varejo & Alimentação',
      cor_primaria_hex: '#1E3A8A',
      cor_secundaria_hex: '#93C5FD',
      tipo_convenio: 'CO_BRANDED_BENEFICIOS',
      desconto_oferecido_pct: 8.00,
      taxa_cashback_associado_pct: 2.50,
      taxa_mdr_repasse_pct: 1.50,
      status_parceria: 'ATIVO',
      cartoes_emitidos_count: 12850,
      created_at: '2026-03-01'
    },
    {
      id: 'emp-wb-03',
      razao_social: 'Auto Postos União Centro-Oeste Eireli',
      nome_fantasia: 'Postos União Diamond Frota',
      cnpj: '24.109.832/0001-90',
      slug_personalizado: 'postos-uniao',
      segmento_atuacao: 'Combustíveis & Conveniência',
      cor_primaria_hex: '#B45309',
      cor_secundaria_hex: '#FDE68A',
      tipo_convenio: 'CO_BRANDED_BENEFICIOS',
      desconto_oferecido_pct: 5.00,
      taxa_cashback_associado_pct: 2.00,
      taxa_mdr_repasse_pct: 1.60,
      status_parceria: 'ATIVO',
      cartoes_emitidos_count: 3100,
      created_at: '2026-04-10'
    }
  ]);

  const [novaEmpresa, setNovaEmpresa] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    slug: '',
    segmento: 'Materiais de Construção',
    corPrimaria: '#16382C',
    corSecundaria: '#C8F2D6',
    descontoPct: '10.0',
    cashbackPct: '3.0',
    mdrPct: '1.8'
  });

  const cadastrarEmpresa = (e: React.FormEvent) => {
    e.preventDefault();
    const nova: EmpresaParceiraWhitelabel = {
      id: `emp-wb-${Date.now()}`,
      razao_social: novaEmpresa.razaoSocial,
      nome_fantasia: novaEmpresa.nomeFantasia,
      cnpj: novaEmpresa.cnpj,
      slug_personalizado: novaEmpresa.slug,
      segmento_atuacao: novaEmpresa.segmento,
      cor_primaria_hex: novaEmpresa.corPrimaria,
      cor_secundaria_hex: novaEmpresa.corSecundaria,
      tipo_convenio: 'CO_BRANDED_BENEFICIOS',
      desconto_oferecido_pct: parseFloat(novaEmpresa.descontoPct),
      taxa_cashback_associado_pct: parseFloat(novaEmpresa.cashbackPct),
      taxa_mdr_repasse_pct: parseFloat(novaEmpresa.mdrPct),
      status_parceria: 'ATIVO',
      cartoes_emitidos_count: 0,
      created_at: new Date().toISOString()
    };
    setEmpresas([nova, ...empresas]);
    setModalNovo(false);
    toast.success("Empresa parceira credenciada na Bandeira Diamond com sucesso!");
  };

  const empresasFiltradas = empresas.filter(e =>
    e.nome_fantasia.toLowerCase().includes(busca.toLowerCase()) ||
    e.razao_social.toLowerCase().includes(busca.toLowerCase()) ||
    e.segmento_atuacao.toLowerCase().includes(busca.toLowerCase()) ||
    e.cnpj.includes(busca)
  );

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner White Label B2B */}
      <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#10B981]" />
              BaaS White Label · Emissão Co-Branded Bandeira Diamond
            </span>
            <span className="text-xs text-[#88A395] font-semibold">Expansão Empresarial B2B</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#15241E] tracking-tight">
            Parcerias Empresariais Co-Branded
          </h2>
          <p className="text-xs sm:text-sm text-[#526E62] mt-0.5">
            Empresas privadas emitem seus próprios cartões personalizados com a bandeira Diamond, integradas à nossa rede e BaaS.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalNovo(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C8F2D6]" /> Credenciar Nova Empresa
          </button>
        </div>
      </div>

      {/* Grid de 3 Indicadores de Emissão B2B */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-xs font-bold uppercase text-[#88A395]">Empresas com Bandeira Diamond</span>
          <p className="text-3xl font-black text-[#15241E] mt-1">{empresas.length}</p>
          <span className="text-[11px] font-semibold text-[#10B981] mt-0.5 block">Varejo, materiais e combustíveis</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-xs font-bold uppercase text-[#88A395]">Cartões Co-Branded Emitidos</span>
          <p className="text-3xl font-black text-[#16382C] mt-1">
            {empresas.reduce((acc, e) => acc + e.cartoes_emitidos_count, 0).toLocaleString()}
          </p>
          <span className="text-[11px] font-semibold text-[#526E62] mt-0.5 block">Base ativa circulante</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm">
          <span className="text-xs font-bold uppercase text-[#88A395]">MDR Médio de Repasse</span>
          <p className="text-3xl font-black text-[#10B981] mt-1">1.63%</p>
          <span className="text-[11px] font-semibold text-[#16382C] mt-0.5 block">Liquidação D+1 automatizada via PIX</span>
        </div>
      </div>

      {/* Grid de Cartões Personalizados das Empresas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-black text-[#15241E]">
            Modelos de Cartões Co-Branded em Circulação
          </h3>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#88A395]" />
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por parceiro, segmento..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-[#E2EBE5] bg-white text-[#15241E] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {empresasFiltradas.map(emp => (
            <div key={emp.id} className="bg-white rounded-3xl border border-[#E2EBE5] p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
              {/* Preview 3D do Cartão Co-Branded da Empresa */}
              <div
                className="w-full aspect-[1.586/1] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
                style={{ backgroundColor: emp.cor_primaria_hex }}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <span className="text-[9px] font-bold tracking-wider uppercase block opacity-80">
                      BANDEIRA DIAMOND CO-BRANDED
                    </span>
                    <h4 className="text-sm font-black tracking-tight mt-0.5">
                      {emp.nome_fantasia}
                    </h4>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                    style={{ backgroundColor: emp.cor_secundaria_hex, color: emp.cor_primaria_hex }}
                  >
                    WHITE LABEL
                  </span>
                </div>

                <div className="relative z-10">
                  <p className="font-mono text-xs tracking-widest opacity-90 font-bold">
                    5582 •••• •••• {emp.cartoes_emitidos_count > 0 ? '9412' : '0000'}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] opacity-80 pt-2 border-t border-white/20">
                  <span>Membro Conveniado</span>
                  <span className="font-bold">DIAMOND NETWORK</span>
                </div>
              </div>

              {/* Dados Comerciais da Parceria */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#526E62]">
                  <span>Segmento:</span>
                  <strong className="text-[#15241E]">{emp.segmento_atuacao}</strong>
                </div>
                <div className="flex justify-between items-center text-[#526E62]">
                  <span>Desconto Imediato no Balcão:</span>
                  <strong className="text-[#16382C] font-black">{emp.desconto_oferecido_pct}%</strong>
                </div>
                <div className="flex justify-between items-center text-[#526E62]">
                  <span>Cashback Gerado p/ Moradia:</span>
                  <strong className="text-[#10B981] font-black">{emp.taxa_cashback_associado_pct}%</strong>
                </div>
                <div className="flex justify-between items-center text-[#526E62]">
                  <span>Cartões Ativos Emitidos:</span>
                  <strong className="text-[#15241E]">{emp.cartoes_emitidos_count.toLocaleString()}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2EBE5]/60 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8EE] text-[#16382C]">
                  {emp.status_parceria}
                </span>
                <button
                  onClick={() => alert(`Gerenciando emissões da empresa ${emp.nome_fantasia}.`)}
                  className="text-[#16382C] font-bold hover:underline inline-flex items-center gap-1"
                >
                  Gerenciar Emissões <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Credenciamento de Nova Empresa */}
      {modalNovo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <form onSubmit={cadastrarEmpresa} className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-[#E2EBE5] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2EBE5]">
              <h3 className="text-base font-black text-[#15241E] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#16382C]" /> Credenciar Parceiro Co-Branded
              </h3>
              <button
                type="button"
                onClick={() => setModalNovo(false)}
                className="text-[#88A395] hover:text-[#15241E] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-[#15241E]">Razão Social da Empresa</label>
                <input
                  type="text"
                  required
                  value={novaEmpresa.razaoSocial}
                  onChange={e => setNovaEmpresa({ ...novaEmpresa, razaoSocial: e.target.value })}
                  placeholder="Ex: Comercial de Alimentos Brasil S.A."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2EBE5] bg-[#F4F7F5] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#15241E]">Nome Fantasia no Cartão</label>
                <input
                  type="text"
                  required
                  value={novaEmpresa.nomeFantasia}
                  onChange={e => setNovaEmpresa({ ...novaEmpresa, nomeFantasia: e.target.value })}
                  placeholder="Ex: Supermercado Aliança Diamond"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2EBE5] bg-[#F4F7F5] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#15241E]">CNPJ</label>
                <input
                  type="text"
                  required
                  value={novaEmpresa.cnpj}
                  onChange={e => setNovaEmpresa({ ...novaEmpresa, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2EBE5] bg-[#F4F7F5] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#15241E]">Segmento de Atuação</label>
                <select
                  value={novaEmpresa.segmento}
                  onChange={e => setNovaEmpresa({ ...novaEmpresa, segmento: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2EBE5] bg-[#F4F7F5] outline-none"
                >
                  <option value="Materiais de Construção">Materiais de Construção</option>
                  <option value="Supermercados & Varejo">Supermercados & Varejo</option>
                  <option value="Saúde & Farmácias">Saúde & Farmácias</option>
                  <option value="Postos de Combustíveis">Postos de Combustíveis</option>
                  <option value="Educação & Cursos">Educação & Cursos</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#15241E]">Cor do Cartão (Hex)</label>
                <input
                  type="text"
                  value={novaEmpresa.corPrimaria}
                  onChange={e => setNovaEmpresa({ ...novaEmpresa, corPrimaria: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2EBE5] bg-[#F4F7F5] outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#15241E]">Desconto Balcão (%)</label>
                <input
                  type="text"
                  value={novaEmpresa.descontoPct}
                  onChange={e => setNovaEmpresa({ ...novaEmpresa, descontoPct: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2EBE5] bg-[#F4F7F5] outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#15241E]">Cashback p/ Associado (%)</label>
                <input
                  type="text"
                  value={novaEmpresa.cashbackPct}
                  onChange={e => setNovaEmpresa({ ...novaEmpresa, cashbackPct: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2EBE5] bg-[#F4F7F5] outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2EBE5]">
              <button
                type="button"
                onClick={() => setModalNovo(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#526E62]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#16382C] text-white text-xs font-bold shadow-md hover:bg-[#112B22]"
              >
                Salvar & Emitir Cartão
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
