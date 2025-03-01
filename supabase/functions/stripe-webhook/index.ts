
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from "../_shared/stripe.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    console.error('No Stripe signature found');
    return new Response(JSON.stringify({ error: 'No signature' }), { 
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  
  try {
    const body = await req.text();
    console.log(`Received webhook event with signature: ${signature.slice(0, 20)}...`);
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log(`Webhook event type: ${event.type}`);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        console.log(`Processing subscription update: ${subscription.id}, status: ${subscription.status}`);
        
        // Get the Supabase user ID from the subscription metadata
        const userId = subscription.metadata?.supabase_user_id;
        console.log(`User ID from metadata: ${userId}`);

        if (userId) {
          console.log(`Updating profile for user ${userId}`);
          const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({
              is_subscribed: subscription.status === 'active' || subscription.status === 'trialing',
              subscription_id: subscription.id,
              subscription_status: subscription.status,
              trial_end_date: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null
            })
            .eq('id', userId)
            .select();
            
          if (error) {
            console.error(`Error updating user profile: ${error.message}`);
          } else {
            console.log(`Successfully updated profile: ${JSON.stringify(data)}`);
          }
        } else {
          console.error('No user ID found in subscription metadata');
        }
        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        console.log(`Processing subscription cancellation: ${canceledSubscription.id}`);
        
        // Update user's subscription status when canceled
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
            is_subscribed: false,
            subscription_id: null,
            subscription_status: 'canceled',
            trial_end_date: null,
            current_period_end: null
          })
          .eq('subscription_id', canceledSubscription.id);
          
        if (error) {
          console.error(`Error updating canceled subscription: ${error.message}`);
        } else {
          console.log('Successfully updated profile for canceled subscription');
        }
        break;
        
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log(`Payment succeeded for invoice: ${invoice.id}`);
        
        if (invoice.subscription) {
          // Update payment status in the database
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: 'active',
              last_payment_date: new Date().toISOString()
            })
            .eq('subscription_id', invoice.subscription);
            
          if (error) {
            console.error(`Error updating payment status: ${error.message}`);
          }
        }
        break;
        
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log(`Payment failed for invoice: ${failedInvoice.id}`);
        
        if (failedInvoice.subscription) {
          // Update payment status in the database
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: 'past_due'
            })
            .eq('subscription_id', failedInvoice.subscription);
            
          if (error) {
            console.error(`Error updating failed payment status: ${error.message}`);
          }
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(
      JSON.stringify({ error: `Webhook handler failed: ${err.message}` }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
