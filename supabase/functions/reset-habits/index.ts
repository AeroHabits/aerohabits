
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { format, isYesterday } from 'https://esm.sh/date-fns@3.3.1'

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

    console.log('Starting habits reset process at midnight...')
    
    // Get today's date formatted as yyyy-MM-dd
    const today = format(new Date(), 'yyyy-MM-dd')
    console.log(`Today's date: ${today}`)

    // Reset only habits that were completed yesterday or earlier
    // But preserve streak data for habits completed yesterday
    const { data: habitsToReset, error: fetchError } = await supabaseClient
      .from('habits')
      .select('id, streak, updated_at')
      .eq('completed', true)
      .lt('updated_at', `${today}T00:00:00`);
    
    if (fetchError) throw fetchError;
    
    console.log(`Found ${habitsToReset?.length || 0} habits to reset`);
    
    // Process each habit individually to preserve streak data
    const updatePromises = habitsToReset?.map(async (habit) => {
      // Check if the habit was completed yesterday to preserve streak
      const lastUpdate = habit.updated_at ? new Date(habit.updated_at) : null;
      const wasCompletedYesterday = lastUpdate && isYesterday(lastUpdate);
      
      return supabaseClient
        .from('habits')
        .update({ 
          completed: false,
          // Preserve streak if completed yesterday, otherwise reset
          streak: wasCompletedYesterday ? habit.streak : 0,
          // If streak is broken (not completed yesterday), mark it
          streak_broken: !wasCompletedYesterday && habit.streak > 0 ? true : false,
          // Store the last streak value for reference
          last_streak: !wasCompletedYesterday && habit.streak > 0 ? habit.streak : null
        })
        .eq('id', habit.id);
    }) || [];
    
    await Promise.all(updatePromises);

    console.log(`Successfully reset ${habitsToReset?.length || 0} habits`);

    return new Response(
      JSON.stringify({ 
        message: 'Habits reset successfully', 
        count: habitsToReset?.length || 0
      }),
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
