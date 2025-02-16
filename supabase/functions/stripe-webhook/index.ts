
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@12.5.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')
    if (!webhookSecret) {
      throw new Error('Webhook secret is not configured')
    }

    // Get the raw body
    const body = await req.text()
    
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const { error } = await supabaseClient
          .from('profiles')
          .update({
            is_subscribed: subscription.status === 'active',
            subscription_status: subscription.status,
            subscription_id: subscription.id,
          })
          .eq('stripe_customer_id', subscription.customer)

        if (error) throw error
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const { error } = await supabaseClient
          .from('profiles')
          .update({
            is_subscribed: false,
            subscription_status: 'canceled',
            subscription_id: null,
          })
          .eq('stripe_customer_id', subscription.customer)

        if (error) throw error
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      `Webhook Error: ${error.message}`,
      { status: 400 }
    )
  }
})
