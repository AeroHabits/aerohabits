
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno'

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// Initialize Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Sync subscription function loaded")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    // Get the user from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Error fetching user')
    }
    
    console.log(`Syncing subscription for user: ${user.id}`)
    
    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, subscription_id, trial_end_date')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile) {
      throw new Error('Error fetching profile')
    }
    
    const { stripe_customer_id, subscription_id, trial_end_date } = profile
    
    // If user has no subscription, return early
    if (!subscription_id) {
      console.log('User has no subscription')
      return new Response(
        JSON.stringify({ 
          message: 'No subscription found for this user',
          updated: false
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }
    
    // Get the latest subscription information from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscription_id)
    console.log(`Retrieved subscription from Stripe: ${subscription.id}`)
    console.log(`Status: ${subscription.status}`)
    
    // Handle trial that has ended but hasn't converted to active
    if (subscription.status === 'trialing' && 
        trial_end_date && 
        new Date(trial_end_date) <= new Date()) {
      
      console.log('Trial has ended but subscription is still in trialing state')
      
      // Check for any unpaid invoices and try to pay them
      const invoices = await stripe.invoices.list({
        subscription: subscription_id,
        status: 'open',
        limit: 1
      })
      
      if (invoices.data.length > 0) {
        console.log(`Found open invoice: ${invoices.data[0].id}, attempting to pay`)
        try {
          await stripe.invoices.pay(invoices.data[0].id)
          console.log('Successfully paid invoice')
          
          // Refresh the subscription
          const updatedSubscription = await stripe.subscriptions.retrieve(subscription_id)
          
          // Update the user's subscription in the database
          await updateSubscriptionInDatabase(user.id, updatedSubscription)
          
          return new Response(
            JSON.stringify({ 
              message: 'Paid pending invoice and updated subscription',
              updated: true,
              status: updatedSubscription.status
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )
        } catch (invoiceError) {
          console.error(`Error paying invoice: ${invoiceError.message}`)
        }
      } else {
        // If there's no open invoice, create one
        console.log('No open invoice found, creating a new invoice for immediate payment')
        try {
          const invoice = await stripe.invoices.create({
            customer: stripe_customer_id,
            subscription: subscription_id,
            auto_advance: true  // automatically finalize and pay the invoice
          })
          
          console.log(`Created new invoice: ${invoice.id}`)
          
          // Finalize and pay the invoice
          await stripe.invoices.finalizeInvoice(invoice.id)
          await stripe.invoices.pay(invoice.id)
          
          console.log('Successfully paid new invoice')
          
          // Refresh the subscription
          const updatedSubscription = await stripe.subscriptions.retrieve(subscription_id)
          
          // Update the user's subscription in the database
          await updateSubscriptionInDatabase(user.id, updatedSubscription)
          
          return new Response(
            JSON.stringify({
              message: 'Created and paid new invoice, updated subscription',
              updated: true,
              status: updatedSubscription.status
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )
        } catch (createInvoiceError) {
          console.error(`Error creating/paying invoice: ${createInvoiceError.message}`)
        }
      }
    }
    
    // Regular sync - update subscription in database
    await updateSubscriptionInDatabase(user.id, subscription)
    
    return new Response(
      JSON.stringify({
        message: 'Subscription synced successfully',
        updated: true,
        status: subscription.status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error(`Error syncing subscription: ${error.message}`)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function updateSubscriptionInDatabase(userId, subscription) {
  console.log(`Updating subscription in database for user: ${userId}`)
  
  // Determine if the subscription is active
  const isActive = ['active', 'trialing'].includes(subscription.status)
  
  // Update the user's subscription information
  const { error } = await supabase
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
    .eq('id', userId)
  
  if (error) {
    console.error(`Error updating profile: ${error.message}`)
    throw error
  }
  
  console.log('Successfully updated profile')
}
