
import { initializeTables } from '../services/accessCodeService';
import { supabase } from './supabase';

// Cette fonction initialise la base de données Supabase au démarrage de l'application
export const initializeSupabase = async () => {
  try {
    console.log("Initialisation de Supabase...");
    
    // Vérifie d'abord que la connexion à Supabase fonctionne
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn("Erreur de connexion à Supabase. Utilisation du mode hors ligne:", error);
      return false;
    }
    
    // Initialise les tables si nécessaire
    const initialized = await initializeTables();
    
    if (initialized) {
      console.log("Initialisation de Supabase réussie");
    } else {
      console.warn("Initialisation de Supabase partiellement réussie");
    }
    
    return initialized;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Supabase:", error);
    return false;
  }
};
