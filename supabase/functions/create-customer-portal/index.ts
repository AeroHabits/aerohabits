
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { stripe } from "../_shared/stripe.ts"
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
    
    // Get user's Stripe customer ID from profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
      return new Response(
        JSON.stringify({ error: 'Error fetching profile', details: profileError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!profile?.stripe_customer_id) {
      console.error('No Stripe customer ID found for user');
      return new Response(
        JSON.stringify({ error: 'No subscription found. User does not have a Stripe customer ID.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating portal session for customer:', profile.stripe_customer_id);
    
    // Get returnUrl from request body
    const { returnUrl } = await req.json();
    const validReturnUrl = returnUrl || `${req.headers.get('Origin') || ''}/settings`;
    
    // Create customer portal session
    console.log('Return URL:', validReturnUrl);
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: validReturnUrl,
    });

    console.log('Portal session created successfully');
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating customer portal session:', error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create customer portal session', 
        details: error.message,
        stack: error.stack
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
