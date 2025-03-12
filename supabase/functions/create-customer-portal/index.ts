
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase credentials' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    
    // Get the requesting user
    const { data: { session }, error: authError } = await supabaseAdmin.auth.getSession();
    if (authError || !session) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    const { data: body } = await req.json();
    const returnUrl = body.returnUrl || 'https://yourapp.com/settings';
    
    // Get user profile to check if they have a Stripe customer ID
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, app_store_subscription_id')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('Error getting user profile:', profileError);
      return new Response(JSON.stringify({ error: 'Error retrieving user profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    // Check if subscription is from App Store
    if (profile.app_store_subscription_id) {
      console.log('User has App Store subscription');
      return new Response(JSON.stringify({ shouldUseAppStore: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    // No Stripe secret key or Stripe customer ID indicates we're in development or the user doesn't have a subscription
    if (!stripeSecretKey || !profile.stripe_customer_id) {
      console.log('Missing Stripe credentials or customer ID');
      return new Response(JSON.stringify({ error: 'Stripe not configured or no subscription found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
    });
    
    // Create a Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    });
    
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Error creating customer portal:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
