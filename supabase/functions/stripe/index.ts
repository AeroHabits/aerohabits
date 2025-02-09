
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from "./stripe.ts"
import { createOrRetrieveCustomer } from "./utils.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts"

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { user_id, price_id } = await req.json()
    console.log('Processing checkout for user:', user_id, 'price:', price_id)

    // Validate required fields
    if (!user_id) throw new Error('User ID is required')
    if (!price_id) throw new Error('Price ID is required')

    // Get or create customer
    let customer;
    try {
      customer = await createOrRetrieveCustomer({ uuid: user_id })
      console.log('Customer retrieved/created:', customer.id)
    } catch (error) {
      console.error('Error creating/retrieving customer:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Create checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: price_id, quantity: 1 }],
        success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/pricing`,
        subscription_data: {
          metadata: { user_id },
        },
        metadata: { user_id },
      })
      
      console.log('Checkout session created:', session.id)
      return new Response(JSON.stringify({ sessionId: session.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
  } catch (error) {
    console.error('Error in stripe function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
