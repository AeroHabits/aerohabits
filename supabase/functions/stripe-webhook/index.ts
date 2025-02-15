
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!endpointSecret) {
      throw new Error('Missing Stripe webhook secret');
    }

    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log('Processing Stripe webhook event:', event.type);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        // Get user_id from stripe metadata
        const { data: customerData } = await stripe.customers.retrieve(customerId);
        const userId = customerData.metadata.user_id;
        
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan_type: 'premium',
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
          });

        // Update user's premium status
        await supabaseAdmin
          .from('profiles')
          .update({ is_premium: true })
          .eq('id', userId);

        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        const canceledCustomerId = canceledSubscription.customer as string;
        
        // Update subscription status
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            current_period_end: new Date(canceledSubscription.current_period_end * 1000)
          })
          .eq('stripe_subscription_id', canceledSubscription.id);

        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: { message: err.message } }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
