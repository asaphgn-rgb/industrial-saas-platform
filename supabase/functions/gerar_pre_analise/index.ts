import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Não autorizado')

    const { associado_id, renda_familiar_bruta, compromissos_mensais } = await req.json()

    // Lógica Financeira (Conforme Prompt)
    // parcela_maxima_estimada = renda_familiar_bruta_mensal × 30% − compromissos_mensais_existentes
    
    let parcela_maxima = (renda_familiar_bruta * 0.3) - compromissos_mensais;
    if (parcela_maxima < 0) parcela_maxima = 0;

    let classificacao = 'REPROVADO';
    if (parcela_maxima > 1500) classificacao = 'PRE_APROVADO';
    else if (parcela_maxima > 500) classificacao = 'CREDITO_A_TRABALHAR';

    const texto_parecer = "Pré-aprovação interna Morar Bem Brasil, condicionada à validação documental, análise cadastral, avaliação do produto desejado, regras vigentes da instituição financeira/parceiro e aprovação final do agente financeiro.";

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: analise, error: insertError } = await supabaseAdmin
      .from('analises_credito')
      .insert({
        associado_id,
        renda_comprovada: renda_familiar_bruta,
        compromissos_mensais,
        parcela_maxima_estimada: parcela_maxima,
        classificacao,
        parecer_gerado: texto_parecer
      })
      .select()
      .single()

    if (insertError) throw insertError;

    // Disparar Notificação para Admin Global (Auditoria Automática)
    await supabaseAdmin.from('notificacoes_admin_global').insert({
      actor_id: user.id,
      title: 'Nova Pré-Análise Gerada',
      message: `Uma análise foi processada. Status: ${classificacao}`,
      type: 'INFO'
    });

    return new Response(JSON.stringify({ success: true, analise }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
