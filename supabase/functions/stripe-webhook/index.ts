import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  const signature = req.headers.get('stripe-signature')

  try {
    const body = await req.text()
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.client_reference_id

        await supabaseClient.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: session.customer,
          plan_id: 'pro', // Map this dynamically in a real app based on price ID
          status: 'active',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        await supabaseClient.from('subscriptions')
          .update({ status: 'canceled', plan_id: 'free' })
          .eq('stripe_subscription_id', subscription.id)

        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
