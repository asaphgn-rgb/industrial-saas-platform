import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Clock, Home, ArrowRight, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AssociadoDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamond-950">Meu Painel</h2>
          <p className="text-sm text-diamond-400 mt-1">Bem-vindo, {user?.email}. Acompanhe seu processo habitacional.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Área Segura (LGPD)
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle className="h-24 w-24 text-diamond-500 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Status Geral</h3>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="h-5 w-5" /></span>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-2xl font-black text-diamond-950">Aprovado</p>
            <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1">
              Etapa 3 de 5 concluída
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="h-24 w-24 text-diamond-500 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pré-análise</h3>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock className="h-5 w-5" /></span>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-2xl font-black text-diamond-950">Em Andamento</p>
            <p className="text-sm text-blue-600 font-medium mt-1 flex items-center gap-1">
              Análise bancária em curso
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="h-24 w-24 text-diamond-500 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Documentação</h3>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><FileText className="h-5 w-5" /></span>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-2xl font-black text-diamond-950">Pendente</p>
            <p className="text-sm text-amber-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> Faltam 2 documentos
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Home className="h-24 w-24 text-diamond-500 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Produto</h3>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Home className="h-5 w-5" /></span>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-2xl font-black text-diamond-950">Vinculado</p>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Residencial Diamante
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Documentos Recentes */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-diamond-950">Meus Documentos</h3>
            <Link to="/associado/documentos" className="text-sm font-semibold text-diamond-600 hover:text-diamond-800 flex items-center gap-1">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {[
              { nome: 'RG / CPF', status: 'Aprovado', data: '10/08/2026', cor: 'text-emerald-600 bg-emerald-50' },
              { nome: 'Comprovante de Residência', status: 'Pendente', data: '-', cor: 'text-amber-600 bg-amber-50' },
              { nome: 'Comprovante de Renda', status: 'Pendente', data: '-', cor: 'text-amber-600 bg-amber-50' },
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${doc.cor}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-diamond-950 text-sm">{doc.nome}</p>
                    <p className="text-xs text-slate-500">Atualizado em: {doc.data}</p>
                  </div>
                </div>
                {doc.status === 'Aprovado' ? (
                  <button className="p-2 text-slate-400 hover:text-diamond-600 hover:bg-diamond-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                ) : (
                  <Link to="/associado/documentos" className="text-xs font-semibold text-amber-600 hover:text-amber-700 underline">
                    Enviar
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Informações Úteis */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-diamond-950">Avisos e Comunicados</h3>
          </div>
          <div className="p-6">
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-5 flex gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">Falta pouco para concluir sua análise!</h4>
                <p className="mt-1 text-sm text-blue-800 leading-relaxed">
                  Para darmos andamento ao seu processo de aprovação, por favor envie os documentos pendentes listados ao lado.
                </p>
                <Link to="/associado/documentos" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                  Ir para pasta digital <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}