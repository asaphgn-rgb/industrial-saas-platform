const fs = require('fs');

async function run() {
  const { createClient } = require('@supabase/supabase-js');
  const SUPABASE_URL = "https://ujttkjvxxljonqepglae.supabase.co";
  const SUPABASE_KEY = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA";
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data, error } = await supabase.from('unidades_medida').select('*').limit(1);
  if (error) {
    console.log("ERRO AO CONSULTAR BANCO:", error.message);
  } else {
    console.log("CONSULTA SUCESSO. A TABELA EXISTE.");
  }
}

run();
