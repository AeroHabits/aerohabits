
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    // Get the user's ID from Supabase Auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Error fetching user')
    }

    console.log(`Syncing subscription for user: ${user.id}`)

    // Get customer ID from profiles
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id, subscription_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profileData?.stripe_customer_id) {
      throw new Error('Could not find Stripe customer ID')
    }

    const customerId = profileData.stripe_customer_id
    const subscriptionId = profileData.subscription_id

    console.log(`Found customer ID: ${customerId} and subscription ID: ${subscriptionId}`)

    // If we have a subscription ID, fetch the subscription from Stripe
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      console.log(`Subscription status: ${subscription.status}`)

      // Update the user's profile with the latest subscription data
      await supabaseClient
        .from('profiles')
        .update({
          is_subscribed: subscription.status === 'active' || subscription.status === 'trialing',
          subscription_status: subscription.status,
          trial_end_date: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null
        })
        .eq('id', user.id)

      console.log('Profile updated with latest subscription data')

      return new Response(
        JSON.stringify({ 
          success: true, 
          status: subscription.status,
          trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        },
      )
    } else {
      // No subscription ID found
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No subscription found for this user' 
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        },
      )
    }
  } catch (error) {
    console.error('Error syncing subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    )
  }
})
