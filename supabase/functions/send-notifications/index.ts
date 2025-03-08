
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
    const todayDate = format(now, 'yyyy-MM-dd')

    // If it's midnight (00:00), we should reset habit completion status only (not streaks)
    if (currentHour === 0) {
      console.log("It's midnight! Resetting habit completion status...")
      const { error: resetError } = await supabaseClient
        .from('habits')
        .update({ 
          completed: false,
          // We don't modify the streak here, just reset completion status
        })
        .eq('completed', true)
        .lt('updated_at', `${todayDate}T00:00:00`)
      
      if (resetError) {
        console.error("Error resetting habit completion status:", resetError)
      } else {
        console.log("Successfully reset habit completion status")
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
