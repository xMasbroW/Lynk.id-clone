import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Edge function to ingest batched analytics safely without locking tables
serve(async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const { events } = await req.json()

    if (!events || !Array.isArray(events)) {
      throw new Error('Invalid events payload');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Filter out malformed events to ensure robust ingestion
    const validEvents = events.filter(e => e.event_type && e.trace_id).map(e => ({
      ...e,
      created_at: e.timestamp || new Date().toISOString()
    }));

    if (validEvents.length > 0) {
      // Dump straight into append-only table to prevent deadlocks
      const { error } = await supabaseClient.from('analytics_events').insert(validEvents);
      if (error) throw error;
    }

    return new Response(JSON.stringify({ success: true, ingested: validEvents.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
