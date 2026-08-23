export const ROLES = {
  ADMIN_GLOBAL: 'ADMIN_GLOBAL',
  FEDERACAO: 'FEDERACAO',
  ASSOCIACAO: 'ASSOCIACAO',
  ASSOCIADO: 'ASSOCIADO'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
