import React, { useState } from "react";
import { 
  Play, 
  Trash2, 
  PauseCircle, 
  HelpCircle, 
  CheckCircle, 
  Trophy, 
  Settings, 
  Video,
  ChevronRight,
  ArrowRight,
  Monitor
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type HelpTopic = {
  title: string;
  description: string;
  videoThumb: string;
};

const HELP_TOPICS: Record<string, HelpTopic> = {
  refile: {
    title: "O que é Refile?",
    description: "Refile é a sobra lateral do corte da bobina para ajuste de largura. Pese a apara no cesto e digite o valor em kg. Esse material irá para o moinho reciclador.",
    videoThumb: "https://images.unsplash.com/photo-1530124560677-bda184450584?auto=format&fit=crop&q=80&w=400"
  },
  apontamento: {
    title: "Como Apontar Produção?",
    description: "Registre o peso da bobina finalizada. Certifique-se de que a balança está zerada antes de colocar o material.",
    videoThumb: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400"
  },
  setup: {
    title: "Troca de Setup",
    description: "Tempo gasto para trocar resina, largura ou cor. Informe o motivo da parada para o PCP ajustar o cronograma.",
    videoThumb: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80&w=400"
  }
};

export function DidacticOperatorTerminal() {
  const [activeDialog, setActiveDialog] = useState<"refugo" | "producao" | "parada" | "sucesso" | null>(null);
  const [helpTopic, setHelpTopic] = useState<HelpTopic | null>(null);

  const openHelp = (topicKey: string) => {
    setHelpTopic(HELP_TOPICS[topicKey]);
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white min-h-[800px] rounded-3xl overflow-hidden border-8 border-slate-900 shadow-2xl font-sans">
      {/* Barra de Status Superior */}
      <div className="bg-slate-900 p-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
            <Monitor className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">EXTRUSORA 03</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-emerald-500 text-white animate-pulse border-none font-bold">EM OPERAÇÃO</Badge>
              <span className="text-slate-400 font-bold tracking-widest text-xs">OP: 4205-A (PLASTFLEX)</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Meta do Turno</div>
          <div className="text-3xl font-black text-primary">82% <span className="text-sm font-normal text-slate-500">OEE</span></div>
        </div>
      </div>

      {/* Grid de Ações Gigantes */}
      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => setActiveDialog("producao")}
          className="group relative flex flex-col items-center justify-center gap-6 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-[40px] border-b-8 border-emerald-800 active:border-b-0 active:translate-y-2"
        >
          <div className="h-32 w-32 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <span className="text-4xl font-black uppercase tracking-tighter">Apontar Produção</span>
          <div className="absolute top-6 right-6">
            <HelpCircle className="h-8 w-8 text-white/40 hover:text-white cursor-help" onClick={(e) => { e.stopPropagation(); openHelp("apontamento"); }} />
          </div>
        </button>

        <button 
          onClick={() => setActiveDialog("refugo")}
          className="group relative flex flex-col items-center justify-center gap-6 bg-amber-600 hover:bg-amber-500 transition-all rounded-[40px] border-b-8 border-amber-800 active:border-b-0 active:translate-y-2"
        >
          <div className="h-32 w-32 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trash2 className="h-16 w-16 text-white" />
          </div>
          <span className="text-4xl font-black uppercase tracking-tighter">Registrar Refugo</span>
          <div className="absolute top-6 right-6">
            <HelpCircle className="h-8 w-8 text-white/40 hover:text-white cursor-help" onClick={(e) => { e.stopPropagation(); openHelp("refile"); }} />
          </div>
        </button>

        <button 
          onClick={() => setActiveDialog("parada")}
          className="group relative flex flex-col items-center justify-center gap-6 bg-rose-600 hover:bg-rose-500 transition-all rounded-[40px] border-b-8 border-rose-800 active:border-b-0 active:translate-y-2 md:col-span-2"
        >
          <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <PauseCircle className="h-12 w-12 text-white" />
          </div>
          <span className="text-3xl font-black uppercase tracking-tighter">Parar Máquina</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900 p-6 flex justify-between items-center">
        <div className="flex gap-8">
          <div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Produzido</div>
            <div className="text-xl font-bold">1.250 Kg</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Tempo</div>
            <div className="text-xl font-bold">04:22:15</div>
          </div>
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-700 bg-slate-800 text-white font-bold hover:bg-slate-700">
          <Settings className="mr-2 h-5 w-5" />
          Ajustes Fina
        </Button>
      </div>

      {/* Modais de Ação */}
      <Dialog open={activeDialog === "refugo"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="bg-slate-900 text-white border-slate-800 sm:max-w-[600px] rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black">REGISTRAR REFUGO</DialogTitle>
            <DialogDescription className="text-slate-400">Informe o tipo e peso da perda fabril</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tipo" className="text-lg font-bold">Motivo da Perda</Label>
                <button onClick={() => openHelp("refile")} className="text-primary flex items-center gap-1 text-sm font-bold bg-primary/10 px-3 py-1 rounded-full">
                  <HelpCircle className="h-4 w-4" />
                  O que é isso?
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Refile", "Setup", "Borra", "Apara"].map(m => (
                  <Button key={m} variant="outline" className="h-16 text-xl border-slate-700 bg-slate-800 hover:bg-slate-700 font-bold">{m}</Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="peso" className="text-lg font-bold">Peso (Kg)</Label>
              <Input id="peso" type="number" className="h-20 text-4xl font-black bg-slate-800 border-slate-700 text-center" placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full h-20 text-2xl font-black bg-amber-600 hover:bg-amber-500 rounded-2xl"
              onClick={() => setActiveDialog("sucesso")}
            >
              CONFIRMAR REGISTRO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Gamificado de Sucesso */}
      <Dialog open={activeDialog === "sucesso"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="bg-slate-950 text-white border-none sm:max-w-[500px] text-center p-12 overflow-hidden rounded-[40px]">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-emerald-500 to-primary animate-pulse" />
          <div className="flex justify-center mb-6">
            <div className="h-32 w-32 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
              <Trophy className="h-20 w-20 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-4xl font-black mb-4">MUITO BEM!</h2>
          <p className="text-slate-400 text-xl leading-relaxed mb-8">
            Você atingiu <span className="text-white font-black text-3xl">85% de OEE</span> nesta OP!<br/>
            Você produziu acima da meta e ajudou a fábrica hoje.
          </p>
          <Button 
            className="w-full h-20 text-2xl font-black bg-emerald-600 hover:bg-emerald-500 rounded-2xl"
            onClick={() => setActiveDialog(null)}
          >
            VOLTAR AO TERMINAL
          </Button>
        </DialogContent>
      </Dialog>

      {/* Drawer Didático da IA */}
      <Dialog open={!!helpTopic} onOpenChange={() => setHelpTopic(null)}>
        <DialogContent className="bg-slate-900 text-white border-slate-800 sm:max-w-[450px] bottom-0 translate-y-0 rounded-t-[40px] p-0 overflow-hidden">
          <div className="bg-primary/20 p-8 flex items-center gap-4 border-b border-primary/20">
            <Video className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-black uppercase tracking-tight">{helpTopic?.title}</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-slate-800 shadow-xl">
              <img src={helpTopic?.videoThumb} alt="Preview" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              </div>
            </div>
            <p className="text-xl text-slate-300 leading-relaxed font-medium">
              {helpTopic?.description}
            </p>
            <Button 
              className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 rounded-2xl"
              onClick={() => setHelpTopic(null)}
            >
              ENTENDI, OBRIGADO!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
