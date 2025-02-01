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
    const { habits } = await req.json();
    
    if (!habits || !Array.isArray(habits)) {
      console.error('Invalid habits data received:', habits);
      throw new Error('Invalid habits data');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a detailed analysis of the habits
    const habitAnalysis = habits.map(h => `
      Habit: ${h.title}
      Description: ${h.description || 'No description'}
      Current Streak: ${h.streak} days
      Status: ${h.completed ? 'Completed today' : 'Not completed today'}
    `).join('\n');

    console.log('Sending request to OpenAI with habits:', habits.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI Habit Coach, an expert in habit formation, behavior change, and personal development. 
            Analyze the user's habits and provide personalized, actionable insights. Be encouraging but realistic. 
            Focus on patterns, suggest improvements, and offer specific strategies for success. Keep responses concise and actionable.`
          },
          {
            role: 'user',
            content: `Please analyze these habits and provide personalized coaching:
            ${habitAnalysis}
            
            Focus on:
            1. Pattern recognition
            2. Specific improvement suggestions
            3. One key action item for today
            4. Words of encouragement`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response received:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response from OpenAI:', data);
      throw new Error('Invalid response from OpenAI');
    }

    const coaching = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ coaching }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in habit-coach function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing your request'
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});