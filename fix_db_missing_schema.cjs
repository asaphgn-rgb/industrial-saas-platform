const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = "https://ujttkjvxxljonqepglae.supabase.co";
const SUPABASE_KEY = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const { data, error } = await supabase.from('importacao_linhas').insert([
    {
      importacao_id: "9eaf4957-9d20-4be4-b8e7-e5ae4192447c",
      tenant_id: "00000000-0000-0000-0000-000000000000",
      numero_linha: 2,
      dados_originais: { sigla: "KG", nome: "Quilograma", casas_decimais: 3 },
      status: "valida"
    }
  ]).select();
  
  if (error) {
    console.error("ERRO AO INSERIR LINHA DE IMPORTAÇÃO:", error);
  } else {
    console.log("SUCESSO:", data);
  }
}

run();
