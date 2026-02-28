import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

try {
    localStorage.setItem('__quota_test__', '1');
    localStorage.removeItem('__quota_test__');
} catch (e) {
    console.warn("Storage quota exceeded! Clearing localhost cache to restore Supabase operations.");
    localStorage.clear();
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials in frontend .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
