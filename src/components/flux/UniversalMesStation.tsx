import React, { useState, useEffect, useCallback } from "react";
import { 
  Monitor, 
  Scan, 
  Play, 
  Trash2, 
  PauseCircle, 
  CheckCircle, 
  Info,
  AlertTriangle,
  Zap,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MachineType = "extrusao" | "impressao" | "corte_solda";

interface Machine {
  id: string;
  name: string;
  type: MachineType;
}

const MACHINES: Machine[] = [
  { id: "ext-01", name: "Extrusora Balão 01", type: "extrusao" },
  { id: "ext-02", name: "Extrusora Balão 02", type: "extrusao" },
  { id: "imp-01", name: "Impressora 6 Cores", type: "impressao" },
  { id: "imp-02", name: "Impressora 8 Cores", type: "impressao" },
  { id: "cs-01", name: "Corte e Solda 03", type: "corte_solda" },
  { id: "sac-01", name: "Sacoleira Automática 01", type: "corte_solda" },
];

export function UniversalMesStation() {
  const [selectedMachineId, setSelectedMachineId] = useState<string>("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [opData, setOpData] = useState<{ numero: string; cliente: string } | null>(null);
  const [refugoValue, setRefugoValue] = useState<string>("");
  const [isAlerting, setIsAlerting] = useState(false);

  const selectedMachine = MACHINES.find(m => m.id === selectedMachineId);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;
    
    // Simulação de busca de OP
    toast.success(`OP ${barcodeInput} carregada com sucesso`);
    setOpData({ numero: barcodeInput, cliente: "INDÚSTRIA EXEMPLO LTDA" });
    setBarcodeInput("");
  };

  const handleRefugoChange = (val: string) => {
    setRefugoValue(val);
    const num = parseFloat(val);
    // Poka-Yoke Visual: Se o refugo for superior a 5% (simulando 5% de uma bobina de 100kg p/ exemplo)
    setIsAlerting(num > 5);
  };

  const renderInputs = () => {
    if (!selectedMachine) return null;

    switch (selectedMachine.type) {
      case "extrusao":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold">Peso da Bobina (kg)</Label>
              <Input type="number" className="h-16 text-2xl font-black bg-slate-800" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold">Metragem (m)</Label>
              <Input type="number" className="h-16 text-2xl font-black bg-slate-800" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold">Razão de Sopro (BUR)</Label>
              <Input type="number" step="0.1" className="h-16 text-2xl font-black bg-slate-800" placeholder="0.0" />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold">Lote de Resina</Label>
              <Input className="h-16 text-2xl font-black bg-slate-800 uppercase" placeholder="RES-XXXX" />
            </div>
          </div>
        );
      case "impressao":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold">Metros Rodados</Label>
              <Input type="number" className="h-16 text-2xl font-black bg-slate-800" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold">Viscosidade da Tinta (s)</Label>
              <Input type="number" className="h-16 text-2xl font-black bg-slate-800" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold">Perda de Acerto (kg)</Label>
              <Input type="number" className="h-16 text-2xl font-black bg-slate-800" placeholder="0.00" />
            </div>
          </div>
        );
      case "corte_solda":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold">Milheiros Concluídos</Label>
              <Input type="number" className="h-16 text-2xl font-black bg-slate-800" placeholder="0.0" />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold">Pacotes</Label>
              <Input type="number" className="h-16 text-2xl font-black bg-slate-800" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold">Refile/Apara (kg)</Label>
              <Input 
                type="number" 
                value={refugoValue}
                onChange={(e) => handleRefugoChange(e.target.value)}
                className={cn(
                  "h-16 text-2xl font-black bg-slate-800",
                  isAlerting && "border-amber-500 border-4 animate-pulse"
                )} 
                placeholder="0.00" 
              />
              {isAlerting && (
                <div className="text-amber-500 flex items-center gap-2 font-bold text-sm mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alerta: Refugo alto ({">"} 5%). Possíveis causas: Borra de purga, Arrasto de solda.
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white min-h-[900px] rounded-3xl overflow-hidden border-8 border-slate-900 shadow-2xl font-sans text-sm">
      {/* OEE em Tempo Real no Topo */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-800">
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-400 uppercase">
              <span>Disponibilidade</span>
              <span className="text-primary">94.2%</span>
            </div>
            <Progress value={94.2} className="h-1.5 bg-slate-800" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-400 uppercase">
              <span>Performance</span>
              <span className="text-primary">88.5%</span>
            </div>
            <Progress value={88.5} className="h-1.5 bg-slate-800" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-400 uppercase">
              <span>Qualidade</span>
              <span className="text-emerald-500">99.1%</span>
            </div>
            <Progress value={99.1} className="h-1.5 bg-slate-800 [&>div]:bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* Seleção de Máquina e Scanner */}
      <div className="p-6 bg-slate-900 flex flex-col md:flex-row gap-6 items-center border-b border-slate-800">
        <div className="w-full md:w-1/3">
          <Label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">
            Selecionar Máquina
          </Label>
          <Select value={selectedMachineId} onValueChange={setSelectedMachineId}>
            <SelectTrigger className="h-14 bg-slate-800 border-slate-700 text-xl font-bold rounded-2xl">
              <SelectValue placeholder="Escolha a máquina..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {MACHINES.map(m => (
                <SelectItem key={m.id} value={m.id} className="text-lg focus:bg-primary focus:text-white">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleBarcodeSubmit} className="w-full md:flex-1 relative">
          <Label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">
            Bipe / Código de Barras (OP)
          </Label>
          <div className="relative">
            <Scan className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
            <Input 
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="h-14 pl-12 bg-slate-800 border-slate-700 text-xl font-mono placeholder:font-sans" 
              placeholder="Bipar etiqueta da OP..." 
            />
          </div>
        </form>

        {opData && (
          <div className="bg-primary/10 border border-primary/30 p-3 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
            <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] font-black text-primary uppercase">OP ATIVA</div>
              <div className="text-lg font-black tracking-tight">{opData.numero}</div>
            </div>
          </div>
        )}
      </div>

      {/* Área Central de Input Dinâmico */}
      <div className="flex-1 p-8">
        {!selectedMachine ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
            <Monitor className="h-20 w-20 opacity-20" />
            <p className="text-2xl font-bold opacity-40">Selecione uma máquina para iniciar o apontamento</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500 text-white font-black px-4 py-1 text-sm rounded-full">ATIVO</Badge>
              <h2 className="text-3xl font-black tracking-tighter uppercase">{selectedMachine.name}</h2>
            </div>
            
            {renderInputs()}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <Button 
                onClick={() => {
                  toast.info("Ações de Bobina", {
                    description: (
                      <div className="mt-2 flex flex-col gap-2">
                        <p className="text-xs">Finalizar bobina na {selectedMachine.name}?</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" className="h-8 text-[10px] bg-emerald-600" onClick={() => toast.success("Bobina finalizada e estoque atualizado.")}>Confirmar & Imprimir Etiqueta</Button>
                          <Button size="sm" variant="outline" className="h-8 text-[10px]" onClick={() => toast.info("Pesagem manual solicitada.")}>Ajuste de Peso</Button>
                        </div>
                      </div>
                    )
                  });
                }}
                className="h-32 text-2xl font-black uppercase rounded-[32px] bg-slate-900 border-4 border-emerald-900 hover:bg-emerald-900 hover:border-emerald-600 transition-all group"
              >
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="h-10 w-10 text-emerald-500 group-hover:scale-110 transition-transform" />
                  Concluir Bobina
                </div>
              </Button>
              <Button 
                onClick={() => {
                  toast.warning("Ações de Refugo", {
                    description: (
                      <div className="mt-2 flex flex-col gap-2">
                        <p className="text-xs">Motivo do refugo ({refugoValue} kg):</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="destructive" className="h-8 text-[10px]" onClick={() => toast.error("Refugo por Borra registrado.")}>Borra/Purga</Button>
                          <Button size="sm" variant="destructive" className="h-8 text-[10px]" onClick={() => toast.error("Refugo por Acerto registrado.")}>Acerto/Setup</Button>
                          <Button size="sm" variant="destructive" className="h-8 text-[10px]" onClick={() => toast.error("Refugo por Defeito registrado.")}>Defeito Visual</Button>
                          <Button size="sm" variant="destructive" className="h-8 text-[10px]" onClick={() => toast.error("Refugo por Espessura registrado.")}>Fora da micra</Button>
                        </div>
                      </div>
                    )
                  });
                }}
                className="h-32 text-2xl font-black uppercase rounded-[32px] bg-slate-900 border-4 border-amber-900 hover:bg-amber-900 hover:border-amber-600 transition-all group"
              >
                <div className="flex flex-col items-center gap-2">
                  <Trash2 className="h-10 w-10 text-amber-500 group-hover:scale-110 transition-transform" />
                  Registrar Refugo
                </div>
              </Button>
              <Button 
                onClick={() => {
                  toast.error("Parada de Máquina", {
                    description: (
                      <div className="mt-2 flex flex-col gap-2">
                        <p className="text-xs font-bold text-white">Selecione o motivo da interrupção:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="destructive" className="h-8 text-[10px]" onClick={() => toast.error("Parada Mecânica registrada.")}>Mecânica</Button>
                          <Button size="sm" variant="destructive" className="h-8 text-[10px]" onClick={() => toast.error("Parada Elétrica registrada.")}>Elétrica</Button>
                          <Button size="sm" variant="destructive" className="h-8 text-[10px]" onClick={() => toast.error("Falta de Material registrada.")}>Falta MP</Button>
                          <Button size="sm" variant="destructive" className="h-8 text-[10px]" onClick={() => toast.error("Troca de Turno registrada.")}>Troca Turno</Button>
                        </div>
                      </div>
                    )
                  });
                }}
                className="h-32 text-2xl font-black uppercase rounded-[32px] bg-slate-900 border-4 border-rose-900 hover:bg-rose-900 hover:border-rose-600 transition-all group"
              >
                <div className="flex flex-col items-center gap-2">
                  <PauseCircle className="h-10 w-10 text-rose-500 group-hover:scale-110 transition-transform" />
                  Parar Máquina
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Industrial */}
      <div className="bg-slate-900 p-6 flex justify-between items-center border-t border-slate-800">
        <div className="flex gap-12">
          <div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Operador Ativo</div>
            <div className="flex items-center gap-2 font-bold">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">AG</div>
              ASAPH G.
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Turno</div>
            <div className="text-lg font-black">1º TURNO (A)</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sincronização Cloud</div>
            <div className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              CONECTADO
            </div>
          </div>
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-700 bg-slate-800 text-white font-bold hover:bg-slate-700">
            Histórico do Turno
          </Button>
        </div>
      </div>
    </div>
  );
}
