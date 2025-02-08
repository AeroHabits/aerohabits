
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from "./stripe.ts"
import { createOrRetrieveCustomer } from "./utils.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, price_id } = await req.json()

    // Get or create customer
    const customer = await createOrRetrieveCustomer({
      uuid: user_id,
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      subscription_data: {
        metadata: {
          user_id,
        },
      },
    })

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
