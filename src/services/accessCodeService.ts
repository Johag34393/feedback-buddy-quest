
import { supabase, AccessCode, UserDetails } from '@/lib/supabase';

// Récupérer tous les codes d'accès permanents
export const getAllAccessCodes = async (): Promise<Record<string, UserDetails>> => {
  const { data, error } = await supabase
    .from('access_codes')
    .select('*')
    .eq('type', 'permanent');
    
  if (error) {
    console.error('Erreur lors de la récupération des codes d\'accès:', error);
    return {};
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
};

// Récupérer tous les codes OTP
export const getAllOTPCodes = async (): Promise<Record<string, UserDetails>> => {
  const { data, error } = await supabase
    .from('access_codes')
    .select('*')
    .eq('type', 'otp');
    
  if (error) {
    console.error('Erreur lors de la récupération des codes OTP:', error);
    return {};
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
};

// Ajouter un nouveau code d'accès
export const addAccessCode = async (code: string, details: UserDetails, type: 'permanent' | 'otp'): Promise<void> => {
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
};

// Supprimer un code d'accès
export const deleteAccessCode = async (code: string): Promise<void> => {
  const { error } = await supabase
    .from('access_codes')
    .delete()
    .eq('code', code);
    
  if (error) {
    console.error('Erreur lors de la suppression du code d\'accès:', error);
    throw error;
  }
};

// Initialiser les codes d'accès par défaut s'ils n'existent pas
export const initializeDefaultCodes = async (): Promise<void> => {
  const { data } = await supabase
    .from('access_codes')
    .select('code');
    
  // Si aucun code n'existe, ajouter les codes par défaut
  if (!data || data.length === 0) {
    const defaultCodes = [
      { code: 'ADMIN2024', role: 'admin', name: 'Administrateur', type: 'permanent' as const },
      { code: 'VISIT001', role: 'visitor', name: 'Visiteur 1', type: 'permanent' as const },
      { code: 'VISIT002', role: 'visitor', name: 'Visiteur 2', type: 'permanent' as const },
      { code: '1234', role: 'visitor', name: 'Visiteur OTP 1', type: 'otp' as const }
    ];
    
    await supabase.from('access_codes').insert(defaultCodes);
  }
};

// Vérifier un code d'accès
export const verifyAccessCode = async (code: string): Promise<UserDetails | null> => {
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
};
