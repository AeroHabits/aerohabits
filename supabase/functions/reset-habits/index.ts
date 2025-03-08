
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

    console.log('Starting habits reset process at midnight...')
    
    // Get today's date formatted as yyyy-MM-dd
    const today = format(new Date(), 'yyyy-MM-dd')
    console.log(`Today's date: ${today}`)

    // Reset only habits that were completed yesterday or earlier, but preserve streak data
    const { data: habitsToReset, error: fetchError } = await supabaseClient
      .from('habits')
      .select('id, streak, updated_at')
      .eq('completed', true)
      .lt('updated_at', `${today}T00:00:00`);
    
    if (fetchError) throw fetchError;
    
    console.log(`Found ${habitsToReset?.length || 0} habits to reset`);
    
    // Process each habit individually to preserve streak data
    const updatePromises = habitsToReset?.map(async (habit) => {
      // Get the habit's last update date
      const lastUpdate = habit.updated_at ? new Date(habit.updated_at) : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      // Check if streak should be maintained (if completed yesterday)
      // This extra logic ensures streaks are only broken if a day is missed
      const maintainStreak = lastUpdate && 
        lastUpdate.getDate() === yesterday.getDate() &&
        lastUpdate.getMonth() === yesterday.getMonth() &&
        lastUpdate.getFullYear() === yesterday.getFullYear();
      
      return supabaseClient
        .from('habits')
        .update({ 
          completed: false,
          // Only preserve streak if the habit was completed yesterday
          streak: maintainStreak ? habit.streak : 0,
          // If streak is broken, mark it as such
          streak_broken: !maintainStreak && habit.streak > 0 ? true : false,
          // Store the last streak value for reference
          last_streak: !maintainStreak && habit.streak > 0 ? habit.streak : null
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
