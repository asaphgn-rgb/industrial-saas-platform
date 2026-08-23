import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calculator,
  BookOpen,
  Lightbulb,
  ChevronDown,
  GraduationCap,
  Info,
} from "lucide-react";
import { DENSIDADES } from "@/lib/calc-embalagens";
import {
  razaoSopro,
  razaoSoproPorLayflat,
  avaliarRazaoSopro,
  drawDownRatio,
  taxaSaidaKgH,
  alturaLinhaCongelamentoMm,
  repeticaoCilindroMm,
  metrosPorHora,
  impressoesPorHora,
  consumoTintaKg,
  areaImpressaM2,
  gramaturaLaminado,
  consumoAdesivoKg,
  m2PorKg,
  metragemPorDiametro,
  diametroPorMetragem,
  planoCorte,
  sacosPorHora,
  milheirosPorHora,
  consumoFilmeMMin,
  kgParaMilheiro,
  milheiroParaKg,
  type EtapaCalculo,
} from "@/lib/calc-processos";
import {
  validarRazaoSopro,
  validarDdr,
  validarTaxaSaida,
  validarConversaoKgMilheiro,
  resumoValidacao,
} from "@/lib/calc-validacao";
import {
  CalcExportProvider,
  AvisosValidacao,
  useRegistroCalculo,
} from "@/components/flux/calc/CalcExport";

const num = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString("pt-BR", { maximumFractionDigits: d }) : "—";

function Campo({
  label,
  value,
  onChange,
  step,
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: string;
  tooltip?: string;
}) {
  const input = (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        inputMode="decimal"
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="h-11"
      />
    </div>
  );
  if (!tooltip) return input;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{input}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Res({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div
      className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${tone ?? "bg-muted/30"}`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold tabular-nums">{value}</span>
    </div>
  );
}

/* ── Ilustrações esquemáticas em SVG ── */
function SvgBalaoExtrusao() {
  return (
    <svg viewBox="0 0 200 160" className="h-32 w-full rounded-md bg-muted/30 p-2">
      <title>Bolha de extrusão e razão de sopro</title>
      <ellipse cx="100" cy="80" rx="60" ry="70" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="100" y1="10" x2="100" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4" />
      <text x="110" y="45" fontSize="10" fill="currentColor">Diâmetro do balão</text>
      <rect x="85" y="145" width="30" height="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="100" y="138" textAnchor="middle" fontSize="9" fill="currentColor">Die</text>
      <text x="100" y="85" textAnchor="middle" fontSize="9" fill="currentColor">BUR = balão ÷ die</text>
    </svg>
  );
}

function SvgDrawDown() {
  return (
    <svg viewBox="0 0 200 120" className="h-32 w-full rounded-md bg-muted/30 p-2">
      <title>Draw Down Ratio</title>
      <rect x="80" y="10" width="40" height="15" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="100" y="5" textAnchor="middle" fontSize="9" fill="currentColor">Gap do die</text>
      <line x1="100" y1="25" x2="100" y2="55" stroke="currentColor" strokeWidth="1" strokeDasharray="3" />
      <rect x="85" y="55" width="30" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="100" y="85" textAnchor="middle" fontSize="9" fill="currentColor">Filme final</text>
      <text x="145" y="60" fontSize="9" fill="currentColor">DDR = gap ÷ (espessura × BUR)</text>
    </svg>
  );
}

function SvgBobinaTubete() {
  return (
    <svg viewBox="0 0 200 140" className="h-32 w-full rounded-md bg-muted/30 p-2">
      <title>Metragem por diâmetro e tubete</title>
      <circle cx="100" cy="70" r="55" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="70" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="100" y1="70" x2="155" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3" />
      <text x="130" y="62" textAnchor="middle" fontSize="9" fill="currentColor">Diâmetro externo</text>
      <text x="100" y="74" textAnchor="middle" fontSize="8" fill="currentColor">Tubete</text>
      <text x="100" y="132" textAnchor="middle" fontSize="9" fill="currentColor">Metragem = π × (D² - d²) ÷ (4 × espessura × camadas)</text>
    </svg>
  );
}

function SvgLaminado() {
  return (
    <svg viewBox="0 0 200 100" className="h-32 w-full rounded-md bg-muted/30 p-2">
      <title>Laminação e gramatura</title>
      <rect x="10" y="20" width="180" height="18" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="40" width="180" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3" />
      <rect x="10" y="54" width="180" height="22" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="15" y="14" fontSize="9" fill="currentColor">Camada 1</text>
      <text x="15" y="48" fontSize="8" fill="currentColor">Adesivo</text>
      <text x="15" y="86" fontSize="9" fill="currentColor">Camada 2</text>
      <text x="130" y="50" fontSize="9" fill="currentColor">Gramatura = Σ (µm × densidade)</text>
    </svg>
  );
}

function SvgMilheiro() {
  return (
    <svg viewBox="0 0 200 120" className="h-32 w-full rounded-md bg-muted/30 p-2">
      <title>Peso por milheiro</title>
      <rect x="40" y="30" width="50" height="70" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="95" y="30" width="50" height="70" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="150" y="30" width="50" height="70" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="115" y="20" textAnchor="middle" fontSize="9" fill="currentColor">1.000 unidades</text>
      <text x="115" y="115" textAnchor="middle" fontSize="9" fill="currentColor">Peso (kg) = unidades × peso unitário (g) ÷ 1.000.000</text>
    </svg>
  );
}

/* ── Guia didático expansível ── */
interface GuiaCalculoProps {
  titulo: string;
  formula: string;
  formulaExplicada: React.ReactNode;
  impacto: string;
  valores: { material: string; faixa: string; observacao?: string }[];
  ilustracao: React.ReactNode;
  badges?: string[];
}

function GuiaCalculo({
  titulo,
  formula,
  formulaExplicada,
  impacto,
  valores,
  ilustracao,
  badges = [],
}: GuiaCalculoProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-semibold">{titulo}</h4>
        {badges.map((b) => (
          <Badge key={b} variant="secondary" className="text-xs">
            {b}
          </Badge>
        ))}
      </div>

      <div className="mb-4">{ilustracao}</div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Calculator className="h-4 w-4" /> Fórmula matemática
        </div>
        <div className="rounded-md bg-muted/50 p-3 font-mono text-sm leading-relaxed">
          {formula}
        </div>
        <div className="text-xs text-muted-foreground">{formulaExplicada}</div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-amber-500">
          <Lightbulb className="h-4 w-4" /> Impacto prático na sacola/filme
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{impacto}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-500">
          <Info className="h-4 w-4" /> Valores típicos de mercado
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {valores.map((v) => (
            <div
              key={v.material}
              className="rounded-md border bg-muted/30 p-2 text-xs"
            >
              <div className="font-semibold">{v.material}</div>
              <div className="font-mono text-primary">{v.faixa}</div>
              {v.observacao && (
                <div className="mt-1 text-muted-foreground">{v.observacao}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GuiaDidaticoCompleto() {
  const guias: GuiaCalculoProps[] = [
    {
      titulo: "Razão de Sopro (BUR)",
      formula: "BUR = (2 × Largura Plana) ÷ (π × Diâmetro da Matriz)",
      formulaExplicada: (
        <>
          A largura plana (layflat) é metade do perímetro do balão. Multiplicando por 2 obtemos o
          perímetro. Dividindo por π, chegamos ao diâmetro do balão. O BUR compara esse diâmetro
          com o da matriz, indicando quanto o filme foi expandido transversalmente.
        </>
      ),
      impacto:
        "Se o BUR for muito alto (&gt; 3,5), o filme perde resistência longitudinal e a sacola rasga no fundo. Se for muito baixo (&lt; 1,5), perde resistência transversal, aumentando o risco de estouro lateral. O equilíbrio define a orientação molecular e o desempenho mecânico final.",
      valores: [
        { material: "PEBD (LDPE)", faixa: "2,0 a 3,0", observacao: "Sacolas de mercado e lixo" },
        { material: "PEAD (HDPE)", faixa: "3,5 a 5,0", observacao: "Filmes mais rígidos e resistentes" },
        { material: "PP", faixa: "1,2 a 2,0", observacao: "Filmes de alta transparência e baixa orientação" },
      ],
      ilustracao: <SvgBalaoExtrusao />,
      badges: ["Extrusão", "Orientação molecular"],
    },
    {
      titulo: "Draw Down Ratio (DDR)",
      formula: "DDR = Gap do Die ÷ (Espessura Final × BUR)",
      formulaExplicada: (
        <>
          O DDR mede o estiramento longitudinal do filme. O gap do die é a espessura inicial do
          fundido; dividindo pelo produto da espessura final pela razão de sopro, temos a razão de
          estiramento na máquina (MD). Ele trabalha em conjunto com o BUR para balancear as
          propriedades mecânicas.
        </>
      ),
      impacto:
        "DDR alto aumenta a resistência longitudinal (MD), mas deixa o filme mais frágil transversalmente e pode elevar a tensão interna. DDR baixo reduz o estiramento, deixando o filme mais isotrópico, porém com menor rendimento de máquina e maior espessura.",
      valores: [
        { material: "PEBD", faixa: "4 a 8", observacao: "Equilíbrio MD/TD comum" },
        { material: "PEAD", faixa: "8 a 15", observacao: "Maior estiramento para rigidez" },
        { material: "PP", faixa: "3 a 6", observacao: "Evita cristalização excessiva" },
      ],
      ilustracao: <SvgDrawDown />,
      badges: ["Extrusão", "Estiramento MD"],
    },
    {
      titulo: "Metragem por Diâmetro de Bobina",
      formula: "M = π × (D² - d²) ÷ (4 × espessura × camadas)",
      formulaExplicada: (
        <>
          A metragem de filme em uma bobina é o volume do anel de material dividido pela área da
          seção transversal. D é o diâmetro externo, d é o diâmetro do tubete, a espessura está em
          mm e o número de camadas considera se o filme é tubular (2) ou aberto (1).
        </>
      ),
      impacto:
        "Calcular a metragem correta evita paradas de troca de bobina na impressora ou corte/solda, reduzindo setups. Bobinas com metragem mal estimadas geram sobra de material ou falta no meio da tiragem, afetando o planejamento de produção.",
      valores: [
        { material: "Bobina tubular 400mm", faixa: "~1.500 a 3.000 m", observacao: "Varia com espessura e diâmetro" },
        { material: "Bobina aberta 1.000mm", faixa: "~2.000 a 5.000 m", observacao: "Maior área de enrolamento" },
        { material: "Tubete padrão", faixa: "76 a 152 mm", observacao: "Define o volume útil interno" },
      ],
      ilustracao: <SvgBobinaTubete />,
      badges: ["Rebobinamento", "Planejamento"],
    },
    {
      titulo: "Gramatura de Laminado",
      formula: "G = Σ (espessura_i × densidade_i) + adesivo seco",
      formulaExplicada: (
        <>
          A gramatura total é a soma das contribuições de cada camada plástica (espessura em µm
          multiplicada pela densidade em g/cm³) mais a quantidade de adesivo seco depositada em
          g/m². Resultado final em g/m².
        </>
      ),
      impacto:
        "Gramatura alta aumenta o custo e a espessura, mas melhora a barreira, a resistência e a aparência. Gramatura baixa economiza material, porém pode comprometer a selabilidade, a impressão e a durabilidade da embalagem final.",
      valores: [
        { material: "BOPP 20µm + LDPE 60µm", faixa: "~75 a 85 g/m²", observacao: "Laminado comum para snacks" },
        { material: "PET 12µm + LDPE 70µm", faixa: "~90 a 100 g/m²", observacao: "Alta barreira e brilho" },
        { material: "Adesivo seco", faixa: "2 a 4 g/m²", observacao: "Depender da laminação solvente ou solventless" },
      ],
      ilustracao: <SvgLaminado />,
      badges: ["Laminação", "Custo/barreira"],
    },
    {
      titulo: "Peso por Milheiro",
      formula: "Peso (kg) = (Milheiros × 1.000 × peso unitário g) ÷ 1.000.000",
      formulaExplicada: (
        <>
          Um milheiro equivale a 1.000 unidades. Multiplicando a quantidade em milheiros por 1.000
          obtemos o número de sacos. Multiplicando pelo peso unitário em gramas e dividindo por um
          milhão, convertemos para quilogramas.
        </>
      ),
      impacto:
        "A conversão precisa entre kg e milheiro é essencial para precificação, compra de matéria-prima e controle de estoque. Erros na conversão geram orçamentos fora da realidade e desperdício de material.",
      valores: [
        { material: "Sacola leve 10g", faixa: "10 kg / milheiro", observacao: "Sacolas de supermercado finas" },
        { material: "Sacola padrão 25g", faixa: "25 kg / milheiro", observacao: "Uso geral e lixo 50L" },
        { material: "Sacola reforçada 60g", faixa: "60 kg / milheiro", observacao: "Construção e carga pesada" },
      ],
      ilustracao: <SvgMilheiro />,
      badges: ["Corte/Solda", "Precificação"],
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-5 w-5" />
            Guia Didático e Conceitos de Plásticos Flexíveis
          </CardTitle>
          <CardDescription>
            Cada cálculo técnico explicado para engenheiros novatos e operadores de chão de fábrica.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {guias.map((g) => (
          <GuiaCalculo key={g.titulo} {...g} />
        ))}
      </div>
    </div>
  );
}

/* ── Bloco de cálculo com guia expansível ── */
function Bloco({
  titulo,
  descricao,
  campos,
  resultados,
  guia,
}: {
  titulo: string;
  descricao: string;
  campos: React.ReactNode;
  resultados: React.ReactNode;
  guia?: GuiaCalculoProps;
}) {
  const [guiaAberto, setGuiaAberto] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-4 w-4" /> {titulo}
        </CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-3 sm:grid-cols-2">{campos}</div>
        <div className="space-y-2">{resultados}</div>
      </CardContent>
      {guia && (
        <CardFooter className="flex-col items-start gap-3 border-t bg-muted/20 px-6 py-4">
          <Collapsible open={guiaAberto} onOpenChange={setGuiaAberto} className="w-full">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Entenda o Cálculo
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${guiaAberto ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <GuiaCalculo {...guia} />
            </CollapsibleContent>
          </Collapsible>
        </CardFooter>
      )}
    </Card>
  );
}

/* ── Extrusão ── */
function CalcExtrusao() {
  const [f, setF] = useState({
    dieMm: 200,
    layflatMm: 600,
    gapMm: 1.5,
    espessuraUm: 50,
    densidade: DENSIDADES.LDPE,
    velocidadeMMin: 35,
  });
  const bur = razaoSoproPorLayflat(f.layflatMm, f.dieMm);
  const aval = avaliarRazaoSopro(bur);
  const ddrV = drawDownRatio(f.gapMm, f.espessuraUm, bur);
  const taxa = taxaSaidaKgH(f.layflatMm, f.espessuraUm, f.densidade, f.velocidadeMMin);
  const avisos = [
    ...validarRazaoSopro({ layflatMm: f.layflatMm, diametroDieMm: f.dieMm }),
    ...validarDdr({ gapDieMm: f.gapMm, espessuraFinalUm: f.espessuraUm, bur }),
    ...validarTaxaSaida({
      layflatMm: f.layflatMm,
      espessuraUm: f.espessuraUm,
      densidade: f.densidade,
      velocidadeMMin: f.velocidadeMMin,
    }),
  ];
  const valido = resumoValidacao(avisos).valido;

  useRegistroCalculo("extrusao", {
    titulo: "Extrusão — BUR, DDR e taxa de saída",
    parametros: [
      ["Diâmetro do die (mm)", num(f.dieMm)],
      ["Layflat (mm)", num(f.layflatMm)],
      ["Gap do die (mm)", num(f.gapMm)],
      ["Espessura final (µm)", num(f.espessuraUm)],
      ["Densidade (g/cm³)", num(f.densidade, 3)],
      ["Velocidade (m/min)", num(f.velocidadeMMin)],
    ],
    resultados: valido
      ? [
          ["Razão de sopro (BUR)", `${num(bur, 2)} ×`],
          ["DDR", `${num(ddrV, 2)} ×`],
          ["Taxa de saída", `${num(taxa, 1)} kg/h`],
          ["Linha de congelamento (ref.)", `${num(alturaLinhaCongelamentoMm(f.dieMm), 0)} mm`],
        ]
      : [["Resultado", "Não calculado — corrija os erros de entrada"]],
    avisos: avisos.map((a) => `${a.mensagem}${a.recomendacao ? ` ${a.recomendacao}` : ""}`),
  });

  const guiaBur: GuiaCalculoProps = {
    titulo: "Razão de Sopro (BUR) e DDR",
    formula: "BUR = (2 × Largura Plana) ÷ (π × Diâmetro da Matriz)    |    DDR = Gap ÷ (espessura × BUR)",
    formulaExplicada: (
      <>
        O BUR mede a expansão transversal da bolha. O DDR complementa, medindo o estiramento
        longitudinal. Juntos definem a orientação mecânica do filme.
      </>
    ),
    impacto:
      "BUR alto demais gera instabilidade no balão e perda de resistência longitudinal. BUR baixo reduz a resistência transversal. DDR fora da faixa causa amolecimento ou excesso de tensão interna.",
    valores: [
      { material: "PEBD", faixa: "BUR 2,0–3,0 | DDR 4–8" },
      { material: "PEAD", faixa: "BUR 3,5–5,0 | DDR 8–15" },
      { material: "PP", faixa: "BUR 1,2–2,0 | DDR 3–6" },
    ],
    ilustracao: <SvgBalaoExtrusao />,
    badges: ["BUR", "DDR"],
  };

  return (
    <Bloco
      titulo="Razão de sopro (BUR) e extrusão balão"
      descricao="BUR = diâmetro do balão ÷ diâmetro do die. Calculado a partir da largura plana (layflat)."
      guia={guiaBur}
      campos={
        <>
          <Campo label="Diâmetro do die (mm)" value={f.dieMm} onChange={(v) => setF({ ...f, dieMm: v })} />
          <Campo label="Layflat / largura plana (mm)" value={f.layflatMm} onChange={(v) => setF({ ...f, layflatMm: v })} />
          <Campo label="Gap do die (mm)" step="0.1" value={f.gapMm} onChange={(v) => setF({ ...f, gapMm: v })} />
          <Campo label="Espessura final (µm)" value={f.espessuraUm} onChange={(v) => setF({ ...f, espessuraUm: v })} />
          <Campo label="Densidade (g/cm³)" step="0.001" value={f.densidade} onChange={(v) => setF({ ...f, densidade: v })} />
          <Campo label="Velocidade (m/min)" value={f.velocidadeMMin} onChange={(v) => setF({ ...f, velocidadeMMin: v })} />
        </>
      }
      resultados={
        <>
          <AvisosValidacao avisos={avisos} />
          {valido ? (
            <>
              <Res
                label="Razão de sopro (BUR)"
                value={`${num(bur, 2)} ×`}
                tone={
                  aval.status === "ideal"
                    ? "border-success/40 bg-success/5"
                    : "border-warning/40 bg-warning/5"
                }
              />
              <p className="text-xs text-muted-foreground">{aval.nota}</p>
              <Res label="Diâmetro do balão" value={`${num((2 * f.layflatMm) / Math.PI, 1)} mm`} />
              <Res label="DDR" value={`${num(ddrV, 2)} ×`} />
              <Res label="Taxa de saída" value={`${num(taxa, 1)} kg/h`} />
              <Res label="Linha de congelamento (ref.)" value={`${num(alturaLinhaCongelamentoMm(f.dieMm), 0)} mm`} />
              <Res label="Razão de sopro por diâmetro direto" value={`${num(razaoSopro((2 * f.layflatMm) / Math.PI, f.dieMm), 2)} ×`} />
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Corrija os campos sinalizados para liberar os resultados.
            </p>
          )}
        </>
      }
    />
  );
}

/* ── Impressão ── */
function CalcImpressao() {
  const [f, setF] = useState({
    dentes: 120,
    passoMm: 3.175,
    velocidadeMMin: 150,
    larguraMm: 800,
    metros: 5000,
    anilox: 4,
    cobertura: 35,
  });
  const rep = repeticaoCilindroMm(f.dentes, f.passoMm);
  const area = areaImpressaM2(f.larguraMm, f.metros);

  const guia: GuiaCalculoProps = {
    titulo: "Repetição de Cilindro e Consumo de Tinta",
    formula: "Repetição = dentes × passo    |    Área = largura × metragem",
    formulaExplicada: (
      <>
        A repetição define o comprimento de cada impressão. A área impressa é a base para calcular
        o consumo de tinta: volume do anilox × área × cobertura.
      </>
    ),
    impacto:
      "Repetição errada alonga ou comprime a arte. Cobertura alta e anilox grosso aumentam o consumo de tinta e o custo. Anilox fino demais deixa a impressão falhada.",
    valores: [
      { material: "Anilox fino", faixa: "2–4 cm³/m²", observacao: "Textos e detalhes" },
      { material: "Anilox médio", faixa: "4–6 cm³/m²", observacao: "Meio-tons" },
      { material: "Anilox grosso", faixa: "6–10 cm³/m²", observacao: "Fundos sólidos" },
    ],
    ilustracao: <SvgMilheiro />,
    badges: ["Flexografia", "Custo de tinta"],
  };

  return (
    <Bloco
      titulo="Impressão flexográfica"
      descricao="Repetição de cilindro, produtividade e consumo de tinta por tiragem."
      guia={guia}
      campos={
        <>
          <Campo label="Nº de dentes" value={f.dentes} onChange={(v) => setF({ ...f, dentes: v })} />
          <Campo label="Passo (mm)" step="0.001" value={f.passoMm} onChange={(v) => setF({ ...f, passoMm: v })} />
          <Campo label="Velocidade (m/min)" value={f.velocidadeMMin} onChange={(v) => setF({ ...f, velocidadeMMin: v })} />
          <Campo label="Largura (mm)" value={f.larguraMm} onChange={(v) => setF({ ...f, larguraMm: v })} />
          <Campo label="Metragem (m)" value={f.metros} onChange={(v) => setF({ ...f, metros: v })} />
          <Campo label="Anilox (cm³/m²)" step="0.1" value={f.anilox} onChange={(v) => setF({ ...f, anilox: v })} />
          <Campo label="Cobertura de arte (%)" value={f.cobertura} onChange={(v) => setF({ ...f, cobertura: v })} />
        </>
      }
      resultados={
        <>
          <Res label="Repetição (desenvolvimento)" value={`${num(rep, 2)} mm`} />
          <Res label="Metros por hora" value={`${num(metrosPorHora(f.velocidadeMMin), 0)} m/h`} />
          <Res label="Impressões por hora" value={`${num(impressoesPorHora(f.velocidadeMMin, rep), 0)} un/h`} />
          <Res label="Área impressa" value={`${num(area, 0)} m²`} />
          <Res
            label="Consumo de tinta (1 cor)"
            value={`${num(consumoTintaKg({ aniloxCm3M2: f.anilox, areaM2: area, coberturaPct: f.cobertura }), 2)} kg`}
          />
          <Res label="Tempo da tiragem" value={`${num(f.metros / Math.max(1, metrosPorHora(f.velocidadeMMin)), 2)} h`} />
        </>
      }
    />
  );
}

/* ── Laminação ── */
function CalcLaminacao() {
  const [f, setF] = useState({
    esp1: 20,
    dens1: DENSIDADES.BOPP,
    esp2: 60,
    dens2: DENSIDADES.LDPE,
    adesivoGm2: 2.5,
    solidos: 100,
    areaM2: 5000,
  });
  const gram = gramaturaLaminado(
    [
      { espessuraUm: f.esp1, densidade: f.dens1 },
      { espessuraUm: f.esp2, densidade: f.dens2 },
    ],
    f.adesivoGm2,
  );

  const guia: GuiaCalculoProps = {
    titulo: "Gramatura de Laminado",
    formula: "G = Σ (espessura × densidade) + adesivo seco",
    formulaExplicada: (
      <>
        Some a massa de cada camada plástica (µm × g/cm³) e adicione o adesivo seco em g/m². O
        resultado define o peso por área e o rendimento do laminado.
      </>
    ),
    impacto:
      "Gramatura alta melhora barreira e resistência, mas aumenta custo. Gramatura baixa reduz espessura e selabilidade. Adesivo excessivo aumenta tempo de secagem e custo.",
    valores: [
      { material: "BOPP + LDPE", faixa: "75–85 g/m²", observacao: "Snacks" },
      { material: "PET + LDPE", faixa: "90–100 g/m²", observacao: "Barreira e brilho" },
      { material: "Adesivo seco", faixa: "2–4 g/m²", observacao: "Solventless ~2 g/m²" },
    ],
    ilustracao: <SvgLaminado />,
    badges: ["Laminação", "Gramatura"],
  };

  return (
    <Bloco
      titulo="Laminação"
      descricao="Gramatura da estrutura, consumo de adesivo e rendimento."
      guia={guia}
      campos={
        <>
          <Campo label="Camada 1 — espessura (µm)" value={f.esp1} onChange={(v) => setF({ ...f, esp1: v })} />
          <Campo label="Camada 1 — densidade" step="0.001" value={f.dens1} onChange={(v) => setF({ ...f, dens1: v })} />
          <Campo label="Camada 2 — espessura (µm)" value={f.esp2} onChange={(v) => setF({ ...f, esp2: v })} />
          <Campo label="Camada 2 — densidade" step="0.001" value={f.dens2} onChange={(v) => setF({ ...f, dens2: v })} />
          <Campo label="Adesivo seco (g/m²)" step="0.1" value={f.adesivoGm2} onChange={(v) => setF({ ...f, adesivoGm2: v })} />
          <Campo label="Sólidos do adesivo (%)" value={f.solidos} onChange={(v) => setF({ ...f, solidos: v })} />
          <Campo label="Área da tiragem (m²)" value={f.areaM2} onChange={(v) => setF({ ...f, areaM2: v })} />
        </>
      }
      resultados={
        <>
          <Res label="Gramatura do laminado" value={`${num(gram, 2)} g/m²`} />
          <Res label="Rendimento" value={`${num(m2PorKg(gram), 2)} m²/kg`} />
          <Res
            label="Consumo de adesivo"
            value={`${num(consumoAdesivoKg(f.areaM2, f.adesivoGm2, f.solidos), 2)} kg`}
          />
          <Res label="Peso da tiragem" value={`${num((f.areaM2 * gram) / 1000, 1)} kg`} />
        </>
      }
    />
  );
}

/* ── Rebobinamento / corte ── */
function CalcRebobinamento() {
  const [f, setF] = useState({
    diamExtMm: 500,
    tubeteMm: 76,
    espessuraUm: 50,
    camadas: 2,
    metrosAlvo: 1000,
    larguraBobinaMm: 1000,
    larguraTiraMm: 320,
    refileMm: 20,
  });
  const pc = planoCorte(f.larguraBobinaMm, f.larguraTiraMm, f.refileMm);

  const guia: GuiaCalculoProps = {
    titulo: "Metragem por Diâmetro e Plano de Corte",
    formula: "M = π × (D² - d²) ÷ (4 × espessura × camadas)",
    formulaExplicada: (
      <>
        Volume do anel de filme dividido pela área da seção. D = diâmetro externo, d = tubete,
        espessura em mm e camadas = 2 para filme tubular.
      </>
    ),
    impacto:
      "Metragem correta evita trocas de bobina no meio da tiragem. Plano de corte otimizado reduz refile e aumenta aproveitamento da largura.",
    valores: [
      { material: "Bobina tubular 400mm", faixa: "1.500–3.000 m" },
      { material: "Bobina aberta 1.000mm", faixa: "2.000–5.000 m" },
      { material: "Tubete padrão", faixa: "76–152 mm" },
    ],
    ilustracao: <SvgBobinaTubete />,
    badges: ["Rebobinamento", "Aproveitamento"],
  };

  return (
    <Bloco
      titulo="Rebobinamento e plano de corte"
      descricao="Metragem por diâmetro, diâmetro alvo e aproveitamento de refile."
      guia={guia}
      campos={
        <>
          <Campo label="Diâmetro externo (mm)" value={f.diamExtMm} onChange={(v) => setF({ ...f, diamExtMm: v })} />
          <Campo label="Tubete (mm)" value={f.tubeteMm} onChange={(v) => setF({ ...f, tubeteMm: v })} />
          <Campo label="Espessura (µm)" value={f.espessuraUm} onChange={(v) => setF({ ...f, espessuraUm: v })} />
          <Campo label="Camadas (2 = tubular)" value={f.camadas} onChange={(v) => setF({ ...f, camadas: v })} />
          <Campo label="Metragem alvo (m)" value={f.metrosAlvo} onChange={(v) => setF({ ...f, metrosAlvo: v })} />
          <Campo label="Largura da bobina (mm)" value={f.larguraBobinaMm} onChange={(v) => setF({ ...f, larguraBobinaMm: v })} />
          <Campo label="Largura da tira (mm)" value={f.larguraTiraMm} onChange={(v) => setF({ ...f, larguraTiraMm: v })} />
          <Campo label="Refile total (mm)" value={f.refileMm} onChange={(v) => setF({ ...f, refileMm: v })} />
        </>
      }
      resultados={
        <>
          <Res
            label="Metragem na bobina"
            value={`${num(metragemPorDiametro(f.diamExtMm, f.tubeteMm, f.espessuraUm, f.camadas), 0)} m`}
          />
          <Res
            label="Diâmetro p/ metragem alvo"
            value={`${num(diametroPorMetragem(f.metrosAlvo, f.tubeteMm, f.espessuraUm, f.camadas), 0)} mm`}
          />
          <Res label="Tiras por bobina" value={`${pc.tiras}`} />
          <Res label="Sobra de largura" value={`${num(pc.sobraMm, 1)} mm`} />
          <Res
            label="Aproveitamento"
            value={`${num(pc.aproveitamentoPct, 1)} %`}
            tone={pc.aproveitamentoPct >= 92 ? "border-success/40 bg-success/5" : "border-warning/40 bg-warning/5"}
          />
        </>
      }
    />
  );
}

/* ── Corte e solda / sacoleira ── */
function CalcCorteSolda() {
  const [f, setF] = useState({
    golpesMin: 90,
    sacosPorGolpe: 2,
    comprimentoMm: 500,
    pesoUnitarioG: 10,
    kg: 100,
    milheiros: 10,
  });
  const avisos = [
    ...validarConversaoKgMilheiro({ quantidade: f.kg, pesoUnitarioG: f.pesoUnitarioG, base: "kg" }),
    ...validarConversaoKgMilheiro({
      quantidade: f.milheiros,
      pesoUnitarioG: f.pesoUnitarioG,
      base: "milheiro",
    }),
  ];
  const valido = resumoValidacao(avisos).valido;

  useRegistroCalculo("corte_solda", {
    titulo: "Corte e solda — produtividade e conversão Kg ↔ Milheiro",
    parametros: [
      ["Golpes por minuto", num(f.golpesMin)],
      ["Sacos por golpe", num(f.sacosPorGolpe)],
      ["Comprimento do saco (mm)", num(f.comprimentoMm)],
      ["Peso unitário (g)", num(f.pesoUnitarioG, 3)],
      ["Peso informado (kg)", num(f.kg, 2)],
      ["Milheiros informados", num(f.milheiros, 2)],
    ],
    resultados: [
      ["Sacos por hora", `${num(sacosPorHora(f.golpesMin, f.sacosPorGolpe), 0)} un/h`],
      ["Milheiros por hora", `${num(milheirosPorHora(f.golpesMin, f.sacosPorGolpe), 2)} mi/h`],
      ["Consumo de filme", `${num(consumoFilmeMMin(f.golpesMin, f.comprimentoMm), 1)} m/min`],
      ...(valido
        ? ([
            [`${num(f.kg, 2)} kg em milheiros`, `${num(kgParaMilheiro(f.kg, f.pesoUnitarioG), 3)} mi`],
            [
              `${num(f.milheiros, 2)} milheiros em kg`,
              `${num(milheiroParaKg(f.milheiros, f.pesoUnitarioG), 3)} kg`,
            ],
          ] as [string, string][])
        : ([["Conversão Kg ↔ Milheiro", "Não calculada — corrija os erros de entrada"]] as [string, string][])),
    ],
    avisos: avisos.map((a) => `${a.mensagem}${a.recomendacao ? ` ${a.recomendacao}` : ""}`),
  });

  const guia: GuiaCalculoProps = {
    titulo: "Conversão Kg ↔ Milheiro",
    formula: "kg = milheiros × peso unitário (g)    |    milheiros = kg ÷ peso unitário (g)",
    formulaExplicada: (
      <>
        1 milheiro = 1.000 unidades. Multiplique o número de milheiros por 1.000 para obter a
        quantidade de sacos, depois pelo peso unitário em gramas e divida por 1.000.000 para
        converter em kg.
      </>
    ),
    impacto:
      "Conversão precisa é fundamental para precificação, compra de resina e controle de estoque. Erro comum: confundir peso unitário com peso do milheiro, gerando orçamentos errados.",
    valores: [
      { material: "Sacola leve 10g", faixa: "10 kg / mi" },
      { material: "Sacola padrão 25g", faixa: "25 kg / mi" },
      { material: "Sacola reforçada 60g", faixa: "60 kg / mi" },
    ],
    ilustracao: <SvgMilheiro />,
    badges: ["Corte/Solda", "Precificação"],
  };

  return (
    <Bloco
      titulo="Corte e solda — produtividade e conversão Kg ↔ Milheiro"
      descricao="Produção teórica da seladora e conversão de peso para milheiros."
      guia={guia}
      campos={
        <>
          <Campo label="Golpes por minuto" value={f.golpesMin} onChange={(v) => setF({ ...f, golpesMin: v })} />
          <Campo label="Sacos por golpe" value={f.sacosPorGolpe} onChange={(v) => setF({ ...f, sacosPorGolpe: v })} />
          <Campo label="Comprimento do saco (mm)" value={f.comprimentoMm} onChange={(v) => setF({ ...f, comprimentoMm: v })} />
          <Campo label="Peso unitário (g)" step="0.01" value={f.pesoUnitarioG} onChange={(v) => setF({ ...f, pesoUnitarioG: v })} />
          <Campo label="Peso (kg)" value={f.kg} onChange={(v) => setF({ ...f, kg: v })} />
          <Campo label="Milheiros" value={f.milheiros} onChange={(v) => setF({ ...f, milheiros: v })} />
        </>
      }
      resultados={
        <>
          <AvisosValidacao avisos={avisos} />
          <Res label="Sacos por hora" value={`${num(sacosPorHora(f.golpesMin, f.sacosPorGolpe), 0)} un/h`} />
          <Res label="Milheiros por hora" value={`${num(milheirosPorHora(f.golpesMin, f.sacosPorGolpe), 2)} mi/h`} />
          <Res label="Consumo de filme" value={`${num(consumoFilmeMMin(f.golpesMin, f.comprimentoMm), 1)} m/min`} />
          {valido ? (
            <>
              <Res
                label={`${num(f.kg, 2)} kg em milheiros`}
                value={`${num(kgParaMilheiro(f.kg, f.pesoUnitarioG), 3)} mi`}
                tone="border-primary/40 bg-primary/5"
              />
              <Res
                label={`${num(f.milheiros, 2)} milheiros em kg`}
                value={`${num(milheiroParaKg(f.milheiros, f.pesoUnitarioG), 3)} kg`}
                tone="border-primary/40 bg-primary/5"
              />
              <Res label="Peso do milheiro" value={`${num(f.pesoUnitarioG, 3)} kg/mi`} />
            </>
          ) : null}
        </>
      }
    />
  );
}

/** Calculadora técnica contextual da etapa produtiva. */
export function CalculadoraProcesso({ etapa }: { etapa: EtapaCalculo | string }) {
  const blocos: React.ReactNode[] = [];
  if (etapa === "extrusao") blocos.push(<CalcExtrusao key="ext" />);
  if (etapa === "impressao") blocos.push(<CalcImpressao key="imp" />);
  if (etapa === "laminacao") blocos.push(<CalcLaminacao key="lam" />);
  if (etapa === "rebobinamento") blocos.push(<CalcRebobinamento key="reb" />);
  if (etapa === "corte_solda" || etapa === "sacoleira")
    blocos.push(<CalcCorteSolda key="cs" />);
  if (blocos.length === 0) blocos.push(<CalcCorteSolda key="cs" />);

  return (
    <CalcExportProvider estacao={String(etapa)}>
      <Tabs defaultValue="calculadoras" className="w-full">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calculator className="h-3 w-3" /> Cálculos do processo
            </Badge>
            <span className="text-xs text-muted-foreground">
              Valores de referência técnica — confira sempre a ficha do produto.
            </span>
          </div>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="calculadoras" className="gap-1 text-xs">
              <Calculator className="h-3.5 w-3.5" /> Calculadoras
            </TabsTrigger>
            <TabsTrigger value="guia" className="gap-1 text-xs">
              <GraduationCap className="h-3.5 w-3.5" /> Guia Didático
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="calculadoras" className="mt-0 space-y-4">
          {blocos}
        </TabsContent>

        <TabsContent value="guia" className="mt-0">
          <GuiaDidaticoCompleto />
        </TabsContent>
      </Tabs>
    </CalcExportProvider>
  );
}
