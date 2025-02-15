
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@12.5.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') ?? ''
    )

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
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

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        const { error: deleteError } = await supabaseClient
          .from('profiles')
          .update({
            is_subscribed: false,
            subscription_status: 'canceled',
            subscription_id: null,
          })
          .eq('stripe_customer_id', deletedSubscription.customer)

        if (deleteError) throw deleteError
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      `Webhook Error: ${err.message}`,
      { status: 400 }
    )
  }
})
