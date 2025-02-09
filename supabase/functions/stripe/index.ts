
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from "./stripe.ts"
import { createOrRetrieveCustomer } from "./utils.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, price_id } = await req.json()
    console.log('Processing checkout for user:', user_id, 'price:', price_id)

    if (!user_id) throw new Error('User ID is required')
    if (!price_id) throw new Error('Price ID is required')

    // Get or create customer with proper error handling
    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user_id,
      })
      console.log('Customer retrieved/created:', customer.id)
    } catch (error) {
      console.error('Error creating/retrieving customer:', error)
      throw error
    }

    // Create checkout session
    try {
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
        metadata: {
          user_id, // Add user_id to session metadata as well
        },
      })
      console.log('Checkout session created:', session.id)

      return new Response(JSON.stringify({ sessionId: session.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in stripe function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
