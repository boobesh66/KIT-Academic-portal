import { createClient } from '@supabase/supabase-js';

// Safe resolution of environment variables for Vite client environment
const env = (import.meta as any).env || {};

const supabaseUrl =
  env.VITE_SUPABASE_URL ||
  env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://loidhhxjtcohomloumcv.supabase.co';

const supabaseAnonKey =
  env.VITE_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_s1-_OjE9dXGiZBuNkb6A1g_iqi14nkW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

