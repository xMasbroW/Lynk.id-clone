import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    const { promptType, context } = await req.json()

    // Minimal token tracking setup
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) throw new Error('AI provider configuration missing.')

    let systemPrompt = "You are a helpful assistant.";
    if (promptType === 'BIO_GENERATION') {
        systemPrompt = "You are an expert personal branding copywriter. Based on the provided context, write a catchy, professional, and concise 160-character bio for a creator's link-in-bio page. Do not use hashtags. Be direct and engaging.";
    }

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Or gpt-4o depending on budget limits
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: context }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!openAiResponse.ok) {
       throw new Error(`Provider Error: ${openAiResponse.statusText}`);
    }

    const aiData = await openAiResponse.json();
    const resultText = aiData.choices?.[0]?.message?.content?.trim();

    return new Response(JSON.stringify({ result: resultText }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})
