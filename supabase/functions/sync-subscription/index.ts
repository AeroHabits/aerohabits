
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripe.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Helper function to implement retry logic for Stripe API calls
async function retryStripeOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      lastError = error;
      
      // Only retry on network errors or 5xx responses
      if (!error.message.includes('network') && !error.message.includes('502') && !error.message.includes('503')) {
        throw error; // Don't retry on client errors
      }
      
      // Exponential backoff
      if (attempt < maxRetries) {
        const delay = Math.min(100 * Math.pow(2, attempt), 2000); // Max 2 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

// Function to handle restore purchases request
async function handleRestorePurchases(user, profileData) {
  console.log('Processing restore purchases request for user:', user.id);
  
  if (!profileData.stripe_customer_id) {
    return {
      restored: false, 
      message: 'No purchase history found to restore',
      updated: false
    };
  }
  
  try {
    // List all customer's subscriptions with retry
    const subscriptions = await retryStripeOperation(() => 
      stripe.subscriptions.list({
        customer: profileData.stripe_customer_id,
        status: 'all',
        limit: 100,
      })
    );
    
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
        
        return {
          restored: true,
          updated: true,
          status: activeSubscription.status
        };
      }
    }
    
    return {
      restored: false,
      updated: false,
      message: 'No active subscriptions found'
    };
  } catch (error) {
    console.error('Error retrieving customer subscriptions:', error);
    throw error;
  }
}

// Function to handle regular subscription sync
async function handleSubscriptionSync(user, profileData) {
  if (!profileData.subscription_id) {
    return {
      updated: false, 
      message: 'No subscription found to sync'
    };
  }

  try {
    // Fetch the subscription from Stripe with retry
    const subscription = await retryStripeOperation(() => 
      stripe.subscriptions.retrieve(profileData.subscription_id)
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

      return {
        updated: true,
        status: subscription.status
      };
    }
    
    return {
      updated: false,
      status: profileData.subscription_status
    };
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    
    // Handle the case where subscription doesn't exist in Stripe anymore
    if (error.code === 'resource_missing') {
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

      return {
        updated: true,
        status: 'canceled'
      };
    }
    
    throw error;
  }
}

serve(async (req) => {
  // CORS handling
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing sync-subscription request");
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '') || '';
    console.log("Auth header received:", authHeader ? "✓" : "✗");
    
    const { data, error } = await supabaseAdmin.auth.getUser(authHeader);
    const user = data?.user;

    if (error || !user) {
      console.error("Auth error:", error);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Authenticated user:", user.id);
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

    let result;
    
    // Handle restore purchases request or regular sync
    if (isRestoreRequest) {
      result = await handleRestorePurchases(user, profileData);
    } else {
      result = await handleSubscriptionSync(user, profileData);
    }

    console.log("Operation completed successfully:", result);
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in sync-subscription function:', error);
    
    // More detailed error information
    const errorDetails = {
      message: error.message,
      type: error.type || 'unknown',
      code: error.code || 'unknown',
      stack: error.stack?.split('\n').slice(0, 3).join('\n') || 'Not available'
    };
    console.error("Error details:", JSON.stringify(errorDetails));
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: errorDetails
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
