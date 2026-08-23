import { supabase } from '@/lib/supabase';
import { User, AuthSession } from '@/types/auth';

export const authService = {
  /**
   * Obtém a sessão atual e carrega o Profile atrelado para injetar a Role no front.
   */
  async getSession(): Promise<AuthSession> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return { user: null, session: null, isLoading: false };
    }

    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      return { user: null, session, isLoading: false };
    }

    const user: User = {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      federacao_id: profile.federacao_id,
      associacao_id: profile.associacao_id,
      status: profile.status,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    };

    return { user, session, isLoading: false };
  },

  /**
   * Realiza logout completo do sistema.
   */
  async signOut() {
    await supabase.auth.signOut();
  }
};
