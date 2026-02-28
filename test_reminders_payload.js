import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, 'frontend/.env') })

const URL = process.env.VITE_SUPABASE_URL || 'https://jirlobiyhgycnkafuhcg.supabase.co';
const KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcmxvYml5aGd5Y25rYWZ1aGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTU4ODgsImV4cCI6MjA4Nzg3MTg4OH0.CkwpqDEIag9BG8E7L1EZ5dgtsjBcR4MUoOseUuwGdlo';

const supabase = createClient(URL, KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    console.log("Fetching medications...");
    const { data: meds, error: err1 } = await supabase.from('medications').select('*');
    if (err1) throw err1;
    console.log("Medications:", meds);

    console.log("Fetching reminders...");
    const { data: rems, error: err2 } = await supabase.from('reminders').select('*');
    if (err2) throw err2;
    console.log("Reminders:", rems);
}

main().catch(console.error);
