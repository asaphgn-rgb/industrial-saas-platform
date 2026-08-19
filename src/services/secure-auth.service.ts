import { supabase } from '../lib/supabase';

export const SecureAuthService = {
  /**
   * Logs in the user and tracks brute-force attempts via Edge Function
   */
  async login(email: string, password: string): Promise<{ success: boolean; requiresWipe?: boolean; error?: string }> {
    try {
      // 1. Attempt login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // 2. Report outcome to Edge Function to manage brute force tracking
      const isSuccess = !error && data.user !== null;
      
      const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('verify-login', {
        body: { email, success: isSuccess }
      });

      if (edgeError || (edgeResponse && edgeResponse.error === 'ACCOUNT_LOCKED')) {
        // Trigger wipe sequence if locked
        this.performLocalWipe();
        return { success: false, requiresWipe: true, error: 'Maximum attempts reached. Account locked and local data wiped.' };
      }

      if (!isSuccess) {
        return { success: false, error: 'Invalid credentials' };
      }

      return { success: true };

    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Performs an immediate wipe of local storage, session storage, and forces a reload
   */
  performLocalWipe() {
    console.warn("SECURITY BREACH DETECTED: Wiping local data...");
    localStorage.clear();
    sessionStorage.clear();
    // In a real PWA, you might also clear IndexedDB caches here
    window.location.replace('/login?locked=true');
  }
};
