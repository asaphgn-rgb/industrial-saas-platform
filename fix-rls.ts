import { createClient } from '@supabase/supabase-js';

// Esse script desabilita o RLS no frontend fazendo com que a API se conecte
// via service_role ou ignorando a RLS temporariamente no código local
