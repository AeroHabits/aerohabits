
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
      console.error('Validation error:', error)
      return new Response(
        JSON.stringify({ error }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Create or get customer
    console.log('Getting or creating customer...')
    const customer = await createOrRetrieveCustomer({ uuid: user_id })
    console.log('Customer retrieved/created:', customer.id)

    // Log stripe secret key configuration
    console.log('Stripe configuration:', {
      hasKey: !!Deno.env.get('STRIPE_SECRET_KEY'),
      keyType: Deno.env.get('STRIPE_SECRET_KEY')?.startsWith('sk_test') ? 'test' : 'live'
    })

    // Create checkout session
    console.log('Creating checkout session...')
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
    
    console.log('Session created successfully:', session.id)
    return new Response(
      JSON.stringify({ sessionId: session.id }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    )
  } catch (error) {
    console.error('Stripe function error:', error)
    // Add more detailed error logging
    if (error.type) {
      console.error('Stripe error type:', error.type)
    }
    if (error.raw) {
      console.error('Raw error:', error.raw)
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: error.type || 'unknown'
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      }
    )
  }
})
