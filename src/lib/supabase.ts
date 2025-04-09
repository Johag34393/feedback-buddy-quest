
import { createClient } from '@supabase/supabase-js';

// Utilisation des variables d'environnement de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes');
  // Nous utilisons des valeurs par défaut pour le développement
  // Cela permettra d'éviter les erreurs de build, mais la connexion à Supabase ne fonctionnera pas
}

// Création du client Supabase avec des valeurs par défaut si nécessaire
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

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
