import { Role } from './roles';

export interface RouteConfig {
  path: string;
  title: string;
  icon?: string;
  rolesAllowed: Role[];
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    rolesAllowed: ['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO', 'ASSOCIADO']
  },
  {
    path: '/crm',
    title: 'CRM e Comercial',
    rolesAllowed: ['ADMIN_GLOBAL', 'FEDERACAO', 'ASSOCIACAO']
  },
  {
    path: '/admin-global',
    title: 'Administração Global',
    rolesAllowed: ['ADMIN_GLOBAL'],
    children: [
      { path: '/admin-global/federacoes', title: 'Gestão de Federações', rolesAllowed: ['ADMIN_GLOBAL'] },
      { path: '/admin-global/produtos', title: 'Gestão Global de Produtos', rolesAllowed: ['ADMIN_GLOBAL'] },
      { path: '/admin-global/monitoramento', title: 'Monitoramento Global', rolesAllowed: ['ADMIN_GLOBAL'] },
      { path: '/admin-global/auditoria', title: 'Auditoria e Logs', rolesAllowed: ['ADMIN_GLOBAL'] }
    ]
  },
  {
    path: '/associado',
    title: 'Área do Associado',
    rolesAllowed: ['ASSOCIADO'],
    children: [
      { path: '/associado/cadastro', title: 'Completar Cadastro', rolesAllowed: ['ASSOCIADO'] },
      { path: '/associado/pasta-digital', title: 'Minha Pasta Digital', rolesAllowed: ['ASSOCIADO'] },
      { path: '/associado/produtos', title: 'Produtos Disponíveis', rolesAllowed: ['ASSOCIADO'] }
    ]
  }
];
