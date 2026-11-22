import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si vous configurez vos propres identifiants Supabase dans .env, le chat s'y connecte en temps réel.
// Sans identifiants distants, le chat utilise un stockage local autonome dédié à votre portfolio.
export const supabase = url && key ? createClient(url, key) : null;

export interface ChatMessage {
  id: number;
  created_at: string;
  name: string | null;
  country: string | null;
  content: string;
  gif_url: string | null;
}
