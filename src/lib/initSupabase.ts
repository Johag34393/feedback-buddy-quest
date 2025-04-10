
import { supabase } from './supabase';

// Fonction pour créer la table access_codes si elle n'existe pas
export const createAccessCodesTable = async (): Promise<boolean> => {
  if (!supabase) {
    console.error('Client Supabase non disponible. Impossible de créer la table.');
    return false;
  }

  try {
    // Vérifier si la table existe déjà
    const { error: checkError } = await supabase
      .from('access_codes')
      .select('code')
      .limit(1);

    // Si aucune erreur, la table existe déjà
    if (!checkError) {
      console.log('La table access_codes existe déjà.');
      return true;
    }

    // Créer la table access_codes avec les colonnes nécessaires
    const { error } = await supabase.rpc('create_access_codes_table');

    if (error) {
      // Si la RPC n'existe pas, essayons de créer la table via SQL
      const { error: sqlError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.access_codes (
            id SERIAL PRIMARY KEY,
            code TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `
      });

      if (sqlError) {
        console.error('Impossible de créer la table access_codes:', sqlError);
        return false;
      }
    }

    console.log('Table access_codes créée avec succès.');
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la table access_codes:', error);
    return false;
  }
};

// Fonction pour migrer les codes d'accès par défaut
export const migrateDefaultAccessCodes = async () => {
  if (!supabase) {
    console.error('Client Supabase non disponible. Impossible de migrer les codes.');
    return;
  }

  try {
    // Vérifier si des codes existent déjà
    const { data, error } = await supabase
      .from('access_codes')
      .select('code')
      .limit(1);

    // Si des codes existent déjà, ne pas migrer
    if (!error && data && data.length > 0) {
      console.log('Des codes d\'accès existent déjà dans la base de données.');
      return;
    }

    // Définir les codes d'accès par défaut à migrer
    const defaultCodes = [
      { code: 'ADMIN2024', role: 'admin', name: 'Administrateur', type: 'permanent' },
      { code: 'VISIT001', role: 'visitor', name: 'Visiteur 1', type: 'permanent' },
      { code: 'VISIT002', role: 'visitor', name: 'Visiteur 2', type: 'permanent' },
      { code: '1234', role: 'visitor', name: 'Visiteur OTP 1', type: 'otp' }
    ];

    // Insérer les codes par défaut
    const { error: insertError } = await supabase
      .from('access_codes')
      .insert(defaultCodes);

    if (insertError) {
      console.error('Erreur lors de l\'insertion des codes d\'accès par défaut:', insertError);
    } else {
      console.log('Codes d\'accès par défaut migrés avec succès.');
    }
  } catch (error) {
    console.error('Erreur lors de la migration des codes d\'accès:', error);
  }
};

// Fonction pour initialiser la base de données Supabase
export const initializeSupabase = async () => {
  console.log('Initialisation de Supabase...');
  
  // Créer la table si elle n'existe pas
  const tableCreated = await createAccessCodesTable();
  
  // Si la table a été créée avec succès, migrer les codes par défaut
  if (tableCreated) {
    await migrateDefaultAccessCodes();
  }
};
