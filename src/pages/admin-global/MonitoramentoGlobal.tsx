import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Activity, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notificacao {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  is_read: boolean;
  created_at: string;
}

export default function MonitoramentoGlobal() {
  const [eventos, setEventos] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEventos();

    // Inscrição Realtime para Monitoramento em Tempo Real
    const channel = supabase
      .channel('monitoramento_global')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notificacoes_admin_global' 
      }, (payload) => {
        setEventos((prev) => [payload.new as Notificacao, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notificacoes_admin_global')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEventos(data || []);
    } catch (error) {
      console.error('Erro ao carregar monitoramento:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'ERROR': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'SUCCESS': return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Monitoramento Global</h2>
          <p className="text-sm text-slate-500">Acompanhamento em tempo real das atividades críticas da Plataforma Diamond.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          Sistema Online e Monitorando
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-slate-500" /> Timeline de Eventos
          </h3>
          <span className="text-xs font-medium text-slate-500">Exibindo últimos 50 eventos</span>
        </div>
        
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Carregando telemetria...</div>
          ) : eventos.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Nenhum evento crítico registrado no momento.</div>
          ) : (
            eventos.map((evento) => (
              <div key={evento.id} className={cn("flex gap-4 p-4 hover:bg-slate-50 transition-colors", !evento.is_read && "bg-slate-50/80")}>
                <div className="mt-1 flex-shrink-0">
                  {getIcon(evento.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{evento.title}</p>
                    <time className="text-xs text-slate-500">
                      {new Date(evento.created_at).toLocaleString('pt-BR')}
                    </time>
                  </div>
                  <p className="text-sm text-slate-600">{evento.message}</p>
                  
                  {evento.priority === 'CRITICAL' && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Prioridade Crítica
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
