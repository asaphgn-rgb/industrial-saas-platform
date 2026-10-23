import { Role } from '../config/roles';

export type SystemScope = 'MORAR_BEM_BRASIL' | 'DYAMOND_CARD';

export interface User {
  id: string;
  email: string;
  role: Role;
  scope?: SystemScope; // Segregação formal de portal e autenticação
  federacao_id?: string;
  associacao_id?: string;
  associado_id?: string;
  empresa_id?: string;
  status: 'ACTIVE' | 'BLOCKED' | 'PARTIAL_BLOCK';
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User | null;
  session: any | null;
  isLoading: boolean;
}
