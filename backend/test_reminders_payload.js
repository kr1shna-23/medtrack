const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!URL || !KEY) {
    throw new Error('Missing SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY/SUPABASE_ANON_KEY');
}

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
