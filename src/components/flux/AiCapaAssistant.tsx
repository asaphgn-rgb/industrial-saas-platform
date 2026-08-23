import React, { useState } from "react";
import { 
  ShieldCheck, 
  Wand2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ClipboardCheck, 
  Clock, 
  User,
  ArrowRight,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const SUGGESTIONS = {
  why1: [
    "A temperatura da faca de corte estava abaixo do set-point (180°C).",
    "Excesso de aditivo deslizante migrando para a superfície do filme.",
    "Velocidade da máquina acima do limite operacional para este material."
  ],
  why2: [
    "O termopar da resistência 04 está apresentando oscilações de leitura.",
    "Lote de matéria-prima recebido com índice de fluidez fora do padrão.",
    "Falta de sincronia entre o puxador e o cabeçote de solda."
  ],
  why3: [
    "Plano de manutenção preventiva da seladora está atrasado em 15 dias.",
    "Operador não realizou o teste de resistência no início do turno.",
    "Variação de tensão na rede elétrica afetando a estabilidade térmica."
  ]
};

const ACTION_SUGGESTIONS = [
  { action: "Treinar operador na calibração de temperatura", responsible: "Supervisão", deadline: "48h" },
  { action: "Revisar ficha técnica reduzindo 0.5% de aditivo deslizante", responsible: "Engenharia", deadline: "24h" },
  { action: "Substituir resistência e termopar da seladora 02", responsible: "Manutenção", deadline: "Hoje" }
];

export function AiCapaAssistant() {
  const [whys, setWhys] = useState({
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: ""
  });

  const handleFill = (key: string, value: string) => {
    setWhys(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 min-h-[800px]">
      {/* Header Info */}
      <div className="xl:col-span-12 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Investigação de Causa Raiz (CAPA)</h2>
          </div>
          <p className="text-slate-500">Módulo de Qualidade ISO 9001 • RNC #2026-0842</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
            Não Conformidade: Solda Fraca
          </Badge>
          <Badge className="bg-blue-600 hover:bg-blue-700">Status: Em Análise</Badge>
        </div>
      </div>

      {/* 5 Porquês Section */}
      <div className="xl:col-span-7 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-slate-400" />
              Técnica dos 5 Porquês
            </h3>
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-slate-400 border-none shadow-none">Padrão ISO 9001:2015</Badge>
          </div>

          {[1, 2, 3, 4, 5].map((num) => {
            const key = `why${num}`;
            const suggestions = SUGGESTIONS[key as keyof typeof SUGGESTIONS] || [];
            
            return (
              <div key={num} className="relative group">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 z-10 shadow-sm">
                  {num}
                </div>
                <div className="pl-6 space-y-1.5">
                  <Label htmlFor={key} className="text-xs text-slate-500 font-semibold ml-1">
                    {num === 1 ? "Por que o problema ocorreu?" : `E por que isso (${num - 1}) aconteceu?`}
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id={key}
                      value={whys[key as keyof typeof whys]}
                      onChange={(e) => handleFill(key, e.target.value)}
                      placeholder="Descreva a causa..."
                      className="bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-12"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="flex-shrink-0 h-12 w-12 border-blue-100 hover:bg-blue-50 text-blue-600 shadow-sm"
                        >
                          <Wand2 className={cn("h-4 w-4", suggestions.length > 0 && "animate-pulse")} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="end">
                        <div className="bg-blue-600 text-white p-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-bold">Sugestões Técnicas FLUX AI</span>
                        </div>
                        <div className="p-2">
                          {suggestions.length > 0 ? (
                            <div className="space-y-1">
                              {suggestions.map((s, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleFill(key, s)}
                                  className="w-full text-left p-3 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 flex items-start gap-2"
                                >
                                  <ArrowRight className="h-3 w-3 mt-1 text-blue-400 flex-shrink-0" />
                                  {s}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-slate-400 text-sm">
                              Descreva as causas anteriores para gerar novas sugestões.
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plano de Ação 5W2H Section */}
      <div className="xl:col-span-5 space-y-6">
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden sticky top-6">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Plano de Ação (5W2H)
              </CardTitle>
              <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100">IA Ativa</Badge>
            </div>
            <CardDescription>Ações recomendadas com base na causa raiz</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {ACTION_SUGGESTIONS.map((action, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                      {action.action}
                    </p>
                    <Badge variant="outline" className="text-[10px] text-slate-400 border-none shadow-none">#00{idx+1}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      {action.responsible}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      Prazo: {action.deadline}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700">
                      Admitir Ação
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px]">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Dica da Auditoria</p>
                <p className="text-xs text-blue-600/80 leading-relaxed">
                  Para conformidade com o requisito 10.2 da ISO 9001, certifique-se de que a eficácia da ação seja avaliada após 30 dias da conclusão.
                </p>
              </div>
            </div>

            <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800 h-12">
              Finalizar Investigação CAPA
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
