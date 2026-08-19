import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, success } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch current attempts
    const { data: attemptData } = await supabaseAdmin
      .from("security_login_attempts")
      .select("*")
      .eq("email", email)
      .single();

    if (success) {
      // If successful login, reset attempts
      if (attemptData) {
        await supabaseAdmin
          .from("security_login_attempts")
          .update({ failed_attempts: 0, is_locked: false })
          .eq("email", email);
      }
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Failed login attempt
      if (attemptData) {
        const newAttempts = attemptData.failed_attempts + 1;
        const isLocked = newAttempts >= 2;

        await supabaseAdmin
          .from("security_login_attempts")
          .update({ 
            failed_attempts: newAttempts,
            is_locked: isLocked,
            locked_at: isLocked ? new Date().toISOString() : null,
            last_attempt_at: new Date().toISOString()
          })
          .eq("email", email);

        if (isLocked) {
           return new Response(JSON.stringify({ error: "ACCOUNT_LOCKED", message: "Maximum attempts reached. Account locked and local data wipe initiated." }), {
             status: 403,
             headers: { ...corsHeaders, "Content-Type": "application/json" },
           });
        }
      } else {
        await supabaseAdmin
          .from("security_login_attempts")
          .insert([{ email, failed_attempts: 1 }]);
      }

      return new Response(JSON.stringify({ error: "INVALID_CREDENTIALS" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
