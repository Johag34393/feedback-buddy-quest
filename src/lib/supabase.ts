
import { createClient } from '@supabase/supabase-js';

// Using hardcoded Supabase credentials
const supabaseUrl = "https://kwrmkqihdxkpkiewxhec.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cm1rcWloZHhrcGtpZXd4aGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTA2NzcsImV4cCI6MjA1OTc4NjY3N30.wEdqNMzAro9L-ZYQyAwIYnPGdP682wndJjJwP10n68o";

// Vérification des variables (par précaution)
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Création du client Supabase
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
