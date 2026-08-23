import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FileText, CheckCircle2, Clock, XCircle, Download, Eye, UploadCloud } from 'lucide-react';

export default function PastaDigital() {
  const { user } = useAuth();

  const [documentos] = useState([
    { id: 1, tipo: 'Documento de Identidade (RG/CNH)', status: 'APROVADO', data: '15/08/2026' },
    { id: 2, tipo: 'Comprovante de Residência', status: 'EM_ANALISE', data: '22/08/2026' },
    { id: 3, tipo: 'Comprovante de Renda (Holerite)', status: 'REPROVADO', data: '22/08/2026', motivo: 'Documento ilegível. Favor reenviar com melhor resolução.' },
    { id: 4, tipo: 'Contrato de Adesão Plataforma', status: 'ASSINADO', data: '10/08/2026' }
  ]);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'APROVADO':
      case 'ASSINADO':
        return <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle2 className="h-3.5 w-3.5" /> Aprovado</span>;
      case 'EM_ANALISE':
        return <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full"><Clock className="h-3.5 w-3.5" /> Em Análise</span>;
      case 'REPROVADO':
        return <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full"><XCircle className="h-3.5 w-3.5" /> Reprovado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Minha Pasta Digital</h2>
          <p className="text-sm text-slate-500">Repositório seguro de todos os seus documentos, análises e contratos (Cofre Virtual).</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          <UploadCloud className="h-4 w-4" /> Enviar Novo Documento
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" /> Documentos Cadastrais
            </h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {documentos.map((doc) => (
              <li key={doc.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{doc.tipo}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-slate-500">Enviado em {doc.data}</span>
                      {renderStatus(doc.status)}
                    </div>
                    {doc.motivo && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                        <strong>Motivo:</strong> {doc.motivo}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded" title="Visualizar">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded" title="Baixar">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {doc.status === 'REPROVADO' && (
                  <button className="mt-3 text-xs font-medium text-amber-600 border border-amber-200 bg-white px-3 py-1.5 rounded hover:bg-amber-50">
                    Substituir Documento
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Contratos e Termos Aceitos</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 border rounded-lg bg-emerald-50 border-emerald-100">
                <span className="font-medium text-slate-700">Termo de LGPD e Consulta a Bureaus</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Aceito</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50 text-slate-500">
                <span>Contrato de Produto Habitacional</span>
                <span className="text-xs">Disponível após aprovação</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border bg-slate-900 text-white p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 bg-white opacity-5 rotate-45 transform translate-x-10 -translate-y-10 rounded-full blur-3xl"></div>
            <h3 className="font-semibold mb-2 relative z-10">Parecer de Pré-Análise</h3>
            <p className="text-sm text-slate-400 relative z-10 mb-4">Seu relatório financeiro completo gerado pelo motor da Plataforma Diamond.</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-sm font-medium transition-colors relative z-10">
              Emitir Relatório em PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
