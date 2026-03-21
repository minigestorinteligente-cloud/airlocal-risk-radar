import { createClient } from '@supabase/supabase-js';

// Usamos as string de forma explícita y damos un fallback para que no explote el instanciamiento 
// inicial si Next.js carga el lado del cliente sin variables temporales en caché.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cliente global y directo ("Solo agua")
export const supabase = createClient(supabaseUrl, supabaseKey);
