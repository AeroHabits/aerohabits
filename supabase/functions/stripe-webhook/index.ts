
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from "../_shared/stripe.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  
  try {
    const body = await req.text()
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature ?? '', webhookSecret)
    } catch (err) {
      console.error(`Webhook signature verification failed.`, err.message)
      return new Response(JSON.stringify({ error: `Webhook Error` }), { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        
        // Get the Supabase user ID from the subscription metadata
        const userId = subscription.metadata?.supabase_user_id

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              is_subscribed: subscription.status === 'active' || subscription.status === 'trialing',
              subscription_id: subscription.id,
              subscription_status: subscription.status,
            })
            .eq('id', userId)
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

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error(`Webhook Error:`, err.message)
    return new Response(
      JSON.stringify({ error: `Webhook handler failed` }),
      { status: 400 }
    )
  }
})
