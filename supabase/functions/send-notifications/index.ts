
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
    const yesterdayDate = format(new Date(now.setDate(now.getDate() - 1)), 'yyyy-MM-dd')

    // If it's midnight (00:00), we should reset habits while preserving streaks
    if (currentHour === 0) {
      console.log("It's midnight! Resetting habits with streak preservation...")
      
      // Get habits completed yesterday to preserve streaks
      const { data: habitsToReset, error: fetchError } = await supabaseClient
        .from('habits')
        .select('id, streak, updated_at')
        .eq('completed', true)
        .lt('updated_at', `${todayDate}T00:00:00`);
      
      if (fetchError) {
        console.error("Error fetching habits to reset:", fetchError);
      } else {
        console.log(`Found ${habitsToReset?.length || 0} habits to reset`);
        
        // Process each habit to preserve streaks
        for (const habit of habitsToReset || []) {
          const lastUpdate = habit.updated_at ? new Date(habit.updated_at) : null;
          const lastUpdateDate = lastUpdate ? format(lastUpdate, 'yyyy-MM-dd') : null;
          
          // Check if the habit was completed yesterday (to maintain streak)
          const maintainStreak = lastUpdateDate === yesterdayDate;
          
          const { error } = await supabaseClient
            .from('habits')
            .update({ 
              completed: false,
              streak: maintainStreak ? habit.streak : 0,
              streak_broken: !maintainStreak && habit.streak > 0 ? true : false,
              last_streak: !maintainStreak && habit.streak > 0 ? habit.streak : null
            })
            .eq('id', habit.id);
          
          if (error) {
            console.error(`Error resetting habit ${habit.id}:`, error);
          }
        }
        
        console.log("Successfully reset habits with streak preservation");
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
