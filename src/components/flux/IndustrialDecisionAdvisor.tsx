import React from 'react';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  Zap, 
  TrendingUp,
  Settings,
  ClipboardCheck
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const recommendations = [
  {
    id: 'extrusao',
    title: 'Extrusão: Gargalo de Razão de Sopro',
    content: 'Gargalo detectado: A Razão de Sopro (BUR) da OP-402 está em 3.2× na Extrusora 01, gerando instabilidade no balão e variação de micras (+/- 8%).',
    recommendation: 'Reduzir velocidade para 32 m/min ou trocar anel de ar.',
    type: 'warning',
    icon: <Settings className="text-amber-500" size={18} />,
    actions: ['Aplicar no PCP', 'Registrar Ação Preventiva SGQ']
  },
  {
    id: 'impressao',
    title: 'Setup de Cores: Oportunidade de Ganho',
    content: 'Oportunidade de Ganho: Foram programadas 3 OPs de sacolas com impressão azul após uma OP com tinta preta.',
    recommendation: 'Reagrupar a fila para evitar 2 lavagens de anilox, economizando 45 min de máquina.',
    type: 'success',
    icon: <Zap className="text-green-500" size={18} />,
    actions: ['Aplicar no PCP']
  },
  {
    id: 'corte-solda',
    title: 'Perda de Refile: Alerta de Custo',
    content: 'Alerta de Custo: O refile lateral no Corte e Solda atingiu 6,5% (meta: 3%).',
    recommendation: 'Ajustar largura do balão na extrusora em -15mm na próxima tiragem.',
    type: 'danger',
    icon: <TrendingUp className="text-red-500" size={18} />,
    actions: ['Registrar Ação Preventiva SGQ']
  }
];

export const IndustrialDecisionAdvisor = () => {
  return (
    <Card className="bg-slate-900 border-primary/20 overflow-hidden mb-8">
      <CardHeader className="bg-gradient-to-r from-blue-900/40 to-slate-900 border-b border-primary/10 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Brain className="text-primary animate-pulse" size={20} />
            </div>
            <div>
              <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                Industrial AI Decision Advisor
                <Sparkles size={14} className="text-primary" />
              </CardTitle>
              <p className="text-xs text-slate-400">Análise técnica em tempo real da Engenharia de Processos</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 uppercase tracking-wider text-[10px]">
            Parecer da Engenharia de Processos
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((item) => (
            <div 
              key={item.id} 
              className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:border-primary/30 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    "{item.content}"
                  </p>
                  <div className="bg-primary/5 border-l-2 border-primary p-2 rounded-r-md">
                    <p className="text-xs font-semibold text-primary">
                      Recomendação: <span className="text-slate-200 font-normal">{item.recommendation}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-700/50">
                {item.actions.map((action) => (
                  <Button 
                    key={action}
                    size="sm" 
                    variant="ghost" 
                    className="h-7 text-[10px] bg-slate-700/30 hover:bg-primary hover:text-white border border-slate-600/50 hover:border-primary transition-all px-2"
                  >
                    {action === 'Aplicar no PCP' ? <ClipboardCheck size={12} className="mr-1" /> : <AlertTriangle size={12} className="mr-1" />}
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
