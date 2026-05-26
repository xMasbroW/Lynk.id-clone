// Edge function to securely process emails off the main client thread
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const { to, templateId, templateData } = await req.json()

    // TODO: Integrate SendGrid, Resend, or AWS SES here
    console.log(`[Email Queue] Sending ${templateId} to ${to}`)

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
