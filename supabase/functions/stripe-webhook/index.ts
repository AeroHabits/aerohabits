
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        const { client_reference_id } = await stripe.checkout.sessions.retrieve(
          subscription.metadata.session_id
        )

        // Update user's subscription status
        if (client_reference_id) {
          await supabaseAdmin
            .from('profiles')
            .update({
              is_subscribed: true,
              subscription_id: subscription.id,
              subscription_status: subscription.status,
            })
            .eq('id', client_reference_id)
        }
        break

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object
        // Update user's subscription status when canceled
        await supabaseAdmin
          .from('profiles')
          .update({
            is_subscribed: false,
            subscription_id: null,
            subscription_status: 'canceled',
          })
          .eq('subscription_id', canceledSubscription.id)
        break
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    )
  }
})
