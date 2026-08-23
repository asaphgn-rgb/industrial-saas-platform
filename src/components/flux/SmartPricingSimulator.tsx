import React, { useState, useMemo } from "react";
import { 
  Calculator, 
  Sparkles, 
  ArrowRightLeft, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Scale
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from "recharts";
import { cn } from "@/lib/utils";

export function SmartPricingSimulator() {
  const [material, setMaterial] = useState("pebd");
  const [largura, setLargura] = useState(50);
  const [espessura, setEspessura] = useState(20);
  const [quantidade, setQuantidade] = useState(1000);
  const [unidade, setUnidade] = useState("kg");
  const [precoAlvo, setPrecoAlvo] = useState(14.00);

  // Lógica de simulação industrial
  const simulation = useMemo(() => {
    // Fatores de dificuldade baseados em espessura e material
    const dificuldadeBase = espessura < 25 ? 85 : 45;
    const custoBase = 12.50;
    const margemAtual = ((precoAlvo - custoBase) / precoAlvo) * 100;
    
    let status = "success";
    if (margemAtual < 10) status = "danger";
    else if (margemAtual < 15) status = "warning";

    const precoMilheiro = (precoAlvo * (largura * espessura * 0.00184)).toFixed(2);

    return {
      dificuldade: dificuldadeBase,
      custoReal: custoBase,
      margem: margemAtual,
      status,
      precoMilheiro
    };
  }, [largura, espessura, precoAlvo, material]);

  const gaugeData = [
    { name: "Dificuldade", value: simulation.dificuldade, fill: simulation.status === "danger" ? "#ef4444" : simulation.status === "warning" ? "#f59e0b" : "#10b981" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
      {/* Formulário de Entrada */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Simulador de Precificação Smart
          </h2>
          <p className="text-slate-500">Configure os parâmetros técnicos do pedido</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="material">Tipo de Material</Label>
            <Select value={material} onValueChange={setMaterial}>
              <SelectTrigger id="material" className="bg-white">
                <SelectValue placeholder="Selecione o material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pebd">PEBD (Polietileno Baixa)</SelectItem>
                <SelectItem value="pead">PEAD (Polietileno Alta)</SelectItem>
                <SelectItem value="pp">PP (Polipropileno)</SelectItem>
                <SelectItem value="bopp">BOPP (Laminados)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidade">Unidade de Medida</Label>
            <Select value={unidade} onValueChange={setUnidade}>
              <SelectTrigger id="unidade" className="bg-white">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Quilogramas (Kg)</SelectItem>
                <SelectItem value="milheiro">Milheiro (1000 un)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="largura">Largura (cm)</Label>
            <Input 
              id="largura" 
              type="number" 
              value={largura} 
              onChange={(e) => setLargura(Number(e.target.value))}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="espessura">Espessura (micras)</Label>
            <Input 
              id="espessura" 
              type="number" 
              value={espessura} 
              onChange={(e) => setEspessura(Number(e.target.value))}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input 
              id="quantidade" 
              type="number" 
              value={quantidade} 
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco">Preço Alvo do Cliente (R$/Kg)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">R$</span>
              <Input 
                id="preco" 
                type="number" 
                value={precoAlvo} 
                onChange={(e) => setPrecoAlvo(Number(e.target.value))}
                className="pl-9 bg-white font-bold text-primary"
              />
            </div>
          </div>
        </div>

        <Card className="bg-white border-dashed border-2 border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <ArrowRightLeft className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Conversão Instantânea</p>
                <p className="text-lg font-bold text-slate-700">R$ {simulation.precoMilheiro} <span className="text-sm font-normal text-slate-400">/ milheiro</span></p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">Densidade: 0.92</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Painel de Viabilidade */}
      <div className="space-y-6">
        <Card className="h-full border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Viabilidade e Parecer Consultivo</CardTitle>
                <CardDescription>Análise técnica via FLUX AI</CardDescription>
              </div>
              <Badge className={cn(
                "px-3 py-1",
                simulation.status === "danger" ? "bg-red-100 text-red-700 border-red-200" :
                simulation.status === "warning" ? "bg-amber-100 text-amber-700 border-amber-200" :
                "bg-emerald-100 text-emerald-700 border-emerald-200"
              )}>
                {simulation.status === "danger" ? "Risco Alto" : simulation.status === "warning" ? "Atenção" : "Margem Segura"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Gauge Chart Simulado */}
            <div className="flex flex-col items-center">
              <div className="h-[180px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="100%" 
                    innerRadius="60%" 
                    outerRadius="100%" 
                    barSize={20} 
                    data={gaugeData} 
                    startAngle={180} 
                    endAngle={0}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={30}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <div className="text-3xl font-black text-slate-900">{simulation.dificuldade}%</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Grau de Dificuldade</div>
                </div>
              </div>
            </div>

            {/* AI Advisor Balloon */}
            <div className="relative bg-primary/5 border border-primary/20 rounded-2xl p-5 shadow-sm group hover:border-primary/40 transition-all">
              <div className="absolute -top-3 left-6 px-2 bg-white flex items-center gap-1.5 text-primary text-xs font-bold border border-primary/20 rounded-full">
                <Sparkles className="h-3 w-3 fill-primary" />
                PARECER DA IA
              </div>
              <p className="text-slate-700 leading-relaxed italic">
                "Este pedido exige uma espessura muito fina ({espessura} micras). Historicamente, a <span className="font-bold text-slate-900">Extrusora 02</span> tem 15% de perda nesse set-up. O custo real será de <span className="font-bold text-slate-900">R$ {simulation.custoReal.toFixed(2)}/kg</span>. Vendendo a R$ {precoAlvo.toFixed(2)}, sua margem líquida será de apenas <span className={cn("font-bold", simulation.status === "danger" ? "text-red-600" : "text-amber-600")}>{simulation.margem.toFixed(1)}%</span>. Sugiro tentar negociar R$ 14,80/kg ou transferir para a Extrusora 05."
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90">
                  Adotar Margem Sugerida
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-500">
                  Simular na Extrusora 05
                </Button>
              </div>
            </div>

            {/* KPI Bottom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Custo Industrial</div>
                <div className="text-xl font-bold text-slate-900">R$ 12,50<span className="text-xs font-normal text-slate-400">/kg</span></div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Margem Líquida</div>
                <div className={cn("text-xl font-bold", simulation.status === "danger" ? "text-red-600" : "text-emerald-600")}>
                  {simulation.margem.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
