// Edge function para criação segura de usuários
// Apenas ADMIN_GLOBAL ou Roles superiores podem invocar isto para criar inferiores.

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

    // 1. Obter usuário que fez a requisição
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Não autorizado')

    // 2. Buscar a role do solicitante
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role, federacao_id, associacao_id')
      .eq('id', user.id)
      .single()

    if (!profile) throw new Error('Perfil não encontrado')

    const { email, password, nome_completo, cpf, role_nova, federacao_id, associacao_id } = await req.json()

    // 3. Validação Hierárquica (RBAC Enforcement)
    if (profile.role === 'ASSOCIADO') {
      throw new Error('Associados não podem criar usuários')
    }

    if (profile.role === 'ASSOCIACOES' && role_nova !== 'ASSOCIADO') {
      throw new Error('Associações só podem criar associados')
    }

    if (profile.role === 'FEDERACAO' && (role_nova !== 'ASSOCIACAO' && role_nova !== 'ASSOCIADO')) {
      throw new Error('Federação não tem permissão para esta role')
    }

    // 4. Client com Service Role (Para bypass de criação no Auth, já que validamos a permissão antes)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 5. Criar usuário no Auth
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true
    })

    if (createError) throw createError

    // 6. Inserir no Profile da aplicação
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        role: role_nova,
        nome_completo: nome_completo,
        email: email,
        cpf: cpf,
        federacao_id: profile.role === 'ADMIN_GLOBAL' ? federacao_id : profile.federacao_id,
        associacao_id: profile.role === 'ADMIN_GLOBAL' ? associacao_id : profile.associacao_id
      })

    if (profileError) {
      // Rollback se falhar inserção no profile
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }

    return new Response(JSON.stringify({ success: true, user: authData.user }), {
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
