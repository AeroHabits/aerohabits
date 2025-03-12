
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Add the OPTIONS method
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

  if (!supabaseUrl || !supabaseKey || !stripeSecretKey) {
    console.error('Missing required environment variables');
    return new Response(JSON.stringify({ error: 'Missing required environment variables' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2022-11-15',
  });

  try {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      console.error('No user found');
      return new Response(JSON.stringify({ error: 'No user found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id, is_subscribed, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(JSON.stringify({ error: 'Error fetching profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!profileData?.stripe_customer_id) {
      console.warn('Stripe customer ID not found for user:', user.id);
      return new Response(
        JSON.stringify({ message: 'Stripe customer ID not found, skipping sync' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: profileData.stripe_customer_id,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (!subscriptions.data.length) {
      console.warn('No subscriptions found for customer:', profileData.stripe_customer_id);
    }

    const subscription = subscriptions.data[0]; // Assuming one subscription per customer
    const subscriptionStatus = subscription ? subscription.status : null;
    const isSubscribed = subscription ? ['active', 'trialing'].includes(subscription.status) : false;
    const current_period_end = subscription ? new Date(subscription.current_period_end * 1000).toISOString() : null;
    const trial_end = subscription?.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;

    // Since we've removed the trial period functionality, we don't need to check if it was trialing
    const wasTrialing = false;

    const updatedData = {
      is_subscribed: isSubscribed,
      subscription_status: subscriptionStatus,
      current_period_end: current_period_end,
      trial_end_date: trial_end
    };

    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update(updatedData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return new Response(JSON.stringify({ error: 'Error updating profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const updated =
      profileData.is_subscribed !== isSubscribed ||
      profileData.subscription_status !== subscriptionStatus;

    // As we've removed the trial period, we don't need to send welcome emails here
    // We'll just sync the subscription status

    return new Response(
      JSON.stringify({
        message: 'Subscription status synced successfully',
        updated,
        status: subscriptionStatus,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error in sync-subscription function:', error);
    return new Response(JSON.stringify({ error: 'Failed to sync subscription' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
