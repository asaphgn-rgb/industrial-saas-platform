import { Folder, Key, Star, FileText, UploadCloud } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AssociadoDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold">Olá, Associado!</h2>
        <p className="mt-2 text-slate-300">
          Bem-vindo ao Morar Bem Brasil. Seu caminho para a casa própria começa aqui.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card Status da Análise */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-amber-200 p-2">
              <Star className="h-5 w-5 text-amber-700" />
            </div>
            <h3 className="font-semibold text-amber-900">Status do Cadastro</h3>
          </div>
          <p className="text-3xl font-bold text-amber-700 mb-2">Fase Inicial</p>
          <p className="text-sm text-amber-800">
            Complete seus dados e envie seus documentos para gerarmos sua pré-análise habitacional.
          </p>
        </div>

        {/* Card Documentos */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-slate-100 p-2">
              <Folder className="h-5 w-5 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Pasta Digital</h3>
          </div>
          <p className="text-2xl font-bold text-slate-700 mb-2">0/5</p>
          <p className="text-sm text-slate-500 mb-4">
            Documentos obrigatórios pendentes de envio.
          </p>
          <button className="w-full flex justify-center items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
            <UploadCloud className="h-4 w-4" /> Enviar Documentos
          </button>
        </div>

        {/* Card Produtos */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-slate-100 p-2">
              <Key className="h-5 w-5 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Produtos Disponíveis</h3>
          </div>
          <div className="flex h-full flex-col justify-center pb-8 text-center">
            <p className="text-sm text-slate-500">
              Sua vitrine de produtos será liberada após a pré-análise de crédito.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-full bg-blue-200 p-2">
            <FileText className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900">Importante</h4>
            <p className="mt-1 text-sm text-blue-800 leading-relaxed">
              A avaliação gerada por esta plataforma é <strong>exclusivamente consultiva (pré-análise interna)</strong>, condicionada à validação documental e regras vigentes do agente financeiro. 
              <strong> Nenhuma aprovação bancária definitiva é prometida ou garantida por este sistema.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
