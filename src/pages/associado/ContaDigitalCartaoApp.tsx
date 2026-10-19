import { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Sparkles,
  Wallet,
  PiggyBank,
  CheckCircle2,
  Building2,
  Store,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  Barcode,
  Eye,
  EyeOff,
  Copy,
  Clock,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContaDigitalCartaoApp() {
  const [mostrarDados, setMostrarDados] = useState(false);
  const [modalAbatimento, setModalAbatimento] = useState(false);
  const [valorAbatimento, setValorAbatimento] = useState('50.00');

  // Conta Digital e Cartão de Benefícios do Associado
  const conta = {
    numeroConta: '0089412-8',
    agencia: '0001',
    banco: '341 - Diamond BaaS Partner Bank',
    saldoCashback: 50.00, // Saldo inicial gerado pelo pagamento de R$ 50 da adesão
    saldoDisponivel: 124.50,
    economiasTotaisAno: 480.00
  };

  const cartaoDigital = {
    titular: 'FABIANO ASAPH C SILVA',
    numeroMascara: '5582 8841 9412 3019',
    validade: '11/31',
    cvvDinamico: '842',
    cvvSegundosRestantes: 42,
    tipo: 'Diamond Digital Member Pass',
    categoria: 'Associado Titular Habitacional'
  };

  // Rede Credenciada Próxima com Descontos e Cashback
  const parceirosConveniados = [
    {
      id: 'parc-1',
      nome: 'Rede Construforte Materiais de Construção',
      segmento: 'Materiais & Obra',
      descontoImediato: '12%',
      cashbackMoradia: '4.0%',
      distancia: '1.2 km',
      logo: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'parc-2',
      nome: 'Supermercados Campeão Aliança',
      segmento: 'Alimentação & Varejo',
      descontoImediato: '8%',
      cashbackMoradia: '2.5%',
      distancia: '800 m',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'parc-3',
      nome: 'Drogarias São Paulo / Pacheco Parceira',
      segmento: 'Saúde & Medicamentos',
      descontoImediato: '25%',
      cashbackMoradia: '5.0%',
      distancia: '500 m',
      logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'parc-4',
      nome: 'Posto Ipiranga Eixo Sul',
      segmento: 'Combustíveis',
      descontoImediato: 'R$ 0,15/L',
      cashbackMoradia: '2.0%',
      distancia: '2.1 km',
      logo: 'https://images.unsplash.com/photo-1527018607912-01991956f4d0?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const executarAbatimento = () => {
    toast.success(`Abatimento de R$ ${valorAbatimento} agendado na sua próxima cota habitacional!`);
    setModalAbatimento(false);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-5xl mx-auto">
      {/* Top Banner Conta Digital */}
      <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              Conta Digital do Associado & Passaporte de Benefícios
            </span>
            <span className="text-xs text-[#88A395] font-semibold">Conta {conta.numeroConta}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#15241E] tracking-tight">
            Meu Cartão Digital Diamond
          </h2>
          <p className="text-xs sm:text-sm text-[#526E62] mt-0.5">
            Apresente este cartão digital no balcão dos estabelecimentos conveniados para obter descontos imediatos e acumular cashback moradia.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalAbatimento(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <PiggyBank className="w-4 h-4 text-[#C8F2D6]" /> Abater na Parcela da Moradia
          </button>
        </div>
      </div>

      {/* Grid Principal: Cartão Digital 3D + Saldo de Cashback e QR Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna 1: Cartão Digital Exclusivo (7 Colunas) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Cartão Visual High-End Forest Green Coinest */}
          <div className="rounded-3xl bg-[#16382C] text-white p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[290px] border border-[#1F4E3D]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F4E3D] rounded-full blur-3xl opacity-50 pointer-events-none" />

            {/* Linha Superior: Marca Diamond + Badge Digital Pass */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#C8F2D6] uppercase tracking-widest block">
                  ECOSSISTEMA MORAR BEM BRASIL
                </span>
                <h3 className="text-xl font-black tracking-tight text-white mt-0.5">
                  DIAMOND PASS
                </h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#C8F2D6]">
                DIGITAL ONLY
              </div>
            </div>

            {/* Número do Cartão */}
            <div className="relative z-10 my-4">
              <span className="text-[10px] text-[#88A395] uppercase font-bold block mb-1">Número do Cartão Digital</span>
              <p className="font-mono text-lg sm:text-xl tracking-widest text-[#E8F8EE] font-black">
                {mostrarDados ? '5582 8841 9412 3019' : '5582 •••• •••• 3019'}
              </p>
            </div>

            {/* Linha Inferior: Titular + Validade + CVV Dinâmico */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex items-end justify-between text-xs">
              <div>
                <p className="text-[9px] text-[#88A395] uppercase font-bold">Titular</p>
                <p className="font-bold text-white tracking-wide text-xs">{cartaoDigital.titular}</p>
              </div>

              <div>
                <p className="text-[9px] text-[#88A395] uppercase font-bold">Validade</p>
                <p className="font-mono font-bold text-white text-xs">{cartaoDigital.validade}</p>
              </div>

              <div>
                <p className="text-[9px] text-[#88A395] uppercase font-bold">CVV Rotativo</p>
                <p className="font-mono font-black text-[#C8F2D6] text-xs">
                  {cartaoDigital.cvvDinamico} <span className="text-[9px] text-[#88A395]">({cartaoDigital.cvvSegundosRestantes}s)</span>
                </p>
              </div>

              <button
                onClick={() => setMostrarDados(!mostrarDados)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#C8F2D6] transition-colors"
                title={mostrarDados ? 'Ocultar dados' : 'Exibir número completo'}
              >
                {mostrarDados ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Código de Apresentação no Ponto de Venda (Barcode / Token) */}
          <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#E8F8EE] text-[#16382C] rounded-2xl border border-[#C8F2D6]">
                <Barcode className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#15241E]">Código do Associado p/ Scanner</p>
                <p className="text-[11px] text-[#88A395]">Apresente no caixa para aplicar desconto e cashback</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <span className="font-mono text-base font-black text-[#16382C] bg-[#F4F7F5] px-3.5 py-1.5 rounded-xl border border-[#E2EBE5]">
                MBB-8841-9412
              </span>
            </div>
          </div>
        </div>

        {/* Coluna 2: Saldo de Cashback e Abatimento (5 Colunas) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card de Cashback com Conversão da Taxa de R$ 50 */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2EBE5] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]/60">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#10B981]" />
                <h4 className="text-sm font-black text-[#15241E]">Saldo de Cashback Moradia</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F8EE] text-[#16382C]">
                Disponível
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#88A395] uppercase font-bold block">Saldo Acumulado</span>
              <p className="text-3xl sm:text-4xl font-black text-[#16382C] tracking-tight mt-0.5">
                R$ {conta.saldoCashback.toFixed(2)}
              </p>
              <div className="mt-2 p-2.5 rounded-2xl bg-[#E8F8EE] border border-[#C8F2D6] text-xs text-[#16382C] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>
                  <strong>R$ 50,00 da taxa de adesão</strong> já convertidos em cashback para uso imediato.
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between text-[#526E62]">
                <span>Economia total este ano:</span>
                <strong className="text-[#15241E]">R$ {conta.economiasTotaisAno.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-[#526E62]">
                <span>Desconto médio na rede:</span>
                <strong className="text-[#10B981]">14.5%</strong>
              </div>
            </div>

            <button
              onClick={() => setModalAbatimento(true)}
              className="w-full py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <PiggyBank className="w-4 h-4 text-[#C8F2D6]" /> Resgatar Saldo p/ Amortização
            </button>
          </div>

          {/* QR Code Rápido para Pagamentos no Comércio */}
          <div className="bg-white rounded-3xl p-5 border border-[#E2EBE5] shadow-sm flex items-center gap-4">
            <div className="w-20 h-20 bg-white p-2 rounded-2xl border-2 border-[#16382C] flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-[#16382C]" />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-[#15241E]">Pagar via QR Code Diamond</p>
              <p className="text-[#88A395] text-[11px] leading-relaxed">
                Mostre este código para a maquininha ou terminal do lojista parceiro para débito instantâneo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Inferior: Onde Usar Meu Cartão Digital (Rede Credenciada com Descontos) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2EBE5] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2EBE5]/60 gap-3">
          <div>
            <h3 className="text-base font-black text-[#15241E] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#16382C]" /> Rede Credenciada com Desconto & Cashback
            </h3>
            <p className="text-xs text-[#88A395]">
              Estabelecimentos que aceitam o Cartão Digital Diamond perto de você
            </p>
          </div>
          <span className="text-xs font-bold text-[#16382C] bg-[#E8F8EE] px-3 py-1 rounded-full">
            +420 Comércios Parceiros
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {parceirosConveniados.map(parc => (
            <div key={parc.id} className="p-4 rounded-3xl border border-[#E2EBE5] bg-[#F4F7F5] hover:bg-white hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#88A395] uppercase">{parc.segmento}</span>
                  <span className="text-[10px] font-semibold text-[#526E62]">{parc.distancia}</span>
                </div>
                <h4 className="text-xs font-bold text-[#15241E] leading-snug line-clamp-2">
                  {parc.nome}
                </h4>
              </div>

              <div className="pt-2 border-t border-[#E2EBE5]/80 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#526E62]">Desconto Balcão:</span>
                  <span className="font-black text-[#16382C]">{parc.descontoImediato}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#526E62]">Cashback Moradia:</span>
                  <span className="font-bold text-[#10B981]">+{parc.cashbackMoradia}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Abatimento na Moradia */}
      {modalAbatimento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E2EBE5] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2EBE5]">
              <h3 className="text-base font-black text-[#15241E] flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#10B981]" /> Resgatar Saldo p/ Moradia
              </h3>
              <button
                onClick={() => setModalAbatimento(false)}
                className="text-[#88A395] hover:text-[#15241E] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#526E62] leading-relaxed">
              O valor selecionado será abatido diretamente na sua próxima parcela ou cota associativa habitacional.
            </p>

            <div className="p-4 bg-[#F4F7F5] rounded-2xl border border-[#E2EBE5] space-y-2">
              <span className="text-[10px] text-[#88A395] uppercase font-bold block">Valor a Abater</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-[#15241E]">R$</span>
                <input
                  type="text"
                  value={valorAbatimento}
                  onChange={e => setValorAbatimento(e.target.value)}
                  className="w-full text-xl font-black text-[#16382C] bg-white px-3 py-1.5 rounded-xl border border-[#E2EBE5] outline-none"
                />
              </div>
              <span className="text-[11px] text-[#10B981] font-semibold block">
                Saldo disponível atual: R$ {conta.saldoCashback.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setModalAbatimento(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#526E62] hover:bg-[#F4F7F5]"
              >
                Cancelar
              </button>
              <button
                onClick={executarAbatimento}
                className="px-5 py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold shadow-md"
              >
                Confirmar Amortização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
