
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

    // Extract the JWT token and get the user ID
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid authorization token');
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

    // Get only the last 3 messages for context to reduce token usage even further
    const { data: history, error: historyError } = await supabaseAdmin
      .from('coaching_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (historyError) {
      throw historyError;
    }

    // Format messages for OpenAI with an even more concise system prompt
    const messages = [
      {
        role: 'system',
        content: 'You are a brief AI coach. Give short, clear habit advice.'
      },
      ...history.reverse().map(msg => ({
        role: msg.role,
        content: msg.content,
      }))
    ];

    console.log('Attempting OpenAI request with messages:', messages);

    // Call OpenAI API with minimal tokens and faster model
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',  // Using a more available model
        messages,
        temperature: 0.5,        // More focused responses
        max_tokens: 100,         // Further reduced token limit
        presence_penalty: 0.3,    // Less deviation in responses
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      console.error('OpenAI API error:', error);
      
      // Check for quota exceeded error
      if (error.error?.message?.includes('quota')) {
        console.error('Quota exceeded error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'The AI service is currently unavailable due to high demand. Please try again in a few minutes.'
          }),
          { 
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const aiResponse = await openAIResponse.json();
    const aiMessage = aiResponse.choices[0].message.content;

    console.log('Successfully received AI response:', aiMessage);

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
