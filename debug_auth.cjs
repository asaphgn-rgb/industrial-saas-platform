const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ujttkjvxxljonqepglae.supabase.co";
const supabaseAnonKey = "sb_publishable_vd4vwvZg0Pk1WniViBOdFw_1ALig3hA";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'ceo@flechabsb.com',
    password: 'ceovault'
  });
  
  if (error) {
     console.log("Error details:", error.message, error.name, error.status);
  } else {
     console.log("Login success! ID:", data.user.id);
  }
}

testAuth();
