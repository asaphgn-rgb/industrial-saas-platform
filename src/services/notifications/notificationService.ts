import { supabase } from '@/lib/supabase';

export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CreateNotificationParams {
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  target_user_id?: string;
  target_role?: 'ADMIN_GLOBAL' | 'FEDERACAO' | 'ASSOCIACAO' | 'ASSOCIADO';
  target_federacao_id?: string;
  target_associacao_id?: string;
}

export const notificationService = {
  /**
   * Dispara uma notificação global ou direcionada
   * Esta função chama a Edge Function que consolida e persiste a notificação
   * para evitar manipulações indevidas no front-end.
   */
  async dispatch(params: CreateNotificationParams) {
    // 1. Log interno no front (pode ser integrado a toast/Zustand local)
    console.log('[NOTIFICAÇÃO DISPARADA]:', params.title);

    // 2. Chamada para Edge Function
    const { data, error } = await supabase.functions.invoke('registrar_evento_global', {
      body: params,
    });

    if (error) {
      console.error('Falha ao registrar notificação global', error);
      throw error;
    }

    return data;
  }
};
