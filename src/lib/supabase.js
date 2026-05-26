import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Initialize the Supabase client
// Relies on validated environment variables
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
