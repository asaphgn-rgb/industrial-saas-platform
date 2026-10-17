import { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Percent,
  DollarSign,
  Lock,
  FileCheck,
  Save,
  Info,
  Flame,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface RegraRisco {
  id: string;
  nome: string;
  descricao: string;
  gatilho: string;
  limite_valor: number;
  acao_automatica: 'BLOQUEAR_IMEDIATO' | 'ALERTA_OPERADOR' | 'EXIGIR_2FA';
  ativo: boolean;
  categoria: 'LIMITE' | 'VELOCIDADE' | 'HORARIO' | 'GEOLOCALIZACAO';
}

export default function PoliticasRisco() {
  const [regras, setRegras] = useState<RegraRisco[]>([
    {
      id: 'regra-01',
      nome: 'Teto de Transação Única Sem Senha (NFC Contactless)',
      descricao: 'Limita o valor por aproximação sem digitação de PIN para conformidade estrita com o Bacen.',
      gatilho: 'Transação Contactless > R$ 200,00',
      limite_valor: 200.00,
      acao_automatica: 'EXIGIR_2FA',
      ativo: true,
      categoria: 'LIMITE'
    },
    {
      id: 'regra-02',
      nome: 'Múltiplas Transações em Intervalo Crítico (Velocity Check)',
      descricao: 'Identifica disparos rápidos de compras no mesmo estabelecimento ou cartão no intervalo de 2 minutos.',
      gatilho: '> 3 transações em menos de 120 segundos',
      limite_valor: 500.00,
      acao_automatica: 'BLOQUEAR_IMEDIATO',
      ativo: true,
      categoria: 'VELOCIDADE'
    },
    {
      id: 'regra-03',
      nome: 'Transações Noturnas de Alto Valor (Janela Bacen)',
      descricao: 'Monitoramento reforçado para transações efetuadas entre 22:00 e 06:00 acima da média habitual.',
      gatilho: 'Transação entre 22h e 06h > R$ 1.000,00',
      limite_valor: 1000.00,
      acao_automatica: 'ALERTA_OPERADOR',
      ativo: true,
      categoria: 'HORARIO'
    },
    {
      id: 'regra-04',
      nome: 'Discrepância Geográfica Impossível (Geofencing)',
      descricao: 'Transações em municípios distintos em janela de tempo fisicamente incompatível com deslocamento.',
      gatilho: 'Distância > 300km em < 2 horas',
      limite_valor: 0,
      acao_automatica: 'BLOQUEAR_IMEDIATO',
      ativo: true,
      categoria: 'GEOLOCALIZACAO'
    }
  ]);

  const toggleRegra = (id: string) => {
    setRegras(prev =>
      prev.map(r => (r.id === id ? { ...r, ativo: !r.ativo } : r))
    );
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Header Corporativo Santander */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#EC0000] border border-red-200">
              Motor Antifraude & Gestão de Risco
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Políticas de Risco & Parâmetros de Crédito
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Parametrização de travas automáticas, limites de crédito rotativo/consignado e conformidade regulatória Bacen.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Abrindo formulário para criação de nova regra antifraude')}
            className="px-4 py-2.5 rounded-xl bg-[#EC0000] hover:bg-[#CC0000] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-600/20 transition-all"
          >
            <PlusCircle className="h-4 w-4" /> Nova Regra de Risco
          </button>
        </div>
      </div>

      {/* Cards de Métricas Santander Style */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Taxa de Falso Positivo</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">0.14%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Padrão Ouro Internacional</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fraudes Bloqueadas no Mês</span>
          <p className="text-2xl sm:text-3xl font-black text-[#EC0000] mt-1">128</p>
          <p className="text-[11px] text-slate-500 mt-1">R$ 142.900 de patrimônio preservado</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Latência de Decisão da API</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">42 ms</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">SLA &lt; 150 ms garantido</p>
        </div>
      </div>

      {/* Matriz de Regras Santander Style */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-base">Matriz Ativa de Regras de Decisão</h3>
            <p className="text-xs text-slate-400 mt-0.5">As alterações entram em vigor instantaneamente no barramento de autorização</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Motor Ativo 24/7
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {regras.map(regra => (
            <div key={regra.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider bg-slate-100 text-slate-700">
                    {regra.categoria}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{regra.nome}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{regra.descricao}</p>
                <p className="text-xs font-mono text-slate-400">
                  Gatilho: <strong className="text-slate-800">{regra.gatilho}</strong>
                  {regra.limite_valor > 0 && ` (Teto: R$ ${regra.limite_valor.toFixed(2)})`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                  regra.acao_automatica === 'BLOQUEAR_IMEDIATO' ? 'bg-red-50 text-[#EC0000] border border-red-200' :
                  regra.acao_automatica === 'EXIGIR_2FA' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {regra.acao_automatica}
                </span>

                <button
                  onClick={() => toggleRegra(regra.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    regra.ativo
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {regra.ativo ? 'Regra Ativa' : 'Pausada'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
