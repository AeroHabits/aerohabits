
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Get user ID from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Store user message in the database
    const { data: userMessage, error: userMessageError } = await supabaseAdmin
      .from('coaching_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message,
      })
      .select()
      .single();

    if (userMessageError) {
      throw userMessageError;
    }

    // Get conversation history
    const { data: history, error: historyError } = await supabaseAdmin
      .from('coaching_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (historyError) {
      throw historyError;
    }

    // Format messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are an AI life coach focusing on helping users develop better habits and achieve their goals. Your responses should be:
        1. Empathetic and understanding
        2. Focused on actionable advice
        3. Encouraging and positive
        4. Concise but comprehensive
        
        You have access to the user's conversation history to provide contextual advice.`
      },
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content,
      }))
    ];

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const aiResponse = await openAIResponse.json();
    const aiMessage = aiResponse.choices[0].message.content;

    // Store AI response in the database
    const { data: storedAiMessage, error: aiMessageError } = await supabaseAdmin
      .from('coaching_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiMessage,
      })
      .select()
      .single();

    if (aiMessageError) {
      throw aiMessageError;
    }

    return new Response(
      JSON.stringify({ message: storedAiMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-coach function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
