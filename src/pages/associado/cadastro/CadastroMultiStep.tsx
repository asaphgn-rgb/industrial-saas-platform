import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, name: 'Dados Pessoais' },
  { id: 2, name: 'Dados Familiares' },
  { id: 3, name: 'Financeiro' },
  { id: 4, name: 'Produto' },
  { id: 5, name: 'Documentos' },
  { id: 6, name: 'Consentimento' }
];

export default function CadastroMultiStep() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleNext = () => { if (currentStep < 6) setCurrentStep(c => c + 1); };
  const handlePrev = () => { if (currentStep > 1) setCurrentStep(c => c - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 1500));
    setLoading(false);
    setFinished(true);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-white p-12 text-center shadow-sm mt-8">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Cadastro Concluído com Sucesso!</h2>
        <p className="mt-2 text-slate-500 max-w-md">
          Seus dados e documentos foram enviados para análise. Acompanhe o status no seu painel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Completar Cadastro</h2>
      </div>

      <nav aria-label="Progress">
        <ol role="list" className="divide-y divide-slate-300 rounded-md border border-slate-300 md:flex md:divide-y-0 bg-white">
          {STEPS.map((step) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              <div className={cn("group flex w-full items-center", currentStep === step.id ? "bg-slate-50" : "")}>
                <span className="flex items-center px-2 py-4 text-sm font-medium">
                  <span className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2",
                    currentStep > step.id ? "border-emerald-600 bg-emerald-600 text-white" : 
                    currentStep === step.id ? "border-amber-600 text-amber-600" : "border-slate-300 text-slate-500"
                  )}>
                    {step.id}
                  </span>
                  <span className={cn(
                    "ml-2 text-xs font-medium hidden sm:block",
                    currentStep > step.id ? "text-slate-900" : 
                    currentStep === step.id ? "text-amber-600" : "text-slate-500"
                  )}>{step.name}</span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Dados Pessoais</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
                <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">CPF</label>
                <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" placeholder="000.000.000-00" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Consentimentos Obrigatórios e LGPD</h3>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-bold">Atenção Especial - Leia Antes de Aceitar</p>
                <p className="mt-1">
                  A pré-análise não garante a aprovação final do crédito.
                </p>
              </div>
            </div>
          </div>
        )}

        {(currentStep > 1 && currentStep < 6) && (
          <div className="py-12 text-center text-slate-500">
            Formulário Etapa {currentStep} em renderização...
          </div>
        )}

        <div className="mt-8 flex justify-between border-t pt-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || loading}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Voltar
          </button>
          
          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Próxima Etapa
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-amber-600 px-6 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:bg-amber-400"
            >
              {loading ? 'Processando...' : 'Concluir Cadastro'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
