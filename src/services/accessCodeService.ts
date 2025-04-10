
import { supabase } from '../lib/supabase';

export interface UserDetails {
  role: string;
  name: string;
}

export interface AccessCode {
  code: string;
  role: string;
  name: string;
  is_otp?: boolean;
}

// Initialiser les tables si elles n'existent pas
export const initializeTables = async () => {
  try {
    // Vérifier si la table access_codes existe
    const { error: checkError } = await supabase
      .from('access_codes')
      .select('code')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      console.log('La table access_codes n\'existe pas. Création...');
      
      // Créer la table access_codes
      const { error: createError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE public.access_codes (
            code TEXT PRIMARY KEY,
            role TEXT NOT NULL,
            name TEXT NOT NULL,
            is_otp BOOLEAN DEFAULT false
          );
        `
      });

      if (createError) {
        console.error('Erreur lors de la création de la table:', createError);
        return false;
      }

      // Insérer les codes par défaut
      const defaultCodes = [
        { code: 'ADMIN2024', role: 'admin', name: 'Administrateur', is_otp: false },
        { code: 'VISIT001', role: 'visitor', name: 'Visiteur 1', is_otp: false },
        { code: 'VISIT002', role: 'visitor', name: 'Visiteur 2', is_otp: false },
        { code: '1234', role: 'visitor', name: 'Visiteur OTP 1', is_otp: true }
      ];

      const { error: insertError } = await supabase
        .from('access_codes')
        .insert(defaultCodes);

      if (insertError) {
        console.error('Erreur lors de l\'insertion des codes par défaut:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    return false;
  }
};

// Obtenir tous les codes d'accès
export const getAccessCodes = async () => {
  try {
    const { data, error } = await supabase
      .from('access_codes')
      .select('*')
      .eq('is_otp', false);
      
    if (error) throw error;
    
    // Convertir en format compatible avec le code existant
    const formattedData = data.reduce((acc, item) => {
      acc[item.code] = { role: item.role, name: item.name };
      return acc;
    }, {} as Record<string, UserDetails>);
    
    return formattedData;
  } catch (error) {
    console.error('Erreur lors de la récupération des codes d\'accès:', error);
    return {};
  }
};

// Obtenir tous les codes OTP
export const getOTPCodes = async () => {
  try {
    const { data, error } = await supabase
      .from('access_codes')
      .select('*')
      .eq('is_otp', true);
      
    if (error) throw error;
    
    // Convertir en format compatible avec le code existant
    const formattedData = data.reduce((acc, item) => {
      acc[item.code] = { role: item.role, name: item.name };
      return acc;
    }, {} as Record<string, UserDetails>);
    
    return formattedData;
  } catch (error) {
    console.error('Erreur lors de la récupération des codes OTP:', error);
    return {};
  }
};

// Ajouter un nouveau code d'accès
export const addAccessCode = async (code: string, role: string, name: string, isOTP: boolean = false) => {
  try {
    const { error } = await supabase
      .from('access_codes')
      .insert([{ code, role, name, is_otp: isOTP }]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du code d\'accès:', error);
    return false;
  }
};

// Supprimer un code d'accès
export const deleteAccessCode = async (code: string) => {
  try {
    const { error } = await supabase
      .from('access_codes')
      .delete()
      .eq('code', code);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du code d\'accès:', error);
    return false;
  }
};

// Vérifier un code d'accès
export const verifyAccessCode = async (code: string, isOTP: boolean = false) => {
  try {
    const { data, error } = await supabase
      .from('access_codes')
      .select('*')
      .eq('code', code)
      .eq('is_otp', isOTP)
      .single();
      
    if (error) {
      console.info('Code invalide:', code);
      return null;
    }
    
    return { role: data.role, name: data.name };
  } catch (error) {
    console.error('Erreur lors de la vérification du code d\'accès:', error);
    return null;
  }
};
