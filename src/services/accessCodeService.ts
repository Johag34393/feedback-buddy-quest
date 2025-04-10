
import { supabase, AccessCode, UserDetails } from '@/lib/supabase';
import { initializeSupabase } from '@/lib/initSupabase';

// Vérifier si Supabase est configuré
const isSupabaseConfigured = !!supabase;

// Codes d'accès par défaut pour un fonctionnement local
const defaultCodes = {
  "ADMIN2024": { role: "admin", name: "Administrateur" },
  "VISIT001": { role: "visitor", name: "Visiteur 1" },
  "VISIT002": { role: "visitor", name: "Visiteur 2" }
};

const defaultOTPCodes = {
  "1234": { role: "visitor", name: "Visiteur OTP 1" }
};

// Initialiser Supabase au démarrage de l'application
if (isSupabaseConfigured) {
  console.log('Initialisation de Supabase...');
  initializeSupabase().catch(error => {
    console.error('Erreur lors de l\'initialisation de Supabase:', error);
  });
} else {
  console.warn('Supabase non configuré. Utilisation des codes par défaut.');
}

// Récupérer tous les codes d'accès permanents
export const getAllAccessCodes = async (): Promise<Record<string, UserDetails>> => {
  // Si Supabase n'est pas configuré, utiliser les codes par défaut
  if (!isSupabaseConfigured) {
    console.warn('Supabase non configuré. Utilisation des codes d\'accès par défaut.');
    return defaultCodes;
  }
  
  try {
    const { data, error } = await supabase
      .from('access_codes')
      .select('*')
      .eq('type', 'permanent');
      
    if (error) {
      console.error('Erreur lors de la récupération des codes d\'accès:', error);
      return defaultCodes;
    }
    
    // Convertir le tableau en objet au format attendu par l'application
    const codesObject: Record<string, UserDetails> = {};
    data?.forEach((code: AccessCode) => {
      codesObject[code.code] = {
        role: code.role,
        name: code.name
      };
    });
    
    return codesObject;
  } catch (error) {
    console.error('Exception lors de la récupération des codes d\'accès:', error);
    return defaultCodes;
  }
};

// Récupérer tous les codes OTP
export const getAllOTPCodes = async (): Promise<Record<string, UserDetails>> => {
  // Si Supabase n'est pas configuré, utiliser les codes OTP par défaut
  if (!isSupabaseConfigured) {
    console.warn('Supabase non configuré. Utilisation des codes OTP par défaut.');
    return defaultOTPCodes;
  }
  
  try {
    const { data, error } = await supabase
      .from('access_codes')
      .select('*')
      .eq('type', 'otp');
      
    if (error) {
      console.error('Erreur lors de la récupération des codes OTP:', error);
      return defaultOTPCodes;
    }
    
    // Convertir le tableau en objet au format attendu par l'application
    const codesObject: Record<string, UserDetails> = {};
    data?.forEach((code: AccessCode) => {
      codesObject[code.code] = {
        role: code.role,
        name: code.name
      };
    });
    
    return codesObject;
  } catch (error) {
    console.error('Exception lors de la récupération des codes OTP:', error);
    return defaultOTPCodes;
  }
};

// Ajouter un nouveau code d'accès
export const addAccessCode = async (code: string, details: UserDetails, type: 'permanent' | 'otp'): Promise<void> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase non configuré. Impossible d\'ajouter un code d\'accès.');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('access_codes')
      .insert([{ 
        code, 
        role: details.role, 
        name: details.name,
        type
      }]);
      
    if (error) {
      console.error('Erreur lors de l\'ajout du code d\'accès:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception lors de l\'ajout du code d\'accès:', error);
    throw error;
  }
};

// Supprimer un code d'accès
export const deleteAccessCode = async (code: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase non configuré. Impossible de supprimer un code d\'accès.');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('access_codes')
      .delete()
      .eq('code', code);
      
    if (error) {
      console.error('Erreur lors de la suppression du code d\'accès:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception lors de la suppression du code d\'accès:', error);
    throw error;
  }
};

// Initialiser les codes d'accès par défaut s'ils n'existent pas
export const initializeDefaultCodes = async (): Promise<void> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase non configuré. Impossible d\'initialiser les codes d\'accès par défaut.');
    return;
  }
  
  try {
    // Essayer d'accéder à la table pour vérifier qu'elle existe
    const { data, error } = await supabase
      .from('access_codes')
      .select('code')
      .limit(1);
    
    // Si une erreur se produit, c'est probablement que la table n'existe pas
    if (error) {
      console.warn('Erreur lors de l\'accès à la table access_codes. Tentative d\'initialisation...', error);
      await initializeSupabase();
      return;
    }
    
    // Si aucun code n'existe, ajouter les codes par défaut
    if (!data || data.length === 0) {
      const defaultCodes = [
        { code: 'ADMIN2024', role: 'admin', name: 'Administrateur', type: 'permanent' as const },
        { code: 'VISIT001', role: 'visitor', name: 'Visiteur 1', type: 'permanent' as const },
        { code: 'VISIT002', role: 'visitor', name: 'Visiteur 2', type: 'permanent' as const },
        { code: '1234', role: 'visitor', name: 'Visiteur OTP 1', type: 'otp' as const }
      ];
      
      await supabase.from('access_codes').insert(defaultCodes);
      console.log('Codes d\'accès par défaut ajoutés à la base de données.');
    }
  } catch (error) {
    console.error('Exception lors de l\'initialisation des codes d\'accès par défaut:', error);
  }
};

// Vérifier un code d'accès
export const verifyAccessCode = async (code: string): Promise<UserDetails | null> => {
  // Si Supabase n'est pas configuré, vérifier les codes par défaut
  if (!isSupabaseConfigured) {
    console.warn('Supabase non configuré. Vérification des codes d\'accès locaux.');
    
    if (defaultCodes[code]) {
      return defaultCodes[code];
    }
    
    if (defaultOTPCodes[code]) {
      return defaultOTPCodes[code];
    }
    
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('access_codes')
      .select('*')
      .eq('code', code)
      .single();
      
    if (error || !data) {
      console.error('Erreur lors de la vérification du code d\'accès:', error);
      return null;
    }
    
    return {
      role: data.role,
      name: data.name
    };
  } catch (error) {
    console.error('Exception lors de la vérification du code d\'accès:', error);
    return null;
  }
};
