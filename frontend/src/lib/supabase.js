import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

try {
    localStorage.setItem('__quota_test__', '1');
    localStorage.removeItem('__quota_test__');
} catch (e) {
    console.warn("Storage quota exceeded! Clearing localhost cache to restore Supabase operations.");
    localStorage.clear();
}

if (!supabaseUrl || !supabasePublishableKey) {
    console.error("Missing Supabase credentials in frontend .env");
}

export const clearSupabaseAuthStorage = () => {
    if (typeof localStorage === 'undefined') return;

    Object.keys(localStorage)
        .filter((key) => key.startsWith('sb-') && key.endsWith('-auth-token'))
        .forEach((key) => localStorage.removeItem(key));

    localStorage.removeItem('supabase.auth.token');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
