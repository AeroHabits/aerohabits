import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get habits data from request
    const { habits } = await req.json();
    
    if (!habits || !Array.isArray(habits)) {
      throw new Error('Invalid habits data received');
    }

    // Prepare the habits data for analysis
    const totalHabits = habits.length;
    const completedHabits = habits.filter((h: any) => h.completed).length;
    const streaks = habits.map((h: any) => h.streak || 0);
    const avgStreak = streaks.reduce((a: number, b: number) => a + b, 0) / streaks.length || 0;
    const maxStreak = Math.max(...streaks);

    console.log('Analyzing habits:', { totalHabits, completedHabits, avgStreak, maxStreak });

    // Create a prompt for GPT
    const prompt = `As a habit tracking assistant, analyze this data about the user's habits:
    - Total Habits: ${totalHabits}
    - Completed Habits: ${completedHabits}
    - Average Streak: ${avgStreak.toFixed(1)}
    - Highest Streak: ${maxStreak}

    Provide a brief, encouraging analysis (max 2-3 sentences) of their progress. Focus on motivation and actionable insights.`;

    // Call OpenAI API with the updated model
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a supportive habit tracking assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const aiData = await openAIResponse.json();
    console.log('OpenAI response:', aiData);

    if (!aiData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    const analysis = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-habits function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});