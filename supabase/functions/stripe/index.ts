
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from "./stripe.ts"
import { createOrRetrieveCustomer } from "./utils.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { user_id, price_id } = await req.json()
    console.log(`Creating checkout session for user ${user_id} with price ${price_id}`)

    if (!user_id || !price_id) {
      const error = !user_id ? 'User ID is required' : 'Price ID is required'
      console.error(error)
      return new Response(
        JSON.stringify({ error }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Create or get customer
    const customer = await createOrRetrieveCustomer({ uuid: user_id })
    console.log('Customer:', customer.id)

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      metadata: {
        user_id,
      },
    })
    
    console.log('Session created:', session.id)
    return new Response(
      JSON.stringify({ sessionId: session.id }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    )
  } catch (error) {
    console.error('Stripe function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      }
    )
  }
})
