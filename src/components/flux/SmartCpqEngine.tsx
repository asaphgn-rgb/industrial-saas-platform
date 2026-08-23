import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Calculator, FileCheck2, Factory, Gauge, TrendingUp, Zap } from "lucide-react";

type ProdutoTipo = "sacola" | "saco_lixo" | "bobina" | "laminado";
type ResinaTipo = "pead" | "pebd" | "pcr" | "master";

const PRODUTOS: Record<ProdutoTipo, { label: string; dificuldade: number; fatorMaquina: number }> = {
  sacola: { label: "Sacola Camiseta", dificuldade: 1, fatorMaquina: 1 },
  saco_lixo: { label: "Saco de Lixo", dificuldade: 0.8, fatorMaquina: 0.9 },
  bobina: { label: "Bobina Técnica", dificuldade: 1.3, fatorMaquina: 1.2 },
  laminado: { label: "Laminado", dificuldade: 1.8, fatorMaquina: 1.6 },
};

const RESINAS: Record<ResinaTipo, { label: string; densidade: number; preco: number }> = {
  pead: { label: "PEAD Virgem", densidade: 0.96, preco: 9.4 },
  pebd: { label: "PEBD", densidade: 0.923, preco: 8.9 },
  pcr: { label: "Reciclado PCR", densidade: 0.94, preco: 6.2 },
  master: { label: "Masterbatch (mix)", densidade: 0.95, preco: 11.8 },
};

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function SmartCpqEngine() {
  const [produto, setProduto] = useState<ProdutoTipo>("sacola");
  const [resina, setResina] = useState<ResinaTipo>("pead");
  const [largura, setLargura] = useState(300);
  const [altura, setAltura] = useState(400);
  const [sanfona, setSanfona] = useState(0);
  const [espessura, setEspessura] = useState(20);
  const [quantidade, setQuantidade] = useState(500);
  const [unidade, setUnidade] = useState<"kg" | "milheiro">("kg");
  const [precoVenda, setPrecoVenda] = useState(14.5);

  const calc = useMemo(() => {
    const r = RESINAS[resina];
    const p = PRODUTOS[produto];
    const larguraTotal = (largura + sanfona) / 1000; // m
    const alturaM = altura / 1000; // m
    // 2 faces (soldado) para sacos/sacolas, 1 face para bobina/laminado
    const faces = produto === "bobina" || produto === "laminado" ? 1 : 2;
    const areaUnit = larguraTotal * alturaM * faces; // m2 por peça
    const gramatura = espessura * r.densidade; // g/m2 (µm * g/cm3)
    const pesoUnit = (areaUnit * gramatura) / 1000; // kg por peça
    const pesoMilheiro = pesoUnit * 1000; // kg / milheiro
    const rendimento = gramatura > 0 ? 1000 / gramatura : 0; // m2/kg

    const pesoTotal = unidade === "kg" ? quantidade : quantidade * pesoMilheiro;
    const milheiros = pesoMilheiro > 0 ? pesoTotal / pesoMilheiro : 0;

    const custoMp = pesoTotal * r.preco;
    const custoConversao = pesoTotal * 1.85 * p.dificuldade;
    const custoTotal = custoMp + custoConversao;
    const receita = pesoTotal * precoVenda;
    const margem = receita > 0 ? ((receita - custoTotal) / receita) * 100 : 0;
    const horasMaquina = (pesoTotal / 120) * p.fatorMaquina; // 120 kg/h de referência

    const grau = p.dificuldade >= 1.6 ? "Alto" : p.dificuldade >= 1.2 ? "Médio" : "Baixo";

    return {
      gramatura,
      pesoMilheiro,
      rendimento,
      pesoTotal,
      milheiros,
      custoMp,
      custoConversao,
      custoTotal,
      receita,
      margem,
      horasMaquina,
      grau,
    };
  }, [produto, resina, largura, altura, sanfona, espessura, quantidade, unidade, precoVenda]);

  const margemOk = calc.margem >= 15;

  const aprovar = () => {
    toast.info("Ações de Orçamento", {
      description: (
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-xs">O que deseja fazer com este orçamento de {fmt(calc.pesoTotal, 0)} kg?</p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              className="h-8 text-[10px] bg-emerald-600 hover:bg-emerald-700" 
              onClick={() => {
                toast.success("Orçamento aprovado e OP gerada com sucesso!");
                // Aqui entraria a persistência real no Supabase
              }}
            >
              Aprovar & Gerar OP
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 text-[10px]"
              onClick={() => toast.info("PDF de Proposta gerado.")}
            >
              Gerar PDF Comercial
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 text-[10px]"
              onClick={() => toast.info("Enviado para revisão da Engenharia.")}
            >
              Revisão Técnica
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 text-[10px]"
              onClick={() => toast.info("Salvo como Rascunho.")}
            >
              Salvar Rascunho
            </Button>
          </div>
        </div>
      ),
      duration: 5000,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            CPQ Inteligente — Orçamento em 30 segundos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tipo de produto</Label>
              <Select value={produto} onValueChange={(v) => setProduto(v as ProdutoTipo)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PRODUTOS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Resina / estrutura</Label>
              <Select value={resina} onValueChange={(v) => setResina(v as ResinaTipo)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(RESINAS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label>Largura (mm)</Label>
              <Input type="number" value={largura} onChange={(e) => setLargura(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Altura (mm)</Label>
              <Input type="number" value={altura} onChange={(e) => setAltura(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Sanfonas (mm)</Label>
              <Input type="number" value={sanfona} onChange={(e) => setSanfona(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Espessura (µm)</Label>
              <Input type="number" value={espessura} onChange={(e) => setEspessura(Number(e.target.value))} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Quantidade alvo</Label>
              <Input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select value={unidade} onValueChange={(v) => setUnidade(v as "kg" | "milheiro")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                  <SelectItem value="milheiro">Milheiros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preço de venda (R$/kg)</Label>
              <Input type="number" step="0.1" value={precoVenda} onChange={(e) => setPrecoVenda(Number(e.target.value))} />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { icon: Calculator, label: "Gramatura", value: `${fmt(calc.gramatura)} g/m²` },
              { icon: Gauge, label: "Peso / milheiro", value: `${fmt(calc.pesoMilheiro, 3)} kg` },
              { icon: TrendingUp, label: "Rendimento", value: `${fmt(calc.rendimento)} m²/kg` },
              { icon: Factory, label: "Custo matéria-prima", value: `R$ ${fmt(calc.custoMp)}` },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border bg-muted/40 p-3 text-center">
                <m.icon className="mx-auto mb-1 h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-base font-semibold tabular-nums">{m.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCheck2 className="h-5 w-5 text-primary" />
            Parecer de margem e viabilidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-3 space-y-1.5 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Margem líquida estimada</span>
              <Badge variant={margemOk ? "default" : "destructive"}>{fmt(calc.margem, 1)}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Grau de dificuldade</span>
              <span className="font-medium">{calc.grau}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tempo de máquina</span>
              <span className="font-medium tabular-nums">{fmt(calc.horasMaquina, 1)} h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Peso total</span>
              <span className="font-medium tabular-nums">{fmt(calc.pesoTotal, 0)} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Milheiros</span>
              <span className="font-medium tabular-nums">{fmt(calc.milheiros, 1)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Custo total</span>
              <span className="font-medium tabular-nums">R$ {fmt(calc.custoTotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Receita</span>
              <span className="font-medium tabular-nums">R$ {fmt(calc.receita)}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {margemOk
              ? "Viabilidade aprovada: margem acima do piso industrial de 15%. Sequenciamento recomendado sem restrições."
              : "Atenção: margem abaixo do piso de 15%. Reveja espessura, resina ou preço antes de aprovar."}
          </p>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg" onClick={aprovar}>
            Aprovar e Gerar OP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SmartCpqEngine;
