import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// 1. Confirm environment variables
dotenv.config();
const URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !ANON_KEY || !SERVICE_KEY) {
    console.error("❌ Code misconfiguration: Missing environment variables.");
    process.exit(1);
}
console.log("✅ 1. Environment variables configured.");

console.log("Initializing client...");
try {
    const supabase = createClient(URL, SERVICE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
    console.log("✅ 2. Supabase client initialized.");

    // Test the client
    supabase.from('profiles').select('*').limit(1).then(({ data, error }) => {
        if (error) console.error("Select error:", error);
        else console.log("Select success! Data:", data);
        process.exit(0);
    }).catch(e => {
        console.error("Catch error:", e);
        process.exit(1);
    });
} catch (e) {
    console.error("Create Client Error:", e);
    process.exit(1);
}

