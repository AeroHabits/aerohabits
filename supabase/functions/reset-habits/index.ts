
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { format } from 'https://esm.sh/date-fns@3.3.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting habits reset process...')
    
    // Get today's date formatted as yyyy-MM-dd
    const today = format(new Date(), 'yyyy-MM-dd')
    console.log(`Today's date: ${today}`)

    // Only reset completion status, not streaks
    const { error, count } = await supabaseClient
      .from('habits')
      .update({ 
        completed: false,
        // Important: updated_at should NOT be changed to preserve streak calculation logic
        updated_at: new Date().toISOString() 
      })
      .eq('completed', true)

    if (error) {
      console.error('Error resetting habits:', error)
      throw error
    }

    console.log(`Successfully reset completion status for ${count} habits`)

    return new Response(
      JSON.stringify({ message: 'Habits reset successfully', count }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error resetting habits:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
