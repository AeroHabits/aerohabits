
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripe.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // CORS handling
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data: { user } } = await supabaseAdmin.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body or use an empty object if not provided
    const requestData = req.method === 'POST' ? await req.json() : {};
    const isRestoreRequest = requestData.restore === true;

    // Get profile data to check if stripe customer exists
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, subscription_id, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile data:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize variables
    let status = profileData.subscription_status;
    let subscriptionId = profileData.subscription_id;
    let updatedProfile = false;
    let restoredPurchase = false;

    // Handle restore purchases request (Apple App Store requirement)
    if (isRestoreRequest) {
      console.log('Processing restore purchases request for user:', user.id);
      
      if (!profileData.stripe_customer_id) {
        return new Response(
          JSON.stringify({ 
            restored: false, 
            message: 'No purchase history found to restore' 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // For real iOS apps, this would validate receipts with Apple's servers
      // For Stripe, we check if the customer has any active subscriptions
      
      try {
        // List all customer's subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: profileData.stripe_customer_id,
          status: 'all',
          limit: 100,
        });
        
        if (subscriptions.data.length > 0) {
          // Find the most recent active or past_due subscription
          const activeSubscription = subscriptions.data.find(
            sub => ['active', 'trialing', 'past_due'].includes(sub.status)
          );
          
          if (activeSubscription) {
            // Update the profile with the active subscription
            const { error: updateError } = await supabaseAdmin
              .from('profiles')
              .update({
                is_subscribed: true,
                subscription_status: activeSubscription.status,
                subscription_id: activeSubscription.id,
                current_period_end: new Date(activeSubscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id);
              
            if (updateError) {
              throw updateError;
            }
            
            status = activeSubscription.status;
            subscriptionId = activeSubscription.id;
            updatedProfile = true;
            restoredPurchase = true;
          } else {
            // No active subscriptions found
            console.log('No active subscriptions found for customer:', profileData.stripe_customer_id);
          }
        } else {
          console.log('No subscriptions found for customer:', profileData.stripe_customer_id);
        }
      } catch (stripeError) {
        console.error('Error retrieving customer subscriptions:', stripeError);
        throw stripeError;
      }
      
      return new Response(
        JSON.stringify({ 
          restored: restoredPurchase, 
          updated: updatedProfile,
          status: status
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Regular subscription sync logic (non-restore flow)
    if (!profileData.subscription_id) {
      return new Response(
        JSON.stringify({ 
          updated: false, 
          message: 'No subscription found to sync' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch the subscription from Stripe
    try {
      const subscription = await stripe.subscriptions.retrieve(
        profileData.subscription_id
      );

      if (subscription.status !== profileData.subscription_status) {
        // Update user profile with current subscription status
        const isSubscribed = ['active', 'trialing'].includes(subscription.status);
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            is_subscribed: isSubscribed,
            subscription_status: subscription.status,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          throw updateError;
        }

        status = subscription.status;
        updatedProfile = true;
      }
    } catch (stripeError) {
      console.error('Error retrieving subscription:', stripeError);
      
      // Handle the case where subscription doesn't exist in Stripe anymore
      if (stripeError.code === 'resource_missing') {
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            is_subscribed: false,
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          throw updateError;
        }

        status = 'canceled';
        updatedProfile = true;
      } else {
        throw stripeError;
      }
    }

    return new Response(
      JSON.stringify({ 
        updated: updatedProfile, 
        status: status,
        restored: restoredPurchase
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in sync-subscription function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
