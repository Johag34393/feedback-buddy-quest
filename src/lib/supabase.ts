
import { createClient } from '@supabase/supabase-js';

// Utilisation des variables d'environnement de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifie si les variables d'environnement sont disponibles
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Création du client Supabase avec gestion des variables manquantes
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Journalisation de l'état de la configuration Supabase
if (!isSupabaseConfigured) {
  console.error('Configuration Supabase incomplète. Veuillez vérifier vos variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.');
} else {
  console.log('Configuration Supabase détectée.');
}

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
