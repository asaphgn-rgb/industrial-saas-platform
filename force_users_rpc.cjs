const { createClient } = require('@supabase/supabase-js');
// Check if maybe we can call a custom function that exists in the database
const supabase = createClient("https://ujttkjvxxljonqepglae.supabase.co", "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA");

async function checkRPCs() {
    // If the developer added any public RPC to confirm emails, we could call it.
    // Let's try to query public functions if we can. 
}
checkRPCs();
