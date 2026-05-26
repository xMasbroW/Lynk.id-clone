import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Simulated Node.js crypto for Edge
import { encodeHex } from "https://deno.land/std@0.208.0/encoding/hex.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { workspaceId, name } = await req.json()
    if (!workspaceId || !name) throw new Error('Missing parameters')

    // Generate secure random key
    const rawKey = `sk_live_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`

    // Hash key for storage using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(rawKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const keyHash = encodeHex(hashBuffer);

    // Bypassing RLS for secure insert since users shouldn't read arbitrary API key rows
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: keyRecord, error } = await adminClient
      .from('api_keys')
      .insert({
        workspace_id: workspaceId,
        key_hash: keyHash,
        name: name
      })
      .select('id, name, created_at')
      .single()

    if (error) throw error

    // Return the raw key ONLY ONCE.
    return new Response(JSON.stringify({ rawKey, keyRecord }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})
