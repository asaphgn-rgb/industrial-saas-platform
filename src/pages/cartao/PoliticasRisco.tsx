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
  Info
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
      nome: 'Teto de Transação Única Sem Senha (NFC)',
      descricao: 'Limita o valor por aproximação sem digitação de PIN para conformidade Bacen.',
      gatilho: 'Transação Contactless > Limite',
      limite_valor: 200.00,
      acao_automatica: 'EXIGIR_2FA',
      ativo: true,
      categoria: 'LIMITE'
    },
    {
      id: 'regra-02',
      nome: 'Múltiplas Transações em Intervalo Crítico',
      descricao: 'Identifica disparos rápidos de compras no mesmo estabelecimento ou cartão.',
      gatilho: '> 3 transações em menos de 120 segundos',
      limite_valor: 500.00,
      acao_automatica: 'BLOQUEAR_IMEDIATO',
      ativo: true,
      categoria: 'VELOCIDADE'
    },
    {
      id: 'regra-03',
      nome: 'Compras Noturnas de Alto Valor',
      descricao: 'Alerta para transações efetuadas entre 22:00 e 06:00 acima da média habitual.',
      gatilho: 'Transação entre 22h e 06h',
      limite_valor: 1000.00,
      acao_automatica: 'ALERTA_OPERADOR',
      ativo: true,
      categoria: 'HORARIO'
    },
    {
      id: 'regra-04',
      nome: 'Discrepância Geográfica Impossível',
      descricao: 'Transações em municípios distintos em janela de tempo incompatível com deslocamento.',
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Políticas de Risco & Parâmetros de Crédito
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              Motor Antifraude
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configuração de travas automáticas, limites de crédito consignado e conformidade regulatória.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors">
            <PlusCircle className="h-4 w-4" /> Nova Regra de Risco
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Taxa de Falso Positivo</span>
          <p className="text-3xl font-black text-slate-900 mt-2">0.14%</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Padrão Ouro Internacional</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Tentativas Bloqueadas (Mês)</span>
          <p className="text-3xl font-black text-red-600 mt-2">128</p>
          <p className="text-xs text-slate-400 mt-1">R$ 142.900 preservados</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Tempo de Decisão da API</span>
          <p className="text-3xl font-black text-blue-600 mt-2">42 ms</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">SLA &lt; 150 ms garantido</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Matriz Ativa de Regras de Decisão</h3>
            <p className="text-xs text-slate-500 mt-0.5">As alterações entram em vigor instantaneamente no barramento de autorização</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {regras.map(regra => (
            <div key={regra.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    regra.categoria === 'LIMITE' ? 'bg-blue-100 text-blue-700' :
                    regra.categoria === 'VELOCIDADE' ? 'bg-amber-100 text-amber-700' :
                    regra.categoria === 'HORARIO' ? 'bg-purple-100 text-purple-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {regra.categoria}
                  </span>
                  <h4 className="font-semibold text-slate-900 text-sm">{regra.nome}</h4>
                </div>
                <p className="text-xs text-slate-500">{regra.descricao}</p>
                <p className="text-xs font-mono text-slate-400">
                  Condição: <strong className="text-slate-700">{regra.gatilho}</strong>
                  {regra.limite_valor > 0 && ` (Gatilho: R$ ${regra.limite_valor.toFixed(2)})`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  regra.acao_automatica === 'BLOQUEAR_IMEDIATO' ? 'bg-red-100 text-red-700' :
                  regra.acao_automatica === 'EXIGIR_2FA' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {regra.acao_automatica}
                </span>

                <button
                  onClick={() => toggleRegra(regra.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    regra.ativo
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {regra.ativo ? 'Ativa' : 'Pausada'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
