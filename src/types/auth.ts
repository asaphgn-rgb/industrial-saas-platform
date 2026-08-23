import { Role } from '../config/roles';

export interface User {
  id: string;
  email: string;
  role: Role;
  federacao_id?: string;
  associacao_id?: string;
  associado_id?: string;
  status: 'ACTIVE' | 'BLOCKED' | 'PARTIAL_BLOCK';
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User | null;
  session: any | null; // Tipagem do Supabase será adicionada futuramente
  isLoading: boolean;
}
