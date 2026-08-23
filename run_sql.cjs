const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const SUPABASE_URL = "https://ujttkjvxxljonqepglae.supabase.co";
const SUPABASE_KEY = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  // Try via an exec rpc if it exists, otherwise we just print it to be run
  const sql = fs.readFileSync('generate_all_tables.sql', 'utf8');
  console.log("SQL PRONTO PARA RODAR NO PAINEL DO SUPABASE:\n\n" + sql);
}

run();
