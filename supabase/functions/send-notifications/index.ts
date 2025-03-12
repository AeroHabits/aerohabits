import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

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

    // Fetch notifications that should be sent at this hour
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

    // Send notifications (for now, just log them)
    console.log(`Sending ${notifications?.length ?? 0} notifications`)
    
    // In a real implementation, you would integrate with a notification service here
    // For example, using web push notifications or email

    return new Response(
      JSON.stringify({ success: true, count: notifications?.length ?? 0 }),
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