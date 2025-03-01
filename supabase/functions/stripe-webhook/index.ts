
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

console.log("Stripe webhook function loaded")

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    // Get the stripe signature from the request headers
    const signature = req.headers.get('stripe-signature')
    
    if (!signature) {
      console.error('No Stripe signature found in request headers')
      return new Response(JSON.stringify({ error: 'No signature provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get the raw request body
    const body = await req.text()
    
    if (!body) {
      console.error('No request body')
      return new Response(JSON.stringify({ error: 'No request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // No need to verify the webhook signature in development to make debugging easier
    // In production, we should verify the signature with the Stripe webhook secret
    let event
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (stripeWebhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          stripeWebhookSecret
        )
      } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    } else {
      // If no webhook secret, just parse the event directly (for development)
      event = JSON.parse(body)
    }

    console.log(`Received Stripe webhook event: ${event.type}`)
    
    // Handle the event based on its type
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      case 'customer.subscription.trial_will_end':
        // This event is sent 3 days before the trial ends
        await handleTrialWillEnd(event.data.object)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object)
        break
      case 'trial_end':
      case 'charge.succeeded':
        // Handle successful payment after trial ends
        await handleChargeSucceeded(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleSubscriptionCreated(subscription) {
  console.log('Handling subscription created event')
  await updateSubscriptionInDb(subscription)
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Handling subscription updated event')
  console.log(`Subscription status: ${subscription.status}`)
  console.log(`Trial end: ${new Date(subscription.trial_end * 1000).toISOString()}`)
  
  // If the trial has ended and status is 'active', ensure the card is charged
  if (subscription.status === 'active' && subscription.trial_end && subscription.trial_end * 1000 <= Date.now()) {
    console.log('Trial has ended, subscription is now active')
  }
  
  // If the trial has ended and status is still 'trialing', something might be wrong
  if (subscription.status === 'trialing' && subscription.trial_end && subscription.trial_end * 1000 <= Date.now()) {
    console.log('Trial has ended but subscription is still in trialing state - may need manual intervention')
    
    // Attempt to retrieve the latest invoice and pay it if unpaid
    try {
      const invoices = await stripe.invoices.list({
        subscription: subscription.id,
        limit: 1,
      });
      
      if (invoices.data.length > 0) {
        const latestInvoice = invoices.data[0];
        if (latestInvoice.status === 'open') {
          console.log(`Attempting to pay open invoice: ${latestInvoice.id}`);
          await stripe.invoices.pay(latestInvoice.id);
        }
      }
    } catch (error) {
      console.error(`Error handling trial end payment: ${error.message}`);
    }
  }
  
  await updateSubscriptionInDb(subscription)
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Handling subscription deleted event')
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        is_subscribed: false,
        subscription_status: 'canceled',
        subscription_id: null,
        current_period_end: null,
      })
      .eq('subscription_id', subscription.id)
    
    if (error) {
      throw error
    }
    console.log('Successfully updated profile with canceled subscription')
  } catch (error) {
    console.error(`Error updating profile with canceled subscription: ${error.message}`)
  }
}

async function handleTrialWillEnd(subscription) {
  console.log('Handling trial will end event')
  // No immediate action needed, just log it
  console.log(`Trial for subscription ${subscription.id} will end soon`)
}

async function handleInvoicePaymentSucceeded(invoice) {
  console.log('Handling invoice payment succeeded event')
  
  if (!invoice.subscription) {
    console.log('No subscription associated with this invoice')
    return
  }
  
  try {
    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    
    // Update the subscription in the database
    await updateSubscriptionInDb(subscription)
    
    console.log(`Successfully processed payment for subscription: ${subscription.id}`)
  } catch (error) {
    console.error(`Error handling invoice payment succeeded: ${error.message}`)
  }
}

async function handleInvoicePaymentFailed(invoice) {
  console.log('Handling invoice payment failed event')
  
  if (!invoice.subscription) {
    console.log('No subscription associated with this invoice')
    return
  }
  
  try {
    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    
    // Update the status in the database
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'past_due',
      })
      .eq('subscription_id', subscription.id)
    
    if (error) {
      throw error
    }
    
    console.log(`Updated subscription status to past_due for: ${subscription.id}`)
  } catch (error) {
    console.error(`Error handling invoice payment failed: ${error.message}`)
  }
}

async function handleChargeSucceeded(charge) {
  console.log('Handling charge succeeded event')
  
  // If this is related to a subscription, update the subscription
  if (charge.invoice) {
    try {
      const invoice = await stripe.invoices.retrieve(charge.invoice)
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
        await updateSubscriptionInDb(subscription)
        console.log(`Updated subscription after charge: ${subscription.id}`)
      }
    } catch (error) {
      console.error(`Error handling charge succeeded: ${error.message}`)
    }
  }
}

async function updateSubscriptionInDb(subscription) {
  console.log(`Updating subscription in DB: ${subscription.id}`)
  console.log(`Customer ID: ${subscription.customer}`)
  console.log(`Status: ${subscription.status}`)
  console.log(`Current period end: ${new Date(subscription.current_period_end * 1000).toISOString()}`)
  
  try {
    // Find the user with this customer ID
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
    
    if (profilesError) {
      throw profilesError
    }
    
    if (!profiles || profiles.length === 0) {
      console.error(`No user found with customer ID: ${subscription.customer}`)
      return
    }
    
    // Determine if the subscription is active
    const isActive = ['active', 'trialing'].includes(subscription.status)
    
    // Update the user's subscription information
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_subscribed: isActive,
        subscription_status: subscription.status,
        subscription_id: subscription.id,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_end_date: subscription.trial_end 
          ? new Date(subscription.trial_end * 1000).toISOString() 
          : null
      })
      .eq('stripe_customer_id', subscription.customer)
    
    if (updateError) {
      throw updateError
    }
    
    console.log(`Successfully updated subscription for customer ${subscription.customer}`)
  } catch (error) {
    console.error(`Error updating subscription in database: ${error.message}`)
  }
}
