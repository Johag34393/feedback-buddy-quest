
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kwrmkqihdxkpkiewxhec.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cm1rcWloZHhrcGtpZXd4aGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NTY5NzAsImV4cCI6MjAyODMzMjk3MH0.lSaAUC-6uRNLl_TNHSFtjwpgO2fR9tP3lJiURUlrCHw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
