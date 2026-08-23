const fs = require('fs');

async function run() {
  const { createClient } = require('@supabase/supabase-js');
  const SUPABASE_URL = "https://ujttkjvxxljonqepglae.supabase.co";
  const SUPABASE_KEY = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA";
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const tables = ['unidades_medida', 'centros_custo', 'depositos', 'clientes', 'fornecedores', 'produtos', 'materias_primas'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`ERRO NA TABELA ${table}:`, error.message);
    } else {
      console.log(`OK: Tabela ${table} criada com sucesso e acessível pelo Vercel!`);
    }
  }
}

run();
