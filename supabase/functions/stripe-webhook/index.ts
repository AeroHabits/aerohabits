
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from "../stripe/stripe.ts"
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts"

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  
  if (!signature || !webhookSecret) {
    return new Response('Webhook signature or secret missing', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        {
          const subscription = event.data.object
          const customerId = subscription.customer as string
          const { data: customer } = await stripe.customers.retrieve(customerId)
          const userId = customer.metadata.supabaseUUID

          await supabaseAdmin
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              plan_type: 'premium',
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
        }
        break

      case 'customer.subscription.deleted':
        {
          const subscription = event.data.object
          const customerId = subscription.customer as string
          const { data: customer } = await stripe.customers.retrieve(customerId)
          const userId = customer.metadata.supabaseUUID

          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'canceled',
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id)
        }
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
