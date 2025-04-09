
import { createClient } from '@supabase/supabase-js';

// Utilisation des variables d'environnement de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les codes d'accès
export interface UserDetails {
  role: string;
  name: string;
}

export interface AccessCode {
  code: string;
  role: string;
  name: string;
  type: 'permanent' | 'otp';
}
