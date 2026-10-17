import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, Home, ArrowRight, ShieldCheck, Download, AlertCircle, Building2, Flame, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AssociadoDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Portal do Mutuário & Associado
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">Meu Painel Habitacional</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Bem-vindo, {user?.email}. Acompanhe seu status cadastral, documentação e pré-aprovação de crédito.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/simulador-santander"
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#EC0000] hover:bg-[#CC0000] rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
          >
            Simular Financiamento
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Área Segura (LGPD)
          </span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1.5">Status Geral</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">Aprovado</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Etapa 3 de 5 concluída
              </p>
            </div>
            <div className="rounded-2xl p-3 bg-emerald-50 border border-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1.5">Pré-análise Bancária</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">Em Andamento</p>
              <p className="text-[11px] font-semibold text-blue-600 mt-1 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Parecer Santander / Caixa
              </p>
            </div>
            <div className="rounded-2xl p-3 bg-blue-50 border border-blue-100 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1.5">Documentação</p>
              <p className="text-2xl font-black text-[#EC0000] tracking-tight">Pendente</p>
              <p className="text-[11px] font-semibold text-amber-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Faltam 2 comprovantes
              </p>
            </div>
            <div className="rounded-2xl p-3 bg-red-50 border border-red-100 text-[#EC0000]">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1.5">Empreendimento</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">Vinculado</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Residencial Diamante Sul</p>
            </div>
            <div className="rounded-2xl p-3 bg-slate-100 border border-slate-200 text-slate-800">
              <Home className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Documentos Recentes */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Minha Pasta Digital de Documentos</h3>
            <Link to="/associado/documentos" className="text-xs font-bold text-[#EC0000] hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {[
              { nome: 'RG / CPF dos Proponentes', status: 'Aprovado', data: '10/08/2026', cor: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
              { nome: 'Comprovante de Residência Atualizado', status: 'Pendente', data: '-', cor: 'text-amber-600 bg-amber-50 border-amber-100' },
              { nome: 'Holerites Recentes (Últimos 3 Meses)', status: 'Pendente', data: '-', cor: 'text-amber-600 bg-amber-50 border-amber-100' },
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${doc.cor}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{doc.nome}</p>
                    <p className="text-xs text-slate-400">Atualização: {doc.data}</p>
                  </div>
                </div>
                {doc.status === 'Aprovado' ? (
                  <button className="p-2 text-slate-400 hover:text-[#EC0000] hover:bg-red-50 rounded-xl transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                ) : (
                  <Link to="/associado/documentos" className="text-xs font-bold text-[#EC0000] hover:underline bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                    Enviar Arquivo
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Informações Úteis */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="p-2.5 bg-red-50 rounded-xl text-[#EC0000]">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Falta pouco para concluir sua habilitação!</h4>
                <p className="text-xs text-slate-400">Esteira de concessão de subsídio e crédito imobiliário</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Para formalizarmos o envio da sua pasta para análise definitiva do agente financeiro (Caixa / Santander), por favor realize o upload dos 2 comprovantes pendentes ao lado.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
              <p>• Validade dos holerites: emitidos nos últimos 60 dias;</p>
              <p>• Comprovante de endereço em nome do titular ou cônjuge;</p>
              <p>• Fotos nítidas ou arquivos em formato PDF legível.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 flex justify-between items-center text-xs">
            <span className="text-slate-400">Protocolo associativo digital</span>
            <Link to="/associado/documentos" className="font-bold text-[#EC0000] hover:underline flex items-center gap-1">
              Acessar Pasta Digital <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
