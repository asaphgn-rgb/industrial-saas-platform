import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  DollarSign, 
  Sparkles, 
  Factory,
  ArrowRight,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const oeeData = [
  { time: "06:00", value: 82 },
  { time: "08:00", value: 78 },
  { time: "10:00", value: 85 },
  { time: "12:00", value: 88 },
  { time: "14:00", value: 58 },
  { time: "16:00", value: 65 },
  { time: "18:00", value: 75 },
];

const refugoData = [
  { name: "Extrusão", value: 2.4, color: "var(--color-primary)" },
  { name: "Impressão", value: 4.1, color: "#ef4444" },
  { name: "Laminação", value: 1.8, color: "#10b981" },
  { name: "Corte", value: 3.2, color: "#f59e0b" },
];

const faturamentoData = [
  { name: "Seg", valor: 45000 },
  { name: "Ter", valor: 52000 },
  { name: "Qua", valor: 48000 },
  { name: "Qui", valor: 61000 },
  { name: "Sex", valor: 55000 },
];

export function ExecutiveCopilotDashboard() {
  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-primary/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Factory className="h-8 w-8 text-primary" />
            Visão Industrial 360°
          </h1>
          <p className="text-slate-400 mt-1">Status operacional em tempo real • Unidade Matriz</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 py-1.5 px-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            Sistema Online
          </Badge>
          <Button variant="outline" className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-white">
            Exportar Relatório ISO
          </Button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="OEE Global" 
          value="76.4%" 
          trend="+2.1%" 
          trendUp={true} 
          icon={<Percent className="h-5 w-5 text-emerald-400" />}
          description="Eficiência Geral do Equipamento"
        />
        <KPICard 
          title="Perda Fabril" 
          value="3.2%" 
          trend="-0.5%" 
          trendUp={true} // Down is good for loss
          icon={<AlertCircle className="h-5 w-5 text-amber-400" />}
          description="Refugo total acumulado no turno"
        />
        <KPICard 
          title="Margem de Contribuição" 
          value="24.8%" 
          trend="+1.2%" 
          trendUp={true} 
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          description="Rentabilidade líquida média"
        />
      </div>

      {/* AI Advisory Section */}
      <Card className="relative overflow-hidden border-2 border-primary/40 bg-slate-900/50 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.15)] group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="h-24 w-24 text-primary" />
        </div>
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  Parecer Consultivo da IA
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-none text-[10px] uppercase tracking-wider font-bold px-1.5 py-0">Premium</Badge>
                </h3>
                <div className="mt-3 text-slate-300 text-lg leading-relaxed max-w-4xl">
                  "Identifiquei que o <span className="text-white font-semibold">OEE da Extrusora 03</span> caiu para <span className="text-red-400 font-bold">58%</span> ontem. O principal motivo foi <span className="text-amber-400">Setup (4 horas)</span>. Se agruparmos as OPs por similaridade de resina, podemos recuperar <span className="text-emerald-400 font-bold">12% de margem</span>. Deseja aplicar o sequenciamento automático no PCP?"
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-6 py-6 text-base h-auto">
                  Aplicar Sugestão no PCP
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 px-6 py-6 h-auto">
                  Analisar Detalhes da Extrusora 03
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OEE Trend */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-slate-100">Tendência de OEE</CardTitle>
              <CardDescription className="text-slate-500">Últimas 12 horas operacionais</CardDescription>
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oeeData}>
                <defs>
                  <linearGradient id="colorOee" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${val}%`}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#f8fafc" }}
                  itemStyle={{ color: "#7BBDE8" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-primary)" 
                  fillOpacity={1} 
                  fill="url(#colorOee)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Waste Distribution */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-slate-100">Distribuição de Refugo</CardTitle>
              <CardDescription className="text-slate-500">Por centro de custo (%)</CardDescription>
            </div>
            <Percent className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={refugoData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#f8fafc" }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {refugoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Production List & Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Status das OPs Críticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "OP 4205", client: "Plastflex Ind.", prod: "Filme PEBD 0.05", status: "Em Produção", progress: 75 },
                { id: "OP 4206", client: "LogiPack S/A", prod: "Bolsa Atacado G", status: "Aguardando Insumo", progress: 0 },
                { id: "OP 4207", client: "Alimentar S/A", prod: "Filme Laminado BOPP", status: "Finalizado", progress: 100 },
              ].map((op) => (
                <div key={op.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-10 rounded-full",
                      op.progress === 100 ? "bg-emerald-500" : op.progress > 0 ? "bg-primary" : "bg-slate-600"
                    )} />
                    <div>
                      <div className="font-semibold text-white">{op.id}</div>
                      <div className="text-xs text-slate-400">{op.client} • {op.prod}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-200">{op.status}</div>
                    <div className="text-xs text-slate-500">{op.progress}% Concluído</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 text-primary p-0 h-auto font-semibold">
              Ver todas as ordens <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Resumo de Faturamento</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faturamentoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#f8fafc" }}
                  formatter={(val) => `R$ ${val.toLocaleString()}`}
                />
                <Bar dataKey="valor" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-end">
              <div>
                <div className="text-xs text-slate-500">Projeção Semanal</div>
                <div className="text-xl font-bold text-white">R$ 261.000</div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">+8% meta</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, trendUp, icon, description }: { 
  title: string; 
  value: string; 
  trend: string; 
  trendUp: boolean; 
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          <span className={cn("text-xs font-medium", trendUp ? "text-emerald-400" : "text-rose-400")}>
            {trend}
          </span>
          <span className="text-xs text-slate-500">{trendUp ? "vs ontem" : "vs ontem"}</span>
        </div>
        <p className="text-[10px] text-slate-600 mt-3 font-medium uppercase tracking-tighter">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
