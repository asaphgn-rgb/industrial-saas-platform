import { useState } from 'react';
import { Phone, Mail, FileText, ArrowRight, UserCheck, Search } from 'lucide-react';

export default function CRMComercial() {
  const [leads] = useState([
    { id: 1, nome: 'João M. Silva', status: 'PRE_APROVADO', potencial: 'R$ 180.000', ultima_acao: 'Contato via WhatsApp', prox_acao: 'Apresentar Produto', data_prox: 'Amanhã' },
    { id: 2, nome: 'Maria C. Santos', status: 'CREDITO_A_TRABALHAR', potencial: 'R$ 110.000', ultima_acao: 'Envio de Proposta Consultoria', prox_acao: 'Follow-up Contrato', data_prox: '24/08/2026' },
    { id: 3, nome: 'Carlos E. Pereira', status: 'NOVO_LEAD', potencial: 'A calcular', ultima_acao: 'Cadastro Concluído', prox_acao: 'Ligação Inicial', data_prox: 'Hoje' }
  ]);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PRE_APROVADO': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CREDITO_A_TRABALHAR': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'NOVO_LEAD': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => status.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">CRM & Pipeline Comercial</h2>
          <p className="text-sm text-slate-500">Gestão de leads, follow-ups e conversões.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar lead por nome, CPF ou produto..." 
            className="w-full rounded-md border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 text-lg">{lead.nome}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusStyle(lead.status)}`}>
                  {getStatusLabel(lead.status)}
                </span>
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                Potencial: <span className="text-slate-900">{lead.potencial}</span>
              </p>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Última Ação</p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">{lead.ultima_acao}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1 flex justify-between">
                    Próxima Ação <span className="text-amber-600">{lead.data_prox}</span>
                  </p>
                  <p className="text-sm text-amber-900 font-medium bg-amber-50 p-2 rounded border border-amber-100 flex items-center justify-between">
                    {lead.prox_acao} <ArrowRight className="h-4 w-4 text-amber-500" />
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 p-3 flex justify-between gap-2">
              <button className="flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-700 text-sm font-medium transition-colors">
                <Phone className="h-4 w-4 text-amber-500" /> Ligar
              </button>
              <button className="flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-700 text-sm font-medium transition-colors">
                <Mail className="h-4 w-4 text-amber-500" /> Email
              </button>
              <button className="flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-700 text-sm font-medium transition-colors">
                <UserCheck className="h-4 w-4 text-emerald-400" /> Ficha
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
