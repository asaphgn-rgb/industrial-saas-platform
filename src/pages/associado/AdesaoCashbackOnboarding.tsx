import { useState } from 'react';
import {
  Sparkles,
  QrCode,
  Copy,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Wallet,
  PiggyBank,
  Check,
  FileCheck2,
  DollarSign,
  Lock,
  Building2,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdesaoCashbackOnboarding() {
  const [etapa, setEtapa] = useState<'CADASTRO' | 'PAGAMENTO' | 'CONCLUIDO'>('CADASTRO');
  const [pixCopiado, setPixCopiado] = useState(false);
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  const [formData, setFormData] = useState({
    nomeCompleto: 'Fabiano Asaph C. Silva',
    cpf: '849.201.391-44',
    email: 'ceo@morarbembrasil.com',
    telefone: '(61) 98124-8899',
    rendaFamiliar: '6500.00',
    possuiFgts: true,
    saldoFgts: '28000.00',
    tempoRegistroEmprego: '36'
  });

  const chavePixCopiaCola = "00020126580014br.gov.bcb.pix0136mbb-diamond-adesao-cashback-50-2026520400005303986540550.005802BR5925MORAR BEM BRASIL COOPERAT6008BRASILIA62070503***63048A1B";

  const copiarPix = () => {
    navigator.clipboard.writeText(chavePixCopiaCola);
    setPixCopiado(true);
    toast.success("Código PIX Copia-e-Cola copiado com sucesso!");
    setTimeout(() => setPixCopiado(false), 3000);
  };

  const simularConfirmacaoPagamento = () => {
    setLoadingPagamento(true);
    setTimeout(() => {
      setLoadingPagamento(false);
      setEtapa('CONCLUIDO');
      toast.success("Pagamento de R$ 50,00 identificado! R$ 50,00 creditados em Cashback.");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in select-none">
      {/* Top Banner Explicativo */}
      <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6] inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            Adesão Inteligente com 100% de Cashback
          </span>
          <span className="text-xs text-[#88A395] font-semibold">Padrão Caixa Habitação + BaaS Diamond</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#15241E] tracking-tight">
          Habilitação Cadastral & Pré-Análise de Crédito
        </h2>
        <p className="text-xs sm:text-sm text-[#526E62] mt-1 leading-relaxed">
          Pague a taxa única de validação cadastral de <strong>R$ 50,00</strong> e receba <strong>100% do valor de volta (R$ 50,00)</strong> em saldo de cashback na sua Conta Digital Diamond para usar no comércio ou abater na sua moradia.
        </p>

        {/* Stepper de Progresso */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-[#E2EBE5]/60 text-xs">
          <div className={`p-2.5 rounded-2xl border text-center transition-all ${
            etapa === 'CADASTRO' ? 'bg-[#16382C] text-white border-[#16382C] font-bold' : 'bg-[#F4F7F5] text-[#526E62] border-[#E2EBE5]'
          }`}>
            1. Dados Básicos
          </div>
          <div className={`p-2.5 rounded-2xl border text-center transition-all ${
            etapa === 'PAGAMENTO' ? 'bg-[#16382C] text-white border-[#16382C] font-bold' : 'bg-[#F4F7F5] text-[#526E62] border-[#E2EBE5]'
          }`}>
            2. Taxa R$ 50 (PIX)
          </div>
          <div className={`p-2.5 rounded-2xl border text-center transition-all ${
            etapa === 'CONCLUIDO' ? 'bg-[#16382C] text-white border-[#16382C] font-bold' : 'bg-[#F4F7F5] text-[#526E62] border-[#E2EBE5]'
          }`}>
            3. Cashback & Laudo
          </div>
        </div>
      </div>

      {/* ETAPA 1: CADASTRO BÁSICO */}
      {etapa === 'CADASTRO' && (
        <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-7 shadow-sm space-y-5">
          <h3 className="text-base font-black text-[#15241E] border-b border-[#E2EBE5]/60 pb-3">
            Informações para Pré-Análise Habitacional
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">Nome Completo do Titular</label>
              <input
                type="text"
                value={formData.nomeCompleto}
                onChange={e => setFormData({ ...formData, nomeCompleto: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">CPF</label>
              <input
                type="text"
                value={formData.cpf}
                disabled
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#EBF2EE] text-xs text-[#526E62] font-mono outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">E-mail Principal</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">WhatsApp / Telefone</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">Renda Familiar Bruta Mensal (R$)</label>
              <input
                type="text"
                value={formData.rendaFamiliar}
                onChange={e => setFormData({ ...formData, rendaFamiliar: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15241E]">Saldo Estimado de FGTS (R$)</label>
              <input
                type="text"
                value={formData.saldoFgts}
                onChange={e => setFormData({ ...formData, saldoFgts: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] text-xs text-[#15241E] font-medium outline-none focus:border-[#16382C] focus:bg-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#E8F8EE] border border-[#C8F2D6] flex items-start gap-3 text-xs text-[#16382C]">
            <ShieldCheck className="w-5 h-5 shrink-0 text-[#10B981] mt-0.5" />
            <div>
              <p className="font-bold">Garantia de Conversão em Cashback:</p>
              <p className="text-[#526E62] mt-0.5">
                Ao prosseguir, você pagará a taxa única de R$ 50,00. Assim que o pagamento for liquidado via PIX, os <strong>R$ 50,00 são creditados na sua Conta Digital Diamond</strong> para uso imediato em nossa rede credenciada.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setEtapa('PAGAMENTO')}
              className="px-6 py-3 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              Prosseguir para Pagamento (R$ 50,00) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 2: PAGAMENTO PIX R$ 50 COM CONVERSÃO EM CASHBACK */}
      {etapa === 'PAGAMENTO' && (
        <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold text-[#88A395] uppercase tracking-wider">Liquidação Instantânea D+0</span>
            <h3 className="text-2xl font-black text-[#15241E]">Pagamento da Taxa de Adesão</h3>
            <p className="text-xs text-[#526E62]">Escaneie o QR Code ou use o código PIX Copia-e-Cola</p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-[#F4F7F5] rounded-3xl border border-[#E2EBE5] max-w-sm mx-auto space-y-4">
            {/* QR Code Simulado Alta Fidelidade */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl border-2 border-[#16382C] shadow-md flex items-center justify-center relative">
              <QrCode className="w-full h-full text-[#16382C]" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="px-2 py-0.5 rounded-lg bg-[#C8F2D6] text-[#16382C] text-[10px] font-black border border-[#16382C]">
                  R$ 50,00
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl font-black text-[#15241E]">R$ 50,00</p>
              <p className="text-[11px] text-[#10B981] font-bold">100% Revertido em Saldo de Cashback</p>
            </div>

            <button
              onClick={copiarPix}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                pixCopiado
                  ? 'bg-[#10B981] text-white border-[#10B981]'
                  : 'bg-white text-[#16382C] border-[#E2EBE5] hover:bg-[#E8F8EE]'
              }`}
            >
              {pixCopiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {pixCopiado ? 'Código Copiado!' : 'Copiar Chave PIX'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E2EBE5]/60">
            <button
              onClick={() => setEtapa('CADASTRO')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#526E62] hover:bg-[#F4F7F5]"
            >
              ← Voltar aos Dados
            </button>

            <button
              onClick={simularConfirmacaoPagamento}
              disabled={loadingPagamento}
              className="px-6 py-2.5 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              {loadingPagamento ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Confirmando no Banco Central...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#C8F2D6]" /> Já Efetuei o Pagamento
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 3: SUCESSO, CASHBACK CREDITADO & LAUDO PRÉ-ANÁLISE */}
      {etapa === 'CONCLUIDO' && (
        <div className="rounded-3xl border border-[#E2EBE5] bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#E8F8EE] text-[#10B981] mx-auto flex items-center justify-center border border-[#C8F2D6]">
              <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
            </div>
            <h3 className="text-2xl font-black text-[#15241E]">Adesão Concluída & Cashback Liberado!</h3>
            <p className="text-xs sm:text-sm text-[#526E62] max-w-lg mx-auto">
              Sua conta digital foi ativada com sucesso e a pré-análise de crédito habitacional já está disponível para consulta.
            </p>
          </div>

          {/* Card de Cashback Creditado */}
          <div className="p-6 rounded-3xl bg-[#16382C] text-white relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 relative z-10">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#C8F2D6] text-[#16382C]">
                Saldo Disponível na Conta Digital
              </span>
              <p className="text-3xl font-black text-white mt-1">R$ 50,00</p>
              <p className="text-xs text-[#C8F2D6]">
                Cashback imediato pronto para uso nos comércios parceiros ou abatimento da 1ª parcela.
              </p>
            </div>
            <div className="relative z-10">
              <a
                href="/associado/cartao-digital"
                className="px-5 py-2.5 rounded-2xl bg-[#C8F2D6] hover:bg-[#b5e8c4] text-[#16382C] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Wallet className="w-4 h-4" /> Abrir Meu Cartão Digital
              </a>
            </div>
          </div>

          {/* Resumo da Pré-Análise de Crédito */}
          <div className="p-5 rounded-3xl bg-[#F4F7F5] border border-[#E2EBE5] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2EBE5]">
              <span className="text-xs font-bold text-[#15241E] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#16382C]" /> Laudo Consultivo de Crédito Habitacional
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8EE] text-[#16382C] border border-[#C8F2D6]">
                Pré-Aprovado
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#88A395] uppercase font-bold block">Capacidade Estimada</span>
                <span className="font-black text-[#15241E] text-sm">R$ 220.000,00</span>
              </div>
              <div>
                <span className="text-[10px] text-[#88A395] uppercase font-bold block">FGTS Aplicável</span>
                <span className="font-bold text-[#16382C] text-sm">R$ 28.000,00</span>
              </div>
              <div>
                <span className="text-[10px] text-[#88A395] uppercase font-bold block">Parcela Estimada (SAC)</span>
                <span className="font-bold text-[#15241E] text-sm">R$ 1.180,00</span>
              </div>
              <div>
                <span className="text-[10px] text-[#88A395] uppercase font-bold block">Status da Fila</span>
                <span className="font-bold text-[#10B981] text-sm">Apto p/ Convocação</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <a
              href="/associado/radar-imoveis"
              className="px-6 py-3 rounded-2xl bg-[#16382C] hover:bg-[#112B22] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              Explorar Radar de Imóveis Compatíveis <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
