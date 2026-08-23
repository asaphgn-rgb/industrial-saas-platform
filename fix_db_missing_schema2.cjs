const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = "https://ujttkjvxxljonqepglae.supabase.co";
const SUPABASE_KEY = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const { data, error } = await supabase.from('unidades_medida').insert([
    {
      tenant_id: "00000000-0000-0000-0000-000000000000",
      sigla: "KG", 
      nome: "Quilograma", 
      casas_decimais: 3
    }
  ]).select();
  
  if (error) {
    console.error("ERRO AO CONFIRMAR UNIDADE:", error);
  } else {
    console.log("SUCESSO:", data);
  }
}

run();
