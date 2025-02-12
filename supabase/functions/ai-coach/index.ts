
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
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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

    // Get only the last 2 messages for context to minimize token usage
    const { data: history, error: historyError } = await supabaseAdmin
      .from('coaching_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(2);

    if (historyError) {
      throw historyError;
    }

    // Format messages for OpenAI with an extremely concise system prompt
    const messages = [
      {
        role: 'system',
        content: 'Give brief habit advice in 2-3 sentences.'
      },
      ...history.reverse().map(msg => ({
        role: msg.role,
        content: msg.content,
      }))
    ];

    console.log('Starting OpenAI request...');
    
    try {
      // Call OpenAI API with absolute minimal settings
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.3,        // Very focused responses
          max_tokens: 75,          // Very short responses
          presence_penalty: 0.0,    // No creativity needed
          frequency_penalty: 0.0,   // Simple responses are fine
        }),
      });

      if (!openAIResponse.ok) {
        const error = await openAIResponse.json();
        console.error('OpenAI API error details:', error);
        
        if (error.error?.type === 'insufficient_quota' || error.error?.code === 'rate_limit_exceeded') {
          return new Response(
            JSON.stringify({ 
              error: 'The AI service is temporarily unavailable. Please try again in a few minutes.'
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

      console.log('Successfully received AI response');

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

    } catch (openAIError) {
      console.error('OpenAI specific error:', openAIError);
      throw openAIError;
    }

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
