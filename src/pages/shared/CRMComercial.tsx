import { useState } from 'react';
import { Phone, Mail, FileText, ArrowRight, Search, Filter } from 'lucide-react';

export default function CRMComercial() {
  const [leads] = useState([
    { id: 1, nome: 'João M. Silva', status: 'PRE_APROVADO', potencial: '180.000', ultimaAcao: 'Contato via WhatsApp', proximaAcao: 'Apresentar Produto', dataProximaAcao: 'AMANHÃ' },
    { id: 2, nome: 'Maria C. Santos', status: 'CREDITO_A_TRABALHAR', potencial: '110.000', ultimaAcao: 'Envio de Proposta Consultoria', proximaAcao: 'Follow-up Contrato', dataProximaAcao: '24/08/2026' }
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamond-950">CRM & Pipeline Comercial</h2>
          <p className="text-sm text-diamond-400 mt-1">Gestão de leads, follow-ups e conversões.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-diamond-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="h-4 w-4" /> Filtros
          </button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-diamond-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Buscar lead por nome, CPF ou produto..." 
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm focus:border-diamond-500 focus:ring-4 focus:ring-diamond-500/10 transition-all outline-none shadow-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-slate-200 bg-white shadow-soft hover:shadow-md transition-all flex flex-col group overflow-hidden">
            
            <div className="p-6 border-b border-slate-100 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-diamond-500 to-diamond-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-extrabold text-diamond-950 text-lg">{lead.nome}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${lead.status === 'PRE_APROVADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {lead.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600">
                Potencial: <span className="font-bold text-diamond-950">R$ {lead.potencial}</span>
              </p>
            </div>

            <div className="p-6 flex-1 space-y-5 bg-slate-50/30">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Última Ação</p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 shadow-sm">
                  {lead.ultimaAcao}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Próxima Ação</p>
                  <p className="text-xs font-bold text-amber-600">{lead.dataProximaAcao}</p>
                </div>
                <div className="flex items-center justify-between bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-sm font-medium text-amber-900 shadow-sm cursor-pointer hover:bg-amber-50 transition-colors">
                  {lead.proximaAcao}
                  <ArrowRight className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="p-2 border-t border-slate-100 bg-diamond-950 flex">
              <button className="flex-1 flex justify-center items-center gap-2 py-3 text-sm font-semibold text-white hover:bg-diamond-900 rounded-lg transition-colors">
                <Phone className="h-4 w-4 text-diamond-400" /> Ligar
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 py-3 text-sm font-semibold text-white hover:bg-diamond-900 rounded-lg transition-colors border-l border-diamond-900/50">
                <Mail className="h-4 w-4 text-diamond-400" /> Email
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 py-3 text-sm font-semibold text-emerald-400 hover:bg-diamond-900 rounded-lg transition-colors border-l border-diamond-900/50">
                <FileText className="h-4 w-4" /> Ficha
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
