
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Processing customer portal request');
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Auth token received, getting user');
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error('Authentication error:', userError?.message || 'User not found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated, user ID:', user.id);
    
    // Get user's subscription information from profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, app_store_subscription_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
      return new Response(
        JSON.stringify({ error: 'Error fetching profile', details: profileError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!profile?.subscription_status || profile.subscription_status === 'inactive') {
      console.error('No active subscription found for user');
      return new Response(
        JSON.stringify({ error: 'No active subscription found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For iOS subscriptions, we need to return a response instructing the app to open 
    // the App Store subscription management page
    console.log('Returning App Store subscription management URL');
    return new Response(
      JSON.stringify({ 
        shouldUseAppStore: true,
        message: "Please manage your subscription through App Store Settings"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error handling customer portal request:', error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process subscription management request', 
        details: error.message,
        stack: error.stack
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
