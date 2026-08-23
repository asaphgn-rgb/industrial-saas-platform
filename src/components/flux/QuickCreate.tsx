import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  FileText,
  ShoppingCart,
  ClipboardList,
  Factory,
  AlertOctagon,
  Users,
  Package,
  CheckSquare,
} from "lucide-react";

const ACTIONS = [
  { label: "Orçamento", to: "/comercial/orcamentos", icon: FileText, group: "Comercial" },
  {
    label: "Pedido de venda",
    to: "/comercial/pedidos-venda",
    icon: ShoppingCart,
    group: "Comercial",
  },
  { label: "Lead / CRM", to: "/comercial/crm", icon: Users, group: "Comercial" },
  {
    label: "Solicitação de compra",
    to: "/suprimentos/solicitacoes-compra",
    icon: ClipboardList,
    group: "Suprimentos",
  },
  { label: "Cotação", to: "/suprimentos/cotacoes", icon: FileText, group: "Suprimentos" },
  {
    label: "Pedido de compra",
    to: "/suprimentos/pedidos-compra",
    icon: ShoppingCart,
    group: "Suprimentos",
  },
  { label: "Ordem de produção", to: "/producao/ordens-producao", icon: Factory, group: "Produção" },
  {
    label: "Não conformidade",
    to: "/qualidade/nao-conformidades",
    icon: AlertOctagon,
    group: "Qualidade",
  },
  { label: "Inspeção", to: "/qualidade/inspecoes", icon: CheckSquare, group: "Qualidade" },
  { label: "Cliente", to: "/cadastros/clientes", icon: Users, group: "Cadastros" },
  { label: "Fornecedor", to: "/cadastros/fornecedores", icon: Users, group: "Cadastros" },
  { label: "Produto", to: "/cadastros/produtos", icon: Package, group: "Cadastros" },
  { label: "Minha tarefa", to: "/tarefas", icon: CheckSquare, group: "Pessoal" },
];

const GROUPS = ["Comercial", "Suprimentos", "Produção", "Qualidade", "Cadastros", "Pessoal"];

export function QuickCreate() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="sm" className="gap-1" title="Criar novo (Alt+N)">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {GROUPS.map((g, gi) => (
          <div key={g}>
            {gi > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {g}
            </DropdownMenuLabel>
            {ACTIONS.filter((a) => a.group === g).map((a) => {
              const Icon = a.icon;
              return (
                <DropdownMenuItem key={a.to + a.label} asChild>
                  <Link to={a.to as any}>
                    <Icon className="mr-2 h-4 w-4" />
                    {a.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
