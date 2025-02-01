import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { habits, userId } = await req.json();
    
    // Create a system message that explains the context and purpose
    const systemMessage = `You are an AI Habit Coach, an expert in habit formation, behavior change, and personal development. 
    Analyze the user's habits and provide personalized, actionable insights. Be encouraging but realistic. 
    Focus on patterns, suggest improvements, and offer specific strategies for success. Keep responses concise and actionable.`;

    // Create a detailed analysis of the habits
    const habitAnalysis = habits.map(h => `
      Habit: ${h.title}
      Description: ${h.description || 'No description'}
      Current Streak: ${h.streak} days
      Status: ${h.completed ? 'Completed today' : 'Not completed today'}
    `).join('\n');

    const userMessage = `Please analyze these habits and provide personalized coaching:
    ${habitAnalysis}
    
    Focus on:
    1. Pattern recognition
    2. Specific improvement suggestions
    3. One key action item for today
    4. Words of encouragement`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const coaching = data.choices[0].message.content;

    return new Response(JSON.stringify({ coaching }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in habit-coach function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});