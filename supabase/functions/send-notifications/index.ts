
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { format } from "https://esm.sh/date-fns@3.3.1"

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current time in UTC
    const now = new Date()
    const currentHour = now.getUTCHours()

    // If it's midnight (00:00), call the reset-habits function
    if (currentHour === 0) {
      console.log("It's midnight! Calling the reset-habits function...")
      
      try {
        const resetResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/reset-habits`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!resetResponse.ok) {
          throw new Error(`Reset habits function failed with status: ${resetResponse.status}`);
        }
        
        const resetResult = await resetResponse.json();
        console.log("Reset habits result:", resetResult);
      } catch (resetError) {
        console.error("Error calling reset-habits function:", resetError);
      }
    }

    // Continue with normal notification logic
    const { data: notifications, error: notificationsError } = await supabaseClient
      .from('habit_notifications')
      .select(`
        *,
        habits:habit_id (title, description),
        profiles:user_id (email)
      `)
      .eq('is_enabled', true)
      .filter('EXTRACT(HOUR FROM reminder_time)', 'eq', currentHour)

    if (notificationsError) throw notificationsError

    console.log(`Sending ${notifications?.length ?? 0} notifications`)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        count: notifications?.length ?? 0,
        resetPerformed: currentHour === 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
